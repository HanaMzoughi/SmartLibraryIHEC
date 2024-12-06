from django.urls import path # type: ignore
from library_api.views import book_views, bookshelf_views, user_views

# Define the URL patterns for the library API application
urlpatterns = [
    path('register/', user_views.user_register, name='register'),  # Endpoint for user registration
    path('login/', user_views.user_login, name='login'), # Endpoint for user login
    path('profile/', user_views.user_info, name='profile'), # Endpoint for fetching user profile information
    path('profile/edit/', user_views.user_update, name='edit profile'), # Endpoint for updating user profile
    path('profile/delete/', user_views.user_delete, name='delete profile'), # Endpoint for deleting user profile

    # Any user info endpoint
    path('user/<str:_id>/', user_views.user_open_info, name='open_info_user'), # Endpoint for fetching specific user info

    # Book-related endpoints
    path('', book_views.get_books, name='home'),  # Endpoint for fetching all books (home page)
    path('publish/', book_views.book_register, name='add book'), # Endpoint for adding a new book   
    path('<str:_id>/', book_views.book_info, name='specific_book'), # Endpoint for fetching details of a specific book
    path('<str:book_id>/edit/', book_views.book_update, name='update_book'), # Endpoint for updating a specific book
    path('<str:book_id>/delete/', book_views.book_delete, name='delete_book'), # Endpoint for deleting a specific book

    # Bookshelf-related endpoints
    path('bookshelf/list/', bookshelf_views.get_bookshelf, name='bookshelf'), # Endpoint for fetching user's bookshelf
    path('bookshelf/<str:book_id>/add/', bookshelf_views.add_book_to_shelf, name='add_book_to_shelf'), # Endpoint for adding a book to the user's bookshelf
    path('bookshelf/<str:book_id>/remove/', bookshelf_views.remove_book_to_shelf, name='remove_book_to_shelf'), # Endpoint for removing a book from the user's bookshelf
]