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
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']

            user_repo = UserRepository()
            user_data = user_repo.get_user_by_id(user_id)

            if not user_data:
                return JsonResponse({'error': 'User not found'}, status=404)

            data = json.loads(request.body.decode('utf-8'))
            title = data.get('title')
            author = data.get('author')
            link = data.get('link')

            if not title or not author or not link:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            book_repo = BookRepository()
            book_created = book_repo.create_book(title=title, author=author, link=link, post_by=user_id)

            if book_created:
                return JsonResponse({'message': 'Book created successfully'}, status=201)
            else:
                return JsonResponse({'error': 'Failed to create book'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_books(request):
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
def book_update(request, book_id):
    if request.method == 'PUT':
        token = request.headers.get('Authorization').split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']

            book_repo = BookRepository()
            book_data = book_repo.get_book(book_id)

            if not book_data:
                return JsonResponse({'error': 'Book not found'}, status=404)

            if str(book_data['post_by']) != user_id:
                return JsonResponse({'error': 'Unauthorized'}, status=403)

            data = json.loads(request.body)

            # Ensure that at least one field is provided for update
            if not any(field in data for field in ['title', 'author', 'link']):
                return JsonResponse({'error': 'No fields provided for update'}, status=400)

            # Prepare the update data
            update_data = {key: value for key, value in data.items() if key in ['title', 'author', 'link']}
            
            # Update the book in the database
            result = book_repo.update_book(book_id, update_data)

            if result.modified_count > 0:
                # Fetch the updated book data to return
                updated_book = book_repo.get_book(book_id)
                serialized_book = BookSerializer.serialize(updated_book)
                return JsonResponse(serialized_book, safe=False)
            else:
                return JsonResponse({'error': 'Book not found or no changes made'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
@csrf_exempt
def book_delete(request, book_id):
    if request.method == 'DELETE':
        token = request.headers.get('Authorization').split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']

            book_repo = BookRepository()
            book_data = book_repo.get_book(book_id)

            if not book_data:
                return JsonResponse({'error': 'Book not found'}, status=404)

            if str(book_data['post_by']) != user_id:
                return JsonResponse({'error': 'Unauthorized'}, status=403)

            result = book_repo.delete_book(_id = book_id)

            if result.deleted_count > 0:
                return JsonResponse({'message': 'Book deleted successfully'}, status=200)
            else:
                return JsonResponse({'error': 'Book not found'}, status=404)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=401)
        
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)