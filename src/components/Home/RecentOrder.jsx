// import React, { useState, useMemo, useEffect } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import OrderList from './OrderList';
// import { useNavigate } from "react-router-dom";
// import { useInfiniteOrders } from '../../hooks/orderData API optimization hooks/useInfiniteOrders';

// // ✅ Import offline mode context and cache functions
// import { useOfflineMode } from '../../constants/OfflineModeContext';
// import { getCachedOrders } from '../../utils/getOrdersOffline';

// const RecentOrder = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');

//   // ✅ Get offline mode state
//   const { isOfflineMode } = useOfflineMode();

//   // ✅ State for cached orders
//   const [cachedOrders, setCachedOrders] = useState([]);

//   // Fetch orders with infinite scroll hook (only when online)
//   const {
//     orders,
//     isLoading,
//     isError,
//     isFetchingNextPage,
//     hasNextPage,
//     lastOrderRef,
//   } = useInfiniteOrders({}, !isOfflineMode); // ✅ Disable when offline

//   // ✅ Load cached orders when offline
//   useEffect(() => {
//     const loadCachedOrders = async () => {
//       if (!isOfflineMode) {
//         setCachedOrders([]);
//         return;
//       }

//       try {
//         const cached = await getCachedOrders();
//         setCachedOrders(cached);
//       } catch (error) {
//         console.error('❌ Failed to load cached orders:', error);
//         setCachedOrders([]);
//       }
//     };

//     loadCachedOrders();

//     // Refresh cached orders every 5 seconds when offline
//     const interval = isOfflineMode 
//       ? setInterval(loadCachedOrders, 5000) 
//       : null;

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isOfflineMode]);

//   // ✅ Use cached orders when offline, otherwise use API orders
//   const allOrders = isOfflineMode ? cachedOrders : orders;

//   // Client-side filtering for search
//   const filteredOrders = useMemo(() => {
//     if (!searchQuery) return allOrders;
    
//     const searchLower = searchQuery.toLowerCase();
//     return allOrders.filter((order) => {
//       const customerName = order.customerDetails?.name?.toLowerCase() || '';
//       const tableNo = order.table?.tableNo?.toString() || '';
//       return (
//         customerName.includes(searchLower) || 
//         tableNo.includes(searchLower)
//       );
//     });
//   }, [allOrders, searchQuery]);

//   // Show recent orders
//   const recentOrders = useMemo(() => {
//     return filteredOrders;
//   }, [filteredOrders]);


  

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
//       <div className="bg-[#1a1a1a] w-full h-auto sm:h-[450px] rounded-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0 scrollbar-hide">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
//             Recent Orders
//           </h1>
//           <button 
//             className="text-[#025cca] text-xs sm:text-sm font-semibold hover:underline"
//             onClick={() => navigate("/orders")}
//           >
//             View All
//           </button>
//         </div>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 sm:gap-4 bg-[#302f2f] rounded-[15px] px-4 sm:px-6 py-2 sm:py-3 mx-4 sm:mx-6">
//           <FaSearch className="text-[#f5f5f5] flex-shrink-0" size={16} />
//           <input
//             type="text"
//             placeholder="Search recent orders"
//             className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full text-sm sm:text-base"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Order List */}
//         <div className="mt-3 sm:mt-4 px-4 sm:px-6 overflow-y-auto h-[300px] sm:h-[300px] scrollbar-hide pb-4">
//           {isLoading && !isOfflineMode ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#02ca3a] mb-3"></div>
//               <p className="text-base sm:text-lg text-gray-400">Loading orders...</p>
//             </div>
//           ) : isError && !isOfflineMode ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-base sm:text-lg text-red-400">Failed to load orders</p>
//             </div>
//           ) : recentOrders.length > 0 ? (
//             <>
//               {recentOrders.map((order, index) => {
//                 const isLastItem = index === recentOrders.length - 1;
                
