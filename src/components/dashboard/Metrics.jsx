// Without charts


// import React, { useState } from "react";
// import { getOrders, getDishes, getCategories, getTable } from "../../https";
// import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// // --- INLINE ICONS ---
// const IconMoney = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M12 1a4 4 0 00-4 4v2H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1h-4V5a4 4 0 00-4-4zm0 2a2 2 0 012 2v2h-4V5a2 2 0 012-2z"/><path d="M12 17a3 3 0 100-6 3 3 0 000 6z"/></svg>);
// const IconCart = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>);
// const IconBell = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>);
// const IconDollar = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z"/><path d="M12 6.5v11M15.5 9.5a3 3 0 00-3-3h-1.5a3 3 0 000 6h3a3 3 0 010 6h-3a3 3 0 01-3-3"/></svg>);
// const IconUtensils = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M12 2v19M16 4a4 4 0 010 8V4h-4a4 4 0 010 8v9M8 4a4 4 0 000 8V4h4"/></svg>);
// const IconCheckCircle = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z"/><path d="M9 12l2 2 4-4"/></svg>);
// const IconList = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>);
// const IconChair = ({ size = 20 }) => (<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" height={size} width={size}><path d="M4 14h16M7 18v3M17 18v3M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4M4 14V6a2 2 0 012-2h12a2 2 0 012 2v8"/></svg>);

// const iconMap = {
//   Revenue: <IconMoney />,
//   "Total Orders": <IconCart />,
//   "Active Orders": <IconBell />,
//   "Avg Order Value": <IconDollar />,
//   "Items Sold": <IconUtensils />,
//   "Ready Orders": <IconCheckCircle />,
//   "Total Categories": <IconList />,
//   "Total Dishes": <IconList />,
//   "Total Tables": <IconChair />,
// };

// const isDateInRange = (orderDateStr, startDateStr, endDateStr) => {
//   const orderDate = new Date(orderDateStr);
//   orderDate.setHours(0, 0, 0, 0);

//   let startDate = startDateStr ? new Date(startDateStr) : null;
//   if (startDate) startDate.setHours(0, 0, 0, 0);

//   let endDate = endDateStr ? new Date(endDateStr) : null;
//   if (endDate) {
//     endDate.setHours(0, 0, 0, 0);
//     endDate.setDate(endDate.getDate() + 1);
//   }

//   const startCheck = !startDate || orderDate >= startDate;
//   const endCheck = !endDate || orderDate < endDate;
//   return startCheck && endCheck;
// };

// const MetricsContent = () => {
//   const [orderTypeFilter, setOrderTypeFilter] = useState("All");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // --- FETCH DATA USING YOUR REAL API ENDPOINTS ---
//   const { data: ordersRes, isLoading: ordersLoading } = useQuery({ queryKey: ["orders"], queryFn: getOrders });
//   const { data: dishesRes, isLoading: dishesLoading } = useQuery({ queryKey: ["dishes"], queryFn: getDishes });
//   const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
//   const { data: tablesRes, isLoading: tablesLoading } = useQuery({ queryKey: ["tables"], queryFn: getTable });

//   const isLoading = ordersLoading || dishesLoading || categoriesLoading || tablesLoading;

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//         <p>Loading essential metrics data...</p>
//       </div>
//     );
//   }

//   const orders = ordersRes?.data?.data || [];
//   const dishes = dishesRes?.data?.data || [];
//   const categories = categoriesRes?.data?.data || [];
//   const tables = tablesRes?.data?.data || [];

//   // --- FILTER ORDERS BASED ON FILTERS ---
//   const filteredOrders = orders.filter((order) => {
//     if (orderTypeFilter !== "All" && order.customerDetails?.orderType !== orderTypeFilter) return false;
//     if (startDate || endDate) {
//       if (!isDateInRange(order.createdAt, startDate, endDate)) return false;
//     }
//     return true;
//   });

//   // --- METRICS CALCULATIONS ---
// const completedOrders = filteredOrders.filter(order => order.orderStatus === "Completed");
// const readyOrders = filteredOrders.filter(order => order.orderStatus === "Ready");

// // 🟢 Total Orders: Only completed ones
// const totalOrders = completedOrders.length;

// // Revenue calculation
// const revenue = completedOrders.reduce((total, order) => total + (order.bills?.totalWithTax || 0), 0);

// // Total Items Sold
// const totalItemsSold = completedOrders.reduce((totalItems, order) => {
//   return totalItems + (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
// }, 0);

// // Average Order Value
// const avgOrderValue = completedOrders.length > 0 ? (revenue / completedOrders.length) : 0;

// // Active Orders = In Progress OR Ready
// const activeOrders = orders.filter(
//   (order) =>
//     (order.orderStatus === "In Progress" || order.orderStatus === "Ready") &&
//     (orderTypeFilter === "All" || order.customerDetails?.orderType === orderTypeFilter)
// )?.length || 0;

// // --- METRICS DISPLAY DATA ---
// const dynamicMetrics = [
//   { title: "Revenue", value: `BHD ${revenue.toFixed(2)}`, color: "#22C55E" },
//   { title: "Avg Order Value", value: `BHD ${avgOrderValue.toFixed(2)}`, color: "#3B82F6" },
//   { title: "Total Orders", value: totalOrders, color: "#7F56D9" }, // ✅ updated
//   { title: "Active Orders", value: activeOrders, color: "#F59E0B" },
//   { title: "Ready Orders", value: readyOrders.length, color: "#10B981" },
//   { title: "Items Sold", value: totalItemsSold, color: "#FF6B6B" },
//   { title: "Total Dishes", value: dishes.length, color: "#3B82F6" },
//   { title: "Total Categories", value: categories.length, color: "#60A5FA" },
//   { title: "Total Tables", value: tables.length, color: "#FB7185" },
// ];


//   const orderTypes = ["All", "Dine-In", "Take Away", "Delivery"];

//   return (
//     <div className="container mx-auto py-8 px-6 bg-[#1f1f1f] min-h-screen font-inter">
//       {/* HEADER */}
//       <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#333333] pb-4">
//         <div>
//           <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">Analytics Dashboard</h2>
//           <p className="text-sm text-[#ababab]">Performance metrics filtered by custom criteria.</p>
//         </div>
//       </div>

//       {/* FILTER CONTROLS */}
//       <div className="mt-6 p-4 bg-[#2a2a2a] rounded-xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//           <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">Filter by Type:</label>
//           <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//             {orderTypes.map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setOrderTypeFilter(type)}
//                 className={`text-sm font-medium px-4 py-1.5 rounded-md transition-all 
//                   ${orderTypeFilter === type
//                     ? "bg-[#02ca3a] text-black shadow-md"
//                     : "text-[#ababab] hover:bg-[#444444]"}`}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//           <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">Filter by Date:</label>
//           <div className="flex items-center gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//             />
//             <span className="text-[#ababab] font-bold">to</span>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//             />
//           </div>
//           {(startDate || endDate) && (
//             <button
//               onClick={() => { setStartDate(""); setEndDate(""); setOrderTypeFilter("All"); }}
//               className="text-sm font-medium px-3 py-1.5 text-red-400 bg-[#333333] rounded-md hover:bg-red-900/20 transition-colors"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* METRICS GRID */}
//       <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {dynamicMetrics.map((metric, index) => (
//           <div
//             key={index}
//             className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border-t-4 border-transparent transition duration-300 ease-out transform hover:scale-[1.03] hover:shadow-2xl hover:border-t-4"
//             style={{ borderTopColor: metric.color }}
//           >
//             <div className="flex justify-between items-center">
//               <div className="p-3 rounded-full bg-white/5" style={{ color: metric.color }}>
//                 {iconMap[metric.title]}
//               </div>
//               <p className="font-semibold text-sm text-[#ababab] tracking-wider uppercase">
//                 {metric.title}
//               </p>
//             </div>
//             <p className="mt-4 font-extrabold text-4xl" style={{ color: metric.color }}>
//               {metric.value}
//             </p>
//             <p className="mt-1 text-xs text-[#ababab]">
//               {metric.title.includes("Revenue")
//                 ? "Total sales generated"
//                 : metric.title.includes("Orders")
//                 ? "Total transactions"
//                 : "Overall count"}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // --- WRAP IN REACT QUERY CLIENT ---
// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <MetricsContent />
//   </QueryClientProvider>
// );

