import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import SellerHeader from "./SellerHeaders";
import '../../styles/main.scss'; // Upewnij się, że masz odpowiednią ścieżkę do pliku

const OrderMessages = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Dodanie komunikatu o sukcesie

  useEffect(() => {
    console.log("Komponent OrderMessages zamontowany, ustawiam isLoading na true");
    setIsLoading(true); // Resetowanie loading przy wejściu

    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }

    console.log("orderId z useParams: ", orderId);

    if (!orderId) {
      setError("Brak numeru zamówienia");
      return;
    }

    const fetchMessages = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Symulacja czasu ładowania
        console.log("Przed wysłaniem żądania, orderId: ", orderId);

        const response = await fetch(`http://localhost:8080/api/orders/${orderId}/messages`);
        if (!response.ok) throw new Error("Błąd sieci");
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          throw new Error("Nieprawidłowy format danych");
        }
      } catch (err) {
        console.error("Błąd pobierania wiadomości:", err);
        setError("Nie udało się załadować wiadomości.");
      } finally {
        console.log("Dane załadowane, ustawiam isLoading na false");
        setTimeout(() => setIsLoading(false), 500); // Dodanie delikatnego opóźnienia
      }
    };

    fetchMessages();
  }, [orderId, navigate]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Jeśli wiadomość jest pusta, nie wysyłaj

    // Pobieramy dane użytkownika z localStorage
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      setError("Brak danych użytkownika");
      return;
    }

    const userData = JSON.parse(storedUserData);
    const senderId = userData.id; // Załóżmy, że id użytkownika jest przechowywane w localStorage
    const senderRole = userData.role; // Pobranie roli użytkownika
    const receiverId = 1; // Przykładowy id odbiorcy, można ustawić na dynamiczne w zależności od zamówienia

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          sender: { id: senderId }, // Wyślij id nadawcy
          receiver: { id: receiverId }, // Wyślij id odbiorcy (tutaj przykładowe)
          senderRole: senderRole, // Wyślij rolę nadawcy
        }),
      });

      if (!response.ok) throw new Error("Błąd wysyłania wiadomości");

      const messageData = await response.json();
      setMessages([...messages, messageData]);
      setNewMessage(""); // Resetowanie inputa
      setSuccessMessage("Wiadomość została wysłana pomyślnie!"); // Ustawienie komunikatu sukcesu
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      setError("Nie udało się wysłać wiadomości.");
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="order-messages">
      <SellerHeader />
      <h2>Historia wiadomości dla zamówienia #{orderId}</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>} {/* Komunikat o sukcesie */}
      {messages.length === 0 ? (
        <div className="no-messages">Brak wiadomości</div>
      ) : (
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.senderRole}`}>
              <div className="message-header">
                <span className="sender">{msg.senderRole === "SELLER" ? "Sprzedawca" : "Klient"}</span>
                <span className="date">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="message-text">Treść wiadomości: {msg.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość"
        />
        <button onClick={handleSendMessage}>Wyślij</button>
      </div>
    </div>
  );
};

export default OrderMessages;
