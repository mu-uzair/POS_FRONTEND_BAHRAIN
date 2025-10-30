// import React from "react";
// import { IoCheckmarkDone } from "react-icons/io5";
// import { FaCircle } from "react-icons/fa";
// import { getAvatarName, formatDateAndTme } from "../../utils/index";
// import { useSelector } from "react-redux";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrder, deleteOrder, updateTable } from "../../https/index"; // Import updateTable function
// import { enqueueSnackbar } from "notistack";
// import { MdFileDownloadDone } from "react-icons/md";

// const OrderCard = ({ order }) => {
//     const customerData = useSelector((state) => state.customer);
//     const queryClient = useQueryClient();

//     // Mutation for updating order status
//     const orderStatusUpdateMutation = useMutation({
//         mutationFn: ({ orderId, orderStatus }) => {
//             return updateOrder({ orderId, orderStatus });
//         },
//         onSuccess: (data, variables) => {
//             enqueueSnackbar("Order status updated successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["orders"]); // Refresh the orders list

//             // If the order status is changed to "Completed", update the table status
//             if (variables.orderStatus === "Completed" && order.table) {
//                 updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//             }
//         },
//         onError: (error) => {
//             console.error("Error updating order status:", error);
//             enqueueSnackbar("Failed to update order status!", { variant: "error" });
//         },
//     });

//     // Mutation for updating table status
//     const updateTableMutation = useMutation({
//         mutationFn: ({ tableId, status }) => {
//             return updateTable({ tableId, status });
//         },
//         onSuccess: () => {
//             enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["tables"]); // Refresh the tables list
//         },
//         onError: (error) => {
//             console.error("Error updating table status:", error);
//             enqueueSnackbar("Failed to update table status!", { variant: "error" });
//         },
//     });

//     // Mutation for deleting an order
//     const deleteOrderMutation = useMutation({
//         mutationFn: (orderId) => {
//             return deleteOrder(orderId); // Call the deleteOrder API
//         },
//         onSuccess: (data) => {
//             enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["orders"]); // Refresh the orders list
//         },
//         onError: (error) => {
//             console.error("Error deleting order:", error);
//             enqueueSnackbar("Failed to delete order!", { variant: "error" });
//         },
//     });

//     // Handle order status change
//     const handleStatusChange = (newStatus) => {
//         if (newStatus === "delete") {
//             // Handle delete action
//             if (window.confirm("Are you sure you want to delete this order?")) {
//                 deleteOrderMutation.mutate(order._id);
//             }
//         } else {
//             // Handle status update
//             orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
//         }
//     };

//     return (
//         <div className="w-[450px] bg-[#262626] p-4 rounded-lg mb-20">
//             <div className="flex items-center gap-5">
//                 <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
//                     {getAvatarName(order.customerDetails.name)}
//                 </button>
//                 <div className="flex items-center justify-between w-[100%]">
//                     <div className="flex flex-col items-start gap-1">
//                         <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
//                             {order.customerDetails.name}
//                         </h1>
//                         <p className="text-[#ababab] text-sm">
//                             #{order.orderId?.orderId} / {order.customerDetails.orderType}
//                         </p>
//                         {order.table && (
//                             <p className="text-[#ababab] text-sm">
//                                 Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
//                                 {order.table.tableNo}
//                             </p>
//                         )}
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                         {/* Dropdown for order status and delete option */}
//                         <select
//                             className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
//                                 order.orderStatus === "Ready"
//                                     ? "text-green-500"
//                                     : order.orderStatus === "Completed"
//                                     ? "text-blue-500"
//                                     : "text-yellow-500"
//                             }`}
//                             value={order.orderStatus}
//                             onChange={(e) => handleStatusChange(e.target.value)}
//                         >
//                             <option className="text-yellow-500" value="In Progress">
//                                 In Progress
//                             </option>
//                             <option className="text-green-500" value="Ready">
//                                 Ready
//                             </option>
//                             <option className="text-blue-500" value="Completed">
//                                 Completed
//                             </option>
//                             <option className="text-red-500" value="delete">
//                                 Delete Order
//                             </option>
//                         </select>
//                         <p className="text-[#ababab] text-sm">
//                             {order.orderStatus === "Ready" ? (
//                                 <>
//                                     <FaCircle className="inline mr-2 text-green-600" />
//                                     Order Ready
//                                 </>
//                             ) : order.orderStatus === "Completed" ? (
//                                 <>
//                                     <MdFileDownloadDone className="inline mr-2 text-blue-600" />
//                                     Order Completed
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaCircle className="inline mr-2 text-yellow-600" />
//                                     Now Cooking
//                                 </>
//                             )}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex justify-between items-center mt-4 text-[#ababab]">
//                 <p>{formatDateAndTme(order.createdAt)}</p>
//                 <p>{order.items.length} Items</p>
//             </div>
//             <hr className="text-[#f5f5f5] mt-4 border-t-1 border-gray-500" />

//             <div className="flex items-center justify-between mt-4">
//                 <h1 className="text-[#f5f5f5] text-lg semi-bold">Total</h1>
//                 <p className="text-[#f5f5f5] text-lg font-semi-bold">
//                     Rs {order.bills.totalWithTax.toFixed(2)}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default OrderCard;

// import React, { useState } from "react";
// import { FaCircle } from "react-icons/fa";
// import { getAvatarName, formatDateAndTme } from "../../utils/index";
// import { useSelector, useDispatch } from "react-redux";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrderStatus, deleteOrder, updateTable } from "../../https/index";
// import { enqueueSnackbar } from "notistack";
// import { MdFileDownloadDone, MdEdit } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
// import { setCartItems, removeAllItems, addItems } from "../../redux/slice/cartSlice";
// import BillInfo from "../Menu/BillInfo";


// const OrderCard = ({ order }) => {




//     const customerData = useSelector((state) => state.customer);
//     const queryClient = useQueryClient();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();



//     // Mutation for updating table status
//     const updateTableMutation = useMutation({
//         mutationFn: ({ tableId, status }) => {
//             return updateTable({ tableId, status });
//         },
//         onSuccess: () => {
//             enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["tables"]); // Refresh the tables list
//         },
//         onError: (error) => {
//             console.error("Error updating table status:", error);
//             enqueueSnackbar("Failed to update table status!", { variant: "error" });
//         },
//     });


//     // Mutation for updating order status
//     const orderStatusUpdateMutation = useMutation({
//         mutationFn: ({ orderId, orderStatus }) => {
//             return updateOrderStatus({ orderId, orderStatus });
//         },
//         onSuccess: (data, variables) => {
//             enqueueSnackbar("Order status updated successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["orders"]); // Refresh the orders list

//             // Here, we refer to the order from the outer scope.
//             // If the order status is "Completed" and there is an assigned table,
//             // update that table's status to "Available".
//             if (variables.orderStatus === "Completed" && order.table) {
//                 updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//             }
//         },
//         onError: (error) => {
//             console.error("Error updating order status:", error);
//             enqueueSnackbar("Failed to update order status!", { variant: "error" });
//         },
//     });



//     // --------------------------
//     // Mutation for deleting an order
//     // Accepts the full order object to retrieve order ID and table details (if any)
//     // --------------------------
//     // Mutation for deleting an order (receives the full order object)
//     const deleteOrderMutation = useMutation({
//         mutationFn: (order) => {
//             // return deleteOrder(order._id); // Pass only the order ID to the API
//             return deleteOrder(order._id, order.password);
//         },
//         onSuccess: (data, order) => {
//             enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//             queryClient.invalidateQueries(["orders"]); // Refresh the orders list

