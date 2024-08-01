import React, { useEffect, useState } from 'react';
import './Bookings.css';

const Bookings = () => {
  const [bookingsData, setBookingsData] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userid = sessionStorage.getItem('userId');
    if (userid) {
      setUserId(userid);
      console.log(userid, 'userid in');
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async (id) => {
      try {
        const response = await fetch(`https://api.coolieno1.in/v1.0/users/order/${id}`);
        const data = await response.json();
        setBookingsData(data);
        console.log(data, 'bookings data in api component');
      } catch (err) {
        console.log(err);
      }
    };
    if (userId) {
      fetchBookings(userId);
    }
  }, [userId]);

  return (
    <>
      <h2 className='bookings'>My Bookings</h2>
      {bookingsData && Array.isArray(bookingsData) && bookingsData.length > 0 ? (
        <div>
          {bookingsData.map((booking, index) => (
            <div key={index} className='book-sub-con'>
                <p>{booking}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </>
  );
};

export default Bookings;
