import React from "react";
import "./applianceRepair.css";
import acRepair from "../../../assets/images/AC-repair.png";
import purifierService from "../../../assets/images/purifier-service.png";
import washingMachineRepair from "../../../assets/images/Washing-machine-repair.png";
import fanRepair from "../../../assets/images/fan-repair.png";

const ApplianceRepair = () => {
  const services = [
    {
      id: 1,
      name: "AC Repair",
      price: "Starting at ₹50",
      image: acRepair,
    },
    {
      id: 2,
      name: "Water Purifier Repair",
      price: "Starting at ₹40",
      image: purifierService,
    },
    {
      id: 3,
      name: "Washing Machine Repair",
      price: "Starting at ₹60",
      image: washingMachineRepair,
    },
    {
      id: 4,
      name: "Ceiling Fan Repair",
      price: "Starting at ₹50",
      image: fanRepair,
    },
  ];

  return (
    <div className="appliance-repair-main-con">
      <h2>
        AC & Appliance <span>Repair</span>
      </h2>
      <div className="appliance-repair-services">
        {services.map((service) => (
          <div key={service.id} className="appliance-repair-item">
            <div className="appliance-repair-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="appliance-repair-name">{service.name}</div>
            <div className="appliance-repair-price">{service.price}</div>
            <button className="appliance-repair-book-button">BOOK NOW</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplianceRepair;
