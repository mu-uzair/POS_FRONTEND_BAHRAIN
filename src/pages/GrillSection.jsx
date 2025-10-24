// import React, { useEffect, useState } from "react";
// import BottomNav from "../components/shared/BottomNav";

// const GrillSection = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     // Mock data (replace later with API)
//     const mockOrders = [
//       {
//         _id: "68f296b8e811809bad79c6aa",
//         tableId: "T8",
//         createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 min ago
//         items: [
//           { name: "Grilled Chicken Breast", quantity: 2, notes: "Medium Spicy" },
//           { name: "BBQ Ribs", quantity: 1 },
//         ],
//         status: "In Progress",
//       },
//       {
//         _id: "68f296b8e811809bad79c6bb",
//         tableId: "T3",
//         createdAt: new Date(Date.now() - 10 * 60 * 1000),
//         items: [{ name: "Lamb Kebab", quantity: 3 }],
//         status: "In Progress",
//       },
//       {
//         _id: "68f296b8e811809bad79c6cc",
//         tableId: "T11",
//         createdAt: new Date(Date.now() - 2 * 60 * 1000),
//         items: [{ name: "Grilled Fish Fillet", quantity: 1 }],
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
//           🔥 Grill Section
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
//               className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-2 rounded-md transition-colors"
//             >
//               Mark Grill Items as READY
//             </button>
//           </div>
//         ))}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default GrillSection;



// import React, { useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import { getOrdersByStatus, markSectionItemsReady } from "../https/index"; // Assuming this function exists
// import { useQuery, keepPreviousData } from "@tanstack/react-query"; // Assuming these are installed
// import { enqueueSnackbar } from "notistack"; // Assuming this is installed

// const GrillSection = () => {
//   // Use useQuery exactly like the KitchenSection, fetching 'In Progress' orders
//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ["orders", "in-progress", "grill-section"], // Added 'grill-section' to differentiate the query key
//     queryFn: async () => {
//       // You may need to create a dedicated function or modify the endpoint for better filtering,
//       // but for now, we use the same status endpoint and rely on client-side filtering below.
//       const response = await getOrdersByStatus("In Progress");
//       // console.log("Grill Orders API Response:", response); // Console log for debugging
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     // Note: In a real app, this should only run once, often with a check to prevent infinite calls
//     // However, keeping this pattern consistent with your provided code.
//     enqueueSnackbar("Error fetching Grill orders!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter & structure only "Grill" section items using useMemo
//   const grillOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         // Filter items where item.section is "grill" (case-insensitive)
//         const grillItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "grill"
//         );

//         if (!grillItems || grillItems.length === 0) return null;

//         // Return a clean order object containing only the relevant grill items
//         return {
//           _id: order._id,
//           tableNo: order.table?.tableNo || null,
//           orderType: order.customerDetails?.orderType || "N/A",
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: grillItems,
//         };
//       })
//       .filter(Boolean); // Remove the 'null' entries
//   }, [ordersArray]);

//   const getTimeElapsed = (createdAt) => {
//     const diff = Math.floor((Date.now() - new Date(createdAt)) / 60000);
//     return `${diff} minute${diff !== 1 ? "s" : ""} ago`;
//   };

//  const handleMarkReady = async (orderId) => {
//   try {
//     // Call the specific API endpoint for the grill section
//     await markSectionItemsReady(orderId, "grill");

//     enqueueSnackbar("Grill items marked ready! Checking final order status...", { variant: "success" });

//     // Invalidate the query for ALL "in-progress" orders. 
//     queryClient.invalidateQueries(["orders", "in-progress"]);

//   } catch (error) {
//     enqueueSnackbar("Failed to mark items ready", { variant: "error" });
//   }
// };

//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading grill orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//       {/* --- GRILL HEADER --- */}
//       <div className="flex flex-col items-center py-8 px-4 bg-[#111827] shadow-lg border-b border-[#334155]">
//         <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
//           🔥 THE GRILL
//         </h1>
//         <div className="flex items-center space-x-3 mt-1">
//             <span className="text-base font-medium text-gray-400 uppercase">
//                 Grill Section
//             </span>
//             <span className="text-2xl font-bold bg-[#F6B100] text-[#1f1f1f] px-3 py-1 rounded-full shadow-lg">
//                 {grillOrders.length} Pending
//             </span>
//         </div>
//       </div>
//       {/* -------------------- */}

