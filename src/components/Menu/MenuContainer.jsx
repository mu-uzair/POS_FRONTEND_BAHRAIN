// import React, { useState, useEffect } from 'react';
// import { GrRadialSelected } from 'react-icons/gr';
// import { GiShoppingCart } from 'react-icons/gi';
// import { useDispatch } from 'react-redux';
// import { addItems } from '../../redux/slice/cartSlice';
// import { v4 as uuidv4 } from 'uuid';
// import { useQuery } from '@tanstack/react-query';
// import { getCategories, getDishes } from '../../https';
// import { enqueueSnackbar } from 'notistack';
// import { fetchInitialData, getCachedInitialData } from '../../utils/offlineMenu';
// import { useOfflineMode } from '../../constants/OfflineModeContext'; // ← USE THIS

// // Helper function to ensure unique keys
// const ensureUniqueKey = (id, index, prefix = '') => {
//   if (!id || typeof id !== 'string' || id.length < 3) {
//     console.warn(`⚠️ Invalid ID detected: "${id}" at index ${index}`);
//     return `${prefix}fallback-${index}-${uuidv4()}`;
//   }
//   return `${prefix}${id}`;
// };

// // Helper function for background colors
// const getBgColor = (index) => {
//   const colors = [
//     '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
//     '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe'
//   ];
//   return colors[index % colors.length];
// };

// const MenuContainer = () => {
//   const dispatch = useDispatch();
  
//   // 🎯 USE OFFLINE CONTEXT (THE KEY FIX)
//   const { isOfflineMode, hasInternetConnection } = useOfflineMode();

//   // States for custom dish
//   const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
//   const [customDishName, setCustomDishName] = useState("");
//   const [customDishPrice, setCustomDishPrice] = useState("");
//   const [selectedCustomDish, setSelectedCustomDish] = useState(null);

//   // States
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [allDishes, setAllDishes] = useState([]);
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [itemCounts, setItemCounts] = useState({});
//   const [categoryItemCounts, setCategoryItemCounts] = useState({});
//   const [selectedVariations, setSelectedVariations] = useState({});
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState("");

//   // Cached data states
//   const [cachedCategories, setCachedCategories] = useState([]);
//   const [cachedDishes, setCachedDishes] = useState([]);
//   const [isLoadingOffline, setIsLoadingOffline] = useState(false);

//   // Custom category ID
//   const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993"; // Bahrain
//   // const CUSTOM_CATEGORY_ID = "690e722d3987e6cf3a2d52e1"; // Demo

//   // 🎯 Load cached data when offline
//   useEffect(() => {
//     async function loadCachedData() {
//       if (isOfflineMode) {
//         setIsLoadingOffline(true);
//         try {
//           const { categories: cached_cats, dishes: cached_dishes } = await getCachedInitialData();
//           setCachedCategories(cached_cats);
//           setCachedDishes(cached_dishes);
//           console.log(`📦 Loaded ${cached_cats.length} cached categories and ${cached_dishes.length} cached dishes`);
//         } catch (error) {
//           console.error("Error loading cached menu data:", error);
//         } finally {
//           setIsLoadingOffline(false);
//         }
//       }
//     }

//     loadCachedData();
//   }, [isOfflineMode]);

//   // Fetch categories
//   const { 
//     data: categoriesResponse, 
//     isError: isCategoriesError, 
//     isLoading: isCategoriesLoading, 
//     refetch: refetchCategories 
//   } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await getCategories();
      
//       // Cache categories in background when online
//       if (!isOfflineMode && hasInternetConnection) {
//         fetchInitialData().catch(err => 
//           console.warn("Failed to cache menu data in background:", err)
//         );
//       }
      
//       if (Array.isArray(response.data)) return response.data;
//       if (Array.isArray(response.data?.data)) return response.data.data;
//       return [];
//     },
//     onError: () => {
//       if (!isOfflineMode) {
//         enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
//       }
//     },
//     enabled: !isOfflineMode, // ← Only fetch when ONLINE
//   });

//   // 🎯 Use online or cached categories
//   const categories = !isOfflineMode 
//     ? (Array.isArray(categoriesResponse) ? categoriesResponse : [])
//     : cachedCategories;

//   // Fetch dishes
//   const { 
//     data: dishes, 
//     isError: isDishesError, 
//     isLoading: isDishesLoading, 
//     refetch: refetchDishes 
//   } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: async () => {
//       const response = await getDishes();

//       const convertedDishes = (response.data.data || []).map((dish) => ({
//         ...dish,
//         variations: dish.variations?.map((v) => ({
//           ...v,
//         })) || [],
//       }));

//       setAllDishes(convertedDishes);
//       return convertedDishes;
//     },
//     enabled: !isOfflineMode, // ← Only fetch when ONLINE
//   });

//   // 🎯 Use online or cached dishes
//   useEffect(() => {
//     if (!isOfflineMode && dishes) {
//       setAllDishes(dishes);
//     } else if (isOfflineMode && cachedDishes.length > 0) {
//       setAllDishes(cachedDishes);
//     }
//   }, [isOfflineMode, dishes, cachedDishes]);

//   // 🎯 Refetch when coming back online
//   useEffect(() => {
//     if (!isOfflineMode && hasInternetConnection) {
//       refetchCategories();
//       refetchDishes();
//     }
//   }, [isOfflineMode, hasInternetConnection]);

//   // Debug categories for duplicate IDs
//   useEffect(() => {
//     if (categories.length > 0) {
//       // console.log('📋 Categories loaded:', categories.length);
      
//       const ids = categories.map(c => c?._id).filter(Boolean);
//       const uniqueIds = new Set(ids);
      
//       if (ids.length !== uniqueIds.size) {
//         console.error('❌ DUPLICATE CATEGORY IDs DETECTED!');
//         categories.forEach((cat, idx) => {
//           console.log(`Category ${idx}:`, cat?._id, cat?.categoryName);
//         });
//       }
//     }
//   }, [categories]);

//   // Debug dishes for duplicate IDs
//   useEffect(() => {
//     if (allDishes.length > 0) {
//       // console.log('🍽️ Dishes loaded:', allDishes.length);
      
//       const ids = allDishes.map(d => d?._id).filter(Boolean);
//       const uniqueIds = new Set(ids);
      
//       if (ids.length !== uniqueIds.size) {
//         console.error('❌ DUPLICATE DISH IDs DETECTED!');
//         allDishes.forEach((dish, idx) => {
//           console.log(`Dish ${idx}:`, dish?._id, dish?.dishName);
//         });
//       }
//     }
//   }, [allDishes]);

//   // Count items per category
//   useEffect(() => {
//     if (categories.length > 0 && allDishes.length > 0) {
//       const counts = {};
//       categories.forEach((category) => {
//         if (!category || !category._id) return;
//         const count = allDishes.filter((dish) => dish.category === category._id).length;
//         counts[category._id] = count;
//       });
//       setCategoryItemCounts(counts);
//     }
//   }, [categories, allDishes]);

//   // Default category
//   useEffect(() => {
//     if (categories.length > 0 && selectedCategory === null) {
//       setSelectedCategory(categories[0]);
//     }
//   }, [categories, selectedCategory]);

//   // Set default quantity to 1 for filtered dishes WITH SEARCH FILTER
//   useEffect(() => {
//     if (selectedCategory && allDishes.length > 0) {
//       let filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
      
