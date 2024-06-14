class Book:
    def __init__(self, title, author, link, post_by):
        """
        Initialize a new Book instance.

        Args:
            title (str): The title of the book.
            author (str): The author of the book.
            link (str): The link to the book.
            post_by (str): The username of the person who posted the book.
        """
        self.title = title
        self.author = author
        self.link = link
        self.post_by = post_by

    def to_dict(self):
        """
        Convert the Book instance to a dictionary.

        Returns:
            dict: A dictionary representation of the book instance.
        """
        return {
            'title': self.title,
            'author': self.author,
            'link': self.link,
            'post_by': self.post_by
        }
