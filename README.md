# SmartLibraryIHEC

A modern web application developed to streamline academic resource management and provide a digital library system. The project offers features for students and administrators to manage, consult, and access books through an intuitive interface, enhanced by an AI-powered chatbot.

## Project Structure

- **Backend**: Django framework with MongoDB as the database.  
- **Frontend**: React.js with React Router DOM for routing and Axios for API requests.  
- **AI Chatbot**: Integrated using OpenAI's GPT-3.5 API.

## Features
# User Roles
-Students:
Search and reserve books.
View personalized dashboard and reservation history.
Login using UCAR accounts or QR codes.
Interact with AI-powered chatbot for assistance.

-Librarians:

Manage book reservations.
View reservation statistics on a dedicated dashboard.

-Administrators:

Manage books, categories, and user accounts (students, librarians, external users).
Generate QR codes for user access.
View detailed statistics (most borrowed books, peak usage).
Core Functionalities
Book Management:
Add, update, delete books, and organize by categories (author, genre, year).

# User Management:
Manage user accounts with role-based access and generate QR codes for authentication.

Reservations:
Allow students to reserve books, with librarians managing reservations.

Search and Filtering:
Search by title, author, and publisher, with filters for availability and categories.

Statistics and Dashboards:
Display key statistics and provide role-specific dashboards for students, librarians, and administrators.

AI Chatbot:
Offer assistance with book-related queries and reservation guidance using OpenAI-powered chatbot.


## Prerequisites

Ensure the following tools are installed on your system before proceeding:

- **Node.js**  
- **Python 3.11**  
- **MongoDB**  
- **pip** (Python package installer)  
- **virtualenv** (for creating isolated Python environments)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HanaMzoughi/SmartLibraryIHEC.git
cd SmartLibraryIHEC

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/HanaMzoughi/SmartLibraryIHEC.git
cd SmartLibraryIHEC

cd back
python -m venv env
source env/bin/activate

pip install -r requirements.txt

# Configure Environment Variables
Create a .env file in the back folder and add the following environment variables:

# Sensitive environment variables
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost

# Database connection
MONGO_DB_HOST=localhost
MONGO_DB_PORT=27017
MONGO_DB_NAME=library_database

# CORS policy
CORS_ALLOWED_ORIGINS=http://localhost:3000

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Start the Backend Server

python manage.py runserver

# Front :
cd front
npm install
npm start



