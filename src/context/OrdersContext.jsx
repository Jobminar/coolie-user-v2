import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { CartContext } from "./CartContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "./AuthContext";
import { useMessaging } from "./MessagingContext";

export const OrdersContext = createContext();

export const OrdersProvider = ({ children, activeTab }) => {
  const { cartItems } = useContext(CartContext);
  const { user } = useAuth();
  const { token, sendNotification } = useMessaging();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const orderDataRef = useRef([]);
  const hasMountedRef = useRef(false);

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

    if (!selectedAddressId || !orderDetails.length || !user?._id) {
      console.error("Missing address, cart items, or user information");
      return;
    }

    // Extracting items from orderDetails, removing the cartItems wrapper
    const items = orderDetails.flatMap((cart) =>
      cart.items.map((item) => ({
        ...item,
        scheduledDate: formatScheduledDate(item),
      })),
    );

    const orderData = {
      userId: user._id,
      addressId: selectedAddressId,
      categoryIds: categoryIds,
      subCategoryIds: subCategoryIds,
      items: items,
      paymentId,
    };

    console.log("Order Data:", orderData);

    try {
      // Log FCM token before creating order
      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.log("No FCM Token available");
      }

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

        confirmAlert({
          title: "Order Created",
          message:
            "We will comeback to you once a service provider accepts the service.",
          buttons: [
            {
              label: "OK",
              onClick: () => {},
            },
          ],
        });
      } else {
        console.error("Failed to create order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
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
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
