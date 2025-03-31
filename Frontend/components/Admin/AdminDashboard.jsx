import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminStats from "./AdminStats";
import "../../styles/_admin.scss";
import Header from "../Header";
import BASE_URL from '../config.js';  // Zmienna BASE_URL
const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/");
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "admin") {
      navigate("/");
      return;
    }

    setUserData(parsedUserData);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (userData) {
      fetch(`http://${BASE_URL}/api/lacquer-orders`)
      .then((res) => { 
        if (!res.ok) {
          throw new Error("Błąd pobierania danych");
        }
        return res.json();
      })
    
        .then(() => setLoading(false))
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [userData]);



  return (
    <div className="admin-container">
      <Header />
      <AdminSidebar />
      <div className="admin-content">
        <h1>Panel Administratora</h1>
        <AdminStats />
      </div>
    </div>
  );
  
};

export default AdminDashboard;
