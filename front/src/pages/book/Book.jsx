import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Book.css"; // Assurez-vous que ce fichier CSS est bien chargé
import axios from "axios";

const Book = () => {
  const { _id } = useParams(); // Récupère l'ID du livre
  const [book, setBook] = useState(null); // Détails du livre
  const [reservations, setReservations] = useState([]); // Liste des réservations
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isStudent, setIsStudent] = useState(false); // Vérifie si l'utilisateur est un étudiant
  const [userId, setUserId] = useState(null); // ID de l'utilisateur connecté
  const [showReservationForm, setShowReservationForm] = useState(false); // Affiche le formulaire de réservation
  const [duration, setDuration] = useState(""); // Durée saisie par l'utilisateur

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUserId = decodeToken(token);
      if (decodedUserId) {
        setUserId(decodedUserId); // Stocke l'ID utilisateur
        fetchUserInfo(decodedUserId, token);
      }
    }
  }, []);

  useEffect(() => {
    if (_id) {
      fetchBookDetails();
    }
  }, [_id]);

  // Décoder le token pour récupérer l'ID de l'utilisateur
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le payload du token
      return payload._id; // Retourner l'ID de l'utilisateur
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  };

  // Récupérer les informations utilisateur et vérifier son rôle
  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsStudent(response.data.role === "étudiant");
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur :", error);
      setError("Impossible de récupérer les informations utilisateur.");
    }
  };

  // Récupérer les détails du livre
  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/${_id}/`);
      const data = await response.json();
      setBook(data);
      await fetchReservations(); // Récupérer les réservations pour mettre à jour l'état du livre
    } catch (error) {
      setError(error.message);
    }
  };

  // Récupérer toutes les réservations pour ce livre et ajuster l'état
  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/reservations/all");
      const bookReservations = response.data.filter(
        (reservation) => reservation.book_id === _id
      );
      setReservations(bookReservations);

      // Si une réservation existe pour ce livre, on le marque comme "Non disponible"
      if (bookReservations.length > 0) {
        updateBookStatus("Non disponible");
      } else {
        updateBookStatus("Disponible");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setError("Impossible de récupérer les réservations.");
    }
  };

  // Mettre à jour l'état du livre (Disponible/Non disponible)
  const updateBookStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/${_id}/edit/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Etas: newStatus }), // Changer l'état du livre
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'état du livre");
      }

      setBook((prevBook) => ({
        ...prevBook,
        Etas: newStatus,
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état du livre :", error);
    }
  };

  // Gérer la réservation du livre
  const handleReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token requis");
      return;
    }

    const reservationData = {
      book_id: _id, // Utilise l'ID du livre
      student_id: userId, // Utilise l'ID de l'utilisateur connecté
      duration,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/reservation/create/",
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Réservation créée avec succès");
        setDuration("");
        setError("");
        setShowReservationForm(false); // Masquer le formulaire après réservation
        await fetchReservations(); // Récupérer les réservations à jour
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Erreur serveur");
      } else {
        setError("Une erreur s'est produite");
      }
      setMessage("");
    }
  };

  if (!book) {
    return (
      <div className="loading-message">
        Chargement...
      </div>
    );
  }

  return (
    <div>
      <div className="book-detail-overlay">
        <div className="Book">
          <h2>{book.Titre}</h2>
        </div>
        <div className="book-info">
          <h1>Détails du Livre</h1>
          <p>ID du Livre : {book.id}</p>
          <h2>Auteur : {book.Auteur}</h2>
          <div>
            <h2>Locale :</h2>
            <p>{book.Locale}</p>
          </div>
          <div className="book-info-item">
            <h2>Code Barre :</h2>
            <p>{book.Code_barre}</p>
          </div>
          <div className="book-info-item">
            <h2>Cote :</h2>
            <p>{book.Cote}</p>
          </div>
          <div className="book-info-item">
            <h2>Inventaire :</h2>
            <p>{book.Inventaire}</p>
          </div>
          <div className="book-info-item">
            <h2>Prix :</h2>
            <p>{book.Prix}</p>
          </div>
          <div className="book-info-item">
            <h2>Editeur :</h2>
            <p>{book.Editeur}</p>
          </div>
          <div className="book-info-item">
            <h2>Date édition :</h2>
            <p>{book.Date_edition}</p>
          </div>
          <h2>État : {book.Etas}</h2>
        </div>

        {/* Afficher le bouton de réservation si l'utilisateur est étudiant et le livre est disponible */}
        {isStudent && book.Etas === "Disponible" && !showReservationForm && (
          <button
            className="reserve-btn"
            onClick={() => setShowReservationForm(true)}
          >
            Réserver
          </button>
        )}

        {/* Formulaire de réservation */}
        {showReservationForm && (
          <form onSubmit={handleReservation} className="reservation-form">
            <div>
              <label htmlFor="duration">Durée de la réservation :</label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Confirmer
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowReservationForm(false)}
            >
              Annuler
            </button>
          </form>
        )}
      </div>

      {/* Messages */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Book;
