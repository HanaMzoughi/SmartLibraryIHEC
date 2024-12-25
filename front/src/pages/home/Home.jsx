import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./Home.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("Titre");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/");
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

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const filteredBooks = books.filter((book) => {
    const fieldValue = book[searchFilter];
    return (
      typeof fieldValue === "string" &&
      fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentBooks = filteredBooks.slice(offset, offset + itemsPerPage);

  return (
    <div>
      <div className="header-banner">Bienvenue à la Bibliothèque Digitale de l'IHEC Carthage</div>

      <div className="table-container">
        {/* Barre de recherche */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="search-select"
          >
            <option value="Titre">Titre</option>
            <option value="Auteur">Auteur</option>
            <option value="Editeur">Éditeur</option>
          </select>
        </div>

        {/* Grid des livres */}
        <div className="books-grid">
          {currentBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
              <h3>{book.Titre}</h3>
              <p>Auteur : {book.Auteur}</p>
              <p>Éditeur : {book.Editeur}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
      <ReactPaginate
        previousLabel={"Précédent"}
        nextLabel={"Suivant"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredBooks.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
      />
      </div>
    </div>
  );
};

export default Home;
