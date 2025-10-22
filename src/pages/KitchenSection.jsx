


// import React, { useEffect, useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
//     import { getOrdersByStatus } from "../https/index";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";




// const KitchenSection = () => {



// const { data: resData, isError } = useQuery({
//   queryKey: ["orders", "in-progress"], // unique key per status
//   queryFn: async () => {
//     const response = await getOrdersByStatus("In Progress"); // 🟡 Fetch only in-progress orders
//     console.log("Orders API Response:", response);
//     return response;
//   },
//   placeholderData: keepPreviousData,
// });

// if (isError) {
//   enqueueSnackbar("Something went wrong!", { variant: "error" });
// }

// const ordersArray = resData?.data?.data ?? [];


//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     // Mock data (replace later with API)
//     const mockOrders = [
//       {
//         _id: "68f296b8e811809bad79c5ec",
//         tableId: "T5",
//         createdAt: new Date(Date.now() - 6 * 60 * 1000), // 6 min ago
//         items: [
//           { name: "Margherita Pizza (Large)", quantity: 1, notes: "Extra cheese" },
//           { name: "Fries", quantity: 3 },
//         ],
//         status: "In Progress",
//       },
//       {
//         _id: "68f296b8e811809bad79c5ed",
//         tableId: "T12",
//         createdAt: new Date(Date.now() - 13 * 60 * 1000),
//         items: [{ name: "Caesar Salad", quantity: 1 }],
//         status: "In Progress",
//       },
//       {
//         _id: "68f296b8e811809bad79c5ee",
//         tableId: "T2",
//         createdAt: new Date(Date.now() - 3 * 60 * 1000),
//         items: [{ name: "Vegan Burger", quantity: 1 }],
//         status: "In Progress",
//       },
//     ];
//     setOrders(mockOrders);
//   }, []);

//   const getTimeElapsed = (createdAt) => {
//     const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
//     return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
//   };

//   const handleMarkReady = (orderId) => {
//     setOrders((prev) =>
//       prev.map((order) =>
//         order._id === orderId ? { ...order, status: "Ready" } : order
//       )
//     );
//   };

//   const pendingOrders = orders.filter((order) => order.status !== "Ready");

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//       {/* Header */}
//       <div className="flex flex-col items-center py-6">
//         <h1 className="text-3xl font-bold tracking-wide text-[#F6B100]">
//           🍳 Kitchen Section
//         </h1>
//         <p className="text-gray-400 mt-2 text-xl">
//           {pendingOrders.length} Orders Pending
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28">
//         {pendingOrders.map((order) => (
//           <div
//             key={order._id}
//             className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-[#334155] flex flex-col justify-between"
//           >
//             {/* Header row */}
//             <div className="flex justify-between items-center mb-3">
//               <div>
//                 <p className="text-gray-300 text-sm">Table/Order ID</p>
//                 <p className="text-lg font-semibold text-white">{order.tableId}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-gray-400 text-sm">Time Elapsed</p>
//                 <p className="text-[#F6B100] font-semibold text-sm">
//                   {getTimeElapsed(order.createdAt)}
//                 </p>
//               </div>
//             </div>

//             {/* Items */}
//             <div className="bg-[#0f172a] rounded-lg p-3 mb-4">
//               {order.items.map((item, index) => (
//                 <div key={index} className="mb-2">
//                   <p className="text-white text-base font-bold">
//                     <span className="text-[#F6B100] mr-1">{item.quantity}x</span>
//                     {item.name}
//                   </p>
//                   {item.notes && (
//                     <p className="text-red-400 text-sm italic ml-6">
//                       - Notes: {item.notes}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Button */}
//             <button
//               onClick={() => handleMarkReady(order._id)}
//               className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2 rounded-md transition-colors"
//             >
//               Mark Kitchen Items as READY
//             </button>
//           </div>
//         ))}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default KitchenSection;



