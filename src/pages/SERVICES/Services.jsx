import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from "../../assets/images/dropdown.png";
import CartSummary from "../../components/cart/CartSummary";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginComponent from "../../components/LoginComponent";
import { TailSpin } from "react-loader-spinner";

const Services = () => {
  const {
    categoryData,
    selectedCategoryId,
    subCategoryData,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    servicesData,
    error,
  } = useContext(CategoryContext);

  const { handleCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const toggleDescription = (serviceId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  const handleAddToCart = (serviceId, categoryId, subCategoryId) => {
    if (!isAuthenticated) {
      setLoginVisible(true);
      return;
    }
    handleCart(serviceId, categoryId, subCategoryId);
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  const displayServices = () => {
    if (servicesData && servicesData.length === 0) {
      return (
        <div className="sub-category-service-item">
          <div className="service-content">
            <h5>No services found for this subcategory.</h5>
          </div>
        </div>
      );
    } else if (servicesData) {
      return servicesData.map((service) => (
        <>
            <div key={service._id} className="sub-category-service-item">
          <div className="service-main-head">
            <div className="service-icon-container">
              <img
                src={service.image}
                alt={service.subCategoryId.name}
                className="tab-image"
              />
            </div>
            <div className="service-content">
              <h5>{service.name}</h5>
              <div>
              {service.serviceVariants.map((variant) => (
                <div key={variant._id} className="service-variant">
                  <p>
                    ({variant.min} to {variant.max} {variant.metric})
                  </p>
                  <p>&#8377; {variant.price}</p>
                </div>
              ))}
              </div>
              
            </div>
            <div className="dropdown-con">
            <div
              className="dropdown"
              onClick={() => toggleDescription(service._id)}
            >
              <img src={dropdown} alt="dropdown" />
              </div>
              <button
              onClick={() =>
                handleAddToCart(
                  service._id,
                  service.categoryId._id,
                  service.subCategoryId._id,
                )
              }
            >
              ADD
            </button>
          
            </div>
           
          </div>
          <div
            className="description"
            style={{
              display: descriptionVisibility[service._id] ? "block" : "none",
            }}
          >
            {service.description}
          </div>
          
        </div>
        </>
        
      ));
    } else {
      return <div className="loading">No Services Available for this</div>;
    }
  };

  const filteredCategoryData = categoryData.filter(item => item._id === selectedCategoryId);
  return (
    <div className="services">
      <ScrollableTabs />
      <div>
      {filteredCategoryData.map((uiItem) => (
        <div key={uiItem._id} className="variant">
          {uiItem.uiVariant.map((variant, index) => (
            <div key={index} className="ui-variant-item">
              {variant}
            </div>
          ))}
        </div>
      ))}
    </div>
      <div className="services-cart-display">
        <div className="subcat-services-dispaly">
          <div className="sub-category-display">
            {subCategoryData && subCategoryData.length > 0 ? (
              subCategoryData.map((subCat) => (
                <div
                  key={subCat._id}
                  className={`sub-category-item ${
                    selectedSubCategoryId === subCat._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedSubCategoryId(subCat._id)}
                >
                  <div className="subcat-icon-container">
                    <img
                      src={subCat.imageKey}
                      alt={subCat.name}
                      className="tab-image"
                    />
                  </div>
                  <p
                    className={
                      selectedSubCategoryId === subCat._id ? "active" : ""
                    }
                  >
                    {subCat.name}
                  </p>
                </div>
              ))
            ) : (
              <p>No additional subcategories available.</p>
            )}
          </div>
          <div className="services-display">{displayServices()}</div>
        </div>
        <CartSummary />
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
    </div>
  );
};

export default Services;
