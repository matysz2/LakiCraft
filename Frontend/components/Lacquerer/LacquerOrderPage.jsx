import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config.js';

// Statyczne fallbacki
import paintImage from '../image/paint.webp';
import emptyImage from '../image/empty.webp';

const LacquerOrderPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderImages, setOrderImages] = useState({
    lacquerOrders: null,
    lacquerHistory: null,
  });
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.role === 'lakiernik') {
        setIsLoggedIn(true);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Pobierz obrazki z backendu
    fetch(`https://${BASE_URL}/api/lacquer-order-images`)
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania obrazków");
        return res.json();
      })
      .then((data) => {
        // Zakładam, że backend zwraca { lacquerOrders: "url1", lacquerHistory: "url2" }
        setOrderImages({
          lacquerOrders: data.lacquerOrders || null,
          lacquerHistory: data.lacquerHistory || null,
        });
      })
      .catch((err) => {
        console.error("Błąd pobierania obrazków:", err);
      })
      .finally(() => {
        setLoadingImages(false);
      });
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!isLoggedIn) return null;

  if (loadingImages) return <div>Ładowanie obrazków...</div>;

  return (
    <div className="lacquer-order-page">
      <div
        className="section"
        onClick={() => handleNavigate('/order-list')}
      >
        <div className="section-title">Zlecenia Lakierowania</div>
        <div className="section-content">
          <img
            src={orderImages.lacquerOrders || paintImage}
            alt="Zlecenia Lakierowania"
          />
        </div>
      </div>

      <div
        className="section"
        onClick={() => handleNavigate('/my-history')}
      >
        <div className="section-title">Zamówienia Lakierów</div>
        <div className="section-content">
          <img
            src={orderImages.lacquerHistory || emptyImage}
            alt="Zamówienia Lakierów"
          />
        </div>
      </div>
    </div>
  );
};

export default LacquerOrderPage;
