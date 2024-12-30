import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [bookStats, setBookStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction utilitaire pour nettoyer les noms d'auteurs
  const cleanAuthorName = (name) => {
    // Supprimer les espaces avant et après et normaliser les espaces
    const trimmedName = name.trim().replace(/\s+/g, " "); // Remplacer les espaces multiples par un seul espace
    // Vérifie que le nom n'est pas vide, composé uniquement de tirets ou de tirets multiples
    return trimmedName && !/^-+$/.test(trimmedName) && trimmedName !== '-' && trimmedName !== '- -' && trimmedName !== "" ? trimmedName : null;
  };

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((responseData) => {
        const availabilityCount = { disponible: 0, nonDisponible: 0 };
        const authorCount = {};
        const coteCount = {};

        if (Array.isArray(responseData)) {
          responseData.forEach((book) => {
            // Comptage de la disponibilité
            if (book.Etas === "Disponible") {
              availabilityCount.disponible += 1;
            } else if (book.Etas === "Non disponible") {
              availabilityCount.nonDisponible += 1;
            }

            // Nettoyage et comptage des auteurs
            const cleanedAuthor = cleanAuthorName(book.Auteur);
            if (cleanedAuthor) {
              authorCount[cleanedAuthor] = (authorCount[cleanedAuthor] || 0) + 1;
            }

            // Comptage par cote (en excluant les valeurs invalides)
            if (book.Cote && book.Cote.trim() !== "-" && book.Cote.trim() !== "") {
              const cleanedCote = book.Cote.trim();
              coteCount[cleanedCote] = (coteCount[cleanedCote] || 0) + 1;
            }
          });
        }

        setBookStats({ availabilityCount, authorCount, coteCount });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Limiter à 10 premiers auteurs avec le plus de livres
  const sortedAuthors = Object.entries(bookStats.authorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Affichage des 10 premiers auteurs

  const topAuthors = sortedAuthors.map(([author]) => author);
  const topAuthorCounts = sortedAuthors.map(([_, count]) => count);

  const authorData = {
    labels: topAuthors,
    datasets: [
      {
        label: "Livres par auteur",
        data: topAuthorCounts,
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  // Limiter à 10 premiers cotes et enlever les vides
  const coteData = () => {
    const maxDisplayCotes = 10;
    const coteEntries = Object.entries(bookStats.coteCount);

    // Trier les cotes et prendre les 10 premières
    const sortedCotes = coteEntries.sort((a, b) => b[1] - a[1]).slice(0, maxDisplayCotes);

    // Préparer les données pour le graphique
    const labels = sortedCotes.map(([cote]) => cote);
    const data = sortedCotes.map(([_, count]) => count);

    return {
      labels: labels,
      datasets: [
        {
          label: "Livres par cote",
          data: data,
          backgroundColor: [
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
        },
      ],
    };
  };

  // Graphique de la répartition par disponibilité
  const availabilityData = {
    labels: ["Disponible", "Non disponible"],
    datasets: [
      {
        label: "Livres par disponibilité",
        data: [bookStats.availabilityCount.disponible, bookStats.availabilityCount.nonDisponible],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px" }}>Tableau de Bord</h1>
      
      {/* Conteneur pour les graphiques */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        {/* Graphique de la répartition par disponibilité */}
        <div style={{ width: "48%", minWidth: "500px" }}>
          <Bar
            data={availabilityData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Répartition par disponibilité",
                },
              },
              scales: {
                x: {
                  ticks: {
                    autoSkip: false,
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Graphique de la répartition par auteur */}
        <div style={{ width: "48%", minWidth: "500px" }}>
          <Pie
            data={authorData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Les 10 premiers auteurs",
                },
              },
            }}
          />
        </div>

        {/* Graphique de la répartition par cote */}
        <div style={{ width: "48%", minWidth: "500px" }}>
          <Bar
            data={coteData()}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Répartition par cote",
                },
              },
              scales: {
                x: {
                  ticks: {
                    autoSkip: false,
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