// export default App;

// with charts


// import React, { useState } from "react";
// import { getOrders, getDishes, getCategories, getTable } from "../../https";
// import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
// import { FaRegMoneyBillAlt, FaDrumSteelpan } from "react-icons/fa";
// import { TbShoppingCartUp, TbBellSchool } from "react-icons/tb";
// import { LuUtensilsCrossed } from "react-icons/lu";
// import { TiInputCheckedOutline } from "react-icons/ti";
// import { PiChairDuotone } from "react-icons/pi";
// import { FaClipboardList } from "react-icons/fa6";
// import { BsFillCartPlusFill } from "react-icons/bs";
// import { useNavigate } from 'react-router-dom';
// import {
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//     PieChart, Pie, Cell, BarChart, Bar
// } from 'recharts';


// const iconMap = {
//     Revenue: <FaRegMoneyBillAlt className="w-8 h-7" />,
//     "Total Orders": <BsFillCartPlusFill className="w-8 h-7" />,
//     "Active Orders": <TbBellSchool className="w-8 h-7" />,
//     "Avg Order Value": <TbShoppingCartUp className="w-8 h-7" />,
//     "Items Sold": <LuUtensilsCrossed className="w-8 h-7" />,
//     "Ready Orders": <TiInputCheckedOutline className="w-8 h-7" />,
//     "Total Categories": <FaClipboardList className="w-8 h-7" />,
//     "Total Dishes": <FaClipboardList className="w-8 h-7" />,
//     "Total Tables": <PiChairDuotone className="w-8 h-7" />,
// };

// // Utility function remains the same
// const isDateInRange = (orderDateStr, startDateStr, endDateStr) => {
//     const orderDate = new Date(orderDateStr);
//     orderDate.setHours(0, 0, 0, 0);

//     let startDate = startDateStr ? new Date(startDateStr) : null;
//     if (startDate) startDate.setHours(0, 0, 0, 0);

//     let endDate = endDateStr ? new Date(endDateStr) : null;
//     if (endDate) {
//         endDate.setHours(0, 0, 0, 0);
//         endDate.setDate(endDate.getDate() + 1);
//     }

//     const startCheck = !startDate || orderDate >= startDate;
//     const endCheck = !endDate || orderDate < endDate;
//     return startCheck && endCheck;
// };

// // =========================================================================
// // === NEW DATA PROCESSING FUNCTIONS =======================================
// // =========================================================================

// /**
//  * Calculates daily revenue from completed orders.
//  * @returns {Array<{date: string, Revenue: number}>}
//  */
// const getDailyRevenueData = (orders) => {
//     const completedOrders = orders.filter(order => order.orderStatus === "Completed");

//     const dailyRevenue = completedOrders.reduce((acc, order) => {
//         const date = new Date(order.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
//         const revenue = order.bills?.totalWithTax || 0;

//         acc[date] = (acc[date] || 0) + revenue;
//         return acc;
//     }, {});

//     return Object.keys(dailyRevenue)
//         .sort()
//         .map(date => ({
//             date: date,
//             Revenue: parseFloat(dailyRevenue[date].toFixed(3)),
//         }));
// };

// /**
//  * Calculates revenue distribution by order type.
//  * @returns {Array<{type: string, Revenue: number, color: string}>}
//  */
// const getRevenueByOrderType = (orders) => {
//     const completedOrders = orders.filter(order => order.orderStatus === "Completed");
//     const COLORS = ['#02ca3a', '#F6B100', '#FF6B6B', '#5A67D8']; // Colors for the Pie Chart

//     const revenueByType = completedOrders.reduce((acc, order) => {
//         const type = order.customerDetails?.orderType || "Other";
//         const revenue = order.bills?.totalWithTax || 0;

//         acc[type] = (acc[type] || 0) + revenue;
//         return acc;
//     }, {});

//     return Object.keys(revenueByType).map((type, index) => ({
//         type: type,
//         Revenue: parseFloat(revenueByType[type].toFixed(3)),
//         color: COLORS[index % COLORS.length]
//     }));
// };

// /**
//  * Finds the top selling dishes by quantity.
//  * @returns {Array<{name: string, Quantity: number}>}
//  */
// const getTopSellingDishes = (orders, limit = 7) => {
//     const completedOrders = orders.filter(order => order.orderStatus === "Completed");

//     const dishQuantities = completedOrders.reduce((acc, order) => {
//         (order.items || []).forEach(item => {
//             const name = item.name;
//             const quantity = item.quantity || 0;
//             acc[name] = (acc[name] || 0) + quantity;
//         });
//         return acc;
//     }, {});

//     return Object.keys(dishQuantities)
//         .map(name => ({
//             name: name,
//             Quantity: dishQuantities[name],
//         }))
//         .sort((a, b) => b.Quantity - a.Quantity)
//         .slice(0, limit);
// };


// // =========================================================================
// // === NEW CHART COMPONENTS ================================================
// // =========================================================================

// const RevenueLineChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full xl:col-span-2 min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">Daily Revenue Trend (BHD)</h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis dataKey="date" stroke="#ababab" tick={{ fontSize: 10 }} />
//                 <YAxis stroke="#ababab" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #02ca3a', color: '#f5f5f5' }}
//                     formatter={(value) => [`BHD ${value.toFixed(3)}`, 'Revenue']}
//                 />
//                 <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} payload={[{ value: 'Revenue', type: 'line', color: '#02ca3a' }]} />
//                 <Line type="monotone" dataKey="Revenue" stroke="#02ca3a" strokeWidth={2} dot={false} />
//             </LineChart>
//         </ResponsiveContainer>
//     </div>
// );

// const OrderTypePieChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">Revenue by Order Type</h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//                 <Pie
//                     data={data}
//                     dataKey="Revenue"
//                     nameKey="type"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     fill="#8884d8"
//                     labelLine={false}
//                     label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                     {data.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                 </Pie>
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #F6B100', color: '#f5f5f5' }}
//                     formatter={(value, name, props) => [`BHD ${value.toFixed(3)}`, props.payload.type]}
//                 />
//                 <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '10px' }} />
//             </PieChart>
//         </ResponsiveContainer>
//     </div>
// );

// const TopDishesBarChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">Top Selling Dishes (Quantity)</h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//                 data={data}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis type="number" stroke="#ababab" />
//                 <YAxis dataKey="name" type="category" stroke="#ababab" tick={{ fontSize: 10 }} width={80} />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #FF6B6B', color: '#f5f5f5' }}
//                     formatter={(value) => [value, 'Quantity Sold']}
//                 />
//                 <Legend iconType="square" wrapperStyle={{ paddingTop: '10px' }} payload={[{ value: 'Quantity', type: 'square', color: '#FF6B6B' }]} />
//                 <Bar dataKey="Quantity" fill="#FF6B6B" barSize={20} radius={[0, 10, 10, 0]} />
//             </BarChart>
//         </ResponsiveContainer>
//     </div>
// );


// // =========================================================================
// // === MAIN COMPONENT ======================================================
// // =========================================================================

// const MetricsContent = () => {
//         const navigate = useNavigate();

//     const [orderTypeFilter, setOrderTypeFilter] = useState("All");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");


//     // --- FETCH DATA ---
//     const { data: ordersRes, isLoading: ordersLoading } = useQuery({ queryKey: ["orders"], queryFn: getOrders });
//     const { data: dishesRes, isLoading: dishesLoading } = useQuery({ queryKey: ["dishes"], queryFn: getDishes });
//     const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
//     const { data: tablesRes, isLoading: tablesLoading } = useQuery({ queryKey: ["tables"], queryFn: getTable });

//     const isLoading = ordersLoading || dishesLoading || categoriesLoading || tablesLoading;

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//                 <p>Loading essential metrics data...</p>
//             </div>
//         );
//     }

