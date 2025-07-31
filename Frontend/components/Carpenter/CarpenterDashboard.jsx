import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_carpenterDashboard.scss";
import BASE_URL from '../config.js';  // Zmienna BASE_URL


const CarpenterDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paintingOrders, setPaintingOrders] = useState([]);
  const [lacquerPurchases, setLacquerPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [errors, setErrors] = useState({ paintingOrders: "", lacquerPurchases: "" });
  const [expandedPurchase, setExpandedPurchase] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/");
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "stolarz") {
      navigate("/");
      return;
    }

    setUserData(parsedUserData);
    setUserLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrors({ paintingOrders: "", lacquerPurchases: "" });

        const [paintingOrdersRes, lacquerPurchasesRes] = await Promise.allSettled([
          fetchPaintingOrders(userData.id),
          fetchLacquerPurchases(userData.id),
        ]);

        if (paintingOrdersRes.status === "fulfilled") {
          setPaintingOrders(paintingOrdersRes.value);
        } else {
          setErrors(prev => ({ ...prev, paintingOrders: "Nie udało się pobrać zleceń lakierowania." }));
        }

        if (lacquerPurchasesRes.status === "fulfilled") {
          setLacquerPurchases(lacquerPurchasesRes.value);
        } else {
          setErrors(prev => ({ ...prev, lacquerPurchases: "Nie udało się pobrać historii zakupów lakierów." }));
        }
      } catch (error) {
        console.error("Błąd ogólny:", error);
        setErrors(prev => ({ ...prev, paintingOrders: "Błąd podczas pobierania danych zleceń." }));
        setErrors(prev => ({ ...prev, lacquerPurchases: "Błąd podczas pobierania historii zakupów." }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const fetchPaintingOrders = async (userId) => {
    const response = await fetch(`${BASE_URL}/api/lacquerOrders/new`, {      
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) throw new Error("Nie udało się pobrać zleceń lakierowania.");
    
    return await response.json();
  };

  const fetchLacquerPurchases = async (userId) => {
    const response = await fetch(`${BASE_URL}/api/orders/user-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "userId": userId 
      },
    });
  
    if (!response.ok) throw new Error("Błąd serwera przy pobieraniu historii zakupów lakierów.");
    return await response.json();
  };

  const toggleDetails = (purchaseId) => {
    setExpandedPurchase(expandedPurchase === purchaseId ? null : purchaseId);
  };

  if (userLoading) {
    return <div>Ładowanie użytkownika...</div>;
  }

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <div className="carpenter-dashboard">
      <h1>Witaj, {userData?.name || "Nieznany użytkownik"} w panelu stolarza</h1>
      <div className="dashboard-sections">
        <section className="painting-orders">
          <h2>Nowe zlecenia lakierowania:</h2>
          {errors.paintingOrders && <p className="error">{errors.paintingOrders}</p>}
          {paintingOrders.length > 0 ? (
            paintingOrders.map((order) => (
              <div key={order.id} className="order">
                <p><strong>Zlecenie #{order.id}</strong></p>
                <p>Lakier: {order.lacquer}</p>
                <p>Lakiernik: {order.client.name || "Nieznany"}</p>
                <p>Status: {order.status}</p>
                <p>Data zamówienia: {new Date(order.orderDate).toLocaleString("pl-PL")}</p>
                <p>Ilość do malowania: {order.paintingMeters} m²</p>
                <p>Cena całkowita: {order.totalPrice} zł</p>
                <p>Adres dostawy: {order.shippingAddress}</p>
              </div>
            ))
          ) : (
            <p>Brak zleceń lakierowania.</p>
          )}
        </section>

        <section className="lacquer-purchases">
          <h2>Ostatnie 5 zamówień lakierów:</h2>
          {errors.lacquerPurchases && <p className="error">{errors.lacquerPurchases}</p>}
          {lacquerPurchases.length > 0 ? (
            lacquerPurchases.map((purchase) => (
              <div key={purchase.id} className="purchase">
                <p><strong>Zakup #{purchase.id}</strong></p>
                <p>Data zakupu: {new Date(purchase.orderDate).toLocaleString("pl-PL")}</p>
                <p>Status: {purchase.status}</p>
                <button onClick={() => toggleDetails(purchase.id)}>
                  {expandedPurchase === purchase.id ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                </button>
                {expandedPurchase === purchase.id && (
                  <div className="purchase-details">
                    <p>Lakier: {purchase.orderItems[0]?.product.name}</p>
                    <p>Sprzedawca: {purchase.seller.name || "Nieznany"}</p>
                    <p>Cena: {purchase.totalPrice} zł</p>
                    <p>Adres dostawy: {purchase.shippingAddress}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Brak zakupów lakierów.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CarpenterDashboard;