//             // If the deleted order had an assigned table, mark that table as "Available"
//             if (order.table) {
//                 updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//             }
//         },
//         onError: (error) => {
//             console.error("Error deleting order:", error);
//             enqueueSnackbar("Failed to delete order!", { variant: "error" });
//         },
//     });


//     const handleStatusChange = (newStatus) => {
//         if (newStatus === "delete") {
//             // Handle delete action
//             // if (window.confirm("Are you sure you want to delete this order?")) {
//             //     deleteOrderMutation.mutate(order); // Pass the full order object here
//             // }
//             if (window.confirm("Are you sure you want to delete this order?")) {
//                 const user = JSON.parse(localStorage.getItem("user")); // or from redux if available
//                 const userRole = user?.role;

//                 if (userRole === "admin") {
//                     // Direct delete for admins
//                     deleteOrderMutation.mutate({ ...order, password: null });
//                 } else {
//                     // Ask for admin password
//                     const password = prompt("Enter admin password to delete this order:");
//                     if (!password) {
//                         enqueueSnackbar("Admin password required!", { variant: "error" });
//                         return;
//                     }
//                     deleteOrderMutation.mutate({ ...order, password });
//                 }
//             }
//         } else {
//             // Handle status update
//             orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
//         }
//     };


//     const handleEditOrder = () => {



//         if (!order?.items?.length) return;

//         // Set editing mode in Redux
//         dispatch(setEditingMode(true));

//         const itemsForCart = order.items.map(item => ({
//             // id: (item._id || item.id),
//             // name: item.name,
//             // price: item.price,
//             // quantity: item.quantity || 1,

//             id: item.menuItem,       // use menuItem as id
//             dishId: item.menuItem,   // store dishId for backend
//             name: item.name,
//             price: item.pricePerQuantity || item.price,
//             quantity: item.quantity || 1,
//             section: item.section || null
//         }));

//         console.log('Original order details:', {
//             paymentMethod: order.paymentMethod,
//             discountPercentage: order.bills?.discountPercentage,
//             discountAmount: order.bills?.discountAmount
//         });

//         dispatch(setCustomer({
//             name: order.customerDetails?.name,
//             phone: order.customerDetails?.phone,
//             guests: order.customerDetails?.guests,
//             orderType: order.customerDetails?.orderType,
//             paymentMethod: order.paymentMethod || "Online",
//             orderId: order.orderId || order._id,
//             table: order.table || null,



//         }));



//         // Step 2️⃣ Set delivery info if applicable
//         if (order.customerDetails?.orderType === "Delivery") {
//             dispatch(setDeliveryInfo({
//                 address: order.deliveryAddress,
//                 deliveryBoyId: order.deliveryBoyId,
//                 phone: order.customerDetails?.phone,
//                 name: order.customerDetails?.name,
//             }));
//         }




//         dispatch(setCartItems(itemsForCart));
//         dispatch(setEditingMode(true));
//         navigate('/Menu');
//     };


//     return (
//         <div className="w-full max-w-[450px] bg-[#262626] p-4 rounded-lg mb-15 h-auto max-h-[230px]">
//             <div className="flex items-center gap-5">
//                 <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
//                     {getAvatarName(order.customerDetails.name)}
//                 </button>
//                 <div className="flex items-center justify-between w-full">
//                     <div className="flex flex-col items-start gap-1">
//                         <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
//                             {order.customerDetails.name}
//                         </h1>
//                         <p className="text-[#ababab] text-sm">
//                             #{order.orderId} / {order.customerDetails.orderType}
//                         </p>
//                         {order.table && (
//                             <p className="text-[#ababab] text-sm">
//                                 Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
//                                 {order.table.tableNo}
//                             </p>
//                         )}
//                     </div>

//                     <div className="flex flex-col items-end gap-2">
//                         {/* Dropdown for order status and actions */}
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={handleEditOrder}
//                                 className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg"
//                                 title="Edit Order"
//                             >
//                                 <MdEdit size={20} />
//                             </button>

//                             <select
//                                 className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${order.orderStatus === "Ready"
//                                     ? "text-green-500"
//                                     : order.orderStatus === "Completed"
//                                         ? "text-blue-500"
//                                         : "text-yellow-500"
//                                     }`}
//                                 value={order.orderStatus}
//                                 onChange={(e) => handleStatusChange(e.target.value)}
//                             >
//                                 <option className="text-yellow-500" value="In Progress">
//                                     In Progress
//                                 </option>
//                                 <option className="text-green-500" value="Ready">
//                                     Ready
//                                 </option>
//                                 <option className="text-blue-500" value="Completed">
//                                     Completed
//                                 </option>
//                                 <option className="text-red-500" value="delete">
//                                     Delete Order
//                                 </option>
//                             </select>
//                         </div>
//                         <p className="text-[#ababab] text-sm">
//                             {order.orderStatus === "Ready" ? (
//                                 <>
//                                     <FaCircle className="inline mr-2 text-green-600" />
//                                     Order Ready
//                                 </>
//                             ) : order.orderStatus === "Completed" ? (
//                                 <>
//                                     <MdFileDownloadDone className="inline mr-2 text-blue-600" />
//                                     Order Completed
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaCircle className="inline mr-2 text-yellow-600" />
//                                     Now Cooking
//                                 </>
//                             )}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex justify-between items-center mt-4 text-[#ababab]">
//                 <p>{formatDateAndTme(order.createdAt)}</p>
//                 <p>{order.items.length} Items</p>
//             </div>
//             <hr className="text-[#f5f5f5] mt-4 border-t-1 border-gray-500" />

//             <div className="flex items-center justify-between mt-4">
//                 <h1 className="text-[#f5f5f5] text-lg semi-bold">Total</h1>
//                 <p className="text-[#f5f5f5] text-lg font-semi-bold">
//                     BHD {order.bills.totalWithTax.toFixed(2)}
//                 </p>
//             </div>
//         </div>
//     );


// };


// export default OrderCard;






// import React, { useState } from "react";
// import { FaCircle } from "react-icons/fa";
// import { getAvatarName, formatDateAndTme } from "../../utils/index";
// import { useSelector, useDispatch } from "react-redux";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrderStatus, deleteOrder, updateTable } from "../../https/index";
// import { enqueueSnackbar } from "notistack";
// import { MdFileDownloadDone, MdEdit } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
// import { setCartItems } from "../../redux/slice/cartSlice";

// const OrderCard = ({ order }) => {
//   const queryClient = useQueryClient();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 🔐 Password modal state
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [adminPassword, setAdminPassword] = useState("");

//   // ✅ Table update mutation
//   const updateTableMutation = useMutation({
//     mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//     onSuccess: () => {
//       enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["tables"]);
//     },
//     onError: (error) => {
//       console.error("Error updating table status:", error);
//       enqueueSnackbar("Failed to update table status!", { variant: "error" });
//     },
//   });

//   // ✅ Order status mutation
//   const orderStatusUpdateMutation = useMutation({
//     mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
//     onSuccess: (data, variables) => {
//       enqueueSnackbar("Order status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (variables.orderStatus === "Completed" && order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating order status:", error);
//       enqueueSnackbar("Failed to update order status!", { variant: "error" });
//     },
//   });

