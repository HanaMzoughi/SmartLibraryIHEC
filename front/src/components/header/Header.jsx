import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = ({ auth }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Pour vérifier si l'utilisateur est admin
  const [loading, setLoading] = useState(true); // Pour gérer l'état de chargement
  const [error, setError] = useState(null); // Pour gérer les erreurs lors de la récupération des données
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login-register" ||
    location.pathname === "/login-register/";

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
    // Récupérer et décoder le token pour obtenir l'ID de l'utilisateur
    const token = localStorage.getItem("token");
    if (token) {
      const userId = decodeToken(token); // Utiliser la fonction pour obtenir l'ID
      if (userId) {
        // Fetch les informations de l'utilisateur en utilisant l'ID
        fetchUserInfo(userId, token);
      }
    } else {
      setLoading(false); // Si aucun token, terminer le chargement
    }
  }, []);

  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(response.data.role === "admin"); // Vérifier si l'utilisateur est admin
      setLoading(false); // Fin du chargement
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Unable to fetch user info or user does not exist.");
      setLoading(false); // Fin du chargement même en cas d'erreur
    }
  };

  // Si la page est de connexion ou que les données sont en cours de chargement, ne pas afficher le header
  if (isLoginPage || loading) {
    return null; // ou vous pouvez afficher un spinner de chargement ici
  }

  // Si l'utilisateur n'est pas admin, ne pas afficher la liste des utilisateurs
  if (!isAdmin) {
    return (
      <div className="navigate-container">
        <div className="header-logo">IHEC</div>
        <Link to="/" className="navigate-button">
          Home
        </Link>
        <Link to="/bookshelf" className="navigate-button">
          Bookshelf
        </Link>
        <Link
          to={auth ? "/profile" : "/login-register"}
          className="navigate-button profile-button"
        >
          {auth ? "Profile" : "Sign In"}
        </Link>
      </div>
    );
  }

  // Si l'utilisateur est un admin, on affiche la liste des utilisateurs
  return (
    <div className="navigate-container">
      <div className="header-logo">IHEC</div>
      <Link to="/" className="navigate-button">
        Home
      </Link>
      <Link to="/userlist" className="navigate-button">
        User List
      </Link>
      <Link to="/bookshelf" className="navigate-button">
        Bookshelf
      </Link>
      <Link
        to={auth ? "/profile" : "/login-register"}
        className="navigate-button profile-button"
      >
        {auth ? "Profile" : "Sign In"}
      </Link>
    </div>
  );
};

export default Header;
