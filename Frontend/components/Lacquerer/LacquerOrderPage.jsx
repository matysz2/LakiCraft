import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Używamy useNavigate
import BASE_URL from '../config.js';  // Zmienna BASE_URL

// Import obrazów jako zmienne
import paintImage from '../image/paint.webp';
import emptyImage from '../image/empty.webp';

const LacquerOrderPage = () => {
  const navigate = useNavigate();  // Używamy useNavigate
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');  // Pobieramy dane użytkownika z localStorage

    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.role === 'lakiernik') {
        setIsLoggedIn(true);  // Użytkownik jest zalogowany
      } else {
        navigate('/');  // Jeśli użytkownik nie ma roli "lakiernik", przekierowujemy na stronę główną
      }
    } else {
      navigate('/');  // Jeśli nie ma danych w localStorage, przekierowujemy na stronę logowania
    }
  }, [navigate]);

  const handleNavigate = (path) => {
    navigate(path);  // Przekierowanie do odpowiedniej strony
  };

  if (!isLoggedIn) {
    return null;  // Zwróć null, jeśli użytkownik nie jest zalogowany
  }

  return (
    <div className="lacquer-order-page">
      <div 
        className="section"
        onClick={() => handleNavigate('/order-list')}  // Przekierowanie do strony Zleceń Lakierowania
      >
        <div className="section-title">Zlecenia Lakierowania</div>
        <div className="section-content">
          <img src={paintImage} alt="Zlecenia Lakierowania" />
        </div>
      </div>

      <div 
        className="section"
        onClick={() => handleNavigate('/my-history')}  // Przekierowanie do strony Zamówień Lakierów
      >
        <div className="section-title">Zamówienia Lakierów</div>
        <div className="section-content">
          <img src={emptyImage} alt="Zamówienia Lakierów" />
        </div>
      </div>
    </div>
  );
};

export default LacquerOrderPage;