//       // Apply search filter
//       if (searchQuery.trim()) {
//         filtered = filtered.filter((dish) =>
//           dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       }
      
//       setFilteredDishes(filtered);

//       setItemCounts((prevCounts) => {
//         const newCounts = { ...prevCounts };
//         filtered.forEach((dish) => {
//           if (newCounts[dish._id] === undefined) {
//             newCounts[dish._id] = 1;
//           }
//         });
//         return newCounts;
//       });
//     } else {
//       setFilteredDishes([]);
//     }
//   }, [selectedCategory, allDishes, searchQuery]);

//   // Error states
//   if (isCategoriesError || isDishesError) {
//     if (!isOfflineMode) {
//       enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
//     }
//   }

//   // 🎯 Loading state - show offline status
//   if ((isCategoriesLoading && !isOfflineMode) || (isDishesLoading && !isOfflineMode) || isLoadingOffline) {
//     return (
//       <div className="h-full flex items-center justify-center bg-[#1f1f1f]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//           <p className="text-[#f5f5f5] text-lg">
//             {!isOfflineMode ? 'Loading menu...' : 'Loading cached menu...'}
//           </p>
//           {isOfflineMode && (
//             <p className="text-[#ababab] text-sm mt-2">
//               Working offline with cached data
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Increment/Decrement
//   const increment = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: (prevCounts[id] || 1) + 1,
//     }));
//   };

//   const decrement = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: Math.max((prevCounts[id] || 1) - 1, 1),
//     }));
//   };

//   // Select variation
//   const handleVariationChange = (dishId, variation) => {
//     setSelectedVariations((prev) => ({
//       ...prev,
//       [dishId]: variation,
//     }));
//   };

//   // Add to cart handler
//   const handleAddToCart = (item) => {
//     const count = itemCounts[item._id] || 1;

//     // Check if this is a custom dish
//     if (item.category === CUSTOM_CATEGORY_ID) {
//       setSelectedCustomDish(item);
//       setCustomDishName("");
//       setCustomDishPrice('');
//       setIsCustomDishModalOpen(true);
//       return;
//     }

//     const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);
//     if (!selectedVariation) {
//       enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
//       return;
//     }

//     const newObj = {
//       _id: item._id,
//       menuItem: item._id,
//       dishId: item._id,
//       dishName: item.dishName,
//       section: item.section || selectedVariation.section || null,
//       variationName: selectedVariation.name,
//       pricePerQuantity: selectedVariation.price,
//       quantity: count,
//       price: selectedVariation.price * count,
//     };

//     dispatch(addItems(newObj));
//     enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [item._id]: 1,
//     }));
//   };

//   // Custom dish handler with unique ID
//   const handleAddCustomDish = () => {
//     if (!customDishName || !customDishPrice) {
//       enqueueSnackbar("Please enter name and price!", { variant: "warning" });
//       return;
//     }

//     const count = itemCounts[selectedCustomDish._id] || 1;

//     const customDishId = `custom-${uuidv4()}`;

//     const newObj = {
//       _id: customDishId,
//       menuItem: customDishId,
//       dishId: customDishId,
//       dishName: customDishName,
//       section: selectedCustomDish.section || null,
//       variationName: "Custom",
//       pricePerQuantity: parseFloat(customDishPrice),
//       quantity: count,
//       price: parseFloat(customDishPrice) * count,
//     };

//     dispatch(addItems(newObj));
//     enqueueSnackbar(`${customDishName} added to cart!`, { variant: "success" });
//     setIsCustomDishModalOpen(false);
//     setCustomDishName("");
//     setCustomDishPrice('');
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* 🎯 Offline Indicator Banner */}
// {/* 

      

//       {/* Categories Section */}
//       <div className="h-[22vh] lg:h-[20vh] xl:h-[22vh] 2xl:h-[24vh] min-h-[160px] lg:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px] border-b-2 border-[#2a2a2a] flex flex-col flex-shrink-0">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-1.5 xl:py-2 flex-shrink-0">
//           {/* <h2 className="text-xl lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Menu Categories</h2> */}
//         </div>

//         {/* Scrollable Categories */}
//         <div className="flex-1 py-1 px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 pb-3 lg:pb-2 xl:pb-3 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           {categories.length === 0 ? (
//             <div className="text-center text-[#ababab] text-lg lg:text-base xl:text-lg font-semibold py-6 lg:py-4 xl:py-6">
//               {isOfflineMode ? 'No cached categories available' : 'No categories found'}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
//               {categories.map((category, index) => {
//                 if (!category || !category._id) {
//                   console.warn(`⚠️ Skipping invalid category at index ${index}`);
//                   return null;
//                 }
                
//                 const uniqueKey = ensureUniqueKey(category._id, index, 'cat-');
//                 const isSelected = selectedCategory?._id === category._id;
//                 const itemCount = categoryItemCounts[category._id] || 0;
//                 const hasImage = category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim());

//                 return (
//                   <div
//                     key={uniqueKey}
//                     className={`relative flex flex-col justify-end p-2 lg:p-1.5 xl:p-2 2xl:p-3 rounded-xl cursor-pointer transition-all duration-300 h-full min-h-[70px] lg:min-h-[60px] xl:min-h-[70px] 2xl:min-h-[80px] overflow-hidden group ${
//                       isSelected
//                         ? 'ring-2 ring-yellow-400 scale-[1.03] shadow-2xl shadow-yellow-500/50'
//                         : 'hover:scale-[1.02] hover:shadow-xl shadow-lg'
//                     }`}
//                     onClick={() => setSelectedCategory(category)}
//                   >
//                     {hasImage ? (
//                       <>
//                         <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a]"></div>
//                         <img
//                           src={category.imageUrl}
//                           alt={category.categoryName}
//                           className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
//                           onError={e => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
//                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500"></div>
//                       </>
//                     ) : (
//                       <>
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background: `linear-gradient(135deg, ${getBgColor(index)} 0%, ${getBgColor(index)}dd 100%)`
//                           }}
//                         ></div>
//                         <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
//                       </>
//                     )}

//                     <div className="relative z-10">
//                       <h3
//                         className={`text-xs lg:text-[11px] xl:text-xs 2xl:text-sm font-bold line-clamp-2 mb-1 ${
//                           hasImage
//                             ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
//                             : 'text-white drop-shadow-lg'
//                         }`}
//                       >
//                         {category.categoryName}
//                       </h3>

