// import React, { useState } from 'react';
// import { IoMdClose } from 'react-icons/io';
// import { motion } from 'framer-motion';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useSnackbar } from 'notistack';
// import { getAllVendors, addProduct } from '../../https';

// const ProductModal = ({ setIsproductModalOpen }) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const queryClient = useQueryClient();
//   const [productData, setProductData] = useState({
//     name: '',
//     unit: '',
//     quantity_in_stock: '',
//     reorder_threshold: '',
//     cost_per_unit: '',
//     vendor: '',
//   });

//   // Fetch vendors
//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ['vendors'],
//     queryFn: async () => {
//       const response = await getAllVendors();
//       return response;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//     refetchOnMount: false, // Do not refetch on mount
//     refetchOnWindowFocus: false, // Do not refetch on window focus
//     onError: (error) => {
//       console.error('Error fetching vendors:', error);
//       enqueueSnackbar('Failed to fetch vendors!', { variant: 'error' });
//     },
//   });

//   // Mutation for adding a product
//   const productMutation = useMutation({
//     mutationFn: (reqData) => addProduct(reqData),
//     onSuccess: (res) => {
//       console.log('Backend Response (Success):', res);
//       setIsproductModalOpen(false);
//       queryClient.invalidateQueries(["products"]); // Invalidate products cache to update the list
//       const message =
//         res.data?.message ||
//         res.message ||
//         'Product added successfully!';
//       enqueueSnackbar(message, { variant: 'success' });
//     },
//     onError: (error) => {
//       console.error('Error Details:', error);
//       const message =
//         error.response?.data?.message ||
//         'An unexpected error occurred.';
//       enqueueSnackbar(message, { variant: 'error' });
//     },
//   });

//   const vendorsList = resData?.data?.data?.data || [];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formattedData = {
//       ...productData,
//       quantity_in_stock: parseInt(productData.quantity_in_stock, 10) || 0,
//       reorder_threshold: parseInt(productData.reorder_threshold, 10) || 0,
//       cost_per_unit: parseFloat(productData.cost_per_unit) || 0,
//     };
//     console.log('Submitting Product Data:', formattedData);
//     productMutation.mutate(formattedData);
//   };

//   const handleCloseProductModal = () => {
//     setIsproductModalOpen(false);
//   };

//   const inputVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.05, transition: { duration: 0.2 } },
//     tap: { scale: 0.95 },
//   };

//   // Render loading state
//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//         <div className="bg-[#262626] p-8 rounded-xl text-white">Loading vendors...</div>
//       </div>
//     );
//   }

//   // Show error notification but continue rendering
//   if (isError) {
//     enqueueSnackbar('Failed to fetch vendors!', { variant: 'error' });
//   }

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         transition={{ duration: 0.3, ease: 'easeInOut' }}
//         className="bg-gradient-to-br from-[#262626] to-[#1f1f1f] p-8 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-96 max-w-full mx-4 font-sans relative overflow-hidden"
//       >
//         <div className="absolute inset-0 bg-yellow-400/10 rounded-xl animate-pulse opacity-0 hover:opacity-20 transition-opacity duration-500"></div>

//         <div className="flex justify-between items-center mb-6 relative z-10">
//           <h2 className="text-[#f5f5f5] text-2xl font-bold tracking-tight">Add Product</h2>
//           <button
//             onClick={handleCloseProductModal}
//             className="text-[#f5f5f5] hover:text-red-500 hover:bg-gray-700 p-1 rounded-full transition-all duration-200 hover:rotate-90"
//           >
//             <IoMdClose size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
//           {/* Product Name */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Product Name</label>
//             <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
//               <input
//                 type="text"
//                 name="name"
//                 value={productData.name}
//                 onChange={handleInputChange}
//                 className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
//                 placeholder="Enter product name"
//                 required
//               />
//             </div>
//           </motion.div>

