import React, { useEffect } from "react";
import ProviderTracking from "./ProviderTracking";
import WorkerInfo from "./WorkerInfo";
import Timer from "./Timer";
import { Toaster, toast } from "react-hot-toast";
import "./OrderTracking.css";

const OrderTracking = () => {
  const worker = {
    image: "https://via.placeholder.com/150",
    name: "Anil",
    distance: "800m",
    rating: 4.9,
    reviews: 531,
  };

  useEffect(() => {
    // Center the scroll position in the viewport height
    const scrollToCenter = () => {
      const orderTrackingElement = document.querySelector(".order-tracking");
      const { height } = orderTrackingElement.getBoundingClientRect();
      const centerY = (height - window.innerHeight) / 2;
      window.scrollTo(0, centerY);
    };

    scrollToCenter();
    window.addEventListener("resize", scrollToCenter);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", scrollToCenter);
    };
  }, []);

  const handleCall = () => {
    toast(
      (t) => (
        <span>
          Calling worker...
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast("Call canceled", { icon: "❌" });
            }}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              border: "none",
              background: "#ffcc00",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel Call
          </button>
        </span>
      ),
      {
        icon: "📞",
      },
    );
    console.log("Calling worker...");
  };

  const handleCancel = () => {
    toast("Booking canceled.", {
      icon: "❌",
    });
    console.log("Booking canceled.");
  };

  return (
    <div className="order-tracking">
      <ProviderTracking />
      <div className="info-container">
        <Timer />
        <hr
          id="info-dividing-line"
          style={{
            backgroundColor: "#444",
            height: "1px",
            border: "none",
            margin: "10px 0",
          }}
        />
        <WorkerInfo
          worker={worker}
          onCall={handleCall}
          onCancel={handleCancel}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default OrderTracking;
