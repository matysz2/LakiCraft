import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Sprawdzenie sesji przy załadowaniu komponentu
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setUserData(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user)); // Zapisujemy dane w localStorage
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setErrorMessage("");
  
        // Przekierowanie w zależności od roli
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
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem!");
      console.error("Błąd połączenia z serwerem:", error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <main>
      <section className="hero">
        <h1>Witamy w LakiCraft!</h1>
        <p>Twoje miejsce na znalezienie najlepszego lakieru, lakiernika i stolarza</p>
        {!isLoggedIn && (
          <button onClick={() => setShowLoginModal(true)}>Zaloguj się</button>
        )}
      </section>

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
        <form>
          <input type="text" placeholder="Twoje imię" required />
          <input type="email" placeholder="Twój e-mail" required />
          <textarea placeholder="Twoje pytanie lub wiadomość" rows="5" required />
          <button type="submit">Wyślij</button>
        </form>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <section className="login-modal">
          <div className="login-content">
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Zaloguj się</button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button className="close" onClick={() => setShowLoginModal(false)}>
              Zamknij
            </button>
          </div>
        </section>
      )}

      {/* User Info Section */}
      {userData && (
        <section className="user-info">
          <h2>Witaj, {userData.name}!</h2>
          <p>Email: {userData.email}</p>
          <p>Rola: {userData.role}</p>
          <p>Data utworzenia: {formatDate(userData.createdAt)}</p>
          <button onClick={handleLogout}>Wyloguj się</button>
        </section>
      )}
    </main>
  );
};

export default MainContent;