//   // ✅ Delete order mutation
//   const deleteOrderMutation = useMutation({
//     mutationFn: (order) => deleteOrder(order._id, order.password),
//     onSuccess: (data, order) => {
//       enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }
//     },
//     onError: (error) => {
//       console.error("Error deleting order:", error);
//       enqueueSnackbar("Failed to delete order!", { variant: "error" });
//     },
//   });

//   // ✅ Handle status change (Delete or Update)
//   const handleStatusChange = (newStatus) => {
//     if (newStatus === "delete") {
//       if (window.confirm("Are you sure you want to delete this order?")) {
//         const user = JSON.parse(localStorage.getItem("user"));
//         const userRole = user?.role?.toLowerCase();

//         if (userRole === "admin") {
//           deleteOrderMutation.mutate({ ...order, password: null });
//         } else {
//           setShowPasswordModal(true); // 🔒 Show modal instead of prompt
//         }
//       }
//     } else {
//       orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
//     }
//   };

//   // ✅ Confirm password from modal
//   const handleConfirmDelete = () => {
//     if (!adminPassword) {
//       enqueueSnackbar("Admin password required!", { variant: "error" });
//       return;
//     }
//     deleteOrderMutation.mutate({ ...order, password: adminPassword });
//     setAdminPassword("");
//     setShowPasswordModal(false);
//   };

//   // ✅ Edit order logic
//   const handleEditOrder = () => {
//     if (!order?.items?.length) return;

//     dispatch(setEditingMode(true));

//     const itemsForCart = order.items.map((item) => ({
//       id: item.menuItem,
//       dishId: item.menuItem,
//       name: item.name,
//       variationName: item.variationName || null,
//       price: item.pricePerQuantity || item.price,
//       quantity: item.quantity || 1,
//       section: item.section || null,
//     }));

//     dispatch(
//       setCustomer({
//         name: order.customerDetails?.name,
//         phone: order.customerDetails?.phone,
//         guests: order.customerDetails?.guests,
//         orderType: order.customerDetails?.orderType,
//         paymentMethod: order.paymentMethod || "Online",
//         orderId: order.orderId || order._id,
//         table: order.table || null,
//       })
//     );

//     if (order.customerDetails?.orderType === "Delivery") {
//       dispatch(
//         setDeliveryInfo({
//           address: order.deliveryAddress,
//           deliveryBoyId: order.deliveryBoyId,
//           phone: order.customerDetails?.phone,
//           name: order.customerDetails?.name,
//         })
//       );
//     }

//     dispatch(setCartItems(itemsForCart));
//     navigate("/Menu");
//   };


//   return (
//   <>
//     {/* 🧾 Order Card - Responsive */}
//     <div className="w-full max-w-[450px] bg-[#262626] p-3 sm:p-4 rounded-lg mb-4 h-auto">
//       {/* Header Section */}
//       <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
//         {/* Avatar */}
//         <button className="bg-[#f6b100] p-2 sm:p-2.5 lg:p-3 text-base sm:text-lg lg:text-xl font-bold rounded-lg flex-shrink-0">
//           {getAvatarName(order.customerDetails.name)}
//         </button>

//         {/* Main Content Wrapper */}
//         <div className="flex-1 min-w-0">
//           {/* Customer Info & Actions Container */}
//           <div className="flex flex-col gap-3">
//             {/* Customer Info */}
//             <div className="flex flex-col items-start gap-1">
//               <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg font-semibold tracking-wide truncate w-full">
//                 {order.customerDetails.name}
//               </h1>
//               <p className="text-[#ababab] text-xs sm:text-sm">
//                 #{order.orderId} / {order.customerDetails.orderType}
//               </p>
//               {order.table && (
//                 <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                   Table 
//                   <FaLongArrowAltRight className="text-[#ababab] mx-1 sm:mx-2 inline" />
//                   {order.table.tableNo}
//                 </p>
//               )}
//             </div>

//             {/* Actions & Status Section */}
//             <div className="flex flex-col gap-2">
//               {/* Action Buttons Row */}
//               <div className="flex gap-2 flex-wrap">
//                 <button
//                   onClick={handleEditOrder}
//                   className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg flex-shrink-0"
//                   title="Edit Order"
//                 >
//                   <MdEdit size={18} className="sm:w-5 sm:h-5" />
//                 </button>

//                 <select
//                   className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 px-2 py-2 rounded-lg focus:outline-none text-xs sm:text-sm flex-1 min-w-[120px] ${
//                     order.orderStatus === "Ready"
//                       ? "text-green-500"
//                       : order.orderStatus === "Completed"
//                       ? "text-blue-500"
//                       : "text-yellow-500"
//                   }`}
//                   value={order.orderStatus}
//                   onChange={(e) => handleStatusChange(e.target.value)}
//                 >
//                   <option className="text-yellow-500" value="In Progress">
//                     In Progress
//                   </option>
//                   <option className="text-green-500" value="Ready">
//                     Ready
//                   </option>
//                   <option className="text-blue-500" value="Completed">
//                     Completed
//                   </option>
//                   <option className="text-red-500" value="delete">
//                     Delete Order
//                   </option>
//                 </select>
//               </div>

