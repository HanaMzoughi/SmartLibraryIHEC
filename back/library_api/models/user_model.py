class User:
    def __init__(self, email, username, password):
        """
        Initialize a new User instance.

        Args:
            email (str): The email address of the user.
            username (str): The username of the user.
            password (str): The password of the user.
        """
        self.email = email
        self.username = username
        self.password = password

    def __str__(self):
        """
        Return a string representation of the user.

        Returns:
            str: The username of the user.
        """
        return self.username
