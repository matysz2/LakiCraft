import React, { useEffect, useState } from "react";

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <p>Błąd ładowania statystyk</p>;

  return (
    <div className="admin-stats">
      <div className="stat">👥 Użytkownicy: {stats.users}</div>
      <div className="stat">🛒 Produkty: {stats.products}</div>
      <div className="stat">📦 Zamówienia lakierów: {stats.orders}</div>
      <div className="stat">🎨Zamówienia metrów do lakierowania: {stats.orderslacquer} m<sup>2</sup> </div>
      <div className="stat">💰 Sprzedaż: {stats.sales} zł</div>
    </div>
  );
};

export default AdminStats;
