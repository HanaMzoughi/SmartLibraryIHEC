import React, { useState, useEffect } from "react";
import "./Popup.css";

const Popup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        onClose(); // Chama a função para fechar o popup após alguns segundos
      }, 4000); // Fecha o popup após 4 segundos
    }
  }, [message, onClose]);

  return (
    <div className={`popup ${type} ${visible ? "show" : ""}`}>
      <div className="popup-content">{message}</div>
    </div>
  );
};

export default Popup;