//                       <div className="flex items-center gap-1.5 lg:gap-1 xl:gap-1.5">
//                         <div className={`flex items-center gap-1 px-1.5 py-0.5 lg:px-1 lg:py-0.5 xl:px-1.5 xl:py-0.5 2xl:px-2 2xl:py-1 rounded-full transition-all duration-300 ${
//                           hasImage
//                             ? 'bg-black/70 backdrop-blur-md border border-white/10'
//                             : 'bg-white/25 backdrop-blur-sm border border-white/20'
//                         } ${isSelected ? 'ring-1 ring-yellow-400/50' : ''}`}>
//                           <p className="text-white text-[10px] lg:text-[9px] xl:text-[10px] 2xl:text-xs font-semibold">
//                             {itemCount} Items
//                           </p>
//                           {isSelected && (
//                             <GrRadialSelected className="text-yellow-400 flex-shrink-0 animate-pulse" size={10} />
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {isSelected && (
//                       <>
//                         <div className="absolute inset-0 rounded-xl ring-2 ring-yellow-400 pointer-events-none"></div>
//                         <div className="absolute inset-0 rounded-xl ring-1 ring-yellow-300/50 blur-sm pointer-events-none"></div>
//                       </>
//                     )}

//                     {!isSelected && (
//                       <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none"></div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 border-b-2 border-[#2a2a2a]">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search dishes in selected category..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-[#2a2a2a] text-[#f5f5f5] px-4 py-2.5 lg:py-2 xl:py-2.5 2xl:py-3 pl-11 lg:pl-10 xl:pl-11 rounded-xl outline-none border-2 border-[#3a3a3a] focus:border-yellow-500 transition-all duration-300 text-sm lg:text-xs xl:text-sm 2xl:text-base placeholder-[#ababab]"
//           />
//           <svg 
//             className="absolute left-3 lg:left-2.5 xl:left-3 top-1/2 transform -translate-y-1/2 text-[#ababab] w-5 h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5"
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
          
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery('')}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ababab] hover:text-[#f5f5f5] transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           )}
//         </div>
        
//         {searchQuery && (
//           <p className="text-xs lg:text-[10px] xl:text-xs text-[#ababab] mt-2">
//             {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''} found for "{searchQuery}"
//           </p>
//         )}
//       </div>
      
//       <hr className="border-[#2a2a2a] border-t-2" />

//       {/* Dishes Section */}
//       <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 2xl:py-4 pb-16 lg:pb-12 xl:pb-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4">
            
//             {/* No Results Message */}
//             {filteredDishes.length === 0 && searchQuery && (
//               <div className="col-span-full flex flex-col items-center justify-center py-16 lg:py-12 xl:py-16">
//                 <svg className="w-16 h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 text-[#3a3a3a] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <h3 className="text-[#f5f5f5] text-lg lg:text-base xl:text-lg font-bold mb-2">No dishes found</h3>
//                 <p className="text-[#ababab] text-sm lg:text-xs xl:text-sm mb-4">
//                   No dishes match "{searchQuery}" in {selectedCategory?.categoryName}
//                 </p>
//                 <button
//                   onClick={() => setSearchQuery('')}
//                   className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all duration-300 text-sm lg:text-xs xl:text-sm"
//                 >
//                   Clear Search
//                 </button>
//               </div>
//             )}

//             {filteredDishes.map((item, index) => {
//               if (!item || !item._id) {
//                 console.warn(`⚠️ Skipping invalid dish at index ${index}`);
//                 return null;
//               }

//               const uniqueKey = ensureUniqueKey(item._id, index, 'dish-');
//               const variations = item.variations || [];
//               const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

//               return (
//                 <div
//                   key={uniqueKey}
//                   className="relative flex flex-col items-start justify-between p-3 lg:p-2.5 xl:p-3 2xl:p-4 rounded-xl h-auto cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] hover:scale-[1.02] hover:shadow-xl shadow-lg group overflow-hidden border-2 border-[#2a2a2a] hover:border-[#3a3a3a]"
//                 >
//                   <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none group-hover:ring-white/20 transition-all duration-300"></div>
//                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500 rounded-xl"></div>

//                   <div className="relative z-10 w-full">
//                     {/* Header */}
//                     <div className="flex items-start justify-between w-full mb-2 lg:mb-1.5 xl:mb-2">
//                       <h1 className="text-[#f5f5f5] text-base lg:text-sm xl:text-base 2xl:text-lg font-bold drop-shadow-sm pr-2 line-clamp-2">
//                         {item.dishName}
//                       </h1>
//                       <button
//                         onClick={() => handleAddToCart(item)}
//                         className="text-[#02ca3a] hover:text-[#03e844] transition-all duration-300 hover:scale-110 flex-shrink-0"
//                       >
//                         <GiShoppingCart size={24} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
//                       </button>
//                     </div>

//                     {/* Variations */}
//                     {variations.length > 0 && (
//                       <div className="flex flex-wrap gap-1.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 my-2 lg:my-1.5 xl:my-2">
//                         {variations.map((variation, vIndex) => {
//                           const varKey = `${item._id}-${variation.name}-${vIndex}`;
                          
//                           return (
//                             <button
//                               key={varKey}
//                               onClick={() => handleVariationChange(item._id, variation)}
//                               className={`px-2.5 py-1 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 2xl:py-1.5 rounded-lg text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
//                                 selectedVar?.name === variation.name
//                                   ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
//                                   : 'bg-[#2f2f2f]/80 text-white border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-105'
//                               }`}
//                             >
//                               {variation.name} - BHD {variation.price.toFixed(3)}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}

//                     {/* Price and Controls */}
//                     <div className="flex items-center justify-between w-full mt-3 lg:mt-2 xl:mt-3 pt-2 lg:pt-1.5 xl:pt-2 border-t border-[#3a3a3a]">
//                       <p className="text-[#f5f5f5] text-lg lg:text-base xl:text-lg 2xl:text-xl font-bold drop-shadow-sm">
//                         {selectedVar ? `BHD ${selectedVar.price.toFixed(3)}` : 'N/A'}
//                       </p>
//                       <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-1.5 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-2 rounded-lg gap-4 lg:gap-3 xl:gap-4 2xl:gap-5 border-2 border-[#3a3a3a] shadow-inner">
//                         <button
//                           onClick={() => decrement(item._id)}
//                           className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95"
//                         >
//                           &minus;
//                         </button>
//                         <span className="text-white font-bold text-base lg:text-sm xl:text-base 2xl:text-lg min-w-[16px] lg:min-w-[14px] xl:min-w-[16px] 2xl:min-w-[20px] text-center">
//                           {itemCounts[item._id] || 1}
//                         </span>
//                         <button
//                           onClick={() => increment(item._id)}
//                           className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95"
//                         >
//                           &#43;
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Custom Dish Modal */}
//       {isCustomDishModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-[#1f1f1f] p-5 lg:p-4 xl:p-5 rounded-xl w-[90%] sm:w-[400px] lg:w-[350px] xl:w-[400px]">
//             <h2 className="text-xl lg:text-lg xl:text-xl font-bold mb-4 lg:mb-3 xl:mb-4 text-white">Add Custom Dish</h2>
//             <input
//               type="text"
//               placeholder="Dish Name"
//               value={customDishName}
//               onChange={(e) => setCustomDishName(e.target.value)}
//               className="w-full mb-3 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm"
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={customDishPrice}
//               onChange={(e) => setCustomDishPrice(e.target.value)}
//               className="w-full mb-4 lg:mb-3 xl:mb-4 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm"
//             />
//             <div className="flex justify-end gap-3 lg:gap-2 xl:gap-3">
//               <button
//                 onClick={() => setIsCustomDishModalOpen(false)}
//                 className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-gray-500 rounded-lg text-white text-sm lg:text-xs xl:text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCustomDish}
//                 className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-yellow-500 rounded-lg text-black font-semibold text-sm lg:text-xs xl:text-sm"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuContainer;


import React, { useState, useEffect, useRef } from 'react';
import { GrRadialSelected } from 'react-icons/gr';
import { GiShoppingCart } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/slice/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getDishes } from '../../https';
import { enqueueSnackbar } from 'notistack';
import { fetchInitialData, getCachedInitialData } from '../../utils/offlineMenu';
import { useOfflineMode } from '../../constants/OfflineModeContext';