//                 return (
//                   <div 
//                     key={order._id || order.orderId || order.tempId || index}
//                     ref={isLastItem && !isOfflineMode ? lastOrderRef : null}
//                   >
//                     <OrderList
//                       order={{
//                         ...order,
//                         orderType: order.customerDetails?.orderType || order.orderType || 'Dine-In',
//                         table: order.table || { tableNo: null },
//                       }}
//                     />
//                   </div>
//                 );
//               })}
              
//               {/* Loading More Indicator (only when online) */}
//               {isFetchingNextPage && !isOfflineMode && (
//                 <div className="flex justify-center py-4">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div>
//                 </div>
//               )}
              
//               {/* End of list indicator (only when online) */}
//               {!hasNextPage && !isOfflineMode && recentOrders.length > 0 && (
//                 <div className="text-center text-gray-500 text-sm py-3">
//                   No more orders
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-base sm:text-lg text-gray-400">
//                 {searchQuery ? 'No matching orders found' : 'No orders available'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentOrder;


// import React, { useState, useMemo, useEffect } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import OrderList from './OrderList';
// import { useNavigate } from "react-router-dom";
// import { useInfiniteOrders } from '../../hooks/orderData API optimization hooks/useInfiniteOrders';

// // ✅ Import offline mode context and cache functions
// import { useOfflineMode } from '../../constants/OfflineModeContext';
// import { getCachedOrders } from '../../utils/getOrdersOffline';

// const RecentOrder = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');

//   // ✅ Get offline mode state
//   const { isOfflineMode } = useOfflineMode();

//   // ✅ State for cached orders
//   const [cachedOrders, setCachedOrders] = useState([]);

//   // Fetch orders with infinite scroll hook (only when online)
//   const {
//     orders,
//     isLoading,
//     isError,
//     isFetchingNextPage,
//     hasNextPage,
//     lastOrderRef,
//   } = useInfiniteOrders({}, !isOfflineMode); // ✅ Disable when offline

//   // ✅ Load cached orders when offline
//   useEffect(() => {
//     const loadCachedOrders = async () => {
//       if (!isOfflineMode) {
//         setCachedOrders([]);
//         return;
//       }

//       try {
//         const cached = await getCachedOrders();
//         setCachedOrders(cached);
//       } catch (error) {
//         console.error('❌ Failed to load cached orders:', error);
//         setCachedOrders([]);
//       }
//     };

//     loadCachedOrders();

//     // Refresh cached orders every 5 seconds when offline
//     const interval = isOfflineMode 
//       ? setInterval(loadCachedOrders, 5000) 
//       : null;

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isOfflineMode]);

//   // ✅ Use cached orders when offline, otherwise use API orders
//   const allOrders = isOfflineMode ? cachedOrders : orders;

//   // Client-side filtering for search
//   const filteredOrders = useMemo(() => {
//     if (!searchQuery) return allOrders;
    
//     const searchLower = searchQuery.toLowerCase();
//     return allOrders.filter((order) => {
//       const customerName = order.customerDetails?.name?.toLowerCase() || '';
//       const tableNo = order.table?.tableNo?.toString() || '';
//       return (
//         customerName.includes(searchLower) || 
//         tableNo.includes(searchLower)
//       );
//     });
//   }, [allOrders, searchQuery]);

//   // Show recent orders
//   const recentOrders = useMemo(() => filteredOrders, [filteredOrders]);

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
//       <div className="bg-[#1a1a1a] w-full h-auto sm:h-[450px] rounded-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0 scrollbar-hide">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
//             Recent Orders
//           </h1>
//           <button 
//             className="text-[#025cca] text-xs sm:text-sm font-semibold hover:underline"
//             onClick={() => navigate("/orders")}
//           >
//             View All
//           </button>
//         </div>

