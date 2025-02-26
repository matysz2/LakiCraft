import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "./SellerHeaders";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableProduct, setEditableProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      console.error("Brak danych użytkownika w localStorage.");
      navigate("/");
      return;
    }

    let userData;
    try {
      userData = JSON.parse(storedUserData);
    } catch (e) {
      console.error("Błąd parsowania userData:", e);
      navigate("/");
      return;
    }

    if (!userData.id) {
      console.error("Brak ID użytkownika w userData.");
      navigate("/");
      return;
    }

    fetchProducts(userData.id);
  }, [navigate]);

  const fetchProducts = (userId) => {
    fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: { "user_id": userId },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd przy pobieraniu produktów: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("Błąd przy pobieraniu produktów.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    if (productToEdit) {
      setEditableProduct({ ...productToEdit });
    }
  };

  const saveProduct = () => {
    if (!editableProduct) return;

    fetch(`http://localhost:8080/api/products/${editableProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "user_id": editableProduct.userId,
      },
      body: JSON.stringify(editableProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd przy zapisywaniu produktu: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedProduct) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editableProduct.id ? updatedProduct : product
          )
        );
        setEditableProduct(null);
      })
      .catch(() => {
        setError("Błąd przy zapisywaniu produktu.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };


  const deleteProductFromServer = (productId) => {
    fetch(`http://localhost:8080/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "user_id": JSON.parse(localStorage.getItem("userData")).id,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd przy usuwaniu produktu: ${res.status}`);
        }
        // Jeśli usunięcie się powiedzie, usuwamy produkt lokalnie
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        alert("Produkt został usunięty.");
      })
      .catch((error) => {
        console.error("Błąd przy usuwaniu produktu:", error);
        alert("Błąd przy usuwaniu produktu.");
      });
  };
  

  // Funkcja sprawdzająca, czy produkt może zostać usunięty
  const checkIfProductCanBeDeleted = (productId) => {
    fetch(`http://localhost:8080/api/orders/order-items/check/${productId}`)
      .then((res) => {
        console.log("Status odpowiedzi:", res.status);
        if (!res.ok) {
          throw new Error(`Błąd przy sprawdzaniu zależności: ${res.status}`);
        }
        return res.text();  // Zmiana na text(), żeby sprawdzić dokładną odpowiedź serwera
      })
      .then((data) => {
        console.log("Odpowiedź serwera:", data);  // Logowanie odpowiedzi jako tekst
        try {
          const parsedData = JSON.parse(data);  // Próba parsowania odpowiedzi jako JSON
          if (parsedData.canDelete) {
            deleteProductFromServer(productId);
          } else {
            alert("Nie można usunąć tego produktu, ponieważ jest powiązany z zamówieniami.");
          }
        } catch (error) {
          console.error("Błąd przy parsowaniu odpowiedzi jako JSON:", error);
          alert("Błąd przy sprawdzaniu zależności.");
        }
      })
      .catch((error) => {
        console.error("Błąd przy sprawdzaniu zależności:", error);
        alert("Błąd przy sprawdzaniu zależności.");
      });
  };
  

  const deleteProduct = (productId) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedUserData ? storedUserData.id : null;
  
    if (!userId) {
      console.error("Brak userId w localStorage.");
      return;
    }
  
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć ten produkt?");
    if (!confirmDelete) return;
  
    // Sprawdzamy, czy produkt jest powiązany z jakimikolwiek zamówieniami
    checkIfProductCanBeDeleted(productId);
  };
  

  if (loading) return <p>Ładowanie produktów...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="products-container">
      <SellerHeader />
      <h1>Produkty</h1>

      <button className="add-product-btn" onClick={() => navigate("/add-product")}>
        Dodaj nowy produkt
      </button>

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.imagePath && (
              <img
                src={`http://localhost:8080/${product.imagePath}`}
                alt={product.name}
                className="product-image"
              />
            )}

            {editableProduct?.id === product.id ? (
              <>
                <input type="text" name="kod" value={editableProduct?.kod || ""} onChange={handleChange} placeholder="Kod produktu" />
                <input type="text" name="name" value={editableProduct?.name || ""} onChange={handleChange} placeholder="Nazwa produktu" />
                <input type="text" name="packaging" value={editableProduct?.packaging || ""} onChange={handleChange} placeholder="Opakowanie" />
                <input type="number" name="price" value={editableProduct?.price || ""} onChange={handleChange} placeholder="Cena" />
                <input type="number" name="stock" value={editableProduct?.stock || ""} onChange={handleChange} placeholder="Stan magazynowy" />
                <input type="text" name="brand" value={editableProduct?.brand || ""} onChange={handleChange} placeholder="Marka" />
                <button onClick={saveProduct}>Zapisz</button>
                <button onClick={() => setEditableProduct(null)}>Anuluj</button>
              </>
            ) : (
              <>
                <h4>Kod: {product.kod}</h4>
                <h4>{product.name}</h4>
                <p>Opakowanie: {product.packaging}</p>
                <p>Cena: {product.price} zł</p>
                <p>Stan magazynowy: {product.stock}</p>
                <p>Marka: {product.brand}</p>
                <button onClick={() => editProduct(product.id)}>Edytuj</button>
                <button className="delete" onClick={() => deleteProduct(product.id)}>Usuń</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
