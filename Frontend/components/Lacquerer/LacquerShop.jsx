import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LacquerShop = () => {
  const [lacquers, setLacquers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Sprawdzenie logowania
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

    // Pobieranie lakierów przez fetch
    fetch("http://localhost:8080/api/lacquers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "userId": userId, // Wysyłamy userId w nagłówku
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania lakierów");
        }
        return response.json();
      })
      .then((data) => setLacquers(data))
      .catch((error) => console.error("Błąd ładowania lakierów:", error));
  }, [navigate]);

  return (
    <div className="lacquer-shop">
      {lacquers.map((lacquer) => (
        <div className="lacquer-card" key={lacquer.id}>
          {/* Warunkowe renderowanie zdjęcia, jeśli istnieje */}
          {lacquer.imagePath && (
            <img
              src={`http://localhost:8080/${lacquer.imagePath}`}
              alt={lacquer.name}
              className="lacquer-image"
            />
          )}
          <p className="lacquer-brand">
            {lacquer.brand || "Brak marki"} <span>({lacquer.user.name})</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default LacquerShop;
