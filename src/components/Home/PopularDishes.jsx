// import React, { useState, useMemo } from 'react';
// import { popularDishes } from '../../constants';
// import { useQuery } from '@tanstack/react-query';
// import { getOrders, getDishes, getCategories } from '../../https/index';

// const PopularDishes = () => {
//   const [dateFilter, setDateFilter] = useState('All');
//   const [selectedDate, setSelectedDate] = useState('');

//   const { data: ordersRes } = useQuery({
//     queryKey: ['orders'],
//     queryFn: getOrders,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   const { data: dishesRes } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: getDishes,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   const { data: categoriesRes } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   const ordersArray = ordersRes?.data?.data || ordersRes?.data || [];
//   const dishesArray = dishesRes?.data?.data || dishesRes?.data || [];
//   const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];

//   const filteredOrders = useMemo(() => {
//     const today = new Date().toDateString();
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayDate = yesterday.toDateString();

//     return ordersArray.filter((order) => {
//       if (!order?.createdAt || order.orderStatus !== 'Completed') return false;
//       const orderDate = new Date(order.createdAt).toDateString();
//       switch (dateFilter) {
//         case 'Today':
//           return orderDate === today;
//         case 'Yesterday':
//           return orderDate === yesterdayDate;
//         case 'Custom':
//           return selectedDate
//             ? orderDate === new Date(selectedDate).toDateString()
//             : true;
//         default:
//           return true;
//       }
//     });
//   }, [ordersArray, dateFilter, selectedDate]);

//   const aggregatedDishes = useMemo(() => {
//     const map = new Map();

//     filteredOrders.forEach((order) => {
//       (order.items || []).forEach((item) => {
//         let dishName = item.name;
//         if (!dishName) {
//           const dishObj = dishesArray.find(d => String(d._id) === String(item._id || item.id));
//           dishName = dishObj?.dishName;
//         }
//         dishName = (dishName || 'Unknown').trim().toLowerCase();
//         if (!dishName) return;
//         const qty = item.quantity ?? 1;

//         const dishObj = dishesArray.find(d => d.dishName && d.dishName.trim().toLowerCase() === dishName);
//         const displayName = dishObj?.dishName || item.name || 'Unknown';
//         const categoryId = dishObj?.category || dishObj?.categoryId;
//         const imageFromDish = dishObj?.imageUrl || dishObj?.image;

//         if (map.has(dishName)) {
//           const entry = map.get(dishName);
//           entry.count += qty;
//         } else {
//           map.set(dishName, {
//             id: dishName,
//             name: displayName,
//             count: qty,
//             categoryId,
//             image: imageFromDish,
//           });
//         }
//       });
//     });

//     const popularByName = new Map(
//       popularDishes.map((d) => [d.name?.trim().toLowerCase(), d])
//     );

//     for (const val of map.values()) {
//       if (val.categoryId && !val.image) {
//         const cat = categoriesArray.find(
//           (c) => String(c._id) === String(val.categoryId)
//         );
//         if (cat?.imageUrl) val.image = cat.imageUrl;
//       }

//       if (!val.image) {
//         const pd = popularByName.get((val.name || '').trim().toLowerCase());
//         if (pd?.image) val.image = pd.image;
//       }
//     }

//     const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
//     return arr;
//   }, [filteredOrders, dishesArray, categoriesArray]);

//   return (
//     <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:pr-6 lg:px-0">
//       <div className="bg-[#1a1a1a] w-full rounded-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
//             Popular Dishes
//           </h1>
//           <a href="#" className="text-[#025cca] text-xs sm:text-sm font-semibold">
//             View All
//           </a>
//         </div>

//         {/* Date Filters - Scrollable on mobile */}
//         <div className="px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
//           <div className="flex items-center gap-2 sm:gap-3 min-w-max">
//             {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setDateFilter(f)}
//                 className={`text-[#ababab] text-xs sm:text-sm ${
//                   dateFilter === f ? 'bg-[#383838]' : ''
//                 } rounded-lg px-2 sm:px-3 py-1 font-semibold whitespace-nowrap`}
//               >
//                 {f === 'All' ? 'All Dates' : f}
//               </button>
//             ))}

