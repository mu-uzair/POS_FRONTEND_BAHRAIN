import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { verifyAdminPassword } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import "react-datepicker/dist/react-datepicker.css";

const Minicard = ({
    title,
    icon,
    number,
    footernum,
    showDatePicker,
    showTotalEarnings,
    onToggleEarningsView,
    onDateRangeChange,
}) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    // Password protection states
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

    const handleDateRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        if (onDateRangeChange) {
            onDateRangeChange(start, end);
        }
        setIsDatePickerOpen(false);
    };

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

    // Check if this is the Total Earnings card
    const isTotalEarnings = title === "Total Earnings";

    return (
        <>
            <div className="bg-[#1a1a1a] py-4 sm:py-5 px-4 sm:px-5 rounded-lg w-full relative">
                <div className="flex items-start justify-between">
                    <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wide">
                        {title}
                    </h1>
                    <div className="flex items-center gap-2">
                        {showDatePicker && showEarningsAmount && (
                            <button
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                className="p-1.5 sm:p-2 bg-[#02ca3a] rounded hover:bg-[#02a33a] transition-colors cursor-pointer"
                                disabled={showTotalEarnings}
                            >
                                <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        )}
                        <button
                            className={`${
                                title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"
                            } p-2 sm:p-3 rounded`}
                        >
                            {icon}
                        </button>
                    </div>
                </div>

                {/* Earnings Amount Section */}
                <div>
                    {isTotalEarnings ? (
                        // Total Earnings Card - Show Eye Button or Amount
                        <>
                            {!showEarningsAmount ? (
                                // Show Eye Button with Label
                                <div className="mt-3 sm:mt-5">
                                    <div className="flex items-center gap-2 bg-[#333333] px-3 py-2 rounded-lg w-fit">
                                        <span className="text-[#f5f5f5] text-sm sm:text-base font-semibold">
                                            View Amount:
                                        </span>
                                        <button
                                            onClick={handleViewEarnings}
                                            className="bg-[#444444] hover:bg-[#555555] text-[#02ca3a] p-1.5 rounded-lg transition-all duration-200"
                                            title={getUserRole() === "admin" ? "View earnings" : "Enter password to view"}
                                        >
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Show Actual Amount
                                <h1 className="text-[#f5f5f5] text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 sm:mt-5">
                                    BHD {number}
                                </h1>
                            )}
                        </>
                    ) : (
                        // Other Cards - Show Number Normally
                        <h1 className="text-[#f5f5f5] text-2xl sm:text-3xl lg:text-4xl font-bold mt-3 sm:mt-5">
                            {number}
                        </h1>
                    )}

                    <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg mt-2">
                        <span className="text-[#02ca3a]">{footernum}%</span> than yesterday
                    </h1>
                </div>

                {/* Toggle Button - Only show if earnings are visible */}
                {showDatePicker && showEarningsAmount && (
                    <button
                        onClick={onToggleEarningsView}
                        className="mt-2 sm:mt-3 p-2 bg-[#02ca3a] text-white rounded hover:bg-[#02a33a] transition-colors cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
                    >
                        {showTotalEarnings ? "View Earnings for Specific Date" : "View Total Earnings"}
                    </button>
                )}

                {/* Date Picker Dropdown - Only show if earnings are visible */}
                {showDatePicker && isDatePickerOpen && !showTotalEarnings && showEarningsAmount && (
                    <div className="absolute z-10 mt-2 left-0 right-0 sm:left-auto sm:right-0 sm:w-auto bg-[#262323] p-3 sm:p-4 rounded-lg shadow-lg border border-gray-600">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                className="p-2 rounded bg-[#1f1f1f] text-white text-sm w-full"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                className="p-2 rounded bg-[#1f1f1f] text-white text-sm w-full"
                            />
                        </div>
                        <button
                            onClick={() => handleDateRangeChange(startDate, endDate)}
                            className="mt-2 w-full p-2 bg-[#02ca3a] text-white rounded hover:bg-[#02a33a] transition-colors text-sm"
                        >
                            Apply
                        </button>
                    </div>
                )}
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
        </>
    );
};

export default Minicard;