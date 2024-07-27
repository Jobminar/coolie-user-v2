import React, { useContext, useEffect, useRef, useState } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./ScrollableTabs.css";

const ScrollableTabs = () => {
  const { categoryData, selectedCategoryId, setSelectedCategoryId, error } =
    useContext(CategoryContext);
  const [selectedCategoryIdLocal, setSelectedCategoryIdLocal] =
    useState(selectedCategoryId);
  const containerRef = useRef(null);
  const tabWidth = 200;
  const visibleTabs = 5;
  const buttonWidth = 70;

  // Sync local state with global state
  useEffect(() => {
    setSelectedCategoryIdLocal(selectedCategoryId);
  }, [selectedCategoryId]);

  // Scroll to the selected tab
  useEffect(() => {
    if (selectedCategoryIdLocal && containerRef.current) {
      const selectedTab = document.getElementById(
        `tab-${selectedCategoryIdLocal}`,
      );
      if (selectedTab) {
        const tabLeftPosition = selectedTab.offsetLeft;
        containerRef.current.scrollTo({
          left: tabLeftPosition - buttonWidth,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCategoryIdLocal]);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    setSelectedCategoryIdLocal(id);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -tabWidth * visibleTabs,
        behavior: "smooth",
      });
      setTimeout(() => {
        if (containerRef.current.scrollLeft === 0) {
          containerRef.current.scrollTo({
            left: containerRef.current.scrollWidth / 3,
            behavior: "instant",
          });
        }
      }, 500);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: tabWidth * visibleTabs,
        behavior: "smooth",
      });
      setTimeout(() => {
        if (
          containerRef.current.scrollLeft >=
          containerRef.current.scrollWidth - containerRef.current.clientWidth
        ) {
          containerRef.current.scrollTo({
            left: containerRef.current.scrollWidth / 3,
            behavior: "instant",
          });
        }
      }, 500);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  // Create a cloned list of tabs for circular scrolling
  const clonedTabs = [...categoryData, ...categoryData, ...categoryData];

  return (
    <div className="scrollable-tabs-wrapper">
      <button className="scroll-button left" onClick={scrollLeft}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="scrollable-tabs-container" ref={containerRef}>
        {clonedTabs.map((category, index) => (
          <div
            key={index} // Use index as key because of duplicated items
            id={`tab-${category._id}`}
            className={`scrollable-tab ${
              selectedCategoryIdLocal === category._id ? "selected" : ""
            }`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="tab-image-container">
              <img
                src={`https://coolie1-dev.s3.ap-south-1.amazonaws.com/${category.imageKey}`}
                alt={category.name}
                className="tab-image"
              />
            </div>
            <p>{category.name}</p>
            {selectedCategoryIdLocal === category._id && (
              <div className="dropdown-icon">▼</div>
            )}
          </div>
        ))}
      </div>
      <button className="scroll-button right" onClick={scrollRight}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default ScrollableTabs;
