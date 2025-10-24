import React, { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/Home/Greetings";
import Minicard from "../components/Home/Minicard";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrder from "../components/Home/RecentOrder";
import PopularDishes from "../components/Home/PopularDishes";
import { getOrders } from "../https/index";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack"; // For error handling

const Home = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showTotalEarnings, setShowTotalEarnings] = useState(true); // Toggle between total and specific date earnings

    // Fetch orders using useQuery
    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await getOrders();
            console.log("Orders API Response:", response); // Log the full API response
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
            start.setHours(0, 0, 0, 0); // Set time to start of the day
            end.setHours(23, 59, 59, 999); // Set time to end of the day
            return orderDate >= start && orderDate <= end;
        }
        return true; // If no date range is selected, return all orders
    });

    // Calculate the number of orders in progress
    const ordersInProgress = filteredOrders?.filter(
        (order) => order.orderStatus === "In Progress"
    ).length || 0;

    // Calculate the total revenue from completed orders within the date range
    const totalRevenue = filteredOrders
        ?.filter((order) => order.orderStatus === "Completed")
        .reduce((total, order) => total + order.bills.totalWithTax, 0) || 0;

    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
            {/* LEFT DIV */}
            <div className="flex-[3]">
                <Greetings />

                <div className="flex items-center w-full gap-3 px-8 mt-8">
                    {/* Total Earnings Minicard */}
                    <Minicard
                        title="Total Earnings"
                        icon={<BsCashCoin />}
                        number={totalRevenue.toFixed(3)} // Display total revenue
                        footernum={1.6} // You can calculate this dynamically if needed
                        showDatePicker // Enable date picker for this card
                        showTotalEarnings={showTotalEarnings}
                        onToggleEarningsView={() => setShowTotalEarnings(!showTotalEarnings)}
                        onDateRangeChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    />

                    {/* Orders in Progress Minicard */}
                    <Minicard
                        title="In Progress"
                        icon={<GrInProgress />}
                        number={ordersInProgress} // Display number of orders in progress
                        footernum={3.6} // You can calculate this dynamically if needed
                    />
                </div>
                <RecentOrder />
            </div>
            {/* RIGHT DIV */}
            <div className="flex-[2]">
                <PopularDishes />
            </div>

            {/* for BottomNav */}
            <BottomNav />
        </section>
    );
};

export default Home;