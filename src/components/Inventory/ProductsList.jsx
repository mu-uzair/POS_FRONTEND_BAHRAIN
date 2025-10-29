// import React, { useState } from "react";
// import { formatDateAndTme } from "../../utils/index";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { getAllProducts } from "../../https";
// import { getAllInventoryCategories } from "../../https";
// import { enqueueSnackbar } from "notistack";

// const ProductsList = () => {
//   // Fetch products using React Query
//   const { data: resData, isLoading, isError } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => await getAllProducts(),
//     placeholderData: keepPreviousData,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch products!", { variant: "error" });
//     },
//   });

//   // Use resData directly since it’s an array
//   const products = Array.isArray(resData) ? resData : [];

//   console.log("API resData:", resData, "Products:", products);

//   // Calculate summary stats
//   const totalProducts = products.length;
//   const lowStockCount = products.reduce(
//     (count, p) => count + (p.quantity_in_stock <= p.reorder_threshold ? 1 : 0),
//     0
//   );
//   const totalStockValue = products.reduce(
//     (sum, p) => sum + p.quantity_in_stock * p.cost_per_unit,
//     0
//   );

//   // Placeholder action handlers (for future edit/delete)
//   const handleEdit = (productId) => {
//     enqueueSnackbar("Edit functionality coming soon!", { variant: "info" });
//   };

//   const handleDelete = (productId) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       enqueueSnackbar("Delete functionality coming soon!", { variant: "info" });
//     }
//   };

//   return (
//     <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
//       <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Products</h2>

//       {/* Summary Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-[#1a1a1a] p-4 rounded-lg">
//         <div>
//           <p className="text-[#ababab]">Total Products</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">{totalProducts}</p>
//         </div>
//         <div>
//           <p className="text-[#ababab]">Low Stock Items</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">{lowStockCount}</p>
//         </div>
//         <div>
//           <p className="text-[#ababab]">Total Stock Value</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">BHD {totalStockValue.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-[#f5f5f5]">
//           <thead className="bg-[#333] text-[#ababab]">
//             <tr>
//               <th className="p-3">Name</th>
//               <th className="p-3">Unit</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Reorder Threshold</th>
//               <th className="p-3">Cost per Unit</th>
//               <th className="p-3">Vendor</th>
//               <th className="p-3">Created At</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="8" className="text-center text-gray-400 p-4">
//                   Loading products...
//                 </td>
//               </tr>
//             ) : products.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="text-center text-gray-400 p-4">
//                   No products found.
//                 </td>
//               </tr>
//             ) : (
//               products.map((product) => (
//                 <tr
//                   key={product._id}
//                   className={`border-b border-gray-600 hover:bg-[#333] ${
//                     product.quantity_in_stock <= product.reorder_threshold
//                       ? "bg-red-900/20"
//                       : ""
//                   }`}
//                 >
//                   <td className="p-4">{product.name}</td>
//                   <td className="p-4">{product.unit}</td>
//                   <td className="p-4">
//                     {product.quantity_in_stock}
//                     {product.quantity_in_stock <= product.reorder_threshold && (
//                       <span className="ml-2 text-red-400 text-xs font-semibold">
//                         Low
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-4">{product.reorder_threshold}</td>
//                   <td className="p-4">BHD {product.cost_per_unit.toFixed(2)}</td>
//                   <td className="p-4">{product.vendor?.name || "Unknown"}</td>
//                   <td className="p-4">{formatDateAndTme(product.createdAt)}</td>
//                   <td className="p-4 text-center flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(product._id)}
//                       className="text-blue-400 hover:text-blue-500 transition"
//                       title="Edit"
//                     >
//                       <FaEdit size={20} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="text-red-400 hover:text-red-500 transition"
//                       title="Delete"
//                     >
//                       <FaTrash size={20} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductsList;

// import React from "react";
// import { formatDateAndTme } from "../../utils/index";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { getAllProducts, getAllInventoryCategories } from "../../https";
// import { enqueueSnackbar } from "notistack";

