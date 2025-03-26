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
        <li onClick={() => navigate("/Admin")}>📊 Dashboard</li>
        <li onClick={() => navigate("/users")}>👥 Użytkownicy</li>
        <li onClick={() => navigate("/adminproducts")}>🛒 Produkty</li>
        <li onClick={() => navigate("/Admin/order-shop")}>📦 Zamówienia lakierów</li>
        <li onClick={() => navigate("/Admin/orders-lacquer")}>🎨 Zamówienia lakierowania</li>
        <li onClick={() => navigate("/Admin/stats")}>📈 Statystyki</li>
        <li onClick={handleLogout} style={{ color: "red", fontWeight: "bold" }}>
          🚪 Wyloguj
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