//               {/* Status Indicator */}
//               <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                 {order.orderStatus === "Ready" ? (
//                   <>
//                     <FaCircle className="inline mr-1 sm:mr-2 text-green-600 text-[8px] sm:text-xs flex-shrink-0" />
//                     <span>Order Ready</span>
//                   </>
//                 ) : order.orderStatus === "Completed" ? (
//                   <>
//                     <MdFileDownloadDone className="inline mr-1 sm:mr-2 text-blue-600 text-sm sm:text-base flex-shrink-0" />
//                     <span>Order Completed</span>
//                   </>
//                 ) : (
//                   <>
//                     <FaCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-[8px] sm:text-xs flex-shrink-0" />
//                     <span>Now Cooking</span>
//                   </>
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Info */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 text-[#ababab] gap-1 sm:gap-0">
//         <p className="text-xs sm:text-sm">{formatDateAndTme(order.createdAt)}</p>
//         <p className="text-xs sm:text-sm">{order.items.length} Items</p>
//       </div>

//       <hr className="text-[#f5f5f5] mt-3 sm:mt-4 border-t border-gray-500" />

//       {/* Total Section */}
//       <div className="flex items-center justify-between mt-3 sm:mt-4">
//         <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold">Total</h1>
//         <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
//           BHD {order.bills.totalWithTax.toFixed(3)}
//         </p>
//       </div>
//     </div>

//     {/* 🔐 Password Modal - Responsive */}
//     {showPasswordModal && (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[320px] sm:max-w-[400px]">
//           <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
//             Admin Password Required
//           </h3>
//           <p className="text-xs sm:text-sm text-gray-600 mb-4">
//             Enter admin password to delete this order.
//           </p>

//           <input
//             type="password"
//             className="border border-gray-300 rounded w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring focus:ring-red-300"
//             placeholder="Enter admin password"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//           />

//           <div className="flex justify-end gap-2 sm:gap-3">
//             <button
//               onClick={() => {
//                 setShowPasswordModal(false);
//                 setAdminPassword("");
//               }}
//               className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 text-sm sm:text-base transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirmDelete}
//               className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base transition-colors"
//             >
//               Confirm
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// );
// };

// export default OrderCard;



// import React, { useState } from "react";
// import { FaCircle } from "react-icons/fa";
// import { getAvatarName, formatDateAndTme } from "../../utils/index";
// import { useDispatch } from "react-redux";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrderStatus, deleteOrder, updateTable } from "../../https/index";
// import { enqueueSnackbar } from "notistack";
// import { MdFileDownloadDone, MdEdit } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
// import { setCartItems } from "../../redux/slice/cartSlice";

// const OrderCard = ({ order }) => {
//   const queryClient = useQueryClient();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 🔐 Password modal state
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [adminPassword, setAdminPassword] = useState("");

//   // 🔔 Confirmation modal for status changes
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState(null);

//   // ✅ Table update mutation
//   const updateTableMutation = useMutation({
//     mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//     onSuccess: () => {
//       enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["tables"]);
//     },
//     onError: (error) => {
//       console.error("Error updating table status:", error);
//       enqueueSnackbar("Failed to update table status!", { variant: "error" });
//     },
//   });

//   // ✅ Order status mutation with inventory handling
//   const orderStatusUpdateMutation = useMutation({
//     mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
//     onSuccess: (data, variables) => {
//       const message = data?.message || "Order status updated successfully!";
//       enqueueSnackbar(message, { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);
//       queryClient.invalidateQueries(["products"]); // Refresh products for inventory

//       // Update table status if order is completed
//       if (variables.orderStatus === "Completed" && order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }

//       // Close confirmation modal
//       setShowConfirmModal(false);
//       setPendingStatus(null);
//     },
//     onError: (error) => {
//       console.error("Error updating order status:", error);
//       const errorMessage = error?.response?.data?.message || error?.message || "Failed to update order status!";
//       enqueueSnackbar(errorMessage, { variant: "error" });
      
//       // Close confirmation modal
//       setShowConfirmModal(false);
//       setPendingStatus(null);
//     },
//   });

//   // ✅ Delete order mutation
//   const deleteOrderMutation = useMutation({
//     mutationFn: (order) => deleteOrder(order._id, order.password),
//     onSuccess: (data, order) => {
//       enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }
//     },
//     onError: (error) => {
//       console.error("Error deleting order:", error);
//       enqueueSnackbar("Failed to delete order!", { variant: "error" });
//     },
//   });

//   // ✅ Handle status change with confirmation for critical statuses
//   const handleStatusChange = (newStatus) => {
//     if (newStatus === "delete") {
//       if (window.confirm("Are you sure you want to delete this order?")) {
//         const user = JSON.parse(localStorage.getItem("user"));
//         const userRole = user?.role?.toLowerCase();

//         if (userRole === "admin") {
//           deleteOrderMutation.mutate({ ...order, password: null });
//         } else {
//           setShowPasswordModal(true);
//         }
//       }
//       return;
//     }

//     // Show confirmation for Completed or Cancelled status
//     if (newStatus === "Completed" || newStatus === "Cancelled") {
//       setPendingStatus(newStatus);
//       setShowConfirmModal(true);
//     } else {
//       // Directly update for other statuses
//       orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
//     }
//   };

//   // ✅ Confirm status change
//   const handleConfirmStatusChange = () => {
//     if (pendingStatus) {
//       orderStatusUpdateMutation.mutate({ 
//         orderId: order._id, 
//         orderStatus: pendingStatus 
//       });
//     }
//   };

//   // ✅ Confirm password from modal
//   const handleConfirmDelete = () => {
//     if (!adminPassword) {
//       enqueueSnackbar("Admin password required!", { variant: "error" });
//       return;
//     }
//     deleteOrderMutation.mutate({ ...order, password: adminPassword });
//     setAdminPassword("");
//     setShowPasswordModal(false);
//   };

//   // ✅ Edit order logic
//   const handleEditOrder = () => {
//     if (!order?.items?.length) return;

//     dispatch(setEditingMode(true));

//     const itemsForCart = order.items.map((item) => ({
//       id: item.menuItem,
//       dishId: item.menuItem,
//       name: item.name,
//       variationName: item.variationName || null,
//       price: item.pricePerQuantity || item.price,
//       quantity: item.quantity || 1,
//       section: item.section || null,
//     }));

//     dispatch(
//       setCustomer({
//         name: order.customerDetails?.name,
//         phone: order.customerDetails?.phone,
//         guests: order.customerDetails?.guests,
//         orderType: order.customerDetails?.orderType,
//         paymentMethod: order.paymentMethod || "Online",
//         orderId: order.orderId || order._id,
//         table: order.table || null,
//       })
//     );

//     if (order.customerDetails?.orderType === "Delivery") {
//       dispatch(
//         setDeliveryInfo({
//           address: order.deliveryAddress,
//           deliveryBoyId: order.deliveryBoyId,
//           phone: order.customerDetails?.phone,
//           name: order.customerDetails?.name,
//         })
//       );
//     }

//     dispatch(setCartItems(itemsForCart));
//     navigate("/Menu");
//   };

//   // Get confirmation message based on status
//   const getConfirmationMessage = () => {
//     if (pendingStatus === "Completed") {
//       return {
//         title: "Complete Order?",
//         message: "This will automatically deduct ingredients from inventory. Are you sure?",
//         icon: "✅",
//         color: "blue"
//       };
//     }
//     if (pendingStatus === "Cancelled") {
//       const willRollback = order.orderStatus === "Completed";
//       return {
//         title: "Cancel Order?",
//         message: willRollback 
//           ? "This will roll back the inventory deduction. Are you sure?" 
//           : "Are you sure you want to cancel this order?",
//         icon: "⚠️",
//         color: "red"
//       };
//     }
//     return { title: "", message: "", icon: "", color: "blue" };
//   };

//   const confirmInfo = getConfirmationMessage();

//   return (
//     <>
//       {/* 🧾 Order Card - Responsive */}
//       <div className="w-full max-w-[450px] bg-[#262626] p-3 sm:p-4 rounded-lg mb-4 h-auto">
//         {/* Header Section */}
//         <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
//           {/* Avatar */}
//           <button className="bg-[#f6b100] p-2 sm:p-2.5 lg:p-3 text-base sm:text-lg lg:text-xl font-bold rounded-lg flex-shrink-0">
//             {getAvatarName(order.customerDetails.name)}
//           </button>

//           {/* Main Content Wrapper */}
//           <div className="flex-1 min-w-0">
//             {/* Customer Info & Actions Container */}
//             <div className="flex flex-col gap-3">
//               {/* Customer Info */}
//               <div className="flex flex-col items-start gap-1">
//                 <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg font-semibold tracking-wide truncate w-full">
//                   {order.customerDetails.name}
//                 </h1>
//                 <p className="text-[#ababab] text-xs sm:text-sm">
//                   #{order.orderId} / {order.customerDetails.orderType}
//                 </p>
//                 {order.table && (
//                   <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                     Table 
//                     <FaLongArrowAltRight className="text-[#ababab] mx-1 sm:mx-2 inline" />
//                     {order.table.tableNo}
//                   </p>
//                 )}
//               </div>

//               {/* Actions & Status Section */}
//               <div className="flex flex-col gap-2">
//                 {/* Action Buttons Row */}
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditOrder}
//                     className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg flex-shrink-0"
//                     title="Edit Order"
//                   >
//                     <MdEdit size={18} className="sm:w-5 sm:h-5" />
//                   </button>

