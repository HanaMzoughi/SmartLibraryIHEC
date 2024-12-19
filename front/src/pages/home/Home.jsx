import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Importer les styles

const Home = () => {
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // État pour le nom d'utilisateur
  const navigate = useNavigate();

  // Fonction pour décoder le token JWT et récupérer l'ID de l'utilisateur
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le payload du token
      return payload._id; // Retourner l'ID de l'utilisateur
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/", {});
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

    // Récupérer et décoder le token pour obtenir l'ID de l'utilisateur
    const token = localStorage.getItem("token");
    if (token) {
      const userId = decodeToken(token); // Utiliser la fonction pour obtenir l'ID
      if (userId) {
        // Fetch les informations de l'utilisateur en utilisant l'ID
        fetchUserInfo(userId, token);
      }
    }
  }, []);

  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(response.data.username); // Définir le nom d'utilisateur
      setRole(response.data.role)
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/${bookId}`);
  };

  return (
    <div className="home-screen">
      <div className="greeting">
        {username && <p>Bonjour {username}! {role}</p>} {/* Afficher le nom d'utilisateur */}
      </div>
      <div className="book-list">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-item"
            onClick={() => handleBookClick(book.id)}
          >
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
