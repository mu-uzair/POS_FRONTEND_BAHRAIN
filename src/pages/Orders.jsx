// import React, { useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";

// const Orders = () => {
//     const [status, setStatus] = useState("All");
//     const [dateFilter, setDateFilter] = useState("All"); // State for date filtering
//     const [selectedDate, setSelectedDate] = useState(""); // State for custom date selection

//     // Fetch orders using useQuery
//     const { data: resData, isError } = useQuery({
//         queryKey: ["orders"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response); // Log the full API response
//             return response;
//         },
//         placeholderData: keepPreviousData,
//     });

//     // Handle errors
//     if (isError) {
//         enqueueSnackbar("Something went wrong!", { variant: "error" });
//     }


// const ordersArray = resData?.data?.data ?? [];
// const filteredOrders = ordersArray.filter((order) => {
//     // Filter by status
//     if (status !== "All" && order.orderStatus !== status) return false;

//     // Filter by date
//     const orderDate = new Date(order.createdAt).toDateString(); // Convert order date to a readable format
//     const today = new Date().toDateString();
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayDate = yesterday.toDateString();

//     switch (dateFilter) {
//         case "Today":
//             return orderDate === today;
//         case "Yesterday":
//             return orderDate === yesterdayDate;
//         case "Custom":
//             return selectedDate
//                 ? orderDate === new Date(selectedDate).toDateString()
//                 : true; // Show all if no date is selected
//         default:
//             return true; // Show all orders if no date filter is applied
//     }
// });

// // Example: Sort orders so that the newest (latest createdAt) comes first:
// const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));





//     return (
//         <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">

//             {/* Header Section */}
//             <div className="flex items-center justify-between px-10 py-4">
//                 <div className="flex items-center">
//                     <BackButton />
//                     <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
//                         Orders
//                     </h1>
//                 </div>
//                 <div className="flex items-center justify-around gap-4">
//                     {/* Buttons for filtering orders by status */}
//                     <button
//                         onClick={() => setStatus("All")}
//                         className={`text-[#ababab] text-lg ${
//                             status === "All" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         All
//                     </button>

//                     <button
//                         onClick={() => setStatus("In Progress")}
//                         className={`text-[#ababab] text-lg ${
//                             status === "In Progress" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         In Progress
//                     </button>

//                     <button
//                         onClick={() => setStatus("Ready")}
//                         className={`text-[#ababab] text-lg ${
//                             status === "Ready" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         Ready
//                     </button>

//                     <button
//                         onClick={() => setStatus("Completed")}
//                         className={`text-[#ababab] text-lg ${
//                             status === "Completed" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         Completed
//                     </button>
//                 </div>
//             </div>

//             {/* Date Filtering Options */}
//             <div className="flex items-center justify-between px-10 py-4">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => setDateFilter("All")}
//                         className={`text-[#ababab] text-lg ${
//                             dateFilter === "All" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         All Dates
//                     </button>

//                     <button
//                         onClick={() => setDateFilter("Today")}
//                         className={`text-[#ababab] text-lg ${
//                             dateFilter === "Today" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         Today
//                     </button>

//                     <button
//                         onClick={() => setDateFilter("Yesterday")}
//                         className={`text-[#ababab] text-lg ${
//                             dateFilter === "Yesterday" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         Yesterday
//                     </button>

//                     <button
//                         onClick={() => setDateFilter("Custom")}
//                         className={`text-[#ababab] text-lg ${
//                             dateFilter === "Custom" && "bg-[#383838]"
//                         } rounded-lg px-5 py-1 font-semibold tracking-wide`}
//                     >
//                         Custom Date
//                     </button>

//                     {dateFilter === "Custom" && (
//                         <input
//                             type="date"
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                             className="bg-[#383838] text-[#f5f5f5] rounded-lg px-3 py-1"
//                         />
//                     )}
//                 </div>
//             </div>

//             {/* Orders Container (Grid Layout) */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-5 py- hidden-scrollbar overflow-y-auto h-[calc(100vh-5rem-10rem)]">
//             {sortedFilteredOrders?.length > 0 ? (
//     sortedFilteredOrders.map((order) => (
//         <OrderCard key={order._id} order={order} />
//     ))
//                 ) : (
//                     <p className="text-lg text-gray-400 col-span-full">
//                         No orders available
//                     </p>
//                 )}
//             </div>

//             <BottomNav />
//         </section>
//     );
// };

// export default Orders;




// 


// import React, { useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";

// const Orders = () => {
//     const [status, setStatus] = useState("In Progress"); // Set default to In Progress for immediate utility
//     const [dateFilter, setDateFilter] = useState("All"); 
//     const [selectedDate, setSelectedDate] = useState(""); 
//     const [orderType, setOrderType] = useState("All");

//     // Fetch orders using useQuery
//     const { data: resData, isError } = useQuery({
//         queryKey: ["orders"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response); 
//             return response;
//         },
//         placeholderData: keepPreviousData,
//     });

//     if (isError) {
//         enqueueSnackbar("Something went wrong!", { variant: "error" });
//     }

//     const ordersArray = resData?.data?.data ?? [];

//     const filteredOrders = ordersArray.filter((order) => {
//         // Filter by status (Using orderStatus as defined in the initial code)
//         if (status !== "All" && order.orderStatus !== status) return false;

//         // Filter by date
//         const orderDate = new Date(order.createdAt).toDateString(); 
//         const today = new Date().toDateString();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         const yesterdayDate = yesterday.toDateString();

//         switch (dateFilter) {
//             case "Today":
//                 if (orderDate !== today) return false;
//                 break;
//             case "Yesterday":
//                 if (orderDate !== yesterdayDate) return false;
//                 break;
//             case "Custom":
//                 if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) return false;
//                 break;
//             default:
//                 break;
//         }

//         // Filter by orderType
//         if (orderType !== "All" && order.customerDetails?.orderType !== orderType) return false;

//         return true;
//     });

//     // Sort newest orders first
//     const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Calculate the total amount for the currently filtered orders
//     const totalFilteredAmount = sortedFilteredOrders.reduce((sum, order) => {
//         // Only sum up orders that are 'Completed' for financial reports, but for general filtering, 
//         // we sum the total amount for *all* filtered orders regardless of status.
//         const amount = order.bills?.totalWithTax || 0; 
//         return sum + amount;
//     }, 0).toFixed(2);

//     return (
//         <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">

//             {/* 1. Main Header Bar (Title, Back Button, and Total Amount) */}
//             <div className="flex items-center justify-between px-8 py-4 bg-[#1a1a1a] shadow-lg">

//                 {/* Left: Title & Back Button */}
//                 <div className="flex items-center gap-4">
//                     <BackButton />
//                     <h1 className="text-[#f5f5f5] text-3xl font-extrabold tracking-wide">Orders History</h1>
//                 </div>