//             {dateFilter === 'Custom' && (
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="bg-[#383838] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm"
//               />
//             )}
//           </div>
//         </div>

//         {/* Dish List */}
//         <div className="overflow-y-auto h-[400px] sm:h-[500px] lg:h-[705px] scrollbar-hide">
//           {aggregatedDishes.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-[#ababab] text-base sm:text-lg font-semibold">
//               No records found
//             </div>
//           ) : (
//             aggregatedDishes.map((dish, idx) => (
//               <div
//                 key={dish.id}
//                 className="flex items-center gap-3 sm:gap-4 bg-[#1f1f1f] rounded-[15px] px-3 sm:px-4 py-3 sm:py-4 mx-4 sm:mx-6 mb-3 sm:mb-5"
//               >
//                 <h1 className="text-[#f5f5f5] font-bold text-base sm:text-xl mr-2 sm:mr-4 flex-shrink-0">
//                   {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
//                 </h1>
//                 {dish.image ? (
//                   <img
//                     src={dish.image}
//                     alt={dish.name}
//                     className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full object-cover flex-shrink-0"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-xs sm:text-sm text-[#ababab] flex-shrink-0">
//                     Img
//                   </div>
//                 )}
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base truncate">
//                     {dish.name}
//                   </h1>
//                   <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
//                     <span className="text-[#ababab]">orders: </span>
//                     {dish.count}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopularDishes;


// import React, { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getDishes, getCategories, getPopularDishes } from '../../https/index';
// import { popularDishes as fallbackDishes } from '../../constants';

// const PopularDishes = () => {
//   const [dateFilter, setDateFilter] = useState('All');
//   const [selectedDate, setSelectedDate] = useState('');

//   // Calculate date parameters based on filter
//   const { dateRange, startDate, endDate } = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     switch (dateFilter) {
//       case 'Today': {
//         const endOfDay = new Date(today);
//         endOfDay.setHours(23, 59, 59, 999);
//         return {
//           startDate: today.toISOString(),
//           endDate: endOfDay.toISOString(),
//           dateRange: null
//         };
//       }
//       case 'Yesterday': {
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const endOfYesterday = new Date(yesterday);
//         endOfYesterday.setHours(23, 59, 59, 999);
//         return {
//           startDate: yesterday.toISOString(),
//           endDate: endOfYesterday.toISOString(),
//           dateRange: null
//         };
//       }
//       case 'Custom': {
//         if (selectedDate) {
//           const selected = new Date(selectedDate);
//           selected.setHours(0, 0, 0, 0);
//           const endOfSelected = new Date(selected);
//           endOfSelected.setHours(23, 59, 59, 999);
//           return {
//             startDate: selected.toISOString(),
//             endDate: endOfSelected.toISOString(),
//             dateRange: null
//           };
//         }
//         return { dateRange: 30, startDate: null, endDate: null };
//       }
//       default: // 'All'
//         return { dateRange: 365, startDate: null, endDate: null };
//     }
//   }, [dateFilter, selectedDate]);

//   // Fetch popular dishes
//   const { data: popularDishesData, isLoading, isError } = useQuery({
//     queryKey: ['popular-dishes', dateFilter, selectedDate, dateRange, startDate, endDate],
//     queryFn: () => getPopularDishes(50, dateRange, startDate, endDate),
//     staleTime: 60000,
//     refetchOnWindowFocus: false,
//   });

//   // Still fetch dishes and categories for images
//   const { data: dishesRes } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: getDishes,
//     staleTime: 300000, // 5 minutes
//   });

//   const { data: categoriesRes } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//     staleTime: 300000, // 5 minutes
//   });

//   const dishesArray = dishesRes?.data?.data || dishesRes?.data || [];
//   const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];
//   const dishes = popularDishesData?.data || [];

//   // Enrich dishes with images
//   const enrichedDishes = useMemo(() => {
//     const popularByName = new Map(
//       fallbackDishes.map((d) => [d.name?.trim().toLowerCase(), d])
//     );

