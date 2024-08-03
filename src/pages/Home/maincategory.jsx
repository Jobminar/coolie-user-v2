import React, { useContext, useEffect, useState } from "react";
import "./maincategory.css";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../context/CategoryContext";
import coverdyou1 from "../../assets/images/covered-you-1.png";
import coverdyou2 from "../../assets/images/covered-you-2.png";
import coverdyou3 from "../../assets/images/covered-you-3.png";
import coverdyou4 from "../../assets/images/covered-you-4.png";
import coverdyou5 from "../../assets/images/covered-you-5.png";
import coverdyou6 from "../../assets/images/covered-you-6.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Maincategory = () => {
  const navigate = useNavigate();
  const { categoryData, setSelectedCategoryId } = useContext(CategoryContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);

  const handleCategory = (id) => {
    setSelectedCategoryId(id);
    navigate("/services");
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow`}
        style={{
          ...style,
          display: "flex",
          background: "grey",
          color: "white",
          opacity: "0.3",
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
        className={`${className} custom-arrow`}
        style={{
          ...style,
          display: "flex",
          background: "grey",
          color: "white",
          opacity: "0.3",
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
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
    <>
      <div className="main-category-con">
        {data &&
          data.map((item) => (
            <div
              key={item._id}
              className="sub-cat-con"
              onClick={() => handleCategory(item._id)}
            >
              <div className="main-cat-img">
                <img src={item.imageKey} alt={item.name} />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
      </div>

      <div className="coveredyou-con">
        <Slider {...settings}>
          <div className="covered-you-sub-flow first-sub">
            <div className="coveredyou-content">
              <h1>
                Relax & rejuvenate
                <br />
                at home
              </h1>
              <p>Massage for men</p>
              <button
                onClick={() => navigate("/services")}
                className="covered-book-button"
              >
                Book now
              </button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou1} alt="covered you" />
            </div>
          </div>
          <div className="covered-you-sub-flow second-sub">
            <div className="coveredyou-content">
              <h1>
                Expert haircut
                <br />
                starting at 199
              </h1>
              <p>Haircut at home</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou2} alt="covered you" />
            </div>
          </div>
          <div className="covered-you-sub-flow third-sub">
            <div className="coveredyou-content">
              <h1>
                Get Experts
                <br />
                in 2 hours
              </h1>
              <p>Electricians,Plumbers & more</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou3} alt="covered you" />
            </div>
          </div>
          <div className="covered-you-sub-flow fourth-sub">
            <div className="coveredyou-content">
              <h1>
                Keep pests
                <br />
                away
              </h1>
              <p>Pest control services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou4} alt="covered you" />
            </div>
          </div>
          <div className="covered-you-sub-flow fifth-sub">
            <div className="coveredyou-content">
              <h1>
                Maintain your kitchen
                <br />
                with ease
              </h1>
              <p>Kitchen maintenance services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou5} alt="covered you" />
            </div>
          </div>
          <div className="covered-you-sub-flow sixth-sub">
            <div className="coveredyou-content">
              <h1>
                Beautiful gardens
                <br />
                all year round
              </h1>
              <p>Gardening services</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou6} alt="covered you" />
            </div>
          </div>
        </Slider>
      </div>
    </>
  );
};

export default Maincategory;
