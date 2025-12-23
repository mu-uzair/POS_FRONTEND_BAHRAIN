// import React, { useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import Greetings from "../components/Home/Greetings";
// import Minicard from "../components/Home/Minicard";
// import { BsCashCoin } from "react-icons/bs";
// import { GrInProgress } from "react-icons/gr";
// import RecentOrder from "../components/Home/RecentOrder";
// import PopularDishes from "../components/Home/PopularDishes";
// import { getOrders, verifyAdminPassword } from "../https/index";
// import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// const Home = () => {
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [showTotalEarnings, setShowTotalEarnings] = useState(true);
    
//     // Password modal states
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [adminPassword, setAdminPassword] = useState("");
//     const [showEarningsAmount, setShowEarningsAmount] = useState(false);

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
//             setShowEarningsAmount(true);
//         },
//         onError: (error) => {
//             console.error("Error verifying password:", error);
//             const errorMessage = error?.response?.data?.message || "Invalid admin password.";
//             enqueueSnackbar(errorMessage, { variant: "error" });
//         },
//     });

//     // Fetch orders using useQuery
//     const { data: resData, isError, isLoading } = useQuery({
//         queryKey: ["orders"],
//         queryFn: async () => {
//             const response = await getOrders();
//             console.log("Orders API Response:", response);
//             return response;
//         },
//         placeholderData: keepPreviousData,
//     });

//     // Handle errors
//     if (isError) {
//         enqueueSnackbar("Failed to fetch orders!", { variant: "error" });
//     }

//     // Filter orders based on the selected date range
//     const filteredOrders = resData?.data?.data?.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         if (!showTotalEarnings && startDate && endDate) {
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             start.setHours(0, 0, 0, 0);
//             end.setHours(23, 59, 59, 999);
//             return orderDate >= start && orderDate <= end;
//         }
//         return true;
//     });

//     // Calculate the number of orders in progress
//     const ordersInProgress = filteredOrders?.filter(
//         (order) => order.orderStatus === "In Progress"
//     ).length || 0;

//     // Calculate the total revenue from completed orders within the date range
//     const totalRevenue = filteredOrders
//         ?.filter((order) => order.orderStatus === "Completed")
//         .reduce((total, order) => total + order.bills.totalWithTax, 0) || 0;

//     // Handle view earnings click
//     const handleViewEarnings = () => {
//         const userRole = getUserRole();

//         if (userRole === "admin") {
//             // Admin - show earnings directly
//             setShowEarningsAmount(true);
//         } else {
//             // Non-admin - show password modal
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

//     return (
//         <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
//             {/* Responsive Container */}
//             <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 max-w-auto mx-auto">
                
//                 {/* LEFT DIV - Full width on mobile/tablet, 60% on desktop */}
//                 <div className="w-full lg:flex-[3] lg:max-w-[60%]">
//                     <Greetings />

//                     {/* Minicards Grid - Stack on mobile, side by side on tablet+ */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
//                         {/* Total Earnings Minicard */}
//                         <Minicard
//                             title="Total Earnings"
//                             icon={<BsCashCoin className="text-xl sm:text-2xl" />}
//                             number={totalRevenue.toFixed(3)}
//                             footernum={1.6}
//                             showDatePicker
//                             showTotalEarnings={showTotalEarnings}
//                             onToggleEarningsView={() => setShowTotalEarnings(!showTotalEarnings)}
//                             onDateRangeChange={(start, end) => {
//                                 setStartDate(start);
//                                 setEndDate(end);
//                             }}
//                             // New props for password protection
//                             showEarningsAmount={showEarningsAmount}
//                             onViewEarnings={handleViewEarnings}
//                             isAdmin={getUserRole() === "admin"}
//                         />

//                         {/* Orders in Progress Minicard */}
//                         <Minicard
//                             title="In Progress"
//                             icon={<GrInProgress className="text-xl sm:text-2xl" />}
//                             number={ordersInProgress}
//                             footernum={3.6}
//                         />
//                     </div>

//                     {/* Recent Orders */}
//                     <RecentOrder />
//                 </div>

//                 {/* RIGHT DIV - Full width on mobile/tablet, 40% on desktop */}
//                 <div className="w-full lg:flex-[2] lg:max-w-[40%]">
//                     <PopularDishes />
//                 </div>
//             </div>