//                 {/* Right: Total Filtered Amount - Made more prominent */}
//                 <div className="text-[#f5f5f5] text-xl font-bold p-3 rounded-xl bg-[#333333] shadow-inner flex items-center gap-2">
//                     <span className="text-sm font-medium text-[#ababab] uppercase">Total Amount:</span> 
//                     <span className="text-3xl text-[#02ca3a]">BHD {totalFilteredAmount}</span>
//                 </div>
//             </div>

//             {/* 2. Filter Bar (Status, Date, Order Type) */}
//             <div className="flex items-center justify-between px-8 py-3 border-b border-[#333333]">

//                 {/* Left: Status Filter (Segmented Control style) */}
//                 <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md">
//                     {["All", "In Progress", "Ready", "Completed"].map((s) => (
//                         <button
//                             key={s}
//                             onClick={() => setStatus(s)}
//                             className={`text-sm font-semibold transition-all duration-200 ease-in-out px-4 py-2 rounded-lg 
//                                 ${status === s 
//                                     ? "bg-[#02ca3a] text-black shadow-lg" 
//                                     : "text-[#ababab] hover:bg-[#444444]"}`
//                             }
//                         >
//                             {s}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Right: Date and Order Type Filters (Grouped) */}
//                 <div className="flex items-center gap-6">

//                     {/* Date Filters Group */}
//                     <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
//                         {["All", "Today", "Yesterday", "Custom"].map((d) => (
//                             <button
//                                 key={d}
//                                 onClick={() => setDateFilter(d)}
//                                 className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
//                                     ${dateFilter === d 
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner" 
//                                         : "text-[#ababab] hover:bg-[#444444]"}`
//                                 }
//                             >
//                                 {d === "All" ? "All Dates" : d}
//                             </button>
//                         ))}
//                         {dateFilter === "Custom" && (
//                             <input
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => setSelectedDate(e.target.value)}
//                                 className="bg-[#444444] text-[#f5f5f5] rounded-lg px-3 py-1 text-sm border border-[#555555] focus:ring-1 focus:ring-[#02ca3a] focus:border-[#02ca3a]"
//                             />
//                         )}
//                     </div>

//                     {/* Order Type Filters Group */}
//                     <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
//                         {["All", "Dine-In", "Delivery", "Take Away"].map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderType(type)}
//                                 className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
//                                     ${orderType === type 
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner" 
//                                         : "text-[#ababab] hover:bg-[#444444]"}`
//                                 }
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* 3. Orders Container */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-8 py-5 custom-scrollbar overflow-y-auto h-[calc(100vh-5rem-128px)]">
//                 {sortedFilteredOrders?.length > 0 ? (
//                     sortedFilteredOrders.map((order) => (
//                         // Assuming OrderCard is styled appropriately for the dark background
//                         <OrderCard key={order._id} order={order} />
//                     ))
//                 ) : (
//                     <div className="col-span-full flex justify-center items-center h-full min-h-[300px]">
//                         <p className="text-xl text-gray-500">No orders match the current filters.</p>
//                     </div>
//                 )}
//             </div>

//             <BottomNav />
//         </section>
//     );
// };

// export default Orders;

// import React, { useState, useEffect } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";
// // import io from 'socket.io-client';
// import socket from "../socket"; // ✅ import  shared socket instance

// import { useNavigate } from 'react-router-dom';



// // ⚠️ IMPORTANT: Set this to your running backend server URL
// const SOCKET_SERVER_URL = "http://localhost:8000" || "https://pos-backend-bahrain.onrender.com";

// const Orders = () => {
//     const navigate = useNavigate();
//     // TanStack Query Client for invalidation
//     const queryClient = useQueryClient();

//     const [status, setStatus] = useState("In Progress"); // Set default to In Progress for immediate utility
//     const [dateFilter, setDateFilter] = useState("All");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [orderType, setOrderType] = useState("All");

//     // Fetch orders using useQuery
//     const { data: resData, isError } = useQuery({
//         queryKey: ["orders", "all"], // Changed query key to be more general
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//     });

//     if (isError) {
//         enqueueSnackbar("Something went wrong!", { variant: "error" });
//     }

//     // -----------------------------------------------------------
//     // 🟢 IMPLEMENTATION: SOCKET.IO LISTENER FOR REAL-TIME REFRESH
//     // -----------------------------------------------------------
//     useEffect(() => {
//         // const socket = io(SOCKET_SERVER_URL);

//         // Event listener for real-time updates from the server
//         socket.on('orderUpdate', (data) => {
//             console.log("Received real-time order update in Orders page:", data);

//             // Invalidate the 'orders, all' query for ANY action that affects the data
//             if (data.action === 'new_order' ||
//                 data.action === 'items_ready' ||
//                 data.action === 'status_changed' ||
//                 data.action === 'order_modified' ||
//                 data.action === 'order_deleted') {
//                 // Force a refetch of all orders immediately
//                 queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
//                 enqueueSnackbar(`Order list updated in real-time. Action: ${data.action.replace('_', ' ')}`, { variant: "info" });
//             }
//         });

//         // Clean up socket connection on component unmount
//         return () => {
//             // socket.disconnect();
//             socket.off("orderUpdate");
//         };
//     }, [queryClient]);
//     // -----------------------------------------------------------

//     const ordersArray = resData?.data?.data ?? [];

//     const filteredOrders = ordersArray.filter((order) => {
//         // Filter by status 
//         if (status !== "All" && order.orderStatus !== status) return false;

//         // Filter by date
//         const orderDate = new Date(order.createdAt).toDateString();
//         const today = new Date().toDateString();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         const yesterdayDate = yesterday.toDateString();

//         switch (dateFilter) {
//             case "Today":
//                 if (orderDate !== today) return false;
//                 break;
//             case "Yesterday":
//                 if (orderDate !== yesterdayDate) return false;
//                 break;
//             case "Custom":
//                 if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) return false;
//                 break;
//             default:
//                 break;
//         }

//         // Filter by orderType
//         if (orderType !== "All" && order.customerDetails?.orderType !== orderType) return false;

//         return true;
//     });

//     // Sort newest orders first
//     const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Calculate the total amount for the currently filtered orders
//     const totalFilteredAmount = sortedFilteredOrders.reduce((sum, order) => {
//         const amount = order.bills?.totalWithTax || 0;
//         return sum + amount;
//     }, 0).toFixed(2);

//     return (
//         <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">

//             {/* 1. Main Header Bar (Title, Back Button, and Total Amount) */}
//             <div className="flex items-center justify-between px-8 py-4 bg-[#1a1a1a] shadow-lg">

//                 {/* Left: Title & Back Button */}
//                 <div className="flex items-center gap-4">
//                     <BackButton />
//                     <h1 className="text-[#f5f5f5] text-3xl font-extrabold tracking-wide">Orders History</h1>
//                 </div>

//                 {/* Right: Total Filtered Amount - Made more prominent */}
//                 <div className="text-[#f5f5f5] text-xl font-bold p-3 rounded-xl bg-[#333333] shadow-inner flex items-center gap-2">
//                     <span className="text-sm font-medium text-[#ababab] uppercase">Total Amount:</span>
//                     <span className="text-3xl text-[#02ca3a]">BHD {totalFilteredAmount}</span>
//                 </div>
//             </div>

