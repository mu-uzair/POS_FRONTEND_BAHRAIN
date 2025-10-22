import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addDeliveryBoy } from "../../https"; // ✅ Import your real API call

/**
 * API function (real)
 * Ensure this exists in your ../../https file:
 * export const addDeliveryBoy = (data) => api.post("/api/deliveryBoy", data);
 */

const DeliveryBoyModal = ({ setIsDeliveryBoyModalOpen }) => {
  const [deliveryBoyData, setDeliveryBoyData] = useState({
    name: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryBoyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deliveryBoyMutation.mutate(deliveryBoyData);
  };

  const handleCloseModal = () => {
    setIsDeliveryBoyModalOpen(false);
  };

  const deliveryBoyMutation = useMutation({
    mutationFn: (reqData) => addDeliveryBoy(reqData),
    onSuccess: (res) => {
      setIsDeliveryBoyModalOpen(false);
      enqueueSnackbar(res.data.message || "Delivery Boy added successfully!", {
        variant: "success",
      });
      // ✅ Optionally refetch list:
      // queryClient.invalidateQueries(['deliveryBoys']);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "An unexpected error occurred while adding the delivery boy.";
      enqueueSnackbar(message, { variant: "error" });
      console.error("Error adding delivery boy:", error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">
            Add Delivery Boy
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {/* Name */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Delivery Boy Name
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="name"
                value={deliveryBoyData.name}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Phone Number
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="phone"
                value={deliveryBoyData.phone}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                placeholder="03XXXXXXXXX"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={deliveryBoyMutation.isPending}
            className={`w-full rounded mt-6 py-3 text-lg font-bold transition duration-200 
              ${
                deliveryBoyMutation.isPending
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
          >
            {deliveryBoyMutation.isPending
              ? "Adding..."
              : "Add Delivery Boy"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DeliveryBoyModal;