//     const orders = ordersRes?.data?.data || [];
//     const dishes = dishesRes?.data?.data || [];
//     const categories = categoriesRes?.data?.data || [];
//     const tables = tablesRes?.data?.data || [];

//     // --- FILTER ORDERS ---
//     const filteredOrders = orders.filter((order) => {
//         if (orderTypeFilter !== "All" && order.customerDetails?.orderType !== orderTypeFilter) return false;
//         if (startDate || endDate) {
//             if (!isDateInRange(order.createdAt, startDate, endDate)) return false;
//         }
//         return true;
//     });

//     // --- METRICS & CHART DATA CALCULATIONS ---
//     const completedOrders = filteredOrders.filter(order => order.orderStatus === "Completed");
//     const readyOrders = filteredOrders.filter(order => order.orderStatus === "Ready");

//     const totalOrders = completedOrders.length;
//     const revenue = completedOrders.reduce((total, order) => total + (order.bills?.totalWithTax || 0), 0);
//     const totalItemsSold = completedOrders.reduce((totalItems, order) => {
//         return totalItems + (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
//     }, 0);
//     const avgOrderValue = completedOrders.length > 0 ? (revenue / completedOrders.length) : 0;
//     const activeOrders = orders.filter(
//         (order) =>
//             (order.orderStatus === "In Progress" || order.orderStatus === "Ready") &&
//             (orderTypeFilter === "All" || order.customerDetails?.orderType === orderTypeFilter)
//     )?.length || 0;

//     // --- CHART DATA GENERATION ---
//     const revenueData = getDailyRevenueData(filteredOrders);
//     const orderTypeData = getRevenueByOrderType(filteredOrders);
//     const topDishesData = getTopSellingDishes(filteredOrders, 7);


//     // --- METRICS DISPLAY DATA (Same as before) ---
//     const dynamicMetrics = [
//         { title: "Revenue", value: `BHD ${revenue.toFixed(3)}`, color: "#22C55E" },
//         { title: "Avg Order Value", value: `BHD ${avgOrderValue.toFixed(3)}`, color: "#3B82F6" },
//         { title: "Total Orders", value: totalOrders, color: "#7F56D9" },
//         { title: "Active Orders", value: activeOrders, color: "#F59E0B" },
//         { title: "Ready Orders", value: readyOrders.length, color: "#10B981" },
//         { title: "Items Sold", value: totalItemsSold, color: "#FF6B6B" },
//         { title: "Total Dishes", value: dishes.length, color: "#3B82F6" },
//         { title: "Total Categories", value: categories.length, color: "#60A5FA" },
//         { title: "Total Tables", value: tables.length, color: "#FB7185" },
//     ];


//     const orderTypes = ["All", "Dine-In", "Take Away", "Delivery"];

//     return (
//         <div className="container mx-auto py-8 px-6 bg-[#1f1f1f] min-h-screen font-inter">
//             {/* HEADER */}
//             {/* <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#333333] pb-4">
//                 <div>
//                     <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">Analytics Dashboard</h2>
//                     <p className="text-sm text-[#ababab]">Performance metrics filtered by custom criteria.</p>
//                 </div>
//             </div> */}
//             <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#333333] pb-4">
//                 <div>
//                     <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">Analytics Dashboard</h2>
//                     <p className="text-sm text-[#ababab]">Performance metrics filtered by custom criteria.</p>
//                 </div>

//                 {/* ⭐️ NEW DELIVERY METRICS BUTTON ⭐️ */}
//                 <button
//                     // Replace console.log with your actual router navigation, e.g., navigate('/delivery-metrics')
//                     onClick={() => navigate("/DeliveryMetrics")}
//                     className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-[#02ca3a] text-black hover:bg-[#02ca3a]/90"
//                 >
//                     View Delivery Metrics
//                 </button>
//             </div>


//             {/* FILTER CONTROLS */}
//             <div className="mt-6 p-4 bg-[#2a2a2a] rounded-xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">Filter by Type:</label>
//                     <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//                         {orderTypes.map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderTypeFilter(type)}
//                                 className={`text-sm font-medium px-4 py-1.5 rounded-md transition-all 
//                   ${orderTypeFilter === type
//                                         ? "bg-[#02ca3a] text-black shadow-md"
//                                         : "text-[#ababab] hover:bg-[#444444]"}`}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">Filter by Date:</label>
//                     <div className="flex items-center gap-2">
//                         <input
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                         />
//                         <span className="text-[#ababab] font-bold">to</span>
//                         <input
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                         />
//                     </div>
//                     {(startDate || endDate) && (
//                         <button
//                             onClick={() => { setStartDate(""); setEndDate(""); setOrderTypeFilter("All"); }}
//                             className="text-sm font-medium px-3 py-1.5 text-red-400 bg-[#333333] rounded-md hover:bg-red-900/20 transition-colors"
//                         >
//                             Clear Filters
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* METRICS GRID */}
//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {dynamicMetrics.map((metric, index) => (
//                     <div
//                         key={index}
//                         className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border-t-4 border-transparent transition duration-300 ease-out transform hover:scale-[1.03] hover:shadow-2xl hover:border-t-4"
//                         style={{ borderTopColor: metric.color }}
//                     >
//                         <div className="flex justify-between items-center">
//                             <div className="p-3 rounded-full bg-white/5" style={{ color: metric.color }}>
//                                 {iconMap[metric.title]}
//                             </div>
//                             <p className="font-semibold text-sm text-[#ababab] tracking-wider uppercase">
//                                 {metric.title}
//                             </p>
//                         </div>
//                         <p className="mt-4 font-extrabold text-4xl" style={{ color: metric.color }}>
//                             {metric.value}
//                         </p>
//                         <p className="mt-1 text-xs text-[#ababab]">
//                             {metric.title.includes("Revenue")
//                                 ? "Total sales generated"
//                                 : metric.title.includes("Orders")
//                                     ? "Total transactions"
//                                     : "Overall count"}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* =================================================================== */}
//             {/* === CHARTS SECTION ================================================ */}
//             {/* =================================================================== */}
//             <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 <RevenueLineChart data={revenueData} />
//                 <OrderTypePieChart data={orderTypeData} />
//             </div>

//             <div className="mt-6">
//                 <TopDishesBarChart data={topDishesData} />
//             </div>
//         </div>
//     );
// };

// // --- WRAP IN REACT QUERY CLIENT ---
// const queryClient = new QueryClient();

// const App = () => (
//     <QueryClientProvider client={queryClient}>
//         <MetricsContent />
//     </QueryClientProvider>
// );

// export default App;

// import { useDashboardAnalytics } from "../../hooks/orderData API optimization hooks/useAnalytics";



// import React, { useState, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
// import { FaRegMoneyBillAlt } from "react-icons/fa";
// import { TbShoppingCartUp, TbBellSchool } from "react-icons/tb";
// import { LuUtensilsCrossed } from "react-icons/lu";
// import { TiInputCheckedOutline } from "react-icons/ti";
// import { PiChairDuotone } from "react-icons/pi";
// import { FaClipboardList } from "react-icons/fa6";
// import { BsFillCartPlusFill } from "react-icons/bs";
// import { useQuery } from "@tanstack/react-query";
// import { getCategories, getTable } from "../../https";
// import {
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//     PieChart, Pie, Cell, BarChart, Bar
// } from 'recharts';

// // Import optimized hooks
// import { useDashboardAnalytics } from "../../hooks/orderData API optimization hooks/useAnalytics";

// const iconMap = {
//     Revenue: <FaRegMoneyBillAlt className="w-8 h-7" />,
//     "Total Orders": <BsFillCartPlusFill className="w-8 h-7" />,
//     "Active Orders": <TbBellSchool className="w-8 h-7" />,
//     "Avg Order Value": <TbShoppingCartUp className="w-8 h-7" />,
//     "Items Sold": <LuUtensilsCrossed className="w-8 h-7" />,
//     "Ready Orders": <TiInputCheckedOutline className="w-8 h-7" />,
//     "Total Categories": <FaClipboardList className="w-8 h-7" />,
//     "Total Dishes": <FaClipboardList className="w-8 h-7" />,
//     "Total Tables": <PiChairDuotone className="w-8 h-7" />,
// };