//         {/* Search Box */}
//         <div className="flex items-center gap-3 sm:gap-4 bg-[#302f2f] rounded-[15px] px-4 sm:px-6 py-2 sm:py-3 mx-4 sm:mx-6">
//           <FaSearch className="text-[#f5f5f5] flex-shrink-0" size={16} />
//           <input
//             type="text"
//             placeholder="Search recent orders"
//             className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full text-sm sm:text-base"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Order List */}
//         <div className="mt-3 sm:mt-4 px-4 sm:px-6 overflow-y-auto h-[300px] sm:h-[300px] scrollbar-hide pb-4">
//           {isLoading && !isOfflineMode ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#02ca3a] mb-3"></div>
//               <p className="text-base sm:text-lg text-gray-400">Loading orders...</p>
//             </div>
//           ) : isError && !isOfflineMode ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-base sm:text-lg text-red-400">Failed to load orders</p>
//             </div>
//           ) : recentOrders.length > 0 ? (
//             <>
//               {recentOrders.map((order, index) => {
//                 const isLastItem = index === recentOrders.length - 1;

//                 // ✅ Resolve orderType based on offline/online mode
//                 // const resolvedOrderType = isOfflineMode
//                 //   ? order.customerDetails?.orderType || order.orderType
//                 //   : order.orderType || order.customerDetails?.orderType;
//                 //   console.log('Resolved Order Type:', resolvedOrderType);
//                 // ✅ Resolve orderType - check both locations regardless of mode
//                 const resolvedOrderType = order.orderType || order.customerDetails?.orderType;
//                 console.log('Resolved Order Type:', resolvedOrderType, 'Order ID:', order._id || order.orderId);

//                 return (
//                   <div 
//                     key={order._id || order.orderId || order.tempId || index}
//                     ref={isLastItem && !isOfflineMode ? lastOrderRef : null}
//                   >
//                     <OrderList
//                       order={{
//                         ...order,
//                         orderType: resolvedOrderType,
//                         table: order.table, // use cached value directly
//                       }}
//                     />
//                   </div>
//                 );
//               })}

//               {/* Loading More Indicator (only when online) */}
//               {isFetchingNextPage && !isOfflineMode && (
//                 <div className="flex justify-center py-4">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div>
//                 </div>
//               )}

//               {/* End of list indicator (only when online) */}
//               {!hasNextPage && !isOfflineMode && recentOrders.length > 0 && (
//                 <div className="text-center text-gray-500 text-sm py-3">
//                   No more orders
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-base sm:text-lg text-gray-400">
//                 {searchQuery ? 'No matching orders found' : 'No orders available'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentOrder;




import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import OrderList from './OrderList';
import { useNavigate } from "react-router-dom";
import { useInfiniteOrders } from '../../hooks/orderData API optimization hooks/useInfiniteOrders';

// ✅ Import offline mode context and cache functions
import { useOfflineMode } from '../../constants/OfflineModeContext';
import { getCachedOrders } from '../../utils/getOrdersOffline';

