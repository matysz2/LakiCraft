import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LacquerHeader from "./LacquererHeader";
import "../../styles/_lacquererDashboard.scss";

const LacquererDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]); // zamówienia lakierowania oczekujące realizacji
  const [customerOrders, setCustomerOrders] = useState([]); // zamówienia klienta pobrane z endpointu /customer
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ pendingOrders: "", customerOrders: "", appointments: "" });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }
    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "lakiernik") {
      navigate("/");
      return;
    }
    setUserData(parsedUserData);
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrors({ pendingOrders: "", customerOrders: "", appointments: "" });

        const [pendingOrdersRes, customerOrdersRes, appointmentsRes] = await Promise.allSettled([
          fetchLacquerOrders(userData.id),
          fetchCustomerOrders(userData.id),
          fetchAppointments(userData.id),
        ]);

        if (pendingOrdersRes.status === "fulfilled") {
          setPendingOrders(pendingOrdersRes.value);
        } else {
          setErrors(prev => ({ ...prev, pendingOrders: "Nie udało się pobrać zamówień lakierowania." }));
        }

        if (customerOrdersRes.status === "fulfilled") {
          setCustomerOrders(customerOrdersRes.value);
        } else {
          setErrors(prev => ({ ...prev, customerOrders: "Nie udało się pobrać Twoich zamówień." }));
        }

        if (appointmentsRes.status === "fulfilled") {
          setAppointments(appointmentsRes.value);
        } else {
          setErrors(prev => ({ ...prev, appointments: "Nie udało się pobrać terminów." }));
        }
      } catch (error) {
        console.error("Błąd ogólny:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  // Funkcja pobierająca oczekujące zamówienia lakierowania dla lakiernika
  const fetchLacquerOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/${userId}/pending`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Nie udało się pobrać zamówień lakierowania.");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Błąd przy pobieraniu zamówień lakierowania:", error);
      throw new Error("Błąd przy pobieraniu zamówień lakierowania.");
    }
  };
  
  
  // Funkcja pobierająca zamówienia klienta (wg kontrolera GET /customer)
  const fetchCustomerOrders = async (userId) => {
    const response = await fetch(`http://localhost:8080/api/orders/customer`, {
      headers: {
        "userId": userId,
      },
    });
    if (!response.ok) throw new Error("Błąd serwera przy pobieraniu zamówień klienta.");
    return await response.json();
  };
// Funkcja do aktualizacji statusu zamówienia
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:8080/api/lacquerOrders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Nie udało się zaktualizować statusu.");

    // Aktualizacja stanu po zmianie statusu
    setPendingOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (error) {
    console.error("Błąd przy zmianie statusu:", error);
  }
};

  const fetchAppointments = async (userId) => {
    const response = await fetch(`http://localhost:8080/api/appointments?userId=${userId}`);
    if (!response.ok) throw new Error("Błąd serwera");
    return await response.json();
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="lacquerer-dashboard">
      <LacquerHeader />
      <h1>Witaj, {userData?.name || "Nieznany użytkownik"} w panelu lakiernika</h1>

      {/* Sekcja terminów */}
      <section className="appointments">
        <h2>Moje terminy:</h2>
        {errors.appointments && <p className="error">{errors.appointments}</p>}
        {appointments.length > 0 ? (
          appointments.map((appt) => {
            const formattedDate = new Date(appt.date).toLocaleString('pl-PL', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <p key={appt.id}>
                {formattedDate} - Status: {appt.status} - {appt.description}
              </p>
            );
          })
        ) : (
          <p>Brak dostępnych terminów.</p>
        )}
      </section>

      {/* Sekcja oczekujących zamówień lakierowania */}
<section className="orders">
  <h2>Oczekujące zamówienia lakierowania:</h2>
  {errors.pendingOrders && <p className="error">{errors.pendingOrders}</p>}
  {pendingOrders.length > 0 ? (
    pendingOrders.map((order) => (
      <div key={order.id} className="order">
        <p><strong>Zamówienie #{order.id}</strong></p>
        <p>Klient: {order.carpenter.name || "Nieznany"}</p>
        <p>Lakier: {order.lacquer}</p>
        <p>Status: {order.status}</p>
        <p>Data zamówienia: {new Date(order.orderDate).toLocaleString("pl-PL")}</p>
        <p>Cena: {order.totalPrice} zł</p>
        <p>Ilość metrów do malowania: {order.paintingMeters} m</p>

     
      </div>
    ))
  ) : (
    <p>Brak zamówień lakierowania.</p>
  )}
</section>

      {/* Sekcja zamówień klienta oparta o controller GET /customer */}
      <section className="customer-orders">
        <h2>Twoje zamówienia lakierów:</h2>
        {errors.customerOrders && <p className="error">{errors.customerOrders}</p>}
        {customerOrders.length > 0 ? (
          customerOrders.map((order) => (
            <div key={order.id} className="order">
              <p><strong>Zamówienie #{order.id}</strong></p>
              <p>Data zamówienia: {new Date(order.orderDate).toLocaleString("pl-PL")}</p>
              <p>Status: {order.status}</p>
              <p>Kwota: {order.totalPrice} zł</p>
              <p>Sprzedawca: {order.seller?.name || "Nieznany"}</p>
              {/* Możesz dodać dodatkowe szczegóły z orderItems, jeśli są potrzebne */}
            </div>
          ))
        ) : (
          <p>Brak zamówień.</p>
        )}
      </section>
    </div>
  );
};

export default LacquererDashboard;
