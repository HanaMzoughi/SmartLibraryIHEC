from bson import ObjectId
from library_project.settings import client, db

class BookshelfRepository:
    def __init__(self):
        self.client = client
        self.db = db
        self.collection = self.db['bookshelves']
        
    def add_book_to_shelf(self, book_id, user_id):
        shelf_data = {
            'book_id': ObjectId(book_id),
            'user_id': ObjectId(user_id),
        }
        result = self.collection.insert_one(shelf_data)
        return result.acknowledged

    def get_shelf(self, user_id):
        shelves = self.collection.find({'user_id': ObjectId(user_id)})
        book_ids = [str(shelf['book_id']) for shelf in shelves]
        return book_ids

    
    def remove_book_to_shelf(self, user_id, book_id):
        result = self.collection.delete_one({'user_id': ObjectId(user_id), 'book_id': ObjectId(book_id)})
        return result.deleted_count > 0
