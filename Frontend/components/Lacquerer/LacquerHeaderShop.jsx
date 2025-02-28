import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LacquerHeaderShop = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Liczba unikalnych produktów w koszyku
  const navigate = useNavigate();

  // Załaduj liczbę unikalnych produktów z localStorage
  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(savedCart.length); // Aktualizacja stanu
  };

  // Załaduj dane przy pierwszym renderze
  useEffect(() => {
    loadCart();
  }, []);

  // Nasłuchuj zmian w localStorage i wymuś aktualizację
  useEffect(() => {
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Obsługa zmian w koszyku
  const updateCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); // Wymuś aktualizację we wszystkich komponentach
  };

  // Funkcja do przełączania menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Nawigacja
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Wylogowanie
  const handleLogout = async () => {
    try {
      const sessionId = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("JSESSIONID="));
      const sessionIdValue = sessionId ? sessionId.split("=")[1] : null;

      const response = await fetch("http://localhost:8080/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-Id": sessionIdValue,
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("userData");
        localStorage.removeItem("cart"); // Usunięcie koszyka po wylogowaniu
        updateCart([]); // Aktualizacja liczby produktów w koszyku
        navigate("/");
      } else {
        console.error("Błąd wylogowania na backendzie");
      }
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  return (
    <header className="lacquer-header">
      <div className="logo">
        <img src="/image/logo.png" alt="Logo" />
        <span>LakiCraft</span>
      </div>

      <div className={`user-menu ${menuOpen ? "open" : ""}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className="dropdown-menu">
          <li onClick={() => handleNavigation("/lacquerer-dashboard")}>
            Strona główna
          </li>
          <li onClick={() => handleNavigation("/my-services")}>Moje usługi</li>
          <li onClick={() => handleNavigation("/my-order")}>Zamówienia</li>
          <li onClick={() => handleNavigation("/lacquers-shop")}>
            Zakup lakierów
          </li>
          <li onClick={() => handleNavigation("/account")}>Moje konto</li>
          <li onClick={handleLogout} className="logout-btn">
            Wyloguj
          </li>
        </ul>
      </div>

      {/* Ikona koszyka z liczbą unikalnych produktów */}
      <div className="cart-icon" onClick={() => navigate("/cart")}>
        <img src="/image/shopping_cart2.png" alt="Koszyk" />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </div>
    </header>
  );
};

export default LacquerHeaderShop;
