import React, { useEffect, useState } from 'react';
import './addresses.css'
import rightarrow from '../../../assets/images/right-arrow.svg'
import AddressForm from '../../../components/cart/AddressForm';
import Userprofileaddressform from './userprofileaddressform';


const Addresses = () => {
  const [userId, setStoredUserId] = useState(null);
  const [addressData, setAddressesData] = useState([]);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);

  const handleAddAddressClick = () => {
    setIsAddressFormVisible(!isAddressFormVisible);
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setStoredUserId(storedUserId);
  }, [userId])

  useEffect(() => {
    if (userId) {
      const fetchAddresses = async (uid) => {
        try {
          const response = await fetch(`https://api.coolieno1.in/v1.0/users/user-address/${uid}`);

          if (response.ok) {
            const data = await response.json();
            setAddressesData(data);
          } else {
            console.error('Failed to fetch addresses:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      };

      fetchAddresses(userId); // Call fetchAddresses with userId
    }
  }, [userId]);

  console.log(addressData, 'address data in address page');

  return (
    <div>
     <div className='add-address' onClick={handleAddAddressClick} style={{ cursor: 'pointer' }}>
        + Add Address 
        <img src={rightarrow} alt='right arrow' />
      </div>
      <div className='addresses-post' style={{ display: isAddressFormVisible ? 'block' : 'none' }}>
        <Userprofileaddressform />
      </div>
      <h2 className='add-head'>Saved Addresses</h2>
  
        {addressData.map((address, index) => (
          <>
          
        
          {/* <div key={address._id} className='addresses-sub-con'>
            <div>Username: {address.username}</div>
            <div>Booking Type: {address.bookingType}</div>
            <div>Mobile Number: {address.mobileNumber}</div>
            <div>Address: {address.address}</div>
            <div>City: </div>
            <div>Pincode: </div>
            <div>Landmark: </div>
            <div>State: {address.state}</div>
            <div>Latitude: {address.latitude}</div>
            <div>Longitude: {address.longitude}</div>
            <div>Created At: {new Date(address.createdAt).toLocaleString()}</div>
            <div>Updated At: {new Date(address.updatedAt).toLocaleString()}</div>
          </div> */}
          <div className='addresses-sub-con'>
            
             <div>{ address.address}   <span>{  address.landmark}</span>   <span>{ address.city}</span><br/><span>{ address.pincode}</span></div> 
             
          </div>
          </>
        ))}
      
    </div>
  );
};

export default Addresses;
