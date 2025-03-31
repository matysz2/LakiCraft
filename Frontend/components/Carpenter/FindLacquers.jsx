import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_findLacquers.scss";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const FindLacquers = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [expandedLacquerer, setExpandedLacquerer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    lacquer: "",
    orderDate: new Date().toISOString(),
    shippingAddress: "",
    status: "Nowe",
    totalPrice: 0,
    carpenter: "", // Ensure carpenter is properly set from userData
    paintingMeters: "",
    appointment: null,
    client_id: null, // This needs to be set in handleReserve
    userData: null,
    clientData: null,
  });

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    if (parsedUserData.role !== "stolarz") {
      navigate("/", { replace: true });
      return;
    }
    setUserData(parsedUserData);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: parsedUserData.shippingAddress,
      carpenter: parsedUserData.id, // Set carpenter from userData
      userData: parsedUserData,
    }));
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://${BASE_URL}/api/appointments/available`);
        if (!response.ok) throw new Error("Błąd podczas pobierania dostępnych terminów.");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setErrors("Nie udało się pobrać dostępnych terminów.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userData]);

  const toggleLacquererDetails = (lacquererId) => {
    setExpandedLacquerer(expandedLacquerer === lacquererId ? null : lacquererId);
  };

  const handleReserve = (lacquererId, appointment) => {
    const lacquerer = appointments
      .flatMap((appointment) => appointment.user)
      .find((user) => user.id === lacquererId);
  
    setFormData((prev) => ({
      ...prev,
      lacquer: "", 
      client_id: lacquererId, // Ensure client_id is set
      appointment, 
      clientData: lacquerer, 
    }));
    setShowModal(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.client_id || !formData.carpenter) {
      alert("Brak wymaganych danych: klient i stolarz muszą być określeni.");
      return;
    }
  
    try {
      const totalPrice = formData.paintingMeters * 50; // Adjust pricing logic if necessary
  
      // Construct the orderData with full objects, not just ids
      const orderData = {
        lacquer: formData.lacquer,
        orderDate: new Date().toISOString(), // Current date in ISO format
        shippingAddress: formData.shippingAddress,
        status: formData.status,
        totalPrice: totalPrice,
        carpenter: {
          id: formData.carpenter, // Carpenter ID wrapped in object
          name: userData.firstName + " " + userData.lastName,
          email: userData.email,
          shippingAddress: userData.shippingAddress,
        },
        paintingMeters: formData.paintingMeters,
        appointment: {
          id: formData.appointment.id, // Appointment ID
          date: formData.appointment.date, // Appointment date
          status: formData.appointment.status,
          description: formData.appointment.description || "", // Default empty description
          user: {
            id: formData.appointment.user.id, // Lacquerer ID wrapped in object
            name: formData.appointment.user.name, // Lacquerer name
            email: formData.appointment.user.email, // Lacquerer email
          },
        },
        client: {
          id: formData.client_id, // Client ID wrapped in object
          name: userData.firstName + " " + userData.lastName, // Assuming client data is in userData
          email: userData.email,
          shippingAddress: userData.shippingAddress,
        },
      };
  
      console.log("Wysyłane zamówienie:", JSON.stringify(orderData, null, 2));
  
      const response = await fetch(`http://${BASE_URL}/api/lacquer-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Bez "charset=UTF-8"
        },
        body: JSON.stringify(orderData),
      });
      
  
      if (!response.ok) throw new Error("Błąd podczas składania zamówienia.");
      alert("Zamówienie złożone pomyślnie!");
      setShowModal(false);
    } catch (error) {
      alert("Nie udało się złożyć zamówienia.");
    }
  };
  


  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="find-lacquers">
      <h2>Wybierz lakiernika i termin</h2>
      {errors && <p className="error">{errors}</p>}
      <section className="lacquerers-section">
        {appointments.length === 0 ? (
          <p>Brak dostępnych lakierników</p>
        ) : (
          Object.entries(
            appointments.reduce((acc, appointment) => {
              if (!appointment.user || typeof appointment.user === "number") {
                return acc;
              }

              const lacquererId = appointment.user.id;
              if (!acc[lacquererId]) {
                acc[lacquererId] = {
                  lacquerer: appointment.user,
                  availableDates: [],
                };
              }
              acc[lacquererId].availableDates.push(appointment);
              return acc;
            }, {})
          )
            .filter(([_, { lacquerer }]) => lacquerer.firstName && lacquerer.lastName)
            .map(([lacquererId, { lacquerer, availableDates }]) => (
              <div key={`lacquerer-${lacquererId}`} className="lacquerer-item">
                <h3>{lacquerer.firstName} {lacquerer.lastName}</h3>
                <p>{lacquerer.shippingAddress}</p>
                <button className="toggle-btn" onClick={() => toggleLacquererDetails(lacquererId)}>
                  {expandedLacquerer === lacquererId ? "Ukryj terminy" : "Pokaż terminy"}
                </button>

                {expandedLacquerer === lacquererId && (
                  <div className="available-dates">
                    <h2>Wolne terminy:</h2>
                    <ul>
                      {availableDates.length > 0 ? (
                        availableDates
                          .filter((appointment) => appointment.status.toLowerCase() === "wolny")
                          .map((appointment) => (
                            <li key={`appointment-${appointment.id}`}>
                              {new Date(appointment.date).toLocaleString("pl-PL")}
                              <button className="reserve-btn" onClick={() => handleReserve(lacquererId, appointment)}>
                                Zarezerwuj
                              </button>
                            </li>
                          ))
                      ) : (
                        <p>Brak dostępnych terminów</p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
        )}
      </section>

      {/* Modal do rezerwacji */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Zamówienie lakierowania</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Wybierz lakier:
                <input type="text" value={formData.lacquer} onChange={(e) => setFormData({ ...formData, lacquer: e.target.value })} required />
              </label>
              <label>
                Metry do lakierowania:
                <input type="number" value={formData.paintingMeters} onChange={(e) => setFormData({ ...formData, paintingMeters: e.target.value })} required />
              </label>
              <button type="submit" className="submit">Zamów</button>
              <button type="button" className="cancel" onClick={() => setShowModal(false)}>Anuluj</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindLacquers;
