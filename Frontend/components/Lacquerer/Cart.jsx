import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Liczba unikalnych produktów w koszyku
  const [isSingleSeller, setIsSingleSeller] = useState(true); // Sprawdzanie, czy produkty są od jednego sprzedawcy
  const [totalPrice, setTotalPrice] = useState(0); // Całkowita cena koszyka
  const navigate = useNavigate();

  // Sprawdzenie, czy użytkownik jest zalogowany
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/"); // Przekierowanie na stronę główną, jeśli użytkownik nie jest zalogowany
    }
  }, [navigate]);

  // Pobieranie koszyka z localStorage i aktualizowanie stanu
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    setCartCount(savedCart.length);

    // Sprawdzanie, czy w koszyku są produkty od różnych sprzedawców
    const sellers = new Set(savedCart.map(item => item.userId));
    setIsSingleSeller(sellers.size === 1); // Jeśli więcej niż 1 sprzedawca, to false

    // Obliczanie całkowitej ceny koszyka
    const total = savedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  // Funkcja do usuwania produktu z koszyka
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Funkcja do obsługi zamówienia
  const handlePlaceOrder = () => {
    if (!isSingleSeller) {
      alert("Nie możesz złożyć zamówienia z produktów różnych sprzedawców.");
      return;
    }

    // Przetwarzanie zamówienia, gdy produkty są od jednego sprzedawcy
    // Można dodać logikę realizacji zamówienia lub przejście do strony płatności
    navigate("/checkout"); // Przekierowanie do strony płatności (lub formularza zamówienia)
  };

  // Funkcja do przejścia do płatności
  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart">
      <h2>Twój koszyk</h2>
      <div className="cart-items">
        {cartCount === 0 ? (
          <p>Twój koszyk jest pusty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <p>{item.name}</p>
                <p>{item.quantity} x {item.price} PLN</p>
                <button 
                  onClick={() => handleRemoveFromCart(item.id)} 
                  className="remove-from-cart-btn"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <p><strong>Całkowita cena: {totalPrice} PLN</strong></p>
        <button
          onClick={handlePlaceOrder}
          disabled={!isSingleSeller} // Zablokowanie przycisku, jeśli są produkty różnych sprzedawców
          className="place-order-btn"
        >
          {isSingleSeller ? "Złóż zamówienie" : "Możesz zamówić tylko produkty od jednego sprzedawcy"}
        </button>
        <button 
          onClick={handleProceedToCheckout} 
          className="proceed-to-checkout-btn"
        >
          Przejdź do płatności
        </button>
      </div>
    </div>
  );
};

export default Cart;
