import React from "react";
import "../styles/main.scss";
import logo from "../image/logo2.jpg"; // Importowanie obrazka

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo-container">
      <img src={logo} alt="LakiCraft Logo" className="header-logo" /> {/* Obrazek */}
      <h1>LAKICRAFT - Twoje lakiery i usługi stolarskie</h1>
      </div>
    </header>
    
  );
};

export default Header;