//                   <select
//                     className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 px-2 py-2 rounded-lg focus:outline-none text-xs sm:text-sm flex-1 min-w-[120px] ${
//                       order.orderStatus === "Ready"
//                         ? "text-green-500"
//                         : order.orderStatus === "Completed"
//                         ? "text-blue-500"
//                         : order.orderStatus === "Cancelled"
//                         ? "text-red-500"
//                         : "text-yellow-500"
//                     }`}
//                     value={order.orderStatus}
//                     onChange={(e) => handleStatusChange(e.target.value)}
//                     disabled={orderStatusUpdateMutation.isLoading}
//                   >
//                     <option className="text-yellow-500" value="In Progress">
//                       In Progress
//                     </option>
//                     <option className="text-green-500" value="Ready">
//                       Ready
//                     </option>
//                     <option className="text-blue-500" value="Completed">
//                       Completed
//                     </option>
//                     <option className="text-red-500" value="Cancelled">
//                       Cancelled
//                     </option>
//                     <option className="text-red-500" value="delete">
//                       Delete Order
//                     </option>
//                   </select>
//                 </div>

//                 {/* Status Indicator */}
//                 <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                   {order.orderStatus === "Ready" ? (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-green-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Order Ready</span>
//                     </>
//                   ) : order.orderStatus === "Completed" ? (
//                     <>
//                       <MdFileDownloadDone className="inline mr-1 sm:mr-2 text-blue-600 text-sm sm:text-base flex-shrink-0" />
//                       <span>Order Completed</span>
//                     </>
//                   ) : order.orderStatus === "Cancelled" ? (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-red-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Order Cancelled</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Now Cooking</span>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Info */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 text-[#ababab] gap-1 sm:gap-0">
//           <p className="text-xs sm:text-sm">{formatDateAndTme(order.createdAt)}</p>
//           <p className="text-xs sm:text-sm">{order.items.length} Items</p>
//         </div>

//         <hr className="text-[#f5f5f5] mt-3 sm:mt-4 border-t border-gray-500" />

//         {/* Total Section */}
//         <div className="flex items-center justify-between mt-3 sm:mt-4">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold">Total</h1>
//           <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
//             BHD {order.bills.totalWithTax.toFixed(3)}
//           </p>
//         </div>
//       </div>

//       {/* 🔔 Status Change Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//           <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[420px] border border-gray-700">
//             <div className="text-center mb-4">
//               <div className="text-4xl sm:text-5xl mb-3">{confirmInfo.icon}</div>
//               <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
//                 {confirmInfo.title}
//               </h3>
//               <p className="text-sm sm:text-base text-gray-400">
//                 {confirmInfo.message}
//               </p>
//             </div>

//             {orderStatusUpdateMutation.isLoading && (
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-6 h-6 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin"></div>
//                 <span className="ml-2 text-gray-400 text-sm">Processing...</span>
//               </div>
//             )}

//             <div className="flex justify-end gap-2 sm:gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowConfirmModal(false);
//                   setPendingStatus(null);
//                 }}
//                 disabled={orderStatusUpdateMutation.isLoading}
//                 className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmStatusChange}
//                 disabled={orderStatusUpdateMutation.isLoading}
//                 className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${
//                   confirmInfo.color === "red"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔐 Password Modal - Responsive */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//           <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
//             <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
//               Admin Password Required
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-400 mb-4">
//               Enter admin password to delete this order.
//             </p>

//             <input
//               type="password"
//               className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
//               placeholder="Enter admin password"
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//             />

//             <div className="flex justify-end gap-2 sm:gap-3">
//               <button
//                 onClick={() => {
//                   setShowPasswordModal(false);
//                   setAdminPassword("");
//                 }}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base transition-colors"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderCard;



// import React, { useState } from "react";
// import { FaCircle } from "react-icons/fa";
// import { getAvatarName, formatDateAndTme } from "../../utils/index";
// import { useDispatch } from "react-redux";
// import { FaLongArrowAltRight } from "react-icons/fa";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateOrderStatus, deleteOrder, updateTable } from "../../https/index";
// import { enqueueSnackbar } from "notistack";
// import { MdFileDownloadDone, MdEdit } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
// import { setCartItems } from "../../redux/slice/cartSlice";

// const OrderCard = ({ order }) => {
//   const queryClient = useQueryClient();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 🔐 Password modal state
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [adminPassword, setAdminPassword] = useState("");
//   const [passwordAction, setPasswordAction] = useState(null); // "delete" or "edit"

//   // 🔔 Confirmation modal for status changes
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState(null);

//   // ✅ Get user role from localStorage
//   const getUserRole = () => {
//     try {
//       const userStr = localStorage.getItem("user");
//       if (!userStr) {
//         console.log("⚠️ No user found in localStorage");
//         return null;
//       }

//       const user = JSON.parse(userStr);
//       const role = user?.role;
      
//       if (role && typeof role === 'string') {
//         const normalizedRole = role.toLowerCase().trim();
//         console.log("✅ User role:", normalizedRole);
//         return normalizedRole;
//       }
      
//       console.log("⚠️ Role not found in user object");
//       return null;
//     } catch (error) {
//       console.error("❌ Error getting user role:", error);
//       return null;
//     }
//   };

//   // ✅ Table update mutation
//   const updateTableMutation = useMutation({
//     mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//     onSuccess: () => {
//       enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["tables"]);
//     },
//     onError: (error) => {
//       console.error("Error updating table status:", error);
//       enqueueSnackbar("Failed to update table status!", { variant: "error" });
//     },
//   });

//   // ✅ Order status mutation with inventory handling
//   const orderStatusUpdateMutation = useMutation({
//     mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
//     onSuccess: (data, variables) => {
//       const message = data?.message || "Order status updated successfully!";
//       enqueueSnackbar(message, { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);
//       queryClient.invalidateQueries(["products"]); // Refresh products for inventory

//       // Update table status if order is completed
//       if (variables.orderStatus === "Completed" && order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }

//       // Close confirmation modal
//       setShowConfirmModal(false);
//       setPendingStatus(null);
//     },
//     onError: (error) => {
//       console.error("Error updating order status:", error);
//       const errorMessage = error?.response?.data?.message || error?.message || "Failed to update order status!";
//       enqueueSnackbar(errorMessage, { variant: "error" });
      
//       // Close confirmation modal
//       setShowConfirmModal(false);
//       setPendingStatus(null);
//     },
//   });

//   // ✅ Delete order mutation
//   const deleteOrderMutation = useMutation({
//     mutationFn: (order) => deleteOrder(order._id, order.password),
//     onSuccess: (data, order) => {
//       enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (order.table) {
//         updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
//       }
//     },
//     onError: (error) => {
//       console.error("Error deleting order:", error);
//       enqueueSnackbar("Failed to delete order!", { variant: "error" });
//     },
//   });

//   // ✅ Handle status change with confirmation for critical statuses
//   const handleStatusChange = (newStatus) => {
//     if (newStatus === "delete") {
//       if (window.confirm("Are you sure you want to delete this order?")) {
//         const userRole = getUserRole();

//         if (userRole === "admin") {
//           deleteOrderMutation.mutate({ ...order, password: null });
//         } else {
//           setPasswordAction("delete");
//           setShowPasswordModal(true);
//         }
//       }
//       return;
//     }

//     // Show confirmation for Completed or Cancelled status
//     if (newStatus === "Completed" || newStatus === "Cancelled") {
//       setPendingStatus(newStatus);
//       setShowConfirmModal(true);
//     } else {
//       // Directly update for other statuses
//       orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
//     }
//   };

