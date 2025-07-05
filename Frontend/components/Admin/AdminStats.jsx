import React, { useEffect, useState } from "react";
import BASE_URL from '../config.js';  // Zmienna BASE_URL


const AdminStats = () => {
  const [stats, setStats] = useState(null);

  // Funkcja do pobierania statystyk
  const fetchStats = () => {
    fetch(`https://${BASE_URL}/api/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));  // Możesz tu wyświetlić komunikat o błędzie, jeśli chcesz
  };

  useEffect(() => {
    // Pobierz statystyki przy załadowaniu komponentu
    fetchStats();
  }, []);  // [] oznacza, że ten efekt będzie uruchamiany tylko raz, przy pierwszym renderowaniu komponentu

  // Funkcja do usuwania produktu
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć produkt ${productName}?`)) return;

    try {
      const res = await fetch(`https://${BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Nie udało się usunąć produktu.");

      // Po usunięciu, zaktualizuj dane o statystykach
      fetchStats();

      // Możesz także dodać komunikat o sukcesie, jeśli chcesz
      setSuccessMessage(`Produkt ${productName} został usunięty.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Błąd usuwania: ${err.message}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!stats) return <p>Błąd ładowania statystyk</p>;

  return (
    <div className="admin-stats">
      <div className="stat">👥 Użytkownicy: {stats.users}</div>
      <div className="stat">🛒 Produkty: {stats.products}</div>
      <div className="stat">📦 Zamówienia lakierów: {stats.orders}</div>
      <div className="stat">🎨 Zamówienia metrów do lakierowania: {stats.orderslacquer} m<sup>2</sup> </div>
      <div className="stat">💰 Sprzedaż: {stats.sales} zł</div>
    </div>
  );
};

export default AdminStats;
