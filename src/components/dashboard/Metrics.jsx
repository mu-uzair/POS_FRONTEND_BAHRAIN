import React from "react";
import {
  FaMoneyBillAlt,
  FaShoppingCart,
  FaUtensils,
  FaListAlt,
  FaConciergeBell,
  FaChair,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getDishes, getCategories, getTable, getOrders } from "../../https";

// Icons mapped to titles
const iconMap = {
  Revenue: <FaMoneyBillAlt size={20} />,
  "Total Orders": <FaShoppingCart size={20} />,
  "Total Dishes": <FaUtensils size={20} />,
  "Total Categories": <FaListAlt size={20} />,
  "Active Orders": <FaConciergeBell size={20} />,
  "Total Tables": <FaChair size={20} />,
};

const Metrics = () => {
  // All API calls in parallel
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const { data: dishesData, isLoading: dishesLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTable,
  });

  // Check if any data is still loading
  if (ordersLoading || dishesLoading || categoriesLoading || tablesLoading) {
    return <div className="text-white">Loading metrics...</div>;
  }

  // Extract data safely
  const orders = ordersData?.data?.data || [];
  const dishes = dishesData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];
  const tables = tablesData?.data?.data || [];
  console.log(orders)

  // Dynamically calculated metrics
  const revenue = ordersData?.data?.data?.reduce((total, order) => {
    // Only add to total if order.status is NOT 'In Progress'
    if (order.status !== 'In Progress') {
      return total + (order.bills?.totalWithTax || 0);
    }
    return total; // Otherwise, return current total without adding
  }, 0);
  const totalOrders = orders.length;
  const totalDishes = dishes.length;
  const totalCategories = categories.length;
  const totalTables = tables.length;
  const activeOrders = ordersData?.data?.data?.filter(
    (order) => order.orderStatus === "In Progress"
  )?.length || 0;

  const dynamicMetrics = [
    { title: "Revenue", value: `$${revenue.toFixed(2)}`, color: "#FF6B6B" },        // Soft Bright Red
    { title: "Total Orders", value: totalOrders, color: "#7F56D9" },              // Vivid Purple
    { title: "Total Dishes", value: totalDishes, color: "#3B82F6" },              // Bright Blue
    { title: "Total Categories", value: totalCategories, color: "#22C55E" },      // Fresh Green
    { title: "Active Orders", value: activeOrders, color: "#F59E0B" },            // Vibrant Amber (Yellow-Orange)
    { title: "Total Tables", value: totalTables, color: "#10B981" },              // Minty Green
  ];

  return (
    <div className="container mx-auto py-8 px-6">
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-2xl mb-1">Overall Performance</h2>
          <p className="text-sm text-[#ababab]">Detailed insights into your current business performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a] hover:bg-[#333333] transition-all">
          Last 1 Month
          <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dynamicMetrics.map((metric, index) => (
          <div
            key={index}          
            className="shadow-md rounded-2xl p-5 transition duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
             transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1"
            style={{ backgroundColor: metric.color }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                {iconMap[metric.title]}
                <p className="font-medium text-base">{metric.title}</p>
              </div>
            </div>
            <p className="mt-3 font-bold text-3xl text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;