//             {/* 2. Filter Bar (Status, Date, Order Type) */}
//             <div className="flex items-center justify-between px-8 py-3 border-b border-[#333333]">

//                 {/* Left: Status Filter (Segmented Control style) */}
//                 <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md">
//                     {["All", "In Progress", "Ready", "Completed"].map((s) => (
//                         <button
//                             key={s}
//                             onClick={() => setStatus(s)}
//                             className={`text-sm font-semibold transition-all duration-200 ease-in-out px-4 py-2 rounded-lg 
//                                 ${status === s
//                                     ? "bg-[#02ca3a] text-black shadow-lg"
//                                     : "text-[#ababab] hover:bg-[#444444]"}`
//                             }
//                         >
//                             {s}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Right: Date and Order Type Filters (Grouped) */}
//                 <div className="flex items-center gap-6">

//                     {/* Date Filters Group */}
//                     <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
//                         {["All", "Today", "Yesterday", "Custom"].map((d) => (
//                             <button
//                                 key={d}
//                                 onClick={() => setDateFilter(d)}
//                                 className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
//                                     ${dateFilter === d
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                         : "text-[#ababab] hover:bg-[#444444]"}`
//                                 }
//                             >
//                                 {d === "All" ? "All Dates" : d}
//                             </button>
//                         ))}
//                         {dateFilter === "Custom" && (
//                             <input
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => setSelectedDate(e.target.value)}
//                                 className="bg-[#444444] text-[#f5f5f5] rounded-lg px-3 py-1 text-sm border border-[#555555] focus:ring-1 focus:ring-[#02ca3a] focus:border-[#02ca3a]"
//                             />
//                         )}
//                     </div>

//                     {/* Order Type Filters Group */}
//                     <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
//                         {["All", "Dine-In", "Delivery", "Take Away"].map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderType(type)}
//                                 className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
//                                     ${orderType === type
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                         : "text-[#ababab] hover:bg-[#444444]"}`
//                                 }
//                             >
//                                 {type}
//                             </button>

//                         ))}
//                         <button
//                             className="bg-[#02ca3a] text-black font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200"
//                             onClick={() => navigate("/DeliveryMetrics")}
//                         >
//                             Delivery Metrics
//                         </button>
//                     </div>
//                 </div>
//             </div>





//             {/* 3. Orders Container */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-8 py-5 custom-scrollbar overflow-y-auto h-[calc(100vh-5rem-128px)]">
//                 {sortedFilteredOrders?.length > 0 ? (
//                     sortedFilteredOrders.map((order) => (
//                         // Assuming OrderCard is styled appropriately for the dark background
//                         <OrderCard key={order._id} order={order} />
//                     ))
//                 ) : (
//                     <div className="col-span-full flex justify-center items-center h-full min-h-[300px]">
//                         <p className="text-xl text-gray-500">No orders match the current filters.</p>
//                     </div>
//                 )}
//             </div>

//             <BottomNav />
//         </section>
//     );
// };

// export default Orders;


// import React, { useState, useEffect, useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";
// import socket from "../socket"; // ✅ import shared socket instance
// import { useNavigate } from 'react-router-dom';

// const Orders = () => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     // Filter states
//     const [status, setStatus] = useState("In Progress");
//     const [dateFilter, setDateFilter] = useState("Today");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [orderType, setOrderType] = useState("All");

//     // Fetch orders using useQuery
//     const { data: resData, isError, isLoading } = useQuery({
//         queryKey: ["orders", "all"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//         refetchOnWindowFocus: false, // Prevent unnecessary refetches
//         staleTime: 30000, // Consider data fresh for 30 seconds
//     });

//     // Handle errors
//     useEffect(() => {
//         if (isError) {
//             enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
//         }
//     }, [isError]);

//     // 🟢 SOCKET.IO LISTENER FOR REAL-TIME UPDATES
//     useEffect(() => {
//         const handleOrderUpdate = (data) => {
//             console.log("Received real-time order update in Orders page:", data);

//             // Invalidate query for relevant actions
//             const relevantActions = [
//                 'new_order',
//                 'items_ready',
//                 'status_changed',
//                 'order_modified',
//                 'order_deleted'
//             ];

//             if (relevantActions.includes(data.action)) {
//                 queryClient.invalidateQueries({ queryKey: ["orders", "all"] });

//                 // User-friendly notification messages
//                 const actionMessages = {
//                     'new_order': 'New order received',
//                     'items_ready': 'Order items marked ready',
//                     'status_changed': 'Order status updated',
//                     'order_modified': 'Order modified',
//                     'order_deleted': 'Order deleted'
//                 };

//                 enqueueSnackbar(
//                     actionMessages[data.action] || 'Order updated',
//                     { 
//                         variant: data.action === 'new_order' ? 'success' : 'info',
//                         autoHideDuration: 3000
//                     }
//                 );
//             }
//         };

//         socket.on('orderUpdate', handleOrderUpdate);

//         return () => {
//             socket.off('orderUpdate', handleOrderUpdate);
//         };
//     }, [queryClient]);

//     const ordersArray = resData?.data?.data ?? [];

//     // 🧠 Memoized filtered and sorted orders for performance
//     const filteredOrders = useMemo(() => {
//         return ordersArray.filter((order) => {
//             // Status filter
//             if (status !== "All" && order.orderStatus !== status) return false;

//             // Date filter
//             const orderDate = new Date(order.createdAt).toDateString();
//             const today = new Date().toDateString();

//             switch (dateFilter) {
//                 case "Today":
//                     if (orderDate !== today) return false;
//                     break;
//                 case "Yesterday": {
//                     const yesterday = new Date();
//                     yesterday.setDate(yesterday.getDate() - 1);
//                     if (orderDate !== yesterday.toDateString()) return false;
//                     break;
//                 }
//                 case "Custom":
//                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
//                         return false;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             // Order type filter
//             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
//                 return false;
//             }

//             return true;
//         });
//     }, [ordersArray, status, dateFilter, selectedDate, orderType]);

//     // 🧠 Memoized sorted orders
//     const sortedFilteredOrders = useMemo(() => {
//         return [...filteredOrders].sort((a, b) => 
//             new Date(b.createdAt) - new Date(a.createdAt)
//         );
//     }, [filteredOrders]);

//     // 🧠 Memoized total amount calculation
//     const totalFilteredAmount = useMemo(() => {
//         return sortedFilteredOrders.reduce((sum, order) => {
//             const amount = order.bills?.totalWithTax || 0;
//             return sum + amount;
//         }, 0).toFixed(3);
//     }, [sortedFilteredOrders]);

//     // Loading state
//     if (isLoading) {
//         return (
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//                     <p className="text-[#f5f5f5] text-lg">Loading orders...</p>
//                 </div>
//             </section>
//         );
//     }


//     // making it responsive for mobile and tablet

