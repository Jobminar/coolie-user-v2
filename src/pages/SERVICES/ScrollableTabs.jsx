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
  const buttonWidth = 70;

  const getTabWidth = () => {
    const containerWidth = containerRef.current
      ? containerRef.current.offsetWidth
      : window.innerWidth;
    if (containerWidth >= 1789) return 250;
    if (containerWidth >= 1200) return 200;
    if (containerWidth >= 768) return 160;
    return 128;
  };

  const getVisibleTabs = () => {
    const containerWidth = containerRef.current
      ? containerRef.current.offsetWidth
      : window.innerWidth;
    const tabWidth = getTabWidth();
    return Math.floor((containerWidth - buttonWidth * 2) / tabWidth);
  };

  const visibleTabs = getVisibleTabs();

  useEffect(() => {
    const handleResize = () => {
      const newVisibleTabs = getVisibleTabs();
      if (newVisibleTabs !== visibleTabs) {
        setSelectedCategoryIdLocal(selectedCategoryId); // Trigger re-render on resize
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedCategoryId, visibleTabs]);

  useEffect(() => {
    setSelectedCategoryIdLocal(selectedCategoryId);
  }, [selectedCategoryId]);

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
    const tabWidth = getTabWidth();
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -tabWidth * visibleTabs,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const tabWidth = getTabWidth();
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: tabWidth * visibleTabs,
        behavior: "smooth",
      });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  const clonedTabs = [...categoryData, ...categoryData, ...categoryData];

  return (
    <div className="scrollable-tabs-wrapper">
      <button className="scroll-button left" onClick={scrollLeft}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="scrollable-tabs-container" ref={containerRef}>
        {clonedTabs.map((category, index) => (
          <div
            key={index}
            id={`tab-${category._id}`}
            className={`scrollable-tab ${
              selectedCategoryIdLocal === category._id ? "selected" : ""
            }`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <div className="tab-image-container">
              <img
                src={category.imageKey}
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
