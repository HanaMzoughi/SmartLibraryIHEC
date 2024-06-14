import { React } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ auth }) => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login-register" ||
    location.pathname === "/login-register/";

  // Se for a página de login, não exibe o cabeçalho
  if (isLoginPage) {
    return null;
  }

  // Caso contrário, exibe o cabeçalho com os botões de navegação
  return (
    <div className="navigate-container">
      <div className="header-logo">SARAIVA</div>
      <Link to="/" className="navigate-button">
        Home
      </Link>
      <Link to="/bookshelf" className="navigate-button">
        Bookshelf
      </Link>
      <Link
        to={auth ? "/profile" : "/login-register"}
        className="navigate-button profile-button"
      >
        {auth ? "Profile" : "Sign In"}
      </Link>
    </div>
  );
};

export default Header;
