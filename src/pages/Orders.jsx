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

import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";
// import io from 'socket.io-client';
import socket from "../socket"; // ✅ import  shared socket instance

import { useNavigate } from 'react-router-dom';



// ⚠️ IMPORTANT: Set this to your running backend server URL
const SOCKET_SERVER_URL ="https://pos-backend-bahrain.onrender.com";

const Orders = () => {
    const navigate = useNavigate();
    // TanStack Query Client for invalidation
    const queryClient = useQueryClient();

    const [status, setStatus] = useState("In Progress"); // Set default to In Progress for immediate utility
    const [dateFilter, setDateFilter] = useState("All");
    const [selectedDate, setSelectedDate] = useState("");
    const [orderType, setOrderType] = useState("All");

    // Fetch orders using useQuery
    const { data: resData, isError } = useQuery({
        queryKey: ["orders", "all"], // Changed query key to be more general
        queryFn: async () => {
            const response = await getOrders();
            console.log("Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    // -----------------------------------------------------------
    // 🟢 IMPLEMENTATION: SOCKET.IO LISTENER FOR REAL-TIME REFRESH
    // -----------------------------------------------------------
    useEffect(() => {
        // const socket = io(SOCKET_SERVER_URL);

        // Event listener for real-time updates from the server
        socket.on('orderUpdate', (data) => {
            console.log("Received real-time order update in Orders page:", data);

            // Invalidate the 'orders, all' query for ANY action that affects the data
            if (data.action === 'new_order' ||
                data.action === 'items_ready' ||
                data.action === 'status_changed' ||
                data.action === 'order_modified' ||
                data.action === 'order_deleted') {
                // Force a refetch of all orders immediately
                queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
                enqueueSnackbar(`Order list updated in real-time. Action: ${data.action.replace('_', ' ')}`, { variant: "info" });
            }
        });

        // Clean up socket connection on component unmount
        return () => {
            // socket.disconnect();
            socket.off("orderUpdate");
        };
    }, [queryClient]);
    // -----------------------------------------------------------

    const ordersArray = resData?.data?.data ?? [];

    const filteredOrders = ordersArray.filter((order) => {
        // Filter by status 
        if (status !== "All" && order.orderStatus !== status) return false;

        // Filter by date
        const orderDate = new Date(order.createdAt).toDateString();
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toDateString();

        switch (dateFilter) {
            case "Today":
                if (orderDate !== today) return false;
                break;
            case "Yesterday":
                if (orderDate !== yesterdayDate) return false;
                break;
            case "Custom":
                if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) return false;
                break;
            default:
                break;
        }

        // Filter by orderType
        if (orderType !== "All" && order.customerDetails?.orderType !== orderType) return false;

        return true;
    });

    // Sort newest orders first
    const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate the total amount for the currently filtered orders
    const totalFilteredAmount = sortedFilteredOrders.reduce((sum, order) => {
        const amount = order.bills?.totalWithTax || 0;
        return sum + amount;
    }, 0).toFixed(2);

    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">

            {/* 1. Main Header Bar (Title, Back Button, and Total Amount) */}
            <div className="flex items-center justify-between px-8 py-4 bg-[#1a1a1a] shadow-lg">

                {/* Left: Title & Back Button */}
                <div className="flex items-center gap-4">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-3xl font-extrabold tracking-wide">Orders History</h1>
                </div>

                {/* Right: Total Filtered Amount - Made more prominent */}
                <div className="text-[#f5f5f5] text-xl font-bold p-3 rounded-xl bg-[#333333] shadow-inner flex items-center gap-2">
                    <span className="text-sm font-medium text-[#ababab] uppercase">Total Amount:</span>
                    <span className="text-3xl text-[#02ca3a]">BHD {totalFilteredAmount}</span>
                </div>
            </div>

            {/* 2. Filter Bar (Status, Date, Order Type) */}
            <div className="flex items-center justify-between px-8 py-3 border-b border-[#333333]">

                {/* Left: Status Filter (Segmented Control style) */}
                <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md">
                    {["All", "In Progress", "Ready", "Completed"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`text-sm font-semibold transition-all duration-200 ease-in-out px-4 py-2 rounded-lg 
                                ${status === s
                                    ? "bg-[#02ca3a] text-black shadow-lg"
                                    : "text-[#ababab] hover:bg-[#444444]"}`
                            }
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Right: Date and Order Type Filters (Grouped) */}
                <div className="flex items-center gap-6">

                    {/* Date Filters Group */}
                    <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
                        {["All", "Today", "Yesterday", "Custom"].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDateFilter(d)}
                                className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
                                    ${dateFilter === d
                                        ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
                                        : "text-[#ababab] hover:bg-[#444444]"}`
                                }
                            >
                                {d === "All" ? "All Dates" : d}
                            </button>
                        ))}
                        {dateFilter === "Custom" && (
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-[#444444] text-[#f5f5f5] rounded-lg px-3 py-1 text-sm border border-[#555555] focus:ring-1 focus:ring-[#02ca3a] focus:border-[#02ca3a]"
                            />
                        )}
                    </div>

                    {/* Order Type Filters Group */}
                    <div className="flex items-center gap-3 p-2 bg-[#333333] rounded-xl">
                        {["All", "Dine-In", "Delivery", "Take Away"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setOrderType(type)}
                                className={`text-sm font-medium px-4 py-1 rounded-lg transition-colors 
                                    ${orderType === type
                                        ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
                                        : "text-[#ababab] hover:bg-[#444444]"}`
                                }
                            >
                                {type}
                            </button>

                        ))}
                        <button
                            className="bg-[#02ca3a] text-black font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200"
                            onClick={() => navigate("/DeliveryMetrics")}
                        >
                            Delivery Metrics
                        </button>
                    </div>
                </div>
            </div>





            {/* 3. Orders Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-8 py-5 custom-scrollbar overflow-y-auto h-[calc(100vh-5rem-128px)]">
                {sortedFilteredOrders?.length > 0 ? (
                    sortedFilteredOrders.map((order) => (
                        // Assuming OrderCard is styled appropriately for the dark background
                        <OrderCard key={order._id} order={order} />
                    ))
                ) : (
                    <div className="col-span-full flex justify-center items-center h-full min-h-[300px]">
                        <p className="text-xl text-gray-500">No orders match the current filters.</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </section>
    );
};

export default Orders;
