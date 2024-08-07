import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import "./Address.css";
import { useAuth } from "../../context/AuthContext";
import { saveAddress, getSavedAddresses } from "./api/address-api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "./AddressForm";
import LocationModal from "./LocationModal";
import { CartContext } from "../../context/CartContext";
import { OrdersContext } from "../../context/OrdersContext";

const Address = ({ onNext }) => {
  const { user, userLocation, phone } = useAuth();
  const { totalItems, totalPrice } = useContext(CartContext);
  const { updateSelectedAddressId } = useContext(OrdersContext);
  const [cookies, setCookie] = useCookies(["location"]);
  const initialLocation = cookies.location || {};

  const userId = user?._id || sessionStorage.getItem("userId") || "";

  const [addressData, setAddressData] = useState({
    bookingType: "self",
    name: user?.displayName || "",
    mobileNumber: phone || sessionStorage.getItem("phone") || "",
    address: "",
    city: initialLocation.city || "Hyderabad",
    pincode: initialLocation.pincode || "500072",
    landmark: initialLocation.landmark || "Medchal-Malkajgiri",
    state: initialLocation.state || "Telangana",
    latitude: Number(initialLocation.latitude) || 0,
    longitude: Number(initialLocation.longitude) || 0,
    userId: userId,
  });

  const [showForm, setShowForm] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [filterBookingType, setFilterBookingType] = useState("");

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (userId) {
        try {
          const addresses = await getSavedAddresses(userId);
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
  }, [userId, updateSelectedAddressId]);

  useEffect(() => {
    const fetchSavedAddressesImmediately = async () => {
      if (userId) {
        try {
          const addresses = await getSavedAddresses(userId);
          setSavedAddresses(addresses);
        } catch (error) {
          console.error("Error fetching saved addresses immediately:", error);
        }
      }
    };
    fetchSavedAddressesImmediately();
  }, [userId]);

  const handleShowSavedAddresses = () => {
    setShowSavedAddresses(!showSavedAddresses);
  };

  const handleRadioChange = (address) => {
    setSelectedAddress(address);
    setAddressData({ ...address, userId: userId });
    updateSelectedAddressId(address._id);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      const requestBody = {
        ...addressData,
        username: addressData.name,
        latitude: Number(addressData.latitude),
        longitude: Number(addressData.longitude),
        userId: userId,
      };
      delete requestBody.name;
      console.log("Sending address data to API:", requestBody);
      await saveAddress(requestBody);
      const addresses = await getSavedAddresses(userId);
      setSavedAddresses(addresses);
      setShowForm(false);
      setShowSavedAddresses(true);
    } catch (error) {
      console.error("Error in handleSaveAddress:", error);
    }
  };

  const handleSubmit = () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      return;
    }
    onNext("schedule");
  };

  const handleLocationSelect = (location) => {
    const parsedAddress = parseAddress(location.address);
    setAddressData((prevData) => ({
      ...prevData,
      address: parsedAddress.address,
      city: parsedAddress.city,
      pincode: parsedAddress.pincode,
      landmark: parsedAddress.landmark,
      state: parsedAddress.state,
      latitude: location.latitude,
      longitude: location.longitude,
      userId: userId, // Ensure userId is set
    }));
    setShowLocationModal(false);
    setShowForm(true);
    setShowSavedAddresses(false);
  };

  const parseAddress = (fullAddress) => {
    const parts = fullAddress.split(", ");
    return {
      address: parts.slice(0, 2).join(", "),
      pincode: parts[2] || "",
      city: parts[3] || "",
      landmark: parts[4] || "",
      state: parts[5] || "",
      country: parts[6] || "",
    };
  };

  const filteredAddresses = filterBookingType
    ? savedAddresses.filter(
        (address) => address.bookingType === filterBookingType,
      )
    : savedAddresses;

  return (
    <div className="address-container">
      <ToastContainer />
      {showSavedAddresses && (
        <div className="filter-container">
          <label htmlFor="filterBookingType">Filter by Booking Type: </label>
          <select
            id="filterBookingType"
            value={filterBookingType}
            onChange={(e) => setFilterBookingType(e.target.value)}
          >
            <option value="">All</option>
            <option value="self">Self</option>
            <option value="others">Others</option>
          </select>
        </div>
      )}
      <div
        className="add-new-address"
        onClick={() => {
          setShowLocationModal(true);
          setShowForm(false);
          setShowSavedAddresses(false);
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
        <span>Add New Address & Mobile Number</span>
      </div>
      {showSavedAddresses && (
        <>
          <div
            className="toggle-saved-addresses"
            onClick={handleShowSavedAddresses}
          >
            <FontAwesomeIcon icon={faSave} /> <span>Show Saved Addresses</span>
          </div>
          <div className="saved-addresses-container">
            {filteredAddresses.length > 0 ? (
              filteredAddresses.map((address, index) => (
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
                  </p>
                </div>
              ))
            ) : (
              <p>No address available</p>
            )}
          </div>
        </>
      )}
      {showForm && (
        <AddressForm
          addressData={addressData}
          setAddressData={setAddressData}
          handleSaveAddress={handleSaveAddress}
          onCancel={() => {
            setShowForm(false);
            setShowSavedAddresses(true);
          }}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
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
    </div>
  );
};

export default Address;