// // =========================================================================
// // === CHART COMPONENTS ===================================================
// // =========================================================================

// const RevenueLineChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full xl:col-span-2 min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//             Daily Revenue Trend (BHD)
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis dataKey="date" stroke="#ababab" tick={{ fontSize: 10 }} />
//                 <YAxis stroke="#ababab" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #02ca3a', color: '#f5f5f5' }}
//                     formatter={(value) => [`BHD ${value.toFixed(3)}`, 'Revenue']}
//                 />
//                 <Legend 
//                     iconType="circle" 
//                     wrapperStyle={{ paddingTop: '10px' }} 
//                     payload={[{ value: 'Revenue', type: 'line', color: '#02ca3a' }]} 
//                 />
//                 <Line type="monotone" dataKey="revenue" stroke="#02ca3a" strokeWidth={2} dot={false} />
//             </LineChart>
//         </ResponsiveContainer>
//     </div>
// );

// const OrderTypePieChart = ({ data }) => {
//     const COLORS = ['#02ca3a', '#F6B100', '#FF6B6B', '#5A67D8'];

//     const chartData = data.map((item, index) => ({
//         ...item,
//         fill: COLORS[index % COLORS.length]
//     }));

//     return (
//         <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl min-h-[350px]">
//             <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//                 Revenue by Order Type
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                     <Pie
//                         data={chartData}
//                         dataKey="revenue"
//                         nameKey="orderType"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={100}
//                         labelLine={false}
//                         label={({ orderType, percentage }) => 
//                             `${orderType}: ${percentage}%`
//                         }
//                     >
//                         {chartData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.fill} />
//                         ))}
//                     </Pie>
//                     <Tooltip
//                         contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #F6B100', color: '#f5f5f5' }}
//                         formatter={(value) => [`BHD ${parseFloat(value).toFixed(3)}`, 'Revenue']}
//                     />
//                     <Legend 
//                         layout="vertical" 
//                         verticalAlign="middle" 
//                         align="right" 
//                         wrapperStyle={{ paddingLeft: '10px' }} 
//                     />
//                 </PieChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// const TopDishesBarChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//             Top Selling Dishes (Quantity)
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//                 data={data}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis type="number" stroke="#ababab" />
//                 <YAxis 
//                     dataKey="name" 
//                     type="category" 
//                     stroke="#ababab" 
//                     tick={{ fontSize: 10 }} 
//                     width={100} 
//                 />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #FF6B6B', color: '#f5f5f5' }}
//                     formatter={(value) => [value, 'Quantity Sold']}
//                 />
//                 <Legend 
//                     iconType="square" 
//                     wrapperStyle={{ paddingTop: '10px' }} 
//                     payload={[{ value: 'Quantity', type: 'square', color: '#FF6B6B' }]} 
//                 />
//                 <Bar dataKey="quantity" fill="#FF6B6B" barSize={20} radius={[0, 10, 10, 0]} />
//             </BarChart>
//         </ResponsiveContainer>
//     </div>
// );

// // =========================================================================
// // === MAIN COMPONENT =====================================================
// // =========================================================================

// const Metrics = () => {
//     const navigate = useNavigate();

//     // State for filters
//     const [orderTypeFilter, setOrderTypeFilter] = useState("All");
//     const [dateFilter, setDateFilter] = useState("All");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // Calculate dateRange for API based on dateFilter
//     const dateRange = useMemo(() => {
//         if (dateFilter === "All") return null;
//         if (dateFilter === "Today") return 1;
//         if (dateFilter === "7 Days") return 7;
//         if (dateFilter === "30 Days") return 30;
//         if (dateFilter === "90 Days") return 90;
//         if (dateFilter === "Custom") return null; // Custom will use startDate/endDate
//         return 30; // Default
//     }, [dateFilter]);

//     // Prepare filters object for API
//     const filters = useMemo(() => {
//         const params = {};

//         // Add date range or custom dates
//         if (dateFilter === "Custom" && startDate && endDate) {
//             params.startDate = startDate;
//             params.endDate = endDate;
//         } else if (dateRange) {
//             params.dateRange = dateRange;
//         }

//         // Add order type filter
//         if (orderTypeFilter !== "All") {
//             params.orderType = orderTypeFilter;
//         }

//         return params;
//     }, [dateFilter, dateRange, startDate, endDate, orderTypeFilter]);

//     // Fetch analytics from server with filters
//     const { 
//         analytics, 
//         isLoading: isLoadingAnalytics, 
//         isError: isAnalyticsError,
//         refetch: refetchAnalytics 
//     } = useDashboardAnalytics(filters.dateRange || 30);

//     // Fetch categories and tables (static data)
//     const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({ 
//         queryKey: ["categories"], 
//         queryFn: getCategories 
//     });

//     const { data: tablesRes, isLoading: tablesLoading } = useQuery({ 
//         queryKey: ["tables"], 
//         queryFn: getTable 
//     });

//     const isLoading = isLoadingAnalytics || categoriesLoading || tablesLoading;

//     // Clear custom date when switching away from Custom filter
//     const handleDateFilterChange = (filter) => {
//         setDateFilter(filter);
//         if (filter !== "Custom") {
//             setStartDate("");
//             setEndDate("");
//         }
//     };

//     // Clear all filters
//     const handleClearFilters = () => {
//         setOrderTypeFilter("All");
//         setDateFilter("All");
//         setStartDate("");
//         setEndDate("");
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//                     <p className="text-lg">Loading analytics data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (isAnalyticsError) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//                 <div className="text-center">
//                     <p className="text-red-400 text-lg mb-4">Failed to load analytics</p>
//                     <button 
//                         onClick={() => refetchAnalytics()}
//                         className="px-4 py-2 bg-[#02ca3a] text-black rounded-lg hover:bg-[#02ca3a]/90"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Extract data from analytics
//     const summary = analytics?.summary || {};
//     const ordersByStatus = analytics?.ordersByStatus || {};
//     const dailyRevenueTrend = analytics?.dailyRevenueTrend || [];
//     const revenueByOrderType = analytics?.revenueByOrderType || [];
//     const topSellingDishes = analytics?.topSellingDishes || [];

//     const categories = categoriesRes?.data?.data || [];
//     const tables = tablesRes?.data?.data || [];

//     // Prepare metrics for display
//     const dynamicMetrics = [
//         { 
//             title: "Revenue", 
//             value: `BHD ${summary.totalRevenue || '0.000'}`, 
//             color: "#22C55E",
//             description: "Total sales generated"
//         },
//         { 
//             title: "Avg Order Value", 
//             value: `BHD ${summary.avgOrderValue || '0.000'}`, 
//             color: "#3B82F6",
//             description: "Average per order"
//         },
//         { 
//             title: "Total Orders", 
//             value: summary.totalOrders || 0, 
//             color: "#7F56D9",
//             description: "Total transactions"
//         },
//         { 
//             title: "Active Orders", 
//             value: summary.activeOrders || 0, 
//             color: "#F59E0B",
//             description: "Currently in progress"
//         },
//         { 
//             title: "Ready Orders", 
//             value: summary.readyOrders || 0, 
//             color: "#10B981",
//             description: "Ready for pickup"
//         },
//         { 
//             title: "Items Sold", 
//             value: summary.itemsSold || 0, 
//             color: "#FF6B6B",
//             description: "Total items sold"
//         },
//         { 
//             title: "Total Categories", 
//             value: categories.length, 
//             color: "#60A5FA",
//             description: "Overall count"
//         },
//         { 
//             title: "Total Tables", 
//             value: tables.length, 
//             color: "#FB7185",
//             description: "Overall count"
//         },
//     ];

//     const orderTypes = ["All", "Dine-in", "Take Away", "Delivery"];
//     const dateFilterOptions = ["All", "Today", "7 Days", "30 Days", "90 Days", "Custom"];

//     // Check if any filter is active
//     const hasActiveFilters = orderTypeFilter !== "All" || dateFilter !== "All" || startDate || endDate;

