import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "./SellerHeaders";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik jest zalogowany
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

    // Pobranie zamówień
    fetch("http://localhost:8080/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId: userId,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd serwera: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error("Błędny format danych – oczekiwano tablicy zamówień.");
        }
      })
      .catch((error) => {
        console.error("Błąd pobierania zamówień:", error);
        setErrorMessage(error.message);
      });
  }, [navigate]);

  // Funkcja do rozwinięcia/zwinięcia szczegółów zamówienia
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Funkcja do zmiany statusu zamówienia
  const updateOrderStatus = (orderId, status) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }), // Wysłanie nowego statusu
    })
      .then((res) => res.json())
      .then((data) => {
        // Po pomyślnej zmianie statusu aktualizujemy listę zamówień
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: { ...order.status, status } } : order
          )
        );
      })
      .catch((error) => {
        console.error("Błąd zmiany statusu zamówienia:", error);
        setErrorMessage("Błąd zmiany statusu zamówienia.");
      });
  };

  // Funkcja do wysłania wiadomości
  const sendMessage = (orderId) => {
    const message = prompt("Wpisz wiadomość do klienta:");
    if (message) {
      // Wysyłamy wiadomość do klienta
      fetch(`http://localhost:8080/api/orders/${orderId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }), // Wysłanie wiadomości
      })
        .then((res) => res.json())
        .then(() => {
          alert("Wiadomość wysłana!");
        })
        .catch((error) => {
          console.error("Błąd wysyłania wiadomości:", error);
          setErrorMessage("Błąd wysyłania wiadomości.");
        });
    }
  };

  return (
    <div className="order-list">
      <SellerHeader />
      <div className="order-list-content">
        {/* Komunikat o błędzie */}
        {errorMessage ? (
          <div className="error-message">❌ {errorMessage}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">📭 Brak zamówień do wyświetlenia.</div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <span><strong>Zamówienie #{order.id}</strong></span>
                <span>Klient: {order?.user?.name || "Nieznany"}</span>
                <span>Data zamówienia: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Brak daty"}</span>
              </div>

              {/* Przyciski rozwijania/zwijania */}
              <button className="toggle-details" onClick={() => toggleOrderDetails(order.id)}>
                {expandedOrderId === order.id ? "Zwiń" : "Rozwiń"}
              </button>

              {/* Szczegóły zamówienia */}
              {expandedOrderId === order.id && (
                <div className="order-details">
                  <div><strong>Adres wysyłki:</strong> {order.shippingAddress}</div>
                  <div><strong>Status:</strong> {order.status ? order.status.status : "Brak statusu"}</div>
                  <div><strong>Łączna cena:</strong> {order.totalPrice ? order.totalPrice.toFixed(2) : "Brak ceny"}</div>

                  {/* Lista produktów w zamówieniu */}
                  <div>
                    <strong>Produkty:</strong>
                    {order.orderItems?.length > 0 ? (
                      <ul>
                        {order.orderItems.map((item, index) => (
                          <li key={index}>
                            <div>{item.product.name} - {item.quantity} szt. - {item.price.toFixed(2)} zł</div>
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
                <button className="processing" onClick={() => updateOrderStatus(order.id, "W realizacji")}>W realizacji</button>
                <button className="completed" onClick={() => updateOrderStatus(order.id, "Zrealizowane")}>Zrealizowano</button>
                <button className="cancel" onClick={() => updateOrderStatus(order.id, "Anulowane")}>Anuluj</button>
                <button className="message" onClick={() => sendMessage(order.id)}>Napisz wiadomość</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
