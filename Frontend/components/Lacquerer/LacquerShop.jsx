import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../config.js';

const LacquerShop = () => {
  const [lacquers, setLacquers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetch = async () => {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        navigate("/");
        return;
      }

      const userId = JSON.parse(storedUserData)?.id;
      if (!userId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`https://${BASE_URL}/api/lacquers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "userId": userId,
          },
        });

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania lakierów");
        }

        const data = await response.json();
        setLacquers(data);
      } catch (error) {
        console.error("Błąd ładowania lakierów:", error);
      }
    };

    checkAndFetch();
  }, [navigate]);

  const handleCardClick = (brand, userId) => {
    navigate(`/products/${userId}/${brand}`);
  };

  return (
    <div className="lacquer-shop">
      {lacquers.length === 0 ? (
        <p>Ładowanie lakierów lub brak dostępnych produktów.</p>
      ) : (
        lacquers.map((lacquer) => {
          // Budujemy URL tylko jeśli jest imagePath
          const imageUrl = lacquer.imagePath
            ? `https://lakicraft-production.up.railway.app/${lacquer.imagePath}`
            : null;

          return (
            <div
              className="lacquer-card"
              key={lacquer.id}
              onClick={() => handleCardClick(lacquer.brand, lacquer.user.id)}
              style={{ cursor: "pointer" }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={lacquer.name || "Zdjęcie lakieru"}
                  className="lacquer-image"
                  onError={(e) => { e.target.onerror = null; /* nie ustawiamy fallbacku */ }}
                />
              )}
              <p className="lacquer-brand">
                Marka: {lacquer.brand || "Brak marki"} <span> (Sprzedawca: {lacquer.user?.name || "Brak danych"})</span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LacquerShop;
