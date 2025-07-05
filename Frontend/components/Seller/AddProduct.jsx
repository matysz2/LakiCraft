import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";
import SellerHeaders from "./SellerHeaders";
import BASE_URL from '../config.js';  // Zmienna BASE_URL

const AddProduct = () => {
  const [formData, setFormData] = useState({
    kod: "",
    nazwa: "",
    cena: "",
    stanMagazynowy: "",
    marka: "",
    opakowanie: "",
    image: null,  // Dodano stan dla obrazu
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null); // Dodano stan na błąd przy wysyłce
  const navigate = useNavigate();

  // Sprawdzenie czy użytkownik jest zalogowany
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) navigate("/");
  }, [navigate]);

  // Walidacja formularza
  const validate = () => {
    let newErrors = {};
    if (!formData.kod.trim()) newErrors.kod = "Kod jest wymagany";
    if (!formData.nazwa.trim()) newErrors.nazwa = "Nazwa jest wymagana";
    if (!formData.cena || formData.cena <= 0) newErrors.cena = "Cena musi być większa od 0";
    if (!formData.stanMagazynowy || formData.stanMagazynowy < 0)
      newErrors.stanMagazynowy = "Stan magazynowy nie może być ujemny";
    if (!formData.marka.trim()) newErrors.marka = "Marka jest wymagana";
    if (!formData.opakowanie || formData.opakowanie <= 0)
      newErrors.opakowanie = "Opakowanie musi być większe od 0";
    if (!formData.image) newErrors.image = "Zdjęcie jest wymagane"; // Walidacja zdjęcia

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] }); // Przechowywanie wybranego obrazu
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Obsługa wysyłki formularza
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedUserData?.id;
    if (!userId) return navigate("/");

    // Tworzenie FormData do wysłania
    const formDataToSend = new FormData();
    formDataToSend.append("kod", formData.kod);
    formDataToSend.append("name", formData.nazwa);
    formDataToSend.append("price", formData.cena);
    formDataToSend.append("stock", formData.stanMagazynowy);
    formDataToSend.append("brand", formData.marka);
    formDataToSend.append("packaging", formData.opakowanie);
    formDataToSend.append("user_id", userId); // Dodajemy user_id jako parametr
    if (formData.image) {
      formDataToSend.append("image", formData.image); // Dodanie obrazu do danych formularza
    }

    // Wysłanie danych na backend
    fetch(`https://${BASE_URL}/api/products`, {
      method: "POST",
      body: formDataToSend,
      headers: {
        "Accept": "application/json", // Nagłówek do akceptacji odpowiedzi JSON
      },
    })
      .then((res) => {
        return res.text().then((text) => {
          console.log("Response text:", text); // Zaloguj zawartość odpowiedzi
          if (!res.ok) {
            setSubmitError(text || "Błąd przy dodawaniu produktu");
            throw new Error(text || "Błąd przy dodawaniu produktu");
          }
          return text; // Jeśli odpowiedź jest poprawna
        });
      })
      .then((text) => {
        alert("Produkt dodany pomyślnie!");
        setFormData({
          kod: "",
          nazwa: "",
          cena: "",
          stanMagazynowy: "",
          marka: "",
          opakowanie: "",
          image: null, // Resetowanie obrazu po dodaniu
        });
        setSubmitError(null);
      })
      .catch((error) => {
        console.error("Błąd w obsłudze odpowiedzi:", error);
      });
  };

  return (
    <div className="add-product-container">
      <SellerHeaders />
      <h1>Dodaj nowy produkt</h1>
      <form onSubmit={handleSubmit}>
        {/* Formularz dla Kod produktu */}
        <div className="input-group">
          <label>Kod produktu: </label>
          <input
            type="text"
            name="kod"
            value={formData.kod}
            onChange={handleChange}
          />
          {errors.kod && <p className="error">{errors.kod}</p>}
        </div>

        {/* Formularz dla Nazwa */}
        <div className="input-group">
          <label>Nazwa: </label>
          <input
            type="text"
            name="nazwa"
            value={formData.nazwa}
            onChange={handleChange}
          />
          {errors.nazwa && <p className="error">{errors.nazwa}</p>}
        </div>

        {/* Formularz dla Cena */}
        <div className="input-group">
          <label>Cena PLN: </label>
          <input
            type="number"
            name="cena"
            value={formData.cena}
            onChange={handleChange}
          />
          {errors.cena && <p className="error">{errors.cena}</p>}
        </div>

        {/* Formularz dla Stan magazynowy */}
        <div className="input-group">
          <label>Stan magazynowy: </label>
          <input
            type="number"
            name="stanMagazynowy"
            value={formData.stanMagazynowy}
            onChange={handleChange}
          />
          {errors.stanMagazynowy && (
            <p className="error">{errors.stanMagazynowy}</p>
          )}
        </div>

        {/* Formularz dla Marka */}
        <div className="input-group">
          <label>Marka: </label>
          <input
            type="text"
            name="marka"
            value={formData.marka}
            onChange={handleChange}
          />
          {errors.marka && <p className="error">{errors.marka}</p>}
        </div>

        {/* Formularz dla Opakowanie */}
        <div className="input-group">
          <label>Opakowanie: </label>
          <input
            type="number"
            name="opakowanie"
            value={formData.opakowanie}
            onChange={handleChange}
          />
          {errors.opakowanie && <p className="error">{errors.opakowanie}</p>}
        </div>

        {/* Formularz dla Zdjęcia */}
        <div className="input-group">
          <label>Zdjęcie: </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>

        {/* Przycisk do wysyłania formularza */}
        <button type="submit" className="submit-btn">
          Dodaj produkt
        </button>
      </form>

      {/* Komunikat o błędzie dodawania produktu */}
      {submitError && <p className="error">{submitError}</p>}
    </div>
  );
};

export default AddProduct;
