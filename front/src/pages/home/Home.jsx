import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Importar os estilos

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/", {});
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/${bookId}`);
  };

  return (
    <div className="book-list">
      {books.map((book) => (
        <div
          key={book.id}
          className="book-item"
          onClick={() => handleBookClick(book.id)}
        >
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
