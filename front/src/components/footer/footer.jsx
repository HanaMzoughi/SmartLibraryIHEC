import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Footer.css";

const Footerpage = () => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isLibrarian, setIsLibrarian] = useState(false); 
  const [isStudent, setIsStudent] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const location = useLocation();

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload._id; 
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

      setIsAdmin(response.data.role === "admin");
      setIsLibrarian(response.data.role === "bibliothécaire");
      setIsStudent(response.data.role === "étudiant"); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Unable to fetch user info or user does not exist.");
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return null; 
  }

  return (
    <div className="foot">
      <div className="foot-section left">
        <h4>Contact</h4>
        <ul>
          <li>Rue Victor Hugo 2016, Carthage-Présidence</li>
          <li>(+216) 71774720 / 71775948 / 71775592</li>
          <li>Fax: (+216) 71775944</li>
          <li>
            <a href="mailto:contact@ihec.ucar.tn">contact@ihec.ucar.tn</a>
          </li>
        </ul>
      </div>
      <div className="foot-section center">
        <h4>Liens</h4>
        <ul>
          {isAdmin && (
            <li>
              <Link to="/userlist">Liste des utilisateurs</Link>
            </li>
          )}
          {isLibrarian && (
            <li>
              <Link to="/reservations">Liste des réservations</Link>
            </li>
          )}
          {isStudent && (
            <li>
              <Link to="/books">Liste des livres</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="foot-section right">
        <h4>Site Web</h4>
        <ul>
          <li>
            <a href="https://ihec.rnu.tn/fr" target="_blank" rel="noopener noreferrer">
              IHEC Official Website
            </a>
          </li>
        </ul>
      </div>

      {/* Bouton flèche pour revenir en haut */}
      <div className="scroll-to-top" onClick={scrollToTop}>
        ↑
      </div>
    </div>
  );
};

export default Footerpage;
