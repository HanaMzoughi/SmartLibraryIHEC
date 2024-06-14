import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/button/Button";
import axios from "axios";
import TextInput from "../../components/textInput/TextInput";
import Modal from "../../components/modal/Modal";
import "./Profile.css";
import Popup from "../../components/popup/Popup";

export default function Profile({ handleAuth }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ _id: "", email: "", username: "" });
  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newLink, setNewLink] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState("");
  const [usernameUpdate, setUsernameUpdate] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token != null) {
          const response = await axios.get("http://localhost:8000/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { _id, email, username } = response.data;
          setUser({ _id, email, username });
        } else {
          console.log("token missing");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user._id]);

  const fetchBooks = async () => {
    try {
      if (token != null) {
        const response = await axios.get("http://localhost:8000/");
        const userBooks = response.data.filter(
          (book) => book.post_by === user._id
        );
        setBooks(userBooks);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleLogout = () => {
    if (token != null) {
      localStorage.clear();
      handleAuth();
    }
    navigate("/");
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleLinkChange = (event) => {
    setNewLink(event.target.value);
  };

  const handlePublish = async () => {
    try {
      if (!newTitle || !newAuthor || !newLink) {
        setPopupMessage("Missing fields");
        setPopupType("error");
        return;
      }

      const data = { title: newTitle, author: newAuthor, link: newLink };

      const response = await axios.post(
        "http://localhost:8000/publish/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchBooks();
      setPopupMessage("Book published successfully!");
      setPopupType("success");
    } catch (error) {
      console.error("Error publishing book:", error);
      setPopupMessage("Error publishing book");
      setPopupType("error");
    }
  };

  const handleUsernameChange = (event) => {
    setUsernameUpdate(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordUpdate(event.target.value);
  };

  const handleProfileUpdate = async () => {
    try {
      if (!passwordUpdate && !usernameUpdate) {
        setPopupMessage("Missing fields");
        setPopupType("error");
        return;
      }
      const data = { username: usernameUpdate, password: passwordUpdate };
      const response = await axios.put(
        "http://localhost:8000/profile/edit/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        if (usernameUpdate !== "") {
          setUser({ username: usernameUpdate });
        }
        setUsernameUpdate("");
        setPasswordUpdate("");
        setPopupMessage("Profile updated successfully!");
        setPopupType("success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setPopupMessage("Error updating profile");
      setPopupType("error");
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/${bookId}`);
  };

  const handleClosePopup = () => {
    setPopupMessage("");
    setPopupType("");
  };

  const handleDeleteUser = async () => {
    try {
      // Não exibir o modal de exclusão se não houver um token
      if (token == null) {
        console.log("Token missing");
        return;
      }

      // Oculta o modal de exclusão
      setShowDeleteModal(false);

      // Realiza a exclusão do livro
      await axios.delete(`http://localhost:8000/profile/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Exibe uma mensagem de sucesso
      setPopupMessage("User deleted successfully!");
      setPopupType("success");

      // Redirecionar para uma página de sucesso ou qualquer outra ação necessária após a exclusão
      setTimeout(() => {
        handleLogout();
      }, 1000);
    } catch (error) {
      console.error("Error deleting book:", error);
      setPopupMessage("Failed to delete User. Please try again.");
      setPopupType("error");
    }
  };

  return (
    <div className="profile-screen">
      {token !== null ? (
        <div>
          <div className="profile-hello">
            <p>Hello, {user.username}! </p>
            <p className="profile-email">{user.email}</p>
            <Button dark={false} onClick={handleLogout} text={"Logout"} />
          </div>
          <div className="profile-inputs">
            <div className="column profile-publish">
              <p>New Publication</p>
              <TextInput
                name="title"
                onChange={handleTitleChange}
                placeholder={"Title"}
                type={"text"}
                value={newTitle}
              />
              <TextInput
                name="author"
                onChange={handleAuthorChange}
                placeholder={"Author"}
                type={"text"}
                value={newAuthor}
              />
              <TextInput
                name="link"
                onChange={handleLinkChange}
                placeholder={"PDF Link"}
                type={"text"}
                value={newLink}
              />
              <Button dark={true} text={"Publish"} onClick={handlePublish} />
            </div>
            <p className="logo">SARAIVA</p>
            <div className="column profile-update">
              <p>Update your profile</p>
              <TextInput
                name="username"
                onChange={handleUsernameChange}
                placeholder={"Username"}
                type={"text"}
                value={usernameUpdate}
              />
              <TextInput
                name="password"
                onChange={handlePasswordChange}
                placeholder={"Password"}
                type={"password"}
                value={passwordUpdate}
              />
              <Button dark={true} text={"Save"} onClick={handleProfileUpdate} />
            </div>
          </div>
          <div className="profile-publications">
            <p>Your Publications</p>
            {books.length > 0 ? (
              <div className="book-list">
                {books.map((book) => (
                  <div
                    className="book-item"
                    key={book._id}
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
                  height: "10vh",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>Waiting your first publication</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "88vw",
            height: "100vh",
          }}
        >
          <p>
            Missing user! You need to{" "}
            <Link to={"/login-register"}>sign in</Link>
          </p>
        </div>
      )}
      <div className="delete-account">
        <p onClick={() => setShowDeleteModal(true)}>Delete your account?</p>
      </div>

      {/* Modal de confirmação para exclusão */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete your account?</p>
        <div className="modal-buttons">
          <Button text="Delete" onClick={handleDeleteUser} />
        </div>
      </Modal>

      <Popup
        message={popupMessage}
        type={popupType}
        onClose={handleClosePopup}
      />
    </div>
  );
}
