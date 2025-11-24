// // import React, { useState, useEffect, useMemo } from "react";
// // import BottomNav from "../components/shared/BottomNav";
// // import OrderCard from "../components/Orders/OrderCard";
// // import BackButton from "../components/shared/BackButton";
// // import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// // import { getOrders, verifyAdminPassword } from "../https/index";
// // import { enqueueSnackbar } from "notistack";
// // import socket from "../socket";
// // import { useNavigate } from 'react-router-dom';
// // import { ChevronDown, Eye } from 'lucide-react';

// // const Orders = () => {
// //     const navigate = useNavigate();
// //     const queryClient = useQueryClient();

// //     // Filter states
// //     const [status, setStatus] = useState("In Progress");
// //     const [dateFilter, setDateFilter] = useState("Today");
// //     const [selectedDate, setSelectedDate] = useState("");
// //     const [orderType, setOrderType] = useState("All");
// //     const [paymentMethod, setPaymentMethod] = useState("All");
// //     const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

// //     // Password modal states
// //     const [showPasswordModal, setShowPasswordModal] = useState(false);
// //     const [adminPassword, setAdminPassword] = useState("");
// //     const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

// //     // Get user role from localStorage
// //     const getUserRole = () => {
// //         try {
// //             const userStr = localStorage.getItem("user");
// //             if (!userStr) return null;
// //             const user = JSON.parse(userStr);
// //             return user?.role?.toLowerCase().trim() || null;
// //         } catch (error) {
// //             console.error("❌ Error getting user role:", error);
// //             return null;
// //         }
// //     };

// //     // Password verification mutation
// //     const verifyPasswordMutation = useMutation({
// //         mutationFn: (password) => verifyAdminPassword(password),
// //         onSuccess: () => {
// //             enqueueSnackbar("Password verified!", { variant: "success" });
// //             setShowPasswordModal(false);
// //             setAdminPassword("");
// //             setShowDetailedBreakdown(true);
// //         },
// //         onError: (error) => {
// //             console.error("Error verifying password:", error);
// //             const errorMessage = error?.response?.data?.message || "Invalid admin password.";
// //             enqueueSnackbar(errorMessage, { variant: "error" });
// //         },
// //     });

// //     // Fetch orders using useQuery
// //     const { data: resData, isError, isLoading } = useQuery({
// //         queryKey: ["orders", "all"],
// //         queryFn: async () => {
// //             const response = await getOrders();
// //             console.log("Orders API Response:", response);
// //             return response;
// //         },
// //         placeholderData: keepPreviousData,
// //         refetchOnWindowFocus: false,
// //         staleTime: 30000,
// //     });

// //     // Handle errors
// //     useEffect(() => {
// //         if (isError) {
// //             enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
// //         }
// //     }, [isError]);

// //     // Socket.IO listener for real-time updates
// //     useEffect(() => {
// //         const handleOrderUpdate = (data) => {
// //             console.log("Received real-time order update in Orders page:", data);

// //             const relevantActions = [
// //                 'new_order',
// //                 'items_ready',
// //                 'status_changed',
// //                 'order_modified',
// //                 'order_deleted'
// //             ];

// //             if (relevantActions.includes(data.action)) {
// //                 queryClient.invalidateQueries({ queryKey: ["orders", "all"] });

// //                 const actionMessages = {
// //                     'new_order': 'New order received',
// //                     'items_ready': 'Order items marked ready',
// //                     'status_changed': 'Order status updated',
// //                     'order_modified': 'Order modified',
// //                     'order_deleted': 'Order deleted'
// //                 };

// //                 enqueueSnackbar(
// //                     actionMessages[data.action] || 'Order updated',
// //                     {
// //                         variant: data.action === 'new_order' ? 'success' : 'info',
// //                         autoHideDuration: 3000
// //                     }
// //                 );
// //             }
// //         };

// //         socket.on('orderUpdate', handleOrderUpdate);

// //         return () => {
// //             socket.off('orderUpdate', handleOrderUpdate);
// //         };
// //     }, [queryClient]);

// //     // Close dropdown when clicking outside
// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (isPaymentDropdownOpen && !event.target.closest('.payment-dropdown')) {
// //                 setIsPaymentDropdownOpen(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => document.removeEventListener('mousedown', handleClickOutside);
// //     }, [isPaymentDropdownOpen]);

// //     const ordersArray = resData?.data?.data ?? [];

// //     // Memoized filtered and sorted orders
// //     const filteredOrders = useMemo(() => {
// //         return ordersArray.filter((order) => {
// //             // Status filter
// //             if (status !== "All" && order.orderStatus !== status) return false;

// //             // Date filter
// //             const orderDate = new Date(order.createdAt).toDateString();
// //             const today = new Date().toDateString();

// //             switch (dateFilter) {
// //                 case "Today":
// //                     if (orderDate !== today) return false;
// //                     break;
// //                 case "Yesterday": {
// //                     const yesterday = new Date();
// //                     yesterday.setDate(yesterday.getDate() - 1);
// //                     if (orderDate !== yesterday.toDateString()) return false;
// //                     break;
// //                 }
// //                 case "Custom":
// //                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
// //                         return false;
// //                     }
// //                     break;
// //                 default:
// //                     break;
// //             }

// //             // Order type filter
// //             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
// //                 return false;
// //             }

// //             // Payment method filter
// //             if (paymentMethod !== "All" && order.paymentMethod !== paymentMethod) {
// //                 return false;
// //             }

// //             return true;
// //         });
// //     }, [ordersArray, status, dateFilter, selectedDate, orderType, paymentMethod]);

// //     // Memoized sorted orders
// //     const sortedFilteredOrders = useMemo(() => {
// //         return [...filteredOrders].sort((a, b) =>
// //             new Date(b.createdAt) - new Date(a.createdAt)
// //         );
// //     }, [filteredOrders]);

// //     // Calculate payment method totals
// //     const paymentTotals = useMemo(() => {
// //         const totals = {
// //             Cash: 0,
// //             Online: 0,
// //             Benefit: 0
// //         };

// //         ordersArray.forEach((order) => {
// //             if (status !== "All" && order.orderStatus !== status) return;

// //             const orderDate = new Date(order.createdAt).toDateString();
// //             const today = new Date().toDateString();

