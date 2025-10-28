// import React, { useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
//   adjustStock,
//   getAllVendors,
//   updateVendor,
//   deleteVendor,
// } from "../../https";
// import { enqueueSnackbar } from "notistack";
// import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

// const InventoryEditPanel = () => {
//   const queryClient = useQueryClient();
//   const [selectedOption, setSelectedOption] = useState("products");
//   const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
//   const [edits, setEdits] = useState({});
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   const [vendorSearchQuery, setVendorSearchQuery] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("");

//   // Fetch products
//   const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
//     queryKey: ["products"],
//     queryFn: getAllProducts,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch products!", { variant: "error" });
//     },
//   });

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
//     queryKey: ["vendors"],
//     queryFn: getAllVendors,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.log("Error fetching vendors:", error);
//       enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
//     },
//   });

//   // Extract data (updated to match the correct response structure)
//   const products = Array.isArray(productsData) ? productsData : [];
//   const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];

//   // Filter products
//   const filteredProducts = useMemo(() => {
//     let filtered = products;
//     if (productSearchQuery) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
//       );
//     }
//     if (selectedVendor) {
//       filtered = filtered.filter(
//         (product) => (product.vendor?._id || product.vendor) === selectedVendor
//       );
//     }
//     return filtered;
//   }, [products, productSearchQuery, selectedVendor]);

//   // Filter vendors
//   const filteredVendors = useMemo(() => {
//     let filtered = vendors;
//     if (vendorSearchQuery) {
//       filtered = filtered.filter((vendor) =>
//         vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   }, [vendors, vendorSearchQuery]);

//   // Mutation for updating a product
//   const updateProductMutation = useMutation({
//     mutationFn: updateProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update product!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a product
//   const deleteProductMutation = useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to delete product!", { variant: "error" });
//     },
//   });

//   // Mutation for adjusting stock
//   const adjustStockMutation = useMutation({
//     mutationFn: ({ id, data }) => adjustStock(id, data),
//     onSuccess: () => {
//       enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//       setStockAdjustment({ productId: null, type: null, quantity: "" });
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
//     },
//   });

//   // Mutation for updating a vendor
//   const updateVendorMutation = useMutation({
//     mutationFn: updateVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a vendor
//   const deleteVendorMutation = useMutation({
//     mutationFn: deleteVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
//     },
//   });

//   // Handle editing a field
//   const handleEditField = (entity, id, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: {
//           ...prev[entity]?.[id],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // Handle updating a record
//   const handleUpdate = (entity, id) => {
//     const updatedData = edits[entity]?.[id];
//     if (!updatedData) {
//       enqueueSnackbar("No changes to update!", { variant: "info" });
//       return;
//     }

//     const fullData = {
//       _id: id,
//       ...(entity === "product"
//         ? { name: products.find((p) => p._id === id).name }
//         : { name: vendors.find((v) => v._id === id).name }),
//       ...(entity === "product"
//         ? {
//           unit: products.find((p) => p._id === id).unit,
//           quantity_in_stock: products.find((p) => p._id === id).quantity_in_stock,
//           reorder_threshold: products.find((p) => p._id === id).reorder_threshold,
//           cost_per_unit: products.find((p) => p._id === id).cost_per_unit,
//           vendor: products.find((p) => p._id === id).vendor?._id || products.find((p) => p._id === id).vendor,
//         }
//         : {
//           contact: vendors.find((v) => v._id === id)?.contact || "",
//           address: vendors.find((v) => v._id === id)?.address || "",
//           notes: vendors.find((v) => v._id === id)?.notes || "",
//         }),
//       ...updatedData,
//     };

//     switch (entity) {
//       case "product":
//         updateProductMutation.mutate(fullData);
//         break;
//       case "vendor":
//         updateVendorMutation.mutate(fullData);
//         break;
//       default:
//         break;
//     }

//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: undefined,
//       },
//     }));
//   };

