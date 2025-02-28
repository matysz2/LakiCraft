import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LacquerHeaderShop from "./LacquerHeaderShop";

const ProductsByBrand = () => {
  const { userId, brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Liczba unikalnych produktów w koszyku
  const [showQuantityPrompt, setShowQuantityPrompt] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/products/${userId}/${brand}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd serwera");
        }
        return response.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => {
        setError(error.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [userId, brand, navigate]);

  // Pobieranie koszyka z localStorage
  useEffect(() => {
    const updateCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(savedCart);
      setCartCount(savedCart.length); // Liczba unikalnych produktów
    };

    updateCart();

    // Nasłuchiwanie zmian w localStorage
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const isProductInCart = (productId) => cart.some(item => item.id === productId);

  const handleAddToCart = (product) => {
    if (isProductInCart(product.id)) {
      alert("Ten produkt jest już w koszyku!");
      return;
    }
    setSelectedProduct(product);
    setShowQuantityPrompt(true);
  };

  const updateCart = (product, quantity) => {
    const updatedCart = [...cart, { ...product, quantity }];
    setCart(updatedCart);
    setCartCount(updatedCart.length); // Aktualizacja licznika produktów
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Ręczne wywołanie eventu storage, aby inne komponenty się odświeżyły
    window.dispatchEvent(new Event("storage"));
    setShowQuantityPrompt(false);
  };

  const handleQuantityChange = (event) => {
    let value = Number(event.target.value);
  
    if (value > selectedProduct.stock) {
      value = selectedProduct.stock;
    } else if (value < 1) {
      value = 1;
    }
  
    setQuantity(value);
  };
  
  const handleQuantitySubmit = () => {
    if (quantity > 0 && quantity <= selectedProduct.stock) {
      updateCart(selectedProduct, quantity);
  
      // Zmniejszenie dostępnej ilości w stanie produktów
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, stock: product.stock - quantity }
            : product
        )
      );
  
      setQuantity(1); // Reset inputa po dodaniu
    } else {
      alert(`Wprowadź prawidłową ilość (1 - ${selectedProduct.stock})`);
    }
  };
  
  const handleRemoveFromCart = (productId) => {
    const removedProduct = cart.find((item) => item.id === productId);
    if (!removedProduct) return;
  
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // Przywrócenie stocka w stanie produktów
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === removedProduct.id
          ? { ...product, stock: product.stock + removedProduct.quantity }
          : product
      )
    );
  
    window.dispatchEvent(new Event("storage"));
  };
  
  const uniqueUserNames = [...new Set(products.map(product => product.user.name))];
  console.log(uniqueUserNames); // ["Alfa"]

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="products-by-brand">
      <LacquerHeaderShop cartCount={cartCount} /> {/* Przekazywanie liczby produktów */}
      <h2>Produkty marki {brand} sprzedawcy {uniqueUserNames}</h2>
      <div className="products-list">
        {error ? (
          <p>Wystąpił błąd: {error}</p>
        ) : products.length === 0 ? (
          <p>Brak produktów w tej marce.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.imagePath && (
                <img src={`http://localhost:8080/${product.imagePath}`} alt={product.name} className="product-image" />
              )}
              <p className="product-code">Kod: {product.kod}</p>
              <p className="product-name">{product.name}</p>
              <p className="product-stock">Dostępność: {product.stock} szt.</p>
              <p className="product-packaging">Opakowanie: {product.packaging} L</p>
              <p className="product-price">{product.price} PLN</p>
              <button
                className={`add-to-cart-btn ${isProductInCart(product.id) ? 'in-cart' : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={isProductInCart(product.id)}
              >
                {isProductInCart(product.id) ? "Produkt w koszyku" : "Dodaj do koszyka"}
              </button>
            </div>
          ))
        )}
      </div>

      {showQuantityPrompt && (
        <div className="quantity-prompt">
          <div className="quantity-prompt-content">
            <h3>Wybierz ilość</h3>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" max={selectedProduct.stock} />
            <div className="quantity-prompt-actions">
              <button onClick={handleQuantitySubmit}>Dodaj</button>
              <button onClick={() => setShowQuantityPrompt(false)}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsByBrand;
