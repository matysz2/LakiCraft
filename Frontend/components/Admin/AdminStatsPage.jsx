import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_adminstatspage.scss"; // Stylizacja nagłówka
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const StatsPage = () => {
  const navigate = useNavigate();
  const [paymentStats, setPaymentStats] = useState(null);
  const [salesStats, setSalesStats] = useState(null);
  const [paintingStats, setPaintingStats] = useState(null);
  const [lacquerOrdersCount, setLacquerOrdersCount] = useState(null);
  const [paintingOrderStatuses, setPaintingOrderStatuses] = useState(null);
  const [salesOrderStatuses, setSalesOrderStatuses] = useState(null); // Nowy stan

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData || JSON.parse(userData).role !== "admin") {
      navigate("/"); // Przekierowanie, jeśli nie admin
    }

    const fetchPaymentStats = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/payment`);
        const data = await response.json();
        setPaymentStats(data);
      } catch (error) {
        console.error("Błąd pobierania danych statystyk płatności:", error);
      }
    };

    const fetchSalesStats = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/sales`);
        const data = await response.json();
        setSalesStats(data);
      } catch (error) {
        console.error("Błąd pobierania danych statystyk sprzedaży:", error);
      }
    };

    const fetchPaintingStats = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/painting`);
        const data = await response.json();
        setPaintingStats(data);
      } catch (error) {
        console.error("Błąd pobierania danych statystyk malowania:", error);
      }
    };

    const fetchLacquerOrdersCount = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/lacquer-orders-count`);
        const data = await response.json();
        setLacquerOrdersCount(data);
      } catch (error) {
        console.error("Błąd pobierania liczby zamówień lakierowania:", error);
      }
    };

    const fetchPaintingOrderStatuses = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/painting-statuses`);
        const data = await response.json();
        setPaintingOrderStatuses(data);
      } catch (error) {
        console.error("Błąd pobierania statusów zamówień lakierowania:", error);
      }
    };

    const fetchSalesOrderStatuses = async () => {
      try {
        const response = await fetch(`https://${BASE_URL}/api/stats/sales-statuses`);
        const data = await response.json();
        setSalesOrderStatuses(data);
      } catch (error) {
        console.error("Błąd pobierania statusów zamówień sprzedaży:", error);
      }
    };

    fetchPaymentStats();
    fetchSalesStats();
    fetchPaintingStats();
    fetchLacquerOrdersCount();
    fetchPaintingOrderStatuses();
    fetchSalesOrderStatuses(); // Nowe pobieranie danych statusów sprzedaży
  }, [navigate]);

  return (
    <div className="admin-page">
      <div className="admin-content">
        <h1>Statystyki</h1>

        {/* Sekcja statystyk płatności */}
        <h2>Statystyki Płatności</h2>
        {paymentStats ? (
          <div className="stats-container">
            <div className="stat">
              <h3>Całkowite Przychody</h3>
              <p>{paymentStats.totalRevenue} PLN</p>
            </div>
            <div className="stat">
              <h3>Zaległe Płatności</h3>
              <p>{paymentStats.outstandingPayments} PLN</p>
            </div>
            <div className="stat">
              <h3>Liczba Transakcji</h3>
              <p>{paymentStats.totalTransactions}</p>
            </div>
          </div>
        ) : (
          <p>Ładowanie danych...</p>
        )}

        {/* Sekcja statystyk sprzedaży */}
        <h2>Statystyki Sprzedaży</h2>
        {salesStats ? (
          <div className="stats-container">
            <div className="stat">
              <h3>Całkowite Przychody ze Sprzedaży</h3>
              <p>{salesStats.totalRevenue} PLN</p>
            </div>
            <div className="stat">
              <h3>Liczba Transakcji Sprzedaży</h3>
              <p>{salesStats.totalTransactions}</p>
            </div>
          </div>
        ) : (
          <p>Ładowanie danych...</p>
        )}

        {/* Sekcja statusów zamówień sprzedaży */}
        <h2>Statusy Zamówień Sprzedaży</h2>
        {salesOrderStatuses ? (
          <div className="stats-container">
            <div className="stat">
              <h3>Nowe</h3>
              <p>{salesOrderStatuses.new}</p>
            </div>
            <div className="stat">
              <h3>W realizacji</h3>
              <p>{salesOrderStatuses.inProgress}</p>
            </div>
            <div className="stat">
              <h3>Zrealizowane</h3>
              <p>{salesOrderStatuses.completed}</p>
            </div>
          </div>
        ) : (
          <p>Ładowanie danych...</p>
        )}

        {/* Sekcja statystyk malowania */}
        <h2>Statystyki Zamówień Lakierowania</h2>
        {paintingStats ? (
          <div className="stats-container">
            <div className="stat">
              <h3>Łączna Liczba Metrów Malowania</h3>
              <p>{paintingStats.totalRevenue} m²</p>
            </div>
            <div className="stat">
              <h3>Łączna Liczba Zamówień Lakierowania</h3>
              <p>{lacquerOrdersCount}</p>
            </div>
          </div>
        ) : (
          <p>Ładowanie danych...</p>
        )}

{/* Sekcja statusów zamówień lakierowania */}
<h2>Statusy Zamówień Lakierowania</h2>
{paintingOrderStatuses ? (
  <div className="stats-container">
    <div className="stat">
      <h3>Nowe</h3>
      <p>{paintingOrderStatuses["Nowe"]}</p>
    </div>
    <div className="stat">
      <h3>W realizacji</h3>
      <p>{paintingOrderStatuses["W realizacji"]}</p>
    </div>
    <div className="stat">
      <h3>Zrealizowane</h3>
      <p>{paintingOrderStatuses["Zrealizowane"]}</p>
    </div>
  </div>
) : (
  <p>Ładowanie danych...</p>
)}


        {/* Przycisk do cofnięcia */}
        <button onClick={() => navigate(-1)} className="btn-back">Cofnij</button>
      </div>
    </div>
  );
};

export default StatsPage;
