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
  const [user, setUser] = useState({
    _id: "",
    email: "",
    username: "",
    role: "",
    university: "",
    speciality: "",
  });

  const [usernameUpdate, setUsernameUpdate] = useState("");
  const [universityUpdate, setUniversityUpdate] = useState("");
  const [specialityUpdate, setSpecialityUpdate] = useState("");
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

          // Mettre à jour l'état de l'utilisateur et les champs de mise à jour
          setUser(response.data);
          setUsernameUpdate(response.data.username); // Mettre à jour avec les données actuelles
          setUniversityUpdate(response.data.university);
          setSpecialityUpdate(response.data.speciality);
        } else {
          console.log("Token missing");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    if (token != null) {
      localStorage.clear();
      handleAuth();
    }
    navigate("/");
  };

  const handleUsernameChange = (event) => {
    setUsernameUpdate(event.target.value);
  };

  const handleUniversityChange = (event) => {
    setUniversityUpdate(event.target.value);
  };

  const handleSpecialityChange = (event) => {
    setSpecialityUpdate(event.target.value);
  };

  const handleProfileUpdate = async () => {
    try {
      // Validation des champs
      if (!usernameUpdate && !universityUpdate && !specialityUpdate) {
        setPopupMessage("Missing fields");
        setPopupType("error");
        return;
      }

      // Créer un objet avec les champs à mettre à jour
      const data = {
        username: usernameUpdate,
        university: user.role === "étudiant" ? universityUpdate : undefined,
        speciality: user.role === "étudiant" ? specialityUpdate : undefined,
      };

      // Supprimer les champs vides pour éviter de les envoyer
      const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

      // Faire la requête PUT pour mettre à jour le profil de l'utilisateur
      const response = await axios.put(
        `http://localhost:8000/users/${user._id}/edit/`, // URL avec l'ID de l'utilisateur
        cleanedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Mettre à jour l'état avec les nouvelles données (pas seulement réinitialiser)
        setUser((prevUser) => ({
          ...prevUser,
          ...cleanedData, // Mettre à jour les propriétés spécifiques
        }));

        // Mettre à jour les champs de mise à jour pour qu'ils affichent les nouvelles valeurs
        setUsernameUpdate(response.data.username);
        setUniversityUpdate(response.data.university);
        setSpecialityUpdate(response.data.speciality);

        setPopupMessage("Profile updated successfully!");
        setPopupType("success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setPopupMessage("Error updating profile");
      setPopupType("error");
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (token == null) {
        console.log("Token missing");
        return;
      }

      setShowDeleteModal(false);

      await axios.delete(`http://localhost:8000/users/${user._id}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPopupMessage("User deleted successfully!");
      setPopupType("success");

      setTimeout(() => {
        handleLogout();
      }, 1000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setPopupMessage("Failed to delete User. Please try again.");
      setPopupType("error");
    }
  };

  return (
    <div className="profile-screen">
      {token !== null ? (
        <div>
          <div className="profile-hello">
            <p>Hello, {user.username}!</p>
            <p className="profile-email">{user.email}</p>
            <Button dark={false} onClick={handleLogout} text={"Logout"} />
          </div>
          {/* Affichage conditionnel pour les étudiants */}
          {user.role === "étudiant" && (
            <div className="student-info">
              <p><strong>Spécialité :</strong> {user.speciality}</p>
              <p><strong>Université :</strong> {user.university}</p>
            </div>
          )}
          <div className="profile-inputs">
            <p className="logo">IHEC</p>
            <div className="column profile-update">
              <p>Update your profile</p>
              <TextInput
                name="username"
                onChange={handleUsernameChange}
                placeholder={"Username"}
                type={"text"}
                value={usernameUpdate}  // Afficher la valeur actuelle de username
              />
              {/* Affichage des champs University et Speciality uniquement pour les étudiants */}
              {user.role === "étudiant" && (
                <>
                <TextInput
                    name="speciality"
                    onChange={handleSpecialityChange}
                    placeholder={"Speciality"}
                    type={"text"}
                    value={specialityUpdate}  // Afficher la valeur actuelle de speciality
                  />
                  <TextInput
                    name="university"
                    onChange={handleUniversityChange}
                    placeholder={"University"}
                    type={"text"}
                    value={universityUpdate}  // Afficher la valeur actuelle de university
                  />
                  
                </>
              )}
              <Button dark={true} text={"Save"} onClick={handleProfileUpdate} />
            </div>
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

      {/* Modal de confirmation pour suppression */}
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
        onClose={() => setPopupMessage("")}
      />
    </div>
  );
}
