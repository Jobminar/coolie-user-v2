// Services.js
import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import "./Services.css";
import ScrollableTabs from "./ScrollableTabs";
import { CategoryContext } from "../../context/CategoryContext";
import dropdown from "../../assets/images/dropdown.png";
import CartSummary from "../../components/cart/CartSummary";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginComponent from "../../components/LoginComponent";
import { useNavigate } from "react-router-dom";
import { OrdersContext } from "../../context/OrdersContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

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
  const { orderCreated } = useContext(OrdersContext);
  const navigate = useNavigate();

  const [descriptionVisibility, setDescriptionVisibility] = useState({});
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [variantName, setVariantName] = useState("");

  const initialCategoryRef = useRef(null);

  useEffect(() => {
    if (orderCreated) {
      navigate("/ordertracking");
    }
  }, [orderCreated, navigate]);

  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      const initialCategory = categoryData.find(
        (item) => item._id === selectedCategoryId,
      );
      initialCategoryRef.current = initialCategory;
      if (initialCategory) {
        const validVariants = initialCategory.uiVariant.filter(
          (variant) => variant.toLowerCase() !== "none",
        );
        if (validVariants.length > 0) {
          setVariantName(validVariants[0]);
        } else {
          setVariantName("");
        }
      }
    }
  }, [categoryData, selectedCategoryId]);

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

  const handleVariant = (variantname) => {
    setVariantName(variantname);
  };

  const displayServices = (filteredServiceData) => {
    if (filteredServiceData && filteredServiceData.length === 0) {
      return (
        <div className="sub-category-service-item">
          <div className="service-content">
            <h5>No services found for this subcategory.</h5>
          </div>
        </div>
      );
    } else if (filteredServiceData) {
      return filteredServiceData.map((service) => (
        <div key={service._id} className="sub-category-service-item">
          <div className="service-main-head">
            <div
              className={`service-icon-container ${
                selectedSubCategoryId === service.subCategoryId._id
                  ? "active"
                  : ""
              }`}
            >
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
      ));
    } else {
      return <div className="loading">No Services Available for this</div>;
    }
  };

  const filteredCategoryData = useMemo(() => {
    return categoryData
      ? categoryData.filter((item) => item._id === selectedCategoryId)
      : [];
  }, [categoryData, selectedCategoryId]);

  const filteredServiceData = useMemo(() => {
    return servicesData
      ? servicesData.filter((service) => {
          if (variantName) {
            return (
              service.subCategoryId._id === selectedSubCategoryId &&
              service.serviceVariants.some(
                (variant) => variant.variantName === variantName,
              )
            );
          }
          return service.subCategoryId._id === selectedSubCategoryId;
        })
      : [];
  }, [servicesData, selectedSubCategoryId, variantName]);

  return (
    <ErrorBoundary>
      <div className="services">
        <ScrollableTabs />
        <div>
          {filteredCategoryData.map((uiItem) => {
            const validVariants = uiItem.uiVariant.filter(
              (variant) => variant.toLowerCase() !== "none",
            );
            return (
              <div key={uiItem._id} className="variant">
                {validVariants.length > 0 &&
                  validVariants.map((variant, index) => (
                    <div
                      key={index}
                      className={`ui-variant-item ${
                        variant === variantName ? "active" : ""
                      }`}
                      onClick={() => handleVariant(variant)}
                    >
                      {variant}
                    </div>
                  ))}
              </div>
            );
          })}
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
                    <div
                      className={`subcat-icon-container ${
                        selectedSubCategoryId === subCat._id ? "active" : ""
                      }`}
                    >
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
            <div className="services-display">
              {displayServices(filteredServiceData)}
            </div>
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
    </ErrorBoundary>
  );
};

export default Services;