//             {/* Password Modal */}
//             {showPasswordModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
//                         <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
//                             View Total Earnings - Admin Password Required
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-400 mb-4">
//                             Enter admin password to view total earnings.
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

//             {/* Bottom Navigation */}
//             <BottomNav />
//         </section>
//     );
// };

// export default Home;


// import React, { useState, useMemo } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import Greetings from "../components/Home/Greetings";
// import Minicard from "../components/Home/Minicard";
// import { BsCashCoin } from "react-icons/bs";
// import { GrInProgress } from "react-icons/gr";
// import RecentOrder from "../components/Home/RecentOrder";
// import PopularDishes from "../components/Home/PopularDishes";
// import { verifyAdminPassword } from "../https/index";
// import { useMutation } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// // Import optimized hooks
// import { useDashboardAnalytics } from "../hooks/orderData API optimization hooks/useAnalytics";
// import { useOrderStats } from "../hooks/orderData API optimization hooks/useOrderFilters";

// const Home = () => {
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [showTotalEarnings, setShowTotalEarnings] = useState(true);
    
//     // Password modal states
//     const [showPasswordModal, setShowPasswordModal] = useState(false);
//     const [adminPassword, setAdminPassword] = useState("");
//     const [showEarningsAmount, setShowEarningsAmount] = useState(false);

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
//             setShowEarningsAmount(true);
//         },
//         onError: (error) => {
//             console.error("Error verifying password:", error);
//             const errorMessage = error?.response?.data?.message || "Invalid admin password.";
//             enqueueSnackbar(errorMessage, { variant: "error" });
//         },
//     });

//     // Calculate date range for custom date filter
//     const dateRange = useMemo(() => {
//         if (showTotalEarnings || !startDate || !endDate) {
//             return 30; // Default to 30 days for "Total Earnings"
//         }
        
//         // Calculate days between start and end date
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         const diffTime = Math.abs(end - start);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays || 30;
//     }, [showTotalEarnings, startDate, endDate]);

//     // Prepare filters for custom date range
//     const customFilters = useMemo(() => {
//         if (!showTotalEarnings && startDate && endDate) {
//             return {
//                 startDate,
//                 endDate,
//             };
//         }
//         return { dateRange: 30 }; // Default 30 days
//     }, [showTotalEarnings, startDate, endDate]);

//     // Fetch order stats for ALL in-progress orders
//     const { 
//         stats: orderStats, 
//         isLoading: isLoadingStats,
//         isError: isErrorStats 
//     } = useOrderStats({ dateFilter: "All" }, true);

//     // Fetch dashboard analytics (for revenue with custom date range)
//     const { 
//         analytics, 
//         isLoading: isLoadingAnalytics,
//         isError: isErrorAnalytics 
//     } = useDashboardAnalytics(customFilters);

//     // Handle errors
//     if (isErrorStats || isErrorAnalytics) {
//         enqueueSnackbar("Failed to fetch analytics!", { variant: "error" });
//     }

//     // Extract data
//     const ordersInProgress = orderStats?.byStatus?.["In Progress"] || 0;
//     const totalRevenue = showTotalEarnings 
//         ? (analytics?.summary?.totalRevenue || "0.000")
//         : (analytics?.summary?.totalRevenue || "0.000");

//     // Handle view earnings click
//     const handleViewEarnings = () => {
//         const userRole = getUserRole();

//         if (userRole === "admin") {
//             // Admin - show earnings directly
//             setShowEarningsAmount(true);
//         } else {
//             // Non-admin - show password modal
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

//     // Loading state
//     const isLoading = isLoadingStats || isLoadingAnalytics;

//     return (
//         <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
//             {/* Responsive Container */}
//             <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 max-w-auto mx-auto">
                
//                 {/* LEFT DIV - Full width on mobile/tablet, 60% on desktop */}
//                 <div className="w-full lg:flex-[3] lg:max-w-[60%]">
//                     <Greetings />

