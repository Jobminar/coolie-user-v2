// LoadingPage.js
import React from "react";
import "./LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <img src="search-animation.png" alt="Searching for provider" />
        <h2>Your Order has been made and Looking for a provider to accept</h2>
      </div>
    </div>
  );
};

export default LoadingPage;
