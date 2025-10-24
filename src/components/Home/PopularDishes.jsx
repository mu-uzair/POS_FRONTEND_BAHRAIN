// import React, { useState, useMemo } from 'react'
// import { popularDishes } from '../../constants'
// import { useQuery } from '@tanstack/react-query'
// import { getOrders, getDishes, getCategories } from '../../https/index'

// const PopularDishes = () => {
//     const [dateFilter, setDateFilter] = useState('All')
//     const [selectedDate, setSelectedDate] = useState('')

//     const { data: ordersRes } = useQuery({
//         queryKey: ['orders'],
//         queryFn: async () => {
//             const res = await getOrders()
//             return res
//         },
//         // keep it simple here; Orders list is small in dev
//     })


//     // Fetch all dishes
//     const { data: dishesRes } = useQuery({
//         queryKey: ['dishes'],
//         queryFn: async () => {
//             const res = await getDishes();
//             return res;
//         },
//         enabled: true,
//     });
//     const dishesArray = dishesRes?.data?.data ?? [];

//     // Fetch all categories
//     const { data: categoriesRes } = useQuery({
//         queryKey: ['categories'],
//         queryFn: async () => {
//             const res = await getCategories();
//             return res;
//         },
//         enabled: true,
//     });
//     const categoriesArray = categoriesRes?.data?.data ?? [];

//     const ordersArray = ordersRes?.data?.data ?? []

//     const filteredOrders = useMemo(() => {
//         const today = new Date().toDateString()
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate() - 1)
//         const yesterdayDate = yesterday.toDateString()

//         // Only include orders with status 'Completed'
//         return ordersArray.filter((order) => {
//             if (!order?.createdAt || order.orderStatus !== 'Completed') return false
//             const orderDate = new Date(order.createdAt).toDateString()
//             switch (dateFilter) {
//                 case 'Today':
//                     return orderDate === today
//                 case 'Yesterday':
//                     return orderDate === yesterdayDate
//                 case 'Custom':
//                     return selectedDate ? orderDate === new Date(selectedDate).toDateString() : true
//                 default:
//                     return true
//             }
//         })
//     }, [ordersArray, dateFilter, selectedDate])

//     // Aggregate dish counts from filtered orders (sum by dish _id only)
//     const aggregatedDishes = useMemo(() => {
//         const map = new Map();

//         filteredOrders.forEach((order) => {
//             (order.items || []).forEach((item) => {
//                 // Always use dish _id as key if possible
//                 const dishId = item._id || item.id;
//                 if (!dishId) return;
//                 const qty = item.quantity ?? 1;

//                 // Always resolve dish details from dishesArray for consistency
//                 const dishObj = dishesArray.find(d => String(d._id) === String(dishId));
//                 const name = dishObj?.dishName || item.name || 'Unknown';
//                 const categoryId = dishObj?.category || dishObj?.categoryId;

//                 if (map.has(dishId)) {
//                     const entry = map.get(dishId);
//                     entry.count += qty;
//                 } else {
//                     map.set(dishId, {
//                         id: dishId,
//                         name,
//                         image: undefined,
//                         count: qty,
//                         categoryId,
//                     });
//                 }
//             });
//         });

//         // Attach image: prefer category.imageUrl, then fallback to dish image, then static popularDishes image
//         const popularByName = new Map(popularDishes.map(d => [d.name?.toLowerCase(), d]));
//         for (const val of map.values()) {
//             // Try to get category image
//             if (val.categoryId) {
//                 const cat = categoriesArray.find(c => String(c._id) === String(val.categoryId));
//                 if (cat && cat.imageUrl) {
//                     val.image = cat.imageUrl;
//                 }
//             }
//             // Fallback to dish image (from static popularDishes)
//             if (!val.image) {
//                 const pd = popularByName.get((val.name || '').toLowerCase());
//                 if (pd) val.image = pd.image;
//             }
//         }

//         const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
//         if (arr.length === 0) return [];
//         return arr;
//     }, [filteredOrders, dishesArray, categoriesArray]);

