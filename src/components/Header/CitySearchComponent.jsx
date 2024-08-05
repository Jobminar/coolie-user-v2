// CitySearchComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CitySearchComponent.css";

const CitySearchComponent = ({ query, onSelect, onClose }) => {
  const [cities, setCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (query.length > 2) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=in&limit=10&access_token=${MAPBOX_ACCESS_TOKEN}`,
          );
          const cityData = response.data.features.map((feature) => ({
            name: feature.place_name,
            coordinates: feature.geometry.coordinates,
          }));
          setCities(cityData);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    } else {
      setShowDropdown(false);
    }
  }, [query, MAPBOX_ACCESS_TOKEN]);

  const handleCityClick = (city) => {
    onSelect(city);
    onClose(); // Notify parent to close the dropdown
    setShowDropdown(false);
  };

  return (
    <div className="city-search-component">
      {showDropdown && (
        <div className="city-dropdown">
          {cities.map((city, index) => (
            <div
              key={index}
              className="city-dropdown-item"
              onClick={() => handleCityClick(city)}
            >
              {city.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearchComponent;