//     return (
//     <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
//         {/* Main Header Bar - Responsive */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg gap-3 sm:gap-0">
//             {/* Left: Title & Back Button */}
//             <div className="flex items-center gap-3 sm:gap-4">
//                 <BackButton />
//                 <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
//                     Orders History
//                 </h1>
//             </div>

//             {/* Right: Total Filtered Amount */}
//             <div className="text-[#f5f5f5] text-base sm:text-xl font-bold p-2 sm:p-3 rounded-xl bg-[#333333] shadow-inner flex items-center gap-2 w-full sm:w-auto">
//                 <span className="text-xs sm:text-sm font-medium text-[#ababab] uppercase">
//                     Total Amount:
//                 </span>
//                 <span className="text-xl sm:text-2xl lg:text-3xl text-[#02ca3a]">
//                     BHD {totalFilteredAmount}
//                 </span>
//             </div>
//         </div>

//         {/* Filter Bar - Responsive with scrolling on mobile */}
//         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
//             {/* Status Filter - Scrollable on mobile */}
//             <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                 <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
//                     {["All", "In Progress", "Ready", "Completed"].map((s) => (
//                         <button
//                             key={s}
//                             onClick={() => setStatus(s)}
//                             className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${
//                                 status === s
//                                     ? "bg-[#02ca3a] text-black shadow-lg"
//                                     : "text-[#ababab] hover:bg-[#444444]"
//                             }`}
//                             aria-pressed={status === s}
//                         >
//                             {s}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Date and Order Type Filters */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                 {/* Date Filters */}
//                 <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                     <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                         {["All", "Today", "Yesterday", "Custom"].map((d) => (
//                             <button
//                                 key={d}
//                                 onClick={() => {
//                                     setDateFilter(d);
//                                     if (d !== "Custom") setSelectedDate("");
//                                 }}
//                                 className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                     dateFilter === d
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                                 aria-pressed={dateFilter === d}
//                             >
//                                 {d === "All" ? "All Dates" : d}
//                             </button>
//                         ))}
//                         {dateFilter === "Custom" && (
//                             <input
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => setSelectedDate(e.target.value)}
//                                 className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
//                                 aria-label="Select custom date"
//                             />
//                         )}
//                     </div>
//                 </div>