//     return (
//         <div className='mt-6 pr-6'>
//             <div className='bg-[#1a1a1a] w-full rounded-lg'>
//                 <div className='flex justify-between items-center px-6 py-4'>
//                     <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wider'>Popular Dishes</h1>
//                     <a href="" className='text-[#025cca] text-sm font-semibold'>View All</a>
//                 </div>

//                 {/* Date filter controls */}
//                 <div className='flex items-center gap-3 px-6 pb-4'>
//                     <button
//                         onClick={() => setDateFilter('All')}
//                         className={`text-[#ababab] text-sm ${dateFilter === 'All' && 'bg-[#383838]'} rounded-lg px-3 py-1 font-semibold`}
//                     >
//                         All Dates
//                     </button>

//                     <button
//                         onClick={() => setDateFilter('Today')}
//                         className={`text-[#ababab] text-sm ${dateFilter === 'Today' && 'bg-[#383838]'} rounded-lg px-3 py-1 font-semibold`}
//                     >
//                         Today
//                     </button>

//                     <button
//                         onClick={() => setDateFilter('Yesterday')}
//                         className={`text-[#ababab] text-sm ${dateFilter === 'Yesterday' && 'bg-[#383838]'} rounded-lg px-3 py-1 font-semibold`}
//                     >
//                         Yesterday
//                     </button>

//                     <button
//                         onClick={() => setDateFilter('Custom')}
//                         className={`text-[#ababab] text-sm ${dateFilter === 'Custom' && 'bg-[#383838]'} rounded-lg px-3 py-1 font-semibold`}
//                     >
//                         Custom Date
//                     </button>

//                     {dateFilter === 'Custom' && (
//                         <input
//                             type='date'
//                             value={selectedDate}
//                             onChange={(e) => setSelectedDate(e.target.value)}
//                             className='bg-[#383838] text-[#f5f5f5] rounded-lg px-3 py-1'
//                         />
//                     )}
//                 </div>

//                 <div className='overflow-y-scroll h-[705px] hidden-scrollbar'>
//                     {aggregatedDishes.length === 0 ? (
//                         <div className='flex items-center justify-center h-full text-[#ababab] text-lg font-semibold'>
//                             No records found
//                         </div>
//                     ) : (
//                         aggregatedDishes.map((dish, idx) => {
//                             const displayIndex = (typeof dish.id === 'number') ? (dish.id < 10 ? `0${dish.id}` : dish.id) : idx + 1
//                             return (
//                                 <div key={`${dish.id}-${idx}`} className='flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-4 py-4  mx-6 mb-5'>
//                                     <h1 className='text-[#f5f5f5] font-bold text-xl mr-4'>{displayIndex}</h1>
//                                     {dish.image ? (
//                                         <img src={dish.image} alt={dish.name} className='w-[50px] h-[50px] rounded-full' />
//                                     ) : (
//                                         <div className='w-[50px] h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-sm text-[#ababab]'>Img</div>
//                                     )}
//                                     <div>
//                                         <h1 className='text-[#f5f5f5] font-semibold tracking-wide'>{dish.name}</h1>
//                                         <p className='text-[#f5f5f5] text-sm font-semibold mt-1'>
//                                             <span className='text-[#ababab]'>orders: </span>{dish.count} </p>
//                                     </div>
//                                 </div>
//                             )
//                         })
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PopularDishes



// import React, { useState, useMemo } from 'react';
// import { popularDishes } from '../../constants';
// import { useQuery } from '@tanstack/react-query';
// import { getOrders, getDishes, getCategories } from '../../https/index';

// const PopularDishes = () => {
//   const [dateFilter, setDateFilter] = useState('All');
//   const [selectedDate, setSelectedDate] = useState('');

//   // --- Fetch Orders ---
//   const { data: ordersRes } = useQuery({
//     queryKey: ['orders'],
//     queryFn: getOrders,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   // --- Fetch Dishes ---
//   const { data: dishesRes } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: getDishes,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   // --- Fetch Categories ---
//   const { data: categoriesRes } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//     refetchOnWindowFocus: true,
//     refetchOnMount: true,
//   });

