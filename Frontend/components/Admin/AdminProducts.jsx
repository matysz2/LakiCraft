import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_adminProduct.scss";
import Header from "../Header";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    fetch("http://localhost:8080/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania produktów");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleBlockProduct = (productId, productName) => {
    const isConfirmed = window.confirm(`Czy na pewno chcesz zablokować produkt ${productName}?`);

    if (!isConfirmed) return;

    fetch(`http://localhost:8080/api/admin/products/${productId}/block`, {
      method: "PUT",
    })
      .then((res) => {
        if (res.ok) {
          setProducts(products.map((product) =>
            product.id === productId ? { ...product, status: "blocked" } : product
          ));
        } else {
          setError("Nie udało się zablokować produktu.");
        }
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="admin-product-list">
      <Header />
      <h1>Lista produktów</h1>
      <button className="btn-back" onClick={() => navigate(-1)}>Cofnij</button>
      
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
          {products.map((product) => (
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
                {product.status !== "blocked" ? (
                  <button className="btn-block" onClick={() => handleBlockProduct(product.id, product.name)}>Zablokuj</button>
                ) : (
                  <span>Zablokowany</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