//                 {/* Order Type Filters */}
//                 <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                     <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                         {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderType(type)}
//                                 className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                     orderType === type
//                                         ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                                 aria-pressed={orderType === type}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                         <button
//                             className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
//                             onClick={() => navigate("/DeliveryMetrics")}
//                             aria-label="View delivery metrics"
//                         >
//                             Delivery Metrics
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         {/* Orders Grid - Fixed height removed, added proper padding */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
//             {sortedFilteredOrders.length > 0 ? (
//                 sortedFilteredOrders.map((order) => (
//                     <OrderCard key={order._id} order={order} />
//                 ))
//             ) : (
//                 <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
//                     <svg
//                         className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                         />
//                     </svg>
//                     <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">
//                         No orders match the current filters
//                     </p>
//                     <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">
//                         Try adjusting your filter settings
//                     </p>
//                 </div>
//             )}
//         </div>

//         <BottomNav />
//     </section>
// );
// };

// export default Orders;

// import React, { useState, useEffect, useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";
// import socket from "../socket";
// import { useNavigate } from 'react-router-dom';

// const Orders = () => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     // Filter states
//     const [status, setStatus] = useState("In Progress");
//     const [dateFilter, setDateFilter] = useState("Today");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [orderType, setOrderType] = useState("All");
//     const [paymentMethod, setPaymentMethod] = useState("All"); // ✅ NEW: Payment method filter

//     // Fetch orders using useQuery
//     const { data: resData, isError, isLoading } = useQuery({
//         queryKey: ["orders", "all"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//         refetchOnWindowFocus: false,
//         staleTime: 30000,
//     });

//     // Handle errors
//     useEffect(() => {
//         if (isError) {
//             enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
//         }
//     }, [isError]);

//     // 🟢 SOCKET.IO LISTENER FOR REAL-TIME UPDATES
//     useEffect(() => {
//         const handleOrderUpdate = (data) => {
//             console.log("Received real-time order update in Orders page:", data);

//             const relevantActions = [
//                 'new_order',
//                 'items_ready',
//                 'status_changed',
//                 'order_modified',
//                 'order_deleted'
//             ];

//             if (relevantActions.includes(data.action)) {
//                 queryClient.invalidateQueries({ queryKey: ["orders", "all"] });

//                 const actionMessages = {
//                     'new_order': 'New order received',
//                     'items_ready': 'Order items marked ready',
//                     'status_changed': 'Order status updated',
//                     'order_modified': 'Order modified',
//                     'order_deleted': 'Order deleted'
//                 };

//                 enqueueSnackbar(
//                     actionMessages[data.action] || 'Order updated',
//                     { 
//                         variant: data.action === 'new_order' ? 'success' : 'info',
//                         autoHideDuration: 3000
//                     }
//                 );
//             }
//         };

//         socket.on('orderUpdate', handleOrderUpdate);

//         return () => {
//             socket.off('orderUpdate', handleOrderUpdate);
//         };
//     }, [queryClient]);

//     const ordersArray = resData?.data?.data ?? [];

//     // 🧠 Memoized filtered and sorted orders for performance
//     const filteredOrders = useMemo(() => {
//         return ordersArray.filter((order) => {
//             // Status filter
//             if (status !== "All" && order.orderStatus !== status) return false;

//             // Date filter
//             const orderDate = new Date(order.createdAt).toDateString();
//             const today = new Date().toDateString();

//             switch (dateFilter) {
//                 case "Today":
//                     if (orderDate !== today) return false;
//                     break;
//                 case "Yesterday": {
//                     const yesterday = new Date();
//                     yesterday.setDate(yesterday.getDate() - 1);
//                     if (orderDate !== yesterday.toDateString()) return false;
//                     break;
//                 }
//                 case "Custom":
//                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
//                         return false;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             // Order type filter
//             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
//                 return false;
//             }

//             // ✅ NEW: Payment method filter
//             if (paymentMethod !== "All" && order.paymentMethod !== paymentMethod) {
//                 return false;
//             }

//             return true;
//         });
//     }, [ordersArray, status, dateFilter, selectedDate, orderType, paymentMethod]);

//     // 🧠 Memoized sorted orders
//     const sortedFilteredOrders = useMemo(() => {
//         return [...filteredOrders].sort((a, b) => 
//             new Date(b.createdAt) - new Date(a.createdAt)
//         );
//     }, [filteredOrders]);

//     // 🧠 Calculate payment method totals (showing all three always)
//     const paymentTotals = useMemo(() => {
//         const totals = {
//             Cash: 0,
//             Online: 0,
//             Benefit: 0
//         };

//         // Calculate based on currently filtered orders (date, status, orderType filters)
//         // but NOT payment method filter
//         ordersArray.forEach((order) => {
//             // Apply same filters except payment method
//             if (status !== "All" && order.orderStatus !== status) return;

//             const orderDate = new Date(order.createdAt).toDateString();
//             const today = new Date().toDateString();

//             switch (dateFilter) {
//                 case "Today":
//                     if (orderDate !== today) return;
//                     break;
//                 case "Yesterday": {
//                     const yesterday = new Date();
//                     yesterday.setDate(yesterday.getDate() - 1);
//                     if (orderDate !== yesterday.toDateString()) return;
//                     break;
//                 }
//                 case "Custom":
//                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
//                         return;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
//                 return;
//             }

//             // Add to respective payment method total
//             const method = order.paymentMethod;
//             const amount = order.bills?.totalWithTax || 0;

//             if (method === "Cash") totals.Cash += amount;
//             else if (method === "Online") totals.Online += amount;
//             else if (method === "Benefit") totals.Benefit += amount;
//         });

//         return {
//             Cash: totals.Cash.toFixed(3),
//             Online: totals.Online.toFixed(3),
//             Benefit: totals.Benefit.toFixed(3),
//             Total: (totals.Cash + totals.Online + totals.Benefit).toFixed(3)
//         };
//     }, [ordersArray, status, dateFilter, selectedDate, orderType]);

//     // 🧠 Total for currently selected payment method
//     const selectedPaymentTotal = useMemo(() => {
//         if (paymentMethod === "All") {
//             return paymentTotals.Total;
//         }
//         return paymentTotals[paymentMethod] || "0.000";
//     }, [paymentMethod, paymentTotals]);

//     // Loading state
//     if (isLoading) {
//         return (
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//                     <p className="text-[#f5f5f5] text-lg">Loading orders...</p>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
//             {/* Main Header Bar - Responsive */}
//             <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg gap-3">
//                 {/* Top Row: Title & Back Button */}
//                 <div className="flex items-center gap-3 sm:gap-4">
//                     <BackButton />
//                     <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
//                         Orders History
//                     </h1>
//                 </div>

//                 {/* ✅ NEW: Payment Method Totals Grid */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//                     {/* Cash Total */}
//                     <div 
//                         onClick={() => setPaymentMethod("Cash")}
//                         className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
//                             paymentMethod === "Cash" 
//                                 ? "bg-[#02ca3a] shadow-lg" 
//                                 : "bg-[#333333] hover:bg-[#444444]"
//                         }`}
//                     >
//                         <p className={`text-xs font-medium uppercase mb-1 ${
//                             paymentMethod === "Cash" ? "text-black" : "text-[#ababab]"
//                         }`}>
//                             Cash
//                         </p>
//                         <p className={`text-lg sm:text-xl font-bold ${
//                             paymentMethod === "Cash" ? "text-black" : "text-[#02ca3a]"
//                         }`}>
//                             {paymentTotals.Cash}
//                         </p>
//                     </div>

//                     {/* Online Total */}
//                     <div 
//                         onClick={() => setPaymentMethod("Online")}
//                         className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
//                             paymentMethod === "Online" 
//                                 ? "bg-[#02ca3a] shadow-lg" 
//                                 : "bg-[#333333] hover:bg-[#444444]"
//                         }`}
//                     >
//                         <p className={`text-xs font-medium uppercase mb-1 ${
//                             paymentMethod === "Online" ? "text-black" : "text-[#ababab]"
//                         }`}>
//                             Online
//                         </p>
//                         <p className={`text-lg sm:text-xl font-bold ${
//                             paymentMethod === "Online" ? "text-black" : "text-[#02ca3a]"
//                         }`}>
//                             {paymentTotals.Online}
//                         </p>
//                     </div>

//                     {/* Benefit Total */}
//                     <div 
//                         onClick={() => setPaymentMethod("Benefit")}
//                         className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
//                             paymentMethod === "Benefit" 
//                                 ? "bg-[#02ca3a] shadow-lg" 
//                                 : "bg-[#333333] hover:bg-[#444444]"
//                         }`}
//                     >
//                         <p className={`text-xs font-medium uppercase mb-1 ${
//                             paymentMethod === "Benefit" ? "text-black" : "text-[#ababab]"
//                         }`}>
//                             Benefit
//                         </p>
//                         <p className={`text-lg sm:text-xl font-bold ${
//                             paymentMethod === "Benefit" ? "text-black" : "text-[#02ca3a]"
//                         }`}>
//                             {paymentTotals.Benefit}
//                         </p>
//                     </div>

//                     {/* Total Amount (All) */}
//                     <div 
//                         onClick={() => setPaymentMethod("All")}
//                         className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
//                             paymentMethod === "All" 
//                                 ? "bg-[#02ca3a] shadow-lg" 
//                                 : "bg-[#333333] hover:bg-[#444444]"
//                         }`}
//                     >
//                         <p className={`text-xs font-medium uppercase mb-1 ${
//                             paymentMethod === "All" ? "text-black" : "text-[#ababab]"
//                         }`}>
//                             Total
//                         </p>
//                         <p className={`text-lg sm:text-xl font-bold ${
//                             paymentMethod === "All" ? "text-black" : "text-[#02ca3a]"
//                         }`}>
//                             {paymentTotals.Total}
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Filter Bar - Responsive with scrolling on mobile */}
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
//                 {/* Status Filter - Scrollable on mobile */}
//                 <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                     <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
//                         {["All", "In Progress", "Ready", "Completed"].map((s) => (
//                             <button
//                                 key={s}
//                                 onClick={() => setStatus(s)}
//                                 className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${
//                                     status === s
//                                         ? "bg-[#02ca3a] text-black shadow-lg"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                                 aria-pressed={status === s}
//                             >
//                                 {s}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Date and Order Type Filters */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                     {/* Date Filters */}
//                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                             {["All", "Today", "Yesterday", "Custom"].map((d) => (
//                                 <button
//                                     key={d}
//                                     onClick={() => {
//                                         setDateFilter(d);
//                                         if (d !== "Custom") setSelectedDate("");
//                                     }}
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                         dateFilter === d
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                     aria-pressed={dateFilter === d}
//                                 >
//                                     {d === "All" ? "All Dates" : d}
//                                 </button>
//                             ))}
//                             {dateFilter === "Custom" && (
//                                 <input
//                                     type="date"
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
//                                     aria-label="Select custom date"
//                                 />
//                             )}
//                         </div>
//                     </div>

//                     {/* Order Type Filters */}
//                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                             {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
//                                 <button
//                                     key={type}
//                                     onClick={() => setOrderType(type)}
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                         orderType === type
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                     aria-pressed={orderType === type}
//                                 >
//                                     {type}
//                                 </button>
//                             ))}
//                             <button
//                                 className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
//                                 onClick={() => navigate("/DeliveryMetrics")}
//                                 aria-label="View delivery metrics"
//                             >
//                                 Delivery Metrics
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Orders Grid - Fixed height removed, added proper padding */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
//                 {sortedFilteredOrders.length > 0 ? (
//                     sortedFilteredOrders.map((order) => (
//                         <OrderCard key={order._id} order={order} />
//                     ))
//                 ) : (
//                     <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
//                         <svg
//                             className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                             />
//                         </svg>
//                         <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">
//                             No orders match the current filters
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">
//                             Try adjusting your filter settings
//                         </p>
//                     </div>
//                 )}
//             </div>

