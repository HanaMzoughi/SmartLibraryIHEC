import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Bookshelf({ auth }) {
  const token = localStorage.getItem("token");
  const [booksInfo, setBooksInfo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookshelf = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/bookshelf/list/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchBooksInfo(response.data);
      } catch (error) {
        console.error("Error fetching book or user details:", error);
      }
    };

    fetchBookshelf();
  }, [token]);

  const fetchBooksInfo = async (bookIds) => {
    try {
      const bookInfoPromises = bookIds.map(async (bookId) => {
        const response = await axios.get(`http://localhost:8000/${bookId}/`);
        return response.data;
      });

      const booksInfo = await Promise.all(bookInfoPromises);
      setBooksInfo(booksInfo);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/${bookId}`);
  };

  return (
    <>
      {token != null ? (
        <>
          {booksInfo.length > 0 ? (
            <div className="book-list">
              {booksInfo.map((book) => (
                <div
                  className="book-item"
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                >
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                height: "100vh",
                width: "88vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p>No books found.</p>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            height: "100vh",
            width: "88vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>
            Missing user! You need to{" "}
            <Link to={"/login-register"}>sign in</Link>
          </p>
        </div>
      )}
    </>
  );
}
