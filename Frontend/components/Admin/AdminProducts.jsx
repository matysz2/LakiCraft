import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_adminProduct.scss";
import Header from "../Header";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Stan na komunikat o powodzeniu
  const navigate = useNavigate();

  // Funkcja do pobierania produktów z serwera
  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/products/allproduct", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" }, // Unikaj cache
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania produktów");
        }
        return res.json();
      })
      .then((data) => {
        setProducts([...data]); // Kopia tablicy, by wymusić render
        setFilteredProducts([...data]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/login");
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "admin") {
      navigate("/");
      return;
    }

    fetchProducts(); // Wywołanie funkcji do pobrania produktów przy początkowym załadowaniu
  }, [products.length]);

  const handleToggleProductStatus = async (productId, productName, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "listed" : "blocked";
    const actionText = newStatus === "listed" ? "wystawić" : "zablokować";
  
    if (!window.confirm(`Czy na pewno chcesz ${actionText} produkt ${productName}?`)) return;
  
    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}/status`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!res.ok) throw new Error(`Nie udało się ${actionText} produktu.`);
  
      // Odczekanie 500ms przed pobraniem nowych danych (dla serwera)
      setTimeout(fetchProducts, 500);
  
      setSuccessMessage(`Produkt ${productName} został ${actionText}.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć produkt ${productName}?`)) return;
  
    try {
      const res = await fetch(`http://localhost:8080/api/user/admin/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Nie udało się usunąć produktu.");
  
      // 🔥 USUWAMY PRODUKT LOKALNIE BEZ FETCHOWANIA CAŁEJ LISTY PONOWNIE
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setFilteredProducts((prevFiltered) => prevFiltered.filter((product) => product.id !== productId));
  
      // ✅ Komunikat o sukcesie
      setSuccessMessage(`Produkt ${productName} został usunięty.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      // W przypadku błędu, ustawienie komunikatu o błędzie
      setError(`Błąd usuwania: ${err.message}`);
      
      // Wyświetlanie komunikatu o błędzie na 3 sekundy
      setTimeout(() => setError(null), 1000);
    }
  };
  
  
  

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products.filter((product) =>
      ["name", "kod", "stock", "brand", "status", "user.name"]
        .some((key) => product[key]?.toString().toLowerCase().includes(term))
    );

    setFilteredProducts(filtered);
  };

  if (loading) return <div className="loading">Ładowanie...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;

  return (
    <div className="admin-product-list">
      <Header />
      <h1>Lista produktów</h1>
      <button className="btn-back" onClick={() => navigate(-1)}>Cofnij</button>

      <input
        type="text"
        placeholder="Wyszukaj produkt po kolumnie"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Komunikat o powodzeniu operacji */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Kod</th>
            <th>Stock</th>
            <th>Cena</th>
            <th>Marka</th>
            <th>Status</th>
            <th>Sprzedawca</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.kod}</td>
              <td>{product.stock}</td>
              <td>{product.price} zł</td>
              <td>{product.brand}</td>
              <td>{product.status}</td>
              <td>{product.user?.name || "Nieznany"}</td>
              <td>
                <button
                  className={`btn-status ${product.status === "blocked" ? "btn-list" : "btn-block"}`}
                  onClick={() => handleToggleProductStatus(product.id, product.name, product.status)}
                >
                  {product.status === "blocked" ? "Wystaw" : "Zablokuj"}
                </button>
                <button className="btn-delete" onClick={() => handleDeleteProduct(product.id, product.name)}>
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
