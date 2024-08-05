import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./MOSTBOOKEDSERVICES.css"; // import your styling
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Mostbookedservices = () => {
  const navigate = useNavigate();
  const [mostBooked, setMostBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/admin/most-booked",
        );
        const data = await response.json();
        setMostBooked(data);
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
        className={`${className} mostbooked-custom-next-arrow`}
        style={{
          ...style,
          right: "-1.8rem",
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
        className={`${className} mostbooked-custom-prev-arrow`}
        style={{
          ...style,
          left: "-4rem",
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
    slidesToShow: 5.5,
    slidesToScroll: 1,
    autoplay: false,
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
    <div className="mostbooked-main-con">
      <h2>
        Most Booked <span>Services</span>
      </h2>
      <Slider {...settings} className="mostbooked-slider">
        {mostBooked.map((service, index) => (
          <div key={index} className="mostbooked-sub-booked">
            <div className="mostbooked-sub-booked-image">
              <img
                src={service.image}
                onClick={() => navigate("/services")}
                alt={service.name}
              />
            </div>
            <h6 className="mostbooked-most-booked-name">{service.name}</h6>
            <p className="mostbooked-most-booked-price">Rs : {service.price}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Mostbookedservices;