//   // Handle deleting a record
//   const handleDeleteRecord = (entity, id) => {
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       switch (entity) {
//         case "product":
//           deleteProductMutation.mutate(id);
//           break;
//         case "vendor":
//           deleteVendorMutation.mutate(id);
//           break;
//       }
//     }
//   };

//   // Handle stock adjustment
//   const handleStockAdjust = (productId, type) => {
//     setStockAdjustment({ productId, type, quantity: "" });
//   };

//   const handleStockSubmit = () => {
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
//       return;
//     }
//     adjustStockMutation.mutate({
//       id: stockAdjustment.productId,
//       data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
//     });
//   };

//   return (
//     <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
//       <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Edit Panel</h2>
//       <div className="flex gap-3 mb-4 flex-wrap">
//         <button
//           onClick={() => setSelectedOption("products")}
//           className={`px-4 py-2 rounded-lg ${selectedOption === "products" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
//             }`}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setSelectedOption("vendors")}
//           className={`px-4 py-2 rounded-lg ${selectedOption === "vendors" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
//             }`}
//         >
//           Vendors
//         </button>
//       </div>

//       {selectedOption === "products" && (
//         <div>
//           <div className="flex gap-4 mb-4 flex-wrap">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by product name..."
//                 value={productSearchQuery}
//                 onChange={(e) => setProductSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div className="min-w-[200px]">
//               <select
//                 value={selectedVendor}
//                 onChange={(e) => setSelectedVendor(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//               >
//                 <option value="">All Vendors</option>
//                 {vendors.map((vendor) => (
//                   <option key={vendor._id} value={vendor._id}>
//                     {vendor.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-[#f5f5f5]">
//               <thead className="bg-[#333] text-[#ababab]">
//                 <tr>
//                   <th className="pl-5 py-3">Name</th>
//                   <th className="pl-5 py-3">Unit</th>
//                   <th className="pl-5 py-3">Stock</th>
//                   <th className="pl-5 py-3">Reorder Threshold</th>
//                   <th className="pl-5 py-3">Cost per Unit</th>
//                   <th className="pl-5 py-3">Vendor</th>
//                   <th className="p-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productsLoading ? (
//                   <tr>
//                     <td colSpan="7" className="text-center text-gray-400 py-4">
//                       <svg
//                         className="animate-spin h-5 w-5 text-gray-400 mx-auto"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8H4z"
//                         />
//                       </svg>
//                       Loading products...
//                     </td>
//                   </tr>
//                 ) : productsError ? (
//                   <tr>
//                     <td colSpan="7" className="text-center text-gray-400 py-4">
//                       Failed to load products.
//                     </td>
//                   </tr>
//                 ) : filteredProducts.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center text-gray-400 py-4">
//                       No products found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredProducts.map((product) => (
//                     <tr key={product._id} className="border-b border-gray-600 hover:bg-[#333]">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={product.name}
//                           onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <select
//                           defaultValue={product.unit}
//                           onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         >
//                           <option value="pcs">pcs</option>
//                           <option value="kg">kg</option>
//                           <option value="L">L</option>
//                         </select>
//                       </td>
//                       <td className="py-3 pl-5">{product.quantity_in_stock}</td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="number"
//                           defaultValue={product.reorder_threshold}
//                           onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="number"
//                           defaultValue={product.cost_per_unit}
//                           onChange={(e) => handleEditField("product", product._id, "cost_per_unit", Number(e.target.value))}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <select
//                           defaultValue={product.vendor?._id || product.vendor}
//                           onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         >
//                           <option value="">Select Vendor</option>
//                           {vendors.map((vendor) => (
//                             <option key={vendor._id} value={vendor._id}>
//                               {vendor.name}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="py-3 px-3 text-center flex justify-center gap-1 flex-wrap">
//                         <button
//                           onClick={() => handleUpdate("product", product._id)}
//                           className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                           title="Update"
//                           disabled={updateProductMutation.isLoading}
//                         >
//                           {updateProductMutation.isLoading && updateProductMutation.variables?._id === product._id ? (
//                             <svg
//                               className="animate-spin h-5 w-5 text-blue-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8H4z"
//                               />
//                             </svg>
//                           ) : (
//                             <FiEdit size={20} />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleDeleteRecord("product", product._id)}
//                           className="text-red-500 hover:text-red-600 transition-colors duration-200"
//                           title="Delete"
//                           disabled={deleteProductMutation.isLoading}
//                         >
//                           {deleteProductMutation.isLoading && deleteProductMutation.variables === product._id ? (
//                             <svg
//                               className="animate-spin h-5 w-5 text-red-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8H4z"
//                               />
//                             </svg>
//                           ) : (
//                             <FiTrash2 size={20} />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleStockAdjust(product._id, "in")}
//                           className="text-green-500 hover:text-green-600 transition-colors duration-200"
//                           title="Stock In"
//                           disabled={adjustStockMutation.isLoading}
//                         >
//                           <FiArrowUpCircle size={30} />
//                         </button>
//                         <button
//                           onClick={() => handleStockAdjust(product._id, "out")}
//                           className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
//                           title="Stock Out"
//                           disabled={adjustStockMutation.isLoading}
//                         >
//                           <FiArrowDownCircle size={30} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {selectedOption === "vendors" && (
//         <div>
//           <div className="flex gap-4 mb-4 flex-wrap">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by vendor name..."
//                 value={vendorSearchQuery}
//                 onChange={(e) => setVendorSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-[#f5f5f5]">
//               <thead className="bg-[#333] text-[#ababab]">
//                 <tr>
//                   <th className="pl-5 py-3">Name</th>
//                   <th className="pl-5 py-3">Contact</th>
//                   <th className="pl-5 py-3">Address</th>
//                   <th className="pl-5 py-3">Notes</th>
//                   <th className="p-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {vendorsLoading ? (
//                   <tr>
//                     <td colSpan="5" className="text-center text-gray-400 py-4">
//                       <svg
//                         className="animate-spin h-5 w-5 text-gray-400 mx-auto"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8H4z"
//                         />
//                       </svg>
//                       Loading vendors...
//                     </td>
//                   </tr>
//                 ) : vendorsError ? (
//                   <tr>
//                     <td colSpan="5" className="text-center text-gray-400 py-4">
//                       Failed to load vendors.
//                     </td>
//                   </tr>
//                 ) : filteredVendors.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center text-gray-400 py-4">
//                       No vendors found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredVendors.map((vendor) => (
//                     <tr key={vendor._id} className="border-b border-gray-600 hover:bg-[#333]">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.name || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.contact || ""}
//                           placeholder="Not provided"
//                           onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.address || ""}
//                           placeholder="Not provided"
//                           onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <textarea
//                           defaultValue={vendor.notes || ""}
//                           placeholder="Not provided"
//                           onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
//                           className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
//                           rows="2"
//                         />
//                       </td>
//                       <td className="py-3 px-3 text-center flex justify-center gap-1">
//                         <button
//                           onClick={() => handleUpdate("vendor", vendor._id)}
//                           className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
//                           title="Update"
//                           disabled={updateVendorMutation.isLoading}
//                         >
//                           {updateVendorMutation.isLoading && updateVendorMutation.variables?._id === vendor._id ? (
//                             <svg
//                               className="animate-spin h-5 w-5 text-blue-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8H4z"
//                               />
//                             </svg>
//                           ) : (
//                             <FiEdit size={20} />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleDeleteRecord("vendor", vendor._id)}
//                           className="text-red-500 hover:text-red-600 transition-colors duration-200"
//                           title="Delete"
//                           disabled={deleteVendorMutation.isLoading}
//                         >
//                           {deleteVendorMutation.isLoading && deleteVendorMutation.variables === vendor._id ? (
//                             <svg
//                               className="animate-spin h-5 w-5 text-red-500"
//                               xmlns="http://www.w3.org/2000/svg"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8v8H4z"
//                               />
//                             </svg>
//                           ) : (
//                             <FiTrash2 size={20} />
//                           )}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {stockAdjustment.productId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-[#262626] p-6 rounded-lg w-full max-w-sm">
//             <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
//               {stockAdjustment.type === "in" ? "Stock In" : "Stock Out"}
//             </h2>
//             <div className="mb-4">
//               <label className="block text-[#ababab] mb-1">Quantity</label>
//               <input
//                 type="number"
//                 value={stockAdjustment.quantity}
//                 onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none"
//                 min="1"
//                 required
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
//                 className="px-4 py-2 bg-gray-600 text-[#f5f5f5] rounded-lg hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStockSubmit}
//                 className="px-4 py-2 bg-blue-600 text-[#f5f5f5] rounded-lg hover:bg-blue-700"
//                 disabled={adjustStockMutation.isLoading}
//               >
//                 {adjustStockMutation.isLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5 text-[#f5f5f5] inline-block"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8H4z"
//                     />
//                   </svg>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryEditPanel;

// import React, { useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
//   adjustStock,
//   getAllVendors,
//   updateVendor,
//   deleteVendor,
//   getAllInventoryCategories,
//    updateInventoryCategory,
//   deleteInventoryCategory
// } from "../../https";
// import { enqueueSnackbar } from "notistack";
// import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

// // Import the new DishRecipeEditPanel component
// // NOTE: Adjust the path if necessary
// import DishRecipeEditPanel from "../Inventory/dishRecipeEditPanel"; 

// // --- MOCK API/DATA STUBS for Categories (REPLACE WITH REAL IMPORTS) ---
// const mockCategories = [
//     { _id: "cat_1", name: "Main Dishes" },
//     { _id: "cat_2", name: "Desserts" },
//     { _id: "cat_3", name: "Beverages" },
// ];
// const mockGetCategories = async () => ({ data: { data: mockCategories } });
// const mockUpdateCategory = async (data) => new Promise(resolve => setTimeout(() => resolve(), 500));
// const mockDeleteCategory = async (id) => new Promise(resolve => setTimeout(() => resolve(), 500));
// // --- END MOCK STUBS ---

// const InventoryEditPanel = () => {
//   const queryClient = useQueryClient();
//   // Added 'categories' and 'dishRecipes' to the options
//   const [selectedOption, setSelectedOption] = useState("products"); 
//   const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
//   const [edits, setEdits] = useState({});
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   const [vendorSearchQuery, setVendorSearchQuery] = useState("");
//   const [categorySearchQuery, setCategorySearchQuery] = useState(""); // New state for category search
//   const [selectedVendor, setSelectedVendor] = useState("");

//   // Fetch products
//   const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
//     queryKey: ["products"],
//     queryFn: getAllProducts,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch products!", { variant: "error" });
//     },
//   });

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
//     queryKey: ["vendors"],
//     queryFn: getAllVendors,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.log("Error fetching vendors:", error);
//       enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
//     },
//   });

//   // 🔹 Fetch Categories (New Query)
//   const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
//     queryKey: ["categories"],
//     // queryFn: getCategories, // Use your actual function here
//     queryFn: mockGetCategories,
//     staleTime: 5 * 60 * 1000,
//     onError: () => {
//         enqueueSnackbar("Failed to fetch categories!", { variant: "error" });
//     },
//   });

//   // Extract data (updated to match the correct response structure)
//   const products = Array.isArray(productsData) ? productsData : [];
//   const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];
//   const categories = Array.isArray(categoriesData?.data?.data) ? categoriesData.data.data : []; // Adjusted path for category mock

//   // Filter products (Existing logic)
//   const filteredProducts = useMemo(() => {
//     let filtered = products;
//     if (productSearchQuery) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
//       );
//     }
//     if (selectedVendor) {
//       filtered = filtered.filter(
//         (product) => (product.vendor?._id || product.vendor) === selectedVendor
//       );
//     }
//     return filtered;
//   }, [products, productSearchQuery, selectedVendor]);

//   // Filter vendors (Existing logic)
//   const filteredVendors = useMemo(() => {
//     let filtered = vendors;
//     if (vendorSearchQuery) {
//       filtered = filtered.filter((vendor) =>
//         vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   }, [vendors, vendorSearchQuery]);

//   // 🔹 Filter Categories (New logic)
//   const filteredCategories = useMemo(() => {
//     if (!categorySearchQuery) return categories;
//     return categories.filter((category) =>
//         category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
//     );
//   }, [categories, categorySearchQuery]);


//   // Mutation for updating a product (Existing logic)
//   const updateProductMutation = useMutation({
//     mutationFn: updateProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update product!", { variant: "error" });
//     },
//   });

//   // ... (Other mutations: deleteProductMutation, adjustStockMutation) - Existing logic
//     // Mutation for deleting a product
//     const deleteProductMutation = useMutation({
//         mutationFn: deleteProduct,
//         onSuccess: () => {
//           enqueueSnackbar("Product deleted successfully!", { variant: "success" });
//           queryClient.invalidateQueries(["products"]);
//         },
//         onError: () => {
//           enqueueSnackbar("Failed to delete product!", { variant: "error" });
//         },
//       });

//       // Mutation for adjusting stock
//       const adjustStockMutation = useMutation({
//         mutationFn: ({ id, data }) => adjustStock(id, data),
//         onSuccess: () => {
//           enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
//           queryClient.invalidateQueries(["products"]);
//           setStockAdjustment({ productId: null, type: null, quantity: "" });
//         },
//         onError: (error) => {
//           enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
//         },
//       });

//   // Mutation for updating a vendor (Existing logic)
//   const updateVendorMutation = useMutation({
//     mutationFn: updateVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a vendor (Existing logic)
//   const deleteVendorMutation = useMutation({
//     mutationFn: deleteVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
//     },
//   });

//   // 🔹 Mutation for updating a category (New Mutation)
//   const updateCategoryMutation = useMutation({
//     // mutationFn: updateCategory, // Use your actual function here
//     mutationFn: mockUpdateCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["categories"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to update category!", { variant: "error" });
//     },
//   });

//   // 🔹 Mutation for deleting a category (New Mutation)
//   const deleteCategoryMutation = useMutation({
//     // mutationFn: deleteCategory, // Use your actual function here
//     mutationFn: mockDeleteCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["categories"]);
//       queryClient.invalidateQueries(["dishes"]); // Invalidate dishes too, as categories affect them
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete category!", { variant: "error" });
//     },
//   });

//   // Handle editing a field (Existing logic)
//   const handleEditField = (entity, id, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: {
//           ...prev[entity]?.[id],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // Handle updating a record (Modified to include 'category')
//   const handleUpdate = (entity, id) => {
//     const updatedData = edits[entity]?.[id];
//     if (!updatedData) {
//       enqueueSnackbar("No changes to update!", { variant: "info" });
//       return;
//     }

//     let fullData = { _id: id, ...updatedData };

//     // Add existing fields not being edited to fullData payload
//     switch (entity) {
//         case "product":
//             const product = products.find((p) => p._id === id);
//             fullData = { ...product, ...fullData, vendor: product.vendor?._id || product.vendor };
//             updateProductMutation.mutate(fullData);
//             break;
//         case "vendor":
//             const vendor = vendors.find((v) => v._id === id);
//             fullData = { ...vendor, ...fullData };
//             updateVendorMutation.mutate(fullData);
//             break;
//         case "category":
//             const category = categories.find((c) => c._id === id);
//             fullData = { ...category, ...fullData };
//             updateCategoryMutation.mutate(fullData);
//             break;
//         default:
//             break;
//     }

//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: undefined,
//       },
//     }));
//   };

//   // Handle deleting a record (Modified to include 'category')
//   const handleDeleteRecord = (entity, id) => {
//     if (window.confirm(`Are you sure you want to delete this ${entity}?`)) {
//       switch (entity) {
//         case "product":
//           deleteProductMutation.mutate(id);
//           break;
//         case "vendor":
//           deleteVendorMutation.mutate(id);
//           break;
//         case "category":
//           deleteCategoryMutation.mutate(id);
//           break;
//       }
//     }
//   };

//   // Handle stock adjustment (Existing logic)
//   const handleStockAdjust = (productId, type) => {
//     setStockAdjustment({ productId, type, quantity: "" });
//   };

//   const handleStockSubmit = () => {
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
//       return;
//     }
//     adjustStockMutation.mutate({
//       id: stockAdjustment.productId,
//       data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
//     });
//   };


// import React, { useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
//   adjustStock,
//   getAllVendors,
//   updateVendor,
//   deleteVendor,
//   getAllInventoryCategories,
//   updateInventoryCategory,
//   deleteInventoryCategory
// } from "../../https";
// import { enqueueSnackbar } from "notistack";
// import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

// // Import the new DishRecipeEditPanel component
// import DishRecipeEditPanel from "../Inventory/dishRecipeEditPanel"; 

// const InventoryEditPanel = () => {
//   const queryClient = useQueryClient();
//   // Added 'categories' and 'dishRecipes' to the options
//   const [selectedOption, setSelectedOption] = useState("products"); 
//   const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
//   const [edits, setEdits] = useState({});
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   const [vendorSearchQuery, setVendorSearchQuery] = useState("");
//   const [categorySearchQuery, setCategorySearchQuery] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("");

//   // Fetch products
//   const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
//     queryKey: ["products"],
//     queryFn: getAllProducts,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch products!", { variant: "error" });
//     },
//   });

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
//     queryKey: ["vendors"],
//     queryFn: getAllVendors,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.log("Error fetching vendors:", error);
//       enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
//     },
//   });

//   // Fetch Inventory Categories (Real API)
//   const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
//     queryKey: ["inventoryCategories"],
//     queryFn: getAllInventoryCategories,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch categories!", { variant: "error" });
//     },
//   });
// console.log("Inventory Categories Data:", categoriesData);
//   // Extract data
//   const products = Array.isArray(productsData) ? productsData : [];
//   const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];
//   // const categories = Array.isArray(categoriesData?.data?.data) ? categoriesData.data.data : [];

// const categories = Array.isArray(categoriesData)
//   ? categoriesData
//   : [];


//   // Filter products
//   const filteredProducts = useMemo(() => {
//     let filtered = products;
//     if (productSearchQuery) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
//       );
//     }
//     if (selectedVendor) {
//       filtered = filtered.filter(
//         (product) => (product.vendor?._id || product.vendor) === selectedVendor
//       );
//     }
//     return filtered;
//   }, [products, productSearchQuery, selectedVendor]);

//   // Filter vendors
//   const filteredVendors = useMemo(() => {
//     let filtered = vendors;
//     if (vendorSearchQuery) {
//       filtered = filtered.filter((vendor) =>
//         vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   }, [vendors, vendorSearchQuery]);

//   // Filter Categories
//   const filteredCategories = useMemo(() => {
//     if (!categorySearchQuery) return categories;
//     return categories.filter((category) =>
//       category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
//     );
//   }, [categories, categorySearchQuery]);

//   // Mutation for updating a product
//   const updateProductMutation = useMutation({
//     mutationFn: updateProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update product!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a product
//   const deleteProductMutation = useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to delete product!", { variant: "error" });
//     },
//   });

//   // Mutation for adjusting stock
//   const adjustStockMutation = useMutation({
//     mutationFn: ({ id, data }) => adjustStock(id, data),
//     onSuccess: () => {
//       enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//       setStockAdjustment({ productId: null, type: null, quantity: "" });
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
//     },
//   });

//   // Mutation for updating a vendor
//   const updateVendorMutation = useMutation({
//     mutationFn: updateVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a vendor
//   const deleteVendorMutation = useMutation({
//     mutationFn: deleteVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for updating a category (Real API)
//   const updateCategoryMutation = useMutation({
//     mutationFn: updateInventoryCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["inventoryCategories"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to update category!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a category (Real API)
//   const deleteCategoryMutation = useMutation({
//     mutationFn: deleteInventoryCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["inventoryCategories"]);
//       queryClient.invalidateQueries(["products"]); // Invalidate products as categories might affect them
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete category!", { variant: "error" });
//     },
//   });

//   // Handle editing a field
//   const handleEditField = (entity, id, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: {
//           ...prev[entity]?.[id],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // Handle updating a record
//   const handleUpdate = (entity, id) => {
//     const updatedData = edits[entity]?.[id];
//     if (!updatedData) {
//       enqueueSnackbar("No changes to update!", { variant: "info" });
//       return;
//     }

//     let fullData = { _id: id, ...updatedData };

//     // Add existing fields not being edited to fullData payload
//     switch (entity) {
//       case "product":
//         const product = products.find((p) => p._id === id);
//         fullData = { ...product, ...fullData, vendor: product.vendor?._id || product.vendor };
//         updateProductMutation.mutate(fullData);
//         break;
//       case "vendor":
//         const vendor = vendors.find((v) => v._id === id);
//         fullData = { ...vendor, ...fullData };
//         updateVendorMutation.mutate(fullData);
//         break;
//       case "category":
//         const category = categories.find((c) => c._id === id);
//         fullData = { ...category, ...fullData };
//         updateCategoryMutation.mutate(fullData);
//         break;
//       default:
//         break;
//     }

//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: undefined,
//       },
//     }));
//   };

//   // Handle deleting a record
//   const handleDeleteRecord = (entity, id) => {
//     if (window.confirm(`Are you sure you want to delete this ${entity}?`)) {
//       switch (entity) {
//         case "product":
//           deleteProductMutation.mutate(id);
//           break;
//         case "vendor":
//           deleteVendorMutation.mutate(id);
//           break;
//         case "category":
//           deleteCategoryMutation.mutate(id);
//           break;
//       }
//     }
//   };

//   // Handle stock adjustment
//   const handleStockAdjust = (productId, type) => {
//     setStockAdjustment({ productId, type, quantity: "" });
//   };

//   const handleStockSubmit = () => {
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
//       return;
//     }
//     adjustStockMutation.mutate({
//       id: stockAdjustment.productId,
//       data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
//     });
//   };
//   return (
//     <div className="container mx-auto bg-[#262626] p-6 rounded-xl shadow-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
//       <h2 className="text-white text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
//         Inventory & Menu Management Panel
//       </h2>

//       {/* Tab Navigation */}
//       <div className="flex gap-3 mb-6 flex-wrap border-b border-gray-700 pb-2">
//         <button
//           onClick={() => setSelectedOption("products")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "products" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setSelectedOption("vendors")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "vendors" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Vendors
//         </button>
//         <button
//           onClick={() => setSelectedOption("categories")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "categories" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Categories
//         </button>
//         <button
//           onClick={() => setSelectedOption("dishRecipes")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "dishRecipes" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Dish Recipes
//         </button>
//       </div>

//       {/* --- Products Panel --- */}
//       {selectedOption === "products" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Products</h3>
//           <div className="flex gap-4 mb-6 flex-wrap">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by product name..."
//                 value={productSearchQuery}
//                 onChange={(e) => setProductSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//             <div className="min-w-[200px]">
//               <select
//                 value={selectedVendor}
//                 onChange={(e) => setSelectedVendor(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               >
//                 <option value="">All Vendors</option>
//                 {vendors.map((vendor) => (
//                   <option key={vendor._id} value={vendor._id}>
//                     {vendor.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Unit</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Stock</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Reorder Threshold</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Cost per Unit</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Vendor</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Loading/Error/Data rows */}
//                 {productsLoading ? (
//                   <tr><td colSpan="7" className="text-center text-gray-400 py-6">Loading products...</td></tr>
//                 ) : productsError ? (
//                   <tr><td colSpan="7" className="text-center text-red-400 py-6">Failed to load products.</td></tr>
//                 ) : filteredProducts.length === 0 ? (
//                   <tr><td colSpan="7" className="text-center text-gray-400 py-6">No products found.</td></tr>
//                 ) : (
//                   filteredProducts.map((product) => (
//                     <tr key={product._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={product.name}
//                           onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <select
//                           defaultValue={product.unit}
//                           onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         >
//                           <option value="pcs">pcs</option>
//                           <option value="kg">kg</option>
//                           <option value="L">L</option>
//                         </select>
//                       </td>
//                       <td className="py-3 pl-5 text-lg font-bold">{product.quantity_in_stock}</td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="number"
//                           defaultValue={product.reorder_threshold}
//                           onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="number"
//                           defaultValue={product.cost_per_unit}
//                           onChange={(e) => handleEditField("product", product._id, "cost_per_unit", Number(e.target.value))}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <select
//                           defaultValue={product.vendor?._id || product.vendor}
//                           onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         >
//                           <option value="">Select Vendor</option>
//                           {vendors.map((vendor) => (
//                             <option key={vendor._id} value={vendor._id}>
//                               {vendor.name}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       <td className="py-3 px-3 text-center whitespace-nowrap">
//                         <div className="flex justify-center gap-2 items-center">
//                           <button
//                             onClick={() => handleUpdate("product", product._id)}
//                             className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Update"
//                             disabled={updateProductMutation.isLoading}
//                           >
//                             <FiEdit size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteRecord("product", product._id)}
//                             className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Delete"
//                             disabled={deleteProductMutation.isLoading}
//                           >
//                             <FiTrash2 size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleStockAdjust(product._id, "in")}
//                             className="text-green-500 hover:text-green-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Stock In"
//                             disabled={adjustStockMutation.isLoading}
//                           >
//                             <FiArrowUpCircle size={24} />
//                           </button>
//                           <button
//                             onClick={() => handleStockAdjust(product._id, "out")}
//                             className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Stock Out"
//                             disabled={adjustStockMutation.isLoading}
//                           >
//                             <FiArrowDownCircle size={24} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Vendors Panel --- */}
//       {selectedOption === "vendors" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Vendors</h3>
//           {/* Vendor search input */}
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by vendor name..."
//                 value={vendorSearchQuery}
//                 onChange={(e) => setVendorSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//           </div>
//           {/* Vendors table (omitted for brevity, assume existing implementation) */}
//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Contact</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Address</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Notes</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Vendors rows */}
//                 {vendorsLoading ? (
//                   <tr><td colSpan="5" className="text-center text-gray-400 py-6">Loading vendors...</td></tr>
//                 ) : vendorsError ? (
//                   <tr><td colSpan="5" className="text-center text-red-400 py-6">Failed to load vendors.</td></tr>
//                 ) : filteredVendors.length === 0 ? (
//                   <tr><td colSpan="5" className="text-center text-gray-400 py-6">No vendors found.</td></tr>
//                 ) : (
//                   filteredVendors.map((vendor) => (
//                     <tr key={vendor._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.name || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.contact || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.address || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <textarea
//                           defaultValue={vendor.notes || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           rows="2"
//                         />
//                       </td>
//                       <td className="py-3 px-3 text-center whitespace-nowrap">
//                         <div className="flex justify-center gap-2 items-center">
//                           <button
//                             onClick={() => handleUpdate("vendor", vendor._id)}
//                             className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Update"
//                             disabled={updateVendorMutation.isLoading}
//                           >
//                             <FiEdit size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteRecord("vendor", vendor._id)}
//                             className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Delete"
//                             disabled={deleteVendorMutation.isLoading}
//                           >
//                             <FiTrash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Categories Panel (New) --- */}
//       {selectedOption === "categories" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Categories</h3>
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by category name..."
//                 value={categorySearchQuery}
//                 onChange={(e) => setCategorySearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categoriesLoading ? (
//                   <tr><td colSpan="2" className="text-center text-gray-400 py-6">Loading categories...</td></tr>
//                 ) : categoriesError ? (
//                   <tr><td colSpan="2" className="text-center text-red-400 py-6">Failed to load categories.</td></tr>
//                 ) : filteredCategories.length === 0 ? (
//                   <tr><td colSpan="2" className="text-center text-gray-400 py-6">No categories found.</td></tr>
//                 ) : (
//                   filteredCategories.map((category) => (
//                     <tr key={category._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={category.name || ""}
//                           onChange={(e) => handleEditField("category", category._id, "name", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 px-3 text-center whitespace-nowrap">
//                         <div className="flex justify-center gap-2 items-center">
//                           <button
//                             onClick={() => handleUpdate("category", category._id)}
//                             className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Update"
//                             disabled={updateCategoryMutation.isLoading}
//                           >
//                             <FiEdit size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteRecord("category", category._id)}
//                             className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Delete"
//                             disabled={deleteCategoryMutation.isLoading}
//                           >
//                             <FiTrash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Dish Recipes Panel (New Component) --- */}
//       {selectedOption === "dishRecipes" && (
//         <>
//             <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Dish Recipes</h3>
//             <DishRecipeEditPanel />
//         </>
//       )}

//       {/* Stock Adjustment Modal (Existing logic) */}
//       {stockAdjustment.productId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="bg-[#262626] p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-700">
//             <h2 className="text-white text-xl font-semibold mb-4 border-b border-gray-700 pb-3">
//               {stockAdjustment.type === "in" ? "Stock In" : "Stock Out"}
//             </h2>
//             <div className="mb-4">
//               <label className="block text-gray-400 mb-2">Quantity</label>
//               <input
//                 type="number"
//                 value={stockAdjustment.quantity}
//                 onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//                 min="0.01"
//                 step="any"
//                 required
//               />
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 disabled={adjustStockMutation.isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStockSubmit}
//                 className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
//                 disabled={adjustStockMutation.isLoading}
//               >
//                 {adjustStockMutation.isLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5 text-white inline-block"
//                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
//                   </svg>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryEditPanel;


// import React, { useState, useMemo } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
//   adjustStock,
//   getAllVendors,
//   updateVendor,
//   deleteVendor,
//   getAllInventoryCategories,
//   updateInventoryCategory,
//   deleteInventoryCategory
// } from "../../https";
// import { enqueueSnackbar } from "notistack";
// import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

// // Import the new DishRecipeEditPanel component
// import DishRecipeEditPanel from "../Inventory/dishRecipeEditPanel";

// const InventoryEditPanel = () => {
//   const queryClient = useQueryClient();
//   // Added 'categories' and 'dishRecipes' to the options
//   const [selectedOption, setSelectedOption] = useState("products");
//   const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
//   const [edits, setEdits] = useState({});
//   const [productSearchQuery, setProductSearchQuery] = useState("");
//   const [vendorSearchQuery, setVendorSearchQuery] = useState("");
//   const [categorySearchQuery, setCategorySearchQuery] = useState("");
//   const [selectedVendor, setSelectedVendor] = useState("");
//   // Added state for category filtering
//   const [selectedCategory, setSelectedCategory] = useState("");

//   // Fetch products
//   const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
//     queryKey: ["products"],
//     queryFn: getAllProducts,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch products!", { variant: "error" });
//     },
//   });

//   // Fetch vendors
//   const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
//     queryKey: ["vendors"],
//     queryFn: getAllVendors,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.log("Error fetching vendors:", error);
//       enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
//     },
//   });

//   // Fetch Inventory Categories (Real API)
//   const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
//     queryKey: ["inventoryCategories"],
//     queryFn: getAllInventoryCategories,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     onError: () => {
//       enqueueSnackbar("Failed to fetch categories!", { variant: "error" });
//     },
//   });

//   // Extract data
//   const products = Array.isArray(productsData) ? productsData : [];
//   const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];
//   const categories = Array.isArray(categoriesData) ? categoriesData : [];

//   // Create a lookup map for category names (for displaying in the Products table)
//   const categoryMap = useMemo(() => {
//     return categories.reduce((acc, cat) => {
//       acc[cat._id] = cat.name;
//       return acc;
//     }, {});
//   }, [categories]);


//   // Filter products
//   const filteredProducts = useMemo(() => {
//     let filtered = products;
//     if (productSearchQuery) {
//       filtered = filtered.filter((product) =>
//         product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
//       );
//     }
//     if (selectedVendor) {
//       filtered = filtered.filter(
//         (product) => (product.vendor?._id || product.vendor) === selectedVendor
//       );
//     }
//     // Filter by selected category
//     if (selectedCategory) {
//       filtered = filtered.filter(
//         (product) => (product.category?._id || product.category) === selectedCategory
//       );
//     }
//     return filtered;
//   }, [products, productSearchQuery, selectedVendor, selectedCategory]);

//   // Filter vendors
//   const filteredVendors = useMemo(() => {
//     let filtered = vendors;
//     if (vendorSearchQuery) {
//       filtered = filtered.filter((vendor) =>
//         vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
//       );
//     }
//     return filtered;
//   }, [vendors, vendorSearchQuery]);

//   // Filter Categories
//   const filteredCategories = useMemo(() => {
//     if (!categorySearchQuery) return categories;
//     return categories.filter((category) =>
//       category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
//     );
//   }, [categories, categorySearchQuery]);

//   // Mutation for updating a product
//   const updateProductMutation = useMutation({
//     mutationFn: updateProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update product!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a product
//   const deleteProductMutation = useMutation({
//     mutationFn: deleteProduct,
//     onSuccess: () => {
//       enqueueSnackbar("Product deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to delete product!", { variant: "error" });
//     },
//   });

//   // Mutation for adjusting stock
//   const adjustStockMutation = useMutation({
//     mutationFn: ({ id, data }) => adjustStock(id, data),
//     onSuccess: () => {
//       enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["products"]);
//       setStockAdjustment({ productId: null, type: null, quantity: "" });
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
//     },
//   });

//   // Mutation for updating a vendor
//   const updateVendorMutation = useMutation({
//     mutationFn: updateVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a vendor
//   const deleteVendorMutation = useMutation({
//     mutationFn: deleteVendor,
//     onSuccess: () => {
//       enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["vendors"]);
//       queryClient.invalidateQueries(["products"]);
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
//     },
//   });

//   // Mutation for updating a category (Real API)
//   const updateCategoryMutation = useMutation({
//     mutationFn: updateInventoryCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["inventoryCategories"]);
//       queryClient.invalidateQueries(["products"]); // Products might need name lookup updated
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to update category!", { variant: "error" });
//     },
//   });

//   // Mutation for deleting a category (Real API)
//   const deleteCategoryMutation = useMutation({
//     mutationFn: deleteInventoryCategory,
//     onSuccess: () => {
//       enqueueSnackbar("Category deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["inventoryCategories"]);
//       queryClient.invalidateQueries(["products"]); // Invalidate products as categories might affect them
//     },
//     onError: (error) => {
//       enqueueSnackbar(error.response?.data?.message || "Failed to delete category!", { variant: "error" });
//     },
//   });

//   // Handle editing a field
//   const handleEditField = (entity, id, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: {
//           ...prev[entity]?.[id],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // Handle updating a record
//   const handleUpdate = (entity, id) => {
//     const updatedData = edits[entity]?.[id];
//     if (!updatedData) {
//       enqueueSnackbar("No changes to update!", { variant: "info" });
//       return;
//     }

//     let fullData = { _id: id, ...updatedData };

//     // Add existing fields not being edited to fullData payload
//     switch (entity) {
//       case "product":
//         const product = products.find((p) => p._id === id);

//         // Extract original IDs for fields not being edited, prioritizing edits over original values
//         const categoryId = updatedData.category || product.category?._id || product.category;
//         const vendorId = updatedData.vendor || product.vendor?._id || product.vendor;

//         // Merge old data, new edits, and ensure foreign keys are IDs
//         fullData = {
//           ...product,
//           ...fullData, // Spreads { _id: id, ...updatedData }, overwriting product fields
//           category: categoryId,
//           vendor: vendorId,
//         };
//         updateProductMutation.mutate(fullData);
//         break;
//       case "vendor":
//         const vendor = vendors.find((v) => v._id === id);
//         fullData = { ...vendor, ...fullData };
//         updateVendorMutation.mutate(fullData);
//         break;
//       case "category":
//         const category = categories.find((c) => c._id === id);
//         fullData = { ...category, ...fullData };
//         updateCategoryMutation.mutate(fullData);
//         break;
//       default:
//         break;
//     }

//     setEdits((prev) => ({
//       ...prev,
//       [entity]: {
//         ...prev[entity],
//         [id]: undefined,
//       },
//     }));
//   };

//   // Handle deleting a record
//   const handleDeleteRecord = (entity, id) => {
//     if (window.confirm(`Are you sure you want to delete this ${entity}?`)) {
//       switch (entity) {
//         case "product":
//           deleteProductMutation.mutate(id);
//           break;
//         case "vendor":
//           deleteVendorMutation.mutate(id);
//           break;
//         case "category":
//           deleteCategoryMutation.mutate(id);
//           break;
//       }
//     }
//   };

//   // Handle stock adjustment
//   const handleStockAdjust = (productId, type) => {
//     setStockAdjustment({ productId, type, quantity: "" });
//   };

//   const handleStockSubmit = () => {
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
//       return;
//     }
//     adjustStockMutation.mutate({
//       id: stockAdjustment.productId,
//       data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
//     });
//   };
//   return (
//     <div className="container mx-auto bg-[#262626] p-6 rounded-xl shadow-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
//       <h2 className="text-white text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
//         Inventory & Menu Management Panel
//       </h2>

//       {/* Tab Navigation */}
//       <div className="flex gap-3 mb-6 flex-wrap border-b border-gray-700 pb-2">
//         <button
//           onClick={() => setSelectedOption("products")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "products" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setSelectedOption("vendors")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "vendors" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Vendors
//         </button>
//         <button
//           onClick={() => setSelectedOption("categories")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "categories" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Categories
//         </button>
//         <button
//           onClick={() => setSelectedOption("dishRecipes")}
//           className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedOption === "dishRecipes" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
//             }`}
//         >
//           Dish Recipes
//         </button>
//       </div>

//       {/* --- Products Panel --- */}
//       {selectedOption === "products" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Products</h3>
//           <div className="flex gap-4 mb-6 flex-wrap">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by product name..."
//                 value={productSearchQuery}
//                 onChange={(e) => setProductSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//             {/* Vendor Filter */}
//             <div className="min-w-[200px]">
//               <select
//                 value={selectedVendor}
//                 onChange={(e) => setSelectedVendor(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               >
//                 <option value="">All Vendors</option>
//                 {vendors.map((vendor) => (
//                   <option key={vendor._id} value={vendor._id}>
//                     {vendor.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Category Filter (NEW) */}
//             <div className="min-w-[200px]">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Category</th> {/* NEW HEADER */}
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Unit</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Stock</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Reorder Threshold</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Cost per Unit</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Vendor</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Loading/Error/Data rows */}
//                 {productsLoading ? (
//                   <tr><td colSpan="8" className="text-center text-gray-400 py-6">Loading products...</td></tr>
//                 ) : productsError ? (
//                   <tr><td colSpan="8" className="text-center text-red-400 py-6">Failed to load products.</td></tr>
//                 ) : filteredProducts.length === 0 ? (
//                   <tr><td colSpan="8" className="text-center text-gray-400 py-6">No products found.</td></tr>
//                 ) : (
//                   filteredProducts.map((product) => {
//                     // Determine the current category ID for the select's defaultValue
//                     const currentCategoryId = edits.product?.[product._id]?.category // Use edited value
//                       || product.category?._id // Fallback 1: Populated ID
//                       || product.category // Fallback 2: Raw ID string (the target format)
//                       || ""; // Default if no category is assigned

