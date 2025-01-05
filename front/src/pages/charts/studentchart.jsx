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
import axios from "axios";

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
    axios
      .get("http://localhost:8000/users/all/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const roleCount = {};
        const universityCount = {};
        const specialityCount = {};

        const users = response.data.users;

        users.forEach((student) => {
          if (student.role === "étudiant" || student.role === "bibliothécaire") {
            roleCount[student.role] = (roleCount[student.role] || 0) + 1;

            if (student.university) {
              universityCount[student.university] =
                (universityCount[student.university] || 0) + 1;
            }

            if (student.speciality) {
              specialityCount[student.speciality] =
                (specialityCount[student.speciality] || 0) + 1;
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
    return <div style={{ textAlign: "center", marginTop: "20px" }}>Chargement...</div>;
  }

  const roleData = {
    labels: Object.keys(studentStats.roleCount),
    datasets: [
      {
        label: "Répartition par rôle",
        data: Object.values(studentStats.roleCount),
        backgroundColor: ["rgba(70, 180, 180, 0.6)", "rgba(53, 79, 248, 0.6)"],
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
          "rgba(45, 75, 207, 0.6)",
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
          "rgba(59, 113, 230, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const styles = {
    container: {
      padding: "30px",
      textAlign: "center",
      backgroundColor: "#f7f9fc",
      color: "#333",
    },
    title: {
      marginBottom: "20px",
      color: "#1565c0", // Bleu marine
      fontWeight: "bold",
    },
    chartContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap",
    },
    fullWidth: {
      width: "700px",
    },
    chart: {
      backgroundColor: "#ffffff",
      border: "2px solid #1565c0", // Cadre bleu marine
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    barChart: {
      flex: "1 1 48%",
      minWidth: "700px",
    },
    pieChart: {
      flex: "1 1 40%",
      minWidth: "700px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Statistiques des étudiants</h1>
      <div style={styles.chartContainer}>
        <div style={styles.row}>
          <div style={{ ...styles.chart, ...styles.barChart }}>
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

          <div style={{ ...styles.chart, ...styles.pieChart }}>
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
                cutout: "40%",
              }}
            />
          </div>
        </div>

        <div style={{ ...styles.chart, ...styles.fullWidth }}>
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