// const ProductsList = () => {
//   // Fetch products
//   const {
//     data: resData,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => await getAllProducts(),
//     placeholderData: keepPreviousData,
//     onError: () => enqueueSnackbar("Failed to fetch products!", { variant: "error" }),
//   });

//   const products = Array.isArray(resData) ? resData : [];

//   // Fetch categories (to map IDs to names)
//   const { data: categoriesData } = useQuery({
//     queryKey: ["inventory-categories"],
//     queryFn: async () => await getAllInventoryCategories(),
//     placeholderData: keepPreviousData,
//   });

//   const categories = Array.isArray(categoriesData) ? categoriesData : [];
//   console.log("Fetched inventory Categories:", categories);

//   // Create a lookup map for category names
//   const categoryMap = categories.reduce((acc, cat) => {
//     acc[cat._id] = cat.name;
//     return acc;
//   }, {});
//   console.log("Category Map:", categoryMap);
//   // Summary stats
//   const totalProducts = products.length;
//   const lowStockCount = products.reduce(
//     (count, p) => count + (p.quantity_in_stock <= p.reorder_threshold ? 1 : 0),
//     0
//   );
//   const totalStockValue = products.reduce(
//     (sum, p) => sum + p.quantity_in_stock * p.cost_per_unit,
//     0
//   );

//   // Placeholder actions
//   const handleEdit = (productId) => {
//     enqueueSnackbar("Edit functionality coming soon!", { variant: "info" });
//   };

//   const handleDelete = (productId) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       enqueueSnackbar("Delete functionality coming soon!", { variant: "info" });
//     }
//   };

//   return (
//     <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
//       <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Products</h2>

//       {/* Summary Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-[#1a1a1a] p-4 rounded-lg">
//         <div>
//           <p className="text-[#ababab]">Total Products</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">{totalProducts}</p>
//         </div>
//         <div>
//           <p className="text-[#ababab]">Low Stock Items</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">{lowStockCount}</p>
//         </div>
//         <div>
//           <p className="text-[#ababab]">Total Stock Value</p>
//           <p className="text-[#f5f5f5] text-lg font-bold">
//             BHD {totalStockValue.toFixed(2)}
//           </p>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-[#f5f5f5]">
//           <thead className="bg-[#333] text-[#ababab]">
//             <tr>
//               <th className="p-3">Name</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">Unit</th>
//               <th className="p-3">Stock</th>
//               <th className="p-3">Reorder Threshold</th>
//               <th className="p-3">Cost per Unit</th>
//               <th className="p-3">Vendor</th>
//               <th className="p-3">Created At</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="9" className="text-center text-gray-400 p-4">
//                   Loading products...
//                 </td>
//               </tr>
//             ) : products.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="text-center text-gray-400 p-4">
//                   No products found.
//                 </td>
//               </tr>
//             ) : (
//               products.map((product) => {
//                 // Determine category name (from product or lookup map)
//                 // Safely get the category ID string. Handles { _id: '...' } or just '...'
//                 const categoryId = product.category?._id || product.category;

//                 const categoryName =
//                   product.category?.name || // 1. Try to get the name if the field is a populated object
//                   categoryMap[categoryId] || // 2. Use the extracted ID string for a reliable lookup in your map
//                   "Uncategorized";

//                 return (
//                   <tr
//                     key={product._id}
//                     className={`border-b border-gray-600 hover:bg-[#333] ${product.quantity_in_stock <= product.reorder_threshold
//                         ? "bg-red-900/20"
//                         : ""
//                       }`}
//                   >
//                     <td className="p-3">{product.name}</td>
//                     <td className="p-3">{categoryName}</td>
//                     <td className="p-3">{product.unit}</td>
//                     <td className="p-3">
//                       {product.quantity_in_stock}
//                       {product.quantity_in_stock <= product.reorder_threshold && (
//                         <span className="ml-2 text-red-400 text-xs font-semibold">
//                           Low
//                         </span>
//                       )}
//                     </td>
//                     <td className="p-3">{product.reorder_threshold}</td>
//                     <td className="p-3">BHD {product.cost_per_unit.toFixed(2)}</td>
//                     <td className="p-3">{product.vendor?.name || "Unknown"}</td>
//                     <td className="p-3">{formatDateAndTme(product.createdAt)}</td>
//                     <td className="p-3 flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(product._id)}
//                         className="text-blue-400 hover:text-blue-500 transition"
//                         title="Edit"
//                       >
//                         <FaEdit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product._id)}
//                         className="text-red-400 hover:text-red-500 transition"
//                         title="Delete"
//                       >
//                         <FaTrash size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Responsiveness */}
//       <style jsx>{`
//         @media (max-width: 768px) {
//           table {
//             font-size: 0.85rem;
//           }
//           th,
//           td {
//             padding: 0.5rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductsList;

