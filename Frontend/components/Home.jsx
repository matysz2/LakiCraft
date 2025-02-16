import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.scss";

const MainContent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sprawdzamy, czy użytkownik jest zalogowany
  useEffect(() => {
    // Sprawdzamy sesję użytkownika (wysyłamy zapytanie do backendu)
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/check-session", {
          method: "GET",
          credentials: "include", // Wysyłanie cookies
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
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

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user/logout", {
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


};

export default MainContent;
