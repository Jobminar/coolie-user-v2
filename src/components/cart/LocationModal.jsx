import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./LocationModal.css";
import { useAuth } from "../../context/AuthContext";
import markerImage from "../../assets/images/user-marker.gif";
import { FaMapMarkerAlt, FaRegCheckCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LocationModal = ({ onLocationSelect, onClose }) => {
  const { userLocation } = useAuth();
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null);
  const currentLngRef = useRef(
    parseFloat(sessionStorage.getItem("markedLng")) || 0,
  );
  const currentLatRef = useRef(
    parseFloat(sessionStorage.getItem("markedLat")) || 0,
  );
  const [zoom, setZoom] = useState(12);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [tempLocation, setTempLocation] = useState({
    latitude: currentLatRef.current,
    longitude: currentLngRef.current,
  });

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`,
      );
      const data = await response.json();
      if (data.features.length > 0) {
        return data.features[0].place_name;
      }
      return "Unknown location";
    } catch (error) {
      console.error("Failed to fetch address:", error);
      return "Error fetching address";
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
    currentLngRef.current = longitude;
    currentLatRef.current = latitude;
    onLocationSelect({
      address: fetchedAddress,
      city: "Marked City",
      pincode: "00000",
      state: "Marked State",
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
      currentLatRef.current = latitude;
      currentLngRef.current = longitude;
      reloadMap(latitude, longitude);
      const fetchedAddress = await fetchAddress(latitude, longitude);
      onLocationSelect({
        address: fetchedAddress,
        city: "Current City",
        pincode: "00000",
        state: "Current State",
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
    }
  };

  useEffect(() => {
    if (currentLatRef.current === 0 && currentLngRef.current === 0) {
      if (userLocation) {
        const { latitude, longitude } = userLocation;
        reloadMap(latitude, longitude);
      }
    } else {
      reloadMap(currentLatRef.current, currentLngRef.current);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      updateLocation(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

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
