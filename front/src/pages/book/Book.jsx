import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Book.css"; // Assurez-vous que ce fichier CSS est bien chargé

const Book = () => {
  const { _id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_id) {
      fetch(`http://localhost:8000/${_id}/`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => setError(error));
    }
  }, [_id]);

  if (error) {
    return (
      <div className="error-message">
        Erreur : {error.message}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="loading-message">
        Chargement...
      </div>
    );
  }

  return (
    <div className="book-container">
      {/* Supprimé la phrase en doublon */}
      <h1 className="book-title">Détails du Livre</h1>
      <div className="book-detail-overlay">
        <div className="Book">
          <h2>{book.Titre}</h2>
        </div>
        <div className="book-info">
          <div className="book-info-item">
            <h2>Auteur :</h2>
            <p>{book.Auteur}</p>
          </div>
          <div className="book-info-item">
            <h2>Éditeur :</h2>
            <p>{book.Editeur}</p>
          </div>
          <div className="book-info-item">
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
            <h2>Date d'édition :</h2>
            <p>{book.Date_edition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