//             <BottomNav />
//         </section>
//     );
// };

// export default Orders;


// import React, { useState, useEffect, useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getOrders } from "../https/index";
// import { enqueueSnackbar } from "notistack";
// import socket from "../socket";
// import { useNavigate } from 'react-router-dom';
// import { ChevronDown } from 'lucide-react';

// const Orders = () => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     // Filter states
//     const [status, setStatus] = useState("In Progress");
//     const [dateFilter, setDateFilter] = useState("Today");
//     const [selectedDate, setSelectedDate] = useState("");
//     const [orderType, setOrderType] = useState("All");
//     const [paymentMethod, setPaymentMethod] = useState("All");
//     const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

//     // Fetch orders using useQuery
//     const { data: resData, isError, isLoading } = useQuery({
//         queryKey: ["orders", "all"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//         refetchOnWindowFocus: false,
//         staleTime: 30000,
//     });

//     // Handle errors
//     useEffect(() => {
//         if (isError) {
//             enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
//         }
//     }, [isError]);

//     // Socket.IO listener for real-time updates
//     useEffect(() => {
//         const handleOrderUpdate = (data) => {
//             console.log("Received real-time order update in Orders page:", data);

//             const relevantActions = [
//                 'new_order',
//                 'items_ready',
//                 'status_changed',
//                 'order_modified',
//                 'order_deleted'
//             ];

//             if (relevantActions.includes(data.action)) {
//                 queryClient.invalidateQueries({ queryKey: ["orders", "all"] });

//                 const actionMessages = {
//                     'new_order': 'New order received',
//                     'items_ready': 'Order items marked ready',
//                     'status_changed': 'Order status updated',
//                     'order_modified': 'Order modified',
//                     'order_deleted': 'Order deleted'
//                 };

//                 enqueueSnackbar(
//                     actionMessages[data.action] || 'Order updated',
//                     { 
//                         variant: data.action === 'new_order' ? 'success' : 'info',
//                         autoHideDuration: 3000
//                     }
//                 );
//             }
//         };

//         socket.on('orderUpdate', handleOrderUpdate);

//         return () => {
//             socket.off('orderUpdate', handleOrderUpdate);
//         };
//     }, [queryClient]);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (isPaymentDropdownOpen && !event.target.closest('.payment-dropdown')) {
//                 setIsPaymentDropdownOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, [isPaymentDropdownOpen]);

//     const ordersArray = resData?.data?.data ?? [];

//     // Memoized filtered and sorted orders
//     const filteredOrders = useMemo(() => {
//         return ordersArray.filter((order) => {
//             // Status filter
//             if (status !== "All" && order.orderStatus !== status) return false;

//             // Date filter
//             const orderDate = new Date(order.createdAt).toDateString();
//             const today = new Date().toDateString();

//             switch (dateFilter) {
//                 case "Today":
//                     if (orderDate !== today) return false;
//                     break;
//                 case "Yesterday": {
//                     const yesterday = new Date();
//                     yesterday.setDate(yesterday.getDate() - 1);
//                     if (orderDate !== yesterday.toDateString()) return false;
//                     break;
//                 }
//                 case "Custom":
//                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
//                         return false;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             // Order type filter
//             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
//                 return false;
//             }

//             // Payment method filter
//             if (paymentMethod !== "All" && order.paymentMethod !== paymentMethod) {
//                 return false;
//             }

//             return true;
//         });
//     }, [ordersArray, status, dateFilter, selectedDate, orderType, paymentMethod]);

//     // Memoized sorted orders
//     const sortedFilteredOrders = useMemo(() => {
//         return [...filteredOrders].sort((a, b) => 
//             new Date(b.createdAt) - new Date(a.createdAt)
//         );
//     }, [filteredOrders]);

//     // Calculate payment method totals
//     const paymentTotals = useMemo(() => {
//         const totals = {
//             Cash: 0,
//             Online: 0,
//             Benefit: 0
//         };

//         // Calculate based on currently filtered orders (excluding payment method filter)
//         ordersArray.forEach((order) => {
//             if (status !== "All" && order.orderStatus !== status) return;

//             const orderDate = new Date(order.createdAt).toDateString();
//             const today = new Date().toDateString();

//             switch (dateFilter) {
//                 case "Today":
//                     if (orderDate !== today) return;
//                     break;
//                 case "Yesterday": {
//                     const yesterday = new Date();
//                     yesterday.setDate(yesterday.getDate() - 1);
//                     if (orderDate !== yesterday.toDateString()) return;
//                     break;
//                 }
//                 case "Custom":
//                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
//                         return;
//                     }
//                     break;
//                 default:
//                     break;
//             }

//             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
//                 return;
//             }

//             const method = order.paymentMethod;
//             const amount = order.bills?.totalWithTax || 0;

//             if (method === "Cash") totals.Cash += amount;
//             else if (method === "Online") totals.Online += amount;
//             else if (method === "Benefit") totals.Benefit += amount;
//         });

//         return {
//             Cash: totals.Cash.toFixed(3),
//             Online: totals.Online.toFixed(3),
//             Benefit: totals.Benefit.toFixed(3),
//             Total: (totals.Cash + totals.Online + totals.Benefit).toFixed(3)
//         };
//     }, [ordersArray, status, dateFilter, selectedDate, orderType]);

//     // Total for currently selected payment method
//     const selectedPaymentTotal = useMemo(() => {
//         if (paymentMethod === "All") {
//             return paymentTotals.Total;
//         }
//         return paymentTotals[paymentMethod] || "0.000";
//     }, [paymentMethod, paymentTotals]);

//     // Payment method options
//     const paymentOptions = [
//         { value: "All", label: "All Payments", amount: paymentTotals.Total },
//         { value: "Cash", label: "Cash", amount: paymentTotals.Cash },
//         { value: "Online", label: "Online", amount: paymentTotals.Online },
//         { value: "Benefit", label: "Benefit", amount: paymentTotals.Benefit }
//     ];

//     const handlePaymentSelect = (value) => {
//         setPaymentMethod(value);
//         setIsPaymentDropdownOpen(false);
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//                     <p className="text-[#f5f5f5] text-lg">Loading orders...</p>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
//             {/* Main Header Bar */}
//             <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg">
//                 <div className="flex items-center gap-3 sm:gap-4">
//                     <BackButton />
//                     <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
//                         Orders History
//                     </h1>
//                 </div>

//                 {/* Payment Total with Dropdown */}
//                 <div className="relative payment-dropdown">
//                     <button
//                         onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
//                         className="flex items-center gap-2 bg-[#02ca3a] hover:bg-[#03e94a] text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-200"
//                     >
//                         <div className="text-left">
//                             <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-90">
//                                 {paymentMethod === "All" ? "Total Amount" : paymentMethod}
//                             </p>
//                             <p className="text-base sm:text-lg lg:text-xl font-extrabold">
//                                 {selectedPaymentTotal}
//                             </p>
//                         </div>
//                         <ChevronDown 
//                             className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
//                                 isPaymentDropdownOpen ? 'rotate-180' : ''
//                             }`}
//                         />
//                     </button>

