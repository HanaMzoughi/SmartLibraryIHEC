class User:
    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.password = password

    def __str__(self):
        return self.username
