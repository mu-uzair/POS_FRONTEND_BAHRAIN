import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getDeliveryBoys,
  assignDeliveryBoyToOrder,
} from "../https";
import toast from "react-hot-toast";
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Users, Package, DollarSign } from "lucide-react";

const DeliveryMetrics = () => {
  const queryClient = useQueryClient();

  // State Management
  const [dateFilter, setDateFilter] = useState("Today");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState("All");

  // Fetch Orders
  const {
    data: ordersRes,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Fetch Delivery Boys
  const {
    data: boysRes,
    isLoading: boysLoading,
    isError: boysError,
  } = useQuery({
    queryKey: ["deliveryBoys"],
    queryFn: getDeliveryBoys,
  });

  const isLoading = ordersLoading || boysLoading;
  const isError = ordersError || boysError;

  const orders = ordersRes?.data?.data ?? [];
  const deliveryBoys = boysRes?.data?.data ?? [];

  // Date Filter Logic
  const matchesDateFilter = (order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();

    switch (dateFilter) {
      case "Today":
        return orderDate === today;
      case "Yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDate === yesterday.toDateString();
      }
      case "This Week": {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(order.createdAt) >= weekAgo;
      }
      case "This Month": {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(order.createdAt) >= monthAgo;
      }
      case "Custom":
        if (!selectedDate) return true;
        return orderDate === new Date(selectedDate).toDateString();
      case "All":
      default:
        return true;
    }
  };

  // Filtered Orders
  const deliveryOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.customerDetails?.orderType === "Delivery" && matchesDateFilter(o)
      ),
    [orders, dateFilter, selectedDate]
  );

  const completedOrders = useMemo(() => {
    let filtered = deliveryOrders.filter((o) => o.orderStatus === "Completed");

    // Rider filter for completed orders
    if (selectedRider !== "All") {
      filtered = filtered.filter((o) => o.deliveryBoyId?._id === selectedRider);
    }

    // Search filter for completed orders
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderNo?.toString().includes(searchTerm) ||
          o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [deliveryOrders, selectedRider, searchTerm]);

  const activeOrders = useMemo(() => {
    let filtered = deliveryOrders.filter((o) => o.orderStatus !== "Completed" && o.orderStatus !== "Cancelled");

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.orderStatus === statusFilter);
    }

    // Rider filter
    if (selectedRider !== "All") {
      filtered = filtered.filter((o) => o.deliveryBoyId?._id === selectedRider);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.orderNo?.toString().includes(searchTerm) ||
          o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [deliveryOrders, statusFilter, selectedRider, searchTerm]);

  // Calculate Metrics
  const totalRevenue = useMemo(
    () =>
      completedOrders.reduce(
        (sum, o) => sum + (o.bills?.totalWithTax || 0),
        0
      ),
    [completedOrders]
  );

  const avgOrderValue = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;

  const activeDeliveryBoys = useMemo(() => {
    const activeIds = new Set(
      activeOrders
        .map((o) => o.deliveryBoyId?._id)
        .filter((id) => typeof id === "string")
    );
    return deliveryBoys.filter((boy) => activeIds.has(boy._id));
  }, [activeOrders, deliveryBoys]);

  // Rider Statistics
  const riderStats = useMemo(() => {
    const stats = {};
    for (const o of completedOrders) {
      const id = o.deliveryBoyId?._id;
      if (!id) continue;
      if (!stats[id]) {
        stats[id] = {
          name: o.deliveryBoyId.name,
          count: 0,
          revenue: 0,
          activeOrders: 0
        };
      }
      stats[id].count += 1;
      stats[id].revenue += o.bills?.totalWithTax || 0;
    }

    // Add active orders count
    activeOrders.forEach(o => {
      const id = o.deliveryBoyId?._id;
      if (id && stats[id]) {
        stats[id].activeOrders += 1;
      }
    });

    return Object.values(stats).sort((a, b) => b.count - a.count);
  }, [completedOrders, activeOrders]);

  // Order Status Distribution
  const statusDistribution = useMemo(() => {
    const dist = {};
    activeOrders.forEach(o => {
      dist[o.orderStatus] = (dist[o.orderStatus] || 0) + 1;
    });
    return dist;
  }, [activeOrders]);

  // Assign Rider Mutation
  const mutation = useMutation({
    mutationFn: ({ orderId, deliveryBoyId }) =>
      assignDeliveryBoyToOrder(orderId, deliveryBoyId),
    onSuccess: () => {
      toast.success("Delivery boy assigned successfully!");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to assign delivery boy"
      );
    },
  });

  const handleAssign = (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) {
      toast.error("Please select a delivery boy");
      return;
    }
    mutation.mutate({ orderId, deliveryBoyId });
  };

  // Loading State
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#02ca3a] mb-4"></div>
        <p className="text-lg">Loading Delivery Metrics...</p>
      </div>
    );

  // Error State
  if (isError)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-red-400">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg">Failed to fetch data. Please try again.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 font-inter pb-24 md:pb-28">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-#FFFFFF mb-2 bg-gradient-to-r from-[#02ca3a] to-[#10B981] bg-clip-text text-transparent">
          Delivery Metrics Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Real-time insights and comprehensive analytics for delivery operations
        </p>
      </header>

      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        {/* Date Filter */}
        <div className="bg-[#141414]/90 p-4 rounded-xl border border-gray-800 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm font-medium text-gray-400 whitespace-nowrap flex items-center gap-2">
              <Clock size={16} />
              Time Period:
            </span>
            <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 min-w-max">
                {["All", "Today", "Yesterday", "This Week", "This Month", "Custom"].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDateFilter(d);
                      if (d !== "Custom") setSelectedDate("");
                    }}
                    className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      dateFilter === d
                        ? "bg-[#02ca3a] text-black shadow-lg"
                        : "bg-[#1f1f1f] text-[#ababab] hover:bg-[#2a2a2a] border border-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
                {dateFilter === "Custom" && (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-[#1f1f1f] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm border border-gray-700 focus:ring-2 focus:ring-[#02ca3a] focus:border-[#02ca3a] outline-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Rider Filters */}
        <div className="bg-[#141414]/90 p-4 rounded-xl border border-gray-800 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Search Orders</label>
              <input
                type="text"
                placeholder="Order ID, Order No, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1f1f1f] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm border border-gray-700 focus:ring-2 focus:ring-[#02ca3a] outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#1f1f1f] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm border border-gray-700 focus:ring-2 focus:ring-[#02ca3a] outline-none"
              >
                <option value="All">All Status</option>
                <option value="InProgress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Rider Filter */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Delivery Boy</label>
              <select
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
                className="w-full bg-[#1f1f1f] text-[#f5f5f5] rounded-lg px-3 py-2 text-sm border border-gray-700 focus:ring-2 focus:ring-[#02ca3a] outline-none"
              >
                <option value="All">All Riders</option>
                {deliveryBoys.map((boy) => (
                  <option key={boy._id} value={boy._id}>
                    {boy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Active Riders"
          value={activeDeliveryBoys.length}
          total={deliveryBoys.length}
          color="#10B981"
          icon={<Users size={24} />}
        />
        <MetricCard
          title="Completed Deliveries"
          value={completedOrders.length}
          subtitle={`${deliveryOrders.length} total orders`}
          color="#3B82F6"
          icon={<CheckCircle size={24} />}
        />
        <MetricCard
          title="Active Orders"
          value={activeOrders.length}
          subtitle={Object.keys(statusDistribution).length > 0 ? `${Object.keys(statusDistribution).length} statuses` : null}
          color="#F59E0B"
          icon={<Package size={24} />}
        />
        <MetricCard
          title="Total Revenue"
          value={`BHD ${totalRevenue.toFixed(3)}`}
          subtitle={`Avg: BHD ${avgOrderValue.toFixed(3)}`}
          color="#22C55E"
          icon={<DollarSign size={24} />}
        />
      </div>

      {/* Status Distribution */}
      {Object.keys(statusDistribution).length > 0 && (
        <div className="bg-[#141414]/90 p-4 sm:p-6 rounded-xl border border-gray-800 backdrop-blur-md mb-6">
          <h3 className="text-[#02ca3a] text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="bg-[#1f1f1f] p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">{status}</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Orders Table */}
      <SectionCard title="🚴 Active Deliveries" count={activeOrders.length}>
        {activeOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-700 bg-[#111]/70">
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Order No</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Order ID</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Customer</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Current Rider</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Assign Rider</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-[#1f1f1f]/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-sm text-[#02ca3a]">
                      {order.orderNo || "-"}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-300">
                      #{order.orderId || order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="max-w-[150px] truncate">
                        {order.customerDetails?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#02ca3a]">
                      BHD {(order.bills?.totalWithTax || 0).toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        order.deliveryBoyId?.name 
                          ? "bg-blue-500/20 text-blue-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {order.deliveryBoyId?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.deliveryBoyId?._id || ""}
                        onChange={(e) => handleAssign(order._id, e.target.value)}
                        disabled={mutation.isPending}
                        className="bg-[#111] border border-gray-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#02ca3a] outline-none text-gray-200 w-full min-w-[140px] disabled:opacity-50"
                      >
                        <option value="">Select Rider</option>
                        {deliveryBoys.map((boy) => (
                          <option key={boy._id} value={boy._id}>
                            {boy.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No active deliveries match your filters" />
        )}
      </SectionCard>

      {/* Rider Performance */}
      <SectionCard title="🏆 Rider Performance" count={riderStats.length}>
        {riderStats.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-700 bg-[#111]/70">
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Rank</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Rider Name</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Completed</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Active</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Revenue</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Avg Order</th>
                </tr>
              </thead>
              <tbody>
                {riderStats.map((rider, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-[#1f1f1f]/70 transition"
                  >
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                        i === 1 ? "bg-gray-400/20 text-gray-300" :
                        i === 2 ? "bg-orange-600/20 text-orange-400" :
                        "bg-gray-700/20 text-gray-400"
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-sm">{rider.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                        {rider.count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                        {rider.activeOrders || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#02ca3a]">
                      BHD {rider.revenue.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      BHD {(rider.revenue / rider.count).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No rider performance data available" />
        )}
      </SectionCard>

      {/* Completed Orders Table */}
      <SectionCard title="✅ Completed Deliveries" count={completedOrders.length}>
        {completedOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-700 bg-[#111]/70">
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Order No</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Order ID</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Customer</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Delivery Boy</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Change Rider</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-400 uppercase">Completed At</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-[#1f1f1f]/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-sm text-[#02ca3a]">
                      {order.orderNo || "-"}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-300">
                      #{order.orderId || order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="max-w-[150px] truncate">
                        {order.customerDetails?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-[#02ca3a]">
                      BHD {(order.bills?.totalWithTax || 0).toFixed(3)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        {order.deliveryBoyId?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.deliveryBoyId?._id || ""}
                        onChange={(e) => handleAssign(order._id, e.target.value)}
                        disabled={mutation.isPending}
                        className="bg-[#111] border border-gray-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#02ca3a] outline-none text-gray-200 w-full min-w-[140px] disabled:opacity-50"
                      >
                        <option value="">Select Rider</option>
                        {deliveryBoys.map((boy) => (
                          <option key={boy._id} value={boy._id}>
                            {boy.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No completed deliveries match your filters" />
        )}
      </SectionCard>
    </div>
  );
};

// Enhanced Metric Card Component
const MetricCard = ({ title, value, subtitle, total, color, icon }) => (
  <div className="p-5 rounded-xl shadow-lg backdrop-blur-lg bg-[#1a1a1a]/70 border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
      <div style={{ color }}>{icon}</div>
    </div>
    <p className="text-3xl font-extrabold mb-1" style={{ color }}>
      {value}
    </p>
    {(subtitle || total) && (
      <p className="text-xs text-gray-500">
        {subtitle || `of ${total} total`}
      </p>
    )}
  </div>
);

// Section Card Component
const SectionCard = ({ title, count, children }) => (
  <div className="bg-[#141414]/90 p-5 rounded-xl shadow-xl mb-8 border border-gray-800 backdrop-blur-md">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[#02ca3a] text-xl font-semibold">{title}</h3>
      {count !== undefined && (
        <span className="text-sm text-gray-400 bg-[#1f1f1f] px-3 py-1 rounded-full">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      )}
    </div>
    {children}
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    "InProgress": { bg: "bg-blue-500/20", text: "text-blue-400", label: "In Progress" },
    "Ready": { bg: "bg-purple-500/20", text: "text-purple-400", label: "Ready" },
    "Completed": { bg: "bg-green-500/20", text: "text-green-400", label: "Completed" },
    "Cancelled": { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" },
  };

  const config = statusConfig[status] || { bg: "bg-gray-500/20", text: "text-gray-400", label: status };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <Package size={48} className="mb-4 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

export default DeliveryMetrics;