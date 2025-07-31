import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_findLacquers.scss";
import BASE_URL from '../config.js';

const FindLacquers = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [expandedLacquerer, setExpandedLacquerer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [formData, setFormData] = useState({
    lacquer: "",
    orderDate: new Date().toISOString(),
    shippingAddress: "",
    status: "Nowe",
    totalPrice: 0,
    carpenter: "",
    paintingMeters: "",
    appointment: null,
    client_id: null,
    userData: null,
    clientData: null,
  });

  const handleShowBusinessCard = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/business-card?userId=${userId}`);
      if (!response.ok) throw new Error("Brak wizytówki");
      const data = await response.json();
      setSelectedCard(data);
      setCardModalVisible(true);
    } catch (err) {
      alert("Nie udało się pobrać wizytówki.");
    }
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
      carpenter: parsedUserData.id,
      userData: parsedUserData,
    }));
  }, [navigate]);

  useEffect(() => {
    if (!userData) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/appointments/available`);
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
      client_id: lacquererId,
      appointment,
      clientData: lacquerer,
    }));
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_id || !formData.carpenter) {
      alert("Brak wymaganych danych.");
      return;
    }

    try {
      const totalPrice = formData.paintingMeters * 50;
      const orderData = {
        lacquer: formData.lacquer,
        orderDate: new Date().toISOString(),
        shippingAddress: formData.shippingAddress,
        status: formData.status,
        totalPrice,
        carpenter: {
          id: formData.carpenter,
          name: userData.firstName + " " + userData.lastName,
          email: userData.email,
          shippingAddress: userData.shippingAddress,
        },
        paintingMeters: formData.paintingMeters,
        appointment: {
          id: formData.appointment.id,
          date: formData.appointment.date,
          status: formData.appointment.status,
          description: formData.appointment.description || "",
          user: {
            id: formData.appointment.user.id,
            name: formData.appointment.user.name,
            email: formData.appointment.user.email,
          },
        },
        client: {
          id: formData.client_id,
          name: userData.firstName + " " + userData.lastName,
          email: userData.email,
          shippingAddress: userData.shippingAddress,
        },
      };

      const response = await fetch(`${BASE_URL}/api/lacquer-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Błąd podczas składania zamówienia.");

      alert("Zamówienie złożone pomyślnie!");
      setShowModal(false);
    } catch (error) {
      alert("Nie udało się złożyć zamówienia.");
    }
  };

  if (loading) return <div>Ładowanie...</div>;

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
              if (!appointment.user || typeof appointment.user === "number") return acc;
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
                <h3>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleShowBusinessCard(lacquerer.id);
                  }}>
                    {lacquerer.firstName} {lacquerer.lastName}
                  </a>
                </h3>
                <p>{lacquerer.shippingAddress}</p>
                <button className="toggle-btn" onClick={() => toggleLacquererDetails(lacquererId)}>
                  {expandedLacquerer === lacquererId ? "Ukryj terminy" : "Pokaż terminy"}
                </button>

                {expandedLacquerer === lacquererId && (
                  <div className="available-dates">
                    <h4>Wolne terminy:</h4>
                    <ul>
                      {availableDates.filter((a) => a.status.toLowerCase() === "wolny").map((appointment) => (
                        <li key={`appointment-${appointment.id}`}>
                          {new Date(appointment.date).toLocaleString("pl-PL")}
                          <button className="reserve-btn" onClick={() => handleReserve(lacquererId, appointment)}>
                            Zarezerwuj
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
        )}
      </section>

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

      {cardModalVisible && selectedCard && (
        <div className="modal card-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setCardModalVisible(false)}>✖️</button>
            <h2>{selectedCard.name}</h2>
            <p><strong>Specjalizacja:</strong> {selectedCard.jobTitle}</p>
            <p><strong>O mnie:</strong> {selectedCard.bio}</p>
            <p><strong>Kontakt:</strong> {selectedCard.contactEmail}</p>
            {selectedCard.profileImageUrl && (
              <img
                src={`${BASE_URL}/${selectedCard.profileImageUrl}`}
                alt="Profil lakiernika"
                width="150"
                height="150"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindLacquers;