//   // ✅ Confirm status change
//   const handleConfirmStatusChange = () => {
//     if (pendingStatus) {
//       orderStatusUpdateMutation.mutate({ 
//         orderId: order._id, 
//         orderStatus: pendingStatus 
//       });
//     }
//   };

//   // ✅ Edit order logic - with password protection
//   const handleEditOrder = () => {
//     if (!order?.items?.length) return;

//     const userRole = getUserRole();
//     console.log("🔐 Checking edit permission for role:", userRole);

//     // If admin, proceed directly
//     if (userRole === "admin") {
//       console.log("✅ Admin detected - proceeding directly with edit");
//       proceedWithEdit();
//     } else {
//       console.log("⚠️ Non-admin user - showing password modal");
//       // Show password modal for non-admins
//       setPasswordAction("edit");
//       setShowPasswordModal(true);
//     }
//   };

//   // ✅ Proceed with edit after password verification
//   const proceedWithEdit = () => {
//     dispatch(setEditingMode(true));

//     const itemsForCart = order.items.map((item) => ({
//       id: item.menuItem,
//       dishId: item.menuItem,
//       name: item.name,
//       variationName: item.variationName || null,
//       price: item.pricePerQuantity || item.price,
//       quantity: item.quantity || 1,
//       section: item.section || null,
//     }));

//     dispatch(
//       setCustomer({
//         name: order.customerDetails?.name,
//         phone: order.customerDetails?.phone,
//         guests: order.customerDetails?.guests,
//         orderType: order.customerDetails?.orderType,
//         paymentMethod: order.paymentMethod || "Online",
//         orderId: order.orderId || order._id,
//         table: order.table || null,
//       })
//     );

//     if (order.customerDetails?.orderType === "Delivery") {
//       dispatch(
//         setDeliveryInfo({
//           address: order.deliveryAddress,
//           deliveryBoyId: order.deliveryBoyId,
//           phone: order.customerDetails?.phone,
//           name: order.customerDetails?.name,
//         })
//       );
//     }

//     dispatch(setCartItems(itemsForCart));
//     navigate("/Menu");
//   };

//   // ✅ Confirm password from modal
//   const handleConfirmPassword = async () => {
//     if (!adminPassword) {
//       enqueueSnackbar("Admin password required!", { variant: "error" });
//       return;
//     }

//     if (passwordAction === "delete") {
//       deleteOrderMutation.mutate({ ...order, password: adminPassword });
//       setAdminPassword("");
//       setShowPasswordModal(false);
//       setPasswordAction(null);
//     } else if (passwordAction === "edit") {
//       // Verify password by making API call (you'll need to create this endpoint)
//       try {
//         // For now, we'll use a simple check - you should implement proper backend verification
//         // Example: await verifyAdminPassword(adminPassword);
        
//         // Temporary solution: Check if password matches a stored admin password
//         // IMPORTANT: Replace this with actual API verification
//         const response = await fetch('/api/verify-admin-password', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ password: adminPassword })
//         });

//         if (response.ok) {
//           proceedWithEdit();
//           enqueueSnackbar("Password verified!", { variant: "success" });
//         } else {
//           enqueueSnackbar("Incorrect password!", { variant: "error" });
//         }
//       } catch (error) {
//         enqueueSnackbar("Failed to verify password!", { variant: "error" });
//       }

//       setAdminPassword("");
//       setShowPasswordModal(false);
//       setPasswordAction(null);
//     }
//   };

//   // Get confirmation message based on status
//   const getConfirmationMessage = () => {
//     if (pendingStatus === "Completed") {
//       return {
//         title: "Complete Order?",
//         message: "This will automatically deduct ingredients from inventory. Are you sure?",
//         icon: "✅",
//         color: "blue"
//       };
//     }
//     if (pendingStatus === "Cancelled") {
//       const willRollback = order.orderStatus === "Completed";
//       return {
//         title: "Cancel Order?",
//         message: willRollback 
//           ? "This will roll back the inventory deduction. Are you sure?" 
//           : "Are you sure you want to cancel this order?",
//         icon: "⚠️",
//         color: "red"
//       };
//     }
//     return { title: "", message: "", icon: "", color: "blue" };
//   };

//   const confirmInfo = getConfirmationMessage();

//   // Get password modal title based on action
//   const getPasswordModalTitle = () => {
//     if (passwordAction === "delete") {
//       return "Delete Order - Admin Password Required";
//     }
//     if (passwordAction === "edit") {
//       return "Edit Order - Admin Password Required";
//     }
//     return "Admin Password Required";
//   };

//   const getPasswordModalDescription = () => {
//     if (passwordAction === "delete") {
//       return "Enter admin password to delete this order.";
//     }
//     if (passwordAction === "edit") {
//       return "Enter admin password to edit this order.";
//     }
//     return "Enter admin password to proceed.";
//   };

//   return (
//     <>
//       {/* 🧾 Order Card - Responsive */}
//       <div className="w-full max-w-[450px] bg-[#262626] p-3 sm:p-4 rounded-lg mb-4 h-auto">
//         {/* Header Section */}
//         <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
//           {/* Avatar */}
//           <button className="bg-[#f6b100] p-2 sm:p-2.5 lg:p-3 text-base sm:text-lg lg:text-xl font-bold rounded-lg flex-shrink-0">
//             {getAvatarName(order.customerDetails.name)}
//           </button>

//           {/* Main Content Wrapper */}
//           <div className="flex-1 min-w-0">
//             {/* Customer Info & Actions Container */}
//             <div className="flex flex-col gap-3">
//               {/* Customer Info */}
//               <div className="flex flex-col items-start gap-1">
//                 <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg font-semibold tracking-wide truncate w-full">
//                   {order.customerDetails.name}
//                 </h1>
//                 <p className="text-[#ababab] text-xs sm:text-sm">
//                   #{order.orderId} / {order.customerDetails.orderType}
//                 </p>
//                 {order.table && (
//                   <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                     Table 
//                     <FaLongArrowAltRight className="text-[#ababab] mx-1 sm:mx-2 inline" />
//                     {order.table.tableNo}
//                   </p>
//                 )}
//               </div>

//               {/* Actions & Status Section */}
//               <div className="flex flex-col gap-2">
//                 {/* Action Buttons Row */}
//                 <div className="flex gap-2 flex-wrap">
//                   <button
//                     onClick={handleEditOrder}
//                     className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg flex-shrink-0"
//                     title="Edit Order"
//                   >
//                     <MdEdit size={18} className="sm:w-5 sm:h-5" />
//                   </button>

//                   <select
//                     className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 px-2 py-2 rounded-lg focus:outline-none text-xs sm:text-sm flex-1 min-w-[120px] ${
//                       order.orderStatus === "Ready"
//                         ? "text-green-500"
//                         : order.orderStatus === "Completed"
//                         ? "text-blue-500"
//                         : order.orderStatus === "Cancelled"
//                         ? "text-red-500"
//                         : "text-yellow-500"
//                     }`}
//                     value={order.orderStatus}
//                     onChange={(e) => handleStatusChange(e.target.value)}
//                     disabled={orderStatusUpdateMutation.isLoading}
//                   >
//                     <option className="text-yellow-500" value="In Progress">
//                       In Progress
//                     </option>
//                     <option className="text-green-500" value="Ready">
//                       Ready
//                     </option>
//                     <option className="text-blue-500" value="Completed">
//                       Completed
//                     </option>
//                     <option className="text-red-500" value="Cancelled">
//                       Cancelled
//                     </option>
//                     <option className="text-red-500" value="delete">
//                       Delete Order
//                     </option>
//                   </select>
//                 </div>

