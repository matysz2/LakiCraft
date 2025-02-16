import React from "react";
import ReactDOM from "react-dom/client"; // Zmieniliśmy na 'react-dom/client'
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // Importujemy BrowserRouter
import "./styles/main.scss";


const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderujemy aplikację w BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
