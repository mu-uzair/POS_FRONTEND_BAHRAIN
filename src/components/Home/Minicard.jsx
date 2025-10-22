import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css"; // Date picker CSS

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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // State to control dropdown visibility
    const [startDate, setStartDate] = useState(null); // Start date state
    const [endDate, setEndDate] = useState(null); // End date state

    // Handle date range selection
    const handleDateRangeChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        if (onDateRangeChange) {
            onDateRangeChange(start, end); // Notify parent component of the new date range
        }
        setIsDatePickerOpen(false); // Close the date picker dropdown
    };

    return (
        <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%] relative">
            <div className="flex items-start justify-between">
                <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    {showDatePicker && (
                        <button
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className="p-2 bg-[#02ca3a] rounded hover:bg-[#02a33a] transition-colors cursor-pointer"
                            disabled={showTotalEarnings} // Disable date picker when showing total earnings
                        >
                        
                            <FaCalendarAlt  className="w-7 h-6"/>
                        </button>
                    )}
                    <button
                        className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"
                            } p-3 rounded`}
                    >
                        {icon}
                    </button>
                </div>
            </div>
            <div>
                <h1 className="text-[#f5f5f5] text-4xl font-bold mt-5">
                    {title === "Total Earnings" ? `BHD ${number}` : number}
                </h1>
                <h1 className="text-[#f5f5f5] text-lg mt-2">
                    <span className="text-[#02ca3a]">{footernum}%</span> than yesterday
                </h1>
            </div>

            {/* Toggle Button */}
            {showDatePicker && (
                <button
                    onClick={onToggleEarningsView}
                    className="mt-2 p-2 bg-[#02ca3a] text-white rounded hover:bg-[#02a33a] transition-colors cursor-pointer "
                >
                    {showTotalEarnings ? "View Earnings for Specific Date" : "View Total Earnings"}
                </button>
            )}

            {/* Date Picker Dropdown */}
            {showDatePicker && isDatePickerOpen && !showTotalEarnings && (
                <div className="absolute z-10 mt-7  bg-[#262323] p-4 rounded-lg shadow-lg border-white">
                    <div className="flex gap-3">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Start Date"
                            className="p-2 rounded bg-[#1f1f1f] text-white"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="End Date"
                            className="p-2 rounded bg-[#1f1f1f] text-white"
                        />
                    </div>
                    <button
                        onClick={() => handleDateRangeChange(startDate, endDate)}
                        className="mt-2 w-full p-2 bg-[#02ca3a] text-white rounded hover:bg-[#02a33a] transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};

export default Minicard;