import React from "react";
import { formatDateAndTme } from "../../utils/index";
import { FaEdit, FaTrash } from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProducts, getAllInventoryCategories } from "../../https";
import { enqueueSnackbar } from "notistack";

const ProductsList = () => {
  // Fetch products
  const {
    data: resData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getAllProducts(),
    placeholderData: keepPreviousData,
    onError: () => enqueueSnackbar("Failed to fetch products!", { variant: "error" }),
  });

  const products = Array.isArray(resData) ? resData : [];

  // Fetch categories (to map IDs to names)
  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories"],
    queryFn: async () => await getAllInventoryCategories(),
    placeholderData: keepPreviousData,
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Create a lookup map for category names
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat._id] = cat.name;
    return acc;
  }, {});

  // Summary stats
  const totalProducts = products.length;
  const lowStockCount = products.reduce(
    (count, p) => count + (p.quantity_in_stock <= p.reorder_threshold ? 1 : 0),
    0
  );
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.quantity_in_stock * p.cost_per_unit,
    0
  );

  // Placeholder actions
  const handleEdit = (productId) => {
    enqueueSnackbar("Edit functionality coming soon!", { variant: "info" });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      enqueueSnackbar("Delete functionality coming soon!", { variant: "info" });
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Products</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-[#1a1a1a] p-4 rounded-lg">
        <div>
          <p className="text-[#ababab]">Total Products</p>
          <p className="text-[#f5f5f5] text-lg font-bold">{totalProducts}</p>
        </div>
        <div>
          <p className="text-[#ababab]">Low Stock Items</p>
          <p className="text-[#f5f5f5] text-lg font-bold">{lowStockCount}</p>
        </div>
        <div>
          <p className="text-[#ababab]">Total Stock Value</p>
          <p className="text-[#f5f5f5] text-lg font-bold">
            BHD {totalStockValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reorder Threshold</th>
              <th className="p-3">Cost per Unit</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 p-4">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 p-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {

                // ✅ CORRECTED LOGIC: Extracts the string ID from the product object or field
                const categoryId = product.category?._id || product.category;

                // Determines the name: 1. Populated Name, 2. Lookup by ID, 3. Default
                const categoryName =
                  product.category?.name ||
                  categoryMap[categoryId] ||
                  "Uncategorized";

                return (
                  <tr
                    key={product._id}
                    className={`border-b border-gray-600 hover:bg-[#333] ${product.quantity_in_stock <= product.reorder_threshold
                      ? "bg-red-900/20"
                      : ""
                      }`}
                  >
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{categoryName}</td>
                    <td className="p-3">{product.unit}</td>
                    <td className="p-3">
                      {product.quantity_in_stock}
                      {product.quantity_in_stock <= product.reorder_threshold && (
                        <span className="ml-2 text-red-400 text-xs font-semibold">
                          Low
                        </span>
                      )}
                    </td>
                    <td className="p-3">{product.reorder_threshold}</td>
                    <td className="p-3">BHD {product.cost_per_unit.toFixed(3)}</td>
                    <td className="p-3">{product.vendor?.name || "Unknown"}</td>
                    <td className="p-3">{formatDateAndTme(product.createdAt)}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-blue-400 hover:text-blue-500 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsiveness */}
      <style jsx>{`
          @media (max-width: 768px) {
            table {
              font-size: 0.85rem;
            }
            th,
            td {
              padding: 0.5rem;
            }
          }
        `}</style>
    </div>
  );
};

export default ProductsList;
