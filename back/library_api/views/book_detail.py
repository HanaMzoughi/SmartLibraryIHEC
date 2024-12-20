from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from library_api.models.book_model import Book  

@csrf_exempt
def book_detail(request, book_id):
    """
    Retourne les détails d'un livre spécifique.
    """
    try:
        book = get_object_or_404(Book, _id=book_id)
        return JsonResponse(book.to_dict(), safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
