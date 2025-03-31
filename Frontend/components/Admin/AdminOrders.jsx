import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_OrdersAdmin.scss";
import Header from "../Header";
import BASE_URL from '../config.js';  // Zmienna BASE_URL


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [filters, setFilters] = useState({
    id: "",
    customerName: "",
    sellerName: "",
    status: "",
    date: "", // Dodany filtr po dacie
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/login");
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    setRole(parsedUserData.role);

    if (parsedUserData.role !== "admin") {
      navigate("/");
      return;
    }

    // Fetch orders from the backend
    fetch(`http://${BASE_URL}/api/orders/admin`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania zamówień");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`http://${BASE_URL}/api/orders/admin/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas aktualizacji statusu zamówienia");
        }
        return res.json();
      })
      .then((updatedOrder) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
          )
        );
        setFilteredOrders((prevFilteredOrders) =>
          prevFilteredOrders.map((order) =>
            order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
          )
        );
      })
      .catch((err) => setError(err.message));
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const filteredData = orders.filter((order) => {
      const customerName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase();
      const sellerName = `${order.seller.firstName} ${order.seller.lastName}`.toLowerCase();

      const orderDate = new Date(order.orderDate).toLocaleDateString("en-CA"); // Format YYYY-MM-DD

      // Używamy porównania daty w formacie 'YYYY-MM-DD'
      return (
        (order.id.toString().includes(updatedFilters.id.toLowerCase()) || updatedFilters.id === "") &&
        (customerName.includes(updatedFilters.customerName.toLowerCase()) || updatedFilters.customerName === "") &&
        (sellerName.includes(updatedFilters.sellerName.toLowerCase()) || updatedFilters.sellerName === "") &&
        (order.status.toLowerCase().includes(updatedFilters.status.toLowerCase()) || updatedFilters.status === "") &&
        // Filtrowanie po dacie
        (orderDate.includes(updatedFilters.date) || updatedFilters.date === "")
      );
    });

    setFilteredOrders(filteredData);
  };

  const handleResetFilters = () => {
    setFilters({
      id: "",
      customerName: "",
      sellerName: "",
      status: "",
      date: "",
    });
    setFilteredOrders(orders);
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="orders">
      <Header />
      <h1>Lista zamówień lakierów</h1>

      <div className="filters">
        <input
          type="text"
          name="id"
          placeholder="Filtruj po ID"
          value={filters.id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="customerName"
          placeholder="Filtruj po kliencie"
          value={filters.customerName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="sellerName"
          placeholder="Filtruj po sprzedawcy"
          value={filters.sellerName}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="status"
          placeholder="Filtruj po statusie"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <input
          type="date" // Input typu date do filtrowania po dacie
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
      </div>

     

      {/* Przycisk Cofnij do poprzedniej strony */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        Cofnij do poprzedniej strony
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Klient</th>
            <th>Sprzedawca</th>
            <th>Status</th>
            <th>Łączna cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.user.firstName} {order.user.lastName}</td>
              <td>{order.seller.firstName} {order.seller.lastName}</td>
              <td>{order.status}</td>
              <td>{order.totalPrice} PLN</td>
              <td>
                <button
                  className="btn-update"
                  onClick={() => handleUpdateStatus(order.id, "Zrealizowane")}
                >
                  Zrealizuj
                </button>
                <button
                  className="btn-update"
                  onClick={() => handleUpdateStatus(order.id, "Anulowane")}
                >
                  Anuluj
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
