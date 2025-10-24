// import React, { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import OrderList from './OrderList';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { getOrders } from '../../https/index';
// import { useNavigate } from "react-router-dom";

// const RecentOrder = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');

//   const { data: resData, isError, isLoading } = useQuery({
//     queryKey: ['orders'],
//     queryFn: async () => {
//       return await getOrders();
//     },
//     placeholderData: keepPreviousData,
//   });

//   if (isError) {
//     enqueueSnackbar('Something went wrong!', { variant: 'error' });
//   }

//   // Sort orders by date in descending order (newest first)
//   const sortedOrders = resData?.data?.data?.sort((a, b) => {
//     const dateA = new Date(a.createdAt);
//     const dateB = new Date(b.createdAt);
//     return dateB - dateA;
//   });

//   // Filter orders based on the search query (using sortedOrders)
//   const filteredOrders = sortedOrders?.filter((order) => {
//     const searchLower = searchQuery.toLowerCase(); // Normalize search query
//     return (
//       order.customerDetails?.name.toLowerCase().includes(searchLower) ||
//       order.table?.tableNo?.toString().includes(searchLower)
//     );
//   });

//   return (
//     <div className="px-8 mt-6">
//       <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg">
//         <div className="flex justify-between items-center px-6 py-4">
//           <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wider">Recent Orders</h1>
//           <a href="" className="text-[#025cca] text-sm font-semibold"
//             onClick={() => navigate("/orders")}
//           >
//             View All
//           </a>
//         </div>

//         {/* Search Box */}
//         <div className="flex items-center gap-4 bg-[#302f2f] rounded-[15px] px-6 py-3 mx-6">
//           <FaSearch className="text-[#f5f5f5]" />
//           <input
//             type="text"
//             placeholder="Search recent orders"
//             className="bg-[#302f2f] outline-none text-[#f5f5f5] w-full"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Order List */}
//         <div className="mt-4 px-6 overflow-y-scroll h-[300px] hidden-scrollbar">
//           {isLoading ? (
//             <p className="text-lg text-gray-400">Loading orders...</p>
//           ) : filteredOrders?.length > 0 ? (
//             filteredOrders.map((order) => (
//               <OrderList
//                 key={order._id}
//                 order={{
//                   ...order,
//                   orderType: order.orderType || 'Dine-In',
//                   table: order.table || { tableNo: null },
//                 }}
//               />
//             ))
//           ) : (
//             <p className="text-lg text-gray-400">No orders available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentOrder;


import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import OrderList from './OrderList';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { getOrders } from '../../https/index';
import { useNavigate } from "react-router-dom";

const RecentOrder = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar('Something went wrong!', { variant: 'error' });
  }

  const sortedOrders = resData?.data?.data?.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const filteredOrders = sortedOrders?.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.customerDetails?.name.toLowerCase().includes(searchLower) ||
      order.table?.tableNo?.toString().includes(searchLower)
    );
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 ">
      <div className="bg-[#1a1a1a] w-full h-auto sm:h-[450px] rounded-lg ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0 scrollbar-hide">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
            Recent Orders
          </h1>
          <a 
            href="" 
            className="text-[#025cca] text-xs sm:text-sm font-semibold"
            onClick={() => navigate("/orders")}
          >
            View All
          </a>
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
            <p className="text-base sm:text-lg text-gray-400">Loading orders...</p>
          ) : filteredOrders?.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderList
                key={order._id}
                order={{
                  ...order,
                  orderType: order.orderType || 'Dine-In',
                  table: order.table || { tableNo: null },
                }}
              />
            ))
          ) : (
            <p className="text-base sm:text-lg text-gray-400">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;