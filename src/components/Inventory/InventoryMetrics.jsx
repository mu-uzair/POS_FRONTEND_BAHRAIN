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
  FaBoxes 
} from "react-icons/fa";

const InventoryMetrics = () => {
  // Fetch metrics
  const { data: metricsData, isLoading, isError } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    onSuccess: (data) => {
      console.log("getMetrics Success:", data);
    },
    onError: (error) => {
      console.error("getMetrics Error:", error);
      enqueueSnackbar("Failed to fetch inventory metrics!", { variant: "error" });
    },
  });

  const metrics = metricsData?.data || {};

  return (
    <div className="container mx-auto bg-[#1a1a1a] p-8 rounded-xl overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-3xl font-extrabold mb-8 tracking-tight">Inventory Metrics</h2>

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
          {/* Highlighted Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Inventory Value */}
            <div className="bg-gradient-to-r from-lime-600 to-lime-800 p-6 rounded-xl shadow-lg  transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaDollarSign className="text-white text-3xl" />
                <div>
                  <h3 className="text-white text-base font-semibold">Total Inventory Value</h3>
                  <p className="text-white text-4xl font-extrabold mt-2">
                    Rs{metrics.totalInventoryValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Products in Stock */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaBox className="text-white text-3xl" />
                <div>
                  <h3 className="text-white text-base font-semibold">Products in Stock</h3>
                  <p className="text-white text-4xl font-extrabold mt-2">
                    {metrics.productsInStock || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaExclamationTriangle className="text-white text-3xl" />
                <div>
                  <h3 className="text-white text-base font-semibold">Low Stock Alerts</h3>
                  <p className="text-white text-4xl font-extrabold mt-2">
                    {metrics.lowStockCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Transactions */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaExchangeAlt className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Total Transactions</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    {metrics.totalTransactions || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock In Transactions */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaArrowUp className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Stock In Transactions</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    {metrics.stockInTransactions || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock Out Transactions */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaArrowDown className="text-white text-2xl" />
                <div>
                  <h3 className= "text-white text-sm font-semibold">Stock Out Transactions</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    {metrics.stockOutTransactions || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaHistory className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Recent Transactions (Last 7 Days)</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    {metrics.recentTransactions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stock In Value */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaDollarSign className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Stock In Value</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    Rs{metrics.stockInValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock Out Value */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaDollarSign className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Stock Out Value</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    Rs{metrics.stockOutValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Transaction Value */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaChartLine className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Average Transaction Value</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    Rs{metrics.averageTransactionValue?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Average Unit Cost */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 p-6 rounded-xl shadow-lg transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <FaCalculator className="text-white text-2xl" />
                <div>
                  <h3 className="text-white text-sm font-semibold">Average Unit Cost</h3>
                  <p className="text-white text-3xl font-bold mt-2">
                    Rs{metrics.averageUnitCost?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
         
          {/* Tables Section */}
          {/* Top Products by Activity Table */}
          {metrics.topProducts?.length > 0 && (
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                <FaChartLine className="text-white" /> Top Products by Activity
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="pl-6 py-4">Product</th>
                      <th className="pl-6 py-4">Quantity Moved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topProducts.map((product, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-500 hover:bg-gray-700 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-600" : "bg-gray-800"
                        }`}
                      >
                        <td className="py-4 pl-6">{product.name}</td>
                        <td className="py-4 pl-6">{product.quantityMoved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vendor Contribution Table */}
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
                        <td className="py-4 pl-6">Rs{vendor.totalValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stock Movement by Product Table */}
          {metrics.stockMovement?.length > 0 && (
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                <FaBoxes className="text-white" /> Stock Movement by Product
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="pl-6 py-4">Product</th>
                      <th className="pl-6 py-4">Stock In</th>
                      <th className="pl-6 py-4">Stock Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.stockMovement.map((product, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-500 hover:bg-gray-700 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-600" : "bg-gray-800"
                        }`}
                      >
                        <td className="py-4 pl-6">{product.productName}</td>
                        <td className="py-4 pl-6">{product.stockIn}</td>
                        <td className="py-4 pl-6">{product.stockOut}</td>
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

export default InventoryMetrics;