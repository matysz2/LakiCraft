import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "./SellerHeaders";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const OrderList = () => {
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

    fetch(`${BASE_URL}/api/orders`, {
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
        setErrorMessage("Brak zamówień.");
      });
  }, [navigate]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedUserData ? storedUserData.id : null;
  
    if (!userId) {
      alert("Nie znaleziono danych użytkownika!");
      return;
    }
  
    fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        userId,  // Przekazanie userId z localStorage
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd zmiany statusu zamówienia.");
        }
        return res.json();
      })
      .then(() => {
        setOrders((prevOrders) =>
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

  const sendMessage = async (orderId) => {
    const message = prompt("Wpisz wiadomość do klienta:");
    if (message) {
      try {
        const response = await fetch(`${BASE_URL}/api/orders/${orderId}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error("Błąd podczas wysyłania wiadomości");
        }
  
        navigate(`/order/${orderId}/messages`);
      } catch (error) {
        console.error("Błąd wysyłania wiadomości:", error);
        setErrorMessage("Błąd wysyłania wiadomości.");
      }
    }
  };

  return (
    <div className="order-list">
      <SellerHeader />
      <div className="order-list-content">
        {/* Display error message if there is one */}
        {errorMessage && <div className="error-message">❌ {errorMessage}</div>}

        {/* If there are no orders, display a message indicating so */}
        {orders.length === 0 && !errorMessage ? (
          <div className="no-orders">📭 Brak zamówień do wyświetlenia.</div>
        ) : (
          orders.map((order) => {
            const normalizedStatus = order.status?.toLowerCase(); // Normalizacja statusu

            return (
              <div className="order-card" key={order.id}>
                <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                  <span><strong>Zamówienie #{order.id}</strong></span>
                  <span>Klient: {order?.user?.name || "Nieznany"}</span>
                  <span>Data zamówienia: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Brak daty"}</span>
                </div>

                <button className="toggle-details" onClick={() => toggleOrderDetails(order.id)}>
                  {expandedOrderId === order.id ? "Zwiń" : "Rozwiń"}
                </button>

                {expandedOrderId === order.id && (
                  <div className="order-details">
                    <div><strong>Adres wysyłki:</strong> {order.shippingAddress}</div>
                    <div><strong>Status:</strong> {order.status || "Brak statusu"}</div>
                    <div><strong>Łączna cena:</strong> {order.totalPrice ? order.totalPrice.toFixed(2) : "Brak ceny"}</div>

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
                  {normalizedStatus === "nowe" && (
                    <>
                      <button className="processing" onClick={() => updateOrderStatus(order.id, "W realizacji")}>
                        W realizacji
                      </button>
                      <button className="completed" onClick={() => updateOrderStatus(order.id, "Zrealizowane")}>
                        Zrealizowano
                      </button>
                      <button className="cancel" onClick={() => updateOrderStatus(order.id, "Anulowane")}>
                        Anuluj
                      </button>
                    </>
                  )}

                  {normalizedStatus === "w realizacji" && (
                    <>
                      <button className="completed" onClick={() => updateOrderStatus(order.id, "Zrealizowane")}>
                        Zrealizowano
                      </button>
                      <button className="cancel" onClick={() => updateOrderStatus(order.id, "Anulowane")}>
                        Anuluj
                      </button>
                    </>
                  )}

                  <button className="message" onClick={() => navigate(`/orders/${order.id}/messages`)}>
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

export default OrderList;
