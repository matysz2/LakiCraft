import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import AdminDashboard from "./components/Admin/AdminDashboard"; 
import SellerDashboard from "./components/Seller/SellerDashboard"; 
import Account from "./components/Seller/Account"; 
import Products from "./components/Seller/Products"; 
import AddProduct from "./components/Seller/AddProduct"; 
import OrderList from "./components/Seller/OrderList"; 
import OrderMessages from "./components/Seller/OrderMessages";

import LacquererDashboard from "./components/Lacquerer/LacquererDashboard";
import LacquererHeader from "./components/Lacquerer/LacquererHeader";

import LoadingScreen from "./components/LoadingScreen";
import MyServices from "./components/Lacquerer/MyServices";
import LacquerHistory from "./components/Lacquerer/LacquerHistoryPage";
import LacquerOrder from "./components/Lacquerer/OrderList";
import MyOrder from "./components/Lacquerer/LacquerOrderPage";
import PaintMessage from "./components/Lacquerer/PaintMessage";
import LacquerShop from "./components/Lacquerer/LacquerShop";
import ProductByBrand from "./components/Lacquerer/ProductByBrand";
import Cart from "./components/Lacquerer/Cart";


import CarpenterDashboard from "./components/Carpenter/CarpenterDashboard"; 
import CarpenterHeader from "./components/Carpenter/CarpenterHeader"; 
import LacquerOrders from "./components/Carpenter/LacquerOrders"; 
import Orders from "./components/Carpenter/lacquer-orders";
import FindLacquers from "./components/Carpenter/FindLacquers";



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
  }, [location.pathname]); // Teraz efekt wykona się przy każdej zmianie ścieżki
  

  if (isLoggedIn === null) {
    return <LoadingScreen />; // Pokazuje ekran ładowania, dopóki stan nie jest zaktualizowany
  }

  const isSellerPage = location.pathname.startsWith("/seller");
  const isLacquererPage = location.pathname === "/lacquerer-dashboard";

  return (
    <div>
      {/* Jeśli użytkownik ma rolę 'lakiernik', wyświetlamy LacquererHeader */}
      {userRole === "lakiernik" ? (
        <LacquererHeader />
      ) : (
        // Jeśli użytkownik nie jest 'lakiernik', ale jest 'stolarz', wyświetlamy CarpenterHeader
        userRole === "stolarz" ? (
          <CarpenterHeader />
        ) : (
          // Jeśli użytkownik nie jest 'lakiernik' ani 'stolarz', a nie jesteśmy na stronie sprzedawcy, wyświetlamy Header
          !isSellerPage && <Header />
        )
      )}

  

      <Routes>
        <Route path="/" element={<MainContent />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/seller-dashboard" element={<SellerDashboard />} /> 
        <Route path="/account" element={<Account />} /> 
        <Route path="/products" element={<Products />} /> 
        <Route path="/add-product" element={<AddProduct />} /> 
        <Route path="/orders" element={<OrderList />} /> 
        <Route path="/messages" element={<OrderMessages />} />      
        <Route path="/orders/:orderId/messages" element={<OrderMessages />} />

        <Route path="/lacquerer-dashboard" element={<LacquererDashboard />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/my-history" element={<LacquerHistory />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/order-list" element={<LacquerOrder />} />
        <Route path="/paint-message/:orderId" element={<PaintMessage />} />
        <Route path="/lacquers-shop" element={<LacquerShop />} />
        <Route path="/products/:userId/:brand" element={<ProductByBrand />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/carpenter-dashboard" element={<CarpenterDashboard />} />
        <Route path="/lacquer-orders" element={<LacquerOrders />} />
        <Route path="/lacquer-shop" element={<Orders />} />
        <Route path="/find-lacquerer" element={<FindLacquers />} />

        </Routes>

      <Footer />
    </div>
  );
};

export default App;