//                     return (
//                       <tr key={product._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                         <td className="py-3 pl-5">
//                           <input
//                             type="text"
//                             defaultValue={product.name}
//                             onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           />
//                         </td>
//                         {/* NEW Category Dropdown */}
//                         <td className="py-3 pl-5">
//                           <select
//                             defaultValue={currentCategoryId}
//                             onChange={(e) => handleEditField("product", product._id, "category", e.target.value)}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           >
//                             <option value="">Select Category</option>
//                             {categories.map((category) => (
//                               <option key={category._id} value={category._id}>
//                                 {category.name}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="py-3 pl-5">
//                           <select
//                             defaultValue={product.unit}
//                             onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           >
//                             <option value="pcs">pcs</option>
//                             <option value="kg">kg</option>
//                             <option value="L">L</option>
//                           </select>
//                         </td>
//                         <td className="py-3 pl-5 text-lg font-bold">{product.quantity_in_stock}</td>
//                         <td className="py-3 pl-5">
//                           <input
//                             type="number"
//                             defaultValue={product.reorder_threshold}
//                             onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           />
//                         </td>
//                         <td className="py-3 pl-5">
//                           <input
//                             type="number"
//                             defaultValue={product.cost_per_unit}
//                             onChange={(e) => handleEditField("product", product._id, "cost_per_unit", Number(e.target.value))}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           />
//                         </td>
//                         <td className="py-3 pl-5">
//                           <select
//                             defaultValue={product.vendor?._id || product.vendor}
//                             onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
//                             className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           >
//                             <option value="">Select Vendor</option>
//                             {vendors.map((vendor) => (
//                               <option key={vendor._id} value={vendor._id}>
//                                 {vendor.name}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="py-3 px-3 text-center whitespace-nowrap">
//                           <div className="flex justify-center gap-2 items-center">
//                             <button
//                               onClick={() => handleUpdate("product", product._id)}
//                               className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                               title="Update"
//                               disabled={updateProductMutation.isLoading}
//                             >
//                               <FiEdit size={20} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteRecord("product", product._id)}
//                               className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                               title="Delete"
//                               disabled={deleteProductMutation.isLoading}
//                             >
//                               <FiTrash2 size={20} />
//                             </button>
//                             <button
//                               onClick={() => handleStockAdjust(product._id, "in")}
//                               className="text-green-500 hover:text-green-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                               title="Stock In"
//                               disabled={adjustStockMutation.isLoading}
//                             >
//                               <FiArrowUpCircle size={24} />
//                             </button>
//                             <button
//                               onClick={() => handleStockAdjust(product._id, "out")}
//                               className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                               title="Stock Out"
//                               disabled={adjustStockMutation.isLoading}
//                             >
//                               <FiArrowDownCircle size={24} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Vendors Panel --- */}
//       {selectedOption === "vendors" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Vendors</h3>
//           {/* Vendor search input */}
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by vendor name..."
//                 value={vendorSearchQuery}
//                 onChange={(e) => setVendorSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//           </div>
//           {/* Vendors table (omitted for brevity, assume existing implementation) */}
//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Contact</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Address</th>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Notes</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Vendors rows */}
//                 {vendorsLoading ? (
//                   <tr><td colSpan="5" className="text-center text-gray-400 py-6">Loading vendors...</td></tr>
//                 ) : vendorsError ? (
//                   <tr><td colSpan="5" className="text-center text-red-400 py-6">Failed to load vendors.</td></tr>
//                 ) : filteredVendors.length === 0 ? (
//                   <tr><td colSpan="5" className="text-center text-gray-400 py-6">No vendors found.</td></tr>
//                 ) : (
//                   filteredVendors.map((vendor) => (
//                     <tr key={vendor._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.name || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.contact || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={vendor.address || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 pl-5">
//                         <textarea
//                           defaultValue={vendor.notes || ""}
//                           onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                           rows="2"
//                         />
//                       </td>
//                       <td className="py-3 px-3 text-center whitespace-nowrap">
//                         <div className="flex justify-center gap-2 items-center">
//                           <button
//                             onClick={() => handleUpdate("vendor", vendor._id)}
//                             className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Update"
//                             disabled={updateVendorMutation.isLoading}
//                           >
//                             <FiEdit size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteRecord("vendor", vendor._id)}
//                             className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Delete"
//                             disabled={deleteVendorMutation.isLoading}
//                           >
//                             <FiTrash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Categories Panel (Existing) --- */}
//       {selectedOption === "categories" && (
//         <div>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Categories</h3>
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 min-w-[200px]">
//               <input
//                 type="text"
//                 placeholder="Search by category name..."
//                 value={categorySearchQuery}
//                 onChange={(e) => setCategorySearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto rounded-lg border border-gray-700/50">
//             <table className="min-w-full text-left text-white divide-y divide-gray-700">
//               <thead className="bg-[#333] text-gray-400 sticky top-0">
//                 <tr>
//                   <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
//                   <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {categoriesLoading ? (
//                   <tr><td colSpan="2" className="text-center text-gray-400 py-6">Loading categories...</td></tr>
//                 ) : categoriesError ? (
//                   <tr><td colSpan="2" className="text-center text-red-400 py-6">Failed to load categories.</td></tr>
//                 ) : filteredCategories.length === 0 ? (
//                   <tr><td colSpan="2" className="text-center text-gray-400 py-6">No categories found.</td></tr>
//                 ) : (
//                   filteredCategories.map((category) => (
//                     <tr key={category._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
//                       <td className="py-3 pl-5">
//                         <input
//                           type="text"
//                           defaultValue={category.name || ""}
//                           onChange={(e) => handleEditField("category", category._id, "name", e.target.value)}
//                           className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
//                         />
//                       </td>
//                       <td className="py-3 px-3 text-center whitespace-nowrap">
//                         <div className="flex justify-center gap-2 items-center">
//                           <button
//                             onClick={() => handleUpdate("category", category._id)}
//                             className="text-teal-500 hover:text-teal-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Update"
//                             disabled={updateCategoryMutation.isLoading}
//                           >
//                             <FiEdit size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteRecord("category", category._id)}
//                             className="text-red-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-[#3a3a3a]"
//                             title="Delete"
//                             disabled={deleteCategoryMutation.isLoading}
//                           >
//                             <FiTrash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* --- Dish Recipes Panel (New Component) --- */}
//       {selectedOption === "dishRecipes" && (
//         <>
//           <h3 className="text-xl font-semibold text-gray-300 mb-4">Edit Dish Recipes</h3>
//           <DishRecipeEditPanel />
//         </>
//       )}