//                     {/* Loading State */}
//                     {isLoading ? (
//                         <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
//                                 {[1, 2].map((i) => (
//                                     <div 
//                                         key={i}
//                                         className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl animate-pulse"
//                                     >
//                                         <div className="h-8 bg-gray-700 rounded mb-4"></div>
//                                         <div className="h-12 bg-gray-700 rounded"></div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ) : (
//                         /* Minicards Grid - Stack on mobile, side by side on tablet+ */
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
//                             {/* Total Earnings Minicard */}
//                             <Minicard
//                                 title="Total Earnings"
//                                 icon={<BsCashCoin className="text-xl sm:text-2xl" />}
//                                 number={typeof totalRevenue === 'string' ? totalRevenue : totalRevenue.toFixed(3)}
//                                 footernum={1.6}
//                                 showDatePicker
//                                 showTotalEarnings={showTotalEarnings}
//                                 onToggleEarningsView={() => setShowTotalEarnings(!showTotalEarnings)}
//                                 onDateRangeChange={(start, end) => {
//                                     setStartDate(start);
//                                     setEndDate(end);
//                                 }}
//                                 // New props for password protection
//                                 showEarningsAmount={showEarningsAmount}
//                                 onViewEarnings={handleViewEarnings}
//                                 isAdmin={getUserRole() === "admin"}
//                             />

//                             {/* Orders in Progress Minicard */}
//                             <Minicard
//                                 title="In Progress"
//                                 icon={<GrInProgress className="text-xl sm:text-2xl" />}
//                                 number={ordersInProgress}
//                                 footernum={3.6}
//                             />
//                         </div>
//                     )}

//                     {/* Recent Orders */}
//                     <RecentOrder />
//                 </div>

//                 {/* RIGHT DIV - Full width on mobile/tablet, 40% on desktop */}
//                 <div className="w-full lg:flex-[2] lg:max-w-[40%]">
//                     <PopularDishes />
//                 </div>
//             </div>

//             {/* Password Modal */}
//             {showPasswordModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
//                     <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
//                         <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
//                             View Total Earnings - Admin Password Required
//                         </h3>
//                         <p className="text-xs sm:text-sm text-gray-400 mb-4">
//                             Enter admin password to view total earnings.
//                         </p>

//                         <input
//                             type="password"
//                             className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter admin password"
//                             value={adminPassword}
//                             onChange={(e) => setAdminPassword(e.target.value)}
//                             onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
//                             disabled={verifyPasswordMutation.isPending}
//                         />

//                         {verifyPasswordMutation.isPending && (
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
//                                 disabled={verifyPasswordMutation.isPending}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleConfirmPassword}
//                                 disabled={verifyPasswordMutation.isPending}
//                                 className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
//                             >
//                                 {verifyPasswordMutation.isPending ? 'Verifying...' : 'Confirm'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Bottom Navigation */}
//             <BottomNav />
//         </section>
//     );
// };

// export default Home;


