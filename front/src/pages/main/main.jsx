// LandingPage.jsx

import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: src="/img.jpg", // Chemin relatif depuis le dossier public
      }}
    >
      <div className="overlay">
        <div className="content">
          <h1>Bienvenue à la Bibliothèque de l'IHEC Carthage</h1>
          <p>Explorez un monde de connaissances et de culture</p>
          <p className="about">
            La Bibliothèque de l'IHEC Carthage offre aux étudiants une vaste gamme de ressources, notamment des livres, des rapports, et bien plus encore, pour toutes les spécialités. Avec un chatbot intégré, vous serez guidé efficacement pour trouver ce dont vous avez besoin.
          </p>
          <button className="discover-button" onClick={() => window.location.href = '/books'}>
            Découvrir les Livres
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
