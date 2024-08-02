import React from "react";
import "./Howitworks.css";
import howitworks1 from "../../assets/images/how-it-works-1.png";
import howitworks2 from "../../assets/images/how-it-works-2.png";
import howitworks3 from "../../assets/images/how-it-works-3.png";
import howitworks4 from "../../assets/images/how-it-works-4.png";
import howitworks5 from "../../assets/images/how-it-works-5.png";
import rightarrow from "../../assets/images/right-arrow.png";

const Howitworks = () => {
  return (
    <div className="how-it-works-main-con">
      <h1 className="above-headddig">
        HOW IT WORKS <span>for you</span>
      </h1>
      <div className="how-main-flow">
        <div className="how-sub-flow">
          <div className="how-flow">
            <div className="how-image">
              <img src={howitworks1} alt="how-it-works" />
            </div>
            <p>Book Online Service</p>
          </div>
          <div className="arrow-container">
            <img src={rightarrow} alt="right arrow" />
          </div>
        </div>
        <div className="how-sub-flow">
          <div className="how-flow">
            <div className="how-image">
              <img src={howitworks2} alt="how-it-works" />
            </div>
            <p>Get Confirmation</p>
          </div>
          <div className="arrow-container">
            <img src={rightarrow} alt="right arrow" />
          </div>
        </div>
        <div className="how-sub-flow">
          <div className="how-flow">
            <div className="how-image">
              <img src={howitworks3} alt="how-it-works" />
            </div>
            <p>Technician Arrives</p>
          </div>
          <div className="arrow-container">
            <img src={rightarrow} alt="right arrow" />
          </div>
        </div>
        <div className="how-sub-flow">
          <div className="how-flow">
            <div className="how-image">
              <img src={howitworks4} alt="how-it-works" />
            </div>
            <p>Done Service</p>
          </div>
          <div className="arrow-container">
            <img src={rightarrow} alt="right arrow" />
          </div>
        </div>
        <div className="how-sub-flow final-flow">
          <div className="how-flow">
            <div className="how-image">
              <img src={howitworks5} alt="how-it-works" />
            </div>
            <p>Just Relax</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howitworks;