// //             switch (dateFilter) {
// //                 case "Today":
// //                     if (orderDate !== today) return;
// //                     break;
// //                 case "Yesterday": {
// //                     const yesterday = new Date();
// //                     yesterday.setDate(yesterday.getDate() - 1);
// //                     if (orderDate !== yesterday.toDateString()) return;
// //                     break;
// //                 }
// //                 case "Custom":
// //                     if (selectedDate && orderDate !== new Date(selectedDate).toDateString()) {
// //                         return;
// //                     }
// //                     break;
// //                 default:
// //                     break;
// //             }

// //             if (orderType !== "All" && order.customerDetails?.orderType !== orderType) {
// //                 return;
// //             }

// //             const method = order.paymentMethod;
// //             const amount = order.bills?.totalWithTax || 0;

// //             if (method === "Cash") totals.Cash += amount;
// //             else if (method === "Online") totals.Online += amount;
// //             else if (method === "Benefit") totals.Benefit += amount;
// //         });

// //         return {
// //             Cash: totals.Cash.toFixed(3),
// //             Online: totals.Online.toFixed(3),
// //             Benefit: totals.Benefit.toFixed(3),
// //             Total: (totals.Cash + totals.Online + totals.Benefit).toFixed(3)
// //         };
// //     }, [ordersArray, status, dateFilter, selectedDate, orderType]);

// //     // Total for currently selected payment method
// //     const selectedPaymentTotal = useMemo(() => {
// //         if (paymentMethod === "All") {
// //             return paymentTotals.Total;
// //         }
// //         return paymentTotals[paymentMethod] || "0.000";
// //     }, [paymentMethod, paymentTotals]);

// //     // Payment method options
// //     const paymentOptions = [
// //         { value: "All", label: "All Payments", amount: paymentTotals.Total },
// //         { value: "Cash", label: "Cash", amount: paymentTotals.Cash },
// //         { value: "Online", label: "Online", amount: paymentTotals.Online },
// //         { value: "Benefit", label: "Benefit", amount: paymentTotals.Benefit }
// //     ];

// //     const handlePaymentSelect = (value) => {
// //         setPaymentMethod(value);
// //         setIsPaymentDropdownOpen(false);
// //     };

// //     // Handle view details click
// //     const handleViewDetails = () => {
// //         const userRole = getUserRole();

// //         if (userRole === "admin") {
// //             // Admin - show directly
// //             setShowDetailedBreakdown(true);
// //         } else {
// //             // Non-admin - show password modal
// //             setShowPasswordModal(true);
// //         }
// //     };

// //     // Confirm password
// //     const handleConfirmPassword = () => {
// //         if (!adminPassword) {
// //             enqueueSnackbar("Admin password required!", { variant: "error" });
// //             return;
// //         }
// //         verifyPasswordMutation.mutate(adminPassword);
// //     };

// //     // Loading state
// //     if (isLoading) {
// //         return (
// //             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
// //                 <div className="text-center">
// //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
// //                     <p className="text-[#f5f5f5] text-lg">Loading orders...</p>
// //                 </div>
// //             </section>
// //         );
// //     }

// //     return (
// //         <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
// //             {/* Main Header Bar */}
// //             <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#1a1a1a] shadow-lg">
// //                 <div className="flex items-center gap-3 sm:gap-4">
// //                     <BackButton />
// //                     <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
// //                         Orders History
// //                     </h1>
// //                 </div>

// //                 {/* Payment Total with Dropdown & View Details */}
// //                 <div className="flex items-center gap-2 sm:gap-3">
// //                     {/* Total Amount Label with Eye Button */}
// //                     <div className="flex items-center gap-2 bg-[#333333] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg">
// //                         <span className="text-[#f5f5f5] text-sm sm:text-base font-semibold">
// //                             Total Amount:
// //                         </span>
// //                         <button
// //                             onClick={handleViewDetails}
// //                             className="bg-[#444444] hover:bg-[#555555] text-[#02ca3a] p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0"
// //                             title="View detailed breakdown"
// //                         >
// //                             <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
// //                         </button>
// //                     </div>

// //                     {/* Show total amount ONLY after password verification OR if admin */}
// //                     {(getUserRole() === "admin" || showDetailedBreakdown) && (
// //                         <div className="bg-[#02ca3a] text-black font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg">
// //                             <div className="text-left">
// //                                 <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-90">
// //                                     Total Amount
// //                                 </p>
// //                                 <p className="text-base sm:text-lg lg:text-xl font-extrabold">
// //                                     {paymentTotals.Total}
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>

// //             {/* Filter Bar */}
// //             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#333333] gap-3">
// //                 {/* Status Filter */}
// //                 <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
// //                     <div className="flex items-center bg-[#333333] p-1 rounded-xl shadow-md min-w-max">
// //                         {["All", "In Progress", "Ready", "Completed"].map((s) => (
// //                             <button
// //                                 key={s}
// //                                 onClick={() => setStatus(s)}
// //                                 className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${status === s
// //                                         ? "bg-[#02ca3a] text-black shadow-lg"
// //                                         : "text-[#ababab] hover:bg-[#444444]"
// //                                     }`}
// //                                 aria-pressed={status === s}
// //                             >
// //                                 {s}
// //                             </button>
// //                         ))}
// //                     </div>
// //                 </div>

// //                 {/* Date and Order Type Filters */}
// //                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
// //                     {/* Date Filters */}
// //                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
// //                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
// //                             {["All", "Today", "Yesterday", "Custom"].map((d) => (
// //                                 <button
// //                                     key={d}
// //                                     onClick={() => {
// //                                         setDateFilter(d);
// //                                         if (d !== "Custom") setSelectedDate("");
// //                                     }}
// //                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${dateFilter === d
// //                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
// //                                             : "text-[#ababab] hover:bg-[#444444]"
// //                                         }`}
// //                                     aria-pressed={dateFilter === d}
// //                                 >
// //                                     {d === "All" ? "All Dates" : d}
// //                                 </button>
// //                             ))}
// //                             {dateFilter === "Custom" && (
// //                                 <input
// //                                     type="date"
// //                                     value={selectedDate}
// //                                     onChange={(e) => setSelectedDate(e.target.value)}
// //                                     className="bg-[#444444] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm border border-[#555555] focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
// //                                     aria-label="Select custom date"
// //                                 />
// //                             )}
// //                         </div>
// //                     </div>

