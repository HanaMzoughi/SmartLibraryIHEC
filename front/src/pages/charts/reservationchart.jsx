import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

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

  // Styles
  const styles = {
    container: {
      padding: '20px',
    },
    header: {
      textAlign: 'center',
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '30px',
    },
    chartItem: {
      width: '45%',
    },
  };

  // Fonction pour calculer la répartition
  const calculateStats = (reservations) => {
    const studentCount = {};
    const statusCount = {};
    const dateCount = {};

    reservations.forEach((reservation) => {
      // Comptabiliser les étudiants
      studentCount[reservation.student] = (studentCount[reservation.student] || 0) + 1;
      // Comptabiliser les statuts
      statusCount[reservation.status] = (statusCount[reservation.status] || 0) + 1;
      // Comptabiliser les réservations par date, forcer à entier
      const reservationDate = new Date(reservation.date_reservation).toLocaleDateString('fr-FR'); // Format clair: jour/mois/année
      dateCount[reservationDate] = (dateCount[reservationDate] || 0) + 1;
    });

    setChartData({
      studentLabels: Object.keys(studentCount),
      studentData: Object.values(studentCount),
      statusLabels: Object.keys(statusCount),
      statusData: Object.values(statusCount),
      dateLabels: Object.keys(dateCount),
      dateData: Object.values(dateCount).map(count => Math.round(count)),  // Assurer que c'est un entier
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reservations/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Ajouter les informations sur les étudiants
        const updatedReservations = await Promise.all(response.data.map(async (reservation) => {
          const studentName = await fetchUserDetails(reservation.student_id);
          return {
            ...reservation,
            student: studentName,
          };
        }));

        setReservations(updatedReservations);
        calculateStats(updatedReservations);
      } catch (error) {
        setError('Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Fonction pour obtenir les détails de l'étudiant
  const fetchUserDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${studentId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.username;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      return 'Étudiant non trouvé';
    }
  };

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Statistiques des réservations</h1>

      <div style={styles.chartContainer}>
        <div style={styles.chartItem}>
          <h2>Répartition des réservations par étudiant</h2>
          <Pie
            data={{
              labels: chartData.studentLabels,
              datasets: [{
                data: chartData.studentData,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)', 
                  'rgba(54, 162, 235, 0.6)', 
                  'rgba(255, 159, 64, 0.6)', 
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)', 
                  'rgba(255, 159, 64, 0.6)',
                ],
                // Réduire la taille des cercles
                borderWidth: 1,  // Réduire l'épaisseur du contour
                hoverBorderWidth: 3,  // Lorsque survolé, borderWidth sera plus grand
                radius: '75%',  // Réduire la taille des cercles
              }],
            }}
          />
        </div>
        <div style={styles.chartItem}>
          <h2>Répartition des réservations par statut</h2>
          <Pie
            data={{
              labels: chartData.statusLabels,
              datasets: [{
                data: chartData.statusData,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',  // Terminée
                  'rgba(54, 162, 235, 0.6)',  // En cours
                  'rgba(255, 159, 64, 0.6)',  // Annulée
                  'rgba(75, 192, 192, 0.6)',  // Retardée
                ],
                // Réduire la taille des cercles
                borderWidth: 1,
                hoverBorderWidth: 3,
                radius: '75%',  // Réduire la taille des cercles
              }],
            }}
          />
        </div>
      </div>

      <div style={styles.chartContainer}>
        <div style={styles.chartItem}>
          <h2>Répartition des réservations par date</h2>
          <Line
            data={{
              labels: chartData.dateLabels,
              datasets: [{
                label: 'Nombre de réservations',
                data: chartData.dateData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
              }],
            }}
            options={{
              scales: {
                y: {
                  ticks: {
                    // Appliquer le formatage pour rendre les ticks entiers
                    callback: function(value) {
                      return value % 1 === 0 ? value : ''; // Afficher que les entiers
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationStats;
