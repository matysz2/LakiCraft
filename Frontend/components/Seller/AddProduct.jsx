import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";
import SellerHeaders from "./SellerHeaders";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    kod: "",
    nazwa: "",
    cena: "",
    stanMagazynowy: "",
    marka: "",
    opakowanie: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null); // Dodano stan na błąd przy wysyłce
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) navigate("/");
  }, [navigate]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedUserData?.id;
    if (!userId) return navigate("/");
  
    const productData = {
      kod: formData.kod,
      name: formData.nazwa,
      price: formData.cena,
      stock: formData.stanMagazynowy,
      brand: formData.marka,
      packaging: formData.opakowanie,
      user_id: userId,
    };
  
    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "user_id": userId },
      body: JSON.stringify(productData),
    })
      .then((res) => {
        // Jeśli odpowiedź jest tekstowa
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