//           {/* Unit */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Unit (pcs, kg, L)</label>
//             <div className="relative">
//               <select
//                 name="unit"
//                 value={productData.unit}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#1f1f1f] border border-gray-600 text-white p-3 rounded-lg cursor-pointer focus:outline-none focus:border-yellow-400 hover:border-yellow-400/50 transition-all duration-300 text-sm appearance-none"
//                 required
//               >
//                 <option value="" disabled className="bg-[#1f1f1f] text-gray-500">
//                   Select unit
//                 </option>
//                 <option value="pcs" className="bg-[#1f1f1f] text-white">Pieces (pcs)</option>
//                 <option value="kg" className="bg-[#1f1f1f] text-white">Kilograms (kg)</option>
//                 <option value="L" className="bg-[#1f1f1f] text-white">Liters (L)</option>
//               </select>
//             </div>
//           </motion.div>

//           {/* Quantity */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Quantity In Stock</label>
//             <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
//               <input
//                 type="number"
//                 name="quantity_in_stock"
//                 value={productData.quantity_in_stock}
//                 onChange={handleInputChange}
//                 className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
//                 placeholder="0"
//                 required
//               />
//             </div>
//           </motion.div>

//           {/* Reorder Threshold */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Reorder Threshold</label>
//             <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
//               <input
//                 type="number"
//                 name="reorder_threshold"
//                 value={productData.reorder_threshold}
//                 onChange={handleInputChange}
//                 className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
//                 placeholder="0"
//                 required
//               />
//             </div>
//           </motion.div>

//           {/* Cost Per Unit */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Cost Per Unit</label>
//             <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
//               <input
//                 type="number"
//                 name="cost_per_unit"
//                 step="0.01"
//                 value={productData.cost_per_unit}
//                 onChange={handleInputChange}
//                 className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
//                 placeholder="0.00"
//                 required
//               />
//             </div>
//           </motion.div>

//           {/* Vendor Dropdown */}
//           <motion.div variants={inputVariants} initial="hidden" animate="visible">
//             <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Vendor</label>
//             <div className="relative">
//               <select
//                 name="vendor"
//                 value={productData.vendor}
//                 onChange={handleInputChange}
//                 className="w-full bg-[#1f1f1f] border border-gray-600 text-white p-3 rounded-lg cursor-pointer focus:outline-none focus:border-yellow-400 hover:border-yellow-400/50 transition-all duration-300 text-sm appearance-none"
//                 required
//               >
//                 <option value="" disabled className="bg-[#1f1f1f] text-gray-500">
//                   Select a vendor
//                 </option>
//                 {vendorsList.length > 0 ? (
//                   vendorsList.map((vendor) => (
//                     <option
//                       key={vendor._id}
//                       value={vendor._id}
//                       className="bg-[#1f1f1f] text-white"
//                     >
//                       {vendor.name || 'Unnamed Vendor'}
//                     </option>
//                   ))
//                 ) : (
//                   <option disabled className="bg-[#1f1f1f] text-gray-500">
//                     No vendors available
//                   </option>
//                 )}
//               </select>
//             </div>
//           </motion.div>

//           {/* Submit Button */}
//           <motion.div className="mt-6" variants={buttonVariants} whileHover="hover" whileTap="tap">
//             <button
//               type="submit"
//               className={`w-full rounded py-3 text-lg font-bold transition-all duration-300 ${
//                 productMutation.isPending
//                   ? 'bg-yellow-300 cursor-not-allowed'
//                   : 'bg-yellow-600 hover:bg-yellow-400 hover:shadow-xl'
//               } text-gray-900 relative overflow-hidden`}
//               disabled={productMutation.isPending}
//             >
//               <span className="relative z-10">
//                 {productMutation.isPending ? 'Adding...' : 'Add Product'}
//               </span>
//               {!productMutation.isPending && (
//                 <span className="absolute inset-0 bg-yellow-500 opacity-0 hover:opacity-30 transition-opacity duration-300"></span>
//               )}
//             </button>
//           </motion.div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default ProductModal;

import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import {
  getAllVendors,
  getAllInventoryCategories,
  addProduct
} from '../../https'; // ✅ Add getAllInventoryCategories

