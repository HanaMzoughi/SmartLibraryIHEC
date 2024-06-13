from django.http import HttpResponseForbidden, JsonResponse
import jwt
from library_api.repositories.bookshelf_repository import BookshelfRepository
from library_api.repositories.user_repository import UserRepository
from library_project.settings import SECRET_KEY
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def add_book_to_shelf(request, book_id):

    """
    Adiciona um livro à prateleira do usuário.

    Método: POST
    Autorização: Requer token Bearer

    Parâmetros de caminho:
    - book_id: str (obrigatório)

    Retorna:
    - 200: Livro adicionado com sucesso
    - 401: Token expirado ou inválido
    - 403: Usuário não encontrado
    - 500: Erro interno do servidor
    """

    if request.method == 'POST':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']
            user = UserRepository().get_user_by_id(user_id)
            
            if user:
                bookshelf_repo = BookshelfRepository()
                success = bookshelf_repo.add_book_to_shelf(book_id, user_id)

                if success:
                    return JsonResponse({'message': 'Book added successfully!'})
                else:
                    return JsonResponse({'message': 'There was an error adding the book to the shelf.'})
                
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')

@csrf_exempt
def get_bookshelf(request):

    """
    Recupera a prateleira de livros do usuário.

    Método: GET
    Autorização: Requer token Bearer

    Retorna:
    - 200: Lista de IDs de livros na prateleira do usuário
    - 401: Token expirado ou inválido
    - 500: Erro interno do servidor
    """

    if request.method == 'GET':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']
            bookshelf_repo = BookshelfRepository()
            book_ids = bookshelf_repo.get_shelf(user_id)

            return JsonResponse(book_ids, safe=False)
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')

@csrf_exempt
def remove_book_to_shelf(request, book_id):

    """
    Remove um livro da prateleira do usuário.

    Método: DELETE
    Autorização: Requer token Bearer

    Parâmetros de caminho:
    - book_id: str (obrigatório)

    Retorna:
    - 200: Livro removido com sucesso
    - 401: Token expirado ou inválido
    - 403: Não autorizado ou usuário não encontrado
    - 404: Livro não encontrado na prateleira
    - 500: Erro interno do servidor
    """
    
    if request.method == 'DELETE':
        token = request.headers.get('Authorization').split(' ')[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['_id']
            
            bookshelf_repo = BookshelfRepository()
            if bookshelf_repo.remove_book_to_shelf(user_id, book_id):
                return JsonResponse({'message': 'Deleted successfully'})
            else:
                return JsonResponse({'message': 'Book not found'}, status=404)
            
        except jwt.ExpiredSignatureError:
            return HttpResponseForbidden('Token expired')