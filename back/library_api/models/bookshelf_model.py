class Bookshelf:
    def __init__(self, user_id, book_ids=None):
        """
        Initialize a new Bookshelf instance.

        Args:
            user_id (int): The ID of the user who owns the bookshelf.
            book_ids (list, optional): A list of book IDs on the bookshelf. Defaults to an empty list.
        """
        self.user_id = user_id
        self.book_ids = book_ids or []

    def add_book(self, book_id):
        """
        Add a book to the bookshelf.

        Args:
            book_id (int): The ID of the book to add.
        """
        if book_id not in self.book_ids:
            self.book_ids.append(book_id)

    def remove_book(self, book_id):
        """
        Remove a book from the bookshelf.

        Args:
            book_id (int): The ID of the book to remove.
        """
        if book_id in self.book_ids:
            self.book_ids.remove(book_id)

    def to_dict(self):
        """
        Convert the Bookshelf instance to a dictionary.

        Returns:
            dict: A dictionary representation of the bookshelf instance.
        """
        return {
            'user_id': self.user_id,
            'book_ids': self.book_ids
        }