//     return (
//         <div className="container mx-auto py-8 px-6 bg-[#1f1f1f] min-h-screen font-inter">
//             {/* HEADER */}
//             <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#333333] pb-4">
//                 <div>
//                     <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">
//                         Analytics Dashboard
//                     </h2>
//                     <p className="text-sm text-[#ababab]">
//                         Performance metrics filtered by custom criteria
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => navigate("/DeliveryMetrics")}
//                     className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-[#02ca3a] text-black hover:bg-[#02ca3a]/90"
//                 >
//                     View Delivery Metrics
//                 </button>
//             </div>

//             {/* FILTER CONTROLS */}
//             <div className="mt-6 p-4 bg-[#2a2a2a] rounded-xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                 {/* Order Type Filter */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
//                         Filter by Type:
//                     </label>
//                     <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//                         {orderTypes.map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderTypeFilter(type)}
//                                 className={`text-sm font-medium px-4 py-1.5 rounded-md transition-all 
//                                     ${orderTypeFilter === type
//                                         ? "bg-[#02ca3a] text-black shadow-md"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Date Filter */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
//                         Filter by Date:
//                     </label>
//                     <div className="flex flex-wrap items-center gap-2">
//                         <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//                             {dateFilterOptions.map((filter) => (
//                                 <button
//                                     key={filter}
//                                     onClick={() => handleDateFilterChange(filter)}
//                                     className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap
//                                         ${dateFilter === filter
//                                             ? "bg-[#02ca3a] text-black shadow-md"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                 >
//                                     {filter}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Custom Date Inputs */}
//                         {dateFilter === "Custom" && (
//                             <div className="flex items-center gap-2 ml-2">
//                                 <input
//                                     type="date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                     className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                                 />
//                                 <span className="text-[#ababab] font-bold">to</span>
//                                 <input
//                                     type="date"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                     className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                                 />
//                             </div>
//                         )}

//                         {/* Clear Filters Button */}
//                         {hasActiveFilters && (
//                             <button
//                                 onClick={handleClearFilters}
//                                 className="text-sm font-medium px-3 py-1.5 text-red-400 bg-[#333333] rounded-md hover:bg-red-900/20 transition-colors ml-2"
//                             >
//                                 Clear Filters
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* METRICS GRID */}
//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {dynamicMetrics.map((metric, index) => (
//                     <div
//                         key={index}
//                         className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border-t-4 border-transparent transition duration-300 ease-out transform hover:scale-[1.03] hover:shadow-2xl hover:border-t-4"
//                         style={{ borderTopColor: metric.color }}
//                     >
//                         <div className="flex justify-between items-center">
//                             <div 
//                                 className="p-3 rounded-full bg-white/5" 
//                                 style={{ color: metric.color }}
//                             >
//                                 {iconMap[metric.title]}
//                             </div>
//                             <p className="font-semibold text-sm text-[#ababab] tracking-wider uppercase">
//                                 {metric.title}
//                             </p>
//                         </div>
//                         <p 
//                             className="mt-4 font-extrabold text-4xl" 
//                             style={{ color: metric.color }}
//                         >
//                             {metric.value}
//                         </p>
//                         <p className="mt-1 text-xs text-[#ababab]">
//                             {metric.description}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* CHARTS SECTION */}
//             <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 <RevenueLineChart data={dailyRevenueTrend} />
//                 <OrderTypePieChart data={revenueByOrderType} />
//             </div>

//             <div className="mt-6">
//                 <TopDishesBarChart data={topSellingDishes} />
//             </div>
//         </div>
//     );
// };

// export default Metrics;



// import React, { useState, useMemo } from "react";
// import { useNavigate } from 'react-router-dom';
// import { FaRegMoneyBillAlt } from "react-icons/fa";
// import { TbShoppingCartUp, TbBellSchool } from "react-icons/tb";
// import { LuUtensilsCrossed } from "react-icons/lu";
// import { TiInputCheckedOutline } from "react-icons/ti";
// import { PiChairDuotone } from "react-icons/pi";
// import { FaClipboardList } from "react-icons/fa6";
// import { BsFillCartPlusFill } from "react-icons/bs";
// import { useQuery } from "@tanstack/react-query";
// import { getCategories, getTable } from "../../https";
// import {
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//     PieChart, Pie, Cell, BarChart, Bar
// } from 'recharts';

// // Import optimized hooks
// import { useDashboardAnalytics } from "../../hooks/orderData API optimization hooks/useAnalytics";

// const iconMap = {
//     Revenue: <FaRegMoneyBillAlt className="w-8 h-7" />,
//     "Total Orders": <BsFillCartPlusFill className="w-8 h-7" />,
//     "Active Orders": <TbBellSchool className="w-8 h-7" />,
//     "Avg Order Value": <TbShoppingCartUp className="w-8 h-7" />,
//     "Items Sold": <LuUtensilsCrossed className="w-8 h-7" />,
//     "Ready Orders": <TiInputCheckedOutline className="w-8 h-7" />,
//     "Total Categories": <FaClipboardList className="w-8 h-7" />,
//     "Total Dishes": <FaClipboardList className="w-8 h-7" />,
//     "Total Tables": <PiChairDuotone className="w-8 h-7" />,
// };

// // =========================================================================
// // === CHART COMPONENTS ===================================================
// // =========================================================================

// const RevenueLineChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full xl:col-span-2 min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//             Daily Revenue Trend (BHD)
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis dataKey="date" stroke="#ababab" tick={{ fontSize: 10 }} />
//                 <YAxis stroke="#ababab" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #02ca3a', color: '#f5f5f5' }}
//                     formatter={(value) => [`BHD ${value.toFixed(3)}`, 'Revenue']}
//                 />
//                 <Legend 
//                     iconType="circle" 
//                     wrapperStyle={{ paddingTop: '10px' }} 
//                     payload={[{ value: 'Revenue', type: 'line', color: '#02ca3a' }]} 
//                 />
//                 <Line type="monotone" dataKey="revenue" stroke="#02ca3a" strokeWidth={2} dot={false} />
//             </LineChart>
//         </ResponsiveContainer>
//     </div>
// );

// const OrderTypePieChart = ({ data }) => {
//     const COLORS = ['#02ca3a', '#F6B100', '#FF6B6B', '#5A67D8'];

//     const chartData = data.map((item, index) => ({
//         ...item,
//         fill: COLORS[index % COLORS.length]
//     }));

//     return (
//         <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl min-h-[350px]">
//             <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//                 Revenue by Order Type
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                     <Pie
//                         data={chartData}
//                         dataKey="revenue"
//                         nameKey="orderType"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={100}
//                         labelLine={false}
//                         label={({ orderType, percentage }) => 
//                             `${orderType}: ${percentage}%`
//                         }
//                     >
//                         {chartData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.fill} />
//                         ))}
//                     </Pie>
//                     <Tooltip
//                         contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #F6B100', color: '#f5f5f5' }}
//                         formatter={(value) => [`BHD ${parseFloat(value).toFixed(3)}`, 'Revenue']}
//                     />
//                     <Legend 
//                         layout="vertical" 
//                         verticalAlign="middle" 
//                         align="right" 
//                         wrapperStyle={{ paddingLeft: '10px' }} 
//                     />
//                 </PieChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// const TopDishesBarChart = ({ data }) => (
//     <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl col-span-full min-h-[350px]">
//         <h3 className="text-xl font-bold text-[#f5f5f5] mb-4 border-b border-[#333333] pb-2">
//             Top Selling Dishes (Quantity)
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//                 data={data}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis type="number" stroke="#ababab" />
//                 <YAxis 
//                     dataKey="name" 
//                     type="category" 
//                     stroke="#ababab" 
//                     tick={{ fontSize: 10 }} 
//                     width={100} 
//                 />
//                 <Tooltip
//                     contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #FF6B6B', color: '#f5f5f5' }}
//                     formatter={(value) => [value, 'Quantity Sold']}
//                 />
//                 <Legend 
//                     iconType="square" 
//                     wrapperStyle={{ paddingTop: '10px' }} 
//                     payload={[{ value: 'Quantity', type: 'square', color: '#FF6B6B' }]} 
//                 />
//                 <Bar dataKey="quantity" fill="#FF6B6B" barSize={20} radius={[0, 10, 10, 0]} />
//             </BarChart>
//         </ResponsiveContainer>
//     </div>
// );

