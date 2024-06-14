import json

class UserSerializer:
    @staticmethod
    def serialize(user):

        """
        Serialize user data into a format suitable for API responses.

        Args:
            user (dict): A dictionary containing user data.

        Returns:
            dict: A serialized version of the user data.
        """

        user_data = {
            '_id': str(user.get('_id')),
            'email': user.get('email'),
            'username': user.get('username'),
        }
        return user_data

    @staticmethod
    def deserialize(data):

        """
        Deserialize JSON data into a dictionary.

        Args:
            data (str): A JSON string containing user data.

        Returns:
            dict: A dictionary containing deserialized user data.

        Raises:
            ValueError: If the JSON data is invalid.
        """

        try:
            user_data = json.loads(data)
            return user_data
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON")

    @staticmethod
    def sanitize(user_data):

        """
        Remove sensitive data from user data.

        Args:
            user_data (dict): A dictionary containing user data.

        Returns:
            dict: A sanitized version of the user data with sensitive information removed.
        """
        
        user_data.pop('password', None)
        return user_data