// //                     {/* Order Type Filters */}
// //                     <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
// //                         <div className="flex items-center gap-2 sm:gap-3 p-2 bg-[#333333] rounded-xl min-w-max">
// //                             {["All", "Dine-in", "Delivery", "Take Away"].map((type) => (
// //                                 <button
// //                                     key={type}
// //                                     onClick={() => setOrderType(type)}
// //                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${orderType === type
// //                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
// //                                             : "text-[#ababab] hover:bg-[#444444]"
// //                                         }`}
// //                                     aria-pressed={orderType === type}
// //                                 >
// //                                     {type}
// //                                 </button>
// //                             ))}
// //                             <button
// //                                 className="bg-[#02ca3a] text-black font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md hover:bg-[#03e94a] transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
// //                                 onClick={() => navigate("/DeliveryMetrics")}
// //                                 aria-label="View delivery metrics"
// //                             >
// //                                 Delivery Metrics
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Orders Grid */}
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
// //                 {sortedFilteredOrders.length > 0 ? (
// //                     sortedFilteredOrders.map((order) => (
// //                         <OrderCard key={order._id} order={order} />
// //                     ))
// //                 ) : (
// //                     <div className="col-span-full flex flex-col justify-center items-center h-full min-h-[300px] sm:min-h-[400px]">
// //                         <svg
// //                             className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-4"
// //                             fill="none"
// //                             stroke="currentColor"
// //                             viewBox="0 0 24 24"
// //                         >
// //                             <path
// //                                 strokeLinecap="round"
// //                                 strokeLinejoin="round"
// //                                 strokeWidth="2"
// //                                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
// //                             />
// //                         </svg>
// //                         <p className="text-base sm:text-xl text-gray-500 font-medium text-center px-4">
// //                             No orders match the current filters
// //                         </p>
// //                         <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center px-4">
// //                             Try adjusting your filter settings
// //                         </p>
// //                     </div>
// //                 )}
// //             </div>

// //             {/* Password Modal */}
// //             {showPasswordModal && (
// //                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
// //                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
// //                         <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
// //                             View Total Details - Admin Password Required
// //                         </h3>
// //                         <p className="text-xs sm:text-sm text-gray-400 mb-4">
// //                             Enter admin password to view detailed payment breakdown.
// //                         </p>

// //                         <input
// //                             type="password"
// //                             className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             placeholder="Enter admin password"
// //                             value={adminPassword}
// //                             onChange={(e) => setAdminPassword(e.target.value)}
// //                             onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
// //                             disabled={verifyPasswordMutation.isLoading}
// //                         />

// //                         {verifyPasswordMutation.isLoading && (
// //                             <div className="flex items-center justify-center mb-4">
// //                                 <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
// //                                 <span className="ml-2 text-gray-400 text-sm">Verifying...</span>
// //                             </div>
// //                         )}

// //                         <div className="flex justify-end gap-2 sm:gap-3">
// //                             <button
// //                                 onClick={() => {
// //                                     setShowPasswordModal(false);
// //                                     setAdminPassword("");
// //                                 }}
// //                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
// //                                 disabled={verifyPasswordMutation.isLoading}
// //                             >
// //                                 Cancel
// //                             </button>
// //                             <button
// //                                 onClick={handleConfirmPassword}
// //                                 disabled={verifyPasswordMutation.isLoading}
// //                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
// //                             >
// //                                 {verifyPasswordMutation.isLoading ? 'Verifying...' : 'Confirm'}
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Detailed Breakdown Modal */}
// //             {showDetailedBreakdown && (
// //                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
// //                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
// //                         <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-50 text-center">
// //                             Payment Breakdown
// //                         </h3>

// //                         <div className="space-y-3 mb-6">
// //                             {/* Cash */}
// //                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
// //                                 <div className="flex items-center gap-3">
// //                                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
// //                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Cash Payments</span>
// //                                 </div>
// //                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
// //                                     {paymentTotals.Cash}
// //                                 </span>
// //                             </div>

// //                             {/* Online */}
// //                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
// //                                 <div className="flex items-center gap-3">
// //                                     <div className="w-3 h-3 rounded-full bg-blue-500"></div>
// //                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Online Payments</span>
// //                                 </div>
// //                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
// //                                     {paymentTotals.Online}
// //                                 </span>
// //                             </div>

// //                             {/* Benefit */}
// //                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
// //                                 <div className="flex items-center gap-3">
// //                                     <div className="w-3 h-3 rounded-full bg-purple-500"></div>
// //                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Benefit Payments</span>
// //                                 </div>
// //                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
// //                                     {paymentTotals.Benefit}
// //                                 </span>
// //                             </div>

// //                             {/* Total */}
// //                             <div className="flex items-center justify-between p-4 bg-[#02ca3a] rounded-lg mt-4">
// //                                 <span className="text-base sm:text-lg font-bold text-black">Total Amount</span>
// //                                 <span className="text-lg sm:text-xl font-extrabold text-black">
// //                                     {paymentTotals.Total}
// //                                 </span>
// //                             </div>
// //                         </div>

// //                         <button
// //                             onClick={() => setShowDetailedBreakdown(false)}
// //                             className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base font-semibold transition-colors"
// //                         >
// //                             Close
// //                         </button>
// //                     </div>
// //                 </div>
// //             )}

// //             <BottomNav />
// //         </section>
// //     );
// // };

// // export default Orders;


// import React, { useState, useEffect, useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import OrderCard from "../components/Orders/OrderCard";
// import BackButton from "../components/shared/BackButton";
// import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { getOrders, verifyAdminPassword, updateOrderStatus, updateTable } from "../https/index";
// import { enqueueSnackbar } from "notistack";
// import socket from "../socket";
// import { useNavigate } from 'react-router-dom';
// import { ChevronDown, Eye, CheckCircle } from 'lucide-react';

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

//     // Password modal states
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [adminPassword, setAdminPassword] = useState("");
//     const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

//     // ✅ NEW: Bulk complete states
//     const [showBulkCompleteModal, setShowBulkCompleteModal] = useState(false);
//     const [bulkCompletePassword, setBulkCompletePassword] = useState("");
//     const [isBulkCompleting, setIsBulkCompleting] = useState(false);
//     const [bulkCompleteProgress, setBulkCompleteProgress] = useState({ current: 0, total: 0 });

