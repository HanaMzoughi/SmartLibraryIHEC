import React, { useState } from "react";
import "./LandingPage.css";
import imgSrc from "./img.jpg"; // Importer l'image

const LandingPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault(); // Empêche l'actualisation de la page
        // Afficher les données dans la console pour la démonstration
        console.log("Nom:", name);
        console.log("Email:", email);
        console.log("Message:", message);
    
        // Vider les champs du formulaire après soumission
        setName("");
        setEmail("");
        setMessage("");
      };
  return (
    <div className="homelanding-page">
      <div
        className="landing-page"
        style={{
          backgroundImage: `url(${imgSrc})`, // Utilisation de l'image importée
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
      <div className="features">
              <div className="feature">
                <h3>Gestion des livres</h3>
                <p>Accédez à une vaste collection de livres, classée par catégories et disponible à la consultation en ligne.</p>
              </div>
              <div className="feature">
                <h3>Réservation des livres</h3>
                <p>Réservez vos livres pour lecture sur place et suivez vos réservations en temps réel.</p>
              </div>
              <div className="feature">
                <h3>Recherche avancée</h3>
                <p>Trouvez facilement vos livres grâce à notre moteur de recherche et filtres avancés.</p>
              </div>
              <div className="feature">
                <h3>ChatBot d'assistance</h3>
                <p>Notre chatbot intégré vous guide pour trouver rapidement ce que vous cherchez.</p>
              </div>
            </div>

      {/* Section Nos Services */}
      <section className="services">
        <h2>Nos Services</h2>
        <div className="service-item">
          <h3>Consultation</h3>
          <p>Des experts pour vous guider dans vos recherches académiques et vos projets.</p>
        </div>
        <div className="service-item">
          <h3>Espaces de Travail</h3>
          <p>Des espaces modernes pour vos travaux en groupe ou individuels.</p>
        </div>
        <div className="service-item">
          <h3>Événements</h3>
          <p>Des ateliers et conférences sur des sujets académiques variés.</p>
        </div>
      </section>

      {/* Section Événements à Venir */}
      <section className="events">
        <h2>Événements à Venir</h2>
        <div className="event-item">
          <h3>Atelier de Recherche</h3>
          <p>Le 15 janvier, apprenez à mieux gérer vos recherches académiques.</p>
        </div>
        <div className="event-item">
          <h3>Conférence sur l'Intelligence Artificielle</h3>
          <p>Le 25 janvier, découvrez les dernières innovations en IA.</p>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="testimonials">
        <h2>Ce Que Disent Nos Étudiants</h2>
        <div className="testimonial-item">
          <p>"La bibliothèque m'a aidé à trouver toutes les ressources nécessaires pour mon projet de fin d'études. Le chatbot est un vrai plus!"</p>
          <span>- Ahmed, Étudiant en Management</span>
        </div>
        <div className="testimonial-item">
          <p>"Les espaces de travail sont superbes, j'y passe toute ma journée pour travailler sur mes projets."</p>
          <span>- Sarah, Étudiante en Finance</span>
        </div>
      </section>

      {/* Section Contactez-nous */}
      <section className="contact">
        <h2>Contactez-nous</h2>
        <p>Nous serons heureux de répondre à toutes vos questions. N'hésitez pas à nous contacter!</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Votre Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Votre Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Votre Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
