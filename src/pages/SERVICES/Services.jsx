import React, { useState, useContext, useEffect } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from "../../assets/images/dropdown.png";
import CartSummary from "../../components/cart/CartSummary";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginComponent from "../../components/LoginComponent"; // Import LoginComponent
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
  const { isAuthenticated } = useAuth(); // Get authentication status

  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false); // State to manage login modal visibility

  useEffect(() => {
    if (categoryData) {
      setLoading(true);
      const selectedCategory = categoryData.find(
        (category) => category._id === selectedCategoryId,
      );
      if (selectedCategory && selectedCategory.subcategories) {
        setData(selectedCategory.subcategories);
      } else {
        setData([]);
      }
      setLoading(false);
    }
  }, [categoryData, selectedCategoryId]);

  useEffect(() => {
    if (subCategoryData) {
      setSubData(subCategoryData);
    }
  }, [subCategoryData]);

  useEffect(() => {
    if (servicesData) {
      setServiceData(servicesData);
      console.log(servicesData, "service data in sub page");
    }
  }, [servicesData]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (loading || !categoryData) {
    return <div className="loading">Loading...</div>;
  }

  const toggleDescription = (serviceId) => {
    setDescriptionVisibility((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  const handleAddToCart = (serviceId, categoryId, subCategoryId) => {
    if (!isAuthenticated) {
      setLoginVisible(true); // Show login modal if not authenticated
      return;
    }
    handleCart(serviceId, categoryId, subCategoryId);
  };

  const closeModal = () => {
    setLoginVisible(false);
  };

  return (
    <div className="services">
      <ScrollableTabs />

      <div className="services-cart-display">
        <div className="subcat-services-dispaly">
          <div className="sub-category-display">
            {subData.length > 0 ? (
              subData.map((subCat) => (
                <div
                  key={subCat._id}
                  className="sub-category-item"
                  onClick={() => setSelectedSubCategoryId(subCat._id)}
                >
                  <div className="subcat-icon-container">
                    <img
                      src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${subCat.imageKey}`}
                      alt={subCat.name}
                      className="tab-image"
                    />
                  </div>
                  <p>{subCat.name}</p>
                </div>
              ))
            ) : (
              <p>No additional subcategories available.</p>
            )}
          </div>

          <div className="services-display">
            {serviceData.map((service) => (
              <div key={service._id} className="sub-category-service-item">
                <div className="service-main-head">
                  <div className="service-icon-container">
                    <img
                      src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${service.subCategoryId.imageKey}`}
                      alt={service.subCategoryId.name}
                      className="tab-image"
                    />
                  </div>
                  <div className="service-content">
                    <h5>{service.name}</h5>
                    {service.serviceVariants.map((variant) => (
                      <div key={variant._id} className="service-variant">
                        <p>
                          ({variant.min} to {variant.max} {variant.metric})
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="dropdown"
                    onClick={() => toggleDescription(service._id)}
                  >
                    <img src={dropdown} alt="dropdown" />
                  </div>
                </div>
                <div
                  className="description"
                  style={{
                    display: descriptionVisibility[service._id]
                      ? "block"
                      : "none",
                  }}
                >
                  {service.description}
                </div>
                <div className="price">
                  <p></p>
                  {service.serviceVariants.map((variant) => (
                    <div key={variant._id}>
                      <p>&#8377; {variant.price}</p>
                    </div>
                  ))}
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
            ))}
          </div>
        </div>
        <div className="cart-display">
          <CartSummary />
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
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