//     return dishes.map((dish) => {
//       const dishName = dish.name?.trim().toLowerCase();
      
//       // Try to find image from dishes array
//       const dishObj = dishesArray.find(
//         d => d.dishName && d.dishName.trim().toLowerCase() === dishName
//       );
      
//       let image = dishObj?.imageUrl || dishObj?.image;

//       // If no image, try category image
//       if (!image && dishObj?.category) {
//         const cat = categoriesArray.find(
//           (c) => String(c._id) === String(dishObj.category)
//         );
//         if (cat?.imageUrl) image = cat.imageUrl;
//       }

//       // If still no image, try fallback
//       if (!image) {
//         const fallback = popularByName.get(dishName);
//         if (fallback?.image) image = fallback.image;
//       }

//       // Create display name with variation
//       const displayName = dish.variation 
//         ? `${dish.name} (${dish.variation})`
//         : dish.name;

//       return {
//         id: `${dishName}-${dish.variation || 'default'}`,
//         name: dish.name,
//         variation: dish.variation,
//         displayName,
//         count: dish.totalQuantity,
//         totalOrders: dish.totalOrders,
//         revenue: dish.totalRevenue,
//         image,
//       };
//     });
//   }, [dishes, dishesArray, categoriesArray]);

//   return (
//     <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:pr-6 lg:px-0">
//       <div className="bg-[#1a1a1a] w-full rounded-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
//           <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
//             Popular Dishes
//           </h1>
//           <a href="#" className="text-[#025cca] text-xs sm:text-sm font-semibold">
//             View All
//           </a>
//         </div>

//         {/* Date Filters - Scrollable on mobile */}
//         <div className="px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
//           <div className="flex items-center gap-2 sm:gap-3 min-w-max">
//             {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setDateFilter(f)}
//                 className={`text-[#ababab] text-xs sm:text-sm ${
//                   dateFilter === f ? 'bg-[#383838]' : ''
//                 } rounded-lg px-2 sm:px-3 py-1 font-semibold whitespace-nowrap`}
//               >
//                 {f === 'All' ? 'All Dates' : f}
//               </button>
//             ))}

//             {dateFilter === 'Custom' && (
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="bg-[#383838] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm"
//               />
//             )}
//           </div>
//         </div>

//         {/* Dish List */}
//         <div className="overflow-y-auto h-[400px] sm:h-[500px] lg:h-[705px] scrollbar-hide">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mb-4"></div>
//               <p className="text-[#ababab] text-sm">Loading popular dishes...</p>
//             </div>
//           ) : isError ? (
//             <div className="flex items-center justify-center h-full text-red-400 text-base sm:text-lg font-semibold">
//               Failed to load dishes
//             </div>
//           ) : enrichedDishes.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-[#ababab] text-base sm:text-lg font-semibold">
//               No records found
//             </div>
//           ) : (
//             enrichedDishes.map((dish, idx) => (
//               <div
//                 key={dish.id}
//                 className="flex items-center gap-3 sm:gap-4 bg-[#1f1f1f] rounded-[15px] px-3 sm:px-4 py-3 sm:py-4 mx-4 sm:mx-6 mb-3 sm:mb-5"
//               >
//                 <h1 className="text-[#f5f5f5] font-bold text-base sm:text-xl mr-2 sm:mr-4 flex-shrink-0">
//                   {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
//                 </h1>
//                 {dish.image ? (
//                   <img
//                     src={dish.image}
//                     alt={dish.name}
//                     className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full object-cover flex-shrink-0"
//                   />
//                 ) : (
//                   <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-xs sm:text-sm text-[#ababab] flex-shrink-0">
//                     Img
//                   </div>
//                 )}
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base truncate">
//                     {dish.displayName}
//                   </h1>
//                   <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
//                     <span className="text-[#ababab]">orders: </span>
//                     {dish.count}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopularDishes;