//                 {/* Status Indicator */}
//                 <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
//                   {order.orderStatus === "Ready" ? (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-green-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Order Ready</span>
//                     </>
//                   ) : order.orderStatus === "Completed" ? (
//                     <>
//                       <MdFileDownloadDone className="inline mr-1 sm:mr-2 text-blue-600 text-sm sm:text-base flex-shrink-0" />
//                       <span>Order Completed</span>
//                     </>
//                   ) : order.orderStatus === "Cancelled" ? (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-red-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Order Cancelled</span>
//                     </>
//                   ) : (
//                     <>
//                       <FaCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-[8px] sm:text-xs flex-shrink-0" />
//                       <span>Now Cooking</span>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Info */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 text-[#ababab] gap-1 sm:gap-0">
//           <p className="text-xs sm:text-sm">{formatDateAndTme(order.createdAt)}</p>
//           <p className="text-xs sm:text-sm">{order.items.length} Items</p>
//         </div>

//         <hr className="text-[#f5f5f5] mt-3 sm:mt-4 border-t border-gray-500" />

//         {/* Total Section */}
//         <div className="flex items-center justify-between mt-3 sm:mt-4">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold">Total</h1>
//           <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
//             BHD {order.bills.totalWithTax.toFixed(3)}
//           </p>
//         </div>
//       </div>

//       {/* 🔔 Status Change Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//           <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[420px] border border-gray-700">
//             <div className="text-center mb-4">
//               <div className="text-4xl sm:text-5xl mb-3">{confirmInfo.icon}</div>
//               <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
//                 {confirmInfo.title}
//               </h3>
//               <p className="text-sm sm:text-base text-gray-400">
//                 {confirmInfo.message}
//               </p>
//             </div>

//             {orderStatusUpdateMutation.isLoading && (
//               <div className="flex items-center justify-center mb-4">
//                 <div className="w-6 h-6 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin"></div>
//                 <span className="ml-2 text-gray-400 text-sm">Processing...</span>
//               </div>
//             )}

//             <div className="flex justify-end gap-2 sm:gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowConfirmModal(false);
//                   setPendingStatus(null);
//                 }}
//                 disabled={orderStatusUpdateMutation.isLoading}
//                 className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmStatusChange}
//                 disabled={orderStatusUpdateMutation.isLoading}
//                 className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${
//                   confirmInfo.color === "red"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔐 Password Modal - Responsive */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//           <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
//             <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
//               {getPasswordModalTitle()}
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-400 mb-4">
//               {getPasswordModalDescription()}
//             </p>

//             <input
//               type="password"
//               className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter admin password"
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
//             />

//             <div className="flex justify-end gap-2 sm:gap-3">
//               <button
//                 onClick={() => {
//                   setShowPasswordModal(false);
//                   setAdminPassword("");
//                   setPasswordAction(null);
//                 }}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmPassword}
//                 className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-sm sm:text-base transition-colors ${
//                   passwordAction === "delete"
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderCard;