const ensureUniqueKey = (id, index, prefix = '') => {
  if (!id || typeof id !== 'string' || id.length < 3) {
    console.warn(`⚠️ Invalid ID detected: "${id}" at index ${index}`);
    return `${prefix}fallback-${index}-${uuidv4()}`;
  }
  return `${prefix}${id}`;
};

const getBgColor = (index) => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
    '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe'
  ];
  return colors[index % colors.length];
};

const MenuContainer = () => {
  const dispatch = useDispatch();
  const { isOfflineMode, hasInternetConnection } = useOfflineMode();

  // ✅ FIX 1: Per-dish double-tap guard (map of dishId → boolean)
  // Prevents two rapid taps dispatching addItems twice for the same dish.
  const isAddingRef = useRef({});

  const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
  const [customDishName, setCustomDishName] = useState("");
  const [customDishPrice, setCustomDishPrice] = useState("");
  const [selectedCustomDish, setSelectedCustomDish] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [categoryItemCounts, setCategoryItemCounts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [cachedCategories, setCachedCategories] = useState([]);
  const [cachedDishes, setCachedDishes] = useState([]);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);

  const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993";

  useEffect(() => {
    async function loadCachedData() {
      if (isOfflineMode) {
        setIsLoadingOffline(true);
        try {
          const { categories: cached_cats, dishes: cached_dishes } = await getCachedInitialData();
          setCachedCategories(cached_cats);
          setCachedDishes(cached_dishes);
        } catch (error) {
          console.error("Error loading cached menu data:", error);
        } finally {
          setIsLoadingOffline(false);
        }
      }
    }
    loadCachedData();
  }, [isOfflineMode]);

  const {
    data: categoriesResponse,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      if (!isOfflineMode && hasInternetConnection) {
        fetchInitialData().catch(err =>
          console.warn("Failed to cache menu data in background:", err)
        );
      }
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    },
    onError: () => {
      if (!isOfflineMode) enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
    },
    enabled: !isOfflineMode,
  });

  const categories = !isOfflineMode
    ? (Array.isArray(categoriesResponse) ? categoriesResponse : [])
    : cachedCategories;

  const {
    data: dishes,
    isError: isDishesError,
    isLoading: isDishesLoading,
    refetch: refetchDishes
  } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const response = await getDishes();
      const convertedDishes = (response.data.data || []).map((dish) => ({
        ...dish,
        variations: dish.variations?.map((v) => ({ ...v })) || [],
      }));
      setAllDishes(convertedDishes);
      return convertedDishes;
    },
    enabled: !isOfflineMode,
  });

  useEffect(() => {
    if (!isOfflineMode && dishes) {
      setAllDishes(dishes);
    } else if (isOfflineMode && cachedDishes.length > 0) {
      setAllDishes(cachedDishes);
    }
  }, [isOfflineMode, dishes, cachedDishes]);

  useEffect(() => {
    if (!isOfflineMode && hasInternetConnection) {
      refetchCategories();
      refetchDishes();
    }
  }, [isOfflineMode, hasInternetConnection]);

  useEffect(() => {
    if (categories.length > 0) {
      const ids = categories.map(c => c?._id).filter(Boolean);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.error('❌ DUPLICATE CATEGORY IDs DETECTED!');
      }
    }
  }, [categories]);

  useEffect(() => {
    if (allDishes.length > 0) {
      const ids = allDishes.map(d => d?._id).filter(Boolean);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.error('❌ DUPLICATE DISH IDs DETECTED!');
      }
    }
  }, [allDishes]);

  useEffect(() => {
    if (categories.length > 0 && allDishes.length > 0) {
      const counts = {};
      categories.forEach((category) => {
        if (!category || !category._id) return;
        counts[category._id] = allDishes.filter((dish) => dish.category === category._id).length;
      });
      setCategoryItemCounts(counts);
    }
  }, [categories, allDishes]);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory && allDishes.length > 0) {
      let filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
      if (searchQuery.trim()) {
        filtered = filtered.filter((dish) =>
          dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredDishes(filtered);

      // ✅ FIX 2: Only initialize counts that don't exist yet.
      // Counts that already exist (set by user incrementing) are preserved.
      // After handleAddToCart fires it explicitly resets to 1, so no stale
      // count can persist across an add.
      setItemCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        filtered.forEach((dish) => {
          if (newCounts[dish._id] === undefined) {
            newCounts[dish._id] = 1;
          }
        });
        return newCounts;
      });
    } else {
      setFilteredDishes([]);
    }
  }, [selectedCategory, allDishes, searchQuery]);

  if (isCategoriesError || isDishesError) {
    if (!isOfflineMode) {
      enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
    }
  }

  if ((isCategoriesLoading && !isOfflineMode) || (isDishesLoading && !isOfflineMode) || isLoadingOffline) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1f1f1f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
          <p className="text-[#f5f5f5] text-lg">
            {!isOfflineMode ? 'Loading menu...' : 'Loading cached menu...'}
          </p>
          {isOfflineMode && (
            <p className="text-[#ababab] text-sm mt-2">Working offline with cached data</p>
          )}
        </div>
      </div>
    );
  }

  const increment = (id) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max((prevCounts[id] || 1) - 1, 1),
    }));
  };

  const handleVariationChange = (dishId, variation) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [dishId]: variation,
    }));
  };

  const handleAddToCart = (item) => {
    // ✅ FIX 3: Per-dish double-tap guard — only blocks the SAME dish within 300ms
    if (isAddingRef.current[item._id]) return;
    isAddingRef.current[item._id] = true;

    try {
      if (item.category === CUSTOM_CATEGORY_ID) {
        setSelectedCustomDish(item);
        setCustomDishName("");
        setCustomDishPrice('');
        setIsCustomDishModalOpen(true);
        return;
      }

      // ✅ FIX 4: Snapshot count and variation synchronously at call time.
      // Prevents stale closure from reading a different render's values.
      const count = itemCounts[item._id] || 1;
      const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);

      if (!selectedVariation) {
        enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
        return;
      }

      // ✅ FIX 5: Remove `price` from payload entirely.
      // cartSlice computes item.price = pricePerQuantity * quantity.
      // Sending `price` here gives the reducer a stale value it may use
      // as a fallback, corrupting pricePerQuantity when qty > 1.
      dispatch(addItems({
        _id:              item._id,
        menuItem:         item._id,
        dishId:           item._id,
        dishName:         item.dishName,
        name:             item.dishName,
        section:          item.section || selectedVariation.section || null,
        variationName:    selectedVariation.name,
        pricePerQuantity: selectedVariation.price, // ✅ unit price ONLY
        quantity:         count,
        // ❌ NO `price` field — cartSlice owns this
      }));

      enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

      // ✅ Explicitly reset this dish's counter to 1 after every add
      setItemCounts((prevCounts) => ({ ...prevCounts, [item._id]: 1 }));

    } finally {
      // ✅ Release guard after 300ms — allows re-adding same dish after debounce
      setTimeout(() => {
        delete isAddingRef.current[item._id];
      }, 300);
    }
  };

  const handleAddCustomDish = () => {
    if (!customDishName.trim() || !customDishPrice) {
      enqueueSnackbar("Please enter name and price!", { variant: "warning" });
      return;
    }

    const parsedPrice = parseFloat(customDishPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      enqueueSnackbar("Please enter a valid price!", { variant: "warning" });
      return;
    }

    const customDishId = `custom-${uuidv4()}`;
    const count = itemCounts[selectedCustomDish?._id] || 1;

    // ✅ FIX 6: Same rule — no `price` field in payload
    dispatch(addItems({
      _id:              customDishId,
      menuItem:         customDishId,
      dishId:           customDishId,
      dishName:         customDishName.trim(),
      name:             customDishName.trim(),
      section:          selectedCustomDish?.section || null,
      variationName:    "Custom",
      pricePerQuantity: parsedPrice, // ✅ unit price only
      quantity:         count,
      // ❌ NO `price` field
    }));

    enqueueSnackbar(`${customDishName.trim()} added to cart!`, { variant: "success" });
    setIsCustomDishModalOpen(false);
    setCustomDishName("");
    setCustomDishPrice('');
    setSelectedCustomDish(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Categories Section */}
      <div className="h-[22vh] lg:h-[20vh] xl:h-[22vh] 2xl:h-[24vh] min-h-[160px] lg:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px] border-b-2 border-[#2a2a2a] flex flex-col flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-1.5 xl:py-2 flex-shrink-0"></div>
        <div className="flex-1 py-1 px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 pb-3 lg:pb-2 xl:pb-3 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.length === 0 ? (
            <div className="text-center text-[#ababab] text-lg lg:text-base xl:text-lg font-semibold py-6 lg:py-4 xl:py-6">
              {isOfflineMode ? 'No cached categories available' : 'No categories found'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {categories.map((category, index) => {
                if (!category || !category._id) {
                  console.warn(`⚠️ Skipping invalid category at index ${index}`);
                  return null;
                }
                const uniqueKey = ensureUniqueKey(category._id, index, 'cat-');
                const isSelected = selectedCategory?._id === category._id;
                const itemCount = categoryItemCounts[category._id] || 0;
                const hasImage = category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim());

                return (
                  <div
                    key={uniqueKey}
                    className={`relative flex flex-col justify-end p-2 lg:p-1.5 xl:p-2 2xl:p-3 rounded-xl cursor-pointer transition-all duration-300 h-full min-h-[70px] lg:min-h-[60px] xl:min-h-[70px] 2xl:min-h-[80px] overflow-hidden group ${
                      isSelected
                        ? 'ring-2 ring-yellow-400 scale-[1.03] shadow-2xl shadow-yellow-500/50'
                        : 'hover:scale-[1.02] hover:shadow-xl shadow-lg'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {hasImage ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a]"></div>
                        <img
                          src={category.imageUrl}
                          alt={category.categoryName}
                          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500"></div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${getBgColor(index)} 0%, ${getBgColor(index)}dd 100%)` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                      </>
                    )}
                    <div className="relative z-10">
                      <h3 className={`text-xs lg:text-[11px] xl:text-xs 2xl:text-sm font-bold line-clamp-2 mb-1 ${hasImage ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-white drop-shadow-lg'}`}>
                        {category.categoryName}
                      </h3>
                      <div className="flex items-center gap-1.5 lg:gap-1 xl:gap-1.5">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 lg:px-1 lg:py-0.5 xl:px-1.5 xl:py-0.5 2xl:px-2 2xl:py-1 rounded-full transition-all duration-300 ${hasImage ? 'bg-black/70 backdrop-blur-md border border-white/10' : 'bg-white/25 backdrop-blur-sm border border-white/20'} ${isSelected ? 'ring-1 ring-yellow-400/50' : ''}`}>
                          <p className="text-white text-[10px] lg:text-[9px] xl:text-[10px] 2xl:text-xs font-semibold">{itemCount} Items</p>
                          {isSelected && <GrRadialSelected className="text-yellow-400 flex-shrink-0 animate-pulse" size={10} />}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-xl ring-2 ring-yellow-400 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-xl ring-1 ring-yellow-300/50 blur-sm pointer-events-none"></div>
                      </>
                    )}
                    {!isSelected && <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none"></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 border-b-2 border-[#2a2a2a]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search dishes in selected category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2a2a] text-[#f5f5f5] px-4 py-2.5 lg:py-2 xl:py-2.5 2xl:py-3 pl-11 lg:pl-10 xl:pl-11 rounded-xl outline-none border-2 border-[#3a3a3a] focus:border-yellow-500 transition-all duration-300 text-sm lg:text-xs xl:text-sm 2xl:text-base placeholder-[#ababab]"
          />
          <svg className="absolute left-3 lg:left-2.5 xl:left-3 top-1/2 transform -translate-y-1/2 text-[#ababab] w-5 h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ababab] hover:text-[#f5f5f5] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs lg:text-[10px] xl:text-xs text-[#ababab] mt-2">
            {filteredDishes.length} dish{filteredDishes.length !== 1 ? 'es' : ''} found for "{searchQuery}"
          </p>
        )}
      </div>

      <hr className="border-[#2a2a2a] border-t-2" />

      {/* Dishes Section */}
      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 2xl:py-4 pb-16 lg:pb-12 xl:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4">
            {filteredDishes.length === 0 && searchQuery && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 lg:py-12 xl:py-16">
                <svg className="w-16 h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 text-[#3a3a3a] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-[#f5f5f5] text-lg lg:text-base xl:text-lg font-bold mb-2">No dishes found</h3>
                <p className="text-[#ababab] text-sm lg:text-xs xl:text-sm mb-4">No dishes match "{searchQuery}" in {selectedCategory?.categoryName}</p>
                <button onClick={() => setSearchQuery('')} className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all duration-300 text-sm lg:text-xs xl:text-sm">
                  Clear Search
                </button>
              </div>
            )}

            {filteredDishes.map((item, index) => {
              if (!item || !item._id) {
                console.warn(`⚠️ Skipping invalid dish at index ${index}`);
                return null;
              }
              const uniqueKey = ensureUniqueKey(item._id, index, 'dish-');
              const variations = item.variations || [];
              const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

              return (
                <div key={uniqueKey} className="relative flex flex-col items-start justify-between p-3 lg:p-2.5 xl:p-3 2xl:p-4 rounded-xl h-auto cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] hover:scale-[1.02] hover:shadow-xl shadow-lg group overflow-hidden border-2 border-[#2a2a2a] hover:border-[#3a3a3a]">
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none group-hover:ring-white/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500 rounded-xl"></div>
                  <div className="relative z-10 w-full">
                    <div className="flex items-start justify-between w-full mb-2 lg:mb-1.5 xl:mb-2">
                      <h1 className="text-[#f5f5f5] text-base lg:text-sm xl:text-base 2xl:text-lg font-bold drop-shadow-sm pr-2 line-clamp-2">{item.dishName}</h1>
                      <button onClick={() => handleAddToCart(item)} className="text-[#02ca3a] hover:text-[#03e844] transition-all duration-300 hover:scale-110 flex-shrink-0">
                        <GiShoppingCart size={24} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
                      </button>
                    </div>
                    {variations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 my-2 lg:my-1.5 xl:my-2">
                        {variations.map((variation, vIndex) => {
                          const varKey = `${item._id}-${variation.name}-${vIndex}`;
                          return (
                            <button key={varKey} onClick={() => handleVariationChange(item._id, variation)}
                              className={`px-2.5 py-1 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 2xl:py-1.5 rounded-lg text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
                                selectedVar?.name === variation.name
                                  ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
                                  : 'bg-[#2f2f2f]/80 text-white border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-105'
                              }`}>
                              {variation.name} - BHD {variation.price.toFixed(3)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center justify-between w-full mt-3 lg:mt-2 xl:mt-3 pt-2 lg:pt-1.5 xl:pt-2 border-t border-[#3a3a3a]">
                      <p className="text-[#f5f5f5] text-lg lg:text-base xl:text-lg 2xl:text-xl font-bold drop-shadow-sm">
                        {selectedVar ? `BHD ${selectedVar.price.toFixed(3)}` : 'N/A'}
                      </p>
                      <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-1.5 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-2 rounded-lg gap-4 lg:gap-3 xl:gap-4 2xl:gap-5 border-2 border-[#3a3a3a] shadow-inner">
                        <button onClick={() => decrement(item._id)} className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95">&minus;</button>
                        <span className="text-white font-bold text-base lg:text-sm xl:text-base 2xl:text-lg min-w-[16px] lg:min-w-[14px] xl:min-w-[16px] 2xl:min-w-[20px] text-center">{itemCounts[item._id] || 1}</span>
                        <button onClick={() => increment(item._id)} className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95">&#43;</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Dish Modal */}
      {isCustomDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] p-5 lg:p-4 xl:p-5 rounded-xl w-[90%] sm:w-[400px] lg:w-[350px] xl:w-[400px]">
            <h2 className="text-xl lg:text-lg xl:text-xl font-bold mb-4 lg:mb-3 xl:mb-4 text-white">Add Custom Dish</h2>
            <input type="text" placeholder="Dish Name" value={customDishName} onChange={(e) => setCustomDishName(e.target.value)}
              className="w-full mb-3 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm" />
            <input type="number" placeholder="Price" value={customDishPrice} onChange={(e) => setCustomDishPrice(e.target.value)}
              className="w-full mb-4 lg:mb-3 xl:mb-4 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm" />
            <div className="flex justify-end gap-3 lg:gap-2 xl:gap-3">
              <button onClick={() => setIsCustomDishModalOpen(false)} className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-gray-500 rounded-lg text-white text-sm lg:text-xs xl:text-sm">Cancel</button>
              <button onClick={handleAddCustomDish} className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-yellow-500 rounded-lg text-black font-semibold text-sm lg:text-xs xl:text-sm">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuContainer;


// more responsive style

// import React, { useState, useEffect } from 'react';
// import { GrRadialSelected } from 'react-icons/gr';
// import { GiShoppingCart } from 'react-icons/gi';
// import { useDispatch } from 'react-redux';
// import { addItems } from '../../redux/slice/cartSlice';
// import { v4 as uuidv4 } from 'uuid';
// import { useQuery } from '@tanstack/react-query';
// import { getCategories, getDishes } from '../../https';
// import { enqueueSnackbar } from 'notistack';
// import { fetchInitialData, getCachedInitialData } from '../../utils/offlineMenu';
// import { useOfflineMode } from '../../constants/OfflineModeContext';

// const ensureUniqueKey = (id, index, prefix = '') => {
//   if (!id || typeof id !== 'string' || id.length < 3) {
//     console.warn(`⚠️ Invalid ID detected: "${id}" at index ${index}`);
//     return `${prefix}fallback-${index}-${uuidv4()}`;
//   }
//   return `${prefix}${id}`;
// };

// const MenuContainer = () => {
//   const dispatch = useDispatch();
//   const { isOfflineMode, hasInternetConnection } = useOfflineMode();

//   const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
//   const [customDishName, setCustomDishName] = useState("");
//   const [customDishPrice, setCustomDishPrice] = useState("");
//   const [selectedCustomDish, setSelectedCustomDish] = useState(null);

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [allDishes, setAllDishes] = useState([]);
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [categoryItemCounts, setCategoryItemCounts] = useState({});
//   const [selectedVariations, setSelectedVariations] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fastMode, setFastMode] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [cachedCategories, setCachedCategories] = useState([]);
//   const [cachedDishes, setCachedDishes] = useState([]);
//   const [isLoadingOffline, setIsLoadingOffline] = useState(false);

//   const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993";

//   // Detect mobile/tablet
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     async function loadCachedData() {
//       if (isOfflineMode) {
//         setIsLoadingOffline(true);
//         try {
//           const { categories: cached_cats, dishes: cached_dishes } = await getCachedInitialData();
//           setCachedCategories(cached_cats);
//           setCachedDishes(cached_dishes);
//         } catch (error) {
//           console.error("Error loading cached menu data:", error);
//         } finally {
//           setIsLoadingOffline(false);
//         }
//       }
//     }
//     loadCachedData();
//   }, [isOfflineMode]);

//   const { 
//     data: categoriesResponse, 
//     isError: isCategoriesError, 
//     isLoading: isCategoriesLoading, 
//     refetch: refetchCategories 
//   } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await getCategories();
//       if (!isOfflineMode && hasInternetConnection) {
//         fetchInitialData().catch(err => 
//           console.warn("Failed to cache menu data in background:", err)
//         );
//       }
//       if (Array.isArray(response.data)) return response.data;
//       if (Array.isArray(response.data?.data)) return response.data.data;
//       return [];
//     },
//     onError: () => {
//       if (!isOfflineMode) {
//         enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
//       }
//     },
//     enabled: !isOfflineMode,
//   });

//   const categories = !isOfflineMode 
//     ? (Array.isArray(categoriesResponse) ? categoriesResponse : [])
//     : cachedCategories;

//   const { 
//     data: dishes, 
//     isError: isDishesError, 
//     isLoading: isDishesLoading, 
//     refetch: refetchDishes 
//   } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: async () => {
//       const response = await getDishes();
//       const convertedDishes = (response.data.data || []).map((dish) => ({
//         ...dish,
//         variations: dish.variations?.map((v) => ({
//           ...v,
//         })) || [],
//       }));
//       setAllDishes(convertedDishes);
//       return convertedDishes;
//     },
//     enabled: !isOfflineMode,
//   });

//   useEffect(() => {
//     if (!isOfflineMode && dishes) {
//       setAllDishes(dishes);
//     } else if (isOfflineMode && cachedDishes.length > 0) {
//       setAllDishes(cachedDishes);
//     }
//   }, [isOfflineMode, dishes, cachedDishes]);

//   useEffect(() => {
//     if (!isOfflineMode && hasInternetConnection) {
//       refetchCategories();
//       refetchDishes();
//     }
//   }, [isOfflineMode, hasInternetConnection]);

//   useEffect(() => {
//     if (categories.length > 0 && allDishes.length > 0) {
//       const counts = {};
//       categories.forEach((category) => {
//         if (!category || !category._id) return;
//         const count = allDishes.filter((dish) => dish.category === category._id).length;
//         counts[category._id] = count;
//       });
//       setCategoryItemCounts(counts);
//     }
//   }, [categories, allDishes]);

//   useEffect(() => {
//     if (categories.length > 0 && selectedCategory === null) {
//       setSelectedCategory(categories[0]);
//     }
//   }, [categories, selectedCategory]);

//   useEffect(() => {
//     if (selectedCategory && allDishes.length > 0) {
//       let filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
      
//       if (searchQuery.trim()) {
//         filtered = filtered.filter((dish) =>
//           dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//       }
      
//       setFilteredDishes(filtered);

//       setSelectedVariations((prev) => {
//         const newSelections = { ...prev };
//         filtered.forEach((dish) => {
//           if (!newSelections[dish._id] && dish.variations?.length > 0) {
//             newSelections[dish._id] = dish.variations.find(v => v.isDefault) || dish.variations[0];
//           }
//         });
//         return newSelections;
//       });
//     } else {
//       setFilteredDishes([]);
//     }
//   }, [selectedCategory, allDishes, searchQuery]);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === '/') {
//         e.preventDefault();
//         document.getElementById('search-input')?.focus();
//       }
//     };
//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, []);

//   if (isCategoriesError || isDishesError) {
//     if (!isOfflineMode) {
//       enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
//     }
//   }

//   if ((isCategoriesLoading && !isOfflineMode) || (isDishesLoading && !isOfflineMode) || isLoadingOffline) {
//     return (
//       <div className="h-full flex items-center justify-center bg-[#1f1f1f]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//           <p className="text-[#f5f5f5] text-lg">
//             {!isOfflineMode ? 'Loading menu...' : 'Loading cached menu...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handleVariationChange = (dishId, variation, e) => {
//     e.stopPropagation();
//     setSelectedVariations((prev) => ({
//       ...prev,
//       [dishId]: variation,
//     }));
//   };

//   const handleCardClick = (item) => {
//     if (item.category === CUSTOM_CATEGORY_ID) {
//       setSelectedCustomDish(item);
//       setCustomDishName("");
//       setCustomDishPrice('');
//       setIsCustomDishModalOpen(true);
//       return;
//     }

//     const selectedVariation = selectedVariations[item._id];
//     if (!selectedVariation) {
//       enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
//       return;
//     }

//     const newObj = {
//       _id: item._id,
//       menuItem: item._id,
//       dishId: item._id,
//       dishName: item.dishName,
//       section: item.section || selectedVariation.section || null,
//       variationName: selectedVariation.name,
//       pricePerQuantity: selectedVariation.price,
//       quantity: 1,
//       price: selectedVariation.price,
//     };

//     dispatch(addItems(newObj));
//     enqueueSnackbar(`${item.dishName} added!`, { variant: 'success', autoHideDuration: 1000 });
//   };

//   const handleAddCustomDish = () => {
//     if (!customDishName || !customDishPrice) {
//       enqueueSnackbar("Please enter name and price!", { variant: "warning" });
//       return;
//     }

//     const customDishId = `custom-${uuidv4()}`;
//     const newObj = {
//       _id: customDishId,
//       menuItem: customDishId,
//       dishId: customDishId,
//       dishName: customDishName,
//       section: selectedCustomDish.section || null,
//       variationName: "Custom",
//       pricePerQuantity: parseFloat(customDishPrice),
//       quantity: 1,
//       price: parseFloat(customDishPrice),
//     };

//     dispatch(addItems(newObj));
//     enqueueSnackbar(`${customDishName} added!`, { variant: "success" });
//     setIsCustomDishModalOpen(false);
//     setCustomDishName("");
//     setCustomDishPrice('');
//   };

//   const getCategoryIcon = (name) => {
//     const lowerName = name.toLowerCase();
    
//     // Specific matches first (most specific to least specific)
//     if (lowerName.includes('white rice')) return '🍚';
//     if (lowerName.includes('custom dish')) return '✨';
//     if (lowerName.includes('burger')) return '🍔';
//     if (lowerName.includes('fried chicken')) return '🍗';
//     if (lowerName.includes('drink')) return '🥤';
//     if (lowerName.includes('breakfast')) return '🍳';
//     if (lowerName.includes('sandwich')) return '🥪';
//     if (lowerName.includes('broasted')) return '🍗';
//     if (lowerName.includes('saloona')) return '🍲';
//     if (lowerName.includes('grilled shrimp') || lowerName.includes('shrimp')) return '🍤';
//     if (lowerName.includes('harees')) return '🥘';
//     if (lowerName.includes('fried fish')) return '🐟';
//     if (lowerName.includes('grill fish')) return '🐠';
//     if (lowerName.includes('grilled')) return '🔥';
//     if (lowerName.includes('ghoozi')) return '🍖';
//     if (lowerName.includes('majboos')) return '🍛';
//     if (lowerName.includes('mahmous')) return '🍛';
//     if (lowerName.includes('biryani')) return '🍚';
//     if (lowerName.includes('mandi')) return '🍛';
//     if (lowerName.includes('fresh juice') || lowerName.includes('juice')) return '🧃';
//     if (lowerName.includes('starter')) return '🥟';
    
//     // Default
//     return '🍽️';
//   };

//   const visibleCategories = categories.filter(cat => (categoryItemCounts[cat._id] || 0) > 0);

//   return (
//     <div className="h-full flex flex-col lg:flex-row bg-[#1a1a1a]">
//       {/* MOBILE: Top Categories Bar */}
//       {isMobile && (
//         <div className="flex-shrink-0 bg-[#1f1f1f] border-b border-[#2a2a2a]">
//           {/* Search & Fast Mode */}
//           <div className="p-3 space-y-2">
//             <div className="relative">
//               <input
//                 id="search-input"
//                 type="text"
//                 placeholder="Search dishes..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-[#2a2a2a] text-[#f5f5f5] px-3 py-2.5 pl-10 rounded-lg outline-none border border-[#3a3a3a] focus:border-yellow-500 transition-all text-sm placeholder-[#7a7a7a]"
//               />
//               <svg 
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a7a7a] w-4 h-4"
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>

//             <button
//               onClick={() => setFastMode(!fastMode)}
//               className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
//                 fastMode 
//                   ? 'bg-yellow-500 text-black' 
//                   : 'bg-[#2a2a2a] text-[#ababab]'
//               }`}
//             >
//               <span className="flex items-center gap-2">
//                 <span>⚡</span>
//                 <span>Fast Mode</span>
//               </span>
//               {fastMode && <span className="text-xs">ON</span>}
//             </button>
//           </div>

//           {/* Horizontal Categories */}
//           <div className="flex gap-2 overflow-x-auto px-3 pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3a3a3a] [&::-webkit-scrollbar-thumb]:rounded-full">
//             {visibleCategories.map((category, index) => {
//               if (!category || !category._id) return null;
              
//               const uniqueKey = ensureUniqueKey(category._id, index, 'cat-mobile-');
//               const isSelected = selectedCategory?._id === category._id;
//               const itemCount = categoryItemCounts[category._id] || 0;
//               const icon = getCategoryIcon(category.categoryName);

//               return (
//                 <button
//                   key={uniqueKey}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
//                     isSelected
//                       ? 'bg-yellow-500 text-black shadow-lg'
//                       : 'bg-[#2a2a2a] text-[#f5f5f5]'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-base">{icon}</span>
//                     <span>{category.categoryName}</span>
//                     <span className={`text-xs px-1.5 py-0.5 rounded ${
//                       isSelected ? 'bg-black/20' : 'bg-[#1f1f1f]'
//                     }`}>
//                       {itemCount}
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* DESKTOP: Left Sidebar */}
//       {!isMobile && (
//         <div className="w-44 flex-shrink-0 bg-[#1f1f1f] border-r border-[#2a2a2a] flex flex-col">
//           <div className="p-2.5 border-b border-[#2a2a2a]">
//             <div className="relative">
//               <input
//                 id="search-input"
//                 type="text"
//                 placeholder="Search (Press /)"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-[#2a2a2a] text-[#f5f5f5] px-2.5 py-1.5 pl-8 rounded-lg outline-none border border-[#3a3a3a] focus:border-yellow-500 transition-all text-xs placeholder-[#7a7a7a]"
//               />
//               <svg 
//                 className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#7a7a7a] w-3.5 h-3.5"
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//           </div>

//           <div className="px-2.5 py-2 border-b border-[#2a2a2a]">
//             <button
//               onClick={() => setFastMode(!fastMode)}
//               className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//                 fastMode 
//                   ? 'bg-yellow-500 text-black' 
//                   : 'bg-[#2a2a2a] text-[#ababab] hover:bg-[#333333]'
//               }`}
//             >
//               <span className="flex items-center gap-1.5">
//                 <span>⚡</span>
//                 <span>Fast Mode</span>
//               </span>
//               {fastMode && <span className="text-xs">ON</span>}
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3a3a3a] [&::-webkit-scrollbar-thumb]:rounded-full">
//             {visibleCategories.map((category, index) => {
//               if (!category || !category._id) return null;
              
