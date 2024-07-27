import React, { useState, useEffect } from "react";
import "./MOSTBOOKEDSERVICES.css"; // import your styling
import { useNavigate } from "react-router-dom";

const Mostbookedservices = () => {
  const navigate = useNavigate()
  const [mostBooked, setMostBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/admin/most-booked",
        );
        const data = await response.json();
        setMostBooked(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mostbooked-main-con">
      <h2>
        Most Booked <span>Services</span>
      </h2>
      <div className="most-booked">
        {mostBooked.map((service, index) => (
          <div key={index} className="sub-booked">
            <div className="sub-booked-image">
              <img
                src={service.image} onClick={()=>navigate('/services')}
              />
            </div>

            <h6 className="most-booked-name">{service.name}</h6>
            <p className='most-booked-price'>Rs : {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mostbookedservices;
