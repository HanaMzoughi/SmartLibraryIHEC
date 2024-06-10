import json

class UserSerializer:
    @staticmethod
    def serialize(user):
        user_data = {
            '_id': str(user.get('_id')),
            'email': user.get('email'),
            'username': user.get('username'),
        }
        return user_data

    @staticmethod
    def deserialize(data):
        try:
            user_data = json.loads(data)
            return user_data
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON")

    @staticmethod
    def sanitize(user_data):
        user_data.pop('password', None)
        return user_data
