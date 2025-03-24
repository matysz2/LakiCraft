import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li onClick={() => navigate("/Admin")}>📊 Dashboard</li>
        <li onClick={() => navigate("/Admin/users")}>👥 Użytkownicy</li>
        <li onClick={() => navigate("/Admin/products")}>🛒 Produkty</li>
        <li onClick={() => navigate("/Admin/order-shop")}>📦 Zamówienia lakierów</li>
        <li onClick={() => navigate("/Admin/orders-lacquer")}>🎨 Zamówienia lakierowania</li>
        <li onClick={() => navigate("/Admin/stats")}>📈 Statystyki</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