// import React, { useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import { getOrdersByStatus } from "../https/index";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// const KitchenSection = () => {
//   // Fetch only "In Progress" orders
//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ["orders", "in-progress"],
//     queryFn: async () => {
//       const response = await getOrdersByStatus("In Progress");
//       console.log("Orders API Response:", response);
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar("Something went wrong!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter only items belonging to "Kitchen" section
//   const kitchenOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         const kitchenItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "kitchen"
//         );

//         if (kitchenItems.length === 0) return null;

//         return {
//           _id: order._id,
//           tableId: order.table?.tableNumber || order.tableId || "N/A",
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: kitchenItems,
//         };
//       })
//       .filter(Boolean);
//   }, [ordersArray]);

//   const getTimeElapsed = (createdAt) => {
//     const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
//     return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
//   };

//   const handleMarkReady = (orderId) => {
//     enqueueSnackbar(`Order ${orderId} marked READY (mock)`, { variant: "success" });
//   };

//   // 💡 Show loading state
//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//       {/* Header */}
//       <div className="flex flex-col items-center py-6">
//         <h1 className="text-3xl font-bold tracking-wide text-[#F6B100]">
//           🍳 Kitchen Section
//         </h1>
//         <p className="text-gray-400 mt-2 text-xl">
//           {kitchenOrders.length} Orders Pending
//         </p>
//       </div>

//       {/* Cards */}
//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28">
//         {kitchenOrders.length === 0 ? (
//           <div className="col-span-full flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No Kitchen Orders Found</p>
//           </div>
//         ) : (
//           kitchenOrders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-[#334155] flex flex-col justify-between"
//             >
//               {/* Header row */}
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-gray-300 text-sm">Table/Order ID</p>
//                   <p className="text-lg font-semibold text-white">{order.tableId}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400 text-sm">Time Elapsed</p>
//                   <p className="text-[#F6B100] font-semibold text-sm">
//                     {getTimeElapsed(order.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="bg-[#0f172a] rounded-lg p-3 mb-4">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="mb-2">
//                     <p className="text-white text-base font-bold">
//                       <span className="text-[#F6B100] mr-1">{item.quantity}x</span>
//                       {item.name}
//                     </p>
//                     {item.notes && (
//                       <p className="text-red-400 text-sm italic ml-6">
//                         - Notes: {item.notes}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Button */}
//               <button
//                 onClick={() => handleMarkReady(order._id)}
//                 className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2 rounded-md transition-colors"
//               >
//                 Mark Kitchen Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default KitchenSection;


// import React, { useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import { getOrdersByStatus } from "../https/index";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// const KitchenSection = () => {
//   // 🟡 Fetch only "In Progress" orders
//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ["orders", "in-progress"],
//     queryFn: async () => {
//       const response = await getOrdersByStatus("In Progress");
//       console.log("Orders API Response:", response);
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar("Something went wrong!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter only "Kitchen" section items
//   const kitchenOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         const kitchenItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "kitchen"
//         );

//         if (!kitchenItems || kitchenItems.length === 0) return null;

//         // Extract correct table number or order type
//         const tableLabel =
//           order.customerDetails?.orderType === "Dine-in"
//             ? order.table?.tableNo
//               ? `Table ${order.table.tableNo}`
//               : "Table N/A"
//             : order.customerDetails?.orderType || "N/A";

//         return {
//           _id: order._id,
//           tableLabel,
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: kitchenItems,
//         };
//       })
//       .filter(Boolean);
//   }, [ordersArray]);

//   // ⏱️ Calculate elapsed time
//   const getTimeElapsed = (createdAt) => {
//     const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
//     return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
//   };

//   // ✅ Mock "Ready" handler (to be replaced with real API later)
//   const handleMarkReady = (orderId) => {
//     enqueueSnackbar(`Order ${orderId} marked READY (mock)`, {
//       variant: "success",
//     });
//   };

//   // 🌀 Loading state
//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//       {/* Header */}
//       <div className="flex flex-col items-center py-6">
//         <h1 className="text-3xl font-bold tracking-wide text-[#F6B100]">
//           🍳 Kitchen Section
//         </h1>
//         <p className="text-gray-400 mt-2 text-xl">
//           {kitchenOrders.length} Orders Pending
//         </p>
//       </div>

//       {/* Orders Grid */}
//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28">
//         {kitchenOrders.length === 0 ? (
//           <div className="col-span-full flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No Kitchen Orders Found</p>
//           </div>
//         ) : (
//           kitchenOrders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-[#334155] flex flex-col justify-between"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-gray-300 text-sm">Order Type / Table</p>
//                   <p className="text-lg font-semibold text-white">
//                     {order.tableLabel}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400 text-sm">Time Elapsed</p>
//                   <p className="text-[#F6B100] font-semibold text-sm">
//                     {getTimeElapsed(order.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="bg-[#0f172a] rounded-lg p-3 mb-4">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="mb-2">
//                     <p className="text-white text-base font-bold">
//                       <span className="text-[#F6B100] mr-1">
//                         {item.quantity}x
//                       </span>
//                       {item.name}
//                     </p>
//                     {item.notes && (
//                       <p className="text-red-400 text-sm italic ml-6">
//                         - Notes: {item.notes}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Button */}
//               <button
//                 onClick={() => handleMarkReady(order._id)}
//                 className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2 rounded-md transition-colors"
//               >
//                 Mark Kitchen Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default KitchenSection;


// import React, { useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
// import { useQuery, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// const KitchenSection = () => {
//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ["orders", "in-progress"],
//     queryFn: async () => {
//       const response = await getOrdersByStatus("In Progress");
//       console.log("Orders API Response:", response);
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar("Something went wrong!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter & structure only "Kitchen" section items
//   const kitchenOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         const kitchenItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "kitchen"
//         );

//         if (!kitchenItems || kitchenItems.length === 0) return null;

//         return {
//           _id: order._id,
//           tableNo: order.table?.tableNo || null,
//           orderType: order.customerDetails?.orderType || "N/A",
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: kitchenItems,
//         };
//       })
//       .filter(Boolean);
//   }, [ordersArray]);

//   const getTimeElapsed = (createdAt) => {
//     const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
//     return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
//   };

//  const handleMarkReady = async (orderId) => {
//   try {
//     // Call the specific API endpoint for the kitchen section
//     await markSectionItemsReady(orderId, "kitchen");

//     enqueueSnackbar("Kitchen items marked ready! Checking final order status...", { variant: "success" });

//     // Invalidate the query for ALL "in-progress" orders. 
//     // This forces the Kitchen and Grill views to refresh and update.
//     queryClient.invalidateQueries(["orders", "in-progress"]);

//   } catch (error) {
//     enqueueSnackbar("Failed to mark items ready", { variant: "error" });
//   }
// };





//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">

// <div className="flex flex-col items-center py-8 px-4 bg-[#111827] shadow-lg border-b border-[#334155]">
//         <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
//           🍳 THE PASS
//         </h1>
//         <div className="flex items-center space-x-3 mt-1">
//             <span className="text-base font-medium text-gray-400 uppercase">
//                 Kitchen Section
//             </span>
//             <span className="text-2xl font-bold bg-[#F6B100] text-[#1f1f1f] px-3 py-1 rounded-full shadow-lg">
//                 {kitchenOrders.length} Pending
//             </span>
//         </div>
//       </div>
//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
//         {kitchenOrders.length === 0 ? (
//           <div className="col-span-full flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No Kitchen Orders Found</p>
//           </div>
//         ) : (
//           kitchenOrders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1e293b] p-5 rounded-xl shadow-lg border border-[#334155] flex flex-col justify-between"
//             >
//               {/* Header row */}
//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-gray-300 text-sm">Order Type / Table</p>
//                   <p className="text-lg font-semibold text-white">
//                     {order.orderType}
//                     {order.tableNo ? ` • Table ${order.tableNo}` : ""}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400 text-sm">Time Elapsed</p>
//                   <p className="text-[#F6B100] font-semibold text-sm">
//                     {getTimeElapsed(order.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="bg-[#0f172a] rounded-lg p-3 mb-4">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="mb-2">
//                     <p className="text-white text-base font-bold">
//                       <span className="text-[#F6B100] mr-1">{item.quantity}x</span>
//                       {item.name}
//                     </p>
//                     {item.notes && (
//                       <p className="text-red-400 text-sm italic ml-6">
//                         - Notes: {item.notes}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={() => handleMarkReady(order._id)}
//                 className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-2 rounded-md transition-colors"
//               >
//                 Mark Kitchen Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default KitchenSection;


// // for socket io


// import React, { useMemo, useEffect, useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
// import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";
// import io from 'socket.io-client';

// // ⚠️ IMPORTANT: Set this to your running backend server URL
// const SOCKET_SERVER_URL = "http://localhost:8000"; 

// const KitchenSection = () => {
//   // TanStack Query Client for invalidation
//   const queryClient = useQueryClient();

//   // 🟢 LIVE TIME: State for current time to drive the live "Time Elapsed" display
//   const [currentTime, setCurrentTime] = useState(Date.now());

//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ["orders", "in-progress"],
//     queryFn: async () => {
//       const response = await getOrdersByStatus("In Progress");
//       console.log("Orders API Response:", response);
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar("Something went wrong!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter & structure only "Kitchen" section items
//   const kitchenOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         // Filter to only include items belonging to the 'kitchen' that are NOT yet 'Ready'
//         const kitchenItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "kitchen" &&
//             item.status !== "Ready"
//         );

//         // If no kitchen items need prep, skip this order
//         if (!kitchenItems || kitchenItems.length === 0) return null;

//         return {
//           _id: order._id,
//           tableNo: order.table?.tableNo || null,
//           orderType: order.customerDetails?.orderType || "N/A",
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: kitchenItems,
//         };
//       })
//       .filter(Boolean); // Remove null entries
//   }, [ordersArray]);

//   // -----------------------------------------------------------
//   // 🟢 IMPLEMENTATION 1: LIVE ELAPSED TIME
//   // -----------------------------------------------------------

//   // Function now uses the continuously updating currentTime state
//   const getTimeElapsed = (createdAt) => {
//     const start = new Date(createdAt).getTime();
//     const diffInMinutes = Math.floor((currentTime - start) / 60000);

//     if (diffInMinutes < 0) return "Just Now";

//     return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//   };

//   // Effect to update the currentTime state every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(Date.now());
//     }, 10000); // Update every 10 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []); 

//   // -----------------------------------------------------------
//   // 🟢 IMPLEMENTATION 2: SOCKET.IO LISTENER
//   // -----------------------------------------------------------

//   useEffect(() => {
//     const socket = io(SOCKET_SERVER_URL);

//     // Event listener for real-time updates from the server
//     socket.on('orderUpdate', (data) => {
//         console.log("Received real-time order update:", data);

//         // Invalidate the query for ANY action that affects the 'In Progress' list
//         if (data.action === 'new_order' || 
//             data.action === 'items_ready' || 
//             data.action === 'status_changed' || 
//             data.action === 'order_modified' ||
//             data.action === 'order_deleted') 
//         {
//             queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
//             // Provide feedback on the KDS screen
//             enqueueSnackbar(`Order updated by server: ${data.action.replace('_', ' ')}`, { variant: "info" });
//         }
//     });

//     // Clean up socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [queryClient]); 


//   const handleMarkReady = async (orderId) => {
//     try {
//       // Call the specific API endpoint for the kitchen section
//       await markSectionItemsReady(orderId, "kitchen");

//       enqueueSnackbar("Kitchen items marked ready! Status will update via real-time connection...", { variant: "success" });

//       // 🛑 CRITICAL CHANGE: We remove the manual queryClient.invalidateQueries here.
//       // The backend (updateSectionItemsReady) will now emit the 'items_ready' 
//       // socket event, and the useEffect listener above will handle the refresh.

//     } catch (error) {
//       console.error("Mark Ready Error:", error);
//       enqueueSnackbar("Failed to mark items ready", { variant: "error" });
//     }
//   };


//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">

//       <div className="flex flex-col items-center py-8 px-4 bg-[#111827] shadow-lg border-b border-[#334155]">
//         <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
//           🍳 THE PASS
//         </h1>
//         <div className="flex items-center space-x-3 mt-1">
//             <span className="text-base font-medium text-gray-400 uppercase">
//                 Kitchen Section
//             </span>
//             <span className={`text-2xl font-bold px-3 py-1 rounded-full shadow-lg ${
//                 kitchenOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
//             }`}>
//                 {kitchenOrders.length} {kitchenOrders.length > 0 ? 'Pending' : 'Clear'}
//             </span>
//         </div>
//       </div>

//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
//         {kitchenOrders.length === 0 ? (
//           <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
//             <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//             <p className="text-gray-300 text-xl font-semibold">All clear!</p>
//             <p className="text-gray-500">No active kitchen prep required.</p>
//           </div>
//         ) : (
//           kitchenOrders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#F6B100] flex flex-col justify-between"
//             >
//               {/* Header row */}
//               <div className="flex justify-between items-center mb-3 border-b border-[#334155] pb-3">
//                 <div>
//                   <p className="text-gray-300 text-sm">Order Type / Table</p>
//                   <p className="text-xl font-bold text-white">
//                     {order.orderType}
//                     {order.tableNo ? ` • Table ${order.tableNo}` : ""}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400 text-sm">Time Elapsed</p>
//                   <p 
//                     className={`font-semibold text-sm ${
//                         // Highlight in red after 15 minutes (or any chosen time)
//                         Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 ? 'text-red-500' : 'text-[#F6B100]'
//                     }`}
//                   >
//                     {getTimeElapsed(order.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="bg-[#0f172a] rounded-lg p-3 my-4 flex-grow">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
//                     <p className="text-white text-lg font-bold">
//                       <span className="text-xl text-red-500 mr-2">{item.quantity}x</span>
//                       {item.name}
//                     </p>
//                     {item.notes && (
//                       <p className="text-yellow-400 text-sm italic ml-8 mt-1">
//                         - Notes: {item.notes}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={() => handleMarkReady(order._id)}
//                 className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
//               >
//                 ✅ Mark Kitchen Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default KitchenSection;


import React, { useMemo, useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import io from 'socket.io-client';

// ⚠️ IMPORTANT: Set this to your running backend server URL
const SOCKET_SERVER_URL = "http://localhost:8000" || "https://pos-backend-bahrain.onrender.com";
// 🔔 CONSTANT: URL to your alert sound file (ensure this path is correct, e.g., in your public folder)
const ALERT_SOUND_URL = "/notification1.mp3";

const KitchenSection = () => {
    // TanStack Query Client for invalidation
    const queryClient = useQueryClient();

    // 🟢 LIVE TIME: State for current time to drive the live "Time Elapsed" display
    const [currentTime, setCurrentTime] = useState(Date.now());

    // 🔔 NOTIFICATION SOUND STATE, initialized from localStorage for persistence
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        // Check local storage for the saved preference, keyed for the kitchen section
        const saved = localStorage.getItem('kds_sound_kitchen');
        // Default to false if not set, or use the saved 'true'/'false' string
        return saved === 'true' ? true : false;
    });

    // 🔔 Create Audio object once using useMemo
    const orderAlert = useMemo(() => new Audio(ALERT_SOUND_URL), []);

    // Handler to toggle sound setting and save to local storage
    const handleToggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        // Save preference as a string
        localStorage.setItem('kds_sound_kitchen', String(newState));
        enqueueSnackbar(`Order sound notifications ${newState ? 'enabled' : 'disabled'}`, { variant: newState ? 'success' : 'info' });
    };


    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders", "in-progress"],
        queryFn: async () => {
            const response = await getOrdersByStatus("In Progress");
            console.log("Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    const ordersArray = resData?.data?.data ?? [];

    // 🧠 Filter & structure only "Kitchen" section items
    const kitchenOrders = useMemo(() => {
        return ordersArray
            .map((order) => {
                // Filter to only include items belonging to the 'kitchen' that are NOT yet 'Ready'
                const kitchenItems = order.items?.filter(
                    (item) =>
                        item.section &&
                        item.section.toLowerCase() === "kitchen" &&
                        item.status !== "Ready"
                );

                // If no kitchen items need prep, skip this order
                if (!kitchenItems || kitchenItems.length === 0) return null;

                return {
                    _id: order._id,
                    tableNo: order.table?.tableNo || null,
                    orderType: order.customerDetails?.orderType || "N/A",
                    createdAt: order.createdAt,
                    status: order.orderStatus,
                    items: kitchenItems,
                };
            })
            .filter(Boolean); // Remove null entries
    }, [ordersArray]);

    // -----------------------------------------------------------
    // 🟢 IMPLEMENTATION 1: LIVE ELAPSED TIME
    // -----------------------------------------------------------

    // Function now uses the continuously updating currentTime state
    const getTimeElapsed = (createdAt) => {
        const start = new Date(createdAt).getTime();
        const diffInMinutes = Math.floor((currentTime - start) / 60000);

        if (diffInMinutes < 0) return "Just Now";

        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    };

    // Effect to update the currentTime state every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // -----------------------------------------------------------
    // 🟢 IMPLEMENTATION 2: SOCKET.IO LISTENER (with Sound)
    // -----------------------------------------------------------

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);

        // Event listener for real-time updates from the server
        socket.on('orderUpdate', (data) => {
            console.log("Received real-time order update:", data);

            // Determine if this is a 'new order' or 'modified order' alert event
            const isAlertEvent = data.action === 'new_order' || data.action === 'order_modified';

            if (isAlertEvent && isSoundEnabled) {
                // 🔔 Play the alert sound if enabled
                try {
                    orderAlert.play().catch(e => console.warn("Audio play failed, likely autoplay policy:", e));
                } catch (e) {
                    console.error("Error playing sound:", e);
                }
            }

            // Invalidate the query for ANY action that affects the 'In Progress' list
            if (data.action === 'new_order' ||
                data.action === 'items_ready' ||
                data.action === 'status_changed' ||
                data.action === 'order_modified' ||
                data.action === 'order_deleted') {
                queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
                // Provide feedback on the KDS screen
                enqueueSnackbar(`Order updated by server: ${data.action.replace('_', ' ')}`, { variant: isAlertEvent ? 'warning' : 'info' });
            }
        });

        // Clean up socket connection on component unmount
        return () => {
            socket.disconnect();
        };
        // Dependencies: Include isSoundEnabled and orderAlert for correct sound state and object access
    }, [queryClient, isSoundEnabled, orderAlert]);


    const handleMarkReady = async (orderId) => {
        try {
            // Call the specific API endpoint for the kitchen section
            await markSectionItemsReady(orderId, "kitchen");

            enqueueSnackbar("Kitchen items marked ready! Status will update via real-time connection...", { variant: "success" });

            // Rely on the backend's socket event to trigger the refresh across KDS screens.

        } catch (error) {
            console.error("Mark Ready Error:", error);
            enqueueSnackbar("Failed to mark items ready", { variant: "error" });
        }
    };


    if (isLoading) {
        return (
            <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
                <p className="text-lg">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">

            {/* --- KITCHEN HEADER (Updated with Sound Toggle) --- */}
            <div className="flex flex-col md:flex-row md:justify-between items-center py-6 px-4 bg-[#111827] shadow-lg border-b border-[#334155] sticky top-0 z-10">

                {/* Title and Count */}
                <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">
                        🍳 THE PASS
                    </h1>
                    <div className="flex items-center space-x-3">
                        <span className="text-base font-medium text-gray-400 uppercase">
                            Kitchen Section
                        </span>
                        <span className={`text-xl font-bold px-3 py-1 rounded-full shadow-lg transition-colors ${kitchenOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                            {kitchenOrders.length} {kitchenOrders.length > 0 ? 'Pending' : 'Clear'}
                        </span>
                    </div>
                </div>

                {/* Sound Notification Toggle Button */}
                <button
                    onClick={handleToggleSound}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-full font-bold transition-all duration-300 shadow-md ${isSoundEnabled
                            ? 'bg-green-700 hover:bg-green-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    title={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        {isSoundEnabled ? (
                            // Bell icon
                            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm4 12V3a1 1 0 10-2 0v11l-3 3H6a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1v-1a1 1 0 00-1-1v-3.586l-2-2z" clipRule="evenodd" />
                        ) : (
                            // Bell slash icon (Muted)
                            <path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM14.53 15.659A1.998 1.998 0 0113 14h-1.077l2.844 2.844a.997.997 0 00.563-.521zM5 14a1 1 0 011-1h.414l-2 2H5v-1zM10 17a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM14.53 4.341A1.998 1.998 0 0113 6h-1.077l2.844 2.844a.997.997 0 00.563-.521L15.53 4.341zM6.469 16.659A1.998 1.998 0 018 14h1.077l-2.844-2.844a.997.997 0 00-.563.521zM9.531 3.341A1.998 1.998 0 0111 2h1.077l-2.844-2.844a.997.997 0 00-.563.521L8.469 3.341z" />
                        )}
                    </svg>
                    <span className="hidden sm:inline">{isSoundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
                </button>

            </div>

            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
                {kitchenOrders.length === 0 ? (
                    <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
                        <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <p className="text-gray-300 text-xl font-semibold">All clear!</p>
                        <p className="text-gray-500">No active kitchen prep required.</p>
                    </div>
                ) : (
                    kitchenOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#F6B100] flex flex-col justify-between"
                        >
                            {/* Header row */}
                            <div className="flex justify-between items-center mb-3 border-b border-[#334155] pb-3">
                                <div>
                                    <p className="text-gray-300 text-sm">Order Type / Table</p>
                                    <p className="text-xl font-bold text-white">
                                        {order.orderType}
                                        {order.tableNo ? ` • Table ${order.tableNo}` : ""}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Time Elapsed</p>
                                    <p
                                        className={`font-semibold text-sm ${
                                            // Highlight in red after 15 minutes (or any chosen time)
                                            Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 ? 'text-red-500' : 'text-[#F6B100]'
                                            }`}
                                    >
                                        {getTimeElapsed(order.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-[#0f172a] rounded-lg p-3 my-4 flex-grow">
                                {order.items.map((item, index) => (
                                    <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
                                        <p className="text-white text-lg font-bold">
                                            <span className="text-xl text-red-500 mr-2">{item.quantity}x</span>
                                            {item.name}
                                        </p>
                                        {item.notes && (
                                            <p className="text-yellow-400 text-sm italic ml-8 mt-1">
                                                - Notes: {item.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleMarkReady(order._id)}
                                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
                            >
                                ✅ Mark Kitchen Items as READY
                            </button>
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default KitchenSection;