// // =========================================================================
// // === MAIN COMPONENT =====================================================
// // =========================================================================

// const Metrics = () => {
//     const navigate = useNavigate();

//     // State for filters
//     const [orderTypeFilter, setOrderTypeFilter] = useState("All");
//     const [dateFilter, setDateFilter] = useState("All");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // Calculate dateRange for API based on dateFilter
//     const dateRange = useMemo(() => {
//         if (dateFilter === "All") return null;
//         if (dateFilter === "Today") return 1;
//         if (dateFilter === "7 Days") return 7;
//         if (dateFilter === "30 Days") return 30;
//         if (dateFilter === "90 Days") return 90;
//         if (dateFilter === "Custom") return null; // Custom will use startDate/endDate
//         return 30; // Default
//     }, [dateFilter]);

//     // ✅ FIXED: Prepare filters object for API with all parameters
//     const filters = useMemo(() => {
//         const params = {};

//         // Add date range or custom dates
//         if (dateFilter === "Custom" && startDate && endDate) {
//             params.startDate = startDate;
//             params.endDate = endDate;
//         } else if (dateRange) {
//             params.dateRange = dateRange;
//         } else {
//             // Default to 30 days when "All" is selected
//             params.dateRange = 30;
//         }

//         // Add order type filter (only if not "All")
//         if (orderTypeFilter !== "All") {
//             params.orderType = orderTypeFilter;
//         }

//         console.log('🎯 Filters prepared for API:', params);
//         return params;
//     }, [dateFilter, dateRange, startDate, endDate, orderTypeFilter]);

//     // ✅ FIXED: Pass the complete filters object to the hook
//     const { 
//         analytics, 
//         isLoading: isLoadingAnalytics, 
//         isError: isAnalyticsError,
//         refetch: refetchAnalytics 
//     } = useDashboardAnalytics(filters);

//     // Fetch categories and tables (static data)
//     const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({ 
//         queryKey: ["categories"], 
//         queryFn: getCategories 
//     });

//     const { data: tablesRes, isLoading: tablesLoading } = useQuery({ 
//         queryKey: ["tables"], 
//         queryFn: getTable 
//     });

//     const isLoading = isLoadingAnalytics || categoriesLoading || tablesLoading;

//     // Clear custom date when switching away from Custom filter
//     const handleDateFilterChange = (filter) => {
//         setDateFilter(filter);
//         if (filter !== "Custom") {
//             setStartDate("");
//             setEndDate("");
//         }
//     };

//     // Clear all filters
//     const handleClearFilters = () => {
//         setOrderTypeFilter("All");
//         setDateFilter("All");
//         setStartDate("");
//         setEndDate("");
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//                     <p className="text-lg">Loading analytics data...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Error state
//     if (isAnalyticsError) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//                 <div className="text-center">
//                     <p className="text-red-400 text-lg mb-4">Failed to load analytics</p>
//                     <button 
//                         onClick={() => refetchAnalytics()}
//                         className="px-4 py-2 bg-[#02ca3a] text-black rounded-lg hover:bg-[#02ca3a]/90"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Extract data from analytics
//     const summary = analytics?.summary || {};
//     const ordersByStatus = analytics?.ordersByStatus || {};
//     const dailyRevenueTrend = analytics?.dailyRevenueTrend || [];
//     const revenueByOrderType = analytics?.revenueByOrderType || [];
//     const topSellingDishes = analytics?.topSellingDishes || [];

//     const categories = categoriesRes?.data?.data || [];
//     const tables = tablesRes?.data?.data || [];

//     // Prepare metrics for display
//     const dynamicMetrics = [
//         { 
//             title: "Revenue", 
//             value: `BHD ${summary.totalRevenue || '0.000'}`, 
//             color: "#22C55E",
//             description: "Total sales generated"
//         },
//         { 
//             title: "Avg Order Value", 
//             value: `BHD ${summary.avgOrderValue || '0.000'}`, 
//             color: "#3B82F6",
//             description: "Average per order"
//         },
//         { 
//             title: "Total Orders", 
//             value: summary.totalOrders || 0, 
//             color: "#7F56D9",
//             description: "Total transactions"
//         },
//         { 
//             title: "Active Orders", 
//             value: summary.activeOrders || 0, 
//             color: "#F59E0B",
//             description: "Currently in progress"
//         },
//         { 
//             title: "Ready Orders", 
//             value: summary.readyOrders || 0, 
//             color: "#10B981",
//             description: "Ready for pickup"
//         },
//         { 
//             title: "Items Sold", 
//             value: summary.itemsSold || 0, 
//             color: "#FF6B6B",
//             description: "Total items sold"
//         },
//         { 
//             title: "Total Categories", 
//             value: categories.length, 
//             color: "#60A5FA",
//             description: "Overall count"
//         },
//         { 
//             title: "Total Tables", 
//             value: tables.length, 
//             color: "#FB7185",
//             description: "Overall count"
//         },
//     ];

//     const orderTypes = ["All", "Dine-in", "Take Away", "Delivery"];
//     const dateFilterOptions = ["All", "Today", "7 Days", "30 Days", "90 Days", "Custom"];

//     // Check if any filter is active
//     const hasActiveFilters = orderTypeFilter !== "All" || dateFilter !== "All" || startDate || endDate;

//     return (
//         <div className="container mx-auto py-8 px-6 bg-[#1f1f1f] min-h-screen font-inter">
//             {/* HEADER */}
//             <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#333333] pb-4">
//                 <div>
//                     <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">
//                         Analytics Dashboard
//                     </h2>
//                     <p className="text-sm text-[#ababab]">
//                         Performance metrics filtered by custom criteria
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => navigate("/DeliveryMetrics")}
//                     className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-[#02ca3a] text-black hover:bg-[#02ca3a]/90"
//                 >
//                     View Delivery Metrics
//                 </button>
//             </div>

//             {/* FILTER CONTROLS */}
//             <div className="mt-6 p-4 bg-[#2a2a2a] rounded-xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                 {/* Order Type Filter */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
//                         Filter by Type:
//                     </label>
//                     <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//                         {orderTypes.map((type) => (
//                             <button
//                                 key={type}
//                                 onClick={() => setOrderTypeFilter(type)}
//                                 className={`text-sm font-medium px-4 py-1.5 rounded-md transition-all 
//                                     ${orderTypeFilter === type
//                                         ? "bg-[#02ca3a] text-black shadow-md"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                 }`}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Date Filter */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//                     <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
//                         Filter by Date:
//                     </label>
//                     <div className="flex flex-wrap items-center gap-2">
//                         <div className="flex flex-wrap gap-2 bg-[#333333] p-1 rounded-lg">
//                             {dateFilterOptions.map((filter) => (
//                                 <button
//                                     key={filter}
//                                     onClick={() => handleDateFilterChange(filter)}
//                                     className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap
//                                         ${dateFilter === filter
//                                             ? "bg-[#02ca3a] text-black shadow-md"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
//                                 >
//                                     {filter}
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Custom Date Inputs */}
//                         {dateFilter === "Custom" && (
//                             <div className="flex items-center gap-2 ml-2">
//                                 <input
//                                     type="date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                     className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                                 />
//                                 <span className="text-[#ababab] font-bold">to</span>
//                                 <input
//                                     type="date"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                     className="bg-[#333333] text-[#f5f5f5] rounded-md px-3 py-1.5 text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
//                                 />
//                             </div>
//                         )}

