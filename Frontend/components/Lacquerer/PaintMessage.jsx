import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const OrderMessages = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  c // Przechowywanie URL w zmiennej

  useEffect(() => {
    setIsLoading(true);

    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }

    if (!orderId) {
      setError("Brak numeru zamówienia");
      return;
    }

    const fetchMessages = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await fetch(`${API_URL}/api/lacquerOrders/${orderId}/messages`);
        if (!response.ok) throw new Error("Błąd sieci");
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);

          // Pobranie ID lacquerOrder z odpowiedzi
          const lacquerOrderIdFromApi = data[0]?.lacquerOrder?.id;
          if (lacquerOrderIdFromApi) {
            console.log("ID lacquerOrder:", lacquerOrderIdFromApi);
          } else {
            throw new Error("Brak ID lacquerOrder w odpowiedzi API");
          }
        } else {
          throw new Error("Nieprawidłowy format danych");
        }
      } catch (err) {
        console.error("Błąd pobierania wiadomości:", err);
        setError("Nie udało się załadować wiadomości.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [orderId, navigate]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      setError("Brak danych użytkownika");
      return;
    }

    const userData = JSON.parse(storedUserData);
    const senderId = userData.id;  // Identyfikator użytkownika
    const senderRole = userData.role;

    try {
      // Pobierz ID lacquerOrder z ostatniej wiadomości (z wcześniejszego API)
      const lacquerOrderIdFromApi = messages[0]?.lacquerOrder?.id;

      if (!lacquerOrderIdFromApi) {
        setError("Brak ID lacquerOrder, nie można wysłać wiadomości.");
        return;
      }

      const lacquererId = senderRole === "stolarz" ? senderId : lacquerOrderIdFromApi;  // Zmieniamy przypisanie ID lakiernika

      const response = await fetch(`https://${BASE_URL}/api/lacquerOrders/${orderId}/message`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          user: { id: senderId },  // Użytkownik wysyłający wiadomość
          lacquerer: { id: lacquererId },  // Lakiernik (zakładając, że stolarz wysyła wiadomość do lakiernika)
          orderId: orderId,       // Wysyłanie ID zamówienia
          lacquerOrderId: lacquerOrderIdFromApi, // Wysłanie ID lacquerOrder z odpowiedzi API
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Pobranie treści błędu z odpowiedzi
        console.error("Błąd wysyłania wiadomości:", errorText);
        throw new Error("Błąd wysyłania wiadomości");
      }

      const messageData = await response.json();
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
      setSuccessMessage("Wiadomość została wysłana pomyślnie!");
      setTimeout(() => setSuccessMessage(""), 3000); // Usuwanie komunikatu po 3 sekundach
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      setError("Nie udało się wysłać wiadomości.");
      setTimeout(() => setError(null), 3000); // Usuwanie komunikatu o błędzie po 3 sekundach
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="order-messages">
      <h2>Historia wiadomości dla zamówienia #{orderId}</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      {messages.length === 0 ? (
        <div className="no-messages">Brak wiadomości</div>
      ) : (
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.user.role}`}>
              <div className="message-header">
                <span className="sender">{msg.user.role}</span>
                <span className="date">{new Date(msg.sentAt).toLocaleString()}</span>
              </div>
              <p className="message-text">Treść wiadomości: {msg.message}</p>
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
