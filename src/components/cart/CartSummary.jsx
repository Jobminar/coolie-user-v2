import React, { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import CartItems from "./CartItems";
import Address from "./Address";
import Schedule from "./Schedule";
import Checkout from "./Checkout";
import "./CartSummary.css";
import cartIconActive from "../../assets/images/cart-active.svg";
import locationMarkerActive from "../../assets/images/location-marker-active.svg";
import calendarIconActive from "../../assets/images/calender-active.svg";
import checkoutIconActive from "../../assets/images/checkout-active.svg";
import arrowIconActive from "../../assets/images/Arrows-active.svg";
import { OrdersProvider } from "../../context/OrdersContext";
import LoginComponent from "../LoginComponent";

const CartSummary = ({ fullWidth }) => {
  const { cartItems, totalItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTabs, setActiveTabs] = useState(["cart"]);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!isAuthenticated) {
      setActiveTabs(["cart"]); // Reset active tabs when the user logs out
    }
  }, [isAuthenticated]);

  const handleNextStep = (nextTab) => {
    if (!isAuthenticated) {
      setShowLogin(true); // Show the login component if not authenticated
      return;
    }

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

  const isCompleted = (step) => {
    return (
      activeTabs.indexOf(step) !== -1 &&
      activeTabs.indexOf(step) < activeTabs.length - 1
    );
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  return (
    <OrdersProvider activeTab={activeTabs[activeTabs.length - 1]}>
      <div className={`cart-summary ${fullWidth ? "full-width" : ""}`}>
        {error && <div className="error-message">{error}</div>}
        {showLogin && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              <LoginComponent onLoginSuccess={closeModal} />
            </div>
          </div>
        )}
        {!showLogin && (
          <>
            <div className="cart-steps-container">
              <div className="cart-steps">
                <div
                  className={`step ${
                    activeTabs.includes("cart") ? "active" : ""
                  } ${isCompleted("cart") ? "completed" : ""}`}
                  onClick={() => handleNextStep("cart")}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="icon-container">
                    <img
                      src={cartIconActive}
                      alt="Cart"
                      className={
                        !isCompleted("cart") && !activeTabs.includes("cart")
                          ? "unprocessed"
                          : ""
                      }
                    />
                    {totalItems > 0 && (
                      <span className="badge">{totalItems}</span>
                    )}
                  </div>
                  <span>Cart</span>
                </div>
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("address") ? "active" : ""
                  } ${isCompleted("address") ? "completed" : ""}`}
                  onClick={() => handleNextStep("address")}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="icon-container">
                    <img
                      src={locationMarkerActive}
                      alt="Address"
                      className={
                        !isCompleted("address") &&
                        !activeTabs.includes("address")
                          ? "unprocessed"
                          : ""
                      }
                    />
                  </div>
                  <span>Address</span>
                </div>
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("schedule") ? "active" : ""
                  } ${isCompleted("schedule") ? "completed" : ""}`}
                  onClick={() => handleNextStep("schedule")}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="icon-container">
                    <img
                      src={calendarIconActive}
                      alt="Schedule"
                      className={
                        !isCompleted("schedule") &&
                        !activeTabs.includes("schedule")
                          ? "unprocessed"
                          : ""
                      }
                    />
                  </div>
                  <span>Schedule</span>
                </div>
                <img src={arrowIconActive} alt="Arrow" className="arrow-icon" />
                <div
                  className={`step ${
                    activeTabs.includes("checkout") ? "active" : ""
                  } ${isCompleted("checkout") ? "completed" : ""}`}
                  onClick={() => handleNextStep("checkout")}
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="icon-container">
                    <img
                      src={checkoutIconActive}
                      alt="Checkout"
                      className={
                        !isCompleted("checkout") &&
                        !activeTabs.includes("checkout")
                          ? "unprocessed"
                          : ""
                      }
                    />
                  </div>
                  <span>Checkout</span>
                </div>
              </div>
            </div>
            {renderActiveComponent()}
          </>
        )}
      </div>
    </OrdersProvider>
  );
};

export default CartSummary;
