import React, { useState, useMemo, useCallback } from "react";
import { formatDateAndTme } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus, updateTable, deleteOrder } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useInfiniteOrders } from "../../hooks/orderData API optimization hooks/useInfiniteOrders";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Build filters for the hook
  const filters = useMemo(() => ({
    status: statusFilter === "All" ? undefined : statusFilter,
    dateFilter: dateFilter === "Custom" ? undefined : dateFilter,
    startDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
    endDate: dateFilter === "Custom" && selectedDate ? selectedDate : undefined,
  }), [statusFilter, dateFilter, selectedDate]);

  // Fetch orders with infinite scroll
  const {
    orders,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    lastOrderRef,
    refetch: refetchOrders,
  } = useInfiniteOrders(filters, true);

  // Debug: Log first order to check structure
  if (orders.length > 0) {
    console.log('=== RECENTORDERS DEBUG ===');
    console.log('First order table:', orders[0].table);
    console.log('Table No:', orders[0].table?.tableNo);
    console.log('Order Type:', orders[0].customerDetails?.orderType);
    console.log('=========================');
  }

  // Mutation to update table status
  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
    onSuccess: () => {
      enqueueSnackbar("Table status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Table update error:", error);
      enqueueSnackbar("Failed to update table status!", { variant: "error" });
    },
  });

  // Mutation to update order status
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => {
      return updateOrderStatus({ orderId, orderStatus });
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      
      // Refetch orders instead of invalidating to maintain scroll position
      refetchOrders();

      // Update table status if order is completed and has a table
      if (variables.orderStatus === "Completed" && variables.tableId) {
        updateTableMutation.mutate({ 
          tableId: variables.tableId, 
          status: "Available" 
        });
      }
    },
    onError: (error) => {
      console.error("Order status update error:", error);
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  // Mutation to delete order
  const deleteOrderMutation = useMutation({
    mutationFn: ({ orderId, tableId, orderType }) => {
      return deleteOrder(orderId).then((response) => {
        return { response, tableId, orderType };
      });
    },
    onSuccess: (data) => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      refetchOrders();
      
      // Update table status if it was a dine-in order with a table
      if (data.tableId && data.orderType === "Dine-in") {
        updateTableMutation.mutate({ 
          tableId: data.tableId, 
          status: "Available" 
        });
      }
    },
    onError: (error) => {
      console.error("Order deletion error:", error);
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    },
  });

  // Handle status change
  const handleStatusChange = useCallback(({ orderId, orderStatus, tableId, orderType }) => {
    if (orderStatus === "delete") {
      if (window.confirm("Are you sure you want to delete this order?")) {
        deleteOrderMutation.mutate({ orderId, tableId, orderType });
      }
    } else {
      orderStatusUpdateMutation.mutate({ orderId, orderStatus, tableId });
    }
  }, [deleteOrderMutation, orderStatusUpdateMutation]);

  // Client-side search filter (only searches in already loaded orders)
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    
    const searchLower = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const customerName = order.customerDetails?.name?.toLowerCase() || "";
      const orderId = order.orderId?.toLowerCase() || "";
      return customerName.includes(searchLower) || orderId.includes(searchLower);
    });
  }, [orders, searchTerm]);

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Ready":
        return "text-green-500";
      case "Completed":
        return "text-blue-500";
      case "In Progress":
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    if (filter !== "Custom") {
      setSelectedDate("");
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter("All");
    setSelectedDate("");
    setStatusFilter("All");
  };

  const hasActiveFilters = searchTerm || dateFilter !== "All" || statusFilter !== "All";

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#f5f5f5] text-xl font-semibold">Recent Orders</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium px-3 py-1.5 text-red-400 bg-[#1a1a1a] rounded-md hover:bg-red-900/20 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] placeholder-gray-400 focus:outline-none focus:border-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
              Status:
            </label>
            <div className="flex gap-2 bg-[#333333] p-1 rounded-lg">
              {["All", "In Progress", "Ready", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-xs font-medium px-3 py-1 rounded-md transition-all whitespace-nowrap
                    ${statusFilter === status
                      ? "bg-[#02ca3a] text-black shadow-md"
                      : "text-[#ababab] hover:bg-[#444444]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
              Date:
            </label>
            <div className="flex items-center gap-2 bg-[#333333] p-1 rounded-lg">
              {["All", "Today", "Yesterday", "Custom"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleDateFilterChange(filter)}
                  className={`text-xs font-medium px-3 py-1 rounded-md transition-all whitespace-nowrap
                    ${dateFilter === filter
                      ? "bg-[#02ca3a] text-black shadow-md"
                      : "text-[#ababab] hover:bg-[#444444]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            {dateFilter === "Custom" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-gray-600 text-[#f5f5f5] text-sm focus:outline-none focus:border-gray-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-400 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-400 p-4">
          Failed to load orders. Please try again.
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="p-3">Order No</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Order Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Items</th>
                <th className="p-3">Table No</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const orderType = order.customerDetails?.orderType || "Dine-In";
                const tableNo = order.table?.tableNo;
                const tableId = order.table?._id;
                
                // Attach ref to last item for infinite scroll
                const isLastItem = index === filteredOrders.length - 1;

                return (
                  <tr 
                    key={order._id}
                    ref={isLastItem ? lastOrderRef : null}
                    className="border-b border-gray-600 hover:bg-[#333] transition-colors"
                  >
                    <td className="p-4">{order?.orderNo || "N/A"}</td>
                    <td className="p-4">#{order?.orderId || "N/A"}</td>
                    <td className="p-4">{order.customerDetails?.name || "Guest"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        orderType === "Dine-in" 
                          ? "bg-blue-500/20 text-blue-400" 
                          : orderType === "Delivery"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {orderType}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg focus:outline-none focus:border-gray-400 transition-colors ${getStatusColorClass(order.orderStatus)}`}
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange({
                            orderId: order._id,
                            orderStatus: e.target.value,
                            tableId: tableId,
                            orderType: orderType,
                          })
                        }
                        disabled={
                          orderStatusUpdateMutation.isPending || 
                          deleteOrderMutation.isPending
                        }
                      >
                        <option className="text-yellow-500" value="In Progress">
                          In Progress
                        </option>
                        <option className="text-green-500" value="Ready">
                          Ready
                        </option>
                        <option className="text-blue-500" value="Completed">
                          Completed
                        </option>
                        <option className="text-red-500" value="delete">
                          Delete Order
                        </option>
                      </select>
                    </td>
                    <td className="p-4">{formatDateAndTme(order.createdAt)}</td>
                    <td className="p-4">{order.items?.length || 0} Items</td>
                    <td className="p-4">
                      {orderType === "Dine-in" && tableNo
                        ? `Table - ${tableNo}`
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      BHD {order.bills?.totalWithTax?.toFixed(3) || "0.000"}
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-gray-400 p-8">
                    <div className="flex flex-col items-center">
                      <svg 
                        className="w-16 h-16 text-gray-600 mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                        />
                      </svg>
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {hasActiveFilters 
                          ? "Try adjusting your filters" 
                          : "Orders will appear here once created"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Loading More Indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div>
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && filteredOrders.length > 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              You've reached the end of the list
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;