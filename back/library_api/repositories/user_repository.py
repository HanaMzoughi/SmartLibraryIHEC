import bcrypt
from bson import ObjectId
from library_project.settings import *

class UserRepository:
    def __init__(self):

        """
        Initialize a new UserRepository instance.
        Sets up the database client, database, and collection for users.
        """

        self.client = client
        self.db = db
        self.collection = self.db['users']

    def create_user(self, email, username, password):

        """
        Create a new user in the database.

        Args:
            email (str): The email address of the user.
            username (str): The username of the user.
            password (str): The password of the user.

        Returns:
            bool: True if the user was successfully created, False if the user already exists.
        """

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

        """
        Get a user by their email address from the database.

        Args:
            email (str): The email address of the user to retrieve.

        Returns:
            dict: The user data if found, None otherwise.
        """

        user_data = self.collection.find_one({'email': email})
        return user_data
    
    def get_user_by_id(self, _id):

        """
        Get a user by their ID from the database.

        Args:
            _id (str): The ID of the user to retrieve.

        Returns:
            dict: The user data if found, None otherwise.
        """

        user_data = self.collection.find_one({'_id': ObjectId(_id)})
        return user_data

    def delete_user(self, _id):

        """
        Delete a user from the database.

        Args:
            _id (str): The ID of the user to delete.

        Returns:
            bool: True if the user was successfully deleted, False otherwise.
        """

        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result.deleted_count > 0

    def update_user(self, _id, new_data):

        """
        Update a user in the database.

        Args:
            _id (str): The ID of the user to update.
            new_data (dict): The new data to update in the user document.

        Returns:
            bool: True if the user was successfully updated, False otherwise.
        """
        
        result = self.collection.update_one({'_id': ObjectId(_id)}, {'$set': new_data})
        return result.modified_count > 0
 
