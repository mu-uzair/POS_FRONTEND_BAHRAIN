

// import React, { useState } from "react";
// import BottomNav from "../components/shared/BottomNav";
// import Greetings from "../components/Home/Greetings";
// import Minicard from "../components/Home/Minicard";
// import { BsCashCoin } from "react-icons/bs";
// import { GrInProgress } from "react-icons/gr";
// import RecentOrder from "../components/Home/RecentOrder";
// import PopularDishes from "../components/Home/PopularDishes";
// import { getOrders } from "../https/index";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";

// const Home = () => {
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [showTotalEarnings, setShowTotalEarnings] = useState(true);

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

//             {/* Bottom Navigation */}
//             <BottomNav />
//         </section>
//     );
// };

// export default Home;

import React, { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/Home/Greetings";
import Minicard from "../components/Home/Minicard";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrder from "../components/Home/RecentOrder";
import PopularDishes from "../components/Home/PopularDishes";
import { getOrders, verifyAdminPassword } from "../https/index";
import { keepPreviousData, useQuery, useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const Home = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showTotalEarnings, setShowTotalEarnings] = useState(true);
    
    // Password modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [showEarningsAmount, setShowEarningsAmount] = useState(false);

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

    // Fetch orders using useQuery
    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await getOrders();
            console.log("Orders API Response:", response);
            return response;
        },
        placeholderData: keepPreviousData,
    });

    // Handle errors
    if (isError) {
        enqueueSnackbar("Failed to fetch orders!", { variant: "error" });
    }

    // Filter orders based on the selected date range
    const filteredOrders = resData?.data?.data?.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (!showTotalEarnings && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return orderDate >= start && orderDate <= end;
        }
        return true;
    });

    // Calculate the number of orders in progress
    const ordersInProgress = filteredOrders?.filter(
        (order) => order.orderStatus === "In Progress"
    ).length || 0;

    // Calculate the total revenue from completed orders within the date range
    const totalRevenue = filteredOrders
        ?.filter((order) => order.orderStatus === "Completed")
        .reduce((total, order) => total + order.bills.totalWithTax, 0) || 0;

    // Handle view earnings click
    const handleViewEarnings = () => {
        const userRole = getUserRole();

        if (userRole === "admin") {
            // Admin - show earnings directly
            setShowEarningsAmount(true);
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

    return (
        <section className="bg-[#1f1f1f] min-h-screen pb-20 md:pb-24">
            {/* Responsive Container */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 max-w-auto mx-auto">
                
                {/* LEFT DIV - Full width on mobile/tablet, 60% on desktop */}
                <div className="w-full lg:flex-[3] lg:max-w-[60%]">
                    <Greetings />

                    {/* Minicards Grid - Stack on mobile, side by side on tablet+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
                        {/* Total Earnings Minicard */}
                        <Minicard
                            title="Total Earnings"
                            icon={<BsCashCoin className="text-xl sm:text-2xl" />}
                            number={totalRevenue.toFixed(3)}
                            footernum={1.6}
                            showDatePicker
                            showTotalEarnings={showTotalEarnings}
                            onToggleEarningsView={() => setShowTotalEarnings(!showTotalEarnings)}
                            onDateRangeChange={(start, end) => {
                                setStartDate(start);
                                setEndDate(end);
                            }}
                            // New props for password protection
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

            {/* Bottom Navigation */}
            <BottomNav />
        </section>
    );
};

export default Home;