//                     {/* Dropdown Menu */}
//                     {isPaymentDropdownOpen && (
//                         <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#2a2a2a] rounded-xl shadow-2xl border border-[#444444] overflow-hidden z-50">
//                             {paymentOptions.map((option, index) => (
//                                 <button
//                                     key={option.value}
//                                     onClick={() => handlePaymentSelect(option.value)}
//                                     className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#333333] transition-colors ${
//                                         index !== paymentOptions.length - 1 ? 'border-b border-[#383838]' : ''
//                                     } ${paymentMethod === option.value ? 'bg-[#333333]' : ''}`}
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className={`w-2 h-2 rounded-full ${
//                                             paymentMethod === option.value ? 'bg-[#02ca3a]' : 'bg-transparent border border-[#555555]'
//                                         }`}></div>
//                                         <span className={`text-sm font-medium ${
//                                             paymentMethod === option.value ? 'text-[#02ca3a]' : 'text-[#f5f5f5]'
//                                         }`}>
//                                             {option.label}
//                                         </span>
//                                     </div>
//                                     <span className={`text-sm font-bold ${
//                                         paymentMethod === option.value ? 'text-[#02ca3a]' : 'text-[#ababab]'
//                                     }`}>
//                                         {option.amount}
//                                     </span>
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Filter Bar */}
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
//                 {/* Status Filter */}
//                 <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                     <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
//                         {["All", "In Progress", "Ready", "Completed"].map((s) => (
//                             <button
//                                 key={s}
//                                 onClick={() => setStatus(s)}
//                                 className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${
//                                     status === s
//                                         ? "bg-[#02ca3a] text-black shadow-lg"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                                 aria-pressed={status === s}
//                             >
//                                 {s}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Date and Order Type Filters */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
//                     {/* Date Filters */}
//                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                             {["All", "Today", "Yesterday", "Custom"].map((d) => (
//                                 <button
//                                     key={d}
//                                     onClick={() => {
//                                         setDateFilter(d);
//                                         if (d !== "Custom") setSelectedDate("");
//                                     }}
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                         dateFilter === d
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                     aria-pressed={dateFilter === d}
//                                 >
//                                     {d === "All" ? "All Dates" : d}
//                                 </button>
//                             ))}
//                             {dateFilter === "Custom" && (
//                                 <input
//                                     type="date"
//                                     value={selectedDate}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
//                                     aria-label="Select custom date"
//                                 />
//                             )}
//                         </div>
//                     </div>

//                     {/* Order Type Filters */}
//                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
//                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
//                             {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
//                                 <button
//                                     key={type}
//                                     onClick={() => setOrderType(type)}
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${
//                                         orderType === type
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                     aria-pressed={orderType === type}
//                                 >
//                                     {type}
//                                 </button>
//                             ))}
//                             <button
//                                 className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
//                                 onClick={() => navigate("/DeliveryMetrics")}
//                                 aria-label="View delivery metrics"
//                             >
//                                 Delivery Metrics
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Orders Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
//                 {sortedFilteredOrders.length > 0 ? (
//                     sortedFilteredOrders.map((order) => (
//                         <OrderCard key={order._id} order={order} />
//                     ))
//                 ) : (
//                     <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
//                         <svg
//                             className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                             />
//                         </svg>
//                         <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">
//                             No orders match the current filters
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">
//                             Try adjusting your filter settings
//                         </p>
//                     </div>
//                 )}
//             </div>

//             <BottomNav />
//         </section>
//     );
// };

// export default Orders;

import React, { useState, useEffect, useMemo } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getOrders, verifyAdminPassword } from "../https/index";
import { enqueueSnackbar } from "notistack";
import socket from "../socket";
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye } from 'lucide-react';