import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { getDishes, getCategories, getPopularDishes } from '../../https/index';
import { popularDishes as fallbackDishes } from '../../constants';
import { useOfflineMode } from '../../constants/OfflineModeContext';
import { OfflineError } from '../../utils/smartRequest';

const PopularDishes = () => {
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Get offline status
  const { isOfflineMode } = useOfflineMode();

  // Calculate date parameters based on filter
  const { dateRange, startDate, endDate } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'Today': {
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        return {
          startDate: today.toISOString(),
          endDate: endOfDay.toISOString(),
          dateRange: null
        };
      }
      case 'Yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return {
          startDate: yesterday.toISOString(),
          endDate: endOfYesterday.toISOString(),
          dateRange: null
        };
      }
      case 'Custom': {
        if (selectedDate) {
          const selected = new Date(selectedDate);
          selected.setHours(0, 0, 0, 0);
          const endOfSelected = new Date(selected);
          endOfSelected.setHours(23, 59, 59, 999);
          return {
            startDate: selected.toISOString(),
            endDate: endOfSelected.toISOString(),
            dateRange: null
          };
        }
        return { dateRange: 30, startDate: null, endDate: null };
      }
      default: // 'All'
        return { dateRange: 365, startDate: null, endDate: null };
    }
  }, [dateFilter, selectedDate]);

  // Fetch popular dishes
  const { 
    data: popularDishesData, 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['popular-dishes', dateFilter, selectedDate, dateRange, startDate, endDate],
    queryFn: () => getPopularDishes(50, dateRange, startDate, endDate),
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry if offline
  });

  // Still fetch dishes and categories for images
  const { data: dishesRes } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    staleTime: 300000,
    retry: false,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 300000,
    retry: false,
  });

  const dishesArray = dishesRes?.data?.data || dishesRes?.data || [];
  const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];
  const dishes = popularDishesData?.data || [];

  // Check if error is due to offline mode
  const isOfflineError = error instanceof OfflineError || error?.isOffline;

  // Enrich dishes with images
  const enrichedDishes = useMemo(() => {
    const popularByName = new Map(
      fallbackDishes.map((d) => [d.name?.trim().toLowerCase(), d])
    );

    return dishes.map((dish) => {
      const dishName = dish.name?.trim().toLowerCase();
      
      // Try to find image from dishes array
      const dishObj = dishesArray.find(
        d => d.dishName && d.dishName.trim().toLowerCase() === dishName
      );
      
      let image = dishObj?.imageUrl || dishObj?.image;

      // If no image, try category image
      if (!image && dishObj?.category) {
        const cat = categoriesArray.find(
          (c) => String(c._id) === String(dishObj.category)
        );
        if (cat?.imageUrl) image = cat.imageUrl;
      }

      // If still no image, try fallback
      if (!image) {
        const fallback = popularByName.get(dishName);
        if (fallback?.image) image = fallback.image;
      }

      // Create display name with variation
      const displayName = dish.variation 
        ? `${dish.name} (${dish.variation})`
        : dish.name;

      return {
        id: `${dishName}-${dish.variation || 'default'}`,
        name: dish.name,
        variation: dish.variation,
        displayName,
        count: dish.totalQuantity,
        totalOrders: dish.totalOrders,
        revenue: dish.totalRevenue,
        image,
      };
    });
  }, [dishes, dishesArray, categoriesArray]);

  return (
    <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:pr-6 lg:px-0">
      <div className="bg-[#1a1a1a] w-full rounded-lg relative">
        {/* Offline Badge */}
        {isOfflineMode && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-3 py-1">
              <FaWifi className="text-orange-400" size={12} />
              <span className="text-orange-400 text-xs font-semibold">
                Offline
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
              Popular Dishes
            </h1>
            {isOfflineMode && (
              <span className="text-orange-400 text-xs">
                (Offline)
              </span>
            )}
          </div>
          <a 
            href="#" 
            className={`text-[#025cca] text-xs sm:text-sm font-semibold ${
              isOfflineMode ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
            }`}
            onClick={(e) => {
              if (isOfflineMode) {
                e.preventDefault();
              }
            }}
            title={isOfflineMode ? "Not available in offline mode" : ""}
          >
            View All
          </a>
        </div>

        {/* Date Filters - Disabled when offline */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
              <button
                key={f}
                onClick={() => !isOfflineMode && setDateFilter(f)}
                disabled={isOfflineMode}
                className={`text-[#ababab] text-xs sm:text-sm ${
                  dateFilter === f ? 'bg-[#383838]' : ''
                } rounded-lg px-2 sm:px-3 py-1 font-semibold whitespace-nowrap transition-opacity ${
                  isOfflineMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title={isOfflineMode ? "Filter not available offline" : ""}
              >
                {f === 'All' ? 'All Dates' : f}
              </button>
            ))}

            {dateFilter === 'Custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => !isOfflineMode && setSelectedDate(e.target.value)}
                disabled={isOfflineMode}
                className={`bg-[#383838] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                  isOfflineMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            )}
          </div>
        </div>

        {/* Dish List */}
        <div className="overflow-y-auto h-[400px] sm:h-[500px] lg:h-[705px] scrollbar-hide">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mb-4"></div>
              <p className="text-[#ababab] text-sm">
                {isOfflineMode ? 'Loading cached data...' : 'Loading popular dishes...'}
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              {isOfflineError || isOfflineMode ? (
                // Offline Mode Error
                <>
                  <div className="mb-6 p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl max-w-md">
                    <div className="flex flex-col items-center gap-4">
                      <FaWifi className="text-orange-400 text-5xl" />
                      <div className="text-center">
                        <h3 className="text-orange-400 text-lg font-bold mb-2">
                          Offline Mode
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          Analytics data requires an internet connection.
                        </p>
                        <p className="text-gray-400 text-xs">
                          Popular dishes will be available once you're back online.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Helpful Tips */}
                  <div className="max-w-md p-4 bg-[#252525] rounded-lg">
                    <p className="text-gray-400 text-xs text-center">
                      💡 <span className="font-semibold">Tip:</span> Other features like viewing orders and tables still work offline with cached data.
                    </p>
                  </div>
                </>
              ) : (
                // Regular Error
                <>
                  <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
                  <p className="text-red-400 text-base sm:text-lg font-semibold mb-2">
                    Failed to load dishes
                  </p>
                  <p className="text-gray-400 text-sm text-center px-4">
                    Please try again later
                  </p>
                </>
              )}
            </div>
          ) : enrichedDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-gray-400 text-4xl">
                {isOfflineMode ? '📦' : '📊'}
              </div>
              <p className="text-[#ababab] text-base sm:text-lg font-semibold">
                {isOfflineMode ? 'No cached data available' : 'No records found'}
              </p>
              {isOfflineMode && (
                <p className="text-gray-500 text-sm text-center px-4">
                  Analytics will be available when you're online
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Offline Warning Banner - Only show if showing cached data */}
              {isOfflineMode && enrichedDishes.length > 0 && (
                <div className="mx-4 sm:mx-6 mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FaWifi className="text-orange-400 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-orange-400 text-sm font-semibold">
                        Viewing Cached Analytics
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Data may be outdated. Connect to internet for latest statistics.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {enrichedDishes.map((dish, idx) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 sm:gap-4 bg-[#1f1f1f] rounded-[15px] px-3 sm:px-4 py-3 sm:py-4 mx-4 sm:mx-6 mb-3 sm:mb-5"
                >
                  <h1 className="text-[#f5f5f5] font-bold text-base sm:text-xl mr-2 sm:mr-4 flex-shrink-0">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </h1>
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-xs sm:text-sm text-[#ababab] flex-shrink-0">
                      Img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base truncate">
                      {dish.displayName}
                    </h1>
                    <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
                      <span className="text-[#ababab]">orders: </span>
                      {dish.count}
                    </p>
                  </div>
                  {isOfflineMode && (
                    <div className="flex-shrink-0">
                      <span className="text-orange-400 text-xs px-2 py-1 bg-orange-500/10 rounded-full">
                        Cached
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;