import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import BASE_URL from '../config.js';

const OrderMessages = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [lacquererId, setLacquererId] = useState(null); // ✅ automatycznie przypiszemy lakiernika do wiadomości

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
        await new Promise((resolve) => setTimeout(resolve, 1000)); // małe opóźnienie dla LoadingScreen
        const response = await fetch(`https://${BASE_URL}/api/lacquerOrders/${orderId}/messages`);

        if (!response.ok) throw new Error("Błąd sieci przy pobieraniu wiadomości");
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);

          // ✅ Wyciągamy ID lakiernika z pierwszej wiadomości (jeśli istnieje)
          const lacquererFromApi = data[0]?.lacquerer?.id || data[0]?.lacquerOrder?.lacquerer?.id;
          if (lacquererFromApi) {
            setLacquererId(lacquererFromApi);
          }

        } else {
          throw new Error("Nieprawidłowy format danych z API");
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
    const senderId = userData.id;
    const senderRole = userData.role;

    let finalLacquererId = lacquererId;

    // ✅ Jeśli użytkownik to lakiernik, to sam jest "lacquererem"
    if (senderRole === "lakiernik") {
      finalLacquererId = senderId;
    }

    // ✅ Jeśli użytkownik to stolarz, a brak lacquerera w API, zgłoś błąd
    if (!finalLacquererId) {
      setError("Nie znaleziono przypisanego lakiernika do tego zamówienia.");
      return;
    }

    try {
      const response = await fetch(`https://${BASE_URL}/api/lacquerOrders/${orderId}/message`, {
        method: "POST", // ✅ WAŻNE: metoda POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          user: { id: senderId },        // ✅ wysyłający wiadomość
          lacquerer: { id: finalLacquererId } // ✅ przypisany lakiernik
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Błąd wysyłania wiadomości:", errorText);
        throw new Error("Błąd wysyłania wiadomości");
      }

      const messageData = await response.json();
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
      setSuccessMessage("Wiadomość została wysłana pomyślnie!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      setError("Nie udało się wysłać wiadomości.");
      setTimeout(() => setError(null), 3000);
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
