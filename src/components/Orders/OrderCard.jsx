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

import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { getAvatarName, formatDateAndTme } from "../../utils/index";
import { useSelector, useDispatch } from "react-redux";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus, deleteOrder, updateTable } from "../../https/index";
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

  // ✅ Table update mutation
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

  // ✅ Order status mutation
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (data, variables) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);

      if (variables.orderStatus === "Completed" && order.table) {
        updateTableMutation.mutate({ tableId: order.table._id, status: "Available" });
      }
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  // ✅ Delete order mutation
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

  // ✅ Handle status change (Delete or Update)
  const handleStatusChange = (newStatus) => {
    if (newStatus === "delete") {
      if (window.confirm("Are you sure you want to delete this order?")) {
        const user = JSON.parse(localStorage.getItem("user"));
        const userRole = user?.role?.toLowerCase();

        if (userRole === "admin") {
          deleteOrderMutation.mutate({ ...order, password: null });
        } else {
          setShowPasswordModal(true); // 🔒 Show modal instead of prompt
        }
      }
    } else {
      orderStatusUpdateMutation.mutate({ orderId: order._id, orderStatus: newStatus });
    }
  };

  // ✅ Confirm password from modal
  const handleConfirmDelete = () => {
    if (!adminPassword) {
      enqueueSnackbar("Admin password required!", { variant: "error" });
      return;
    }
    deleteOrderMutation.mutate({ ...order, password: adminPassword });
    setAdminPassword("");
    setShowPasswordModal(false);
  };

  // ✅ Edit order logic
  const handleEditOrder = () => {
    if (!order?.items?.length) return;

    dispatch(setEditingMode(true));

    const itemsForCart = order.items.map((item) => ({
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

  return (
    <>
      {/* 🧾 Order Card */}
      <div className="w-full max-w-[450px] bg-[#262626] p-4 rounded-lg mb-15 h-auto max-h-[230px]">
        <div className="flex items-center gap-5">
          <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
            {getAvatarName(order.customerDetails.name)}
          </button>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                {order.customerDetails.name}
              </h1>
              <p className="text-[#ababab] text-sm">
                #{order.orderId} / {order.customerDetails.orderType}
              </p>
              {order.table && (
                <p className="text-[#ababab] text-sm">
                  Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
                  {order.table.tableNo}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleEditOrder}
                  className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg"
                  title="Edit Order"
                >
                  <MdEdit size={20} />
                </button>

                <select
                  className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
                    order.orderStatus === "Ready"
                      ? "text-green-500"
                      : order.orderStatus === "Completed"
                      ? "text-blue-500"
                      : "text-yellow-500"
                  }`}
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
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
                  <option className="text-red-500" value="delete">
                    Delete Order
                  </option>
                </select>
              </div>

              <p className="text-[#ababab] text-sm">
                {order.orderStatus === "Ready" ? (
                  <>
                    <FaCircle className="inline mr-2 text-green-600" />
                    Order Ready
                  </>
                ) : order.orderStatus === "Completed" ? (
                  <>
                    <MdFileDownloadDone className="inline mr-2 text-blue-600" />
                    Order Completed
                  </>
                ) : (
                  <>
                    <FaCircle className="inline mr-2 text-yellow-600" />
                    Now Cooking
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-[#ababab]">
          <p>{formatDateAndTme(order.createdAt)}</p>
          <p>{order.items.length} Items</p>
        </div>
        <hr className="text-[#f5f5f5] mt-4 border-t-1 border-gray-500" />

        <div className="flex items-center justify-between mt-4">
          <h1 className="text-[#f5f5f5] text-lg semi-bold">Total</h1>
          <p className="text-[#f5f5f5] text-lg font-semi-bold">
            BHD {order.bills.totalWithTax.toFixed(3)}
          </p>
        </div>
      </div>

      {/* 🔐 Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Admin Password Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter admin password to delete this order.
            </p>

            <input
              type="password"
              className="border border-gray-300 rounded w-full p-2 mb-4 focus:outline-none focus:ring focus:ring-red-300"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword("");
                }}
                className="px-3 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
