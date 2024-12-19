import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddStudent.css'; // Fichier de styles CSS

const AddStudent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    university: '',
    speciality: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Effectuer une requête POST vers l'endpoint de création d'utilisateur
      await axios.post(
        'http://localhost:8000/register/',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          university: formData.university,
          speciality: formData.speciality,
          role: 'étudiant', // Rôle fixé à "étudiant"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajout du token JWT si nécessaire
          },
        }
      );

      // Gestion du succès
      setSuccessMessage('Étudiant ajouté avec succès !');
      setFormData({
        username: '',
        email: '',
        password: '',
        university: '',
        speciality: '',
      });

      // Rediriger vers la liste des utilisateurs après 2 secondes
      setTimeout(() => navigate('/userlist'), 2000);
    } catch (err) {
      // Gestion des erreurs
      setError(
        err.response?.data?.message || "Une erreur s'est produite lors de l'ajout de l'étudiant."
      );
    }
  };

  return (
    <div className="add-student-container">
      <h1>Ajouter un étudiant</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="add-student-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nom d'utilisateur"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          required
        />
        <input
          type="text"
          name="university"
          value={formData.university}
          onChange={handleChange}
          placeholder="Université"
          required
        />
        <input
          type="text"
          name="speciality"
          value={formData.speciality}
          onChange={handleChange}
          placeholder="Spécialité"
          required
        />
        <button type="submit">Ajouter</button>
        <button type="button" onClick={() => navigate('/userlist')}>
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
