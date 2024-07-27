import React, { useContext, useEffect, useState } from "react";
import "./maincategory.css";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../context/CategoryContext";
import coverdyou1 from "../../assets/images/coverd-you-1.png";
import coverdyou2 from "../../assets/images/covered-you-2.png";
import coverdyou3 from "../../assets/images/covered-you-3.png";

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
    console.log("category id", id);
    setSelectedCategoryId(id);
    navigate("/services");
  };

  return (
    <>
      <div className="main-category-con">
        {data &&
          data.map((item) => (
            <div key={item._id} className="sub-cat-con">
              <div
                className="main-cat-img"
                onClick={() => {
                  handleCategory(item._id);
                }}
              >
                <img
                  src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${item.imageKey}`}
                  alt={item.name}
                />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
      </div>

      <div className="coveredyou-con">
        {/* <h1 className="covered-you-headdig">
          Coolie No 1<span> covered you</span>
        </h1> */}
        <div className="covered-you-main-flow">
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
                Relax & rejuvenate
                <br />
                at home
              </h1>
              <p>Massage for men</p>
              <button className="covered-book-button">Book now</button>
            </div>
            <div className="subflow-image">
              <img src={coverdyou3} alt="covered you" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maincategory;