//   // ✅ Normalize response shape (works with both data.data or data)
//   const ordersArray = ordersRes?.data?.data || ordersRes?.data || [];
//   const dishesArray = dishesRes?.data?.data || dishesRes?.data || [];
//   const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];

//   // --- Filter Orders ---
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

//   // --- Aggregate Dishes by Name ---
//   const aggregatedDishes = useMemo(() => {
//     const map = new Map();

//     filteredOrders.forEach((order) => {
//       (order.items || []).forEach((item) => {
//         // Use dish name (case-insensitive, trimmed) as key
//         let dishName = item.name;
//         // Try to resolve from dishesArray if possible
//         if (!dishName) {
//           const dishObj = dishesArray.find(d => String(d._id) === String(item._id || item.id));
//           dishName = dishObj?.dishName;
//         }
//         dishName = (dishName || 'Unknown').trim().toLowerCase();
//         if (!dishName) return;
//         const qty = item.quantity ?? 1;

//         // Find dish info for image/category
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

//     // Attach category or fallback images
//     const popularByName = new Map(
//       popularDishes.map((d) => [d.name?.trim().toLowerCase(), d])
//     );

//     for (const val of map.values()) {
//       // Category image
//       if (val.categoryId && !val.image) {
//         const cat = categoriesArray.find(
//           (c) => String(c._id) === String(val.categoryId)
//         );
//         if (cat?.imageUrl) val.image = cat.imageUrl;
//       }

//       // Fallback to static popularDishes
//       if (!val.image) {
//         const pd = popularByName.get((val.name || '').trim().toLowerCase());
//         if (pd?.image) val.image = pd.image;
//       }
//     }

//     // Sort by order count
//     const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
//     return arr;
//   }, [filteredOrders, dishesArray, categoriesArray]);

//   return (
//     <div className="mt-6 pr-6">
//       <div className="bg-[#1a1a1a] w-full rounded-lg">
//         <div className="flex justify-between items-center px-6 py-4">
//           <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wider">
//             Popular Dishes
//           </h1>
//           <a href="#" className="text-[#025cca] text-sm font-semibold">
//             View All
//           </a>
//         </div>

//         {/* --- Date Filters --- */}
//         <div className="flex items-center gap-3 px-6 pb-4">
//           {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
//             <button
//               key={f}
//               onClick={() => setDateFilter(f)}
//               className={`text-[#ababab] text-sm ${
//                 dateFilter === f ? 'bg-[#383838]' : ''
//               } rounded-lg px-3 py-1 font-semibold`}
//             >
//               {f === 'All' ? 'All Dates' : f}
//             </button>
//           ))}

//           {dateFilter === 'Custom' && (
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="bg-[#383838] text-[#f5f5f5] rounded-lg px-3 py-1"
//             />
//           )}
//         </div>

//         {/* --- Dish List --- */}
//         <div className="overflow-y-scroll h-[705px] hidden-scrollbar">
//           {aggregatedDishes.length === 0 ? (
//             <div className="flex items-center justify-center h-full text-[#ababab] text-lg font-semibold">
//               No records found
//             </div>
//           ) : (
//             aggregatedDishes.map((dish, idx) => (
//               <div
//                 key={dish.id}
//                 className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-4 py-4 mx-6 mb-5"
//               >
//                 <h1 className="text-[#f5f5f5] font-bold text-xl mr-4">
//                   {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
//                 </h1>
//                 {dish.image ? (
//                   <img
//                     src={dish.image}
//                     alt={dish.name}
//                     className="w-[50px] h-[50px] rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-[50px] h-[50px] rounded-full bg-[#383838] flex items-center justify-center text-sm text-[#ababab]">
//                     Img
//                   </div>
//                 )}
//                 <div>
//                   <h1 className="text-[#f5f5f5] font-semibold tracking-wide">
//                     {dish.name}
//                   </h1>
//                   <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
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
import { popularDishes } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import { getOrders, getDishes, getCategories } from '../../https/index';

