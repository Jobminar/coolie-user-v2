import React, { useContext, useEffect, useState, useRef } from "react";
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
  const containerRef = useRef(null);
  const [direction, setDirection] = useState("right");
  const scrollIntervalRef = useRef(null);
  const userInteracting = useRef(false);
  const resetScrollTimeoutRef = useRef(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Slower scroll speed
    const maxScroll = container.scrollWidth - container.clientWidth;

    const startScrolling = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (userInteracting.current || initialScrollDone.current) return; // Skip scrolling if the user is interacting or initial scroll is done

        if (direction === "right") {
          scrollAmount += scrollSpeed;
          if (scrollAmount >= maxScroll) {
            clearInterval(scrollIntervalRef.current);
            setTimeout(() => {
              setDirection("left");
              scrollAmount = maxScroll; // Reset scroll amount
              startScrolling();
            }, 3000); // Wait for 3 seconds before starting to scroll left
          }
        } else {
          scrollAmount -= scrollSpeed;
          if (scrollAmount <= 0) {
            clearInterval(scrollIntervalRef.current);
            setTimeout(() => {
              setDirection("right");
              scrollAmount = 0; // Reset scroll amount
              startScrolling();
            }, 3000); // Wait for 3 seconds before starting to scroll right
          }
        }
        container.scrollLeft = scrollAmount;
      }, 10); // Increase interval time for smoother scrolling
    };

    startScrolling();

    const handleMouseEnter = () => {
      console.log("Mouse entered, stopping scroll");
      clearInterval(scrollIntervalRef.current);
      clearTimeout(resetScrollTimeoutRef.current);
      initialScrollDone.current = true;
    };

    const handleMouseLeave = () => {
      console.log("Mouse left, starting scroll");
      resetScrollTimeoutRef.current = setTimeout(startScrolling, 2000); // Restart auto-scroll after 2 seconds if not hovered
    };

    const handleUserInteractionStart = () => {
      userInteracting.current = true;
      clearInterval(scrollIntervalRef.current);
      clearTimeout(resetScrollTimeoutRef.current);
      initialScrollDone.current = true;
    };

    const handleUserInteractionEnd = () => {
      userInteracting.current = false;
      resetScrollTimeoutRef.current = setTimeout(startScrolling, 2000); // Restart auto-scroll after 2 seconds if no interaction
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleUserInteractionStart);
    container.addEventListener("mouseup", handleUserInteractionEnd);
    container.addEventListener("touchstart", handleUserInteractionStart);
    container.addEventListener("touchend", handleUserInteractionEnd);

    return () => {
      clearInterval(scrollIntervalRef.current);
      clearTimeout(resetScrollTimeoutRef.current);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleUserInteractionStart);
      container.removeEventListener("mouseup", handleUserInteractionEnd);
      container.removeEventListener("touchstart", handleUserInteractionStart);
      container.removeEventListener("touchend", handleUserInteractionEnd);
    };
  }, [direction]);

  const handleCategory = (id) => {
    setSelectedCategoryId(id);
    navigate("/services");
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

      <div className="coveredyou-con" ref={containerRef}>
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
                Get Experts
                <br />
                in 2 hours
              </h1>
              <p>Electricians,Plumbers and more</p>
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