const RecentOrder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Get offline mode state
  const { isOfflineMode } = useOfflineMode();

  // ✅ State for cached orders
  const [cachedOrders, setCachedOrders] = useState([]);

  // Fetch orders with infinite scroll hook (only when online)
  const {
    orders,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    lastOrderRef,
  } = useInfiniteOrders({}, !isOfflineMode); // ✅ Disable when offline

  // ✅ Load cached orders when offline
  useEffect(() => {
    const loadCachedOrders = async () => {
      if (!isOfflineMode) {
        setCachedOrders([]);
        return;
      }

      try {
        const cached = await getCachedOrders();
        console.log('📦 Loaded cached orders:', cached);
        setCachedOrders(cached);
      } catch (error) {
        console.error('❌ Failed to load cached orders:', error);
        setCachedOrders([]);
      }
    };

    loadCachedOrders();

    // Refresh cached orders every 5 seconds when offline
    const interval = isOfflineMode 
      ? setInterval(loadCachedOrders, 5000) 
      : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOfflineMode]);

  // ✅ Use cached orders when offline, otherwise use API orders
  // ✅ Deduplicate orders based on orderId or _id
  const allOrders = useMemo(() => {
    const ordersToUse = isOfflineMode ? cachedOrders : orders;
    
    console.log('🔄 Processing orders - Mode:', isOfflineMode ? 'OFFLINE' : 'ONLINE');
    console.log('🔄 Orders count:', ordersToUse.length);
    
    // Remove duplicates by creating a Map with orderId/_id as key
    const uniqueOrdersMap = new Map();
    ordersToUse.forEach(order => {
      const key = order.orderId || order._id || order.tempId;
      if (key && !uniqueOrdersMap.has(key)) {
        uniqueOrdersMap.set(key, order);
      }
    });
    
    const uniqueOrders = Array.from(uniqueOrdersMap.values());
    console.log('✅ Unique orders count:', uniqueOrders.length);
    
    return uniqueOrders;
  }, [isOfflineMode, cachedOrders, orders]);

  // Client-side filtering for search
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return allOrders;
    
    const searchLower = searchQuery.toLowerCase();
    return allOrders.filter((order) => {
      const customerName = order.customerDetails?.name?.toLowerCase() || '';
      const tableNo = order.table?.tableNo?.toString() || '';
      return (
        customerName.includes(searchLower) || 
        tableNo.includes(searchLower)
      );
    });
  }, [allOrders, searchQuery]);

  // Show recent orders
  const recentOrders = useMemo(() => filteredOrders, [filteredOrders]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <div className="bg-[#1a1a1a] w-full h-auto sm:h-[450px] rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0 scrollbar-hide">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
            Recent Orders {isOfflineMode && '(Offline Mode)'}
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
          {isLoading && !isOfflineMode ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#02ca3a] mb-3"></div>
              <p className="text-base sm:text-lg text-gray-400">Loading orders...</p>
            </div>
          ) : isError && !isOfflineMode ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-base sm:text-lg text-red-400">Failed to load orders</p>
            </div>
          ) : recentOrders.length > 0 ? (
            <>
              {recentOrders.map((order, index) => {
                const isLastItem = index === recentOrders.length - 1;

                // ✅ COMPREHENSIVE DEBUG LOGGING
                console.log('\n==========================================');
                console.log('🔍 ORDER DEBUG - Index:', index);
                console.log('📋 Order ID:', order._id || order.orderId || order.tempId);
                console.log('🌐 Mode:', isOfflineMode ? '🔴 OFFLINE' : '🟢 ONLINE');
                console.log('---');
                console.log('📍 order.orderType:', order.orderType);
                console.log('📍 order.customerDetails?.orderType:', order.customerDetails?.orderType);
                console.log('---');
                console.log('👤 Customer Details:', JSON.stringify(order.customerDetails, null, 2));
                console.log('🪑 Table:', JSON.stringify(order.table, null, 2));
                console.log('---');
                console.log('📦 FULL ORDER:', JSON.stringify(order, null, 2));
                
                // ✅ Resolve orderType - check both locations
                const resolvedOrderType = order.orderType || order.customerDetails?.orderType;
                
                console.log('---');
                console.log('✅ FINAL RESOLVED ORDER TYPE:', resolvedOrderType);
                console.log('==========================================\n');

                return (
                  <div 
                    key={order._id || order.orderId || order.tempId || index}
                    ref={isLastItem && !isOfflineMode ? lastOrderRef : null}
                  >
                    <OrderList
                      order={{
                        ...order,
                        orderType: resolvedOrderType,
                        table: order.table,
                      }}
                    />
                  </div>
                );
              })}

              {/* Loading More Indicator (only when online) */}
              {isFetchingNextPage && !isOfflineMode && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02ca3a]"></div>
                </div>
              )}

              {/* End of list indicator (only when online) */}
              {!hasNextPage && !isOfflineMode && recentOrders.length > 0 && (
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