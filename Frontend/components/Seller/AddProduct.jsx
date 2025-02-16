import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";

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

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "user_id": userId },
      body: JSON.stringify({ ...formData, user_id: userId }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Produkt dodany pomyślnie!");
        setFormData({ kod: "", nazwa: "", cena: "", stanMagazynowy: "", marka: "", opakowanie: "" });
      })
      .catch(() => alert("Błąd przy dodawaniu produktu"));
  };

  return (
    <div className="add-product-container">
      <h1>Dodaj nowy produkt</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Kod produktu: </label>
          <input type="text" name="kod" value={formData.kod} onChange={handleChange} />
          {errors.kod && <p className="error">{errors.kod}</p>}
        </div>

        <div className="input-group">
          <label>Nazwa: </label>
          <input type="text" name="nazwa" value={formData.nazwa} onChange={handleChange} />
          {errors.nazwa && <p className="error">{errors.nazwa}</p>}
        </div>

        <div className="input-group">
          <label>Cena PLN: </label>
          <input type="number" name="cena" value={formData.cena} onChange={handleChange} />
          {errors.cena && <p className="error">{errors.cena}</p>}
        </div>

        <div className="input-group">
          <label>Stan magazynowy: </label>
          <input type="number" name="stanMagazynowy" value={formData.stanMagazynowy} onChange={handleChange} />
          {errors.stanMagazynowy && <p className="error">{errors.stanMagazynowy}</p>}
        </div>

        <div className="input-group">
          <label>Marka: </label>
          <input type="text" name="marka" value={formData.marka} onChange={handleChange} />
          {errors.marka && <p className="error">{errors.marka}</p>}
        </div>

        <div className="input-group">
          <label>Opakowanie: </label>
          <input type="number" name="opakowanie" value={formData.opakowanie} onChange={handleChange} />
          {errors.opakowanie && <p className="error">{errors.opakowanie}</p>}
        </div>

        <button type="submit" className="submit-btn">Dodaj produkt</button>
      </form>
    </div>
  );
};

export default AddProduct;
