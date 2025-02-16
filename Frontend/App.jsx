import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import AdminDashboard from "./components/Admin/AdminDashboard"; 
import CarpenterPage from "./components/Carpenter/CarpenterPage"; 
import LacquererDashboard from "./components/Lacquerer/LacquererDashboard"; 
import SellerDashboard from "./components/Seller/SellerDashboard"; 
import Account from "./components/Seller/Account"; 
import Products from "./components/Seller/Products"; 
import AddProduct from "./components/Seller/AddProduct"; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setIsLoggedIn(true);
      setUserRole(userData.role);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn === null) {
    return <p>Ładowanie...</p>; // Dodanie komunikatu ładowania
  }

  const isSellerPage = location.pathname.startsWith("/seller");

  return (
    <div>
      {!isSellerPage && <Header />} 

      <Routes>
        <Route path="/" element={<MainContent />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/carpenter-dashboard" element={<CarpenterPage />} /> 
        <Route path="/lacquerer-dashboard" element={<LacquererDashboard />} /> 
        <Route path="/seller-dashboard" element={<SellerDashboard />} /> 
        <Route path="/account" element={<Account />} /> 
        <Route path="/products" element={<Products />} /> 
        <Route path="/add-product" element={<AddProduct />} /> 
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