//               const uniqueKey = ensureUniqueKey(category._id, index, 'cat-');
//               const isSelected = selectedCategory?._id === category._id;
//               const itemCount = categoryItemCounts[category._id] || 0;
//               const icon = getCategoryIcon(category.categoryName);

//               return (
//                 <button
//                   key={uniqueKey}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`w-full text-left px-2.5 py-2 rounded-lg font-semibold text-xs transition-all ${
//                     isSelected
//                       ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105'
//                       : 'text-[#f5f5f5] hover:bg-[#2a2a2a]'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-base">{icon}</span>
//                     <div className="flex-1 min-w-0">
//                       <div className="truncate">{category.categoryName}</div>
//                       <div className={`text-[10px] ${isSelected ? 'text-black/60' : 'text-[#7a7a7a]'}`}>
//                         {itemCount} items
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* MAIN CONTENT */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header - Only on Desktop */}
//         {!isMobile && (
//           <div className="flex-shrink-0 bg-[#1f1f1f] border-b border-[#2a2a2a] px-4 py-2.5">
//             <h2 className="text-lg font-bold text-[#f5f5f5]">
//               {selectedCategory?.categoryName || 'Menu'}
//             </h2>
//           </div>
//         )}

//         {/* Dishes Grid - MOBILE OPTIMIZED */}
//         <div className="flex-1 overflow-y-auto p-3 lg:p-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3a3a3a] [&::-webkit-scrollbar-thumb]:rounded-full">
//           {filteredDishes.length === 0 && searchQuery ? (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <div className="bg-[#2a2a2a] rounded-full p-3 mb-2">
//                 <svg className="w-6 h-6 text-[#5a5a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <p className="text-[#ababab] text-xs mb-2">No dishes found</p>
//               <button
//                 onClick={() => setSearchQuery('')}
//                 className="px-3 py-1.5 bg-yellow-500 text-black font-semibold rounded-lg text-xs hover:bg-yellow-600 transition-colors"
//               >
//                 Clear
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 lg:gap-2">
//               {filteredDishes.map((item, index) => {
//                 if (!item || !item._id) return null;

