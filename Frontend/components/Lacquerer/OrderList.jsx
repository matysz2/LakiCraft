import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LacquerOrderList = () => {
  const [lacquerOrders, setLacquerOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzenie, czy użytkownik jest zalogowany
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/"); // Jeśli brak danych, przekierowanie na stronę logowania
      return;
    }

    const userId = JSON.parse(storedUserData)?.id;
    if (!userId) {
      navigate("/"); // Jeśli brak userId, przekierowanie na stronę logowania
      return;
    }

    // Pobranie zamówień lakierowania dla użytkownika
    fetch(`http://localhost:8080/api/lacquerOrders/user/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd serwera: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Zamówienia lakierowania z backendu:", data);
        setLacquerOrders(data);
      })
      .catch((error) => {
        console.error("Błąd pobierania zamówień lakierowania:", error);
        setErrorMessage(error.message);
      });
  }, [navigate]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    fetch(`http://localhost:8080/${orderId}/status`, { // Zaktualizowany URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Błąd serwera: ${res.status} ${res.statusText}`);
        }
        return res.json(); // Próbujemy przetworzyć odpowiedź JSON tylko, jeśli res.ok
      })
      .then((data) => {
        console.log("Zaktualizowany status zamówienia:", data);
        setLacquerOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      })
      .catch((error) => {
        console.error("Błąd zmiany statusu zamówienia:", error);
        setErrorMessage("Błąd zmiany statusu zamówienia.");
      });
  };
  

  // Funkcja przekierowująca od razu do strony paint-message
  const sendMessage = (orderId) => {
    navigate(`/paint-message/${orderId}`);
  };

  return (
    <div className="lacquer-order-list">
      <h1>Twoje zlecenia lakierowania:</h1>
      <div className="lacquer-order-list-content">
        {errorMessage ? (
          <div className="error-message">❌ {errorMessage}</div>
        ) : lacquerOrders.length === 0 ? (
          <div className="no-orders">📅 Brak dostępnych zamówień lakierowania.</div>
        ) : (
          lacquerOrders.map((order) => {
            return (
              <div className="lacquer-order-card" key={order.id}>
                <div
                  className="lacquer-order-header"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <span>
                    <strong>Zamówienie #{order.id}</strong>
                  </span>
                  <span>
                    Data:{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "Brak daty"}
                  </span>
                  <span>Status: {order.status || "Brak statusu"}</span>
                </div>

                <button
                  className="toggle-details"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrderId === order.id ? "Zwiń" : "Rozwiń"}
                </button>

                {expandedOrderId === order.id && (
                  <div className="lacquer-order-details">
                    <div>
                      <strong>Wybrany lakier:</strong>{" "}
                      {order.lacquer || "Brak lakieru"}
                    </div>
                    <div>
                      <strong>Adres dostawy:</strong>{" "}
                      {order.shippingAddress || "Brak adresu"}
                    </div>
                    <div>
                      <strong>Ilość do malowania:</strong>{" "}
                      {order.paintingMeters || "Brak danych"} metrów
                    </div>
                    <div>
                      <strong>Stolarz:</strong>{" "}
                      {order.carpenter?.name || "Nieznany"}
                    </div>
                    <div>
                      <strong>Cena całkowita:</strong>{" "}
                      {order.totalPrice ? `${order.totalPrice} PLN` : "Brak ceny"}
                    </div>
                  </div>
                )}

                <div className="lacquer-order-actions">
                  {order.status !== "Zrealizowane" &&
                    order.status !== "Anulowane" && (
                      <>
                        <button
                          className="confirmed"
                          onClick={() =>
                            updateOrderStatus(order.id, "Zrealizowane")
                          }
                        >
                          Zrealizowane
                        </button>
                        <button
                          className="cancelled"
                          onClick={() => updateOrderStatus(order.id, "Anulowane")}
                        >
                          Anuluj
                        </button>
                      </>
                    )}

                  <button
                    className="message"
                    onClick={() => sendMessage(order.id)}
                  >
                    Napisz wiadomość
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LacquerOrderList;