import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { getAvatarName, formatDateAndTme } from "../../utils/index";
import { useDispatch } from "react-redux";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Import the new verification function from your https/index
import { updateOrderStatus, deleteOrder, updateTable, verifyAdminPassword } from "../../https/index"; 
import { enqueueSnackbar } from "notistack";
import { MdFileDownloadDone, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
import { setCartItems } from "../../redux/slice/cartSlice";

const OrderCard = ({ order }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔐 Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  // "delete" or "edit"
  const [passwordAction, setPasswordAction] = useState(null); 

  // 🔔 Confirmation modal for status changes
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // ✅ Get user role from localStorage
  const getUserRole = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user?.role?.toLowerCase().trim() || null;
    } catch (error) {
      console.error("❌ Error getting user role:", error);
      return null;
    }
  };

  // --- MUTATIONS ---

  // ✅ Table update mutation (Unchanged)
  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
    onSuccess: () => {
      enqueueSnackbar("Table status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Error updating table status:", error);
      enqueueSnackbar("Failed to update table status!", { variant: "error" });
    },
  });

  // ✅ Password Verification Mutation (NEW)
  const verifyPasswordMutation = useMutation({
    mutationFn: (password) => verifyAdminPassword(password),
    onSuccess: () => {
      enqueueSnackbar("Password verified!", { variant: "success" });
      if (passwordAction === "edit") {
        proceedWithEdit();
      } else if (passwordAction === "delete") {
        // If password is correct, proceed to delete without asking for it again
        deleteOrderMutation.mutate({ ...order, password: adminPassword });
      }
      // Reset state after success
      setShowPasswordModal(false);
      setAdminPassword("");
      setPasswordAction(null);
    },
    onError: (error) => {
      console.error("Error verifying password:", error);
      const errorMessage = error?.response?.data?.message || "Invalid admin password.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  // ✅ Order status mutation with inventory handling (Unchanged)
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (data, variables) => {
      const message = data?.message || "Order status updated successfully!";
      enqueueSnackbar(message, { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["products"]); // Refresh products for inventory

      if (variables.orderStatus === "Completed" && order.table) {
        updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
      }

      setShowConfirmModal(false);
      setPendingStatus(null);
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update order status!";
      enqueueSnackbar(errorMessage, { variant: "error" });
      
      setShowConfirmModal(false);
      setPendingStatus(null);
    },
  });

  // ✅ Delete order mutation (Unchanged)
  const deleteOrderMutation = useMutation({
    mutationFn: (order) => deleteOrder(order._id, order.password),
    onSuccess: (data, order) => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);

      if (order.table) {
        updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
      }
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    },
  });
  
  // --- HANDLERS ---

  // ✅ Handle status change with confirmation for critical statuses (Unchanged)
  const handleStatusChange = (newStatus) => {
    if (newStatus === "delete") {
      if (window.confirm("Are you sure you want to delete this order?")) {
        const userRole = getUserRole();

        if (userRole === "admin") {
          deleteOrderMutation.mutate({ ...order, password: null });
        } else {
          // Trigger modal for password verification
          setPasswordAction("delete");
          setShowPasswordModal(true);
        }
      }
      return;
    }

    if (newStatus === "Completed" || newStatus === "Cancelled") {
      setPendingStatus(newStatus);
      setShowConfirmModal(true);
    } else {
      orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
    }
  };

  // ✅ Confirm status change (Unchanged)
  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      orderStatusUpdateMutation.mutate({ 
        orderId: order._id, 
        orderStatus: pendingStatus 
      });
    }
  };

  // ✅ Edit order logic - with password protection
  const handleEditOrder = () => {
    if (!order?.items?.length) return;

    const userRole = getUserRole();

    // If admin, proceed directly
    if (userRole === "admin") {
      proceedWithEdit();
    } else {
      // Show password modal for non-admins
      setPasswordAction("edit");
      setShowPasswordModal(true);
    }
  };

  // ✅ Proceed with edit after password verification (Unchanged)
  const proceedWithEdit = () => {
    dispatch(setEditingMode(true));

    const itemsForCart = order.items.map((item) => ({
      orderNo: order.orderNo || null,
      id: item.menuItem,
      dishId: item.menuItem,
      name: item.name,
      variationName: item.variationName || null,
      price: item.pricePerQuantity || item.price,
      quantity: item.quantity || 1,
      section: item.section || null,
    }));

    dispatch(
      setCustomer({
        name: order.customerDetails?.name,
        phone: order.customerDetails?.phone,
        guests: order.customerDetails?.guests,
        orderType: order.customerDetails?.orderType,
        paymentMethod: order.paymentMethod || "Online",
        orderId: order.orderId || order._id,
        orderNo : order.orderNo || null,
        table: order.table || null,
      })
    );

    if (order.customerDetails?.orderType === "Delivery") {
      dispatch(
        setDeliveryInfo({
          address: order.deliveryAddress,
          deliveryBoyId: order.deliveryBoyId,
          phone: order.customerDetails?.phone,
          name: order.customerDetails?.name,
        })
      );
    }

    dispatch(setCartItems(itemsForCart));
    navigate("/Menu");
  };

  // ✅ Confirm password from modal
  const handleConfirmPassword = async () => {
    if (!adminPassword) {
      enqueueSnackbar("Admin password required!", { variant: "error" });
      return;
    }
    
    // Trigger the password verification mutation
    verifyPasswordMutation.mutate(adminPassword);
  };
  
  // Get confirmation message based on status (Unchanged)
  const getConfirmationMessage = () => {
    // ... (unchanged logic)
    if (pendingStatus === "Completed") {
      return {
        title: "Complete Order?",
        message: "This will automatically deduct ingredients from inventory. Are you sure?",
        icon: "✅",
        color: "blue"
      };
    }
    if (pendingStatus === "Cancelled") {
      const willRollback = order.orderStatus === "Completed";
      return {
        title: "Cancel Order?",
        message: willRollback 
          ? "This will roll back the inventory deduction. Are you sure?" 
          : "Are you sure you want to cancel this order?",
        icon: "⚠️",
        color: "red"
      };
    }
    return { title: "", message: "", icon: "", color: "blue" };
  };

  const confirmInfo = getConfirmationMessage();

  // Get password modal title based on action (Unchanged)
  const getPasswordModalTitle = () => {
    if (passwordAction === "delete") {
      return "Delete Order - Admin Password Required";
    }
    if (passwordAction === "edit") {
      return "Edit Order - Admin Password Required";
    }
    return "Admin Password Required";
  };

  const getPasswordModalDescription = () => {
    if (passwordAction === "delete") {
      return "Enter admin password to delete this order.";
    }
    if (passwordAction === "edit") {
      return "Enter admin password to edit this order.";
    }
    return "Enter admin password to proceed.";
  };

  // Check if any critical action is loading
  const isPasswordVerificationLoading = verifyPasswordMutation.isLoading;
  const isOrderDeletionLoading = deleteOrderMutation.isLoading;

  return (
    <>
      {/* 🧾 Order Card - Responsive */}
      {/* ... (rest of the card JSX, unchanged) */}
      <div className="w-full max-w-[450px] bg-[#262626] p-3 sm:p-4 rounded-lg mb-4 h-auto">
        {/* Header Section */}
        <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
          {/* Avatar */}
          <button className="bg-[#f6b100] p-2 sm:p-2.5 lg:p-3 text-base sm:text-lg lg:text-xl font-bold rounded-lg flex-shrink-0">
            {getAvatarName(order.customerDetails.name)}
          </button>

          {/* Main Content Wrapper */}
          <div className="flex-1 min-w-0">
            {/* Customer Info & Actions Container */}
            <div className="flex flex-col gap-3">
              {/* Customer Info */}
              <div className="flex flex-col items-start gap-1">
                <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg font-semibold tracking-wide truncate w-full">
                  {order.customerDetails.name}
                </h1>
                <p className="text-[#ababab] text-xs sm:text-sm">
                  #{order.orderId} / {order.customerDetails.orderType}
                </p>
                <p className="text-[#ababab] text-xs sm:text-sm">
                  #{order.orderNo} 
                </p>
                {order.table && (
                  <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
                    Table 
                    <FaLongArrowAltRight className="text-[#ababab] mx-1 sm:mx-2 inline" />
                    {order.table.tableNo}
                  </p>
                )}
              </div>

              {/* Actions & Status Section */}
              <div className="flex flex-col gap-2">
                {/* Action Buttons Row */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleEditOrder}
                    className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg flex-shrink-0 disabled:opacity-50"
                    title="Edit Order"
                    disabled={orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading}
                  >
                    <MdEdit size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  <select
                    className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 px-2 py-2 rounded-lg focus:outline-none text-xs sm:text-sm flex-1 min-w-[120px] ${
                      order.orderStatus === "Ready"
                        ? "text-green-500"
                        : order.orderStatus === "Completed"
                        ? "text-blue-500"
                        : order.orderStatus === "Cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading}
                  >
                    <option className="text-yellow-500" value="In Progress">
                      In Progress
                    </option>
                    <option className="text-green-500" value="Ready">
                      Ready
                    </option>
                    <option className="text-blue-500" value="Completed">
                      Completed
                    </option>
                    <option className="text-red-500" value="Cancelled">
                      Cancelled
                    </option>
                    <option className="text-red-500" value="delete">
                      Delete Order
                    </option>
                  </select>
                </div>

                {/* Status Indicator */}
                <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
                  {orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading ? (
                      <span className="animate-pulse text-gray-400">Processing action...</span>
                  ) : order.orderStatus === "Ready" ? (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-green-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Order Ready</span>
                    </>
                  ) : order.orderStatus === "Completed" ? (
                    <>
                      <MdFileDownloadDone className="inline mr-1 sm:mr-2 text-blue-600 text-sm sm:text-base flex-shrink-0" />
                      <span>Order Completed</span>
                    </>
                  ) : order.orderStatus === "Cancelled" ? (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-red-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Order Cancelled</span>
                    </>
                  ) : (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Now Cooking</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 text-[#ababab] gap-1 sm:gap-0">
          <p className="text-xs sm:text-sm">{formatDateAndTme(order.createdAt)}</p>
          <p className="text-xs sm:text-sm">{order.items.length} Items</p>
        </div>

        <hr className="text-[#f5f5f5] mt-3 sm:mt-4 border-t border-gray-500" />

        {/* Total Section */}
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold">Total</h1>
          <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
            BHD {order.bills.totalWithTax.toFixed(3)}
          </p>
        </div>
      </div>

      {/* 🔔 Status Change Confirmation Modal (Unchanged) */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[420px] border border-gray-700">
            {/* ... (Modal content) ... */}
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-5xl mb-3">{confirmInfo.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
                {confirmInfo.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {confirmInfo.message}
              </p>
            </div>

            {orderStatusUpdateMutation.isLoading && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-400 text-sm">Processing...</span>
              </div>
            )}

            <div className="flex justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingStatus(null);
                }}
                disabled={orderStatusUpdateMutation.isLoading}
                className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={orderStatusUpdateMutation.isLoading}
                className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${
                  confirmInfo.color === "red"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 Password Modal - Responsive (Updated button states) */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
              {getPasswordModalTitle()}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              {getPasswordModalDescription()}
            </p>

            <input
              type="password"
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
              disabled={isPasswordVerificationLoading || isOrderDeletionLoading}
            />

            {isPasswordVerificationLoading && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-400 text-sm">Verifying...</span>
              </div>
            )}
            
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword("");
                  setPasswordAction(null);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
                disabled={isPasswordVerificationLoading || isOrderDeletionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPassword}
                disabled={isPasswordVerificationLoading || isOrderDeletionLoading}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${
                  passwordAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPasswordVerificationLoading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;