import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import OrderList from './OrderList';
import { useNavigate } from "react-router-dom";
import { useInfiniteOrders } from '../../hooks/orderData API optimization hooks/useInfiniteOrders';

const RecentOrder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch orders with infinite scroll hook
  const {
    orders,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    lastOrderRef,
  } = useInfiniteOrders({}, true); // Enable auto-fetch to load initial data

  // Client-side filtering for search
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    
    const searchLower = searchQuery.toLowerCase();
    return orders.filter((order) => {
      const customerName = order.customerDetails?.name?.toLowerCase() || '';
      const tableNo = order.table?.tableNo?.toString() || '';  // ← Changed from tableNumber to tableNo
      return (
        customerName.includes(searchLower) || 
        tableNo.includes(searchLower)
      );
    });
  }, [orders, searchQuery]);

  // Show only the most recent 100 orders (or all if less than 100)
  const recentOrders = useMemo(() => {
    return filteredOrders;
  }, [filteredOrders]);


  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <div className="bg-[#1a1a1a] w-full h-auto sm:h-[450px] rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0 scrollbar-hide">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
            Recent Orders
          </h1>
          <button 
            className="text-[#025cca] text-xs sm:text-sm font-semibold hover:underline"
            onClick={() => navigate("/orders")}
          >
            View All
          </button>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-3 sm:gap-4 bg-[#302f2f] rounded-[15px] px-4 sm:px-6 py-2 sm:py-3 mx-4 sm:mx-6">
          <FaSearch className="text-[#f5f5f5] flex-shrink-0" size={16} />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Order List */}
        <div className="mt-3 sm:mt-4 px-4 sm:px-6 overflow-y-auto h-[300px] sm:h-[300px] scrollbar-hide pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#02ca3a] mb-3"></div>
              <p className="text-base sm:text-lg text-gray-400">Loading orders...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-base sm:text-lg text-red-400">Failed to load orders</p>
            </div>
          ) : recentOrders.length > 0 ? (
            <>
              {recentOrders.map((order, index) => {
                const isLastItem = index === recentOrders.length - 1;
                
                return (
                  <div 
                    key={order._id}
                    ref={isLastItem ? lastOrderRef : null}
                  >
                    <OrderList
                      order={{
                        ...order,
                        // Extract orderType from customerDetails and put it at root level
                        orderType: order.customerDetails?.orderType || order.orderType || 'Dine-In',
                        // Ensure table object always exists, even if null
                        table: order.table || { tableNo: null },
                      }}
                    />
                  </div>
                );
              })}
              
              {/* Loading More Indicator */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div>
                </div>
              )}
              
              {/* End of list indicator */}
              {!hasNextPage && recentOrders.length > 0 && (
                <div className="text-center text-gray-500 text-sm py-3">
                  No more orders
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-base sm:text-lg text-gray-400">
                {searchQuery ? 'No matching orders found' : 'No orders available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;