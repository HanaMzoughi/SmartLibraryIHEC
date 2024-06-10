class Bookshelf:
    def __init__(self, user_id, book_ids=None):
        self.user_id = user_id
        self.book_ids = book_ids or []

    def add_book(self, book_id):
        if book_id not in self.book_ids:
            self.book_ids.append(book_id)

    def remove_book(self, book_id):
        if book_id in self.book_ids:
            self.book_ids.remove(book_id)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'book_ids': self.book_ids
        }
