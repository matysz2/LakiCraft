import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_AdminLacquerOrders.scss";
import Header from "../Header";

const LacquerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");  // Dodany stan do filtrowania po dacie
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/lacquer-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Błąd podczas pobierania zamówień lakierowania.");
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.carpenter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.carpenter.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        return orderDate === new Date(dateFilter).toLocaleDateString();  // Porównanie dat
      });
    }
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`http://localhost:8080/api/admin/stats/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch(() => setError("Błąd podczas aktualizacji statusu zamówienia."));
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="lacquer-orders">
      <Header />
      <h1>Zamówienia lakierowania</h1>
      
      <button className="btn-back" onClick={() => navigate(-1)}>Cofnij do poprzedniej strony</button>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Szukaj po imieniu lub nazwisku stolarza"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">Wszystkie statusy</option>
          <option value="W realizacji">W realizacji</option>
          <option value="Zrealizowane">Zrealizowane</option>
          <option value="Anulowane">Anulowane</option>
        </select>
        {/* Filtr daty */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Stolarz</th>
            <th>Lakier</th>
            <th>Status</th>
            <th>Metry</th>
            <th>Łączna cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.carpenter.firstName} {order.carpenter.lastName}</td>
              <td>{order.lacquer}</td>
              <td>{order.status}</td>
              <td>{order.paintingMeters} m²</td>
              <td>{order.totalPrice} PLN</td>
              <td>
                {order.status === "Zrealizowane" ? (
                  <button className="btn-revert" onClick={() => handleUpdateStatus(order.id, "W realizacji")}>Przywróć</button>
                ) : (
                  <>
                    <button className="btn-update" onClick={() => handleUpdateStatus(order.id, "Zrealizowane")}>Zrealizuj</button>
                    <button className="btn-cancel" onClick={() => handleUpdateStatus(order.id, "Anulowane")}>Anuluj</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LacquerOrders;
