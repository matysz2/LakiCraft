import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerHeader from "./SellerHeaders";
import LakiernikHeader from "../Lacquerer/LacquererHeader";
import CarpenterHeader from "../Carpenter/CarpenterHeader";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({ password: "" });
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      console.error("Brak danych użytkownika w localStorage.");
      navigate("/");
      return;
    }

    let userData;
    try {
      userData = JSON.parse(storedUserData);
    } catch (e) {
      console.error("Błąd parsowania userData:", e);
      navigate("/");
      return;
    }

    if (!userData.id) {
      console.error("Brak ID użytkownika w userData.");
      navigate("/");
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/api/user?id=${userData.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Błąd pobierania danych: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Odebrane dane użytkownika:", data);
        setUser(data.user);
        setEditableUser(data.user);
      })
      .catch((err) => {
        console.error("Błąd pobierania danych:", err);
        setError("Nie udało się załadować danych użytkownika.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setLoading(true);
    setSaveStatus("");
    setSaveError("");

    console.log("Dane do wysłania: ", editableUser);

    fetch(`http://localhost:8080/api/user?id=${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editableUser),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Błąd: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Dane zostały zaktualizowane:", data);
        setUser({
          ...user,
          ...editableUser,
        });
        setSaveStatus("Dane zostały pomyślnie zaktualizowane!");
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Błąd podczas zapisywania danych:", err);
        setSaveError("Wystąpił problem podczas zapisywania danych.");
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = () => {
    if (!user?.id) {
      alert("Nie znaleziono identyfikatora użytkownika.");
      return;
    }

    if (window.confirm("Czy na pewno chcesz usunąć konto?")) {
      fetch(`http://localhost:8080/api/user?id=${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Błąd: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log("Odpowiedź API po usunięciu:", data);
          alert(data.message || "Konto zostało usunięte.");
          localStorage.removeItem("userData");
          navigate("/login");
        })
        .catch((err) => {
          console.error("Błąd podczas usuwania konta:", err);
          alert("Wystąpił problem podczas usuwania konta.");
        });
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Nie znaleziono użytkownika.</p>;

  const renderField = (label, value, name, type = "text") => (
    <p>
      <strong>{label}:</strong>
      {name === "createdAt" || name === "accountStatus" || name === "name" ? (
        // Zablokuj możliwość edytowania pola 'name'
        <span>{value || "Brak danych"}</span>
      ) : isEditing ? (
        name === "password" ? (
          <input
            type="password"
            name={name}
            value={editableUser[name] || ""}
            onChange={handleChange}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={editableUser[name] || ""}
            onChange={handleChange}
          />
        )
      ) : (
        value || "Brak danych"
      )}
    </p>
  );

  return (
    <div className="account-container">
{user.role === "sprzedawca" ? <SellerHeader /> 
  : user.role === "lakiernik" ? <LakiernikHeader /> 
  : user.role === "stolarz" ? <CarpenterHeader /> 
  : <div style={{ color: 'red', fontSize: '16px' }}>Błąd: Nieznana rola użytkownika</div>}
      <h2>Moje Konto</h2>
      <div className="account-details">
        {renderField("Nazwa Firmy", user.name, "name")}
        {renderField("Imię", user.firstName, "firstName")}
        {renderField("Nazwisko", user.lastName, "lastName")}
        {renderField("Email", user.email, "email")}
        {renderField("Status konta", user.accountStatus, "accountStatus")}
        {renderField("Data rejestracji", user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "", "createdAt")}
        {renderField("Hasło", "", "password", "password")}
      </div>
      {saveStatus && <p style={{ color: "green" }}>{saveStatus}</p>}
      {saveError && <p style={{ color: "red" }}>{saveError}</p>}
      <div className="account-actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            Zapisz
          </button>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            Edytuj
          </button>
        )}
        <button className="delete-btn" onClick={handleDelete}>
          Usuń konto
        </button>
      </div>
    </div>
  );
};

export default Account;

