import React, { useState } from "react";
import "./Addbook.css";

const AddBook = () => {
  const [newBook, setNewBook] = useState({
    N: "",
    BIBID: "",
    ITEMID: "",
    Code_barre: "",
    D_Object: "",
    D_CREATION: "",
    D_MODIF: "",
    Cote: "",
    Inventaire: "",
    epn: "",
    Titre: "",
    Auteur: "",
    Locale: "",
    Staff_Note: "",
    Public_Note: "",
    ISBN_A: "",
    ISBN_Z: "",
    Item_class: "",
    Specialite: "",
    Nb_Page: "",
    Date_edition: "",
    Editeur: "",
    Prix: "",
    Etas: "Disponible",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleAddBook = async (event) => {
    event.preventDefault();
    setError(null);
    setIsAdding(true);

    // Validation des champs obligatoires
    if (!newBook.Titre || !newBook.Auteur) {
      setError("Champs obligatoires manquants : Titre ou Auteur.");
      setIsAdding(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/publish/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const addedBook = await response.json();
        alert("Livre ajouté avec succès !");
        // Réinitialisation des champs après succès
        setNewBook({
          N: "",
          BIBID: "",
          ITEMID: "",
          Code_barre: "",
          D_Object: "",
          D_CREATION: "",
          D_MODIF: "",
          Cote: "",
          Inventaire: "",
          epn: "",
          Titre: "",
          Auteur: "",
          Locale: "",
          Staff_Note: "",
          Public_Note: "",
          ISBN_A: "",
          ISBN_Z: "",
          Item_class: "",
          Specialite: "",
          Nb_Page: "",
          Date_edition: "",
          Editeur: "",
          Prix: "",
          Etas: "Disponible",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'ajout du livre.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Ajouter un livre</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleAddBook}>
        <input
          type="text"
          value={newBook.Titre}
          onChange={(e) => setNewBook({ ...newBook, Titre: e.target.value })}
          placeholder="Titre du livre"
          required
        />
        <input
          type="text"
          value={newBook.Auteur}
          onChange={(e) => setNewBook({ ...newBook, Auteur: e.target.value })}
          placeholder="Auteur du livre"
          required
        />
        <input
          type="text"
          value={newBook.BIBID}
          onChange={(e) => setNewBook({ ...newBook, BIBID: e.target.value })}
          placeholder="BIBID"
      
        />{" "}
        <input
          type="text"
          value={newBook.Cote}
          onChange={(e) => setNewBook({ ...newBook, Cote: e.target.value })}
          placeholder="Cote"
        
        />{" "}
        <input
          type="text"
          value={newBook.Editeur}
          onChange={(e) => setNewBook({ ...newBook, Editeur: e.target.value })}
          placeholder="Editeur"
       
        />{" "}
        <input
          type="text"
          value={newBook.epn}
          onChange={(e) => setNewBook({ ...newBook, epn: e.target.value })}
          placeholder="epn"
        
        />{" "}
        <input
          type="text"
          value={newBook.Specialite}
          onChange={(e) =>
            setNewBook({ ...newBook, Specialite: e.target.value })
          }
          placeholder="Specialité"
      
        />{" "}
        <input
          type="text"
          value={newBook.Inventaire}
          onChange={(e) =>
            setNewBook({ ...newBook, Inventaire: e.target.value })
          }
          placeholder="Inventaire"
          
        />{" "}
        <input
          type="text"
          value={newBook.ISBN_A}
          onChange={(e) => setNewBook({ ...newBook, ISBN_A: e.target.value })}
          placeholder="ISBN_A"
          
        />
        <input
          type="text"
          value={newBook.ISBN_Z}
          onChange={(e) => setNewBook({ ...newBook, ISBN_Z: e.target.value })}
          placeholder="ISBN_Z"
        
        />
        <input
          type="text"
          value={newBook.Code_barre}
          onChange={(e) => setNewBook({ ...newBook, Code_barre: e.target.value })}
          placeholder="Code barre"
          
        />
        <input
          type="text"
          value={newBook.ISBN_A}
          onChange={(e) => setNewBook({ ...newBook, ISBN_A: e.target.value })}
          placeholder="Auteur du livre"
         
        />
        {/* Ajoutez ici les autres champs si nécessaire */}
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;