//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
//         {grillOrders.length === 0 ? (
//           <div className="col-span-full flex justify-center items-center h-64">
//             <p className="text-gray-400 text-lg">No Grill Orders Found</p>
//           </div>
//         ) : (
//           grillOrders.map((order) => (
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
//                       <span className="text-[#dc2626] mr-1">{item.quantity}x</span> {/* Changed color to red */}
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
//                 className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-2 rounded-md transition-colors"
//               >
//                 Mark Grill Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default GrillSection;


//  sockets.io client setup

// import React, { useMemo, useEffect, useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// // Import useQueryClient to access the TanStack Query client
// import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
// import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";
// import io from 'socket.io-client'; // Import Socket.io client

// // ⚠️ IMPORTANT: Set this to your running backend server URL
// const SOCKET_SERVER_URL = "http://localhost:8000"; 

// const GrillSection = () => {
//   // TanStack Query Client for invalidation
//   const queryClient = useQueryClient();

//   // 🟢 LIVE TIME: State for current time to drive the live "Time Elapsed" display
//   const [currentTime, setCurrentTime] = useState(Date.now());

//   // Use useQuery exactly like the KitchenSection, fetching 'In Progress' orders
//   const { data: resData, isError, isLoading } = useQuery({
//     // Keep this query key consistent so the socket can invalidate it
//     queryKey: ["orders", "in-progress"], 
//     queryFn: async () => {
//       const response = await getOrdersByStatus("In Progress");
//       console.log("Grill Orders API Response:", response);
//       return response;
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar("Error fetching Grill orders!", { variant: "error" });
//   }

//   const ordersArray = resData?.data?.data ?? [];

//   // 🧠 Filter & structure only "Grill" section items using useMemo
//   const grillOrders = useMemo(() => {
//     return ordersArray
//       .map((order) => {
//         // Filter items where item.section is "grill" and status is NOT "Ready"
//         const grillItems = order.items?.filter(
//           (item) =>
//             item.section &&
//             item.section.toLowerCase() === "grill" &&
//             item.status !== "Ready"
//         );

//         if (!grillItems || grillItems.length === 0) return null;

//         // Return a clean order object containing only the relevant grill items
//         return {
//           _id: order._id,
//           tableNo: order.table?.tableNo || null,
//           orderType: order.customerDetails?.orderType || "N/A",
//           createdAt: order.createdAt,
//           status: order.orderStatus,
//           items: grillItems,
//         };
//       })
//       .filter(Boolean); // Remove the 'null' entries
//   }, [ordersArray]);

// // --- IMPLEMENTATION 1: LIVE ELAPSED TIME ---

//   // Function now uses the continuously updating currentTime state
//   const getTimeElapsed = (createdAt) => {
//     if (!createdAt) return "N/A";
//     const start = new Date(createdAt).getTime();
//     const diffInMinutes = Math.floor((currentTime - start) / 60000);

//     if (diffInMinutes < 0) return "Just Now";

//     // Ensure diff is non-negative
//     const minutes = Math.max(0, diffInMinutes);
//     return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
//   };

//   // Effect to update the currentTime state every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(Date.now());
//     }, 10000); // Update every 10 seconds

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []); 

// // --- IMPLEMENTATION 2: SOCKET.IO LISTENER ---

//   useEffect(() => {
//     const socket = io(SOCKET_SERVER_URL);

//     // Event listener for real-time updates from the server
//     socket.on('orderUpdate', (data) => {
//         console.log("Received real-time order update for Grill:", data);

//         // Invalidate the query for ANY action that affects the 'In Progress' list
//         if (data.action === 'new_order' || 
//             data.action === 'items_ready' || 
//             data.action === 'status_changed' || 
//             data.action === 'order_modified' ||
//             data.action === 'order_deleted') 
//         {
//             queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
//             // Provide feedback on the KDS screen
//             enqueueSnackbar(`Grill order list updated: ${data.action.replace('_', ' ')}`, { variant: "info" });
//         }
//     });

//     // Clean up socket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [queryClient]); 


//   const handleMarkReady = async (orderId) => {
//     try {
//       // Call the specific API endpoint for the grill section
//       await markSectionItemsReady(orderId, "grill");

//       enqueueSnackbar("Grill items marked ready! Status will update via real-time connection...", { variant: "success" });