//                 const uniqueKey = ensureUniqueKey(item._id, index, 'dish-');
//                 const variations = item.variations || [];
//                 const selectedVar = selectedVariations[item._id];
//                 const showVariations = variations.length > 1 && !fastMode;

//                 return (
//                   <div
//                     key={uniqueKey}
//                     onClick={() => handleCardClick(item)}
//                     className="bg-[#252525] rounded-xl p-3 sm:p-2.5 lg:p-2 border border-[#2a2a2a] hover:border-yellow-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/10 active:scale-95 group"
//                   >
//                     {/* MOBILE OPTIMIZED: Better spacing and readability */}
//                     <div className="space-y-2 sm:space-y-1.5 lg:space-y-1.5">
//                       {/* Name - More readable on mobile */}
//                       <h3 className="text-[#f5f5f5] text-sm sm:text-xs lg:text-xs font-bold line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors min-h-[2.5rem] sm:min-h-0">
//                         {item.dishName}
//                       </h3>

//                       {/* Price - Prominent */}
//                       <div className="flex items-center justify-between">
//                         <span className="text-yellow-500 text-base sm:text-sm lg:text-xs font-bold">
//                           {selectedVar ? `BHD ${selectedVar.price.toFixed(3)}` : 'N/A'}
//                         </span>
//                       </div>

