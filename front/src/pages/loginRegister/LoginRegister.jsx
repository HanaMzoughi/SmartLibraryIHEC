import React, { useEffect, useState } from "react";
import "./LoginRegister.css";
import Button from "../../components/button/Button";
import TextInput from "../../components/textInput/TextInput";
import Popup from "../../components/popup/Popup"; // Importa o componente Popup
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginRegister({ handleAuth }) {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // Tipos de popup: success, error, warning
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goBack() {
    navigate(-1);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClosePopup = () => {
    setPopupMessage("");
    setPopupType("");
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setPopupMessage("Email and password are required");
        setPopupType("error");
        return;
      }

      const response = await axios.post("http://localhost:8000/login/", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Guardar o token no localStorage
      handleAuth();
      navigate("/"); // Redirecionar para a página de dashboard ou outra página
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setPopupMessage(error.response.data.message);
      } else {
        setPopupMessage("Failed to login. Please try again.");
      }
      setPopupType("error");
    }
  };

  const handleRegister = async () => {
    try {
      if (!email || !username || !password) {
        setPopupMessage("Email, username, and password are required");
        setPopupType("error");
        return;
      }

      const response = await axios.post("http://localhost:8000/register/", {
        email,
        username,
        password,
      });

      console.log(response.data); // Exemplo de como lidar com a resposta da API
      // Redirecionar ou mostrar mensagem de sucesso, etc.
      setLogin(!login);
      setPopupMessage("Registration successful!");
      setPopupType("success");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setPopupMessage(error.response.data.message);
      } else {
        setPopupMessage("Failed to register. Please try again.");
      }
      setPopupType("error");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-register-container">
        <div className="login-register-logo">SARAIVA</div>
        <div className="login-register-inputs">
          {login ? (
            <>
              <TextInput
                placeholder={"Email"}
                value={email}
                onChange={handleEmailChange}
                type={"email"}
                required={true}
              />
              <TextInput
                placeholder={"Password"}
                value={password}
                onChange={handlePasswordChange}
                type={"password"}
                required={true}
              />
              <div onClick={() => setLogin(!login)} className="account-button">
                Don't have an account?
              </div>
              <div className="row">
                <Button dark={false} text={"Cancel"} onClick={goBack} />
                <Button dark={true} text={"Sign in"} onClick={handleLogin} />
              </div>
            </>
          ) : (
            <>
              <TextInput
                placeholder={"Username"}
                value={username}
                onChange={handleUsernameChange}
                type={"text"}
                required={true}
              />
              <TextInput
                placeholder={"Email"}
                value={email}
                onChange={handleEmailChange}
                type={"email"}
                required={true}
              />
              <TextInput
                placeholder={"Password"}
                value={password}
                onChange={handlePasswordChange}
                type={"password"}
                required={true}
              />
              <div onClick={() => setLogin(!login)} className="account-button">
                Already have an account?
              </div>
              <div className="row">
                <Button dark={false} text={"Cancel"} onClick={goBack} />
                <Button dark={true} text={"Sign up"} onClick={handleRegister} />
              </div>
            </>
          )}
        </div>
      </div>
      <Popup
        message={popupMessage}
        type={popupType}
        onClose={handleClosePopup}
      />
    </div>
  );
}
