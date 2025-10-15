import React, { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
    const [status, setStatus] = useState("All");
    const [dateFilter, setDateFilter] = useState("All"); // State for date filtering
    const [selectedDate, setSelectedDate] = useState(""); // State for custom date selection

    // Fetch orders using useQuery
    const { data: resData, isError } = useQuery({
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
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    // // Filter orders based on the selected status and date
    // const filteredOrders = resData?.data?.data.filter((order) => {
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

// Filter orders based on the selected status and date
const ordersArray = resData?.data?.data ?? [];
const filteredOrders = ordersArray.filter((order) => {
    // Filter by status
    if (status !== "All" && order.orderStatus !== status) return false;

    // Filter by date
    const orderDate = new Date(order.createdAt).toDateString(); // Convert order date to a readable format
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toDateString();

    switch (dateFilter) {
        case "Today":
            return orderDate === today;
        case "Yesterday":
            return orderDate === yesterdayDate;
        case "Custom":
            return selectedDate
                ? orderDate === new Date(selectedDate).toDateString()
                : true; // Show all if no date is selected
        default:
            return true; // Show all orders if no date filter is applied
    }
});

// Example: Sort orders so that the newest (latest createdAt) comes first:
const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));





    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
        
            {/* Header Section */}
            <div className="flex items-center justify-between px-10 py-4">
                <div className="flex items-center">
                    <BackButton />
                    <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
                        Orders
                    </h1>
                </div>
                <div className="flex items-center justify-around gap-4">
                    {/* Buttons for filtering orders by status */}
                    <button
                        onClick={() => setStatus("All")}
                        className={`text-[#ababab] text-lg ${
                            status === "All" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setStatus("In Progress")}
                        className={`text-[#ababab] text-lg ${
                            status === "In Progress" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        In Progress
                    </button>

                    <button
                        onClick={() => setStatus("Ready")}
                        className={`text-[#ababab] text-lg ${
                            status === "Ready" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        Ready
                    </button>

                    <button
                        onClick={() => setStatus("Completed")}
                        className={`text-[#ababab] text-lg ${
                            status === "Completed" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Date Filtering Options */}
            <div className="flex items-center justify-between px-10 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setDateFilter("All")}
                        className={`text-[#ababab] text-lg ${
                            dateFilter === "All" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        All Dates
                    </button>

                    <button
                        onClick={() => setDateFilter("Today")}
                        className={`text-[#ababab] text-lg ${
                            dateFilter === "Today" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        Today
                    </button>

                    <button
                        onClick={() => setDateFilter("Yesterday")}
                        className={`text-[#ababab] text-lg ${
                            dateFilter === "Yesterday" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        Yesterday
                    </button>

                    <button
                        onClick={() => setDateFilter("Custom")}
                        className={`text-[#ababab] text-lg ${
                            dateFilter === "Custom" && "bg-[#383838]"
                        } rounded-lg px-5 py-1 font-semibold tracking-wide`}
                    >
                        Custom Date
                    </button>

                    {dateFilter === "Custom" && (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-[#383838] text-[#f5f5f5] rounded-lg px-3 py-1"
                        />
                    )}
                </div>
            </div>

            {/* Orders Container (Grid Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-5 py- hidden-scrollbar overflow-y-auto h-[calc(100vh-5rem-10rem)]">
            {sortedFilteredOrders?.length > 0 ? (
    sortedFilteredOrders.map((order) => (
        <OrderCard key={order._id} order={order} />
    ))
                ) : (
                    <p className="text-lg text-gray-400 col-span-full">
                        No orders available
                    </p>
                )}
            </div>

            <BottomNav />
        </section>
    );
};

export default Orders;










