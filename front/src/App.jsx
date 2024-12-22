import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./pages/loginRegister/LoginRegister";
import Profile from "./pages/profile/Profile";
import Bookshelf from "./pages/bookshelf/Bookshelf";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import "./App.css";
import Book from "./pages/book/Book";
import UsersTable from "./pages/users/UsersTable";
import AddStudent from "./pages/users/AddStudent";

const App = () => {
  const [auth, setAuth] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, []);

  const handleAuth = () => {
    setAuth(!auth);
  };

  return (
    <Router>
      <div className="screen">
        <Header className="app-header" auth={auth} />
        <div className="routes">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login-register"
              element={<LoginRegister handleAuth={handleAuth} />}
            />
            <Route
              path="/profile"
              element={<Profile handleAuth={handleAuth} />}
            />
            <Route path="/bookshelf" element={<Bookshelf auth={auth} />} />
            <Route path="/:_id" element={<Book />} />            
            <Route path="/create" element={<AddStudent />} />
            <Route path="/userlist" element={<UsersTable handleAuth={handleAuth} /> } /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
