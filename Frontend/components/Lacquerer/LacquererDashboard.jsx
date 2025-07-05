import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LacquerHeader from "./LacquererHeader";
import "../../styles/_lacquererDashboard.scss";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const LacquererDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ pendingOrders: "", customerOrders: "", appointments: "" });

  // Nowe stany dla formularza dodawania terminu
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');

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

  const fetchLacquerOrders = async (userId) => {
    const response = await fetch(`https://${BASE_URL}/${userId}/pending`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Nie udało się pobrać zamówień lakierowania.");
    return await response.json();
  };

  const fetchCustomerOrders = async (userId) => {
    const response = await fetch(`https://${BASE_URL}/api/orders/customer`, {
      headers: { "userId": userId },
    });
    if (!response.ok) throw new Error("Błąd serwera przy pobieraniu zamówień klienta.");
    return await response.json();
  };

  const fetchAppointments = async (userId) => {
    const response = await fetch(`https://${BASE_URL}/api/appointments?userId=${userData.id}`);
    if (!response.ok) throw new Error("Błąd serwera");
    return await response.json();
  };

  const handleAddAppointment = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !description) {
      setErrors({ appointments: "Wybierz datę, godzinę i dodaj opis." });
      return;
    }

    const newAppointment = {
      date: `${selectedDate} ${selectedTime}`,
      status: 'Wolny',
      description: description,
      user: { id: userData.id }, // Dodaj ID użytkownika
    };
    

    try {
      const response = await fetch(`https://${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        const savedAppointment = await response.json();
        setAppointments([...appointments, savedAppointment]);
        setIsFormVisible(false);
        setSelectedDate('');
        setSelectedTime('');
        setDescription('');
      } else {
        throw new Error("Błąd podczas dodawania terminu.");
      }
    } catch (error) {
      console.error("Błąd dodawania terminu:", error);
      alert("Nie udało się dodać terminu.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`https://${BASE_URL}/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setAppointments(appointments.filter(appt => appt.id !== appointmentId));
        alert("Termin został pomyślnie usunięty.");
      } else {
        throw new Error("Błąd podczas usuwania terminu.");
      }
    } catch (error) {
      console.error("Błąd usuwania terminu:", error);
      alert("Nie udało się usunąć terminu.");
    }
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
              <div key={appt.id} className="appointment-item">
                <p>{formattedDate} - Status: {appt.status} - {appt.description}</p>
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
                  onChange={handleDateChange}
                />
              </label>
              <label>
                Wybierz godzinę:
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleTimeChange}
                />
              </label>
              <label>
                Opis:
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Wpisz opis terminu"
                />
              </label>
              <button type="submit">Zatwierdź</button>
            </form>
          </div>
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

      {/* Sekcja zamówień klienta */}
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