const PopularDishes = () => {
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  const { data: ordersRes } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { data: dishesRes } = useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const ordersArray = ordersRes?.data?.data || ordersRes?.data || [];
  const dishesArray = dishesRes?.data?.data || dishesRes?.data || [];
  const categoriesArray = categoriesRes?.data?.data || categoriesRes?.data || [];

  const filteredOrders = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toDateString();

    return ordersArray.filter((order) => {
      if (!order?.createdAt || order.orderStatus !== 'Completed') return false;
      const orderDate = new Date(order.createdAt).toDateString();
      switch (dateFilter) {
        case 'Today':
          return orderDate === today;
        case 'Yesterday':
          return orderDate === yesterdayDate;
        case 'Custom':
          return selectedDate
            ? orderDate === new Date(selectedDate).toDateString()
            : true;
        default:
          return true;
      }
    });
  }, [ordersArray, dateFilter, selectedDate]);

  const aggregatedDishes = useMemo(() => {
    const map = new Map();

    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        let dishName = item.name;
        if (!dishName) {
          const dishObj = dishesArray.find(d => String(d._id) === String(item._id || item.id));
          dishName = dishObj?.dishName;
        }
        dishName = (dishName || 'Unknown').trim().toLowerCase();
        if (!dishName) return;
        const qty = item.quantity ?? 1;

        const dishObj = dishesArray.find(d => d.dishName && d.dishName.trim().toLowerCase() === dishName);
        const displayName = dishObj?.dishName || item.name || 'Unknown';
        const categoryId = dishObj?.category || dishObj?.categoryId;
        const imageFromDish = dishObj?.imageUrl || dishObj?.image;

        if (map.has(dishName)) {
          const entry = map.get(dishName);
          entry.count += qty;
        } else {
          map.set(dishName, {
            id: dishName,
            name: displayName,
            count: qty,
            categoryId,
            image: imageFromDish,
          });
        }
      });
    });

    const popularByName = new Map(
      popularDishes.map((d) => [d.name?.trim().toLowerCase(), d])
    );

    for (const val of map.values()) {
      if (val.categoryId && !val.image) {
        const cat = categoriesArray.find(
          (c) => String(c._id) === String(val.categoryId)
        );
        if (cat?.imageUrl) val.image = cat.imageUrl;
      }

      if (!val.image) {
        const pd = popularByName.get((val.name || '').trim().toLowerCase());
        if (pd?.image) val.image = pd.image;
      }
    }

    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return arr;
  }, [filteredOrders, dishesArray, categoriesArray]);

  return (
    <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:pr-6 lg:px-0">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-0">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wider">
            Popular Dishes
          </h1>
          <a href="#" className="text-[#025cca] text-xs sm:text-sm font-semibold">
            View All
          </a>
        </div>

        {/* Date Filters - Scrollable on mobile */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max">
            {['All', 'Today', 'Yesterday', 'Custom'].map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`text-[#ababab] text-xs sm:text-sm ${
                  dateFilter === f ? 'bg-[#383838]' : ''
                } rounded-lg px-2 sm:px-3 py-1 font-semibold whitespace-nowrap`}
              >
                {f === 'All' ? 'All Dates' : f}
              </button>
            ))}

            {dateFilter === 'Custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#383838] text-[#f5f5f5] rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm"
              />
            )}
          </div>
        </div>

        {/* Dish List */}
        <div className="overflow-y-auto h-[400px] sm:h-[500px] lg:h-[705px] scrollbar-hide">
          {aggregatedDishes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#ababab] text-base sm:text-lg font-semibold">
              No records found
            </div>
          ) : (
            aggregatedDishes.map((dish, idx) => (
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
                    {dish.name}
                  </h1>
                  <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
                    <span className="text-[#ababab]">orders: </span>
                    {dish.count}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;