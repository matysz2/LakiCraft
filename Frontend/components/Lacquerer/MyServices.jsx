import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LacquerHeader from "./LacquererHeader";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const MyServices = () => {
  const [cardData, setCardData] = useState(null);
  const [editableCardData, setEditableCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/");
      return;
    }
    const parsedUserData = JSON.parse(storedUserData);
    if (!parsedUserData.id) {
      navigate("/");
      return;
    }
    setUserId(parsedUserData.id);
  }, [navigate]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://${BASE_URL}/api/business-card?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd pobierania danych wizytówki.");
        }
        return response.json();
      })
      .then((data) => {
        setCardData(data);
        setEditableCardData(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleEditSave = () => {
    if (isEditing) {
      // Jeśli w trybie edycji, zapisujemy zmiany
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", editableCardData.name);
      formData.append("jobTitle", editableCardData.jobTitle);
      formData.append("bio", editableCardData.bio);
      formData.append("contactEmail", editableCardData.contactEmail);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      fetch(`http://${BASE_URL}/api/business-card`, {
        method: "PATCH", // Zamiast PUT, użyj PATCH
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Błąd zapisywania danych wizytówki.");
          }
          return response.json();
        })
        .then((data) => {
          setCardData(data);
          setSaveStatus("Dane zapisane poprawnie.");
          setIsEditing(false);
        })
        .catch((err) => {
          setError(err.message);
          console.error(err);
        });
    } else {
      // Jeśli nie w trybie edycji, przełączamy w tryb edycji
      setIsEditing(true);
    }
  };

  return (
    <div className="my-services">
      <LacquerHeader />
      {!cardData ? (
        <div className="card-empty">Brak danych wizytówki.</div>
      ) : (
        <>
          <div className="card-header">
            <img src={cardData.profileImageUrl} alt="Zdjęcie" />
            <h2>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableCardData.name}
                  onChange={handleChange}
                />
              ) : (
                cardData.name
              )}
            </h2>
          </div>
          <div className="card-body">
            <p>
              <strong>Specjalizacja:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="jobTitle"
                  value={editableCardData.jobTitle}
                  onChange={handleChange}
                />
              ) : (
                cardData.jobTitle
              )}
            </p>
            <p>
              <strong>O mnie:</strong>{" "}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editableCardData.bio}
                  onChange={handleChange}
                />
              ) : (
                cardData.bio
              )}
            </p>
            <p>
              <strong>Kontakt:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="contactEmail"
                  value={editableCardData.contactEmail}
                  onChange={handleChange}
                />
              ) : (
                cardData.contactEmail
              )}
            </p>
            {isEditing && (
              <p>
                <strong>Zdjęcie profilowe:</strong>{" "}
                <input type="file" onChange={handleFileChange} />
              </p>
            )}
          </div>
        </>
      )}
      {saveStatus && <p className="status">{saveStatus}</p>}
      <div className="actions">
        <button onClick={handleEditSave}>
          {isEditing ? "Zapisz" : "Edytuj"}
        </button>
      </div>
    </div>
  );
};

export default MyServices;
