import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCategories, addDish } from '../../https';
import { useSnackbar } from 'notistack'; // Import for notifications

const DishModal = ({ setIsDishModalOpen }) => {
  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar
  const [dishData, setDishData] = useState({
    dishName: '',
    dishPrice: '',
    category: '',
  });

  // Fetch categories
  const { data: resData, isError } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      return await getCategories();
    },
  });

  if (isError) {
    enqueueSnackbar('Something went wrong!', { variant: 'error' });
  }

  // Mutation for adding a dish
  const dishMutation = useMutation({
    mutationFn: (reqData) => addDish(reqData),
    onSuccess: (res) => {
      console.log("Backend Response (Success):", res); // Log the full response
      setIsDishModalOpen(false);
  
      // Check for the success message in the response
      if (res.data && typeof res.data.message === 'string') {
        console.log("Success Message:", res.data.message); // Log the success message
        enqueueSnackbar(res.data.message, { variant: 'success' });
      } else if (res.message) {
        console.log("Success Message:", res.message); // Log the success message
        enqueueSnackbar(res.message, { variant: 'success' });
      } else {
        console.log("No success message found in response. Using fallback message.");
        enqueueSnackbar('Dish added successfully!', { variant: 'success' });
      }
    },
    onError: (error) => {
      console.error("Error Details:", error); // Log the full error object
      if (error.response && error.response.data) {
        // Handle JSON response
        if (error.response.data.message) {
          console.log("Error Message:", error.response.data.message); // Log the error message
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        } else {
          console.log("No error message found in response. Using fallback message.");
          enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
        }
      } else {
        console.log("No response data found. Using fallback message.");
        enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
      }
    },
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setDishData((prev) => ({ ...prev, category: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dishData);
    dishMutation.mutate(dishData);
  };

  // Close modal
  const handleCloseDishModal = () => {
    setIsDishModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semi-bold">Add Dishes</h2>
          <button
            onClick={handleCloseDishModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {/* Dish Name */}
          <div className="classname">
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Dish Name
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="dishName"
                value={dishData.dishName}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Dish Price */}
          <div className="classname">
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Price
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="dishPrice"
                value={dishData.dishPrice}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="classname">
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Category
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <select
                onChange={handleCategoryChange}
                value={dishData.category}
                name="category"
                className="bg-transparent flex-1 text-white focus:outline-none rounded-md border border-gray-600 p-2"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {resData?.data?.data?.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    className="bg-[#262626] text-white"
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded mt-6 py-3 text-lg bg-yellow-400 text-grey-900 font-bold"
            disabled={dishMutation.isPending}
          >
            {dishMutation.isPending ? 'Adding...' : 'Add Dish'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DishModal;