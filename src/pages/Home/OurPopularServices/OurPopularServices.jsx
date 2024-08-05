import React from "react";
import Slider from "react-slick";
import "./ourPopularServices.css";
import salonForWomen from "../../../assets/images/facial-makeup.png";
import sofaCleaning from "../../../assets/images/sofa-cleaning.png";
import pestControl from "../../../assets/images/pest-control.png";
import waxServices from "../../../assets/images/waxing.png";
import headMassage from "../../../assets/images/head-massage.png";
import hairSetForWomen from "../../../assets/images/hairset-women.png";
import hairWash from "../../../assets/images/hair-wash.png";
import nailPolish from "../../../assets/images/nail-polish.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    {
      id: 5,
      name: "Head Massage",
      price: "Starting at ₹250",
      image: headMassage,
    },
    {
      id: 6,
      name: "Hair Set for Women",
      price: "Starting at ₹400",
      image: hairSetForWomen,
    },
    {
      id: 7,
      name: "Hair Wash",
      price: "Starting at ₹100",
      image: hairWash,
    },
    {
      id: 8,
      name: "Nail Polish",
      price: "Starting at ₹50",
      image: nailPolish,
    },
  ];

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} popular-custom-next-arrow`}
        style={{
          ...style,
          right: "-5px",
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
        className={`${className} popular-custom-prev-arrow`}
        style={{
          ...style,
          left: "-55px",
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
    <div className="popular-services-main-con">
      <h2>
        Our Popular <span>Services</span>
      </h2>
      <Slider {...settings} className="popular-services-slider">
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
      </Slider>
    </div>
  );
};

export default OurPopularServices;
