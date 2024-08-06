// Header.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CartContext, CartProvider } from "../../context/CartContext";
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
import Userprofile from "../../pages/USER-PROFILE/user-profile";
import account from '../../assets/images/account.png'
import addresses from '../../assets/images/myaddresses.png'
import bookings from '../../assets/images/mybookings.png'
import logout from '../../assets/images/logout.png';
import CitySearchComponent from "./CitySearchComponent";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const useTypewriter = (texts, speed = 100, pause = 2000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, texts, speed, pause]);

  return deleting
    ? texts[index].substring(0, subIndex)
    : texts[index].substring(0, subIndex);
};


const Header = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userCity, fetchCityName, updateUserLocation } =
    useAuth();
    const { logout } = useAuth(); 
  const { totalItems } = useContext(CartContext);
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const selectedCityRef = useRef(
    sessionStorage.getItem("selectedCity") || userCity || "",
  );
  const [locationQuery, setLocationQuery] = useState(selectedCityRef.current);
  const [selectedCity, setSelectedCity] = useState(selectedCityRef.current);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (userCity) {
      selectedCityRef.current = userCity;
      setLocationQuery(userCity);
      setSelectedCity(userCity);
    }
  }, [userCity]);

  useEffect(() => {
    sessionStorage.setItem("selectedCity", selectedCityRef.current);
  }, [selectedCity]);

  const placeholders = [
    " Room cleaning, kitchen cleaning",
    " Laundry, dishwashing",
    " Gardening, pet sitting"
  ];

  const placeholder = useTypewriter(placeholders);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setLoginVisible(true);
    } else {
      setProfileMenuVisible(!isProfileMenuVisible);
    }
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const handleBookServiceClick = () => {
    navigate("/services");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleCitySelect = (city) => {
    confirmAlert({
      title: "Confirm Location Change",
      message: "Are you sure you want to change your location?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            selectedCityRef.current = city.name;
            setSelectedCity(city.name);
            setLocationQuery(city.name);
            setIsDropdownVisible(false);
            updateUserLocation(city.coordinates[1], city.coordinates[0]);
            sessionStorage.setItem("selectedCity", city.name);
          },
        },
        {
          label: "No",
          onClick: () => setIsDropdownVisible(false),
        },
      ],
      closeOnClickOutside: false,
    });
  };

  const handleInputChange = (e) => {
    setLocationQuery(e.target.value);
    setIsDropdownVisible(true);
  };

  const handleLocationIconClick = () => {
    confirmAlert({
      title: "Use Current Location",
      message: "Do you want to use your current location?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  fetchCityName(latitude, longitude).then((cityName) => {
                    selectedCityRef.current = cityName;
                    setSelectedCity(cityName);
                    setLocationQuery(cityName);
                    updateUserLocation(latitude, longitude);
                    sessionStorage.setItem("selectedCity", cityName);
                  });
                },
                (error) => {
                  console.error("Error getting location:", error);
                  if (error.code === 1) {
                    alert(
                      "Location access is denied. Please allow location access in your browser settings.",
                    );
                  } else {
                    alert(
                      "An error occurred while fetching your location. Please try again.",
                    );
                  }
                },
              );
            } else {
              alert("Geolocation is not supported by this browser.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      closeOnClickOutside: false,
    });
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
            <div className="cart-icon-container" onClick={handleCartClick}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ fontSize: "1.4rem" }}
              />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </div>
            <div>
              <img src={profile} alt="icon" onClick={handleProfileClick} />
              {isProfileMenuVisible && (
                <div className="profileMenu">
                  <div className="profile-list">Account</div>
                  <div className="profile-list"  onClick={() => {navigate("/addresses")}}>My Addresses</div>
                  <div className="profile-list" onClick={() => navigate("/bookings")}>My Bookings</div>
                  <div className="profile-list" >Log Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="s-h">
          <div className="s-h-logo">
            <img src={logo} alt="logo" onClick={(navigate('/'))}/>
          </div>
          <div className="s-h-s">
            <div className="location">
              <img
                src={location}
                alt="location"
                onClick={handleLocationIconClick}
              />
              <input
                placeholder="City"
                value={locationQuery}
                onChange={handleInputChange}
              />
              {locationQuery && isDropdownVisible && (
                <CitySearchComponent
                  query={locationQuery}
                  onSelect={handleCitySelect}
                  onClose={() => setIsDropdownVisible(false)}
                />
              )}
            </div>
            <div className="search-header">
              <input
                placeholder={`search for a service ex:${placeholder}`}
                readOnly
              />
            </div>
            <button className="books-button" onClick={handleBookServiceClick}>
              Book a Service
            </button>
          </div>
        </div>
      </div>
      {isLoginVisible && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <LoginComponent
              onLoginSuccess={() => {
                closeModal();
                setProfileMenuVisible(true);
              }}
            />
          </div>
        </div>
      )}
      {isChatbotVisible && <ChatbotComponent />}
      {children}
    </CartProvider>
  );
};

export default Header;
