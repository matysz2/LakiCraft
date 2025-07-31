import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LacquerHeader from "./LacquererHeader";
import "../../styles/_lacquererDashboard.scss";
import BASE_URL from "../config.js";

const LacquererDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    pendingOrders: "",
    customerOrders: "",
    appointments: "",
  });

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");

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

        const [pendingOrdersRes, customerOrdersRes, appointmentsRes] =
          await Promise.allSettled([
            fetchLacquerOrders(userData.id),
            fetchCustomerOrders(userData.id),
            fetchAppointments(userData.id),
          ]);

        if (pendingOrdersRes.status === "fulfilled") {
          setPendingOrders(pendingOrdersRes.value);
        } else {
          setErrors((prev) => ({
            ...prev,
            pendingOrders: "Nie udało się pobrać zamówień lakierowania.",
          }));
        }

        if (customerOrdersRes.status === "fulfilled") {
          setCustomerOrders(customerOrdersRes.value);
        } else {
          setErrors((prev) => ({
            ...prev,
            customerOrders: "Nie udało się pobrać Twoich zamówień.",
          }));
        }

        if (appointmentsRes.status === "fulfilled") {
          setAppointments(appointmentsRes.value);
        } else {
          setErrors((prev) => ({
            ...prev,
            appointments: "Nie udało się pobrać terminów.",
          }));
        }
      } catch (error) {
        console.error("Błąd ogólny:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const fetchLacquerOrders = async (userId) => {
    const response = await fetch(`${BASE_URL}/${userId}/pending`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error("Nie udało się pobrać zamówień lakierowania.");
    const text = await response.text();
    return text ? JSON.parse(text) : [];
  };

  const fetchCustomerOrders = async (userId) => {
const response = await fetch(`${BASE_URL}/api/orders/user-orders`, {
      headers: { userId },
    });
    if (!response.ok)
      throw new Error("Błąd serwera przy pobieraniu zamówień klienta.");
    return await response.json();
  };

  const fetchAppointments = async (userId) => {
    const response = await fetch(
      `${BASE_URL}/api/appointments?userId=${userId}`
    );
    if (!response.ok) throw new Error("Błąd serwera");
    return await response.json();
  };

  const handleAddAppointment = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !description) {
      setErrors({ appointments: "Wybierz datę, godzinę i dodaj opis." });
      return;
    }

    const newAppointment = {
      date: `${selectedDate} ${selectedTime}`,
      status: "Wolny",
      description,
      user: { id: userData.id },
    };

    try {
      const response = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        const savedAppointment = await response.json();
        setAppointments([...appointments, savedAppointment]);
        setIsFormVisible(false);
        setSelectedDate("");
        setSelectedTime("");
        setDescription("");
      } else throw new Error();
    } catch (error) {
      console.error("Błąd dodawania terminu:", error);
      alert("Nie udało się dodać terminu.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAppointments(appointments.filter((appt) => appt.id !== id));
        alert("Termin został usunięty.");
      } else throw new Error();
    } catch (err) {
      console.error("Błąd usuwania terminu:", err);
      alert("Nie udało się usunąć terminu.");
    }
  };

  const toggleOrderDetails = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="lacquerer-dashboard">
      <LacquerHeader />
      <h1>Witaj, {userData?.name || "Nieznany użytkownik"} w panelu lakiernika</h1>

      <section className="appointments">
        <h2>Moje terminy:</h2>
        {errors.appointments && <p className="error">{errors.appointments}</p>}
        {appointments.length > 0 ? (
          appointments.map((appt) => {
            const formattedDate = new Date(appt.date).toLocaleString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <div key={appt.id} className="appointment-item">
                <p>
                  {formattedDate} - Status: {appt.status} - {appt.description}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAppointment(appt.id)}
                >
                  Usuń termin
                </button>
              </div>
            );
          })
        ) : (
          <p>Brak dostępnych terminów.</p>
        )}
        <button onClick={handleAddAppointment}>Dodaj termin</button>
        {isFormVisible && (
          <div className="appointment-form">
            <form onSubmit={handleSubmitAppointment}>
              <label>
                Wybierz datę:
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
              <label>
                Wybierz godzinę:
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </label>
              <label>
                Opis:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Wpisz opis terminu"
                />
              </label>
              <button type="submit">Zatwierdź</button>
            </form>
          </div>
        )}
      </section>

      <section className="orders">
        <h2>Oczekujące zamówienia lakierowania:</h2>
        {errors.pendingOrders && <p className="error">{errors.pendingOrders}</p>}
        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div key={order.id} className="order">
              <p><strong>Zamówienie #{order.id}</strong></p>
              <p>Klient: {order.carpenter?.name || "Nieznany"}</p>
              <p>Lakier: {order.lacquer}</p>
              <p>Status: {order.status}</p>
              <p>Data zamówienia: {new Date(order.orderDate).toLocaleString("pl-PL")}</p>
              <p>Cena: {order.totalPrice} zł</p>
              <p>Ilość metrów do malowania: {order.paintingMeters} m</p>
              {order.items?.length > 0 && (
                <div className="order-items">
                  <h4>Pozycje:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <p>Produkt: {item.productName}</p>
                      <p>Ilość: {item.quantity}</p>
                      <p>Cena: {item.price} zł</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Brak zamówień lakierowania.</p>
        )}
      </section>

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
              <p>Sprzedawca: {order.sellerName || "Nieznany"}</p>
              <button onClick={() => toggleOrderDetails(order.id)}>
                {expandedOrder === order.id ? "Ukryj szczegóły" : "Pokaż szczegóły"}
              </button>
              {expandedOrder === order.id && order.items?.length > 0 && (
                <div className="order-items">
                  <h4>Pozycje:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <p>Produkt: {item.productName}</p>
                      <p>Ilość: {item.quantity}</p>
                      <p>Cena: {item.price} zł</p>
                    </div>
                  ))}
                </div>
              )}
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
