import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import AdminDashboard from "./components/Admin/AdminDashboard"; 
import CarpenterPage from "./components/Carpenter/CarpenterPage"; 
import SellerDashboard from "./components/Seller/SellerDashboard"; 
import Account from "./components/Seller/Account"; 
import Products from "./components/Seller/Products"; 
import AddProduct from "./components/Seller/AddProduct"; 
import OrderList from "./components/Seller/OrderList"; 
import OrderMessages from "./components/Seller/OrderMessages";

import LacquererDashboard from "./components/Lacquerer/LacquererDashboard";
import LacquererHeader from "./components/Lacquerer/LacquererHeader";
import LoadingScreen from "./components/LoadingScreen";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
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
    return <LoadingScreen />; // Pokazuje ekran ładowania, dopóki stan nie jest zaktualizowany
  }

  const isSellerPage = location.pathname.startsWith("/seller");
  const isLacquererPage = location.pathname === "/lacquerer-dashboard";

  return (
    <div>
      {/* Jeśli użytkownik ma rolę 'lakiernik' i jest na stronie lacquerer-dashboard, wyświetlamy LacquererHeader */}
      {userRole === "lakiernik" && isLacquererPage ? (
        <LacquererHeader />
      ) : (
        !isSellerPage && <Header />
      )}

      <Routes>
        <Route path="/" element={<MainContent />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/carpenter-dashboard" element={<CarpenterPage />} /> 
        <Route path="/seller-dashboard" element={<SellerDashboard />} /> 
        <Route path="/account" element={<Account />} /> 
        <Route path="/products" element={<Products />} /> 
        <Route path="/add-product" element={<AddProduct />} /> 
        <Route path="/orders" element={<OrderList />} /> 
        <Route path="/messages" element={<OrderMessages />} />      
        <Route path="/orders/:orderId/messages" element={<OrderMessages />} />
        <Route path="/lacquerer-dashboard" element={<LacquererDashboard />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
