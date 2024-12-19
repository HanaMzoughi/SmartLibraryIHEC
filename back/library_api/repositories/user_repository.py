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

    def create_user(self, email, username, password, role,university=None, speciality=None):
        """
        Create a new user in the database.
        The role is provided as a parameter and is independent of the email domain.
        QR duration is based on the email domain.
        """
        existing_user = self.collection.find_one({'email': email})
        if existing_user:
            return False

        # Determine QR duration based on email domain
        if email.endswith("@ihec.ucar.tn"):
            qr_duration = 365 * 24  # 1 year for IHEC students
        else:
            qr_duration = 24  # 24 hours for non-IHEC students

        # Admins and bibliothécaires do not need QR codes
        

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_data = {
            'email': email,
            'username': username,
            'password': hashed_password.decode('utf-8'),
            'role': role,
            'qr_duration': qr_duration  # Set QR duration based on email domain
        }
        if role == "étudiant":
            user_data['university'] = university
            user_data['speciality'] = speciality
        result = self.collection.insert_one(user_data)
        return result.acknowledged

    def get_user_by_email(self, email):
        """
        Get a user by their email address from the database.
        """
        user_data = self.collection.find_one({'email': email})
        if user_data:
            return user_data
        return None
    
    def get_user_by_id(self, _id):
        """
        Get a user by their ID from the database.
        """
        user_data = self.collection.find_one({'_id': ObjectId(_id)})
        if user_data:
            return user_data
        return None

    def delete_user(self, _id):
        """
        Delete a user from the database.
        """
        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result.deleted_count > 0

    def update_user(self, _id, new_data):
        """
        Update a user in the database.
        """
        result = self.collection.update_one({'_id': ObjectId(_id)}, {'$set': new_data})
        return result.modified_count > 0
    def get_all_users(self):
        """
        Retrieves all users from the database.
        """
        return list(self.collection.find())  # Retourne tous les utilisateurs