class BookSerializer:
    @staticmethod
    def serialize(book_data):

        """
        Serialize book data into a format suitable for API responses.

        Args:
            book_data (dict): A dictionary containing book data.

        Returns:
            dict: A serialized version of the book data.
        """
        
        serialized_book = {
            'id': str(book_data['_id']),
            'title': book_data['title'],
            'author': book_data['author'],
            'link': book_data['link'],
            'post_by': book_data['post_by'],
        }
        return serialized_book
