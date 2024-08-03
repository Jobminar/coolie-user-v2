import React from "react";
import Slider from "react-slick";
import "./applianceRepair.css";
import acRepair from "../../../assets/images/AC-repair.png";
import purifierService from "../../../assets/images/purifier-service.png";
import washingMachineRepair from "../../../assets/images/Washing-machine-repair.png";
import fanRepair from "../../../assets/images/fan-repair.png";
import newACInstallation from "../../../assets/images/AC-installation.png";
import tvRepair from "../../../assets/images/TV-repair.png";
import doorbellInstallation from "../../../assets/images/Doorbell-installation.png";
import interiorLightingDevices from "../../../assets/images/Lighting-Repair.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ApplianceRepair = () => {
  const services = [
    {
      id: 1,
      name: "AC Repair",
      price: "Starting at ₹50",
      image: acRepair,
    },
    {
      id: 2,
      name: "Water Purifier Repair",
      price: "Starting at ₹40",
      image: purifierService,
    },
    {
      id: 3,
      name: "Washing Machine Repair",
      price: "Starting at ₹60",
      image: washingMachineRepair,
    },
    {
      id: 4,
      name: "Ceiling Fan Repair",
      price: "Starting at ₹50",
      image: fanRepair,
    },
    {
      id: 5,
      name: "AC Maintainance",
      price: "Starting at ₹1000",
      image: newACInstallation,
    },
    {
      id: 6,
      name: "TV Repair",
      price: "Starting at ₹500",
      image: tvRepair,
    },
    {
      id: 7,
      name: "Doorbell Installation",
      price: "Starting at ₹150",
      image: doorbellInstallation,
    },
    {
      id: 8,
      name: "Interior Lighting",
      price: "Starting at ₹200",
      image: interiorLightingDevices,
    },
  ];

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} appliance-custom-next-arrow`}
        style={{
          ...style,
          right: "-10px",
          zIndex: 2,
        }}
        onClick={onClick}
      >
        <span>&#10095;</span>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} appliance-custom-prev-arrow`}
        style={{
          ...style,
          left: "-50px",
          zIndex: 2,
        }}
        onClick={onClick}
      >
        <span>&#10094;</span>
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="appliance-repair-main-con">
      <h2>
        AC & Appliance <span>Repair</span>
      </h2>
      <Slider {...settings} className="appliance-repair-slider">
        {services.map((service) => (
          <div key={service.id} className="appliance-repair-item">
            <div className="appliance-repair-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="appliance-repair-name">{service.name}</div>
            <div className="appliance-repair-price">{service.price}</div>
            <button className="appliance-repair-book-button">BOOK NOW</button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ApplianceRepair;
