import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config.js';

// Import obrazów lokalnych
import paintImage from '../../image/paint.webp';
import emptyImage from '../../image/shopping_cart.png';


const LacquerOrderPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="lacquer-order-page">
      <div
        className="section"
        onClick={() => handleNavigate('/order-list')}
      >
        <div className="section-title">Zlecenia Lakierowania</div>
        <div className="section-content">
          <img
            src={paintImage}
            alt="Zlecenia Lakierowania"
            className="lacquer-image"
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
            src={emptyImage}
            alt="Zamówienia Lakierów"
            className="lacquer-image"
          />
        </div>
      </div>
    </div>
  );
};

export default LacquerOrderPage;
