import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductsByBrand = () => {
  const { userId, brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Nowy stan do obsługi ładowania
  const [error, setError] = useState(null); // Stan błędu
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }

    // Resetowanie stanu przed każdym pobraniem
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/lacquers/${userId}/${brand}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Błąd serwera');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]); // Jeśli odpowiedź nie jest tablicą, ustaw pustą tablicę
          console.error("Odpowiedź nie jest tablicą:", data);
        }
      })
      .catch((error) => {
        setError(error.message); // Ustawienie komunikatu o błędzie
        setProducts([]); // W przypadku błędu ustaw pustą tablicę
        console.error("Błąd ładowania produktów:", error);
      })
      .finally(() => {
        setLoading(false); // Zakończenie ładowania
      });
  }, [userId, brand, navigate]);

  if (loading) {
    // Można dodać spinner lub komunikat o ładowaniu
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="products-by-brand">
      <h2>Produkty marki {brand} sprzedawcy {userId}</h2>
      <div className="products-list">
        {error ? (
          <p>Wystąpił błąd: {error}</p> // Komunikat o błędzie
        ) : products.length === 0 ? (
          <p>Brak produktów w tej marce.</p> // Komunikat, gdy brak produktów
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              {product.imagePath && (
                <img
                  src={`http://localhost:8080/${product.imagePath}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <p className="product-name">{product.name}</p>
              <p className="product-price">{product.price} PLN</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsByBrand;