//       // 🛑 CRITICAL CHANGE: Remove manual query invalidation.
//       // The backend will emit the 'items_ready' socket event, and the useEffect 
//       // listener above will handle the refresh across all KDS screens.

//     } catch (error) {
//       console.error("Mark Ready Error:", error);
//       enqueueSnackbar("Failed to mark items ready", { variant: "error" });
//     }
//   };


//   if (isLoading) {
//     return (
//       <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//         <p className="text-lg">Loading grill orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//       {/* --- GRILL HEADER --- */}
//       <div className="flex flex-col items-center py-8 px-4 bg-[#111827] shadow-lg border-b border-[#334155]">
//         <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
//           🔥 THE GRILL
//         </h1>
//         <div className="flex items-center space-x-3 mt-1">
//           <span className="text-base font-medium text-gray-400 uppercase">
//             Grill Section
//           </span>
//           <span className={`text-2xl font-bold px-3 py-1 rounded-full shadow-lg ${
//                 grillOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
//             }`}>
//             {grillOrders.length} {grillOrders.length > 0 ? 'Pending' : 'Clear'}
//           </span>
//         </div>
//       </div>
//       {/* -------------------- */}

//       <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
//         {grillOrders.length === 0 ? (
//           <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
//             <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//             <p className="text-gray-300 text-xl font-semibold">All clear!</p>
//             <p className="text-gray-500">No active grill prep required.</p>
//           </div>
//         ) : (
//           grillOrders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#dc2626] flex flex-col justify-between"
//             >
//               {/* Header row */}
//               <div className="flex justify-between items-start mb-4 border-b border-[#334155] pb-3">
//                 <div>
//                   <p className="text-gray-300 text-sm">Order Type / Table</p>
//                   <p className="text-xl font-bold text-white">
//                     {order.orderType}
//                     {order.tableNo ? <span className="text-[#F6B100]"> • TBL {order.tableNo}</span> : ""}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-400 text-sm">Time Elapsed</p>
//                   <p 
//                     className={`font-semibold text-lg ${
//                         // Highlight in red after 15 minutes 
//                         Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 ? 'text-red-500' : 'text-[#F6B100]'
//                     }`}
//                   >
//                     {getTimeElapsed(order.createdAt)}
//                   </p>
//                 </div>
//               </div>

//               {/* Items */}
//               <div className="bg-[#0f172a] rounded-lg p-4 mb-5 flex-grow">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
//                     <p className="text-white text-lg font-bold">
//                       <span className="text-2xl text-red-500 mr-2">{item.quantity}x</span>
//                       {item.name}
//                     </p>
//                     {item.notes && (
//                       <p className="text-yellow-400 text-sm italic ml-8 mt-1">
//                         ** Notes: {item.notes}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={() => handleMarkReady(order._id)}
//                 className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
//               >
//                 🔥 Mark Grill Items as READY
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default GrillSection;


// import React, { useMemo, useEffect, useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// // Import useQueryClient to access the TanStack Query client
// import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
// import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// import socket from "../socket"; // ✅ import  shared socket instance

// // ⚠️ IMPORTANT: Set this to your running backend server URL
// const SOCKET_SERVER_URL = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000");// 🔔 CONSTANT: URL to your alert sound file (use a relative path like /assets/sound.mp3 or a public URL)
// const ALERT_SOUND_URL = "/notification.mp3";
// // Note: You must ensure 'order_alert.mp3' exists in your public folder.

// const GrillSection = () => {
//     // TanStack Query Client for invalidation
//     const queryClient = useQueryClient();

//     // 🟢 LIVE TIME: State for current time to drive the live "Time Elapsed" display
//     const [currentTime, setCurrentTime] = useState(Date.now());

//     // 🔔 NOTIFICATION SOUND STATE, initialized from localStorage for persistence
//     const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
//         // Check local storage for the saved preference
//         const saved = localStorage.getItem('kds_sound_grill');
//         // Default to false if not set, or use the saved 'true'/'false' string
//         return saved === 'true' ? true : false;
//     });

//     // 🔔 Create Audio object once using useMemo
//     const orderAlert = useMemo(() => new Audio(ALERT_SOUND_URL), []);

//     // Handler to toggle sound setting and save to local storage
//     const handleToggleSound = () => {
//         const newState = !isSoundEnabled;
//         setIsSoundEnabled(newState);
//         // Save preference as a string
//         localStorage.setItem('kds_sound_grill', String(newState));
//         enqueueSnackbar(`Order sound notifications ${newState ? 'enabled' : 'disabled'}`, { variant: newState ? 'success' : 'info' });
//     };


