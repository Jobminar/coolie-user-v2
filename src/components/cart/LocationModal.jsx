import React, { useState, useEffect, useRef } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import "./LocationModal.css";
import { useAuth } from "../../context/AuthContext";
import markerImage from "../../assets/images/user-marker.gif";
import { FaMapMarkerAlt, FaRegCheckCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LocationModal = ({ onLocationSelect, onClose }) => {
  const { userLocation, userCity } = useAuth();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
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

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&types=address,poi,neighborhood,place,locality`,
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
      .addTo(mapInstanceRef.current);
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
    console.log(`Reloading map to: ${latitude}, ${longitude}`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [longitude, latitude],
        essential: true,
      });
      if (marker) {
        marker.setLngLat([longitude, latitude]);
      }
    } else {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, latitude],
        zoom: zoom,
      });

      newMap.on("load", async () => {
        setMapLoaded(true);
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

        if (marker) {
          marker.setLngLat([longitude, latitude]);
        }
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

      mapInstanceRef.current = newMap;
    }
  };

  const handleRetrieve = async (result) => {
    const [longitude, latitude] = result.geometry.coordinates;
    setTempLocation({ latitude, longitude });
    const fetchedAddress = await fetchAddress(latitude, longitude);
    setAddress(fetchedAddress);
    console.log(`Search result selected: ${latitude}, ${longitude}`);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15, // Maximum zoom level for better visibility
        essential: true,
      });

      if (marker) {
        marker.setLngLat([longitude, latitude]);
      } else {
        const newMarker = new mapboxgl.Marker({
          draggable: true,
          element: document.createElement("div"),
        })
          .setLngLat([longitude, latitude])
          .addTo(mapInstanceRef.current);

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
      }
    }
    onLocationSelect({
      address: fetchedAddress,
      city: userCity,
      latitude,
      longitude,
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
        <SearchBox
          accessToken={mapboxgl.accessToken}
          map={mapInstanceRef.current}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(d) => {
            setInputValue(d);
          }}
          onRetrieve={handleRetrieve}
          placeholder="Search for a location (e.g., address, POI, neighborhood)"
          marker={false} // Disable built-in marker to use custom marker
        />
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