//     // Get user role from localStorage
//     const getUserRole = () => {
//         try {
//             const userStr = localStorage.getItem("user");
//             if (!userStr) return null;
//             const user = JSON.parse(userStr);
//             return user?.role?.toLowerCase().trim() || null;
//         } catch (error) {
//             console.error("❌ Error getting user role:", error);
//             return null;
//         }
//     };

//     // Password verification mutation
//     const verifyPasswordMutation = useMutation({
//         mutationFn: (password) => verifyAdminPassword(password),
//         onSuccess: () => {
//             enqueueSnackbar("Password verified!", { variant: "success" });
//             setShowPasswordModal(false);
//             setAdminPassword("");
//             setShowDetailedBreakdown(true);
//         },
//         onError: (error) => {
//             console.error("Error verifying password:", error);
//             const errorMessage = error?.response?.data?.message || "Invalid admin password.";
//             enqueueSnackbar(errorMessage, { variant: "error" });
//         },
//     });

//     // ✅ NEW: Bulk password verification mutation
//     const verifyBulkPasswordMutation = useMutation({
//         mutationFn: (password) => verifyAdminPassword(password),
//         onSuccess: () => {
//             enqueueSnackbar("Password verified! Starting bulk completion...", { variant: "success" });
//             handleBulkCompleteOrders();
//         },
//         onError: (error) => {
//             console.error("Error verifying password:", error);
//             const errorMessage = error?.response?.data?.message || "Invalid admin password.";
//             enqueueSnackbar(errorMessage, { variant: "error" });
//         },
//     });

//     // ✅ NEW: Table update mutation for bulk operations
//     const bulkUpdateTableMutation = useMutation({
//         mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
//         onError: (error) => {
//             console.error("Error updating table status:", error);
//         },
//     });

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

//     // ✅ NEW: Get orders that can be completed (not already Completed or Cancelled)
//     const completableOrders = useMemo(() => {
//         return sortedFilteredOrders.filter(
//             order => order.orderStatus !== "Completed" && order.orderStatus !== "Cancelled"
//         );
//     }, [sortedFilteredOrders]);

//     // Calculate payment method totals
//     const paymentTotals = useMemo(() => {
//         const totals = {
//             Cash: 0,
//             Online: 0,
//             Benefit: 0
//         };

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

//     // Handle view details click
//     const handleViewDetails = () => {
//         const userRole = getUserRole();

//         if (userRole === "admin") {
//             setShowDetailedBreakdown(true);
//         } else {
//             setShowPasswordModal(true);
//         }
//     };

//     // Confirm password
//     const handleConfirmPassword = () => {
//         if (!adminPassword) {
//             enqueueSnackbar("Admin password required!", { variant: "error" });
//             return;
//         }
//         verifyPasswordMutation.mutate(adminPassword);
//     };

//     // ✅ NEW: Handle bulk complete button click
//     const handleBulkCompleteClick = () => {
//         if (completableOrders.length === 0) {
//             enqueueSnackbar("No orders to complete with current filters!", { variant: "warning" });
//             return;
//         }

//         const userRole = getUserRole();

//         if (userRole === "admin") {
//             // Admin - show confirmation modal directly
//             setShowBulkCompleteModal(true);
//         } else {
//             // Non-admin - show password modal first
//             setShowBulkCompleteModal(true);
//         }
//     };

//     // ✅ NEW: Confirm bulk complete password
//     const handleConfirmBulkPassword = () => {
//         if (!bulkCompletePassword) {
//             enqueueSnackbar("Admin password required!", { variant: "error" });
//             return;
//         }
//         verifyBulkPasswordMutation.mutate(bulkCompletePassword);
//     };

//     // ✅ NEW: Execute bulk complete orders
//     const handleBulkCompleteOrders = async () => {
//         const userRole = getUserRole();

//         // If not admin and no password provided, ask for password
//         if (userRole !== "admin" && !bulkCompletePassword) {
//             enqueueSnackbar("Admin password required!", { variant: "error" });
//             return;
//         }

//         setIsBulkCompleting(true);
//         setBulkCompleteProgress({ current: 0, total: completableOrders.length });

//         let successCount = 0;
//         let failCount = 0;

//         for (let i = 0; i < completableOrders.length; i++) {
//             const order = completableOrders[i];

//             try {
//                 // Update order status to Completed
//                 await updateOrderStatus({ 
//                     orderId: order._id, 
//                     orderStatus: "Completed" 
//                 });

//                 // If order has a table, update table status to Available
//                 if (order.table) {
//                     await bulkUpdateTableMutation.mutateAsync({ 
//                         tableId: order.table._id, 
//                         status: "Available" 
//                     });
//                 }

//                 successCount++;
//                 setBulkCompleteProgress({ current: i + 1, total: completableOrders.length });
//             } catch (error) {
//                 console.error(`Failed to complete order ${order._id}:`, error);
//                 failCount++;
//             }
//         }

//         // Refresh the orders list
//         await queryClient.invalidateQueries(["orders"]);
//         await queryClient.invalidateQueries(["tables"]);
//         await queryClient.invalidateQueries(["products"]);

//         setIsBulkCompleting(false);
//         setShowBulkCompleteModal(false);
//         setBulkCompletePassword("");
//         setBulkCompleteProgress({ current: 0, total: 0 });

//         // Show result
//         if (failCount === 0) {
//             enqueueSnackbar(
//                 `Successfully completed ${successCount} order${successCount > 1 ? 's' : ''}!`, 
//                 { variant: "success" }
//             );
//         } else {
//             enqueueSnackbar(
//                 `Completed ${successCount} orders. ${failCount} failed.`, 
//                 { variant: "warning" }
//             );
//         }
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

//                 {/* Payment Total with Dropdown & View Details */}
//                 <div className="flex items-center gap-2 sm:gap-3">
//                     {/* Total Amount Label with Eye Button */}
//                     <div className="flex items-center gap-2 bg-[#333333] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg">
//                         <span className="text-[#f5f5f5] text-sm sm:text-base font-semibold">
//                             Total Amount:
//                         </span>
//                         <button
//                             onClick={handleViewDetails}
//                             className="bg-[#444444] hover:bg-[#555555] text-[#02ca3a] p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0"
//                             title="View detailed breakdown"
//                         >
//                             <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//                         </button>
//                     </div>

