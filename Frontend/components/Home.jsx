import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.scss";
import BASE_URL from './config.js';  // Zmienna BASE_URL

const MainContent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sprawdzamy, czy użytkownik jest zalogowany lub ma aktywną sesję
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUserData = JSON.parse(localStorage.getItem("userData"));
        if (storedUserData) {
          setUserData(storedUserData);
          setIsLoggedIn(true);
          // Przekierowanie w zależności od roli
          redirectUser(storedUserData.role);
        } else {
          // Sprawdzenie sesji z backendu, jeżeli brak w localStorage
          const response = await fetch(`http://${BASE_URL}/api/user/check-session`, {
            method: "GET",
            credentials: "include", // Wysyłanie cookies
          });

          const data = await response.json();
          if (response.ok && data.user) {
            setUserData(data.user);
            setIsLoggedIn(true);
            localStorage.setItem("userData", JSON.stringify(data.user)); // Zapisujemy dane w localStorage
            redirectUser(data.user.role);
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const redirectUser = (role) => {
    switch (role) {
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
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch(`http://${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include", // Wysyłanie cookies
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setErrorMessage("");
        localStorage.setItem("userData", JSON.stringify(data.user));

        // Przekierowanie na podstawie roli
        redirectUser(data.user.role);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Błąd połączenia z serwerem!");
      console.error("Błąd połączenia z serwerem:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://${BASE_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include", // Wysyłanie cookies
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem("userData");
        navigate("/");
      } else {
        console.error("Błąd podczas wylogowywania:", data.message);
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
    }
  };

  return (
    <main>
      <section className="hero">
        <h1>Witamy w LakiCraft!</h1>
        <p>Twoje miejsce na znalezienie najlepszego lakieru, lakiernika i stolarza</p>
        {!isLoggedIn && (
          <button onClick={handleLoginClick}>Zaloguj się</button>
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

      {/* Login Modal */}
      {showLoginModal && (
        <section className="login-modal">
          <div className="login-content">
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmitLogin}>
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
    </main>
  );
};

export default MainContent;