//     // Use useQuery exactly like the KitchenSection, fetching 'In Progress' orders
//     const { data: resData, isError, isLoading } = useQuery({
//         // Keep this query key consistent so the socket can invalidate it
//         queryKey: ["orders", "in-progress"],
//         queryFn: async () => {
//             const response = await getOrdersByStatus("In Progress");
//             console.log("Grill Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//     });

//     if (isError) {
//         enqueueSnackbar("Error fetching Grill orders!", { variant: "error" });
//     }

//     const ordersArray = resData?.data?.data ?? [];

//     // 🧠 Filter & structure only "Grill" section items using useMemo
//     const grillOrders = useMemo(() => {
//         return ordersArray
//             .map((order) => {
//                 // Filter items where item.section is "grill" and status is NOT "Ready"
//                 const grillItems = order.items?.filter(
//                     (item) =>
//                         item.section &&
//                         item.section.toLowerCase() === "grill" &&
//                         item.status !== "Ready"
//                 );

//                 if (!grillItems || grillItems.length === 0) return null;

//                 // Return a clean order object containing only the relevant grill items
//                 return {
//                     _id: order._id,
//                     tableNo: order.table?.tableNo || null,
//                     orderType: order.customerDetails?.orderType || "N/A",
//                     createdAt: order.createdAt,
//                     status: order.orderStatus,
//                     items: grillItems,
//                 };
//             })
//             .filter(Boolean); // Remove the 'null' entries
//     }, [ordersArray]);

//     // --- IMPLEMENTATION 1: LIVE ELAPSED TIME ---

//     // Function now uses the continuously updating currentTime state
//     const getTimeElapsed = (createdAt) => {
//         if (!createdAt) return "N/A";
//         const start = new Date(createdAt).getTime();
//         const diffInMinutes = Math.floor((currentTime - start) / 60000);

//         if (diffInMinutes < 0) return "Just Now";

//         // Ensure diff is non-negative
//         const minutes = Math.max(0, diffInMinutes);
//         return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
//     };

//     // Effect to update the currentTime state every 10 seconds
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentTime(Date.now());
//         }, 10000); // Update every 10 seconds

//         return () => clearInterval(interval); // Cleanup on unmount
//     }, []);

//     // --- IMPLEMENTATION 2: SOCKET.IO LISTENER (with Sound) ---

//     useEffect(() => {
//         //     const socket = io(SOCKET_SERVER_URL);

//         // Event listener for real-time updates from the server
//         socket.on('orderUpdate', (data) => {
//             console.log("Received real-time order update for Grill:", data);

//             // Determine if this is a 'new order' or 'modified order' alert event
//             const isAlertEvent = data.action === 'new_order' || data.action === 'order_modified';

//             if (isAlertEvent && isSoundEnabled) {
//                 // 🔔 Play the alert sound if enabled
//                 try {
//                     orderAlert.play().catch(e => console.warn("Audio play failed, likely autoplay policy:", e));
//                 } catch (e) {
//                     console.error("Error playing sound:", e);
//                 }
//             }

//             // Invalidate the query for ANY action that affects the 'In Progress' list
//             if (data.action === 'new_order' ||
//                 data.action === 'items_ready' ||
//                 data.action === 'status_changed' ||
//                 data.action === 'order_modified' ||
//                 data.action === 'order_deleted') {
//                 queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
//                 // Provide feedback on the KDS screen
//                 enqueueSnackbar(`Grill order list updated: ${data.action.replace('_', ' ')}`, { variant: isAlertEvent ? 'warning' : 'info' });
//             }
//         });

//         // Clean up socket connection on component unmount
//         return () => {
//             //       socket.disconnect();
//             socket.off("orderUpdate");

//         };
//         // Dependencies: Include isSoundEnabled and orderAlert to ensure useEffect has the latest values
//     }, [queryClient, isSoundEnabled, orderAlert]);


//     const handleMarkReady = async (orderId) => {
//         try {
//             // Call the specific API endpoint for the grill section
//             await markSectionItemsReady(orderId, "grill");

//             enqueueSnackbar("Grill items marked ready! Status will update via real-time connection...", { variant: "success" });

