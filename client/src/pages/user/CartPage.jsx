import React, { useState, useEffect } from "react";
import {
  useAllCartsQuery,
  useRemoveCartItemMutation,
  useAddToCartMutation,
} from "@/redux/api/cartApi";

const CartPage = () => {
  const { data, isLoading, isError, refetch } = useAllCartsQuery();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [addToCart] = useAddToCartMutation();

  // ✅ Store cart items in local state for optimistic updates
  const [cartItems, setCartItems] = useState([]);

  // ✅ Update cart state when data changes
  useEffect(() => {
    if (data?.length > 0) {
      setCartItems(data[0]?.cartItems || []);
    }
  }, [data]);

  if (isLoading)
    return <p className="text-center text-lg text-white">Loading cart...</p>;
  if (isError)
    return (
      <p className="text-center text-lg text-red-500">
        Error loading cart. Please try again.
      </p>
    );

  if (cartItems.length === 0) {
    return (
      <p className="text-center text-lg text-white">Your cart is empty.</p>
    );
  }

  // ✅ Calculate total price after discount
  const totalPrice = cartItems.reduce((acc, item) => {
    const finalPrice =
      item.project?.price -
      (item.project?.price * item.project?.discountPercentage) / 100;
    return acc + (finalPrice || 0);
  }, 0);

  // ✅ Optimistic UI update when removing an item
  const handleRemove = async (projectId) => {
    try {
      // ✅ Optimistically update UI before API call
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.project?._id !== projectId)
      );

      // ✅ API Call
      await removeCartItem(projectId).unwrap();

      // ✅ Ensure cart is up to date
      refetch();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Optimistic UI update when adding an item
  const handleAddToCart = async (projectId, quantity) => {
    try {
      // ✅ Optimistically update UI before API call
      setCartItems((prevItems) => [
        ...prevItems,
        {
          project: { _id: projectId, price: 500, discountPercentage: 10 },
          quantity,
        },
      ]);

      // ✅ API Call
      await addToCart({ projectId, quantity }).unwrap();

      // ✅ Ensure cart is up to date
      refetch();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="px-6 md:px-20 py-10 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-10">
        {/* Left Section: Cart Items */}
        <div className="md:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.project?._id}
              className="flex items-center mb-4 p-4 border-b border-gray-700"
            >
              {/* ✅ Image */}
              <img
                src={item.project?.thumbnail}
                alt={item.project?.title}
                className="w-24 h-24 md:w-32 md:h-32 object-contain rounded"
              />

              {/* ✅ Details */}
              <div className="ml-4 flex-1">
                <h3 className="text-lg md:text-xl font-semibold">
                  {item.project?.title}
                </h3>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-green-400 text-sm">
                    {item.project?.discountPercentage}% off
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    ₹{item.project?.price}
                  </span>
                  <span className="font-bold text-lg">
                    ₹
                    {(
                      item.project?.price -
                      (item.project?.price * item.project?.discountPercentage) /
                        100
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ✅ Remove Button */}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full w-10 h-10 flex items-center justify-center text-xl"
                onClick={() => handleRemove(item.project?._id)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Right Section: Total Amount & Checkout */}
        <div className="bg-gray-900 p-5 rounded-lg shadow-lg w-full md:w-64 self-start">
          <h3 className="text-xl font-bold mb-2 text-center">Total Amount</h3>
          <p className="text-lg font-semibold text-center">
            ₹{totalPrice.toFixed(2)}
          </p>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
