from library_project.settings import *
from bson.objectid import ObjectId

class BookRepository:
    def __init__(self):
        """
        Initialize a new BookRepository instance.
        Sets up the database client, database, and collection for books.
        """
        self.client = client
        self.db = db
        self.collection = self.db['biblio']

    def create_book(self, book_data):
        """
        Create a new book entry in the database.

        Args:
            book_data (dict): A dictionary containing book information.

        Returns:
            bool: True if the book was successfully created, False otherwise.
        """
        result = self.collection.insert_one(book_data)
        return result.acknowledged

    def get_book(self, _id):
        """
        Retrieve a book entry from the database by its ID.

        Args:
            _id (str): The ID of the book to retrieve.

        Returns:
            dict: The book data if found, None otherwise.
        """
        book_data = self.collection.find_one({'_id': ObjectId(_id)})
        return book_data

    def get_books(self):
        """
        Retrieve all book entries from the database.

        Returns:
            pymongo.cursor.Cursor: A cursor to the book documents.
        """
        book_data = self.collection.find()
        return book_data

    def update_book(self, _id, update_data):
        """
        Update a book entry in the database.

        Args:
            _id (str): The ID of the book to update.
            update_data (dict): The data to update in the book document.

        Returns:
            pymongo.results.UpdateResult: The result of the update operation.
        """
        result = self.collection.update_one({'_id': ObjectId(_id)}, {'$set': update_data})
        return result

    def delete_book(self, _id):
        """
        Delete a book entry from the database.

        Args:
            _id (str): The ID of the book to delete.

        Returns:
            pymongo.results.DeleteResult: The result of the delete operation.
        """
        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result