//             // The backend socket will trigger the query invalidation.
//         } catch (error) {
//             console.error("Mark Ready Error:", error);
//             enqueueSnackbar("Failed to mark items ready", { variant: "error" });
//         }
//     };


//     if (isLoading) {
//         return (
//             <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
//                 <p className="text-lg">Loading grill orders...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
//             {/* --- GRILL HEADER --- */}
//             <div className="flex flex-col md:flex-row md:justify-between items-center py-6 px-4 bg-[#111827] shadow-lg border-b border-[#334155] sticky top-0 z-10">

//                 {/* Title and Count */}
//                 <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
//                     <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">
//                         🔥 THE GRILL
//                     </h1>
//                     <div className="flex items-center space-x-3">
//                         <span className="text-base font-medium text-gray-400 uppercase">
//                             Grill Section
//                         </span>
//                         <span className={`text-xl font-bold px-3 py-1 rounded-full shadow-lg transition-colors ${grillOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
//                             }`}>
//                             {grillOrders.length} {grillOrders.length > 0 ? 'Pending' : 'Clear'}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Sound Notification Toggle */}
//                 <button
//                     onClick={handleToggleSound}
//                     className={`flex items-center space-x-2 py-2 px-4 rounded-full font-bold transition-all duration-300 shadow-md ${isSoundEnabled
//                             ? 'bg-green-700 hover:bg-green-600 text-white'
//                             : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//                         }`}
//                     title={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
//                         {isSoundEnabled ? (
//                             // Bell icon
//                             <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm4 12V3a1 1 0 10-2 0v11l-3 3H6a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1v-1a1 1 0 00-1-1v-3.586l-2-2z" clipRule="evenodd" />
//                         ) : (
//                             // Bell slash icon
//                             <path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM14.53 15.659A1.998 1.998 0 0113 14h-1.077l2.844 2.844a.997.997 0 00.563-.521zM5 14a1 1 0 011-1h.414l-2 2H5v-1zM10 17a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM14.53 4.341A1.998 1.998 0 0113 6h-1.077l2.844 2.844a.997.997 0 00.563-.521L15.53 4.341zM6.469 16.659A1.998 1.998 0 018 14h1.077l-2.844-2.844a.997.997 0 00-.563.521zM9.531 3.341A1.998 1.998 0 0111 2h1.077l-2.844-2.844a.997.997 0 00-.563.521L8.469 3.341z" />
//                         )}
//                     </svg>
//                     <span className="hidden sm:inline">{isSoundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
//                 </button>

//             </div>
//             {/* -------------------- */}

//             <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
//                 {grillOrders.length === 0 ? (
//                     <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
//                         <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
//                         <p className="text-gray-300 text-xl font-semibold">All clear!</p>
//                         <p className="text-gray-500">No active grill prep required.</p>
//                     </div>
//                 ) : (
//                     grillOrders.map((order) => (
//                         <div
//                             key={order._id}
//                             className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#dc2626] flex flex-col justify-between"
//                         >
//                             {/* Header row */}
//                             <div className="flex justify-between items-start mb-4 border-b border-[#334155] pb-3">
//                                 <div>
//                                     <p className="text-gray-300 text-sm">Order Type / Table</p>
//                                     <p className="text-xl font-bold text-white">
//                                         {order.orderType}
//                                         {order.tableNo ? <span className="text-[#F6B100]"> • TBL {order.tableNo}</span> : ""}
//                                     </p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-gray-400 text-sm">Time Elapsed</p>
//                                     <p
//                                         className={`font-semibold text-lg ${
//                                             // Highlight in red after 15 minutes 
//                                             Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 ? 'text-red-500' : 'text-[#F6B100]'
//                                             }`}
//                                     >
//                                         {getTimeElapsed(order.createdAt)}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Items */}
//                             <div className="bg-[#0f172a] rounded-lg p-4 mb-5 flex-grow">
//                                 {order.items.map((item, index) => (
//                                     <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
//                                         <p className="text-white text-lg font-bold">
//                                             <span className="text-2xl text-red-500 mr-2">{item.quantity}x</span>
//                                             {item.name}
//                                         </p>
//                                         {item.notes && (
//                                             <p className="text-yellow-400 text-sm italic ml-8 mt-1">
//                                                 ** Notes: {item.notes}
//                                             </p>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>