const ProductModal = ({ setIsproductModalOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [productData, setProductData] = useState({
    name: '',
    category: '',
    unit: '',
    quantity_in_stock: '',
    reorder_threshold: '',
    cost_per_unit: '',
    vendor: '',
  });

  // 🔹 Fetch Vendors
  const { data: vendorData, isError: vendorError, isLoading: vendorLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: getAllVendors,
    staleTime: 5 * 60 * 1000,
    onError: () => enqueueSnackbar('Failed to fetch vendors!', { variant: 'error' }),
  });

  // 🔹 Fetch Categories
  const { data: categoryData, isError: categoryError, isLoading: categoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllInventoryCategories,
    staleTime: 5 * 60 * 1000,
    onError: () => enqueueSnackbar('Failed to fetch categories!', { variant: 'error' }),
  });

  const vendorsList = vendorData?.data?.data?.data || [];
  const categoriesList = categoryData || [];


  // 🔹 Mutation for adding product
  const productMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (res) => {
      setIsproductModalOpen(false);
      queryClient.invalidateQueries(['products']);
      enqueueSnackbar(res.data?.message || 'Product added successfully!', { variant: 'success' });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to add product.';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...productData,
      quantity_in_stock: Number(productData.quantity_in_stock) || 0,
      reorder_threshold: Number(productData.reorder_threshold) || 0,
      // ✅ Force 3-decimal format for BHD currency
      cost_per_unit: parseFloat(parseFloat(productData.cost_per_unit).toFixed(3)) || 0.0,
    };

    productMutation.mutate(formattedData);
  };

  const handleCloseProductModal = () => setIsproductModalOpen(false);

  if (vendorLoading || categoryLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#262626] p-8 rounded-xl text-white">Loading data...</div>
      </div>
    );
  }

  if (vendorError || categoryError) {
    enqueueSnackbar('Error loading vendors or categories.', { variant: 'error' });
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#262626] to-[#1f1f1f] p-8 rounded-xl w-96 shadow-lg text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Product</h2>
          <button onClick={handleCloseProductModal} className="hover:text-red-500">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
              placeholder="Enter product name"
              required
            />
          </motion.div>

          {/* Category Dropdown */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Category</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
            >
              <option value="">Select Category</option>
              {categoriesList.length > 0 ? (
                categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories found</option>
              )}
            </select>
          </motion.div>

          {/* Unit */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Unit</label>
            <select
              name="unit"
              value={productData.unit}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
            >
              <option value="">Select Unit</option>
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="L">Liters (L)</option>
              <option value="g">Grams (g)</option>
              <option value="ml">Milliliters (ml)</option>
            </select>
          </motion.div>

          {/* Quantity In Stock */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Quantity in Stock</label>
            <input
              type="number"
              name="quantity_in_stock"
              value={productData.quantity_in_stock}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
              placeholder="0"
              required
            />
          </motion.div>

          {/* Reorder Threshold */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Reorder Threshold</label>
            <input
              type="number"
              name="reorder_threshold"
              value={productData.reorder_threshold}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
              placeholder="0"
              required
            />
          </motion.div>

          {/* Cost Per Unit (BHD 3 decimals) */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Cost per Unit (BHD)</label>
            <input
              type="number"
              name="cost_per_unit"
              step="0.001"
              value={productData.cost_per_unit}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
              placeholder="0.000"
              required
            />
          </motion.div>

          {/* Vendor Dropdown */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label>Vendor</label>
            <select
              name="vendor"
              value={productData.vendor}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1f1f1f] border border-gray-600 p-3 rounded mt-1"
            >
              <option value="">Select Vendor</option>
              {vendorsList.length > 0 ? (
                vendorsList.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))
              ) : (
                <option disabled>No vendors found</option>
              )}
            </select>
          </motion.div>

          {/* Submit */}
          <motion.div className="mt-6" variants={buttonVariants} whileHover="hover" whileTap="tap">
            <button
              type="submit"
              className={`w-full py-3 rounded font-bold ${productMutation.isPending
                  ? 'bg-yellow-400 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-500'
                } text-black`}
              disabled={productMutation.isPending}
            >
              {productMutation.isPending ? 'Adding...' : 'Add Product'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductModal;
