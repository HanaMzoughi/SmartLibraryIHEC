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
import axios from 'axios';

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

const StudentDashboard = () => {
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel API pour récupérer les informations sur les étudiants
    axios.get('http://localhost:8000/users/all/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then((response) => {
      const roleCount = {}; // Comptage de tous les rôles
      const universityCount = {};
      const specialityCount = {};

      const users = response.data.users; // Récupère tous les utilisateurs

      users.forEach((student) => {
        // Filtrer pour n'afficher que les rôles "étudiant" et "bibliothécaire"
        if (student.role === 'étudiant' || student.role === 'bibliothécaire') {
          // Comptage des rôles
          roleCount[student.role] = (roleCount[student.role] || 0) + 1;

          // Comptage par université
          if (student.university) {
            universityCount[student.university] = (universityCount[student.university] || 0) + 1;
          }

          // Comptage par spécialité
          if (student.speciality) {
            specialityCount[student.speciality] = (specialityCount[student.speciality] || 0) + 1;
          }
        }
      });

      setStudentStats({ roleCount, universityCount, specialityCount });
      setLoading(false);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données des étudiants:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Préparation des données pour les graphiques
  const roleData = {
    labels: Object.keys(studentStats.roleCount),
    datasets: [
      {
        label: "Répartition par rôle",
        data: Object.values(studentStats.roleCount),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  const universityData = {
    labels: Object.keys(studentStats.universityCount),
    datasets: [
      {
        label: "Répartition par université",
        data: Object.values(studentStats.universityCount),
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const specialityData = {
    labels: Object.keys(studentStats.specialityCount),
    datasets: [
      {
        label: "Répartition par spécialité",
        data: Object.values(studentStats.specialityCount),
        backgroundColor: [
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px" }}>Tableau de Bord des Étudiants</h1>

      {/* Conteneur pour les graphiques */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        {/* Graphique de la répartition par rôle */}
        <div style={{ width: "48%", minWidth: "500px" }}>
          <Bar
            data={roleData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Répartition par rôle",
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

        {/* Graphique de la répartition par université */}
        <div style={{ width: "30%", minWidth: "300px" }}>
          <Pie
            data={universityData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Répartition par université",
                },
              },
              cutout: '60%', // Réduit la taille du cercle dans le graphique Pie
            }}
          />
        </div>

        {/* Graphique de la répartition par spécialité */}
        <div style={{ width: "48%", minWidth: "500px" }}>
          <Bar
            data={specialityData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Répartition par spécialité",
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

export default StudentDashboard;
