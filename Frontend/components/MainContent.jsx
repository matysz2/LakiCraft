import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './config.js';  // Zmienna BASE_URL


const MainContent = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");  // Dodane pole 'message'
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "stolarz",
    shippingAddress: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

  // Funkcja obsługująca wysyłanie formularza kontaktowego
  const handleContactSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !message) {
      setErrorMessage("Proszę uzupełnić wszystkie pola.");
      return;
    }
  
    try {
      const contactData = { name, email, message };
      const response = await fetch(`https://${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
  
      // Zaloguj surową odpowiedź
      const rawData = await response.text();
      console.log('Raw Response:', rawData);
  
      // Spróbuj sparsować odpowiedź tylko, jeśli jest to JSON
      let data = {};
      try {
        data = JSON.parse(rawData);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
  
      if (response.ok) {
        setSuccessMessage("Wiadomość została wysłana!");
        setErrorMessage("");
        setName("");
        setEmail("");
        setMessage("");
  
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setErrorMessage(data.message || "Błąd podczas wysyłania wiadomości.");
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem!");
      console.error(error);
    }
  };
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserData(user);
      setIsLoggedIn(true);
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "stolarz":
          navigate("/carpenter-dashboard");
          break;
        case "lakiernik":
          navigate("/lacquerer-dashboard");
          break;
        case "sprzedawca":
          navigate("/seller-dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    }
  }, [navigate]);

  // Funkcja logowania
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setErrorMessage("");

        switch (data.user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "stolarz":
            navigate("/carpenter-dashboard");
            break;
          case "lakiernik":
            navigate("/lacquerer-dashboard");
            break;
          case "sprzedawca":
            navigate("/seller-dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        setErrorMessage(data.message || "Błąd logowania.");
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem!");
      console.error(error);
    }
  };

  // Funkcja rejestracji
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.shippingAddress || !registerData.firstName || !registerData.lastName) {
      setErrorMessage("Proszę uzupełnić wszystkie pola.");
      return;
    }

    try {
      const newUser = {
        ...registerData,
        accountStatus: "active",
        createdAt: new Date().toISOString(),
        paymentDueDays: 0,
      };

      const response = await fetch(`https://${BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Rejestracja zakończona sukcesem!");
        setErrorMessage("");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        if (response.status === 400 && data.message.includes("Użytkownik z tym adresem e-mail już istnieje")) {
          setErrorMessage("Adres e-mail już istnieje. Proszę użyć innego.");
        } else {
          setErrorMessage(data.message || "Błąd rejestracji.");
        }
      }
    } catch (error) {
      setErrorMessage("Adres e-mail już istnieje. Proszę użyć innego");
      console.error(error);
    }
  };

  return (
    <main>
      <section className="hero">
        <h1>Witamy w LakiCraft!</h1>
        <p>Twoje miejsce na znalezienie najlepszego lakieru, lakiernika i stolarza</p>
        {!isLoggedIn ? (
          <>
            <button onClick={() => setShowLoginModal(true)}>Zaloguj się</button>
            <button onClick={() => setShowRegisterModal(true)}>Zarejestruj się</button>
          </>
        ) : (
          <button onClick={() => {
            localStorage.removeItem("userData");
            setUserData(null);
            setIsLoggedIn(false);
            navigate("/");
          }}>Wyloguj się</button>
        )}
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <section className="modal">
          <div className="modal-content">
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Zaloguj się</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button className="close" onClick={() => setShowLoginModal(false)}>Zamknij</button>
          </div>
        </section>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <section className="modal">
          <div className="modal-content">
            <h2>Rejestracja</h2>
            <form onSubmit={handleRegister}>
              <input type="text" placeholder="Nazwa firmy" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
              <input type="text" placeholder="Imię" value={registerData.firstName} onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })} required />
              <input type="text" placeholder="Nazwisko" value={registerData.lastName} onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })} required />
              <input type="email" placeholder="E-mail" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
              <input type="password" placeholder="Hasło" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
              <input type="text" placeholder="Adres dostawy" value={registerData.shippingAddress} onChange={(e) => setRegisterData({ ...registerData, shippingAddress: e.target.value })} required />
              <div className="role-selection">
                Rola:
                <label>
                  <input type="radio" value="stolarz" checked={registerData.role === "stolarz"} onChange={() => setRegisterData({ ...registerData, role: "stolarz" })} /> Stolarz
                </label>
                <label>
                  <input type="radio" value="lakiernik" checked={registerData.role === "lakiernik"} onChange={() => setRegisterData({ ...registerData, role: "lakiernik" })} /> Lakiernik
                </label>
                <label>
                  <input type="radio" value="sprzedawca" checked={registerData.role === "sprzedawca"} onChange={() => setRegisterData({ ...registerData, role: "sprzedawca" })} /> Sprzedawca
                </label>
              </div>
              <button type="submit">Zarejestruj się</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <button className="close" onClick={() => setShowRegisterModal(false)}>Zamknij</button>
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section className="about-us">
        <h2>O nas</h2>
        <p>
          LakiCraft to platforma, która łączy stolarzy, lakierników i sprzedawców
          lakierów. Ułatwiamy proces zakupu lakierów i wynajmowania lakierników,
          aby stworzyć piękne i trwałe wykończenia dla każdego projektu stolarskiego.
        </p>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Nasze Usługi</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Sprzedawcy Lakierów</h3>
            <p>Sprzedawcy mogą wystawiać swoje produkty.</p>
          </div>
          <div className="service-item">
            <h3>Lakiernicy</h3>
            <p>Lakiernicy mogą dodać wolne terminy i cennik.</p>
          </div>
          <div className="service-item">
            <h3>Stolarze</h3>
            <p>Stolarze mogą znaleźć odpowiednie lakiery i lakierników.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Skontaktuj się z nami</h2>
        <form onSubmit={handleContactSubmit}>
          <input type="text" placeholder="Twoje imię" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Twój e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <textarea placeholder="Twoje pytanie lub wiadomość" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button type="submit">Wyślij</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </section>
    </main>
  );
};

export default MainContent;
