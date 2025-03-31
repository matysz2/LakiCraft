import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isSingleSeller, setIsSingleSeller] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentDueDays, setPaymentDueDays] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (!storedUserData) {
      navigate("/");
    } else {
      setPaymentDueDays(storedUserData.paymentDueDays || 0);
    }
  }, [navigate]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    setCartCount(cart.length);
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalPrice(total);

    const sellers = new Set(cart.map((item) => item?.user?.id).filter(Boolean));
    setIsSingleSeller(sellers.size === 1);
  }, [cart]);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handlePlaceOrder = async () => {
    if (!isSingleSeller) {
      alert("Nie możesz złożyć zamówienia na lakiery od różnych sprzedawców.");
      return;
    }

    if (!window.confirm("Czy na pewno chcesz złożyć zamówienie?")) {
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (!storedUserData) {
      alert("Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    if (cart.length === 0) {
      alert("Twój koszyk jest pusty.");
      return;
    }

    const sellerId = cart[0]?.user?.id;
    if (!sellerId) {
      alert("Błąd: Nie udało się określić sprzedawcy.");
      return;
    }

    const orderData = {
      user: { id: storedUserData.id },
      seller: { id: sellerId },
      orderDate: new Date().toISOString(),
      totalPrice,
      status: "nowe",
      shippingAddress: storedUserData.shippingAddress || "Brak adresu",
      orderItems: cart.map((item) => ({
        product: { id: item.id },
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await fetch(`http://${BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        localStorage.removeItem("cart");
        setCart([]);

        const countdown = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 1) {
              clearInterval(countdown);
              navigate("/");
            }
            return prevTime - 1;
          });
        }, 1000);
      } else {
        alert("Wystąpił błąd podczas składania zamówienia.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  const redirectToPayPal = () => {
    const payPalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=TWÓJ_PAYPAL_EMAIL&amount=${totalPrice.toFixed(2)}&currency_code=PLN&item_name=Zamówienie&return=http://localhost:3000/orders&cancel_return=http://localhost:3000/cart`;
    window.location.href = payPalUrl;
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
              <p><strong>Kod: {item.kod}</strong></p>
              {item.imagePath && <img src={`http://${BASE_URL}/${item.imagePath}`} alt={item.name} />}
              <div className="cart-item-details">
                <p><strong>{item.name}</strong></p>
                <p>Sprzedawca: <strong>{item?.user?.name || "Nieznany sprzedawca"}</strong></p>
                <p>{item.quantity} x {item.price} PLN</p>
                <button onClick={() => handleRemoveFromCart(item.id)} className="remove-from-cart-btn">Usuń</button>
              </div>
            </div>
          ))
        )}
      </div>

   

<div className="cart-summary">
  <p><strong>Całkowita cena: {totalPrice.toFixed(2)} PLN</strong></p>

  {!isSingleSeller ? (
    <button className="disabled-btn" disabled>
      Nie możesz złożyć zamówienia na lakiery od różnych sprzedawców
    </button>
  ) : paymentDueDays > 0 ? (
    <button
      onClick={handlePlaceOrder}
      disabled={cartCount === 0}
      className="place-order-btn"
    >
      Złóż zamówienie
    </button>
  ) : (
    <button
      onClick={redirectToPayPal}
      disabled={cartCount === 0}
      className="paypal-btn"
    >
      Przejdź do PayPal
    </button>
  )}
</div>

    </div>
  );
};

export default Cart;