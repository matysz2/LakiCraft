import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData"); // Usuń dane użytkownika
    navigate("/"); // Przekieruj na stronę główną
  };
  

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li onClick={() => navigate("/admin-dashboard") } className="logout">📊 Dashboard</li>
        <li onClick={() => navigate("/users")} className="logout">👥 Użytkownicy</li>
        <li onClick={() => navigate("/adminproducts")} className="logout">🛒 Produkty</li>
        <li onClick={() => navigate("/admin-orders")} className="logout">📦 Zamówienia lakierów</li>
        <li onClick={() => navigate("/admin-lacquerorders")} className="logout">🎨 Zamówienia lakierowania</li>
        <li onClick={() => navigate("/stats")} className="logout">📈 Statystyki</li>
        <li onClick={handleLogout} style={{ color: "red", fontWeight: "bold" }} className="logout">
          🚪 Wyloguj
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
