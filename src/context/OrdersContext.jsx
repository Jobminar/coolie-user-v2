import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
} from "react";
import { CartContext } from "./CartContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext";
import { useMessaging } from "./MessagingContext";
import { onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const { cartItems } = useContext(CartContext);
  const { user, userId } = useAuth(); // Get userId from useAuth
  const { token, sendNotification, messageRef } = useMessaging();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const orderDataRef = useRef([]);
  const hasMountedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  const userIdMemo = useMemo(() => userId, [userId]); // Memoize userId

  const updateOrderDetails = (updatedDetails) => {
    setOrderDetails(updatedDetails);
  };

  const updateItemSchedule = (itemId, dateTime) => {
    const updatedOrderData = orderDataRef.current.map((cart) => ({
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId ? { ...item, ...dateTime } : item,
      ),
    }));
    orderDataRef.current = updatedOrderData;
    setOrderDetails(updatedOrderData);
  };

  const updateAllItemSchedules = (dateTime) => {
    const updatedOrderData = orderDataRef.current.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        ...dateTime,
      })),
    }));
    orderDataRef.current = updatedOrderData;
    setOrderDetails(updatedOrderData);
  };

  const updateSelectedAddressId = (addressId) => {
    console.log("Setting selected address ID:", addressId);
    setSelectedAddressId(addressId);
  };

  const formatScheduledDate = (item) => {
    const currentDate = new Date();
    const selectedDate = item.selectedDate || currentDate.getDate();
    const selectedMonth =
      item.selectedMonth !== undefined
        ? item.selectedMonth
        : currentDate.getMonth() + 1;
    const selectedYear = currentDate.getFullYear();
    const selectedTime = item.selectedTime || "Default Time";
    return `${selectedDate}-${selectedMonth}-${selectedYear} ${selectedTime}`;
  };

  const createOrder = async (paymentId) => {
    console.log("Selected AddressId:", selectedAddressId);
    console.log("Order Details:", orderDetails);

    if (!selectedAddressId) {
      console.error("Missing address");
      confirmAlert({
        title: "Error",
        message: "Missing address",
        buttons: [{ label: "OK" }],
      });
      return;
    }

    if (!orderDetails.length) {
      console.error("Missing cart items");
      confirmAlert({
        title: "Error",
        message: "Missing cart items",
        buttons: [{ label: "OK" }],
      });
      return;
    }

    if (!userIdMemo) {
      console.error("Missing user information");
      confirmAlert({
        title: "Error",
        message: "Missing user information",
        buttons: [{ label: "OK" }],
      });
      return;
    }

    const items = orderDetails.flatMap((cart) =>
      cart.items.map((item) => ({
        ...item,
        scheduledDate: formatScheduledDate(item),
      })),
    );

    const phoneNumber = user?.phoneNumber || "0000000000"; // Default to a placeholder if phone number is missing
    const upiId = `${phoneNumber}@upi`; // Format the UPI ID

    const orderData = {
      userId: userIdMemo,
      addressId: selectedAddressId,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      items: items,
      paymentId: `${upiId}`, // Include the UPI ID
    };

    console.log("Order Data:", orderData);

    try {
      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.log("No FCM Token available");
      }

      setLoading(true);

      const response = await fetch(
        "https://api.coolieno1.in/v1.0/users/order/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (response.ok) {
        const orderResponse = await response.json();
        console.log("Order created successfully:", orderResponse);

        sendNotification({
          title: "Order Created",
          body: "Your order has been made and looking for service providers.",
        });

        setLoading(false);
        setOrderCreated(true);

        // Set a URL parameter to trigger the alert on the order tracking page
        window.location.href = "/ordertracking?orderCreated=true";
      } else {
        console.error("Failed to create order:", response.statusText);
        confirmAlert({
          title: "Error",
          message: `Failed to create order: ${response.statusText}`,
          buttons: [{ label: "OK" }],
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      confirmAlert({
        title: "Error",
        message: `Error creating order: ${error.message}`,
        buttons: [{ label: "OK" }],
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    orderDataRef.current = cartItems;
    setOrderDetails(cartItems);

    const extractedCategoryIds = [];
    const extractedSubCategoryIds = [];
    cartItems.forEach((cart) => {
      (cart.items || []).forEach((item) => {
        if (
          item.categoryId &&
          !extractedCategoryIds.includes(item.categoryId._id)
        ) {
          extractedCategoryIds.push(item.categoryId._id);
        }
        if (
          item.subCategoryId &&
          !extractedSubCategoryIds.includes(item.subCategoryId._id)
        ) {
          extractedSubCategoryIds.push(item.subCategoryId._id);
        }
      });
    });

    setCategoryIds(extractedCategoryIds);
    setSubCategoryIds(extractedSubCategoryIds);
    hasMountedRef.current = true;
  }, [cartItems]);

  useEffect(() => {
    const handleBackendMessage = (payload) => {
      console.log("Message received from backend:", payload);
      if (payload.notification && payload.data.orderId) {
        messageRef.current = payload;
        confirmAlert({
          title: "Your request for the order has been received by Task Tigers",
          message: `${payload.notification.body}\n\nOrder ID: ${payload.data.orderId}`,
          buttons: [{ label: "OK" }],
        });
        // Set a URL parameter to trigger the alert on the order tracking page
        window.location.href = "/ordertracking?orderCreated=true";
      }
    };

    onMessage(messaging, handleBackendMessage);
  }, [messageRef]);

  return (
    <OrdersContext.Provider
      value={{
        selectedAddressId,
        setSelectedAddressId,
        updateSelectedAddressId,
        orderDetails,
        updateOrderDetails,
        updateItemSchedule,
        updateAllItemSchedules,
        createOrder,
        categoryIds,
        subCategoryIds,
        loading,
        orderCreated,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
