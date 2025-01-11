import React, { useState } from "react"; 
import logo from './chatbot.png';
import image from './chat.png';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Bonjour, je suis un assistant de bibliothèque digital. Comment puis-je vous aider ?",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await response.json();
      if (response.ok) {
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Erreur : " + data.error || "Impossible de contacter le serveur." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur : Impossible de contacter le serveur." },
      ]);
    }

    setUserInput("");
  };

  return (
    <div style={styles.container}>
      {isOpen && (
        <>
          <div style={styles.chatbotContainer}>
            <div style={styles.chatWindow}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                    backgroundColor: msg.sender === "bot" ? "#f1f1f1" : "#007bff",
                    color: msg.sender === "bot" ? "#000" : "#fff",
                  }}
                >
                  {msg.sender === "bot" ? (
                    <img src={logo} alt="logo" style={styles.logo} />
                  ) : null}
                  <div style={{ marginLeft: "10px" }}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                style={styles.input}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tapez votre message..."
              />
              <button style={styles.button} onClick={sendMessage}>
                Envoyer
              </button>
            </div>
          </div>

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
        </>
      )}

      <div style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
        <img src={image} alt="chat icon" style={{ width: "60px", height: "60px" }} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
  },
  chatbotContainer: {
    width: "400px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    position: "fixed",
    bottom: "70px",
    right: "20px",
    zIndex: 1000,
  },
  chatWindow: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    height: "300px",
    backgroundColor: "#f9f9f9",
  },
  message: {
    display: "flex",
    alignItems: "center",
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "15px",
    fontSize: "14px",
  },
  logo: {
    width: "40px",
    height: "40px",
  },
  inputContainer: {
    borderTop: "1px solid #ddd",
    background: "white",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
  },
  fab: {
    width: "60px",
    height: "60px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1001,
  },
};

export default Chatbot;