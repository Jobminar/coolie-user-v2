import React, { useEffect, useState } from 'react'
import './Bookings.css'

const Bookings = () => {
    const [bookingsData, setBookingsData] = useState(null)
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const userid = sessionStorage.getItem('userId')
        if (userid) {
            setUserId(userid)
        }
    }, [])

    useEffect(() => {
        const fetchBookings = async (id) => {
            try {
                const response = await fetch(`https://api.coolieno1.in/v1.0/users/order/${id}`)
                const data = await response.json()
                setBookingsData(data)
            } catch (err) {
                console.log(err)
            }
        }
        if (userId) {
            fetchBookings(userId)
        }
    }, [userId])

    console.log(userId, 'userid in Bookings')
    console.log(bookingsData)

    return (
        <>
            <h2 className='bookings'>My Bookings</h2>
            {bookingsData && Array.isArray(bookingsData) && bookingsData.length > 0 ? (
                <div >
                    {bookingsData.map((booking, index) => (
                        <div key={index} className='book-sub-con'>
                            <p>Address ID: {booking.addressId}</p>
                            <p>Category IDs: {booking.categoryIds.join(', ')}</p>
                            <p>Payment ID: {booking.paymentId}</p>
                            <p>Status: {booking.status}</p>
                            <div className='booking-items'>
                                {booking.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className='booking-sub-item'>
                                        <p>Service ID: {item.serviceId}</p>
                                        <p>Category ID: {item.categoryId}</p>
                                        <p>Subcategory ID: {item.subCategoryId}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Scheduled Date: {item.scheduledDate}</p>
                                        <p>Selected Date: {item.selectedDate}</p>
                                        <p>Selected Month: {item.selectedMonth}</p>
                                        <p>Selected Time: {item.selectedTime}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No bookings found.</p>
            )}
        </>
    )
}

export default Bookings
