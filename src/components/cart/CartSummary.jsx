import React, { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import CartItems from "./CartItems";
import Address from "./Address";
import Schedule from "./Schedule";
import Checkout from "./Checkout";
import "./CartSummary.css";
import cartIcon from "../../assets/images/cart.svg";
import cartIconActive from "../../assets/images/cart-active.svg";
import locationMarker from "../../assets/images/marker.svg";
import locationMarkerActive from "../../assets/images/location-marker-active.svg";
import calendarIcon from "../../assets/images/calender.svg";
import calendarIconActive from "../../assets/images/calender-active.svg";
import checkoutIcon from "../../assets/images/checkout.svg";
import checkoutIconActive from "../../assets/images/checkout-active.png";
import arrowIcon from "../../assets/images/Arrows.svg";
import arrowIconActive from "../../assets/images/Arrows-active.svg";
import { OrdersProvider } from "../../context/OrdersContext"; // Import OrdersProvider

const CartSummary = () => {
  const { cartItems } = useContext(CartContext);
  const [activeTabs, setActiveTabs] = useState(["cart"]);
  const [error, setError] = useState(null);

  const initialRender = useRef(true); // To track the initial render
  const activeTabsRef = useRef(activeTabs);
  const errorRef = useRef(error);

  useEffect(() => {
    try {
      const savedActiveTabs = localStorage.getItem("activeTabs");
      if (savedActiveTabs) {
        setActiveTabs(JSON.parse(savedActiveTabs));
        activeTabsRef.current = JSON.parse(savedActiveTabs);
      }
    } catch (err) {
      console.error("Failed to retrieve active tabs from localStorage:", err);
    }

    const savedError = localStorage.getItem("error");
    if (savedError) {
      setError(JSON.parse(savedError));
      errorRef.current = JSON.parse(savedError);
    }
  }, []);

  useEffect(() => {
    // Skip the initial render to avoid overwriting the saved state
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    try {
      localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
      activeTabsRef.current = activeTabs;
    } catch (err) {
      console.error("Failed to save active tabs to localStorage:", err);
    }
  }, [activeTabs]);

  useEffect(() => {
    try {
      localStorage.setItem("error", JSON.stringify(error));
      errorRef.current = error;
    } catch (err) {
      console.error("Failed to save error to localStorage:", err);
    }
  }, [error]);

  const handleNextStep = (nextTab) => {
    setActiveTabs((prevActiveTabs) => {
      const currentIndex = prevActiveTabs.indexOf(nextTab);
      if (currentIndex === -1) {
        return [...prevActiveTabs, nextTab];
      } else {
        return prevActiveTabs.slice(0, currentIndex + 1);
      }
    });
  };

  const renderActiveComponent = () => {
    try {
      if (activeTabs.includes("checkout")) {
        return <Checkout />;
      } else if (activeTabs.includes("schedule")) {
        return <Schedule onNext={() => handleNextStep("checkout")} />;
      } else if (activeTabs.includes("address")) {
        return <Address onNext={() => handleNextStep("schedule")} />;
      } else {
        return <CartItems onNext={() => handleNextStep("address")} />;
      }
    } catch (err) {
      setError("An error occurred while rendering the component.");
      console.error("Error in renderActiveComponent:", err);
    }
  };

  return (
    <OrdersProvider activeTab={activeTabs[activeTabs.length - 1]}>
      <div className="cart-summary">
        {error && <div className="error-message">{error}</div>}
        <div className="cart-steps-container">
          <div className="cart-steps">
            <div
              className={`step ${activeTabs.includes("cart") ? "active" : ""}`}
              onClick={() => handleNextStep("cart")}
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={activeTabs.includes("cart") ? cartIconActive : cartIcon}
                alt="Cart"
              />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="badge">{cartItems.length}</span>
              )}
            </div>
            <img
              src={
                activeTabs.includes("cart") && activeTabs.includes("address")
                  ? arrowIconActive
                  : arrowIcon
              }
              alt="Arrow"
              className="arrow-icon"
            />
            <div
              className={`step ${
                activeTabs.includes("address") ? "active" : ""
              }`}
              onClick={() => handleNextStep("address")}
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={
                  activeTabs.includes("address")
                    ? locationMarkerActive
                    : locationMarker
                }
                alt="Address"
              />
              <span>Address</span>
            </div>
            <img
              src={
                activeTabs.includes("address") &&
                activeTabs.includes("schedule")
                  ? arrowIconActive
                  : arrowIcon
              }
              alt="Arrow"
              className="arrow-icon"
            />
            <div
              className={`step ${
                activeTabs.includes("schedule") ? "active" : ""
              }`}
              onClick={() => handleNextStep("schedule")}
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={
                  activeTabs.includes("schedule")
                    ? calendarIconActive
                    : calendarIcon
                }
                alt="Schedule"
              />
              <span>Schedule</span>
            </div>
            <img
              src={
                activeTabs.includes("schedule") &&
                activeTabs.includes("checkout")
                  ? arrowIconActive
                  : arrowIcon
              }
              alt="Arrow"
              className="arrow-icon"
            />
            <div
              className={`step ${
                activeTabs.includes("checkout") ? "active" : ""
              }`}
              onClick={() => handleNextStep("checkout")}
              style={{ backgroundColor: "transparent" }}
            >
              <img
                src={
                  activeTabs.includes("checkout")
                    ? checkoutIconActive
                    : checkoutIcon
                }
                alt="Checkout"
              />
              <span>Checkout</span>
            </div>
          </div>
        </div>
        {renderActiveComponent()}
      </div>
    </OrdersProvider>
  );
};

export default CartSummary;
