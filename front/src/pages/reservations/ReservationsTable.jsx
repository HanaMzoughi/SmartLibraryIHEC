import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReservationsTable.css';

const ReservationsTable = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentReservation, setCurrentReservation] = useState({
    student: '',
    book: '',
    date_reservation: '',
    duration: '', // Nouvelle propriété pour la durée
    status: '',
    id: '' // Utilisation de "id"
  });
  const navigate = useNavigate();

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

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:8000/${bookId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.Titre;
    } catch (error) {
      console.error('Erreur lors de la récupération du livre', error);
      return 'Livre non trouvé';
    }
  };

  const handleEdit = (reservationId) => {
    const reservationToEdit = reservations.find(reservation => reservation.id === reservationId);

    if (!reservationToEdit) {
      console.error('Réservation non trouvée', reservationId);
      return;
    }

    setCurrentReservation({
      student: reservationToEdit.student,
      book: reservationToEdit.book,
      date_reservation: reservationToEdit.date_reservation,
      duration: reservationToEdit.duration, // Durée existante
      status: reservationToEdit.status,
      id: reservationToEdit.id
    });
    setEditMode(true);
  };

  const handleDelete = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8000/reservation/${reservationId}/delete/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      setError('Erreur lors de la suppression de la réservation');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentReservation({
      student: '',
      book: '',
      date_reservation: '',
      duration: '',
      status: '',
      id: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedReservation = {
        duration: currentReservation.duration, // Met à jour la durée
        status: currentReservation.status, // Met à jour le statut
      };

      await axios.put(`http://localhost:8000/reservation/${currentReservation.id}/update/`, updatedReservation, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setReservations(reservations.map(reservation =>
        reservation.id === currentReservation.id ? { ...reservation, ...updatedReservation } : reservation
      ));

      setEditMode(false);
      setCurrentReservation({
        student: '',
        book: '',
        date_reservation: '',
        duration: '',
        status: '',
        id: ''
      });
    } catch (error) {
      setError('Erreur lors de la mise à jour de la réservation');
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reservations/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const updatedReservations = await Promise.all(response.data.map(async (reservation) => {
          const studentName = await fetchUserDetails(reservation.student_id);
          const bookTitle = await fetchBookDetails(reservation.book_id);

          return {
            ...reservation,
            student: studentName,
            book: bookTitle,
          };
        }));

        setReservations(updatedReservations);
      } catch (error) {
        setError('Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('fr-FR', options) + ' ' + date.toLocaleTimeString('fr-FR');
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reservations-table-container">
      <h1>Liste des réservations</h1>

      <button className="add-btn2" onClick={() => navigate('/create-reservation')}>Ajouter réservation</button>

      {editMode ? (
        <div className="edit-form">
          <h2>Modifier la réservation</h2>
          <input
            type="text"
            value={currentReservation.duration}
            onChange={(e) => setCurrentReservation({ ...currentReservation, duration: e.target.value })}
            placeholder="Durée de la réservation"
          />
          <input
            type="text"
            value={currentReservation.status}
            onChange={(e) => setCurrentReservation({ ...currentReservation, status: e.target.value })}
            placeholder="Statut de la réservation"
          />
          <button className="save-btn" onClick={handleSaveEdit}>Sauvegarder</button>
          <button className="cancel-btn" onClick={handleCancelEdit}>Annuler</button>
        </div>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom de l'étudiant</th>
              <th>Titre du livre</th>
              <th>Date de réservation</th>
              <th>Durée</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.student}</td>
                <td>{reservation.book}</td>
                <td>{formatDate(reservation.date_reservation)}</td>
                <td>{reservation.duration}</td>
                <td>{reservation.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(reservation.id)}>Modifier</button>
                  <button className="delete-btn" onClick={() => handleDelete(reservation.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationsTable;