const Orders = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Filter states
    const [status, setStatus] = useState("In Progress");
    const [dateFilter, setDateFilter] = useState("Today");
    const [selectedDate, setSelectedDate] = useState("");
    const [orderType, setOrderType] = useState("All");
    const [paymentMethod, setPaymentMethod] = useState("All");
    const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

    // Password modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

    // Get user role from localStorage
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

    // Password verification mutation
    const verifyPasswordMutation = useMutation({
        mutationFn: (password) => verifyAdminPassword(password),
        onSuccess: () => {
            enqueueSnackbar("Password verified!", { variant: "success" });
            setShowPasswordModal(false);
            setAdminPassword("");
            setShowDetailedBreakdown(true);
        },
        onError: (error) => {
            console.error("Error verifying password:", error);
            const errorMessage = error?.response?.data?.message || "Invalid admin password.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        },
    });

    // Fetch orders using useQuery
    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders", "all"],
        queryFn: async () => {
            const response = await getOrders();
            console.log("Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: 30000,
    });

    // Handle errors
    useEffect(() => {
        if (isError) {
            enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
        }
    }, [isError]);

    // Socket.IO listener for real-time updates
    useEffect(() => {
        const handleOrderUpdate = (data) => {
            console.log("Received real-time order update in Orders page:", data);

            const relevantActions = [
                'new_order',
                'items_ready',
                'status_changed',
                'order_modified',
                'order_deleted'
            ];

            if (relevantActions.includes(data.action)) {
                queryClient.invalidateQueries({ queryKey: ["orders", "all"] });

                const actionMessages = {
                    'new_order': 'New order received',
                    'items_ready': 'Order items marked ready',
                    'status_changed': 'Order status updated',
                    'order_modified': 'Order modified',
                    'order_deleted': 'Order deleted'
                };

                enqueueSnackbar(
                    actionMessages[data.action] || 'Order updated',
                    {
                        variant: data.action === 'new_order' ? 'success' : 'info',
                        autoHideDuration: 3000
                    }
                );
            }
        };

        socket.on('orderUpdate', handleOrderUpdate);

        return () => {
            socket.off('orderUpdate', handleOrderUpdate);
        };
    }, [queryClient]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPaymentDropdownOpen && !event.target.closest('.payment-dropdown')) {
                setIsPaymentDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPaymentDropdownOpen]);

    const ordersArray = resData?.data?.data ?? [];

    // Memoized filtered and sorted orders
    const filteredOrders = useMemo(() => {
        return ordersArray.filter((order) => {
            // Status filter
            if (status !== "All" && order.orderStatus !== status) return false;

            // Date filter
            const orderDate = new Date(order.createdAt).toDateString();
            const today = new Date().toDateString();

            switch (dateFilter) {
                case "Today":
                    if (orderDate !== today) return false;
                    break;
                case "Yesterday": {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (orderDate !== yesterday.toDateString()) return false;
                    break;
                }
                case "Custom":
                    if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
                        return false;
                    }
                    break;
                default:
                    break;
            }

            // Order type filter
            if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
                return false;
            }

            // Payment method filter
            if (paymentMethod !== "All" && order.paymentMethod !== paymentMethod) {
                return false;
            }

            return true;
        });
    }, [ordersArray, status, dateFilter, selectedDate, orderType, paymentMethod]);

    // Memoized sorted orders
    const sortedFilteredOrders = useMemo(() => {
        return [...filteredOrders].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [filteredOrders]);

    // Calculate payment method totals
    const paymentTotals = useMemo(() => {
        const totals = {
            Cash: 0,
            Online: 0,
            Benefit: 0
        };

        ordersArray.forEach((order) => {
            if (status !== "All" && order.orderStatus !== status) return;

            const orderDate = new Date(order.createdAt).toDateString();
            const today = new Date().toDateString();

            switch (dateFilter) {
                case "Today":
                    if (orderDate !== today) return;
                    break;
                case "Yesterday": {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (orderDate !== yesterday.toDateString()) return;
                    break;
                }
                case "Custom":
                    if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
                        return;
                    }
                    break;
                default:
                    break;
            }

            if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
                return;
            }

            const method = order.paymentMethod;
            const amount = order.bills?.totalWithTax || 0;

            if (method === "Cash") totals.Cash += amount;
            else if (method === "Online") totals.Online += amount;
            else if (method === "Benefit") totals.Benefit += amount;
        });

        return {
            Cash: totals.Cash.toFixed(3),
            Online: totals.Online.toFixed(3),
            Benefit: totals.Benefit.toFixed(3),
            Total: (totals.Cash + totals.Online + totals.Benefit).toFixed(3)
        };
    }, [ordersArray, status, dateFilter, selectedDate, orderType]);

    // Total for currently selected payment method
    const selectedPaymentTotal = useMemo(() => {
        if (paymentMethod === "All") {
            return paymentTotals.Total;
        }
        return paymentTotals[paymentMethod] || "0.000";
    }, [paymentMethod, paymentTotals]);

    // Payment method options
    const paymentOptions = [
        { value: "All", label: "All Payments", amount: paymentTotals.Total },
        { value: "Cash", label: "Cash", amount: paymentTotals.Cash },
        { value: "Online", label: "Online", amount: paymentTotals.Online },
        { value: "Benefit", label: "Benefit", amount: paymentTotals.Benefit }
    ];

    const handlePaymentSelect = (value) => {
        setPaymentMethod(value);
        setIsPaymentDropdownOpen(false);
    };

    // Handle view details click
    const handleViewDetails = () => {
        const userRole = getUserRole();

        if (userRole === "admin") {
            // Admin - show directly
            setShowDetailedBreakdown(true);
        } else {
            // Non-admin - show password modal
            setShowPasswordModal(true);
        }
    };

    // Confirm password
    const handleConfirmPassword = () => {
        if (!adminPassword) {
            enqueueSnackbar("Admin password required!", { variant: "error" });
            return;
        }
        verifyPasswordMutation.mutate(adminPassword);
    };

    // Loading state
    if (isLoading) {
        return (
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
                    <p className="text-[#f5f5f5] text-lg">Loading orders...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
            {/* Main Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
                        Orders History
                    </h1>
                </div>

                {/* Payment Total with Dropdown & View Details */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Total Amount Label with Eye Button */}
                    <div className="flex items-center gap-2 bg-[#333333] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg">
                        <span className="text-[#f5f5f5] text-sm sm:text-base font-semibold">
                            Total Amount:
                        </span>
                        <button
                            onClick={handleViewDetails}
                            className="bg-[#444444] hover:bg-[#555555] text-[#02ca3a] p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                            title="View detailed breakdown"
                        >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Show total amount ONLY after password verification OR if admin */}
                    {(getUserRole() === "admin" || showDetailedBreakdown) && (
                        <div className="bg-[#02ca3a] text-black font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg">
                            <div className="text-left">
                                <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-90">
                                    Total Amount
                                </p>
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold">
                                    {paymentTotals.Total}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
                {/* Status Filter */}
                <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
                        {["All", "In Progress", "Ready", "Completed"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${status === s
                                        ? "bg-[#02ca3a] text-black shadow-lg"
                                        : "text-[#ababab] hover:bg-[#444444]"
                                    }`}
                                aria-pressed={status === s}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date and Order Type Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    {/* Date Filters */}
                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
                            {["All", "Today", "Yesterday", "Custom"].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => {
                                        setDateFilter(d);
                                        if (d !== "Custom") setSelectedDate("");
                                    }}
                                    className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${dateFilter === d
                                            ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
                                            : "text-[#ababab] hover:bg-[#444444]"
                                        }`}
                                    aria-pressed={dateFilter === d}
                                >
                                    {d === "All" ? "All Dates" : d}
                                </button>
                            ))}
                            {dateFilter === "Custom" && (
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
                                    aria-label="Select custom date"
                                />
                            )}
                        </div>
                    </div>

                    {/* Order Type Filters */}
                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
                            {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${orderType === type
                                            ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
                                            : "text-[#ababab] hover:bg-[#444444]"
                                        }`}
                                    aria-pressed={orderType === type}
                                >
                                    {type}
                                </button>
                            ))}
                            <button
                                className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
                                onClick={() => navigate("/DeliveryMetrics")}
                                aria-label="View delivery metrics"
                            >
                                Delivery Metrics
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
                {sortedFilteredOrders.length > 0 ? (
                    sortedFilteredOrders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
                        <svg
                            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                        <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">
                            No orders match the current filters
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">
                            Try adjusting your filter settings
                        </p>
                    </div>
                )}
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
                            View Total Details - Admin Password Required
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-4">
                            Enter admin password to view detailed payment breakdown.
                        </p>

                        <input
                            type="password"
                            className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
                            disabled={verifyPasswordMutation.isLoading}
                        />

                        {verifyPasswordMutation.isLoading && (
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
                                }}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
                                disabled={verifyPasswordMutation.isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPassword}
                                disabled={verifyPasswordMutation.isLoading}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
                            >
                                {verifyPasswordMutation.isLoading ? 'Verifying...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Breakdown Modal */}
            {showDetailedBreakdown && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-50 text-center">
                            Payment Breakdown
                        </h3>

                        <div className="space-y-3 mb-6">
                            {/* Cash */}
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Cash Payments</span>
                                </div>
                                <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
                                    {paymentTotals.Cash}
                                </span>
                            </div>

                            {/* Online */}
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Online Payments</span>
                                </div>
                                <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
                                    {paymentTotals.Online}
                                </span>
                            </div>

                            {/* Benefit */}
                            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Benefit Payments</span>
                                </div>
                                <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
                                    {paymentTotals.Benefit}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between p-4 bg-[#02ca3a] rounded-lg mt-4">
                                <span className="text-base sm:text-lg font-bold text-black">Total Amount</span>
                                <span className="text-lg sm:text-xl font-extrabold text-black">
                                    {paymentTotals.Total}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetailedBreakdown(false)}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base font-semibold transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </section>
    );
};

export default Orders;