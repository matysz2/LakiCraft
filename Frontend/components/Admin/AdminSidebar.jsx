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
        <li onClick={() => navigate("/admin-dashboard")}>📊 Dashboard</li>
        <li onClick={() => navigate("/users")}>👥 Użytkownicy</li>
        <li onClick={() => navigate("/adminproducts")}>🛒 Produkty</li>
        <li onClick={() => navigate("/admin-orders")}>📦 Zamówienia lakierów</li>
        <li onClick={() => navigate("/admin-lacquerorders")}>🎨 Zamówienia lakierowania</li>
        <li onClick={() => navigate("/stats")}>📈 Statystyki</li>
        <li onClick={handleLogout} style={{ color: "red", fontWeight: "bold" }}>
          🚪 Wyloguj
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
