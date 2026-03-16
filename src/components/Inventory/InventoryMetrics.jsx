import React from "react";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getMetrics } from "../../https";
import {
  FaDollarSign,
  FaBox,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaHistory,
  FaCalculator,
  FaTruck,
  FaBoxes,
} from "react-icons/fa";

// Helper to safely parse Decimal128 / string / number
const parseDecimal = (value) => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  if (value.$numberDecimal) return parseFloat(value.$numberDecimal) || 0;
  if (typeof value.toString === "function") return parseFloat(value.toString()) || 0;
  return 0;
};

// Helper to format as BHD (3 decimal places)
const formatBHD = (num) => `BHD ${parseDecimal(num).toFixed(3)}`;

const InventoryMetrics = () => {
  const { data: metricsData, isLoading, isError } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    onSuccess: (data) => console.log("getMetrics Success:", data),
    onError: (error) => {
      console.error("getMetrics Error:", error);
      enqueueSnackbar("Failed to fetch inventory metrics!", { variant: "error" });
    },
  });

  const metrics = metricsData?.data || {};

  return (
    <div className="container mx-auto bg-[#1a1a1a] p-8 rounded-xl overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-3xl font-extrabold mb-8 tracking-tight">
        Inventory Metrics
      </h2>

      {isLoading ? (
        <div className="text-center text-gray-400 py-8">
          <svg
            className="animate-spin h-10 w-10 text-gray-400 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="mt-3 block text-lg">Loading metrics...</span>
        </div>
      ) : isError ? (
        <div className="text-center text-gray-400 py-8 text-lg">
          Failed to load metrics.
        </div>
      ) : (
        <div className="space-y-10">
          {/* --- Highlighted Metrics --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Inventory Value */}
            <MetricCard
              icon={<FaDollarSign className="text-white text-3xl" />}
              title="Total Inventory Value"
              value={formatBHD(metrics.totalInventoryValue)}
              color="from-lime-600 to-lime-800"
            />

            {/* Products in Stock */}
            <MetricCard
              icon={<FaBox className="text-white text-3xl" />}
              title="Products in Stock"
              value={metrics.productsInStock || 0}
              color="from-teal-600 to-teal-800"
            />

            {/* Low Stock Alerts */}
            <MetricCard
              icon={<FaExclamationTriangle className="text-white text-3xl" />}
              title="Low Stock Alerts"
              value={metrics.lowStockCount || 0}
              color="from-red-600 to-red-800"
            />
          </div>

          {/* --- Transaction Metrics --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<FaExchangeAlt className="text-white text-2xl" />}
              title="Total Transactions"
              value={metrics.totalTransactions || 0}
              color="from-purple-600 to-purple-800"
            />
            <MetricCard
              icon={<FaArrowUp className="text-white text-2xl" />}
              title="Stock In Transactions"
              value={metrics.stockInTransactions || 0}
              color="from-cyan-600 to-cyan-800"
            />
            <MetricCard
              icon={<FaArrowDown className="text-white text-2xl" />}
              title="Stock Out Transactions"
              value={metrics.stockOutTransactions || 0}
              color="from-orange-600 to-orange-800"
            />
            <MetricCard
              icon={<FaHistory className="text-white text-2xl" />}
              title="Recent Transactions (Last 7 Days)"
              value={metrics.recentTransactions || 0}
              color="from-indigo-600 to-indigo-800"
            />
          </div>

          {/* --- Value Metrics --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              icon={<FaDollarSign className="text-white text-2xl" />}
              title="Stock In Value"
              value={formatBHD(metrics.stockInValue)}
              color="from-emerald-600 to-emerald-800"
            />
            <MetricCard
              icon={<FaDollarSign className="text-white text-2xl" />}
              title="Stock Out Value"
              value={formatBHD(metrics.stockOutValue)}
              color="from-amber-600 to-amber-800"
            />
            <MetricCard
              icon={<FaChartLine className="text-white text-2xl" />}
              title="Average Transaction Value"
              value={formatBHD(metrics.averageTransactionValue)}
              color="from-sky-600 to-sky-800"
            />
            <MetricCard
              icon={<FaCalculator className="text-white text-2xl" />}
              title="Average Unit Cost"
              value={formatBHD(metrics.averageUnitCost)}
              color="from-violet-600 to-violet-800"
            />
          </div>

          {/* --- Vendor Contribution Table --- */}
          {metrics.vendorContribution?.length > 0 && (
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                <FaTruck className="text-white" /> Vendor Contribution
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="pl-6 py-4">Vendor</th>
                      <th className="pl-6 py-4">Product Count</th>
                      <th className="pl-6 py-4">Total Stock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.vendorContribution.map((vendor, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-500 hover:bg-gray-700 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-600" : "bg-gray-800"
                        }`}
                      >
                        <td className="py-4 pl-6">{vendor.vendorName || "N/A"}</td>
                        <td className="py-4 pl-6">{vendor.productCount}</td>
                        <td className="py-4 pl-6">
                          {formatBHD(vendor.totalValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Subcomponent: Reusable Metric Card ---
const MetricCard = ({ icon, title, value, color }) => (
  <div
    className={`bg-gradient-to-r ${color} p-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.02] hover:-translate-y-1`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h3 className="text-white text-base font-semibold">{title}</h3>
        <p className="text-white text-4xl font-extrabold mt-2">{value}</p>
      </div>
    </div>
  </div>
);

export default InventoryMetrics;
