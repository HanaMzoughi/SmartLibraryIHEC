# Library

## Project Description

The Library is a web application that allows users to view all available books and see details of each book. To add a book to your shelf to read later or to publish a new book, you need to have an account. The project features JWT authentication and uses MongoDB as the database. The frontend is developed with React, using React Router DOM and Axios for API interactions.
For more detailed documentation, please refer to the [Project Documentation](https://docs.google.com/document/d/1SdF9K9jGur6VQXukXquGRWLAEd2DNiWzzrbLzbaYFXc/edit?usp=sharing).

### Members

- Lucas Dias Custodio da Silva
- Vinicius Antunes

## Project Structure

- **Backend**: Django with MongoDB.
- **Frontend**: React with React Router DOM and Axios.

## Features

- View all books.
- View details of each book.
- JWT Authentication (Login and Registration).
- Add books to the shelf (authenticated users only).
- Publish new books (authenticated users only).
- Edit your user.

## Prerequisites

- Node.js
- Python 3.11
- MongoDB
- pip (Python package installer)
- virtualenv (to create Python virtual environments)

## Cloning and Setting Up the Project

### 1. Clone the Repository

```bash
git clone https://github.com/lucasgearhead/Djanjo-React_Library-Project.git
cd Djanjo-React_Library-Project
```

### 2. Setting Up the Backend (Django)

#### Create and Activate the Virtual Environment

```bash
cd back
python -m venv env
source env/bin/activate  # On Windows, use `.\env\Scripts\activate`
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `back` folder and add the following variables:

```
SECRET_KEY=secret
DEBUG=True
ALLOWED_HOSTS=

MONGO_DB_HOST=localhost
MONGO_DB_PORT=27017
MONGO_DB_NAME=library_database
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

#### Start the Server

```bash
python manage.py runserver
```

### 3. Setting Up the Frontend (React)

#### Install Dependencies

```bash
cd ../front
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `front` folder and add the following variable:

```
REACT_APP_API_URL=http://localhost:8000/
```

#### Start the Server

```bash
npm start
```

### 4. Access the Application

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Notices

- **Database**: Make sure MongoDB is installed and running.
- **Environments**: Always activate the virtual environment before running backend commands.
- **Environment Variables**: Keep environment variables secure and do not expose them in public repositories.

## Technologies Used

- **Backend**: Django, MongoDB, PyJWT
- **Frontend**: React, React Router DOM, Axios

## Contributing

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
