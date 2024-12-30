import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BookAdmin.css";


const Book_Admin = () => {
  const { _id } = useParams();
  const [book, setBook] = useState({
    Titre: "",
    Auteur: "",
    Editeur: "",
    Code_barre: "",
    Cote: "",
    Inventaire: "",
    Prix: "",
    Locale: "",
    Date_edition: "",
  });
  
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const navigate = useNavigate();
  const handleDelete = async (bookId) => {
      if (isDeleting) return; // Empêche de faire plusieurs suppressions en même temps

      setIsDeleting(true); // Démarre l'état de suppression

      try {
        const response = await fetch(
          `http://localhost:8000/${_id}/delete/`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Livre supprimé avec succès");
        // Redirige vers la liste des livres après la suppression
           navigate("/Admin");
        } else {
          const errorData = await response.json();
          alert(`Erreur : ${errorData.error}`);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      } finally {
        setIsDeleting(false); // Arrête l'état de suppression
      }
    };


  useEffect(() => {
    if (_id) {
      fetch(`http://localhost:8000/${_id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return response.json();
        })
        .then((data) => {
          setBook(data);
          setError(null);
        })
        .catch((error) => setError(error.message));
    }
  }, [_id]);

  const handleUpdateBook = (field, value) => {
    setBook((prevBook) => ({ ...prevBook, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:8000/${_id}/edit/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBook(updatedBook);
        setError(null);
        alert("Livre mis à jour avec succès !");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h1>Détails du Livre</h1>

      <form onSubmit={handleSubmit}>
        <div className="book-detail-overlay">
          <div className="Book">
            <h3>Titre</h3>
            <h2>
              <input
                type="text"
                value={book.Titre}
                onChange={(e) => handleUpdateBook("Titre", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Auteur</h3>
            <h2>
              <input
                type="text"
                value={book.Auteur}
                onChange={(e) => handleUpdateBook("Auteur", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Editeur</h3>
            <h2>
              <input
                type="text"
                value={book.Editeur}
                onChange={(e) => handleUpdateBook("Editeur", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Spécialité</h3>
            <h2>
              <input
                type="text"
                value={book.Specialite}
                onChange={(e) => handleUpdateBook("Specialite", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>BIBID</h3>
            <h2>
              <input
                type="text"
                value={book.BIBID}
                onChange={(e) => handleUpdateBook("BIBID", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Cote</h3>
            <h2>
              <input
                type="text"
                value={book.Cote}
                onChange={(e) => handleUpdateBook("Cote", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Inventaire</h3>
            <h2>
              <input
                type="text"
                value={book.Inventaire}
                onChange={(e) => handleUpdateBook("Inventaire", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>ISBN_A</h3>
            <h2>
              <input
                type="Text"
                value={book.ISBN_A}
                onChange={(e) => handleUpdateBook("ISBN_A", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>ISBN_Z</h3>
            <h2>
              <input
                type="Text"
                value={book.ISBN_Z}
                onChange={(e) => handleUpdateBook("ISBN_Z", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>{" "}
          <div className="Book">
            <h3>Item class</h3>
            <h2>
              <input
                type="Text"
                value={book.Item_class}
                onChange={(e) => handleUpdateBook("Item_class", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>
          <div className="Book">
            <h3>Public Note</h3>
            <h2>
              <input
                type="Text"
                value={book.Public_Note}
                onChange={(e) =>
                  handleUpdateBook("Public_Note", e.target.value)
                }
                placeholder="Titre du livre"
              />
            </h2>
          </div>
          <div className="Book">
            <h3>Prix</h3>
            <h2>
              <input
                type="Text"
                value={book.Prix}
                onChange={(e) => handleUpdateBook("Prix", e.target.value)}
                placeholder="Titre du livre"
              />
            </h2>
          </div>
          <div className="Book">
            <h3>Etat</h3>
            <select
              value={book.Etas}
              onChange={(e) => handleUpdateBook("Etas", e.target.value)}
            >
              <option value="Disponible">Disponible</option>
              <option value="Non disponible">Non disponible</option>
            </select>
          </div>
          <button className="up_button" type="submit" disabled={isUpdating}>
            {isUpdating ? "Mise à jour en cours..." : "Mettre à jour"}
          </button>
        </div>
      </form>
      <div>
        <button className="supp_button" onClick={() => handleDelete(book.N)}>Supprimer</button>
      </div>
      {error && <div style={{ color: "red" }}>Erreur : {error}</div>}
    </div>
  );
};

export default Book_Admin;