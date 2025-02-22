import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_SellerHeader.scss"; // Stylizacja nagłówka

const SellerHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Funkcja do przełączania stanu menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Funkcja do nawigacji
  const handleNavigation = (path) => {
    navigate(path); // Przekierowanie na wybraną stronę
    setMenuOpen(false); // Zamknięcie menu po kliknięciu
  };

  // Funkcja obsługi wylogowania
  const handleLogout = async () => {
    try {
      // Pobierz numer sesji z ciasteczek lub sessionStorage/localStorage (np. z JSESSIONID)
      const sessionId = document.cookie.split(';').find(cookie => cookie.trim().startsWith('JSESSIONID='));
  
      // Jeśli numer sesji istnieje, usuń prefiks "JSESSIONID="
      const sessionIdValue = sessionId ? sessionId.split('=')[1] : null;
  
      const response = await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-Id": sessionIdValue,  // Wysyłamy numer sesji w nagłówku
        },
        credentials: "include", // Ważne, aby uwzględnić ciasteczka
      });
  
      if (response.ok) {
        // Usuwamy dane użytkownika z localStorage
        localStorage.removeItem("userData");
  
        // Przekierowanie na stronę główną
        navigate("/");
      } else {
        console.error("Błąd wylogowania na backendzie");
      }
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };
  

  return (
    <header className="header">
      <div className="logo">
        <img src="/image/logo.png" alt="Logo" />
        <span>LakiCraft</span>
      </div>
      <div className={`user-menu ${menuOpen ? "open" : ""}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className="dropdown-menu">
          <li onClick={() => handleNavigation("/seller-dashboard")}>Home</li>
          <li onClick={() => handleNavigation("/account")}>Moje Konto</li>
          <li onClick={() => handleNavigation("/orders")}>Zamówienia</li>
          <li onClick={() => handleNavigation("/products")}>Produkty</li>
          <li onClick={handleLogout} className="logout-btn">Wyloguj</li>
        </ul>
      </div>
    </header>
  );
};

export default SellerHeader;