//                     {/* Show total amount ONLY after password verification OR if admin */}
//                     {(getUserRole() === "admin" || showDetailedBreakdown) && (
//                         <div className="bg-[#02ca3a] text-black font-bold px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg">
//                             <div className="text-left">
//                                 <p className="text-[10px] sm:text-xs uppercase tracking-wide opacity-90">
//                                     Total Amount
//                                 </p>
//                                 <p className="text-base sm:text-lg lg:text-xl font-extrabold">
//                                     {paymentTotals.Total}
//                                 </p>
//                             </div>
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
//                                 className={`text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap ${status === s
//                                         ? "bg-[#02ca3a] text-black shadow-lg"
//                                         : "text-[#ababab] hover:bg-[#444444]"
//                                     }`}
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
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${dateFilter === d
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                         }`}
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
//                                     className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 rounded-lg transition-colors whitespace-nowrap ${orderType === type
//                                             ? "bg-[#444444] text-[#f5f5f5] shadow-inner"
//                                             : "text-[#ababab] hover:bg-[#444444]"
//                                         }`}
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

//             {/* ✅ NEW: Bulk Complete Button - Only show if there are completable orders */}
//             {completableOrders.length > 0 && (
//                 <div className="px-4 sm:px-6 lg:px-8 py-3 bg-[#262626] border-b border-[#333333]">
//                     <button
//                         onClick={handleBulkCompleteClick}
//                         className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
//                         disabled={isBulkCompleting}
//                     >
//                         <CheckCircle className="w-5 h-5" />
//                         Complete All {completableOrders.length} Order{completableOrders.length > 1 ? 's' : ''}
//                     </button>
//                 </div>
//             )}

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

//             {/* Password Modal (existing) */}
//             {showPasswordModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
//                         <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
//                             View Total Details - Admin Password Required
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-400 mb-4">
//                             Enter admin password to view detailed payment breakdown.
//                         </p>

//                         <input
//                             type="password"
//                             className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter admin password"
//                             value={adminPassword}
//                             onChange={(e) => setAdminPassword(e.target.value)}
//                             onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
//                             disabled={verifyPasswordMutation.isLoading}
//                         />

//                         {verifyPasswordMutation.isLoading && (
//                             <div className="flex items-center justify-center mb-4">
//                                 <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
//                                 <span className="ml-2 text-gray-400 text-sm">Verifying...</span>
//                             </div>
//                         )}

//                         <div className="flex justify-end gap-2 sm:gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowPasswordModal(false);
//                                     setAdminPassword("");
//                                 }}
//                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
//                                 disabled={verifyPasswordMutation.isLoading}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleConfirmPassword}
//                                 disabled={verifyPasswordMutation.isLoading}
//                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
//                             >
//                                 {verifyPasswordMutation.isLoading ? 'Verifying...' : 'Confirm'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ✅ NEW: Bulk Complete Confirmation Modal */}
//             {showBulkCompleteModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
//                         <div className="text-center mb-4">
//                             <div className="text-4xl sm:text-5xl mb-3">⚠️</div>
//                             <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
//                                 Complete All Orders?
//                             </h3>
//                             <p className="text-sm sm:text-base text-gray-400 mb-2">
//                                 You are about to mark <span className="text-[#02ca3a] font-bold">{completableOrders.length}</span> order{completableOrders.length > 1 ? 's' : ''} as completed.
//                             </p>
//                             <p className="text-xs sm:text-sm text-gray-500">
//                                 This will deduct ingredients from inventory for all orders.
//                             </p>
//                         </div>

//                         {/* Show password input for non-admin users */}
//                         {getUserRole() !== "admin" && !isBulkCompleting && (
//                             <div className="mb-4">
//                                 <input
//                                     type="password"
//                                     className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Enter admin password"
//                                     value={bulkCompletePassword}
//                                     onChange={(e) => setBulkCompletePassword(e.target.value)}
//                                     onKeyPress={(e) => e.key === 'Enter' && handleConfirmBulkPassword()}
//                                     disabled={verifyBulkPasswordMutation.isLoading}
//                                 />
//                             </div>
//                         )}

//                         {/* Progress indicator during bulk operation */}
//                         {isBulkCompleting && (
//                             <div className="mb-4">
//                                 <div className="flex items-center justify-center mb-3">
//                                     <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
//                                     <span className="ml-3 text-gray-400 text-sm sm:text-base">
//                                         Processing orders...
//                                     </span>
//                                 </div>
//                                 <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
//                                     <div 
//                                         className="bg-blue-500 h-full transition-all duration-300 ease-out"
//                                         style={{ 
//                                             width: `${(bulkCompleteProgress.current / bulkCompleteProgress.total) * 100}%` 
//                                         }}
//                                     ></div>
//                                 </div>
//                                 <p className="text-center text-xs sm:text-sm text-gray-400 mt-2">
//                                     {bulkCompleteProgress.current} of {bulkCompleteProgress.total} orders completed
//                                 </p>
//                             </div>
//                         )}

//                         {/* Loading state for password verification */}
//                         {verifyBulkPasswordMutation.isLoading && (
//                             <div className="flex items-center justify-center mb-4">
//                                 <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
//                                 <span className="ml-2 text-gray-400 text-sm">Verifying password...</span>
//                             </div>
//                         )}

//                         <div className="flex justify-end gap-2 sm:gap-3 mt-6">
//                             <button
//                                 onClick={() => {
//                                     setShowBulkCompleteModal(false);
//                                     setBulkCompletePassword("");
//                                 }}
//                                 disabled={isBulkCompleting || verifyBulkPasswordMutation.isLoading}
//                                 className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     const userRole = getUserRole();
//                                     if (userRole === "admin") {
//                                         handleBulkCompleteOrders();
//                                     } else {
//                                         handleConfirmBulkPassword();
//                                     }
//                                 }}
//                                 disabled={isBulkCompleting || verifyBulkPasswordMutation.isLoading}
//                                 className="px-4 sm:px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
//                             >
//                                 {isBulkCompleting ? 'Processing...' : 'Confirm'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Detailed Breakdown Modal (existing) */}
//             {showDetailedBreakdown && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
//                         <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-50 text-center">
//                             Payment Breakdown
//                         </h3>

//                         <div className="space-y-3 mb-6">
//                             {/* Cash */}
//                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Cash Payments</span>
//                                 </div>
//                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
//                                     {paymentTotals.Cash}
//                                 </span>
//                             </div>

