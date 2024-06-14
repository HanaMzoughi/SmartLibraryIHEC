import React from "react";
import "./TextInput.css";

export default function TextInput({ placeholder, value, onChange, type }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
