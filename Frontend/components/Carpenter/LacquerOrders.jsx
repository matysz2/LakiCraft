import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_lacquer-orders.scss";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const LacquerOrders = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mapowanie statusów na kolory
  const statusColors = {
    nowe: "#3498db",  // Niebieski
    zrealizowane: "#2ecc71",  // Zielony
    anulowane: "#e74c3c",  // Czerwony
    w_trakcie: "#f39c12",  // Pomarańczowy
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "stolarz") {
      navigate("/", { replace: true });
      return;
    }
    setUserData(parsedUserData);
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://${BASE_URL}/carpenter/${userData.id}`);
        if (!response.ok) throw new Error("Błąd podczas pobierania zleceń.");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setErrors("Nie udało się pobrać zleceń lakierowania.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/api/lacquerOrders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } else {
        alert("Nie udało się usunąć zlecenia.");
      }
    } catch (error) {
      console.error("Błąd przy usuwaniu zlecenia", error);
    }
  };

  const handleWriteMessage = (orderId) => {
    navigate(`/paint-message/${orderId}`);
  };

  // Nowa metoda do przejścia na stronę znalezienia lakiernika i terminu
  const handleFindLacquerer = () => {
    navigate("/find-lacquerer");  // Przekierowanie na stronę /find-lacquerer
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="lacquer-orders"><br></br><br></br>
      <button className="find-lacquerer-btn" onClick={handleFindLacquerer}>
        Znajdź lakiernika i termin
      </button>

      <section className="orders-section">
        <h2>Twoje zlecenia lakierowania:</h2>
        {errors && <p className="error">{errors}</p>}
        {orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-details">
                  <p><strong>Zlecenie #{order.id}</strong></p>
                  <p 
                    className="lacquerer-name" 
                    style={{ color: order.lacquererColor || "#000" }} // Kolor lakiernika z backendu
                  >
                    Lakiernik: {order.client?.name || "Nieznany"}
                  </p>
                  <p><strong>Status: </strong>
                    <span 
                      className="order-status" 
                      style={{ color: statusColors[order.status.toLowerCase()] }}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Data zamówienia: </strong>{new Date(order.orderDate).toLocaleString("pl-PL")}</p>
                </div>

                <div className="order-actions">
                  {["zrealizowane", "nowe"].includes(order.status) && (
                    <button className="status-btn cancel" onClick={() => handleDeleteOrder(order.id)}>
                      Usuń
                    </button>
                  )}
                  <button className="status-btn2" onClick={() => toggleOrderDetails(order.id)}>
                    {expandedOrder === order.id ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                  </button>
                  <button className="status-btn write-message" onClick={() => handleWriteMessage(order.id)}>
                    Napisz wiadomość
                  </button>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <p><strong>Lakier: </strong>{order.lacquer}</p>
                    <p><strong>Opis: </strong>{order.description || "Brak opisu"}</p>
                    <p><strong>Ilość do malowania: </strong>{order.paintingMeters} m²</p>
                    <p><strong>Cena całkowita: </strong>{order.totalPrice} zł</p>
                    <p><strong>Adres dostawy: </strong>{order.shippingAddress}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <p>Brak zleceń lakierowania.</p>
          </div>
        )}
      </section>
    </div>
    
  );
};

export default LacquerOrders;