//                             {/* Online */}
//                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Online Payments</span>
//                                 </div>
//                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
//                                     {paymentTotals.Online}
//                                 </span>
//                             </div>

//                             {/* Benefit */}
//                             <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-3 h-3 rounded-full bg-purple-500"></div>
//                                     <span className="text-sm sm:text-base font-medium text-[#f5f5f5]">Benefit Payments</span>
//                                 </div>
//                                 <span className="text-base sm:text-lg font-bold text-[#02ca3a]">
//                                     {paymentTotals.Benefit}
//                                 </span>
//                             </div>

//                             {/* Total */}
//                             <div className="flex items-center justify-between p-4 bg-[#02ca3a] rounded-lg mt-4">
//                                 <span className="text-base sm:text-lg font-bold text-black">Total Amount</span>
//                                 <span className="text-lg sm:text-xl font-extrabold text-black">
//                                     {paymentTotals.Total}
//                                 </span>
//                             </div>
//                         </div>

//                         <button
//                             onClick={() => setShowDetailedBreakdown(false)}
//                             className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base font-semibold transition-colors"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

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
import { getOrders, verifyAdminPassword, updateOrderStatus, updateTable } from "../https/index";
import { enqueueSnackbar } from "notistack";
import socket from "../socket";
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, CheckCircle, WifiOff, Wifi } from 'lucide-react';
import { getCachedOrders, fetchAndCacheRecentOrders, startAutoRefresh, stopAutoRefresh } from "../utils/getOrdersOffline";
import { getOfflineOrders } from "../utils/offlineOrders";
import { Printer } from 'lucide-react';
import { printSalesReport } from "../https/printBridge";

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

    // Bulk complete states
    const [showBulkCompleteModal, setShowBulkCompleteModal] = useState(false);
    const [bulkCompletePassword, setBulkCompletePassword] = useState("");
    const [isBulkCompleting, setIsBulkCompleting] = useState(false);
    const [bulkCompleteProgress, setBulkCompleteProgress] = useState({ current: 0, total: 0 });

    // ✅ NEW: Offline states
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineOrders, setOfflineOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [isLoadingOffline, setIsLoadingOffline] = useState(false);

    // for printing sales report
    const [isPrintingReport, setIsPrintingReport] = useState(false);

