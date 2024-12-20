import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    return <div>Erreur : {error.message}</div>;
  }

  if (!book) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Détails du Livre</h1>
      <p>ID du Livre : {book.id}</p>
      <div className="book-detail-overlay">
        <div className="Book">
          <h2>{book.Titre}</h2>
        </div>
        <div className="book-info">
          <div>
            <h2>Auteur :</h2>
            <p>{book.Auteur}</p>
          </div>
          <div>
            <h2>Éditeur :</h2>
            <p>{book.Editeur}</p>
          </div>
          <div>
            <h2>Locale :</h2>
            <p>{book.Locale}</p>
          </div>
          <div>
            <h2>Code Barre :</h2>
            <p>{book.Code_barre}</p>
          </div>
          <div>
            <h2>Cote :</h2>
            <p>{book.Cote}</p>
          </div>
          <div>
            <h2>Inventaire :</h2>
            <p>{book.Inventaire}</p>
          </div>
          <div>
            <h2>Prix :</h2>
            <p>{book.Prix}</p>
          </div>
          <div>
            <h2>Editeur :</h2>
            <p>{book.Editeur}</p>
          </div>
          <div>
            <h2>Date edition :</h2>
            <p>{book.Date_edition}</p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default Book;
