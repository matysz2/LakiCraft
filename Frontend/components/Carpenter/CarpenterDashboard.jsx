import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_carpenterDashboard.scss";
import BASE_URL from "../config.js"; // Zmienna BASE_URL

const CarpenterDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [paintingOrders, setPaintingOrders] = useState([]);
  const [lacquerPurchases, setLacquerPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [errors, setErrors] = useState({ paintingOrders: "", lacquerPurchases: "" });

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
      fetchPaintingOrders(userData.id), // ✅ PRZEKAZUJEMY carpenterId
      fetchLacquerPurchases(userData.id),
    ]);

    if (paintingOrdersRes.status === "fulfilled") {
      setPaintingOrders(paintingOrdersRes.value);
    } else {
      setErrors(prev => ({
        ...prev,
        paintingOrders: "Nie udało się pobrać zleceń lakierowania.",
      }));
    }

    if (lacquerPurchasesRes.status === "fulfilled") {
      const sortedPurchases = lacquerPurchasesRes.value
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);
      setLacquerPurchases(sortedPurchases);
    } else {
      setErrors(prev => ({
        ...prev,
        lacquerPurchases: "Nie udało się pobrać historii zakupów lakierów.",
      }));
    }
  } catch (error) {
    console.error("Błąd ogólny:", error);
    setErrors({
      paintingOrders: "Błąd podczas pobierania danych zleceń.",
      lacquerPurchases: "Błąd podczas pobierania historii zakupów.",
    });
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [userData]);

const fetchPaintingOrders = async (carpenterId) => {
  const response = await fetch(`${BASE_URL}/api/lacquerOrders/new?carpenterId=${carpenterId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Nie udało się pobrać zleceń lakierowania.");

  const text = await response.text();
  return text ? JSON.parse(text) : [];
};


  const fetchLacquerPurchases = async (userId) => {
    const response = await fetch(`${BASE_URL}/api/orders/user-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId: userId,
      },
    });

    if (!response.ok)
      throw new Error("Błąd serwera przy pobieraniu historii zakupów lakierów.");
    return await response.json();
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
                <p>Lakiernik: {order.client?.name || "Nieznany"}</p>
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