//       {/* Stock Adjustment Modal (Existing logic) */}
//       {stockAdjustment.productId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
//           <div className="bg-[#262626] p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-700">
//             <h2 className="text-white text-xl font-semibold mb-4 border-b border-gray-700 pb-3">
//               {stockAdjustment.type === "in" ? "Stock In" : "Stock Out"}
//             </h2>
//             <div className="mb-4">
//               <label className="block text-gray-400 mb-2">Quantity</label>
//               <input
//                 type="number"
//                 value={stockAdjustment.quantity}
//                 onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
//                 className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:border-teal-500"
//                 min="0.01"
//                 step="any"
//                 required
//               />
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                 disabled={adjustStockMutation.isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleStockSubmit}
//                 className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
//                 disabled={adjustStockMutation.isLoading}
//               >
//                 {adjustStockMutation.isLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5 text-white inline-block"
//                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                   </svg>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryEditPanel;

import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  adjustStock,
  getAllVendors,
  updateVendor,
  deleteVendor,
  getAllInventoryCategories,
  updateInventoryCategory,
  deleteInventoryCategory
} from "../../https";
import { enqueueSnackbar } from "notistack";
import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle, FiX } from "react-icons/fi";

// Import the DishRecipeEditPanel component
import DishRecipeEditPanel from "../Inventory/dishRecipeEditPanel";