//                             <button
//                                 onClick={() => handleMarkReady(order._id)}
//                                 className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
//                             >
//                                 🔥 Mark Grill Items as READY
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>

//             <BottomNav />
//         </div>
//     );
// };

// export default GrillSection;


import React, { useMemo, useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import { getOrdersByStatus, markSectionItemsReady } from "../https/index";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import socket from "../socket"; // ✅ import shared socket instance

// 🔔 CONSTANT: URL to your alert sound file
const ALERT_SOUND_URL = "/notification.mp3";

const GrillSection = () => {
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(Date.now());
    
    // 🔔 Sound state with localStorage persistence
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('kds_sound_grill');
        return saved === 'true';
    });

    // 🔔 Audio ready state to track if audio context is unlocked
    const [isAudioReady, setIsAudioReady] = useState(false);

    // 🔔 Create Audio object once
    const orderAlert = useMemo(() => {
        const audio = new Audio(ALERT_SOUND_URL);
        audio.volume = 0.8; // Set volume to 80%
        
        // Preload the audio
        audio.load();
        
        return audio;
    }, []);

    // 🔔 Initialize audio on first user interaction
    useEffect(() => {
        const unlockAudio = async () => {
            if (!isAudioReady) {
                try {
                    // Attempt to play and immediately pause to unlock audio context
                    await orderAlert.play();
                    orderAlert.pause();
                    orderAlert.currentTime = 0;
                    setIsAudioReady(true);
                    console.log("✅ Audio context unlocked");
                } catch (e) {
                    console.warn("Audio unlock failed (expected on first load):", e.message);
                }
            }
        };

        // Listen for any user interaction
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach(event => {
            document.addEventListener(event, unlockAudio, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, unlockAudio);
            });
        };
    }, [orderAlert, isAudioReady]);

    // Handler to toggle sound
    const handleToggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        localStorage.setItem('kds_sound_grill', String(newState));
        
        // Play a test sound when enabling
        if (newState && isAudioReady) {
            playAlertSound();
        }
        
        enqueueSnackbar(
            `Order sound notifications ${newState ? 'enabled' : 'disabled'}`, 
            { variant: newState ? 'success' : 'info' }
        );
    };

    // 🔔 Reliable sound play function
    const playAlertSound = async () => {
        try {
            // Reset audio to start
            orderAlert.currentTime = 0;
            
            // Attempt to play
            const playPromise = orderAlert.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                console.log("🔔 Alert sound played successfully");
            }
        } catch (error) {
            console.warn("⚠️ Could not play alert sound:", error.message);
            
            // Notify user if sound failed
            if (error.name === 'NotAllowedError') {
                enqueueSnackbar(
                    'Sound blocked by browser. Click anywhere to enable sounds.', 
                    { variant: 'warning', autoHideDuration: 5000 }
                );
            }
        }
    };

    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders", "in-progress"],
        queryFn: async () => {
            const response = await getOrdersByStatus("In Progress");
            console.log("Grill Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    if (isError) {
        enqueueSnackbar("Error fetching Grill orders!", { variant: "error" });
    }

    const ordersArray = resData?.data?.data ?? [];

    const grillOrders = useMemo(() => {
        return ordersArray
            .map((order) => {
                const grillItems = order.items?.filter(
                    (item) =>
                        item.section &&
                        item.section.toLowerCase() === "grill" &&
                        item.status !== "Ready"
                );

                if (!grillItems || grillItems.length === 0) return null;

                return {
                    _id: order._id,
                    tableNo: order.table?.tableNo || null,
                    orderType: order.customerDetails?.orderType || "N/A",
                    createdAt: order.createdAt,
                    status: order.orderStatus,
                    items: grillItems,
                };
            })
            .filter(Boolean);
    }, [ordersArray]);

    const getTimeElapsed = (createdAt) => {
        if (!createdAt) return "N/A";
        const start = new Date(createdAt).getTime();
        const diffInMinutes = Math.floor((currentTime - start) / 60000);

        if (diffInMinutes < 0) return "Just Now";

        const minutes = Math.max(0, diffInMinutes);
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // 🟢 SOCKET.IO LISTENER (Fixed)
    useEffect(() => {
        const handleOrderUpdate = (data) => {
            console.log("Received real-time order update for Grill:", data);

            const isAlertEvent = data.action === 'new_order' || data.action === 'order_modified';

            // 🔔 Play sound if enabled and audio is ready
            if (isAlertEvent && isSoundEnabled && isAudioReady) {
                playAlertSound();
            }

            if (data.action === 'new_order' ||
                data.action === 'items_ready' ||
                data.action === 'status_changed' ||
                data.action === 'order_modified' ||
                data.action === 'order_deleted') {
                queryClient.invalidateQueries({ queryKey: ["orders", "in-progress"] });
                enqueueSnackbar(
                    `Grill order updated: ${data.action.replace('_', ' ')}`, 
                    { variant: isAlertEvent ? 'warning' : 'info' }
                );
            }
        };

        socket.on('orderUpdate', handleOrderUpdate);

        return () => {
            socket.off('orderUpdate', handleOrderUpdate);
        };
    }, [queryClient, isSoundEnabled, isAudioReady]);

    const handleMarkReady = async (orderId) => {
        try {
            await markSectionItemsReady(orderId, "grill");
            enqueueSnackbar("Grill items marked ready!", { variant: "success" });
        } catch (error) {
            console.error("Mark Ready Error:", error);
            enqueueSnackbar("Failed to mark items ready", { variant: "error" });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex justify-center items-center text-white">
                <p className="text-lg">Loading grill orders...</p>
            </div>
        );
    }

    // return (
    //     <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden text-white pb-20">
    //         <div className="flex flex-col md:flex-row md:justify-between items-center py-6 px-4 bg-[#111827] shadow-lg border-b border-[#334155] sticky top-0 z-10">
    //             <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
    //                 <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">
    //                     🔥 THE GRILL
    //                 </h1>
    //                 <div className="flex items-center space-x-3">
    //                     <span className="text-base font-medium text-gray-400 uppercase">
    //                         Grill Section
    //                     </span>
    //                     <span className={`text-xl font-bold px-3 py-1 rounded-full shadow-lg transition-colors ${
    //                         grillOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
    //                     }`}>
    //                         {grillOrders.length} {grillOrders.length > 0 ? 'Pending' : 'Clear'}
    //                     </span>
    //                 </div>
    //             </div>

    //             <button
    //                 onClick={handleToggleSound}
    //                 className={`flex items-center space-x-2 py-2 px-4 rounded-full font-bold transition-all duration-300 shadow-md ${
    //                     isSoundEnabled
    //                         ? 'bg-green-700 hover:bg-green-600 text-white'
    //                         : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    //                 }`}
    //                 title={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
    //             >
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    //                     {isSoundEnabled ? (
    //                         <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    //                     ) : (
    //                         <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
    //                     )}
    //                 </svg>
    //                 <span className="hidden sm:inline">{isSoundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
    //             </button>
    //         </div>

    //         <div className="px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-28 pt-6">
    //             {grillOrders.length === 0 ? (
    //                 <div className="col-span-full flex flex-col justify-center items-center h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-10">
    //                     <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    //                     </svg>
    //                     <p className="text-gray-300 text-xl font-semibold">All clear!</p>
    //                     <p className="text-gray-500">No active grill prep required.</p>
    //                 </div>
    //             ) : (
    //                 grillOrders.map((order) => (
    //                     <div
    //                         key={order._id}
    //                         className="bg-[#1e293b] p-5 rounded-xl shadow-lg border-2 border-[#dc2626] flex flex-col justify-between"
    //                     >
    //                         <div className="flex justify-between items-start mb-4 border-b border-[#334155] pb-3">
    //                             <div>
    //                                 <p className="text-gray-300 text-sm">Order Type / Table</p>
    //                                 <p className="text-xl font-bold text-white">
    //                                     {order.orderType}
    //                                     {order.tableNo ? <span className="text-[#F6B100]"> • TBL {order.tableNo}</span> : ""}
    //                                 </p>
    //                             </div>
    //                             <div className="text-right">
    //                                 <p className="text-gray-400 text-sm">Time Elapsed</p>
    //                                 <p className={`font-semibold text-lg ${
    //                                     Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 
    //                                         ? 'text-red-500' 
    //                                         : 'text-[#F6B100]'
    //                                 }`}>
    //                                     {getTimeElapsed(order.createdAt)}
    //                                 </p>
    //                             </div>
    //                         </div>

    //                         <div className="bg-[#0f172a] rounded-lg p-4 mb-5 flex-grow">
    //                             {order.items.map((item, index) => (
    //                                 <div key={index} className="mb-3 p-1 border-b border-gray-700 last:border-b-0">
    //                                     <p className="text-white text-lg font-bold">
    //                                         <span className="text-2xl text-red-500 mr-2">{item.quantity}x</span>
    //                                         {item.name}
    //                                     </p>
    //                                     {item.notes && (
    //                                         <p className="text-yellow-400 text-sm italic ml-8 mt-1">
    //                                             ** Notes: {item.notes}
    //                                         </p>
    //                                     )}
    //                                 </div>
    //                             ))}
    //                         </div>

    //                         <button
    //                             onClick={() => handleMarkReady(order._id)}
    //                             className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-4"
    //                         >
    //                             🔥 Mark Grill Items as READY
    //                         </button>
    //                     </div>
    //                 ))
    //             )}
    //         </div>

    //         <BottomNav />
    //     </div>
    // );
    return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col text-white">
        {/* Header - Fixed at top */}
        <div className="flex flex-col md:flex-row md:justify-between items-center py-4 sm:py-6 px-3 sm:px-4 lg:px-6 bg-[#111827] shadow-lg border-b border-[#334155] flex-shrink-0 z-10">
            <div className="flex flex-col items-center md:items-start mb-3 md:mb-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-1">
                    🔥 THE GRILL
                </h1>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-400 uppercase">
                        Grill Section
                    </span>
                    <span className={`text-base sm:text-lg lg:text-xl font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg transition-colors ${
                        grillOrders.length > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                        {grillOrders.length} {grillOrders.length > 0 ? 'Pending' : 'Clear'}
                    </span>
                </div>
            </div>

            <button
                onClick={handleToggleSound}
                className={`flex items-center space-x-2 py-2 px-3 sm:px-4 rounded-full font-bold transition-all duration-300 shadow-md text-sm sm:text-base ${
                    isSoundEnabled
                        ? 'bg-green-700 hover:bg-green-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
                aria-label={isSoundEnabled ? "Notifications ON" : "Notifications OFF"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
                    {isSoundEnabled ? (
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    ) : (
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    )}
                </svg>
                <span className="hidden sm:inline">{isSoundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
            </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 sm:pb-28">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {grillOrders.length === 0 ? (
                        <div className="col-span-full flex flex-col justify-center items-center h-48 sm:h-64 bg-[#1e293b] rounded-xl border border-[#334155] shadow-inner p-6 sm:p-10">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p className="text-gray-300 text-lg sm:text-xl font-semibold">All clear!</p>
                            <p className="text-gray-500 text-sm sm:text-base">No active grill prep required.</p>
                        </div>
                    ) : (
                        grillOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-[#1e293b] p-4 sm:p-5 rounded-xl shadow-lg border-2 border-[#dc2626] flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-3 sm:mb-4 border-b border-[#334155] pb-2 sm:pb-3">
                                    <div>
                                        <p className="text-gray-300 text-xs sm:text-sm">Order Type / Table</p>
                                        <p className="text-lg sm:text-xl font-bold text-white">
                                            {order.orderType}
                                            {order.tableNo ? <span className="text-[#F6B100]"> • TBL {order.tableNo}</span> : ""}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-xs sm:text-sm">Time Elapsed</p>
                                        <p className={`font-semibold text-base sm:text-lg ${
                                            Math.floor((currentTime - new Date(order.createdAt).getTime()) / 60000) > 15 
                                                ? 'text-red-500' 
                                                : 'text-[#F6B100]'
                                        }`}>
                                            {getTimeElapsed(order.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] rounded-lg p-3 sm:p-4 mb-4 sm:mb-5 flex-grow">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="mb-2 sm:mb-3 p-1 border-b border-gray-700 last:border-b-0">
                                            <p className="text-white text-base sm:text-lg font-bold">
                                                <span className="text-xl sm:text-2xl text-red-500 mr-1 sm:mr-2">{item.quantity}x</span>
                                                {item.name}
                                            </p>
                                            {item.notes && (
                                                <p className="text-yellow-400 text-xs sm:text-sm italic ml-6 sm:ml-8 mt-1">
                                                    ** Notes: {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleMarkReady(order._id)}
                                    className="bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-extrabold py-2.5 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg mt-3 sm:mt-4 text-sm sm:text-base"
                                >
                                    🔥 Mark Grill Items as READY
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <BottomNav />
    </div>
);
};

export default GrillSection;