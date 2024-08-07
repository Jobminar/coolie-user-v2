import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./LocationModal.css";
import { useAuth } from "../../context/AuthContext";
import markerImage from "../../assets/images/user-marker.gif";
import { FaMapMarkerAlt, FaRegCheckCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Mappls credentials
const mapplsClientId =
  "96dHZVzsAuvNFqtguKmRirhneQi6jwDqKHqxRSBj_DBjzGXdYFul00yumGZ59tvS6Vnj8OuT38L5AOnHZcyqS2cO0odIYqS2";
const mapplsClientSecret =
  "lrFxI-iSEg-i8-yYnoCqxRsgvMU-6gtmEhtqBq2orhyONiT6NyhTED2nW_vCxid4hm3Tl1bqq3Cf8u-BNMaBrWg7vkG5lnvPQUV6SsvqY9M=";

const LocationModal = ({ onLocationSelect, onClose }) => {
  const { userLocation, userCity } = useAuth();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [tempLocation, setTempLocation] = useState({
    latitude: parseFloat(sessionStorage.getItem("markedLat")) || 0,
    longitude: parseFloat(sessionStorage.getItem("markedLng")) || 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://apis.mappls.com/advancedmaps/v1/${mapplsClientId}/rev_geocode?lat=${latitude}&lng=${longitude}&client_id=${mapplsClientId}&client_secret=${mapplsClientSecret}`,
      );
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Unknown location";
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "Error fetching address";
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://apis.mappls.com/advancedmaps/v1/${mapplsClientId}/place_search?query=${query}&client_id=${mapplsClientId}&client_secret=${mapplsClientSecret}`,
      );
      const data = await response.json();
      if (data.suggestedLocations.length > 0) {
        const cityFiltered = data.suggestedLocations.filter(
          (feature) =>
            feature.placeName.toUpperCase().includes(query.toUpperCase()) &&
            feature.placeName.toUpperCase().includes(userCity.toUpperCase()),
        );
        setSuggestions(cityFiltered);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const updateLocation = async (latitude, longitude) => {
    const fetchedAddress = await fetchAddress(latitude, longitude);
    setAddress(fetchedAddress);
  };

  const handleUseMarkedLocation = async () => {
    const { latitude, longitude } = tempLocation;
    if (popup) {
      popup.remove();
    }
    setLoading(true);
    const fetchedAddress = await fetchAddress(latitude, longitude);
    const newPopup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat([longitude, latitude])
      .setHTML(`<p><strong>Address:</strong> ${fetchedAddress}</p>`)
      .addTo(map);
    setPopup(newPopup);
    sessionStorage.setItem("markedLat", latitude);
    sessionStorage.setItem("markedLng", longitude);
    onLocationSelect({
      address: fetchedAddress,
      city: userCity,
      latitude,
      longitude,
    });
    setAddress(fetchedAddress);
    setLoading(false);
  };

  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;
      setTempLocation({ latitude, longitude });
      reloadMap(latitude, longitude);
      const fetchedAddress = await fetchAddress(latitude, longitude);
      onLocationSelect({
        address: fetchedAddress,
        city: userCity,
        latitude,
        longitude,
      });
    }
  };

  const reloadMap = async (latitude, longitude) => {
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        essential: true,
      });
      marker.setLngLat([longitude, latitude]);
    } else {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, latitude],
        zoom: zoom,
      });

      newMap.on("load", async () => {
        setMap(newMap);
        setMapLoading(false);

        const newMarker = new mapboxgl.Marker({
          draggable: true,
          element: document.createElement("div"),
        })
          .setLngLat([longitude, latitude])
          .addTo(newMap);

        const markerElement = newMarker.getElement();
        markerElement.style.backgroundImage = `url(${markerImage})`;
        markerElement.style.width = "50px";
        markerElement.style.height = "50px";
        markerElement.style.backgroundSize = "100%";

        newMarker.on("dragend", async () => {
          const lngLat = newMarker.getLngLat();
          setTempLocation({ latitude: lngLat.lat, longitude: lngLat.lng });
          await updateLocation(lngLat.lat, lngLat.lng);
        });

        setMarker(newMarker);

        await updateLocation(latitude, longitude);
      });

      newMap.on("click", async (e) => {
        const longitude = e.lngLat.lng;
        const latitude = e.lngLat.lat;
        setTempLocation({ latitude, longitude });

        newMarker.setLngLat([longitude, latitude]);
        await updateLocation(latitude, longitude);
      });

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserLocation: true,
      });

      newMap.addControl(geolocateControl);

      geolocateControl.on("geolocate", (e) => {
        const { latitude, longitude } = e.coords;
        setTempLocation({ latitude, longitude });
        reloadMap(latitude, longitude);
      });
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const [longitude, latitude] = suggestion.coordinates.split(",");
    setTempLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    setSearchQuery(suggestion.placeName);
    setSuggestions([]);
    reloadMap(parseFloat(latitude), parseFloat(longitude));
    const fetchedAddress = await fetchAddress(
      parseFloat(latitude),
      parseFloat(longitude),
    );
    onLocationSelect({
      address: fetchedAddress,
      city: userCity,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  };

  useEffect(() => {
    if (
      userLocation &&
      tempLocation.latitude === 0 &&
      tempLocation.longitude === 0
    ) {
      const { latitude, longitude } = userLocation;
      reloadMap(latitude, longitude);
    } else if (tempLocation.latitude !== 0 && tempLocation.longitude !== 0) {
      reloadMap(tempLocation.latitude, tempLocation.longitude);
    }
  }, [userLocation, tempLocation.latitude, tempLocation.longitude]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 1) {
        fetchSuggestions(searchQuery);
      }
    }, 50); // Reduced delay for faster updates

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="location-container">
      {loading && (
        <div className="loading-overlay">
          <TailSpin
            height="80"
            width="80"
            color="#0988cf"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible={true}
          />
        </div>
      )}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.placeName}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div id="map" className="map-container" ref={mapContainerRef}>
        {mapLoading && <div className="loading-message">Loading map...</div>}
      </div>
      <div className="instructions">
        <div className="location-info">
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>
        <p className="location-description">
          <strong>Welcome!</strong> You can use this map to set your location.
          Drag the marker to your desired location or click on the map to place
          the marker. Use the marked location to proceed.
        </p>
        <div className="location-buttons">
          <button
            onClick={handleUseMarkedLocation}
            className="use-location-button"
            disabled={loading}
          >
            <FaRegCheckCircle /> Use Marked Location
          </button>
          <button
            onClick={handleUseCurrentLocation}
            className="use-location-button"
            disabled={loading}
          >
            <FaMapMarkerAlt /> Use Current Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
