from django.urls import path
from library_api.views import book_views, bookshelf_views, user_views

urlpatterns = [
    path('register/', user_views.user_register, name='register'),
    path('login/', user_views.user_login, name='login'),
    path('profile/', user_views.user_info, name='profile'),
    path('profile/edit/', user_views.user_update, name='edit profile'),
    path('profile/delete/', user_views.user_delete, name='delete profile'),

    path('', book_views.get_books, name='home'),
    path('publish/', book_views.book_register, name='add book'),
    path('<str:_id>/', book_views.book_info, name='specific_book'),
    path('<str:book_id>/edit/', book_views.book_update, name='update_book'),
    path('<str:book_id>/delete/', book_views.book_delete, name='delete_book'),

    path('bookshelf/list/', bookshelf_views.get_bookshelf, name='bookshelf'),
    path('bookshelf/<str:book_id>/add/', bookshelf_views.add_book_to_shelf, name='add_book_to_shelf'),
    path('bookshelf/<str:book_id>/remove/', bookshelf_views.remove_book_to_shelf, name='remove_book_to_shelf'),
]