import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ReservationStats = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    studentLabels: [],
    studentData: [],
    statusLabels: [],
    statusData: [],
    dateLabels: [],
    dateData: [],
  });

  const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#f7f9fc",
      marginLeft:"150px",
    },
    header: {
      color: "#001f3f",
      fontWeight: "bold",
      marginBottom: "20px",
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
    chart: {
      backgroundColor: "#ffffff",
      border: "2px solid #1565c0",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    pieChart: {
      flex: "1 1 48%",
      minWidth: "300px",
    },
    fullWidth: {
      width: "100%",
    },
  };

  const calculateStats = (reservations) => {
    const studentCount = {};
    const statusCount = {};
    const dateCount = {};

    reservations.forEach((reservation) => {
      studentCount[reservation.student] =
        (studentCount[reservation.student] || 0) + 1;

      statusCount[reservation.status] =
        (statusCount[reservation.status] || 0) + 1;

      const reservationDate = new Date(
        reservation.date_reservation
      ).toLocaleDateString("fr-FR");
      dateCount[reservationDate] = (dateCount[reservationDate] || 0) + 1;
    });

    setChartData({
      studentLabels: Object.keys(studentCount),
      studentData: Object.values(studentCount),
      statusLabels: Object.keys(statusCount),
      statusData: Object.values(statusCount),
      dateLabels: Object.keys(dateCount),
      dateData: Object.values(dateCount),
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/reservations/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Correction ici
        });

        const updatedReservations = await Promise.all(
          response.data.map(async (reservation) => {
            const studentName = await fetchUserDetails(reservation.student_id);
            return { ...reservation, student: studentName };
          })
        );

        setReservations(updatedReservations);
        calculateStats(updatedReservations);
      } catch (error) {
        setError("Erreur lors du chargement des réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const fetchUserDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${studentId}/`, { // Correction ici
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Correction ici
      });
      return response.data.username;
    } catch {
      return "Étudiant non trouvé";
    }
  };

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', color: '#1565c0',marginLeft:"-10px" }}>Statistiques des réservations</h1>
      <div style={styles.chartContainer}>
        <div style={styles.row}>
          <div style={{ ...styles.chart, ...styles.pieChart }}>
            <h2>Répartition des réservations par étudiant</h2>
            <Pie
              data={{
                labels: chartData.studentLabels,
                datasets: [
                  {
                    data: chartData.studentData,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.6)",
                      "rgba(95, 191, 255, 0.6)",
                      "rgba(229, 107, 77, 0.6)",
                      "rgba(65, 211, 162, 0.6)",
                      "rgba(22, 53, 255, 0.6)",
                    ],
                  },
                ],
              }}
            />
          </div>

          <div style={{ ...styles.chart, ...styles.pieChart }}>
            <h2>Répartition des réservations par statut</h2>
            <Pie
              data={{
                labels: chartData.statusLabels,
                datasets: [
                  {
                    data: chartData.statusData,
                    backgroundColor: [
                      "rgba(11, 41, 177, 0.59)",
                      "rgba(49, 169, 249, 0.6)",
                      "rgba(255, 159, 64, 0.6)",
                      "rgba(75, 192, 192, 0.6)",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>

        <div style={{ ...styles.chart, ...styles.fullWidth }}>
          <h2>Répartition des réservations par date</h2>
          <Line
            data={{
              labels: chartData.dateLabels,
              datasets: [
                {
                  label: "Nombre de réservations",
                  data: chartData.dateData,
                  borderColor: "rgb(0, 0, 108)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationStats;
