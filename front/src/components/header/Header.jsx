import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = ({ auth }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Vérifie si l'utilisateur est admin
  const [isLibrarian, setIsLibrarian] = useState(false); // Vérifie si l'utilisateur est bibliothécaire
  const [loading, setLoading] = useState(true); // Gère l'état de chargement
  const [error, setError] = useState(null); // Gère les erreurs lors de la récupération des données
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login-register" ||
    location.pathname === "/login-register/";

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Décoder le payload du token
      return payload._id; // Retourner l'ID de l'utilisateur
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = decodeToken(token);
      if (userId) {
        fetchUserInfo(userId, token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Vérifie les rôles
      setIsAdmin(response.data.role === "admin");
      setIsLibrarian(response.data.role === "bibliothécaire");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Unable to fetch user info or user does not exist.");
      setLoading(false);
    }
  };

  if (isLoginPage || loading) {
    return null; // ou afficher un spinner de chargement ici
  }

  return (
    <div className="navigate-container">
      <div className="header-logo">IHEC</div>
      <Link to="/" className="navigate-button">
        Home
      </Link>
      {isAdmin && (
        <Link to="/userlist" className="navigate-button">
          User List
        </Link>
      )}
      <Link to="/bookshelf" className="navigate-button">
        Bookshelf
      </Link>
      {isLibrarian && (
        <Link to="/reservations" className="navigate-button">
          Reservations
        </Link>
      )}
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
