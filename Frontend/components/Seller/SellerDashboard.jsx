import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "./SellerHeaders";
import "../../styles/_SellerDashboard.scss";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobranie danych użytkownika z localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/"); // Przekierowanie na stronę logowania, jeśli brak danych użytkownika
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "sprzedawca") {
      navigate("/"); // Przekierowanie, jeśli użytkownik nie jest sprzedawcą
      return;
    }
    setUserData(parsedUserData);
  }, [navigate]);

  // Pobieranie danych sprzedaży sprzedawcy
  useEffect(() => {
    if (!userData) return;

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/api/sales/total`, {
      method: "GET",
      headers: {
        "userid": userData.id, // Wysyłanie user_id w nagłówkach
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd przy pobieraniu danych sprzedaży");
        }
        return response.json();
      })
      .then((data) => {
        setTotalSales(data); // Ustawienie łącznej sprzedaży
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [userData]);

  // Pobieranie produktów sprzedawcy
  useEffect(() => {
    if (!userData) return;

    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "user_id": userData.id, // Wysyłanie user_id w nagłówkach
      },
    })
      .then((response) => {
        if (response.status === 204) {
          return []; // Brak produktów
        }
        if (!response.ok) {
          throw new Error("Błąd przy pobieraniu produktów");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="dashboard">
      <SellerHeader />
      <h1>Witaj w panelu sprzedawcy</h1>

      {/* Sekcja podsumowania konta */}
      <section className="account-summary">
        <div className="summary-item">
          <h3>Witaj, {userData.name || "Nieznany użytkownik"}</h3>
        </div>
        <div className="summary-item">
          <h4>Status konta:</h4>
          <p>{userData.accountStatus || "Brak informacji"}</p>
        </div>
      </section>

      {/* Sekcja sprzedaży */}
      <section className="sales-statistics">
        <h3>Statystyki sprzedaży</h3>
        <div className="stat-item">
          <h4>Łączna sprzedaż:</h4>
          <p>{totalSales} litrów</p>
        </div>
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </section>

      {/* Sekcja produktów */}
      {products.length > 0 ? (
        <section className="products-list">
          <h3>Twoje produkty</h3>
          <div className="products">
            {products.map((product) => (
              <div className="product-item" key={product.id}>
                <h3>Kod: {product.kod}</h3>
                <h3>Nazwa: {product.name}</h3>
                <p>Stan: {product.stock} kg/l</p>
                <p>Opakowanie: {product.packaging} kg/l</p>
                <p>Cena: {product.price} zł/kg/l</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="no-products">
          <p>Brak produktów w ofercie</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
