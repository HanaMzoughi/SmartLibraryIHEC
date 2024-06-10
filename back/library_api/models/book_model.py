class Book:
    def __init__(self, title, author, link, post_by):
        self.title = title
        self.author = author
        self.link = link
        self.post_by = post_by

    def to_dict(self):
        return {
            'title': self.title,
            'author': self.author,
            'link': self.link,
            'post_by': self.post_by
        }
