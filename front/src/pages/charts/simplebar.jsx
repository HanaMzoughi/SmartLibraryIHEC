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
    const trimmedName = name.trim().replace(/\s+/g, " ");
    return trimmedName && !/^-+$/.test(trimmedName) && trimmedName !== "-" && trimmedName !== "- -" && trimmedName !== "" ? trimmedName : null;
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
            if (book.Etas === "Disponible") {
              availabilityCount.disponible += 1;
            } else if (book.Etas === "Non disponible") {
              availabilityCount.nonDisponible += 1;
            }

            const cleanedAuthor = cleanAuthorName(book.Auteur);
            if (cleanedAuthor) {
              authorCount[cleanedAuthor] = (authorCount[cleanedAuthor] || 0) + 1;
            }

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

  const sortedAuthors = Object.entries(bookStats.authorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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

  const coteData = () => {
    const maxDisplayCotes = 10;
    const coteEntries = Object.entries(bookStats.coteCount);

    const sortedCotes = coteEntries.sort((a, b) => b[1] - a[1]).slice(0, maxDisplayCotes);

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

  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#f4f6f8",
    },
    title: {
      marginBottom: "30px",
      color: "#003366", // Bleu foncé
      fontSize: "32px",
      fontWeight: "bold",
    },
    chartContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap",
      marginTop: "30px",
    },
    chartItem: {
      width: "30%",  // Réduit la taille des graphiques (encore plus petit)
      minWidth: "350px", // Réduit encore la largeur minimale
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "2px solid #003366",  // Bleu foncé pour le cadre
    },
    chartTitle: {
      fontSize: "20px",
      color: "#333",
      marginBottom: "20px",
    },
    coteChartItem: {
      width: "48%",  // Rendre le graphique de la répartition par cote un peu plus large
      minWidth: "500px", // Garder une largeur minimale plus large
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "2px solid #003366",  // Bleu foncé pour le cadre
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tableau de bord étudiant</h1>
      <div style={styles.chartContainer}>
        <div style={styles.chartItem}>
          <h2 style={styles.chartTitle}>Répartition par disponibilité</h2>
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

        <div style={styles.chartItem}>
          <h2 style={styles.chartTitle}>Les 10 premiers auteurs</h2>
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

        <div style={styles.coteChartItem}>
          <h2 style={styles.chartTitle}>Répartition par cote</h2>
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