//                       {/* VARIATIONS - Better touch targets on mobile */}
//                       {showVariations && (
//                         <div className="flex flex-wrap gap-1.5 sm:gap-1 lg:gap-1">
//                           {variations.map((variation, vIndex) => {
//                             const varKey = `${item._id}-${variation.name}-${vIndex}`;
//                             const isSelected = selectedVar?.name === variation.name;
                            
//                             return (
//                               <button
//                                 key={varKey}
//                                 onClick={(e) => handleVariationChange(item._id, variation, e)}
//                                 className={`px-2.5 py-1.5 sm:px-2 sm:py-1 lg:px-1.5 lg:py-0.5 rounded-lg sm:rounded lg:rounded text-xs sm:text-[10px] lg:text-[10px] font-semibold transition-all ${
//                                   isSelected
//                                     ? 'bg-yellow-500 text-black'
//                                     : 'bg-[#2a2a2a] text-[#ababab] hover:bg-[#333333]'
//                                 }`}
//                               >
//                                 {variation.name}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       )}

//                       {/* TAP TO ADD - More visible on mobile */}
//                       <div className="flex items-center justify-center pt-2 sm:pt-1.5 lg:pt-1 border-t border-[#2a2a2a]/50">
//                         <div className="text-[#7a7a7a] group-hover:text-yellow-500 transition-colors flex items-center gap-1.5 text-xs sm:text-[10px] lg:text-[10px]">
//                           <svg className="w-4 h-4 sm:w-3 sm:h-3 lg:w-3 lg:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                           <span className="font-medium">Tap to add</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Custom Dish Modal */}
//       {isCustomDishModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//           <div className="bg-[#252525] p-5 sm:p-4 rounded-xl w-full max-w-sm border border-[#3a3a3a]">
//             <h2 className="text-lg sm:text-base font-bold mb-4 sm:mb-3 text-[#f5f5f5]">Add Custom Dish</h2>
            
//             <div className="space-y-3 sm:space-y-2.5">
//               <input
//                 type="text"
//                 placeholder="Dish name"
//                 value={customDishName}
//                 onChange={(e) => setCustomDishName(e.target.value)}
//                 className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg bg-[#2a2a2a] text-[#f5f5f5] border border-[#3a3a3a] focus:border-yellow-500 outline-none text-base sm:text-sm"
//               />
//               <input
//                 type="number"
//                 placeholder="Price (BHD)"
//                 value={customDishPrice}
//                 onChange={(e) => setCustomDishPrice(e.target.value)}
//                 className="w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg bg-[#2a2a2a] text-[#f5f5f5] border border-[#3a3a3a] focus:border-yellow-500 outline-none text-base sm:text-sm"
//               />
//             </div>

//             <div className="flex gap-3 sm:gap-2 mt-4 sm:mt-3">
//               <button
//                 onClick={() => setIsCustomDishModalOpen(false)}
//                 className="flex-1 px-4 py-3 sm:px-3 sm:py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg text-[#f5f5f5] font-semibold text-base sm:text-sm transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCustomDish}
//                 className="flex-1 px-4 py-3 sm:px-3 sm:py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-bold text-base sm:text-sm transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuContainer;