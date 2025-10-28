import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addInventoryCategory } from "../../https"; // ✅ updated import name to match your API

const CategoryModal = ({ setIsCategoryModalOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [categoryData, setCategoryData] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const categoryMutation = useMutation({
    mutationFn: (reqData) => addInventoryCategory(reqData),
    onSuccess: (res) => {
      setIsCategoryModalOpen(false);
      queryClient.invalidateQueries(["categories"]);
      enqueueSnackbar(res.message || "Category added successfully!", {
        variant: "success",
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to add category", {
        variant: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryData.name) {
      enqueueSnackbar("Please enter a category name", { variant: "warning" });
      return;
    }
    categoryMutation.mutate(categoryData);
  };

  const handleCloseModal = () => setIsCategoryModalOpen(false);

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#262626] to-[#1f1f1f] p-8 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-96 max-w-full mx-4 font-sans relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-yellow-400/10 rounded-xl animate-pulse opacity-0 hover:opacity-20 transition-opacity duration-500"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-[#f5f5f5] text-2xl font-bold tracking-tight">Add Category</h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500 hover:bg-gray-700 p-1 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Category Name */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">
              Category Name
            </label>
            <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 hover:shadow-lg">
              <input
                type="text"
                name="name"
                value={categoryData.name}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
                placeholder="Enter category name"
                required
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="submit"
              disabled={categoryMutation.isPending}
              className={`w-full rounded py-3 text-lg font-bold transition-all duration-300 ${
                categoryMutation.isPending
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-400 hover:shadow-xl"
              } text-gray-900 relative overflow-hidden`}
            >
              <span className="relative z-10">
                {categoryMutation.isPending ? "Adding..." : "Add Category"}
              </span>
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CategoryModal;
