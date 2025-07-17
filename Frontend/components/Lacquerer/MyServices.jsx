import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LacquerHeader from "./LacquererHeader";
import BASE_URL from "../config.js";



const MyServices = () => {
  const [cardData, setCardData] = useState(null);
  const [editableCardData, setEditableCardData] = useState({});
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

    fetch(`https://${BASE_URL}/api/business-card?userId=${userId}`)
      .then((response) => {
        if (response.status === 404) {
          setCardData(null);
          setLoading(false);
          return null;
        }
        if (!response.ok) {
          throw new Error("Błąd pobierania danych wizytówki.");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setCardData(data);
          setEditableCardData(data);
        }
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

  const handleSave = () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", editableCardData.name || "");
    formData.append("jobTitle", editableCardData.jobTitle || "");
    formData.append("bio", editableCardData.bio || "");
    formData.append("contactEmail", editableCardData.contactEmail || "");
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    const url = `https://${BASE_URL}/api/business-card${cardData ? "" : "/create"}`;
    const method = cardData ? "PATCH" : "POST";

    fetch(url, {
      method: method,
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Błąd zapisu wizytówki.");
        }
        return response.json();
      })
      .then((data) => {
        setCardData(data);
        setEditableCardData(data);
        setSaveStatus("Dane zapisane poprawnie.");
        setIsEditing(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  };

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="my-services">
      <LacquerHeader />
      {error && <p className="error">{error}</p>}
      {!cardData && !isEditing ? (
        <div className="card-empty">
          Brak wizytówki.
          <button onClick={() => setIsEditing(true)}>Dodaj wizytówkę</button>
        </div>
      ) : (
        <>
  <div className="card-header">
  <img
    src={
      editableCardData.profileImageUrl && editableCardData.profileImageUrl.startsWith('http')
        ? editableCardData.profileImageUrl
        : defaultAvatar
    }
    alt="Zdjęcie profilowe"
    width={150}
    height={150}
    style={{ objectFit: 'cover', borderRadius: '50%' }}
  />

  {isEditing ? (
    <input
      type="text"
      name="name"
      value={editableCardData.name || ""}
      onChange={handleChange}
      placeholder="Imię i nazwisko"
    />
  ) : (
    <h2>{cardData?.name}</h2>
  )}
</div>

          <div className="card-body">
            <p>
              <strong>Specjalizacja:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="jobTitle"
                  value={editableCardData.jobTitle || ""}
                  onChange={handleChange}
                />
              ) : (
                cardData?.jobTitle
              )}
            </p>
            <p>
              <strong>O mnie:</strong>{" "}
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editableCardData.bio || ""}
                  onChange={handleChange}
                />
              ) : (
                cardData?.bio
              )}
            </p>
            <p>
              <strong>Kontakt:</strong>{" "}
              {isEditing ? (
                <input
                  type="email"
                  name="contactEmail"
                  value={editableCardData.contactEmail || ""}
                  onChange={handleChange}
                />
              ) : (
                cardData?.contactEmail
              )}
            </p>
            {isEditing && (
              <p>
                <strong>Zdjęcie profilowe:</strong>{" "}
                <input type="file" onChange={handleFileChange} />
              </p>
            )}
          </div>
          <div className="actions">
            {isEditing ? (
              <button onClick={handleSave}>Zapisz</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edytuj</button>
            )}
          </div>
        </>
      )}
      {saveStatus && <p className="status">{saveStatus}</p>}
    </div>
  );
};

export default MyServices;