//                         {/* Clear Filters Button */}
//                         {hasActiveFilters && (
//                             <button
//                                 onClick={handleClearFilters}
//                                 className="text-sm font-medium px-3 py-1.5 text-red-400 bg-[#333333] rounded-md hover:bg-red-900/20 transition-colors ml-2"
//                             >
//                                 Clear Filters
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* METRICS GRID */}
//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {dynamicMetrics.map((metric, index) => (
//                     <div
//                         key={index}
//                         className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border-t-4 border-transparent transition duration-300 ease-out transform hover:scale-[1.03] hover:shadow-2xl hover:border-t-4"
//                         style={{ borderTopColor: metric.color }}
//                     >
//                         <div className="flex justify-between items-center">
//                             <div 
//                                 className="p-3 rounded-full bg-white/5" 
//                                 style={{ color: metric.color }}
//                             >
//                                 {iconMap[metric.title]}
//                             </div>
//                             <p className="font-semibold text-sm text-[#ababab] tracking-wider uppercase">
//                                 {metric.title}
//                             </p>
//                         </div>
//                         <p 
//                             className="mt-4 font-extrabold text-4xl" 
//                             style={{ color: metric.color }}
//                         >
//                             {metric.value}
//                         </p>
//                         <p className="mt-1 text-xs text-[#ababab]">
//                             {metric.description}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* CHARTS SECTION */}
//             <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 <RevenueLineChart data={dailyRevenueTrend} />
//                 <OrderTypePieChart data={revenueByOrderType} />
//             </div>

//             <div className="mt-6">
//                 <TopDishesBarChart data={topSellingDishes} />
//             </div>
//         </div>
//     );
// };

// export default Metrics;


import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { TbShoppingCartUp, TbBellSchool } from "react-icons/tb";
import { LuUtensilsCrossed } from "react-icons/lu";
import { TiInputCheckedOutline } from "react-icons/ti";
import { PiChairDuotone } from "react-icons/pi";
import { FaClipboardList } from "react-icons/fa6";
import { BsFillCartPlusFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTable } from "../../https";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useDashboardAnalytics } from "../../hooks/orderData API optimization hooks/useAnalytics";

import SalesReportButton from '../Reports/SalesReportButton';

const iconMap = {
    Revenue: <FaRegMoneyBillAlt className="w-8 h-7" />,
    "Total Orders": <BsFillCartPlusFill className="w-8 h-7" />,
    "Active Orders": <TbBellSchool className="w-8 h-7" />,
    "Avg Order Value": <TbShoppingCartUp className="w-8 h-7" />,
    "Items Sold": <LuUtensilsCrossed className="w-8 h-7" />,
    "Ready Orders": <TiInputCheckedOutline className="w-8 h-7" />,
    "Total Categories": <FaClipboardList className="w-8 h-7" />,
    "Total Tables": <PiChairDuotone className="w-8 h-7" />,
};

