import React, { useState, useEffect, useRef, useContext } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrosshairs,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "./Address.css";
import LocationModal from "./LocationModal";
import { useAuth } from "../../context/AuthContext";
import { saveAddress, getSavedAddresses } from "./api/address-api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import AddressForm from "./AddressForm";
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";

const Address = ({ onNext }) => {
  const { user } = useAuth();
  const { totalItems, totalPrice } = useContext(CartContext);
  const { updateSelectedAddressId } = useContext(OrdersContext);
  const [cookies, setCookie] = useCookies(["location"]);
  const initialLocation = cookies.location || {};

  const [addressData, setAddressData] = useState({
    bookingType: "self",
    name: "",
    mobileNumber: sessionStorage.getItem("phone") || "",
    address: "",
    city: initialLocation.city || "Hyderabad",
    pincode: initialLocation.pincode || "500072",
    landmark: initialLocation.landmark || "Medchal-Malkajgiri",
    state: initialLocation.state || "Telangana",
    latitude: Number(initialLocation.latitude) || 0,
    longitude: Number(initialLocation.longitude) || 0,
    userId: user?._id || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const initialRender = useRef(true);
  const addressDataRef = useRef(addressData);
  const showModalRef = useRef(showModal);
  const showFormRef = useRef(showForm);
  const showSavedAddressesRef = useRef(showSavedAddresses);
  const savedAddressesRef = useRef(savedAddresses);
  const selectedAddressRef = useRef(selectedAddress);

  useEffect(() => {
    const savedState = localStorage.getItem("addressState");
    if (savedState) {
      const {
        addressData,
        showModal,
        showForm,
        showSavedAddresses,
        savedAddresses,
        selectedAddress,
      } = JSON.parse(savedState);

      setAddressData(addressData);
      setShowModal(showModal);
      setShowForm(showForm);
      setShowSavedAddresses(showSavedAddresses);
      setSavedAddresses(savedAddresses);
      setSelectedAddress(selectedAddress);

      addressDataRef.current = addressData;
      showModalRef.current = showModal;
      showFormRef.current = showForm;
      showSavedAddressesRef.current = showSavedAddresses;
      savedAddressesRef.current = savedAddresses;
      selectedAddressRef.current = selectedAddress;
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const state = {
      addressData: addressDataRef.current,
      showModal: showModalRef.current,
      showForm: showFormRef.current,
      showSavedAddresses: showSavedAddressesRef.current,
      savedAddresses: savedAddressesRef.current,
      selectedAddress: selectedAddressRef.current,
    };

    localStorage.setItem("addressState", JSON.stringify(state));
  }, [
    addressData,
    showModal,
    showForm,
    showSavedAddresses,
    savedAddresses,
    selectedAddress,
  ]);

  useEffect(() => {
    if (user) {
      setAddressData((prevState) => ({
        ...prevState,
        mobileNumber: sessionStorage.getItem("phone") || user.phone || "",
        userId: user._id || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (user) {
        try {
          const addresses = await getSavedAddresses(user._id);
          if (Array.isArray(addresses)) {
            setSavedAddresses(addresses);
          } else {
            setSavedAddresses([addresses]);
          }

          if (addresses.length === 1) {
            setSelectedAddress(addresses[0]);
            updateSelectedAddressId(addresses[0]._id);
          }
        } catch (error) {
          console.error("Error fetching saved addresses:", error);
        }
      }
    };
    fetchSavedAddresses();
  }, [user, updateSelectedAddressId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!selectedAddress) {
      confirmAlert({
        title: "No Address Selected",
        message: "Please select an address before proceeding.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
      });
      return;
    }
    console.log("Address Data on submit:", addressData);
    const requestBody = {
      ...addressData,
      userId: user?._id,
      username: addressData.name,
      latitude: Number(addressData.latitude), // Ensure latitude is a number
      longitude: Number(addressData.longitude), // Ensure longitude is a number
    };
    delete requestBody.name; // Remove the 'name' field as it should be 'username'
    console.log("Request Body on submit:", requestBody);
    onNext("schedule");
  };

  const handleSaveAddress = async (addressData) => {
    try {
      console.log("Address Data before save:", addressData);
      const requestBody = {
        ...addressData,
        username: addressData.name,
        latitude: Number(addressData.latitude), // Ensure latitude is a number
        longitude: Number(addressData.longitude), // Ensure longitude is a number
      };
      delete requestBody.name; // Remove the 'name' field as it should be 'username'
      const savedAddress = await saveAddress(requestBody);
      setSavedAddresses((prevAddresses) => [...prevAddresses, savedAddress]);
    } catch (error) {
      console.error("Error in handleSaveAddress:", error);
    }
  };

  const handleShowSavedAddresses = () => {
    setShowSavedAddresses(!showSavedAddresses);
  };

  const handleRadioChange = (address) => {
    setSelectedAddress(address);
    setAddressData(address);
    updateSelectedAddressId(address._id);
    console.log("Selected Address:", address);
    console.log("Selected Address ID:", address._id);
  };

  useEffect(() => {
    setCookie(
      "location",
      {
        city: addressData.city,
        pincode: addressData.pincode,
        state: addressData.state,
        landmark: addressData.landmark,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      },
      { path: "/" },
    );
  }, [addressData, setCookie]);

  const parseAddress = (addressString) => {
    const parts = addressString.split(", ");
    return {
      address: parts.slice(0, 2).join(", "),
      pincode: parts[2] || "",
      city: "Hyderabad",
      landmark: "Medchal-Malkajgiri",
      state: parts[6] || "Telangana",
    };
  };

  const handleLocationSelect = (location) => {
    const parsedAddress = parseAddress(location.address);
    setAddressData((prevState) => ({
      ...prevState,
      ...parsedAddress,
      latitude: Number(location.latitude), // Ensure latitude is a number
      longitude: Number(location.longitude), // Ensure longitude is a number
    }));
  };

  return (
    <div className="address-container">
      <ToastContainer />
      <p className="location-option" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faCrosshairs} /> Use Current LOCATION
      </p>
      <div
        className="toggle-saved-addresses"
        onClick={handleShowSavedAddresses}
      >
        <FontAwesomeIcon icon={faSave} /> <span>Show Saved Addresses</span>
      </div>
      {showSavedAddresses &&
        (savedAddresses.length > 0 ? (
          savedAddresses.map((address, index) => (
            <div key={index} className="saved-address">
              <input
                type="radio"
                name="selectedAddress"
                checked={selectedAddress?._id === address._id}
                onChange={() => handleRadioChange(address)}
              />
              <p>
                <strong>Name:</strong> {address.username} <br />
                <strong>Mobile:</strong> {address.mobileNumber} <br />
                <strong>Booking Type:</strong> {address.bookingType} <br />
                <strong>Address:</strong> {address.address}, {address.city},{" "}
                {address.pincode}, {address.landmark}, {address.state}
                <br />
                <span className="light-grey">
                  ID: {address._id}, Latitude: {address.latitude}, Longitude:{" "}
                  {address.longitude}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No address available</p>
        ))}
      <div className="radio-group">
        <p>Contact:</p>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="self"
            checked={addressData.bookingType === "self"}
            onChange={handleChange}
          />
          My Self
        </label>
        <label>
          <input
            type="radio"
            name="bookingType"
            value="others"
            checked={addressData.bookingType === "others"}
            onChange={handleChange}
          />
          Booking for Others
        </label>
      </div>
      <div className="add-new-address" onClick={() => setShowForm(!showForm)}>
        <FontAwesomeIcon icon={faEdit} />
        <span>Add New Address & Mobile Number</span>
      </div>
      {showForm && (
        <AddressForm
          addressData={addressData}
          setAddressData={setAddressData}
          handleSaveAddress={handleSaveAddress}
        />
      )}
      <div className="address-totals">
        <div className="address-totals-info">
          <h5>{totalItems} Items</h5>
          <p>₹{totalPrice.toFixed(2)}</p>
        </div>
        <div className="address-totals-button">
          <button className="go-to-address-btn" onClick={handleSubmit}>
            SCHEDULE YOUR VISIT
          </button>
        </div>
      </div>
      {showModal && (
        <LocationModal
          onClose={() => setShowModal(false)}
          onLocationSelect={handleLocationSelect}
          lat={initialLocation.latitude || 0}
          lng={initialLocation.longitude || 0}
          initializeMap={true}
        />
      )}
    </div>
  );
};

export default Address;
