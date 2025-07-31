import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const Orders = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statusColors = {
    nowe: "#3498db",
    zrealizowane: "#2ecc71",
    anulowane: "#e74c3c",
    w_trakcie: "#f39c12",
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/");
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      if (!parsedUserData || parsedUserData.role !== "stolarz") {
        navigate("/");
        return;
      }
      setUserData(parsedUserData);
    } catch (error) {
      console.error("Błąd parsowania userData:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/orders/customer`, {
          headers: {
            "Content-Type": "application/json",
            "userId": userData.id,
          },
        });

        if (!response.ok) throw new Error("Błąd podczas pobierania zamówień.");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setErrors("Nie udało się pobrać zamówień.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!userData) return null;
  if (loading) return <div className="loading">Ładowanie...</div>;

  return (
    <div className="lacquer-orders">
      <section className="orders-section">
        <h2>Twoje zamówienia:</h2>
        {errors && <p className="error">{errors}</p>}
        {orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-item-details">
                  <p><strong>Zamówienie #{order.id}</strong></p>
                  <p><strong>Status: </strong>
                    <span className="order-status" style={{ color: statusColors[order.status.toLowerCase()] }}>
                      {order.status}
                    </span>
                  </p>
                  <p><strong>Data zamówienia: </strong>{new Date(order.orderDate).toLocaleString("pl-PL")}</p>
                </div>
                <div className="order-actions">
                  <button className="status-btn2" onClick={() => toggleOrderDetails(order.id)}>
                    {expandedOrder === order.id ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                  </button>
                </div>
   {expandedOrder === order.id && (
  <div className="order-item-details">
    <p><strong>Adres dostawy: </strong>{order.shippingAddress}</p>
    <p><strong>Cena całkowita: </strong>{order.totalPrice} zł</p>
    <div className="order-items">
      <h4>Pozycje w zamówieniu:</h4>
      {order.items.map((item, index) => (
        <div key={index}>
          <p><strong>Produkt: </strong>{item.productName}</p>
          <p><strong>Ilość: </strong>{item.quantity}</p>
        </div>
      ))}
    </div>
  </div>
)}

              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <p>Brak zamówień.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