// Add this function in your Orders component
const handlePrintSalesReport = async () => {
  if (!isOnline) {
    enqueueSnackbar("You must be online to print sales report!", { variant: "error" });
    return;
  }

  setIsPrintingReport(true);

  try {
    // Calculate today's sales data
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const todayOrders = ordersArray.filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      return orderDate === today && order.orderStatus === "Completed";
    });

    const yesterdayOrders = ordersArray.filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      return orderDate === yesterdayStr && order.orderStatus === "Completed";
    });

    // Calculate order type breakdown with counts
    const orderTypes = {
      dinein: 0, dineinCount: 0,
      takeaway: 0, takeawayCount: 0,
      delivery: 0, deliveryCount: 0,
      total: 0
    };

    // Calculate payment method breakdown with counts
    const paymentMethods = {
      cash: 0, cashCount: 0,
      online: 0, onlineCount: 0,
      benefit: 0, benefitCount: 0,
      total: 0
    };

    // Tax and discount tracking
    let totalTax = 0;
    let totalDiscount = 0;

    // Top items tracking
    const itemsMap = new Map();

    // Hourly breakdown
    const hourlyBreakdown = {};

    todayOrders.forEach(order => {
      const amount = order.bills?.totalWithTax || 0;
      const tax = order.bills?.tax || 0;
      const discount = order.bills?.discountAmount || 0;
      
      totalTax += tax;
      totalDiscount += discount;

      // Order type breakdown
      const orderType = order.customerDetails?.orderType?.toLowerCase() || 'dine-in';
      if (orderType === 'dine-in') {
        orderTypes.dinein += amount;
        orderTypes.dineinCount++;
      } else if (orderType === 'take away') {
        orderTypes.takeaway += amount;
        orderTypes.takeawayCount++;
      } else if (orderType === 'delivery') {
        orderTypes.delivery += amount;
        orderTypes.deliveryCount++;
      }
      
      // Payment method breakdown
      const paymentMethod = order.paymentMethod?.toLowerCase() || 'cash';
      if (paymentMethod === 'cash') {
        paymentMethods.cash += amount;
        paymentMethods.cashCount++;
      } else if (paymentMethod === 'online') {
        paymentMethods.online += amount;
        paymentMethods.onlineCount++;
      } else if (paymentMethod === 'benefit') {
        paymentMethods.benefit += amount;
        paymentMethods.benefitCount++;
      }

      // Track top items
      (order.items || []).forEach(item => {
        const key = item.name;
        if (itemsMap.has(key)) {
          const existing = itemsMap.get(key);
          existing.quantity += item.quantity;
          existing.revenue += (item.price || 0) * item.quantity;
        } else {
          itemsMap.set(key, {
            name: item.name,
            quantity: item.quantity,
            revenue: (item.price || 0) * item.quantity
          });
        }
      });

      // Hourly breakdown
      const hour = new Date(order.createdAt).getHours();
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      if (!hourlyBreakdown[hourStr]) {
        hourlyBreakdown[hourStr] = { sales: 0, count: 0 };
      }
      hourlyBreakdown[hourStr].sales += amount;
      hourlyBreakdown[hourStr].count++;
    });

    // Calculate totals
    orderTypes.total = orderTypes.dinein + orderTypes.takeaway + orderTypes.delivery;
    paymentMethods.total = paymentMethods.cash + paymentMethods.online + paymentMethods.benefit;
    const totalSales = orderTypes.total;
    const totalOrders = todayOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get top 5 items
    const topItems = Array.from(itemsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => ({
        ...item,
        revenue: item.revenue.toFixed(3)
      }));

    // Format hourly breakdown
    const formattedHourly = {};
    Object.keys(hourlyBreakdown).sort().forEach(hour => {
      formattedHourly[hour] = {
        sales: hourlyBreakdown[hour].sales.toFixed(3),
        count: hourlyBreakdown[hour].count
      };
    });

    // Calculate yesterday's total for comparison
    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);

    const difference = yesterdayTotal > 0 
      ? (((totalSales - yesterdayTotal) / yesterdayTotal) * 100).toFixed(2)
      : '0.00';

    // Get time range
    const firstOrder = todayOrders.length > 0 
      ? new Date(Math.min(...todayOrders.map(o => new Date(o.createdAt))))
      : new Date();
    const lastOrder = todayOrders.length > 0
      ? new Date(Math.max(...todayOrders.map(o => new Date(o.createdAt))))
      : new Date();

    const timeRange = `${firstOrder.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - ${lastOrder.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

    // Format the data
    const reportData = {
      date: new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timeRange,
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(3),
      orderTypes: {
        dinein: orderTypes.dinein.toFixed(3),
        dineinCount: orderTypes.dineinCount,
        takeaway: orderTypes.takeaway.toFixed(3),
        takeawayCount: orderTypes.takeawayCount,
        delivery: orderTypes.delivery.toFixed(3),
        deliveryCount: orderTypes.deliveryCount,
        total: orderTypes.total.toFixed(3)
      },
      paymentMethods: {
        cash: paymentMethods.cash.toFixed(3),
        cashCount: paymentMethods.cashCount,
        online: paymentMethods.online.toFixed(3),
        onlineCount: paymentMethods.onlineCount,
        benefit: paymentMethods.benefit.toFixed(3),
        benefitCount: paymentMethods.benefitCount,
        total: paymentMethods.total.toFixed(3)
      },
      taxSummary: {
        total: totalTax.toFixed(3)
      },
      discountSummary: {
        total: totalDiscount.toFixed(3)
      },
      topItems,
      hourlyBreakdown: formattedHourly,
      comparisonData: {
        yesterday: yesterdayTotal.toFixed(3),
        today: totalSales.toFixed(3),
        difference
      },
      totalSales: totalSales.toFixed(3)
    };

    // Print the report
    await printSalesReport(reportData);
    
    enqueueSnackbar("Sales report printed successfully!", { variant: "success" });
  } catch (error) {
    console.error("Error printing sales report:", error);
    enqueueSnackbar("Failed to print sales report!", { variant: "error" });
  } finally {
    setIsPrintingReport(false);
  }
};

    // ✅ Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            enqueueSnackbar("Connection restored! Syncing data...", { variant: "success" });
            queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
            fetchAndCacheRecentOrders();
        };

        const handleOffline = () => {
            setIsOnline(false);
            enqueueSnackbar("You are offline. Showing cached orders.", { variant: "warning" });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Start auto-refresh for background order caching
        startAutoRefresh();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            stopAutoRefresh();
        };
    }, [queryClient]);

    // ✅ Load offline/cached orders when offline
    useEffect(() => {
        async function loadOfflineData() {
            if (!isOnline) {
                setIsLoadingOffline(true);
                try {
                    // Load cached recent orders (last 6 hours)
                    const cached = await getCachedOrders();
                    setOfflineOrders(cached);

                    // Load pending orders that were created offline
                    const pending = await getOfflineOrders();
                    setPendingOrders(pending);

                    console.log(`📦 Loaded ${cached.length} cached orders and ${pending.length} pending orders`);
                } catch (error) {
                    console.error("Error loading offline orders:", error);
                    enqueueSnackbar("Failed to load offline orders", { variant: "error" });
                } finally {
                    setIsLoadingOffline(false);
                }
            }
        }

        loadOfflineData();
    }, [isOnline]);

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

    // Bulk password verification mutation
    const verifyBulkPasswordMutation = useMutation({
        mutationFn: (password) => verifyAdminPassword(password),
        onSuccess: () => {
            enqueueSnackbar("Password verified! Starting bulk completion...", { variant: "success" });
            handleBulkCompleteOrders();
        },
        onError: (error) => {
            console.error("Error verifying password:", error);
            const errorMessage = error?.response?.data?.message || "Invalid admin password.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        },
    });

    // Table update mutation for bulk operations
    const bulkUpdateTableMutation = useMutation({
        mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
        onError: (error) => {
            console.error("Error updating table status:", error);
        },
    });

    // Fetch orders using useQuery
    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders", "all"],
        queryFn: async () => {
            const response = await getOrders();
            console.log("Orders API Response:", response);

            // ✅ Cache orders in background when online
            if (navigator.onLine) {
                fetchAndCacheRecentOrders().catch(err =>
                    console.warn("Failed to cache orders in background:", err)
                );
            }

            return response;
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: 30000,
        enabled: isOnline, // ✅ Only fetch when online
    });

    // Handle errors
    useEffect(() => {
        if (isError && isOnline) {
            enqueueSnackbar("Failed to fetch orders. Please try again.", { variant: "error" });
        }
    }, [isError, isOnline]);

    // Socket.IO listener for real-time updates
    useEffect(() => {
        if (!isOnline) return; // Don't listen to socket when offline

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
    }, [queryClient, isOnline]);

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

    // ✅ Merge online and offline orders
    const ordersArray = useMemo(() => {
        if (isOnline) {
            return resData?.data?.data ?? [];
        } else {
            // When offline, combine cached orders and pending offline orders
            const combined = [...offlineOrders];

            // Add pending orders with a special flag
            const pendingWithFlag = pendingOrders.map(order => ({
                ...order,
                _isPending: true, // Flag to identify pending offline orders
                _id: order._id || `pending-${Date.now()}-${Math.random()}`,
            }));

            return [...combined, ...pendingWithFlag];
        }
    }, [isOnline, resData, offlineOrders, pendingOrders]);

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

    // Get orders that can be completed
    const completableOrders = useMemo(() => {
        return sortedFilteredOrders.filter(
            order => order.orderStatus !== "Completed" &&
                order.orderStatus !== "Cancelled" &&
                !order._isPending // Don't include pending offline orders
        );
    }, [sortedFilteredOrders]);

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

    const handlePaymentSelect = (value) => {
        setPaymentMethod(value);
        setIsPaymentDropdownOpen(false);
    };

    // Handle view details click
    const handleViewDetails = () => {
        const userRole = getUserRole();

        if (userRole === "admin") {
            setShowDetailedBreakdown(true);
        } else {
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

    // Handle bulk complete button click
    const handleBulkCompleteClick = () => {
        if (!isOnline) {
            enqueueSnackbar("You must be online to complete orders!", { variant: "error" });
            return;
        }

        if (completableOrders.length === 0) {
            enqueueSnackbar("No orders to complete with current filters!", { variant: "warning" });
            return;
        }

        const userRole = getUserRole();

        if (userRole === "admin") {
            setShowBulkCompleteModal(true);
        } else {
            setShowBulkCompleteModal(true);
        }
    };

    // Confirm bulk complete password
    const handleConfirmBulkPassword = () => {
        if (!bulkCompletePassword) {
            enqueueSnackbar("Admin password required!", { variant: "error" });
            return;
        }
        verifyBulkPasswordMutation.mutate(bulkCompletePassword);
    };

    // Execute bulk complete orders
    const handleBulkCompleteOrders = async () => {
        const userRole = getUserRole();

        if (userRole !== "admin" && !bulkCompletePassword) {
            enqueueSnackbar("Admin password required!", { variant: "error" });
            return;
        }

        setIsBulkCompleting(true);
        setBulkCompleteProgress({ current: 0, total: completableOrders.length });

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < completableOrders.length; i++) {
            const order = completableOrders[i];

            try {
                await updateOrderStatus({
                    orderId: order._id,
                    orderStatus: "Completed"
                });

                if (order.table) {
                    await bulkUpdateTableMutation.mutateAsync({
                        tableId: order.table._id,
                        status: "Available"
                    });
                }

                successCount++;
                setBulkCompleteProgress({ current: i + 1, total: completableOrders.length });
            } catch (error) {
                console.error(`Failed to complete order ${order._id}:`, error);
                failCount++;
            }
        }

        await queryClient.invalidateQueries(["orders"]);
        await queryClient.invalidateQueries(["tables"]);
        await queryClient.invalidateQueries(["products"]);

        setIsBulkCompleting(false);
        setShowBulkCompleteModal(false);
        setBulkCompletePassword("");
        setBulkCompleteProgress({ current: 0, total: 0 });

        if (failCount === 0) {
            enqueueSnackbar(
                `Successfully completed ${successCount} order${successCount > 1 ? 's' : ''}!`,
                { variant: "success" }
            );
        } else {
            enqueueSnackbar(
                `Completed ${successCount} orders. ${failCount} failed.`,
                { variant: "warning" }
            );
        }
    };

    // Loading state
    if ((isLoading && isOnline) || isLoadingOffline) {
        return (
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
                    <p className="text-[#f5f5f5] text-lg">
                        {isOnline ? 'Loading orders...' : 'Loading cached orders...'}
                    </p>
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
                    {/* ✅ Online/Offline indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isOnline
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                        }`}>
                        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>

                {/* Payment Total with Dropdown & View Details */}
                <div className="flex items-center gap-2 sm:gap-3">
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

            {/* ✅ Offline banner */}
            {!isOnline && (
                <div className="bg-orange-500/20 border-l-4 border-orange-500 px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-3">
                        <WifiOff className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-orange-400">
                                You are currently offline
                            </p>
                            <p className="text-xs text-orange-300">
                                Showing {offlineOrders.length} cached orders and {pendingOrders.length} pending orders.
                                Some features may be limited.
                            </p>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Bulk Complete Button */}
            {completableOrders.length > 0 && isOnline && (
                <div className="px-4 sm:px-6 lg:px-8 py-3 bg-[#262626] border-b border-[#333333]">
                    <button
                        onClick={handleBulkCompleteClick}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        disabled={isBulkCompleting}
                    >
                        <CheckCircle className="w-5 h-5" />
                        Complete All {completableOrders.length} Order{completableOrders.length > 1 ? 's' : ''}
                    </button>
                </div>
            )}

            {/* Orders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 md:pb-28 overflow-y-auto scrollbar-hide">
                {sortedFilteredOrders.length > 0 ? (
                    sortedFilteredOrders.map((order) => (
                        <div key={order._id} className="relative">
                            <OrderCard order={order} />
                            {/* ✅ Show pending badge for offline orders */}
                            {order._isPending && (
                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Pending Sync
                                </div>
                            )}
                        </div>
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

            {/* Bulk Complete Confirmation Modal */}
            {showBulkCompleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[450px] border border-gray-700">
                        <div className="text-center mb-4">
                            <div className="text-4xl sm:text-5xl mb-3">⚠️</div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
                                Complete All Orders?
                            </h3>
                            <p className="text-sm sm:text-base text-gray-400 mb-2">
                                You are about to mark <span className="text-[#02ca3a] font-bold">{completableOrders.length}</span> order{completableOrders.length > 1 ? 's' : ''} as completed.
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                                This will deduct ingredients from inventory for all orders.
                            </p>
                        </div>

                        {getUserRole() !== "admin" && !isBulkCompleting && (
                            <div className="mb-4">
                                <input
                                    type="password"
                                    className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter admin password"
                                    value={bulkCompletePassword}
                                    onChange={(e) => setBulkCompletePassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleConfirmBulkPassword()}
                                    disabled={verifyBulkPasswordMutation.isLoading}
                                />
                            </div>
                        )}

                        {isBulkCompleting && (
                            <div className="mb-4">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-400 text-sm sm:text-base">
                                        Processing orders...
                                    </span>
                                </div>
                                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full transition-all duration-300 ease-out"
                                        style={{
                                            width: `${(bulkCompleteProgress.current / bulkCompleteProgress.total) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="text-center text-xs sm:text-sm text-gray-400 mt-2">
                                    {bulkCompleteProgress.current} of {bulkCompleteProgress.total} orders completed
                                </p>
                            </div>
                        )}

                        {verifyBulkPasswordMutation.isLoading && (
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="ml-2 text-gray-400 text-sm">Verifying password...</span>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 sm:gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowBulkCompleteModal(false);
                                    setBulkCompletePassword("");
                                }}
                                disabled={isBulkCompleting || verifyBulkPasswordMutation.isLoading}
                                className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const userRole = getUserRole();
                                    if (userRole === "admin") {
                                        handleBulkCompleteOrders();
                                    } else {
                                        handleConfirmBulkPassword();
                                    }
                                }}
                                disabled={isBulkCompleting || verifyBulkPasswordMutation.isLoading}
                                className="px-4 sm:px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
                            >
                                {isBulkCompleting ? 'Processing...' : 'Confirm'}
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
                              <button
                            onClick={handlePrintSalesReport}
                            disabled={isPrintingReport || !isOnline}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl  shadow-lg transition-all duration-200 flex justify-evenly gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Print Today's Sales Report"
                        >
                            <Printer className="w-5 h-5" />
                            {isPrintingReport ? 'Printing...' : 'Sales Report'}
                        </button>
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