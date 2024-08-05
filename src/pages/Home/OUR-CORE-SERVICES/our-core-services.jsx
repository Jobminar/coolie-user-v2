import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./our-core-services.css"; // import your styling
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Ourcoreservices = () => {
  const navigate = useNavigate();
  const [coreServices, setCoreServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/admin/most-booked",
        );
        const data = await response.json();
        setCoreServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} ourcore-custom-next-arrow`}
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
        className={`${className} ourcore-custom-prev-arrow`}
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
    <div className="ourcore-main-con">
      <h2>
        Our Core <span>Services</span>
      </h2>
      <Slider {...settings} className="ourcore-slider">
        {coreServices.map((service, index) => (
          <div key={index} className="sub-core">
            <div className="sub-core-image">
              <img
                src={service.image}
                onClick={() => navigate("/services")}
                alt={service.name}
              />
            </div>
            <h6 className="ourcore-service-name">{service.name}</h6>
            <p className="ourcore-service-price">{service.description}</p>
            <button className="book-now" onClick={() => navigate("/services")}>
              BOOK NOW
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Ourcoreservices;