const InventoryEditPanel = () => {
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState("products");
  const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
  const [edits, setEdits] = useState({});
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch products!", { variant: "error" });
    },
  });

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
    queryKey: ["vendors"],
    queryFn: getAllVendors,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log("Error fetching vendors:", error);
      enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
    },
  });

  // Fetch Inventory Categories
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ["inventoryCategories"],
    queryFn: getAllInventoryCategories,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch categories!", { variant: "error" });
    },
  });

  // Extract data
  const products = Array.isArray(productsData) ? productsData : [];
  const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Create a lookup map for category names
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat._id] = cat.name;
      return acc;
    }, {});
  }, [categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (productSearchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    }
    if (selectedVendor) {
      filtered = filtered.filter(
        (product) => (product.vendor?._id || product.vendor) === selectedVendor
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => (product.category?._id || product.category) === selectedCategory
      );
    }
    return filtered;
  }, [products, productSearchQuery, selectedVendor, selectedCategory]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors;
    if (vendorSearchQuery) {
      filtered = filtered.filter((vendor) =>
        vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [vendors, vendorSearchQuery]);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categories, categorySearchQuery]);

  // Mutations
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      enqueueSnackbar("Product updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update product!", { variant: "error" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      enqueueSnackbar("Product deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete product!", { variant: "error" });
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: ({ id, data }) => adjustStock(id, data),
    onSuccess: () => {
      enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
      setStockAdjustment({ productId: null, type: null, quantity: "" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: updateVendor,
    onSuccess: () => {
      enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["vendors"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update vendor!", { variant: "error" });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["vendors"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateInventoryCategory,
    onSuccess: () => {
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["inventoryCategories"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to update category!", { variant: "error" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteInventoryCategory,
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["inventoryCategories"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete category!", { variant: "error" });
    },
  });

  // Handle editing a field
  const handleEditField = (entity, id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [id]: {
          ...prev[entity]?.[id],
          [field]: value,
        },
      },
    }));
  };

  // Handle updating a record
  const handleUpdate = (entity, id) => {
    const updatedData = edits[entity]?.[id];
    if (!updatedData) {
      enqueueSnackbar("No changes to update!", { variant: "info" });
      return;
    }

    let fullData = { _id: id, ...updatedData };

    switch (entity) {
      case "product":
        const product = products.find((p) => p._id === id);
        const categoryId = updatedData.category || product.category?._id || product.category;
        const vendorId = updatedData.vendor || product.vendor?._id || product.vendor;
        fullData = {
          ...product,
          ...fullData,
          category: categoryId,
          vendor: vendorId,
        };
        updateProductMutation.mutate(fullData);
        break;
      case "vendor":
        const vendor = vendors.find((v) => v._id === id);
        fullData = { ...vendor, ...fullData };
        updateVendorMutation.mutate(fullData);
        break;
      case "category":
        const category = categories.find((c) => c._id === id);
        fullData = { ...category, ...fullData };
        updateCategoryMutation.mutate(fullData);
        break;
      default:
        break;
    }

    setEdits((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [id]: undefined,
      },
    }));
  };

  // Handle deleting a record
  const handleDeleteRecord = (entity, id) => {
    if (window.confirm(`Are you sure you want to delete this ${entity}?`)) {
      switch (entity) {
        case "product":
          deleteProductMutation.mutate(id);
          break;
        case "vendor":
          deleteVendorMutation.mutate(id);
          break;
        case "category":
          deleteCategoryMutation.mutate(id);
          break;
      }
    }
  };

  // Handle stock adjustment
  const handleStockAdjust = (productId, type) => {
    setStockAdjustment({ productId, type, quantity: "" });
  };

  const handleStockSubmit = () => {
    if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
      enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
      return;
    }
    adjustStockMutation.mutate({
      id: stockAdjustment.productId,
      data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
    });
  };

  return (
    <div className="container mx-auto bg-[#262626] p-3 sm:p-4 md:p-6 rounded-xl shadow-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b border-gray-700 pb-3">
        Inventory & Menu Management
      </h2>

      {/* Tab Navigation - Responsive */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap border-b border-gray-700 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedOption("products")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
            selectedOption === "products" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setSelectedOption("vendors")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
            selectedOption === "vendors" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
          }`}
        >
          Vendors
        </button>
        <button
          onClick={() => setSelectedOption("categories")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
            selectedOption === "categories" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setSelectedOption("dishRecipes")}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
            selectedOption === "dishRecipes" ? "bg-teal-600 text-white shadow-md" : "bg-[#1a1a1a] hover:bg-gray-700 text-gray-300"
          }`}
        >
          Dish Recipes
        </button>
      </div>

      {/* Products Panel */}
      {selectedOption === "products" && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3 sm:mb-4">Edit Products</h3>
          
          {/* Filters - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Search by product name..."
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
            />
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="min-w-full text-left text-white divide-y divide-gray-700">
              <thead className="bg-[#333] text-gray-400 sticky top-0">
                <tr>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Category</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Unit</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Stock</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Reorder</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Cost/Unit</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Vendor</th>
                  <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr><td colSpan="8" className="text-center text-gray-400 py-6">Loading products...</td></tr>
                ) : productsError ? (
                  <tr><td colSpan="8" className="text-center text-red-400 py-6">Failed to load products.</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-gray-400 py-6">No products found.</td></tr>
                ) : (
                  filteredProducts.map((product) => {
                    const currentCategoryId = edits.product?.[product._id]?.category || product.category?._id || product.category || "";
                    return (
                      <tr key={product._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
                        <td className="py-3 pl-5">
                          <input
                            type="text"
                            defaultValue={product.name}
                            onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          />
                        </td>
                        <td className="py-3 pl-5">
                          <select
                            defaultValue={currentCategoryId}
                            onChange={(e) => handleEditField("product", product._id, "category", e.target.value)}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pl-5">
                          <select
                            defaultValue={product.unit}
                            onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          >
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                          </select>
                        </td>
                        <td className="py-3 pl-5 text-lg font-bold">{product.quantity_in_stock}</td>
                        <td className="py-3 pl-5">
                          <input
                            type="number"
                            defaultValue={product.reorder_threshold}
                            onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          />
                        </td>
                        <td className="py-3 pl-5">
                          <input
                            type="number"
                            step="0.001"
                            defaultValue={product.cost_per_unit?.toFixed(3)}
                            onChange={(e) => handleEditField("product", product._id, "cost_per_unit", parseFloat(e.target.value))}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          />
                        </td>
                        <td className="py-3 pl-5">
                          <select
                            defaultValue={product.vendor?._id || product.vendor}
                            onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
                            className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          >
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor) => (
                              <option key={vendor._id} value={vendor._id}>
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex justify-center gap-2 items-center">
                            <button
                              onClick={() => handleUpdate("product", product._id)}
                              className="text-teal-500 hover:text-teal-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                              title="Update"
                            >
                              <FiEdit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("product", product._id)}
                              className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                              title="Delete"
                            >
                              <FiTrash2 size={20} />
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product._id, "in")}
                              className="text-green-500 hover:text-green-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                              title="Stock In"
                            >
                              <FiArrowUpCircle size={24} />
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product._id, "out")}
                              className="text-yellow-500 hover:text-yellow-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                              title="Stock Out"
                            >
                              <FiArrowDownCircle size={24} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {productsLoading ? (
              <div className="text-center text-gray-400 py-6">Loading products...</div>
            ) : productsError ? (
              <div className="text-center text-red-400 py-6">Failed to load products.</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-gray-400 py-6">No products found.</div>
            ) : (
              filteredProducts.map((product) => {
                const currentCategoryId = edits.product?.[product._id]?.category || product.category?._id || product.category || "";
                return (
                  <div key={product._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Name</label>
                        <input
                          type="text"
                          defaultValue={product.name}
                          onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
                          className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Category</label>
                          <select
                            defaultValue={currentCategoryId}
                            onChange={(e) => handleEditField("product", product._id, "category", e.target.value)}
                            className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                          >
                            <option value="">Select</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Unit</label>
                          <select
                            defaultValue={product.unit}
                            onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
                            className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                          >
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="L">L</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Stock</label>
                          <div className="bg-[#262626] text-white px-3 py-2 rounded-lg text-sm font-bold border border-gray-600">
                            {product.quantity_in_stock}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-gray-400 text-xs mb-1 block">Reorder</label>
                          <input
                            type="number"
                            defaultValue={product.reorder_threshold}
                            onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
                            className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Cost per Unit</label>
                        <input
                          type="number"
                          step="0.001"
                          defaultValue={product.cost_per_unit?.toFixed(3)}
                          onChange={(e) => handleEditField("product", product._id, "cost_per_unit", parseFloat(e.target.value))}
                          className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">Vendor</label>
                        <select
                          defaultValue={product.vendor?._id || product.vendor}
                          onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
                          className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                        >
                          <option value="">Select Vendor</option>
                          {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                              {vendor.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-700">
                        <button
                          onClick={() => handleUpdate("product", product._id)}
                          className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FiEdit size={16} /> Update
                        </button>
                        <button
                          onClick={() => handleDeleteRecord("product", product._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                        <button
                          onClick={() => handleStockAdjust(product._id, "in")}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <FiArrowUpCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStockAdjust(product._id, "out")}
                          className="bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                        >
                          <FiArrowDownCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Vendors Panel */}
      {selectedOption === "vendors" && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3 sm:mb-4">Edit Vendors</h3>
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Search by vendor name..."
              value={vendorSearchQuery}
              onChange={(e) => setVendorSearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="min-w-full text-left text-white divide-y divide-gray-700">
              <thead className="bg-[#333] text-gray-400 sticky top-0">
                <tr>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Contact</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Address</th>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Notes</th>
                  <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorsLoading ? (
                  <tr><td colSpan="5" className="text-center text-gray-400 py-6">Loading vendors...</td></tr>
                ) : vendorsError ? (
                  <tr><td colSpan="5" className="text-center text-red-400 py-6">Failed to load vendors.</td></tr>
                ) : filteredVendors.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-gray-400 py-6">No vendors found.</td></tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.name || ""}
                          onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
                          className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.contact || ""}
                          onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
                          className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.address || ""}
                          onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
                          className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <textarea
                          defaultValue={vendor.notes || ""}
                          onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
                          className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                          rows="2"
                        />
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2 items-center">
                          <button
                            onClick={() => handleUpdate("vendor", vendor._id)}
                            className="text-teal-500 hover:text-teal-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                            title="Update"
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord("vendor", vendor._id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                            title="Delete"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {vendorsLoading ? (
              <div className="text-center text-gray-400 py-6">Loading vendors...</div>
            ) : vendorsError ? (
              <div className="text-center text-red-400 py-6">Failed to load vendors.</div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center text-gray-400 py-6">No vendors found.</div>
            ) : (
              filteredVendors.map((vendor) => (
                <div key={vendor._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Name</label>
                      <input
                        type="text"
                        defaultValue={vendor.name || ""}
                        onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
                        className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Contact</label>
                      <input
                        type="text"
                        defaultValue={vendor.contact || ""}
                        onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
                        className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Address</label>
                      <input
                        type="text"
                        defaultValue={vendor.address || ""}
                        onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
                        className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Notes</label>
                      <textarea
                        defaultValue={vendor.notes || ""}
                        onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
                        className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                        rows="3"
                      />
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                      <button
                        onClick={() => handleUpdate("vendor", vendor._id)}
                        className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiEdit size={16} /> Update
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("vendor", vendor._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Categories Panel */}
      {selectedOption === "categories" && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3 sm:mb-4">Edit Categories</h3>
          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Search by category name..."
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="min-w-full text-left text-white divide-y divide-gray-700">
              <thead className="bg-[#333] text-gray-400 sticky top-0">
                <tr>
                  <th className="pl-5 py-3 text-sm font-semibold tracking-wider">Name</th>
                  <th className="p-3 text-center text-sm font-semibold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesLoading ? (
                  <tr><td colSpan="2" className="text-center text-gray-400 py-6">Loading categories...</td></tr>
                ) : categoriesError ? (
                  <tr><td colSpan="2" className="text-center text-red-400 py-6">Failed to load categories.</td></tr>
                ) : filteredCategories.length === 0 ? (
                  <tr><td colSpan="2" className="text-center text-gray-400 py-6">No categories found.</td></tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-700 hover:bg-[#3a3a3a] transition-colors">
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={category.name || ""}
                          onChange={(e) => handleEditField("category", category._id, "name", e.target.value)}
                          className="bg-[#1f1f1f] text-white px-2 py-1 rounded-lg w-full border border-gray-600 focus:border-teal-500"
                        />
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2 items-center">
                          <button
                            onClick={() => handleUpdate("category", category._id)}
                            className="text-teal-500 hover:text-teal-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                            title="Update"
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord("category", category._id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-[#3a3a3a]"
                            title="Delete"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {categoriesLoading ? (
              <div className="text-center text-gray-400 py-6">Loading categories...</div>
            ) : categoriesError ? (
              <div className="text-center text-red-400 py-6">Failed to load categories.</div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center text-gray-400 py-6">No categories found.</div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">Name</label>
                      <input
                        type="text"
                        defaultValue={category.name || ""}
                        onChange={(e) => handleEditField("category", category._id, "name", e.target.value)}
                        className="bg-[#262626] text-white px-3 py-2 rounded-lg w-full text-sm border border-gray-600 focus:border-teal-500"
                      />
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                      <button
                        onClick={() => handleUpdate("category", category._id)}
                        className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiEdit size={16} /> Update
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("category", category._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Dish Recipes Panel */}
      {selectedOption === "dishRecipes" && (
        <>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3 sm:mb-4">Edit Dish Recipes</h3>
          <DishRecipeEditPanel />
        </>
      )}

      {/* Stock Adjustment Modal */}
      {stockAdjustment.productId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-[#262626] p-4 sm:p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
              <h2 className="text-white text-lg sm:text-xl font-semibold">
                {stockAdjustment.type === "in" ? "Stock In" : "Stock Out"}
              </h2>
              <button
                onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Quantity</label>
              <input
                type="number"
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm sm:text-base border border-gray-700 focus:outline-none focus:border-teal-500"
                min="0.01"
                step="any"
                required
                placeholder="Enter quantity"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
                className="px-4 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors"
                disabled={adjustStockMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleStockSubmit}
                className="px-4 py-2 bg-teal-600 text-white text-sm sm:text-base rounded-lg hover:bg-teal-700 transition-colors font-medium"
                disabled={adjustStockMutation.isLoading}
              >
                {adjustStockMutation.isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryEditPanel;