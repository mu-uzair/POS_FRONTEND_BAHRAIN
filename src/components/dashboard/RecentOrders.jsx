// import React, { useState } from "react";
// import { formatDateAndTme } from "../../utils/index";
// import { GrUpdate } from "react-icons/gr";
// import {
//   keepPreviousData,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import {
//   getOrders,
//   updateOrderStatus,
//   updateTable,
//   deleteOrder,
// } from "../../https";
// import { enqueueSnackbar } from "notistack";

// const RecentOrders = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");

//   const orderStatusUpdateMutation = useMutation({
//     mutationFn: ({ orderId, orderStatus }) => {
//       return updateOrderStatus({ orderId, orderStatus });
//     },
//     onSuccess: (data, variables) => {
//       enqueueSnackbar("Order status updated Successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (variables.orderStatus === "Completed" && variables.tableId) {
//         updateTableMutation.mutate({ tableId: variables.tableId, status: "Available" });
//       }
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update order status!", { variant: "error" });
//     },
//   });

//   const updateTableMutation = useMutation({
//     mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//     onSuccess: () => {
//       enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["tables"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update table status!", { variant: "error" });
//     },
//   });

//   const deleteOrderMutation = useMutation({
//     mutationFn: (orderId) => deleteOrder(orderId),
//     onSuccess: () => {
//       enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to delete order!", { variant: "error" });
//     },
//   });

//   const handleStatusChange = ({ orderId, orderStatus, tableId }) => {
//     if (orderStatus === "delete") {
//       if (window.confirm("Are you sure you want to delete this order?")) {
//         deleteOrderMutation.mutate(orderId);
//       }
//     } else {
//       orderStatusUpdateMutation.mutate({ orderId, orderStatus, tableId });
//     }
//   };

//   const { data: resData, isError } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => await getOrders(),
//     placeholderData: keepPreviousData,
//     onError: () => {
//       enqueueSnackbar("Something went wrong!", { variant: "error" });
//     },
//   });

//   const orders = resData?.data?.data || [];

//   // Sort by createdAt (newest first)
//   const sortedOrders = [...orders].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   // Filter orders by search term (customer name or order ID)
//   const filteredOrders = sortedOrders.filter((order) => {
//     const customerName = order.customerDetails?.name?.toLowerCase() || "";
//     const orderId = order.orderId?.orderId?.toLowerCase() || "";
//     return (
//       customerName.includes(searchTerm.toLowerCase()) ||
//       orderId.includes(searchTerm.toLowerCase())
//     );
//   });

//   return (
//     <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
//       <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Recent Orders</h2>

//       {/* 🔍 Search Input */}
//       <input
//         type="text"
//         placeholder="Search by customer or order ID..."
//         className="w-full mb-4 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-[#f5f5f5]">
//           <thead className="bg-[#333] text-[#ababab]">
//             <tr>
//               <th className="p-3">Order ID</th>
//               <th className="p-3">Customer</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Date & Time</th>
//               <th className="p-3">Items</th>
//               <th className="p-3">Table No</th>
//               <th className="p-3">Total</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order, index) => {
//               const orderWithDefaults = {
//                 ...order,
//                 orderType: order.orderType || "Dine-In",
//                 table: order.table || { tableNo: null },
//               };

//               return (
//                 <tr key={index} className="border-b border-gray-600 hover:bg-[#333]">
//                   <td className="p-4">#{order.orderId?.orderId}</td>
//                   <td className="p-4">{order.customerDetails?.name}</td>
//                   <td className="p-4">
//                     <select
//                       className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
//                         order.orderStatus === "Ready"
//                           ? "text-green-500"
//                           : order.orderStatus === "Completed"
//                           ? "text-blue-500"
//                           : "text-yellow-500"
//                       }`}
//                       value={order.orderStatus}
//                       onChange={(e) =>
//                         handleStatusChange({
//                           orderId: order._id,
//                           orderStatus: e.target.value,
//                           tableId: order.table?._id,
//                         })
//                       }
//                     >
//                       <option className="text-yellow-500" value="In Progress">In Progress</option>
//                       <option className="text-green-500" value="Ready">Ready</option>
//                       <option className="text-blue-500" value="Completed">Completed</option>
//                       <option className="text-red-500" value="delete">Delete Order</option>
//                     </select>
//                   </td>
//                   <td className="p-4">{formatDateAndTme(order.createdAt)}</td>
//                   <td className="p-4">{order.items?.length || 0} Items</td>
//                   <td className="p-4">
//                     {orderWithDefaults.orderType === "Dine-In" ? (
//                       orderWithDefaults.table?.tableNo ? (
//                         `Table - ${orderWithDefaults.table.tableNo}`
//                       ) : (
//                         "N/A"
//                       )
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td className="p-4">Rs {order.bills?.totalWithTax}</td>
//                   <td className="p-4 text-center">
//                     <button className="text-blue-400 hover:text-blue-500 transition">
//                       <GrUpdate size={20} />
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center text-gray-400 p-4">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RecentOrders;

// import React, { useState } from "react";
// import { formatDateAndTme } from "../../utils/index";
// import { GrUpdate } from "react-icons/gr";
// import {
//   keepPreviousData,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import {
//   getOrders,
//   updateOrderStatus,
//   updateTable,
//   deleteOrder,
// } from "../../https";
// import { enqueueSnackbar } from "notistack";

// const RecentOrders = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchDate, setSearchDate] = useState(""); // New state for date

//   const orderStatusUpdateMutation = useMutation({
//     mutationFn: ({ orderId, orderStatus }) => {
//       return updateOrderStatus({ orderId, orderStatus });
//     },
//     onSuccess: (data, variables) => {
//       enqueueSnackbar("Order status updated Successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);

//       if (variables.orderStatus === "Completed" && variables.tableId) {
//         updateTableMutation.mutate({ tableId: variables.tableId, status: "Available" });
//       }
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update order status!", { variant: "error" });
//     },
//   });

//   const updateTableMutation = useMutation({
//     mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//     onSuccess: () => {
//       enqueueSnackbar("Table status updated successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["tables"]);
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to update table status!", { variant: "error" });
//     },
//   });

//   const deleteOrderMutation = useMutation({
//     mutationFn: (orderId) => deleteOrder(orderId),
//     onSuccess: () => {
//       enqueueSnackbar("Order deleted successfully!", { variant: "success" });
//       queryClient.invalidateQueries(["orders"]);
      
//     },
//     onError: () => {
//       enqueueSnackbar("Failed to delete order!", { variant: "error" });
//     },
//   });

//   const handleStatusChange = ({ orderId, orderStatus, tableId }) => {
//     if (orderStatus === "delete") {
//       if (window.confirm("Are you sure you want to delete this order?")) {
//         deleteOrderMutation.mutate(orderId);
        
//       }
//     } else {
//       orderStatusUpdateMutation.mutate({ orderId, orderStatus, tableId });
//     }
//   };

//   const { data: resData, isError } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => await getOrders(),
//     placeholderData: keepPreviousData,
//     onError: () => {
//       enqueueSnackbar("Something went wrong!", { variant: "error" });
//     },
//   });

//   const orders = resData?.data?.data || [];

//   // Sort by createdAt (newest first)
//   const sortedOrders = [...orders].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );

//   // Filter orders by search term (customer name or order ID) and date
//   const filteredOrders = sortedOrders.filter((order) => {
//     const customerName = order.customerDetails?.name?.toLowerCase() || "";
//     const orderId = order.orderId?.orderId?.toLowerCase() || "";
//     const orderDate = new Date(order.createdAt).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format

//     const matchesSearchTerm =
//       customerName.includes(searchTerm.toLowerCase()) ||
//       orderId.includes(searchTerm.toLowerCase());
//     const matchesDate = searchDate ? orderDate === searchDate : true;

//     return matchesSearchTerm && matchesDate;
//   });

//   return (
//     <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
//       <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Recent Orders</h2>

//       {/* 🔍 Search Input and Date Input */}
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by customer or order ID..."
//           className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <input
//           type="date"
//           className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-[#f5f5f5]">
//           <thead className="bg-[#333] text-[#ababab]">
//             <tr>
//               <th className="p-3">Order ID</th>
//               <th className="p-3">Customer</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Date & Time</th>
//               <th className="p-3">Items</th>
//               <th className="p-3">Table No</th>
//               <th className="p-3">Total</th>
//               <th className="p-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order, index) => {
//               const orderWithDefaults = {
//                 ...order,
//                 orderType: order.orderType || "Dine-In",
//                 table: order.table || { tableNo: null },
//               };

//               return (
//                 <tr key={index} className="border-b border-gray-600 hover:bg-[#333]">
//                   <td className="p-4">#{order.orderId?.orderId}</td>
//                   <td className="p-4">{order.customerDetails?.name}</td>
//                   <td className="p-4">
//                     <select
//                       className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${order.orderStatus === "Ready"
//                         ? "text-green-500"
//                         : order.orderStatus === "Completed"
//                           ? "text-blue-500"
//                           : "text-yellow-500"
//                         }`}
//                       value={order.orderStatus}
//                       onChange={(e) =>
//                         handleStatusChange({
//                           orderId: order._id,
//                           orderStatus: e.target.value,
//                           tableId: order.table?._id,
//                         })
//                       }
//                     >
//                       <option className="text-yellow-500" value="In Progress">In Progress</option>
//                       <option className="text-green-500" value="Ready">Ready</option>
//                       <option className="text-blue-500" value="Completed">Completed</option>
//                       <option className="text-red-500" value="delete">Delete Order</option>
//                     </select>
//                   </td>
//                   <td className="p-4">{formatDateAndTme(order.createdAt)}</td>
//                   <td className="p-4">{order.items?.length || 0} Items</td>
//                   <td className="p-4">
//                     {orderWithDefaults.orderType === "Dine-In" ? (
//                       orderWithDefaults.table?.tableNo ? (
//                         `Table - ${orderWithDefaults.table.tableNo}`
//                       ) : (
//                         "N/A"
//                       )
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td className="p-4">BHD {order.bills?.totalWithTax}</td>
//                   <td className="p-4 text-center">
//                     <button className="text-blue-400 hover:text-blue-500 transition">
//                       <GrUpdate size={20} />
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center text-gray-400 p-4">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RecentOrders;


import React, { useState } from "react";
import { formatDateAndTme } from "../../utils/index";
import { GrUpdate } from "react-icons/gr";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrders,
  updateOrderStatus,
  updateTable,
  deleteOrder,
} from "../../https";
import { enqueueSnackbar } from "notistack";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Mutation to update table status
  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
    onSuccess: () => {
      enqueueSnackbar("Table status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Table update error:", error);
      enqueueSnackbar("Failed to update table status!", { variant: "error" });
    },
  });

  // Mutation to update order status
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => {
      return updateOrderStatus({ orderId, orderStatus });
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);

      // Update table status if order is completed and has a table
      if (variables.orderStatus === "Completed" && variables.tableId) {
        updateTableMutation.mutate({ 
          tableId: variables.tableId, 
          status: "Available" 
        });
      }
    },
    onError: (error) => {
      console.error("Order status update error:", error);
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  // Mutation to delete order
  const deleteOrderMutation = useMutation({
    mutationFn: ({ orderId, tableId, orderType }) => {
      return deleteOrder(orderId).then((response) => {
        // Return both the response and the metadata for onSuccess
        return { response, tableId, orderType };
      });
    },
    onSuccess: (data) => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
      
      // Update table status if it was a dine-in order with a table
      if (data.tableId && data.orderType === "Dine-In") {
        updateTableMutation.mutate({ 
          tableId: data.tableId, 
          status: "Available" 
        });
      }
    },
    onError: (error) => {
      console.error("Order deletion error:", error);
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    },
  });

  const handleStatusChange = ({ orderId, orderStatus, tableId, orderType }) => {
    if (orderStatus === "delete") {
      if (window.confirm("Are you sure you want to delete this order?")) {
        deleteOrderMutation.mutate({ orderId, tableId, orderType });
      }
    } else {
      orderStatusUpdateMutation.mutate({ orderId, orderStatus, tableId });
    }
  };

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
    onError: (error) => {
      console.error("Fetch orders error:", error);
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    },
  });

  const orders = resData?.data?.data || [];

  // Sort by createdAt (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter orders by search term (customer name or order ID) and date
  const filteredOrders = sortedOrders.filter((order) => {
    const customerName = order.customerDetails?.name?.toLowerCase() || "";
    const orderId = order.orderId?.orderId?.toLowerCase() || "";
    const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

    const matchesSearchTerm =
      customerName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm.toLowerCase());
    const matchesDate = searchDate ? orderDate === searchDate : true;

    return matchesSearchTerm && matchesDate;
  });

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Ready":
        return "text-green-500";
      case "Completed":
        return "text-blue-500";
      case "In Progress":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Recent Orders</h2>

      {/* Search Input and Date Input */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none focus:border-gray-500"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-400 p-4">Loading orders...</div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-400 p-4">
          Failed to load orders. Please try again.
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Items</th>
                <th className="p-3">Table No</th>
                <th className="p-3">Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const orderType = order.orderType || "Dine-In";
                const tableNo = order.table?.tableNo;
                const tableId = order.table?._id;

                return (
                  <tr 
                    key={order._id} 
                    className="border-b border-gray-600 hover:bg-[#333] transition-colors"
                  >
                    <td className="p-4">#{order?.orderId || "N/A"}</td>
                    <td className="p-4">{order.customerDetails?.name || "Guest"}</td>
                    <td className="p-4">
                      <select
                        className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${getStatusColorClass(order.orderStatus)}`}
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange({
                            orderId: order._id,
                            orderStatus: e.target.value,
                            tableId: tableId,
                            orderType: orderType,
                          })
                        }
                        disabled={
                          orderStatusUpdateMutation.isPending || 
                          deleteOrderMutation.isPending
                        }
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
                    </td>
                    <td className="p-4">{formatDateAndTme(order.createdAt)}</td>
                    <td className="p-4">{order.items?.length || 0} Items</td>
                    <td className="p-4">
                      {orderType === "Dine-In" && tableNo
                        ? `Table - ${tableNo}`
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      BHD {order.bills?.totalWithTax?.toFixed(3) || "0.00"}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        className="text-blue-400 hover:text-blue-500 transition"
                        aria-label="Update order"
                      >
                        <GrUpdate size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 p-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;