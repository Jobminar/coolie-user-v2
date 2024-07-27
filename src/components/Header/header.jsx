import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext"; // Import CartProvider
import "./header.css";
import playstore from "../../assets/images/play-store.svg";
import apple from "../../assets/images/apple.svg";
import logo from "../../assets/images/coolie-logo.png";
import help from "../../assets/images/help.png";
import translate from "../../assets/images/translate.png";
import profile from "../../assets/images/profile.png";
import location from "../../assets/images/location-marker.png";
import LoginComponent from "../LoginComponent";
import ChatbotComponent from "../Chat/ChatbotComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setLoginVisible(true);
    } else {
      navigate("userprofile");
    }
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const handleBookServiceClick = () => {
    navigate("/services"); // Navigate to /services when button is clicked
  };

  const handleCartClick = () => {
    navigate("/cart"); // Navigate to /cart when cart icon is clicked
  };

  return (
    <CartProvider showLogin={setLoginVisible}>
      <div className="main-h">
        <div className="f-h">
          <div className="f-h-icons">
            <img src={apple} alt="apple-icon" />
            <img src={playstore} alt="play-store-icon" />
            <p>Download Mobile App</p>
          </div>
          <div className="f-h-last-icons">
            <img src={help} alt="icon" onClick={toggleChatbot} />
            <img src={translate} alt="icon" />
            <FontAwesomeIcon icon={faCartShopping} onClick={handleCartClick} />
            <img src={profile} alt="icon" onClick={handleProfileClick} />
          </div>
        </div>
        <div className="s-h">
          <div className="s-h-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="s-h-s">
            <div className="location">
              <img src={location} alt="location" />
              <input placeholder="Hyderabad" />
            </div>
            <div className="search-header">
              <input placeholder="search for a service ex: Room cleaning, kitchen cleaning" />
            </div>
            <button className="books-button" onClick={handleBookServiceClick}>
              Book a Service
            </button>{" "}
            {/* Add onClick handler */}
          </div>
        </div>
      </div>
      {isLoginVisible && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <LoginComponent onLoginSuccess={closeModal} />
          </div>
        </div>
      )}
      {isChatbotVisible && <ChatbotComponent />}
      {children} {/* Render children to include other components */}
    </CartProvider>
  );
};

export default Header;
