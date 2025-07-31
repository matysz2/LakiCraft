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
  const [showImage, setShowImage] = useState(true);

  const navigate = useNavigate();

  // ✅ Pobieramy userId z localStorage
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

  // ✅ Pobieramy wizytówkę z backendu
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/business-card?userId=${userId}`)
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
          setShowImage(true);
        }
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // ✅ Obsługa zmian pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Obsługa wyboru pliku
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ✅ Zapis wizytówki (POST lub PATCH)
const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", editableCardData.name || "");
    formData.append("jobTitle", editableCardData.jobTitle || "");
    formData.append("bio", editableCardData.bio || "");
    formData.append("contactEmail", editableCardData.contactEmail || "");
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    const isNewCard = !cardData;

    // ✅ nowe URL-e
    const url = isNewCard
      ? `${BASE_URL}/api/business-card/create`
      : `${BASE_URL}/api/business-card/update`; // <-- używamy POST update

    const response = await fetch(url, {
      method: "POST", // <-- zawsze POST (CORS-friendly)
      body: formData,
    });

    if (!response.ok) throw new Error("❌ Błąd zapisu wizytówki");

    const data = await response.json();

    setCardData(data);
    setEditableCardData(data);
    setSaveStatus("✅ Dane zapisane poprawnie!");
    setIsEditing(false);
    setSelectedFile(null);
    setShowImage(true);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};


  if (loading) return <div>Ładowanie...</div>;

  return (
    <div className="my-services">
      <LacquerHeader />

      {error && <p className="error">{error}</p>}

      {/* ✅ Jeśli brak wizytówki i nie edytujemy */}
      {!cardData && !isEditing ? (
        <div className="card-empty">
          <p>Brak wizytówki.</p>
          <button onClick={() => setIsEditing(true)}>➕ Dodaj wizytówkę</button>
        </div>
      ) : (
        <>
          {/* ✅ Sekcja nagłówka wizytówki */}
          <div className="card-header">
            {/* ✅ Dynamiczne zdjęcie jak w products */}
            {editableCardData.profileImageUrl && showImage && (
              <img
                src={`${BASE_URL}/${editableCardData.profileImageUrl}`}
                alt="Zdjęcie profilowe"
                width={150}
                height={150}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                onError={() => setShowImage(false)}
              />
            )}

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

          {/* ✅ Sekcja danych wizytówki */}
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

          {/* ✅ Akcje */}
          <div className="actions">
            {isEditing ? (
              <>
                <button onClick={handleSave}>💾 Zapisz</button>
                <button onClick={() => setIsEditing(false)}>❌ Anuluj</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>✏️ Edytuj</button>
            )}
          </div>
        </>
      )}

      {saveStatus && <p className="status">{saveStatus}</p>}
    </div>
  );
};

export default MyServices;