import React, { useState, useMemo, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/Home/Greetings";
import Minicard from "../components/Home/Minicard";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrder from "../components/Home/RecentOrder";
import PopularDishes from "../components/Home/PopularDishes";
import { verifyAdminPassword } from "../https/index";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

// Import optimized hooks
import { useDashboardAnalytics } from "../hooks/orderData API optimization hooks/useAnalytics";
import { useOrderStats } from "../hooks/orderData API optimization hooks/useOrderFilters";

// ✅ Import offline mode context and cache functions
import { useOfflineMode } from "../constants/OfflineModeContext";
import { getCachedOrders } from "../utils/getOrdersOffline";

const Home = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showTotalEarnings, setShowTotalEarnings] = useState(true);
    
    // Password modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [showEarningsAmount, setShowEarningsAmount] = useState(false);

    // ✅ Get offline mode state
    const { isOfflineMode } = useOfflineMode();

    // ✅ State for offline orders count
    const [offlineInProgressCount, setOfflineInProgressCount] = useState(0);

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
            setShowEarningsAmount(true);
        },
        onError: (error) => {
            console.error("Error verifying password:", error);
            const errorMessage = error?.response?.data?.message || "Invalid admin password.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        },
    });

    // Calculate date range for custom date filter
    const dateRange = useMemo(() => {
        if (showTotalEarnings || !startDate || !endDate) {
            return 30;
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 30;
    }, [showTotalEarnings, startDate, endDate]);

    // Prepare filters for custom date range
    const customFilters = useMemo(() => {
        if (!showTotalEarnings && startDate && endDate) {
            return {
                startDate,
                endDate,
            };
        }
        return { dateRange: 30 };
    }, [showTotalEarnings, startDate, endDate]);

    // Fetch order stats for ALL in-progress orders
    const { 
        stats: orderStats, 
        isLoading: isLoadingStats,
        isError: isErrorStats 
    } = useOrderStats({ dateFilter: "All" }, true);

    // Fetch dashboard analytics (for revenue with custom date range)
    const { 
        analytics, 
        isLoading: isLoadingAnalytics,
        isError: isErrorAnalytics 
    } = useDashboardAnalytics(customFilters);

    // ✅ Load cached orders when offline and calculate in-progress count
    useEffect(() => {
        const loadOfflineInProgressCount = async () => {
            if (!isOfflineMode) {
                setOfflineInProgressCount(0);
                return;
            }

            try {
                const cachedOrders = await getCachedOrders();
                const inProgressCount = cachedOrders.filter(
                    order => order.orderStatus === "In Progress"
                ).length;
                setOfflineInProgressCount(inProgressCount);
            } catch (error) {
                console.error('❌ Failed to load cached orders:', error);
                setOfflineInProgressCount(0);
            }
        };

        loadOfflineInProgressCount();

        // Refresh count every 5 seconds when offline
        const interval = isOfflineMode 
            ? setInterval(loadOfflineInProgressCount, 5000) 
            : null;

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isOfflineMode]);

    // Handle errors
    if (isErrorStats || isErrorAnalytics) {
        enqueueSnackbar("Failed to fetch analytics!", { variant: "error" });
    }

    // ✅ Use offline count when offline, otherwise use API data
    const ordersInProgress = isOfflineMode 
        ? offlineInProgressCount 
        : (orderStats?.byStatus?.["In Progress"] || 0);

    const totalRevenue = showTotalEarnings 
        ? (analytics?.summary?.totalRevenue || "0.000")
        : (analytics?.summary?.totalRevenue || "0.000");

    // Handle view earnings click
    const handleViewEarnings = () => {
        const userRole = getUserRole();

        if (userRole === "admin") {
            setShowEarningsAmount(true);
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

    // Loading state
    const isLoading = isOfflineMode ? false : (isLoadingStats || isLoadingAnalytics);

    return (
        <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
            {/* Responsive Container */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 max-w-auto mx-auto">
                
                {/* LEFT DIV - Full width on mobile/tablet, 60% on desktop */}
                <div className="w-full lg:flex-[3] lg:max-w-[60%]">
                    <Greetings />

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                                {[1, 2].map((i) => (
                                    <div 
                                        key={i}
                                        className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl animate-pulse"
                                    >
                                        <div className="h-8 bg-gray-700 rounded mb-4"></div>
                                        <div className="h-12 bg-gray-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Minicards Grid - Stack on mobile, side by side on tablet+ */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
                            {/* Total Earnings Minicard */}
                            <Minicard
                                title="Total Earnings"
                                icon={<BsCashCoin className="text-xl sm:text-2xl" />}
                                number={typeof totalRevenue === 'string' ? totalRevenue : totalRevenue.toFixed(3)}
                                footernum={1.6}
                                showDatePicker
                                showTotalEarnings={showTotalEarnings}
                                onToggleEarningsView={() => setShowTotalEarnings(!showTotalEarnings)}
                                onDateRangeChange={(start, end) => {
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                showEarningsAmount={showEarningsAmount}
                                onViewEarnings={handleViewEarnings}
                                isAdmin={getUserRole() === "admin"}
                            />

                            {/* Orders in Progress Minicard */}
                            <Minicard
                                title="In Progress"
                                icon={<GrInProgress className="text-xl sm:text-2xl" />}
                                number={ordersInProgress}
                                footernum={3.6}
                            />
                        </div>
                    )}

                    {/* Recent Orders */}
                    <RecentOrder />
                </div>

                {/* RIGHT DIV - Full width on mobile/tablet, 40% on desktop */}
                <div className="w-full lg:flex-[2] lg:max-w-[40%]">
                    <PopularDishes />
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
                            View Total Earnings - Admin Password Required
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-4">
                            Enter admin password to view total earnings.
                        </p>

                        <input
                            type="password"
                            className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
                            disabled={verifyPasswordMutation.isPending}
                        />

                        {verifyPasswordMutation.isPending && (
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
                                disabled={verifyPasswordMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPassword}
                                disabled={verifyPasswordMutation.isPending}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base transition-colors disabled:opacity-50"
                            >
                                {verifyPasswordMutation.isPending ? 'Verifying...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />
        </section>
    );
};

export default Home;