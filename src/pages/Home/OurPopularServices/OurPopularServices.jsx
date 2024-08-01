import React from "react";
import "./ourPopularServices.css";
import salonForWomen from "../../../assets/images/facial-makeup.png";
import sofaCleaning from "../../../assets/images/sofa-cleaning.png";
import pestControl from "../../../assets/images/pest-control.png";
import waxServices from "../../../assets/images/waxing.png";

const OurPopularServices = () => {
  const services = [
    {
      id: 1,
      name: "Salon for Women",
      price: "Starting at ₹200",
      image: salonForWomen,
    },
    {
      id: 2,
      name: "Sofa Cleaning",
      price: "Starting at ₹500",
      image: sofaCleaning,
    },
    {
      id: 3,
      name: "Pest Control",
      price: "Starting at ₹300",
      image: pestControl,
    },
    {
      id: 4,
      name: "Waxing",
      price: "Starting at ₹150",
      image: waxServices,
    },
  ];

  return (
    <div className="popular-services-main-con">
      <h2>
        Our Popular <span>Services</span>
      </h2>
      <div className="popular-services">
        {services.map((service) => (
          <div key={service.id} className="popular-service-item">
            <div className="popular-service-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="popular-service-name">{service.name}</div>
            <div className="popular-service-price">{service.price}</div>
            <button className="popular-service-book-button">BOOK NOW</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPopularServices;
