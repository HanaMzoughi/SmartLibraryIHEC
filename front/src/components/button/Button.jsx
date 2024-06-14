import React from "react";
import "./Button.css";

export default function Button({ onClick, text, dark, opacity }) {
  return (
    <div
      className={`button-container ${dark ? "btn-dark" : "btn-white"}`}
      onClick={onClick}
      style={{ opacity: opacity }}
    >
      {text}
    </div>
  );
}
