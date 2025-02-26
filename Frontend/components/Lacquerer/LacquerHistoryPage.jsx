import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyHistory = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }

    const userId = JSON.parse(storedUserData)?.id;
    if (!userId) {
      navigate("/");
      return;
    }

    // Zmieniamy metodę fetch, aby używać nagłówka zamiast query parameter
    fetch("http://localhost:8080/api/orders/user-orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "userId": userId, // Wysyłamy userId w nagłówku
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd połączenia z serwerem");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Dane zamówień:", data);
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error("Oczekiwano tablicy zamówień");
        }
      })
      .catch((error) => {
        console.error("Błąd pobierania zamówień:", error);
        setErrorMessage(error.message || "Błąd pobierania zamówień.");
      });
  }, [navigate]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleWriteMessage = (orderId) => {
    // Po kliknięciu przycisku, przekierowujemy na stronę wiadomości dla danego zamówienia
    navigate(`/orders/${orderId}/messages`);
  };

  return (
    <div className="order-list">
      <div className="order-list-content">
        {errorMessage ? (
          <div className="error-message">❌ {errorMessage}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">📭 Brak zamówień do wyświetlenia.</div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <span><strong>Zamówienie #{order.id}</strong></span>
                <span>Data: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Brak daty"}</span>
                <span>Status: {order.status || "Brak statusu"}</span>
              </div>

              <button className="toggle-details" onClick={() => toggleOrderDetails(order.id)}>
                {expandedOrderId === order.id ? "Zwiń" : "Rozwiń"}
              </button>

              {expandedOrderId === order.id && (
                <div className="order-details">
                  <div><strong>Adres wysyłki:</strong> {order.shippingAddress}</div>
                  <div><strong>Łączna cena:</strong> {order.totalPrice ? order.totalPrice.toFixed(2) : "Brak ceny"}</div>
                  <div>
                    <strong>Produkty:</strong>
                    {order.orderItems?.length > 0 ? (
                      <ul>
                        {order.orderItems.map((item, index) => (
                          <li key={index}>
                            {item.product.name} - {item.quantity} szt. - {item.price.toFixed(2)} zł
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Brak produktów w zamówieniu.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="order-actions">
                <button className="message" onClick={() => handleWriteMessage(order.id)}>
                  Napisz wiadomość
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyHistory;