// =========================================================================
// === PROFESSIONAL CHART COMPONENTS ======================================
// =========================================================================

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-[#1a1a1a] border-2 border-[#02ca3a] rounded-lg p-3 shadow-2xl">
            <p className="text-[#f5f5f5] font-semibold text-sm mb-2">{label}</p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[#ababab] text-xs">{entry.name}:</span>
                    <span className="text-[#02ca3a] font-bold text-sm">
                        {valueFormatter ? valueFormatter(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const RevenueLineChart = ({ data }) => {
    // Format dates to be more readable
    const formattedData = useMemo(() =>
        data.map(item => ({
            ...item,
            displayDate: new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        })), [data]
    );

    return (
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-4 sm:p-6 rounded-2xl shadow-2xl col-span-full xl:col-span-2 min-h-[350px] border border-[#333333]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#333333]">
                <h3 className="text-lg sm:text-xl font-bold text-[#f5f5f5]">
                    📈 Daily Revenue Trend
                </h3>
                <span className="text-xs sm:text-sm text-[#02ca3a] font-semibold px-3 py-1 bg-[#02ca3a]/10 rounded-full">
                    BHD
                </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#02ca3a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#02ca3a" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis
                        dataKey="displayDate"
                        stroke="#ababab"
                        tick={{ fontSize: 11, fill: '#ababab' }}
                        tickLine={{ stroke: '#444' }}
                    />
                    <YAxis
                        stroke="#ababab"
                        tick={{ fontSize: 11, fill: '#ababab' }}
                        tickLine={{ stroke: '#444' }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        content={<CustomTooltip valueFormatter={(val) => `BHD ${val.toFixed(3)}`} />}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '15px' }}
                        payload={[{
                            value: 'Revenue',
                            type: 'line',
                            color: '#02ca3a',
                            id: 'revenue'
                        }]}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#02ca3a"
                        strokeWidth={3}
                        dot={{ fill: '#02ca3a', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#02ca3a', stroke: '#fff', strokeWidth: 2 }}
                        fill="url(#colorRevenue)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const OrderTypePieChart = ({ data }) => {
    const COLORS = ['#02ca3a', '#F6B100', '#FF6B6B', '#5A67D8'];

    const chartData = useMemo(() =>
        data.map((item, index) => ({
            ...item,
            fill: COLORS[index % COLORS.length]
        })), [data]
    );

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, orderType }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-bold text-xs sm:text-sm"
            >
                {`${percentage}%`}
            </text>
        );
    };

    return (
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-4 sm:p-6 rounded-2xl shadow-2xl min-h-[350px] border border-[#333333]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#333333]">
                <h3 className="text-lg sm:text-xl font-bold text-[#f5f5f5]">
                    🍽️ Revenue by Order Type
                </h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="revenue"
                        nameKey="orderType"
                        cx="50%"
                        cy="50%"
                        outerRadius={window.innerWidth < 640 ? 70 : 90}
                        innerRadius={window.innerWidth < 640 ? 40 : 50}
                        labelLine={false}
                        label={CustomLabel}
                        strokeWidth={2}
                        stroke="#1f1f1f"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.fill}
                                style={{
                                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={<CustomTooltip valueFormatter={(val) => `BHD ${parseFloat(val).toFixed(3)}`} />}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const TopDishesBarChart = ({ data }) => {
    // Add display name with variation
    const chartData = useMemo(() =>
        data.map(dish => ({
            ...dish,
            displayName: dish.variation
                ? `${dish.name} (${dish.variation})`
                : dish.name,
            // Truncate long names for mobile
            shortName: dish.name.length > 15
                ? dish.name.substring(0, 12) + '...'
                : dish.name
        })), [data]
    );

    const isMobile = window.innerWidth < 640;

    return (
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-4 sm:p-6 rounded-2xl shadow-2xl col-span-full min-h-[350px] border border-[#333333]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#333333]">
                <h3 className="text-lg sm:text-xl font-bold text-[#f5f5f5]">
                    🏆 Top Selling Dishes
                </h3>
                <span className="text-xs sm:text-sm text-[#FF6B6B] font-semibold px-3 py-1 bg-[#FF6B6B]/10 rounded-full">
                    Quantity
                </span>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(chartData.length * 45, 280)}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF6B6B" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} horizontal={true} vertical={false} />
                    <XAxis
                        type="number"
                        stroke="#ababab"
                        tick={{ fontSize: 11, fill: '#ababab' }}
                        tickLine={{ stroke: '#444' }}
                    />
                    <YAxis
                        dataKey={isMobile ? "shortName" : "displayName"}
                        type="category"
                        stroke="#ababab"
                        tick={{ fontSize: isMobile ? 10 : 11, fill: '#ababab' }}
                        width={isMobile ? 80 : 140}
                        tickLine={{ stroke: '#444' }}
                    />
                    <Tooltip
                        content={<CustomTooltip valueFormatter={(val) => `${val} sold`} />}
                        cursor={{ fill: 'rgba(255, 107, 107, 0.1)' }}
                    />
                    <Legend
                        iconType="square"
                        wrapperStyle={{ paddingTop: '15px' }}
                        payload={[{
                            value: 'Quantity Sold',
                            type: 'square',
                            color: '#FF6B6B',
                            id: 'quantity'
                        }]}
                    />
                    <Bar
                        dataKey="quantity"
                        fill="url(#colorBar)"
                        barSize={isMobile ? 20 : 28}
                        radius={[0, 8, 8, 0]}
                        label={{
                            position: 'right',
                            fill: '#02ca3a',
                            fontSize: isMobile ? 10 : 12,
                            fontWeight: 'bold'
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// =========================================================================
// === MAIN COMPONENT =====================================================
// =========================================================================

const Metrics = () => {
    const navigate = useNavigate();

    // State for filters
    const [orderTypeFilter, setOrderTypeFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Calculate dateRange for API based on dateFilter
    const dateRange = useMemo(() => {
        if (dateFilter === "All") return null;
        if (dateFilter === "Today") return 1;
        if (dateFilter === "7 Days") return 7;
        if (dateFilter === "30 Days") return 30;
        if (dateFilter === "90 Days") return 90;
        if (dateFilter === "Custom") return null;
        return 30;
    }, [dateFilter]);

    // Prepare filters object for API
    const filters = useMemo(() => {
        const params = {};

        if (dateFilter === "Custom" && startDate && endDate) {
            params.startDate = startDate;
            params.endDate = endDate;
        } else if (dateFilter !== "All" && dateRange) {
            params.dateRange = dateRange;
        }

        if (orderTypeFilter !== "All") {
            params.orderType = orderTypeFilter;
        }

        return params;
    }, [dateFilter, dateRange, startDate, endDate, orderTypeFilter]);

    const {
        analytics,
        isLoading: isLoadingAnalytics,
        isError: isAnalyticsError,
        refetch: refetchAnalytics
    } = useDashboardAnalytics(filters);

    const { data: categoriesRes, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories
    });

    const { data: tablesRes, isLoading: tablesLoading } = useQuery({
        queryKey: ["tables"],
        queryFn: getTable
    });

    const isLoading = isLoadingAnalytics || categoriesLoading || tablesLoading;

    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
        if (filter !== "Custom") {
            setStartDate("");
            setEndDate("");
        }
    };

    const handleClearFilters = () => {
        setOrderTypeFilter("All");
        setDateFilter("All");
        setStartDate("");
        setEndDate("");
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#02ca3a] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Loading analytics...</p>
                    <p className="text-sm text-[#ababab] mt-2">Crunching the numbers</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isAnalyticsError) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
                <div className="text-center max-w-md px-4">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <p className="text-red-400 text-xl font-bold mb-2">Failed to load analytics</p>
                    <p className="text-[#ababab] text-sm mb-6">We couldn't fetch the data. Please try again.</p>
                    <button
                        onClick={() => refetchAnalytics()}
                        className="px-6 py-3 bg-[#02ca3a] text-black rounded-lg hover:bg-[#02ca3a]/90 font-semibold transition-all"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    // Extract data from analytics
    const summary = analytics?.summary || {};
    const dailyRevenueTrend = analytics?.dailyRevenueTrend || [];
    const revenueByOrderType = analytics?.revenueByOrderType || [];
    const topSellingDishes = analytics?.topSellingDishes || [];

    const categories = categoriesRes?.data?.data || [];
    const tables = tablesRes?.data?.data || [];

    // Prepare metrics for display
    const dynamicMetrics = [
        {
            title: "Revenue",
            value: `BHD ${summary.totalRevenue || '0.000'}`,
            color: "#22C55E",
            description: "Total sales generated",
            trend: "+12.5%"
        },
        {
            title: "Avg Order Value",
            value: `BHD ${summary.avgOrderValue || '0.000'}`,
            color: "#3B82F6",
            description: "Average per order",
            trend: "+5.2%"
        },
        {
            title: "Total Orders",
            value: summary.totalOrders || 0,
            color: "#7F56D9",
            description: "Total transactions",
            trend: "+8.7%"
        },
        {
            title: "Active Orders",
            value: summary.activeOrders || 0,
            color: "#F59E0B",
            description: "Currently in progress"
        },
        {
            title: "Ready Orders",
            value: summary.readyOrders || 0,
            color: "#10B981",
            description: "Ready for pickup"
        },
        {
            title: "Items Sold",
            value: summary.itemsSold || 0,
            color: "#FF6B6B",
            description: "Total items sold"
        },
        {
            title: "Total Categories",
            value: categories.length,
            color: "#60A5FA",
            description: "Overall count"
        },
        {
            title: "Total Tables",
            value: tables.length,
            color: "#FB7185",
            description: "Overall count"
        },
    ];

    const orderTypes = ["All", "Dine-in", "Take Away", "Delivery"];
    const dateFilterOptions = ["All", "Today", "7 Days", "30 Days", "90 Days", "Custom"];

    const hasActiveFilters = orderTypeFilter !== "All" || dateFilter !== "All" || startDate || endDate;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#1f1f1f]">
            <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-[#333333]">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-2 bg-gradient-to-r from-[#02ca3a] to-[#F6B100] bg-clip-text ">
                            Analytics Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-[#ababab]">
                            📊 Performance metrics & insights
                        </p>
                    </div>

                    {/* <button
                        onClick={() => navigate("/DeliveryMetrics")}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold rounded-xl transition-all bg-gradient-to-r from-[#02ca3a] to-[#029c2e] text-black hover:shadow-lg hover:scale-105"
                    >
                        🚚 Delivery Metrics
                    </button> */}
                    <div className="flex gap-3">
                        <SalesReportButton />

                        <button
                            onClick={() => navigate("/DeliveryMetrics")}
                            className="px-6 py-3 text-sm font-semibold rounded-xl transition-all bg-gradient-to-r from-[#02ca3a] to-[#029c2e] text-black hover:shadow-lg hover:scale-105"
                        >
                            🚚 Delivery Metrics
                        </button>
                    </div>
                </div>

                {/* FILTER CONTROLS */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-2xl shadow-xl border border-[#333333]">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                        {/* Order Type Filter */}
                        <div className="flex-1">
                            <label className="text-xs sm:text-sm font-semibold text-[#ababab] mb-2 block">
                                📋 ORDER TYPE
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {orderTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setOrderTypeFilter(type)}
                                        className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all ${orderTypeFilter === type
                                                ? "bg-gradient-to-r from-[#02ca3a] to-[#029c2e] text-black shadow-lg scale-105"
                                                : "bg-[#333333] text-[#ababab] hover:bg-[#444444]"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="flex-1">
                            <label className="text-xs sm:text-sm font-semibold text-[#ababab] mb-2 block">
                                📅 DATE RANGE
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                                {dateFilterOptions.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleDateFilterChange(filter)}
                                        className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${dateFilter === filter
                                                ? "bg-gradient-to-r from-[#02ca3a] to-[#029c2e] text-black shadow-lg scale-105"
                                                : "bg-[#333333] text-[#ababab] hover:bg-[#444444]"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}

                                {/* Custom Date Inputs */}
                                {dateFilter === "Custom" && (
                                    <div className="flex items-center gap-2 mt-2 w-full">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="flex-1 bg-[#333333] text-[#f5f5f5] rounded-lg px-3 py-2 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
                                        />
                                        <span className="text-[#ababab] font-bold">→</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="flex-1 bg-[#333333] text-[#f5f5f5] rounded-lg px-3 py-2 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                {/* Clear Filters Button */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 text-red-400 bg-[#333333] rounded-lg hover:bg-red-900/20 transition-all mt-2 lg:mt-0"
                                    >
                                        ✕ Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {dynamicMetrics.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-4 sm:p-6 rounded-2xl shadow-xl border-t-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                            style={{ borderTopColor: metric.color }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className="p-2 sm:p-3 rounded-xl bg-white/5 backdrop-blur-sm"
                                    style={{ color: metric.color }}
                                >
                                    {iconMap[metric.title]}
                                </div>
                                {metric.trend && (
                                    <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                        {metric.trend}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#ababab] mb-2 uppercase tracking-wide font-medium">
                                {metric.title}
                            </p>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1"
                                style={{ color: metric.color }}
                            >
                                {metric.value}
                            </p>
                            <p className="text-xs text-[#666666]">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <RevenueLineChart data={dailyRevenueTrend} />
                    <OrderTypePieChart data={revenueByOrderType} />
                </div>

                <div>
                    <TopDishesBarChart data={topSellingDishes} />
                </div>
            </div>
        </div>
    );
};

export default Metrics;