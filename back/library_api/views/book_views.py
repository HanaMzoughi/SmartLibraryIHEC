from library_api.repositories.book_repository import BookRepository
from library_api.repositories.user_repository import UserRepository
from library_project.settings import SECRET_KEY
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from library_api.serializers.book_serializer import BookSerializer
import jwt
import json


@csrf_exempt
def book_register(request):

    if request.method == 'POST':
        # Parse incoming data
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Mapping incoming fields to the Book model fields
        book_data = {
            'Titre': data.get('Titre',None),
            'Auteur': data.get('Auteur',None),
            'Code_barre': data.get('Code_barre', None),
            #'D_Object': data.get('d_object', None),
            'D_CREATION': data.get('D_CREATION', None),
            'D_MODIF': data.get('D_MODIF', None),
            'Cote': data.get('Cote', None),
            'Inventaire': data.get('Inventaire', None),
            'epn': data.get('epn', None),
            'Locale': data.get('Locale', None),
            'Staff_Note': data.get('Staff_Note', None),
            'Public_Note': data.get('Public_Note', None),
            'ISBN_A': data.get('ISBN_A', None),
            'ISBN_Z': data.get('ISBN_Z', None),
            'Item_class': data.get('Item_class', None),
            'Specialite': data.get('Specialite', None),
            'Nb_Page': data.get('Nb_Page', None),
            'Date_edition': data.get('Date_edition', None),
            'Editeur': data.get('Editeur', None),
            'Prix': data.get('Prix', None),
            'Etas': data.get('Etas', 'disponible'),
        }

        # Check if essential fields are provided
        if not book_data['Titre'] or not book_data['Auteur']:
            return JsonResponse({'error': 'Missing required fields (title or author)'}, status=400)

        book_repo = BookRepository()
        book_created = book_repo.create_book(book_data)

        if book_created:
            return JsonResponse({'message': 'Book created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'Failed to create book'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405) 

    
def get_books(request):
    """
    Retrieves a list of all books.
    
    Method: GET
    
    Returns:
    - 200: List of books
    - 500: Internal server error
    """
    if request.method == 'GET':
        try:
            book_data = BookRepository().get_books()
            serialized_books = [BookSerializer.serialize(book) for book in book_data]
            return JsonResponse(serialized_books, safe=False, status=200)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def book_info(request, _id):
    """
    Retrieves information about a specific book.
    
    Method: GET
    
    Path parameters:
    - _id: str (required)
    
    Returns:
    - 200: Book data
    - 404: Book not found
    - 500: Internal server error
    """
    if request.method == 'GET':
        try:
            book_repo = BookRepository()
            book_data = book_repo.get_book(_id)

            if book_data:
                serialized_book = BookSerializer.serialize(book_data)
                return JsonResponse(serialized_book, safe=False)
            else:
                return JsonResponse({'error': 'Book not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@csrf_exempt
def book_update(request, book_id):
    """
    Updates information about a specific book.

    Method: PUT

    Path parameters:
    - book_id: str (required)

    Body parameters (at least one required):
    - title: str
    - author: str
    - link: str

    Returns:
    - 200: Book updated successfully
    - 400: No fields provided for update or invalid JSON
    - 404: Book not found
    - 500: Internal server error
    """
    if request.method == 'PUT':
        try:
            # Récupérer les données JSON envoyées par la requête
            data = json.loads(request.body)

            # Liste des champs autorisés
            fields_to_check = ["N","BIBID","ITEMID","Code_barre","D_CREATION","D_MODIF","Cote","Inventaire","epn","Titre","Auteur","Locale","Staff_Note","Public_Note","ISBN_A","ISBN_Z","Item_class","b","Specialite","Nb_Page","Date_edition","Editeur","Prix","Etas"]

            # Vérifier que des champs valides sont présents dans les données
            if not any(field in data for field in fields_to_check):
                return JsonResponse({'error': 'No fields provided for update'}, status=400)

            # Initialiser le référentiel ou les opérations sur la base de données
            book_repo = BookRepository()

            # Vérifier si le livre existe
            book_data = book_repo.get_book(book_id)
            if not book_data:
                return JsonResponse({'error': 'Book not found'}, status=404)

            # Préparer les données de mise à jour
            update_data = {key: value for key, value in data.items() if key in fields_to_check}

            # Effectuer la mise à jour dans la base de données
            result = book_repo.update_book(book_id, update_data)

            if result.modified_count > 0:
                # Récupérer les données mises à jour pour les retourner
                updated_book = book_repo.get_book(book_id)
                serialized_book = BookSerializer.serialize(updated_book)
                return JsonResponse(serialized_book, safe=False)
            else:
                return JsonResponse({'error': 'Book not found or no changes made'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

    if not any(field in data for field in fields_to_check):
      return JsonResponse({'error': 'No fields provided for update'}, status=400)
@csrf_exempt
def book_delete(request, book_id):
    if request.method == 'DELETE':
        book_repo = BookRepository()
        book_data = book_repo.get_book(book_id)
        if not book_data:
            return JsonResponse({'error': 'Livre non trouvé'}, status=404)

        result = book_repo.delete_book(_id=book_id)

        if result.deleted_count > 0:
            return JsonResponse({'message': 'Livre supprimé avec succès'}, status=200)
        else:
            return JsonResponse({'error': 'Livre non trouvé'}, status=404)

    return JsonResponse({'error': 'Méthode HTTP invalide'}, status=405)