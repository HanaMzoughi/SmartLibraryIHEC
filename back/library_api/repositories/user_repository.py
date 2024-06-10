import bcrypt
from bson import ObjectId
from library_project.settings import *

class UserRepository:
    def __init__(self):
        self.client = client
        self.db = db
        self.collection = self.db['users']

    def create_user(self, email, username, password):
        existing_user = self.collection.find_one({'email': email})
        if existing_user:
            return False

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_data = {
            'email': email,
            'username': username,
            'password': hashed_password.decode('utf-8'),
        }
        result = self.collection.insert_one(user_data)
        return result.acknowledged
    
    def get_user_by_email(self, email):
        user_data = self.collection.find_one({'email': email})
        return user_data
    
    def get_user_by_id(self, _id):
        user_data = self.collection.find_one({'_id': ObjectId(_id)})
        return user_data

    def delete_user(self, _id):
        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result.deleted_count > 0

    def update_user(self, _id, new_data):
        result = self.collection.update_one({'_id': ObjectId(_id)}, {'$set': new_data})
        return result.modified_count > 0
 
