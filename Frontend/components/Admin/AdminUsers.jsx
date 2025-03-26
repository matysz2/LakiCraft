import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/_admin.scss";
import Header from "../Header";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (!storedUserData) {
      navigate("/login");
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    setRole(parsedUserData.role);

    if (parsedUserData.role !== "admin") {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (role === "admin") {
      fetch("http://localhost:8080/api/user/users")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Błąd podczas pobierania użytkowników");
          }
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [role]);

  const handleDeleteUser = (userId, userName) => {
    const isConfirmed = window.confirm(`Czy na pewno chcesz usunąć użytkownika ${userName}?`);
    
    if (!isConfirmed) return;
  
    fetch(`http://localhost:8080/api/user/users/${userId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          setError("Nie udało się usunąć użytkownika");
        }
      })
      .catch((err) => setError(err.message));
  };
  
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveChanges = () => {
    fetch(`http://localhost:8080/api/user/admin/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingUser),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas zapisywania zmian");
        }
        return res.json();
      })
      .then((updatedUser) => {
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        setEditingUser(null);
        setSuccessMessage("Zmiany zapisane pomyślnie!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      })
      .catch((err) => setError(err.message));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="admin-user-list">
      <Header />
      <h1>Lista użytkowników</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {editingUser && (
        <div className="edit-form">
          <h2>Edytuj użytkownika</h2>
          <form>
            <div className="form-group">
              <label>Imię</label>
              <input type="text" name="firstName" value={editingUser.firstName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Nazwisko</label>
              <input type="text" name="lastName" value={editingUser.lastName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={editingUser.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Rola</label>
              <select name="role" value={editingUser.role} onChange={handleInputChange}>
                <option value="admin">Admin</option>
                <option value="stolarz">Stolarz</option>
                <option value="lakiernik">Lakiernik</option>
                <option value="sprzedawca">Sprzedawca</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status konta</label>
              <select name="accountStatus" value={editingUser.accountStatus} onChange={handleInputChange}>
                <option value="active">Aktywne</option>
                <option value="suspended">Zawieszone</option>
              </select>
            </div>
            <button type="button" onClick={handleSaveChanges}>Zapisz zmiany</button>
            <button type="button" onClick={() => setEditingUser(null)}>Anuluj</button>
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>Cofnij</button>
          </form>
        </div>
      )}

      {!editingUser && (
        <>
          <button className="btn-back" onClick={() => navigate(-1)}>Cofnij</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Imię</th>
                <th>Email</th>
                <th>Rola</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.accountStatus}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditUser(user)}>Edytuj</button>
                    <button className="btn-delete" onClick={() => handleDeleteUser(user.id, user.firstName)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminUser;