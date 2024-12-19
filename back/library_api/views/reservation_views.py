import json
import jwt
from datetime import timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from library_api.repositories.reservation_repository import ReservationRepository
from library_api.serializers.reservation_serializer import ReservationSerializer
from library_project.settings import SECRET_KEY

@csrf_exempt
def create_reservation(request):
    """
    Crée une nouvelle réservation.

    Méthode: POST
    Autorisation: Token JWT requis

    Paramètres du corps :
    - book_id: str (obligatoire)
    - duration: str (obligatoire)  # Durée de la réservation, ex: "7 days"
    - student_id: str (obligatoire)  # ID de l'étudiant (manuellement fourni pour les tests)

    Retourne :
    - 201: Réservation créée avec succès
    - 400: Champs requis manquants ou JSON invalide
    - 500: Erreur serveur interne
    """
    if request.method == 'POST':
        token = request.headers.get('Authorization')  # Récupère le token d'autorisation

        if not token:
            return JsonResponse({'error': 'Token requis'}, status=401)

        try:
            # Retirer le préfixe 'Bearer ' du token
            token = token.split(' ')[1]
            # Décoder le token
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            student_id = payload['_id']  # Vous pouvez utiliser l'ID de l'étudiant à partir du payload du token

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Le token a expiré'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token invalide'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Une erreur est survenue lors de la vérification du token: {str(e)}'}, status=500)

        # Si le token est valide, récupérer les données de la requête
        try:
            data = json.loads(request.body.decode('utf-8'))
            book_id = data.get('book_id')
            duration = data.get('duration')
            student_id_request = data.get('student_id')

            # Vérifiez que tous les champs sont présents
            if not book_id or not duration or not student_id_request:
                return JsonResponse({'error': 'Champs requis manquants'}, status=400)

            # Si l'ID de l'étudiant dans le token ne correspond pas à l'ID dans les données, c'est une erreur
            if str(student_id) != str(student_id_request):
                return JsonResponse({'error': 'L\'ID de l\'étudiant ne correspond pas au token'}, status=403)

            # Créer la réservation
            reservation_repo = ReservationRepository()
            reservation_created = reservation_repo.create_reservation(book_id=book_id, student_id=student_id, duration=duration)

            if reservation_created:
                return JsonResponse({'message': 'Réservation créée avec succès', 'duration': duration}, status=201)
            else:
                return JsonResponse({'error': 'Échec de la création de la réservation'}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON invalide'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Une erreur est survenue : {str(e)}'}, status=500)

    return JsonResponse({'error': 'Méthode HTTP invalide'}, status=405)



def get_reservations(request):
    """
    Récupère la liste de toutes les réservations.
    Méthode: GET
    Retourne :
    - 200: Liste des réservations
    - 500: Erreur serveur interne
    """
    if request.method == 'GET':
        try:
            reservation_data = ReservationRepository().get_reservations()  # Récupère toutes les réservations
            serialized_reservations = [ReservationSerializer.serialize(reservation) for reservation in reservation_data]
            return JsonResponse(serialized_reservations, safe=False, status=200)  # Retourne les réservations en JSON
        except Exception as e:
            return JsonResponse({'error': f'Une erreur est survenue : {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Méthode HTTP invalide'}, status=405)


def get_reservation(request, reservation_id):
    """
    Récupère les informations d'une réservation spécifique.

    Méthode: GET

    Paramètre :
    - reservation_id: str (obligatoire)

    Retourne :
    - 200: Détails de la réservation
    - 404: Réservation non trouvée
    - 500: Erreur serveur interne
    """
    if request.method == 'GET':
        try:
            reservation_repo = ReservationRepository()
            reservation_data = reservation_repo.get_reservation(reservation_id)

            if reservation_data:
                serialized_reservation = ReservationSerializer.serialize(reservation_data)
                return JsonResponse(serialized_reservation, safe=False)
            else:
                return JsonResponse({'error': 'Réservation non trouvée'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def update_reservation(request, reservation_id):
    """
    Met à jour une réservation spécifique.

    Méthode: PUT
    Autorisation: Token Bearer requis

    Paramètres du corps :
    - status: str (obligatoire)  # Par exemple "completed", "pending", ou "in_progress"

    Retourne :
    - 200: Réservation mise à jour avec succès
    - 400: JSON invalide ou champ requis manquant
    - 401: Token expiré ou invalide
    - 404: Réservation non trouvée
    - 500: Erreur serveur interne
    """
    if request.method == 'PUT':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            student_id = payload['_id']  # ID de l'étudiant connecté

            data = json.loads(request.body.decode('utf-8'))
            status = data.get('status')

            if not status:
                return JsonResponse({'error': 'Le statut est requis'}, status=400)

            reservation_repo = ReservationRepository()
            reservation_data = reservation_repo.get_reservation(reservation_id)

            if not reservation_data:
                return JsonResponse({'error': 'Réservation non trouvée'}, status=404)

            if str(reservation_data['student']) != student_id:
                return JsonResponse({'error': 'Non autorisé à modifier cette réservation'}, status=403)

            # Mise à jour de la réservation
            result = reservation_repo.update_reservation(reservation_id, {'status': status})

            if result.modified_count > 0:
                updated_reservation = reservation_repo.get_reservation(reservation_id)
                serialized_reservation = ReservationSerializer.serialize(updated_reservation)
                return JsonResponse(serialized_reservation, safe=False)
            else:
                return JsonResponse({'error': 'Aucune mise à jour effectuée'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Le token a expiré'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token invalide'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON invalide'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Une erreur est survenue : {str(e)}'}, status=500)

    return JsonResponse({'error': 'Méthode HTTP invalide'}, status=405)


@csrf_exempt
def delete_reservation(request, reservation_id):
    """
    Supprime une réservation spécifique.

    Méthode: DELETE
    Autorisation: Token Bearer requis

    Retourne :
    - 200: Réservation supprimée avec succès
    - 401: Token expiré ou invalide
    - 404: Réservation non trouvée
    - 500: Erreur serveur interne
    """
    if request.method == 'DELETE':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            student_id = payload['_id']  # ID de l'étudiant connecté

            reservation_repo = ReservationRepository()
            reservation_data = reservation_repo.get_reservation(reservation_id)

            if not reservation_data:
                return JsonResponse({'error': 'Réservation non trouvée'}, status=404)

            if str(reservation_data['student']) != student_id:
                return JsonResponse({'error': 'Non autorisé à supprimer cette réservation'}, status=403)

            result = reservation_repo.delete_reservation(reservation_id)

            if result.deleted_count > 0:
                return JsonResponse({'message': 'Réservation supprimée avec succès'}, status=200)
            else:
                return JsonResponse({'error': 'Échec de la suppression de la réservation'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Le token a expiré'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token invalide'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Une erreur est survenue : {str(e)}'}, status=500)

    return JsonResponse({'error': 'Méthode HTTP invalide'}, status=405)