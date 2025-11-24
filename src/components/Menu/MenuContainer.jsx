// import React, { useState, useEffect } from 'react';
// import { GrRadialSelected } from 'react-icons/gr';
// import { GiShoppingCart } from 'react-icons/gi';
// import { useDispatch } from 'react-redux';
// import { addItems } from '../../redux/slice/cartSlice';
// import { v4 as uuidv4 } from 'uuid';
// import { useQuery } from '@tanstack/react-query';
// import { getCategories, getDishes } from '../../https';
// import { enqueueSnackbar } from 'notistack';

// // Function to generate a static color for each category
// const getBgColor = (index) => {
//   const bgarr = ["#FF6B6B", "#7F56D9", "#3B82F6", "#22C55E", "#F59E0B", "#10B981"];
//   return bgarr[index % bgarr.length];
// };

// const MenuContainer = () => {
//   const dispatch = useDispatch();

//   // states for custom dish
//   const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
//   const [customDishName, setCustomDishName] = useState("");
//   const [customDishPrice, setCustomDishPrice] = useState(0);
//   const [selectedCustomDish, setSelectedCustomDish] = useState(null);

//   // States
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [allDishes, setAllDishes] = useState([]);
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [itemCounts, setItemCounts] = useState({});
//   const [categoryItemCounts, setCategoryItemCounts] = useState({});
//   const [selectedVariations, setSelectedVariations] = useState({});

//   // Fetch categories
//   const { data: categoriesResponse, isError: isCategoriesError, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await getCategories();
//       if (Array.isArray(response.data)) return response.data;
//       if (Array.isArray(response.data?.data)) return response.data.data;
//       return [];
//     },
//     onError: () => {
//       enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
//     },
//   });

//   const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];

//   // Fetch dishes
//   const { data: dishes, isError: isDishesError, isLoading: isDishesLoading, refetch: refetchDishes } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: async () => {
//       const response = await getDishes();

//       // 🟢 Convert prices from BHD * 1000 → BHD
//       const convertedDishes = (response.data.data || []).map((dish) => ({
//         ...dish,
//         variations: dish.variations?.map((v) => ({
//           ...v,
//           // price: v.price / 1000, // convert price to BHD
//         })) || [],
//       }));

//       setAllDishes(convertedDishes);
//       return convertedDishes;
//     },
//   });

//   useEffect(() => {
//     refetchCategories();
//     refetchDishes();
//   }, [refetchCategories, refetchDishes]);

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

//   // ✅ NEW: Set default quantity to 1 for filtered dishes
//   useEffect(() => {
//     if (selectedCategory && allDishes.length > 0) {
//       const filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
//       setFilteredDishes(filtered);

//       // Set default quantity to 1 for all filtered dishes
//       setItemCounts((prevCounts) => {
//         const newCounts = { ...prevCounts };
//         filtered.forEach((dish) => {
//           // Only set to 1 if the item doesn't already have a count
//           if (newCounts[dish._id] === undefined) {
//             newCounts[dish._id] = 1;
//           }
//         });
//         return newCounts;
//       });
//     } else {
//       setFilteredDishes([]);
//     }
//   }, [selectedCategory, allDishes]);

//   // Error and loading states
//   if (isCategoriesError || isDishesError) {
//     enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
//   }

//   if (isCategoriesLoading || isDishesLoading) {
//     return <div>Loading...</div>;
//   }

//   // Increment/Decrement
//   const increment = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: (prevCounts[id] || 1) + 1, // ✅ Changed default from 0 to 1
//     }));
//   };

//   const decrement = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: Math.max((prevCounts[id] || 1) - 1, 1), // ✅ Changed minimum from 0 to 1
//     }));
//   };

//   // Select variation
//   const handleVariationChange = (dishId, variation) => {
//     setSelectedVariations((prev) => ({
//       ...prev,
//       [dishId]: variation,
//     }));
//   };

//   // for pos bahrain
//   const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993";
  
//   // for demo server
//   // const CUSTOM_CATEGORY_ID = "690e722d3987e6cf3a2d52e1";

//   const handleAddToCart = (item) => {
//     const count = itemCounts[item._id] || 1; // ✅ Changed default from 0 to 1

//     // Check if this is a custom dish
//     if (item.category === CUSTOM_CATEGORY_ID) {
//       setSelectedCustomDish(item); // Save dish object
//       setCustomDishName("");        // Clear name
//       setCustomDishPrice('');       // Clear price
//       setIsCustomDishModalOpen(true); // Open modal
//       return; // Do not add to cart yet
//     }

//     // --- Regular dish flow ---
//     const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);
//     if (!selectedVariation) {
//       enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
//       return;
//     }

//     const newObj = {
//       _id: item._id,
//       dishName: item.dishName,
//       section: item.section || selectedVariation.section || null,
//       variationName: selectedVariation.name,
//       pricePerQuantity: selectedVariation.price,
//       quantity: count,
//       price: selectedVariation.price * count,
//     };

//     dispatch(addItems(newObj));
//     enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

//     // ✅ Reset to 1 instead of 0 after adding to cart
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [item._id]: 1,
//     }));
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Categories Section */}
//       <div className="h-[22vh] lg:h-[20vh] xl:h-[22vh] 2xl:h-[24vh] min-h-[160px] lg:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px] border-b-2 border-[#2a2a2a] flex flex-col flex-shrink-0">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-1.5 xl:py-2 flex-shrink-0">
//           {/* <h2 className="text-xl lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Menu Categories</h2> */}
//         </div>

//         {/* Scrollable Categories */}
//         <div className="flex-1 py-1 px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 pb-3 lg:pb-2 xl:pb-3 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           {categories.length === 0 ? (
//             <div className="text-center text-[#ababab] text-lg lg:text-base xl:text-lg font-semibold py-6 lg:py-4 xl:py-6">
//               No categories found
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
//               {categories.map((category, index) => {
//                 if (!category || !category._id) return null;
//                 const isSelected = selectedCategory?._id === category._id;
//                 const itemCount = categoryItemCounts[category._id] || 0;
//                 const hasImage = category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim());

//                 return (
//                   <div
//                     key={category._id}
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
//       <hr className="border-[#2a2a2a] border-t-2" />

//       {/* Dishes Section */}
//       <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 2xl:py-4 pb-16 lg:pb-12 xl:pb-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4">
//             {filteredDishes.map((item) => {
//               const variations = item.variations || [];
//               const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

//               return (
//                 <div
//                   key={item._id}
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
//                         {variations.map((variation) => (
//                           <button
//                             key={variation.name}
//                             onClick={() => handleVariationChange(item._id, variation)}
//                             className={`px-2.5 py-1 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 2xl:py-1.5 rounded-lg text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
//                               selectedVar?.name === variation.name
//                                 ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
//                                 : 'bg-[#2f2f2f]/80 text-white border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-105'
//                             }`}
//                           >
//                             {variation.name} - BHD {variation.price.toFixed(3)}
//                           </button>
//                         ))}
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
//                 onClick={() => {
//                   if (!customDishName || !customDishPrice) {
//                     enqueueSnackbar("Please enter name and price!", { variant: "warning" });
//                     return;
//                   }
//                   const count = itemCounts[selectedCustomDish._id] || 1;
//                   const newObj = {
//                     _id: selectedCustomDish._id,
//                     dishName: customDishName,
//                     section: selectedCustomDish.section || null,
//                     variationName: "Custom",
//                     pricePerQuantity: parseFloat(customDishPrice),
//                     quantity: count,
//                     price: parseFloat(customDishPrice) * count,
//                   };
//                   dispatch(addItems(newObj));
//                   enqueueSnackbar(`${customDishName} added to cart!`, { variant: "success" });
//                   setIsCustomDishModalOpen(false);
//                   setItemCounts((prev) => ({ ...prev, [selectedCustomDish._id]: 1 }));
//                 }}
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




// for offline
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

// // Function to generate a static color for each category
// const getBgColor = (index) => {
//   const bgarr = ["#FF6B6B", "#7F56D9", "#3B82F6", "#22C55E", "#F59E0B", "#10B981"];
//   return bgarr[index % bgarr.length];
// };

// const MenuContainer = () => {
//   const dispatch = useDispatch();

//   // states for custom dish
//   const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
//   const [customDishName, setCustomDishName] = useState("");
//   const [customDishPrice, setCustomDishPrice] = useState(0);
//   const [selectedCustomDish, setSelectedCustomDish] = useState(null);

//   // States
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [allDishes, setAllDishes] = useState([]);
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [itemCounts, setItemCounts] = useState({});
//   const [categoryItemCounts, setCategoryItemCounts] = useState({});
//   const [selectedVariations, setSelectedVariations] = useState({});

//   // ✅ NEW: Offline states
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [cachedCategories, setCachedCategories] = useState([]);
//   const [cachedDishes, setCachedDishes] = useState([]);
//   const [isLoadingOffline, setIsLoadingOffline] = useState(false);

//   // ✅ Monitor online/offline status
//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       // Refresh data when back online
//       refetchCategories();
//       refetchDishes();
//       fetchInitialData().catch(err => console.warn('Failed to refresh menu data:', err));
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // ✅ Load cached data when offline
//   useEffect(() => {
//     async function loadCachedData() {
//       if (!isOnline) {
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
//   }, [isOnline]);

//   // Fetch categories
//   const { data: categoriesResponse, isError: isCategoriesError, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await getCategories();
      
//       // ✅ Cache categories in background when online
//       if (navigator.onLine) {
//         fetchInitialData().catch(err => 
//           console.warn("Failed to cache menu data in background:", err)
//         );
//       }
      
//       if (Array.isArray(response.data)) return response.data;
//       if (Array.isArray(response.data?.data)) return response.data.data;
//       return [];
//     },
//     onError: () => {
//       if (isOnline) {
//         enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
//       }
//     },
//     enabled: isOnline, // ✅ Only fetch when online
//   });

//   // ✅ Use online or cached categories
//   const categories = isOnline 
//     ? (Array.isArray(categoriesResponse) ? categoriesResponse : [])
//     : cachedCategories;

//   // Fetch dishes
//   const { data: dishes, isError: isDishesError, isLoading: isDishesLoading, refetch: refetchDishes } = useQuery({
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
//     enabled: isOnline, // ✅ Only fetch when online
//   });

//   // ✅ Use online or cached dishes
//   useEffect(() => {
//     if (isOnline && dishes) {
//       setAllDishes(dishes);
//     } else if (!isOnline && cachedDishes.length > 0) {
//       setAllDishes(cachedDishes);
//     }
//   }, [isOnline, dishes, cachedDishes]);

//   useEffect(() => {
//     if (isOnline) {
//       refetchCategories();
//       refetchDishes();
//     }
//   }, [isOnline]);

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

//   // ✅ Set default quantity to 1 for filtered dishes
//   useEffect(() => {
//     if (selectedCategory && allDishes.length > 0) {
//       const filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
//       setFilteredDishes(filtered);

//       // Set default quantity to 1 for all filtered dishes
//       setItemCounts((prevCounts) => {
//         const newCounts = { ...prevCounts };
//         filtered.forEach((dish) => {
//           // Only set to 1 if the item doesn't already have a count
//           if (newCounts[dish._id] === undefined) {
//             newCounts[dish._id] = 1;
//           }
//         });
//         return newCounts;
//       });
//     } else {
//       setFilteredDishes([]);
//     }
//   }, [selectedCategory, allDishes]);

//   // Error and loading states
//   if (isCategoriesError || isDishesError) {
//     if (isOnline) {
//       enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
//     }
//   }

//   // ✅ Loading state for both online and offline
//   if ((isCategoriesLoading && isOnline) || (isDishesLoading && isOnline) || isLoadingOffline) {
//     return (
//       <div className="h-full flex items-center justify-center bg-[#1f1f1f]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
//           <p className="text-[#f5f5f5] text-lg">
//             {isOnline ? 'Loading menu...' : 'Loading cached menu...'}
//           </p>
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

//   // for pos bahrain
//   const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993";
  
//   // for demo server
//   // const CUSTOM_CATEGORY_ID = "690e722d3987e6cf3a2d52e1";

//   // const handleAddToCart = (item) => {
//   //   const count = itemCounts[item._id] || 1;

//   //   // Check if this is a custom dish
//   //   if (item.category === CUSTOM_CATEGORY_ID) {
//   //     setSelectedCustomDish(item);
//   //     setCustomDishName("");
//   //     setCustomDishPrice('');
//   //     setIsCustomDishModalOpen(true);
//   //     return;
//   //   }

//   //   // --- Regular dish flow ---
//   //   const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);
//   //   if (!selectedVariation) {
//   //     enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
//   //     return;
//   //   }

//   //   const newObj = {
//   //     _id: item._id,
//   //     dishName: item.dishName,
//   //     section: item.section || selectedVariation.section || null,
//   //     variationName: selectedVariation.name,
//   //     pricePerQuantity: selectedVariation.price,
//   //     quantity: count,
//   //     price: selectedVariation.price * count,
//   //   };

//   //   dispatch(addItems(newObj));
//   //   enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

//   //   // ✅ Reset to 1 instead of 0 after adding to cart
//   //   setItemCounts((prevCounts) => ({
//   //     ...prevCounts,
//   //     [item._id]: 1,
//   //   }));
//   // };

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
//       _id: item._id,                    // ✅ Ensure this exists
//       menuItem: item._id,                // ✅ Add this
//       dishId: item._id,                  // ✅ Add this
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

//   return (
//     <div className="h-full flex flex-col">
//       {/* Categories Section */}
//       <div className="h-[22vh] lg:h-[20vh] xl:h-[22vh] 2xl:h-[24vh] min-h-[160px] lg:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px] border-b-2 border-[#2a2a2a] flex flex-col flex-shrink-0">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-1.5 xl:py-2 flex-shrink-0">
//           {/* <h2 className="text-xl lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Menu Categories</h2> */}
//         </div>

//         {/* Scrollable Categories */}
//         <div className="flex-1 py-1 px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 pb-3 lg:pb-2 xl:pb-3 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           {categories.length === 0 ? (
//             <div className="text-center text-[#ababab] text-lg lg:text-base xl:text-lg font-semibold py-6 lg:py-4 xl:py-6">
//               No categories found
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
//               {categories.map((category, index) => {
//                 if (!category || !category._id) return null;
//                 const isSelected = selectedCategory?._id === category._id;
//                 const itemCount = categoryItemCounts[category._id] || 0;
//                 const hasImage = category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim());

//                 return (
//                   <div
//                     key={category._id}
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
//       <hr className="border-[#2a2a2a] border-t-2" />

//       {/* Dishes Section */}
//       <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//         <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 2xl:py-4 pb-16 lg:pb-12 xl:pb-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4">
//             {filteredDishes.map((item) => {
//               const variations = item.variations || [];
//               const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

//               return (
//                 <div
//                   key={item._id}
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
//                         {variations.map((variation) => (
//                           <button
//                             key={variation.name}
//                             onClick={() => handleVariationChange(item._id, variation)}
//                             className={`px-2.5 py-1 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 2xl:py-1.5 rounded-lg text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
//                               selectedVar?.name === variation.name
//                                 ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
//                                 : 'bg-[#2f2f2f]/80 text-white border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-105'
//                             }`}
//                           >
//                             {variation.name} - BHD {variation.price.toFixed(3)}
//                           </button>
//                         ))}
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
//                 onClick={() => {
//                   if (!customDishName || !customDishPrice) {
//                     enqueueSnackbar("Please enter name and price!", { variant: "warning" });
//                     return;
//                   }
//                   const count = itemCounts[selectedCustomDish._id] || 1;
//                   const newObj = {
//                     _id: selectedCustomDish._id,
//                     dishName: customDishName,
//                     section: selectedCustomDish.section || null,
//                     variationName: "Custom",
//                     pricePerQuantity: parseFloat(customDishPrice),
//                     quantity: count,
//                     price: parseFloat(customDishPrice) * count,
//                   };
//                   dispatch(addItems(newObj));
//                   enqueueSnackbar(`${customDishName} added to cart!`, { variant: "success" });
//                   setIsCustomDishModalOpen(false);
//                   setItemCounts((prev) => ({ ...prev, [selectedCustomDish._id]: 1 }));
//                 }}
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


import React, { useState, useEffect } from 'react';
import { GrRadialSelected } from 'react-icons/gr';
import { GiShoppingCart } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { addItems } from '../../redux/slice/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getDishes } from '../../https';
import { enqueueSnackbar } from 'notistack';
import { fetchInitialData, getCachedInitialData } from '../../utils/offlineMenu';

// Helper function to ensure unique keys
const ensureUniqueKey = (id, index, prefix = '') => {
  if (!id || typeof id !== 'string' || id.length < 3) {
    console.warn(`⚠️ Invalid ID detected: "${id}" at index ${index}`);
    return `${prefix}fallback-${index}-${uuid()}`;
  }
  return `${prefix}${id}`;
};

// Helper function for background colors
const getBgColor = (index) => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
    '#fd79a8', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe'
  ];
  return colors[index % colors.length];
};

const MenuContainer = () => {
  const dispatch = useDispatch();

  // States for custom dish
  const [isCustomDishModalOpen, setIsCustomDishModalOpen] = useState(false);
  const [customDishName, setCustomDishName] = useState("");
  const [customDishPrice, setCustomDishPrice] = useState("");
  const [selectedCustomDish, setSelectedCustomDish] = useState(null);

  // States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [categoryItemCounts, setCategoryItemCounts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});

  // Offline states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedCategories, setCachedCategories] = useState([]);
  const [cachedDishes, setCachedDishes] = useState([]);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);

  // Custom category ID
  const CUSTOM_CATEGORY_ID = "690e724f26e356c8eef29993"; // Bahrain
  // const CUSTOM_CATEGORY_ID = "690e722d3987e6cf3a2d52e1"; // Demo

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refetchCategories();
      refetchDishes();
      fetchInitialData().catch(err => console.warn('Failed to refresh menu data:', err));
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load cached data when offline
  useEffect(() => {
    async function loadCachedData() {
      if (!isOnline) {
        setIsLoadingOffline(true);
        try {
          const { categories: cached_cats, dishes: cached_dishes } = await getCachedInitialData();
          setCachedCategories(cached_cats);
          setCachedDishes(cached_dishes);
          console.log(`📦 Loaded ${cached_cats.length} cached categories and ${cached_dishes.length} cached dishes`);
        } catch (error) {
          console.error("Error loading cached menu data:", error);
        } finally {
          setIsLoadingOffline(false);
        }
      }
    }

    loadCachedData();
  }, [isOnline]);

  // Fetch categories
  const { data: categoriesResponse, isError: isCategoriesError, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      
      // Cache categories in background when online
      if (navigator.onLine) {
        fetchInitialData().catch(err => 
          console.warn("Failed to cache menu data in background:", err)
        );
      }
      
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    },
    onError: () => {
      if (isOnline) {
        enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
      }
    },
    enabled: isOnline,
  });

  // Use online or cached categories
  const categories = isOnline 
    ? (Array.isArray(categoriesResponse) ? categoriesResponse : [])
    : cachedCategories;

  // Fetch dishes
  const { data: dishes, isError: isDishesError, isLoading: isDishesLoading, refetch: refetchDishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const response = await getDishes();

      const convertedDishes = (response.data.data || []).map((dish) => ({
        ...dish,
        variations: dish.variations?.map((v) => ({
          ...v,
        })) || [],
      }));

      setAllDishes(convertedDishes);
      return convertedDishes;
    },
    enabled: isOnline,
  });

  // Use online or cached dishes
  useEffect(() => {
    if (isOnline && dishes) {
      setAllDishes(dishes);
    } else if (!isOnline && cachedDishes.length > 0) {
      setAllDishes(cachedDishes);
    }
  }, [isOnline, dishes, cachedDishes]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline) {
      refetchCategories();
      refetchDishes();
    }
  }, [isOnline]);

  // ✅ Debug categories for duplicate IDs
  useEffect(() => {
    if (categories.length > 0) {
      console.log('📋 Categories loaded:', categories.length);
      
      const ids = categories.map(c => c?._id).filter(Boolean);
      const uniqueIds = new Set(ids);
      
      if (ids.length !== uniqueIds.size) {
        console.error('❌ DUPLICATE CATEGORY IDs DETECTED!');
        categories.forEach((cat, idx) => {
          console.log(`Category ${idx}:`, cat?._id, cat?.categoryName);
        });
      }
    }
  }, [categories]);

  // ✅ Debug dishes for duplicate IDs
  useEffect(() => {
    if (allDishes.length > 0) {
      console.log('🍽️ Dishes loaded:', allDishes.length);
      
      const ids = allDishes.map(d => d?._id).filter(Boolean);
      const uniqueIds = new Set(ids);
      
      if (ids.length !== uniqueIds.size) {
        console.error('❌ DUPLICATE DISH IDs DETECTED!');
        allDishes.forEach((dish, idx) => {
          console.log(`Dish ${idx}:`, dish?._id, dish?.dishName);
        });
      }
    }
  }, [allDishes]);

  // Count items per category
  useEffect(() => {
    if (categories.length > 0 && allDishes.length > 0) {
      const counts = {};
      categories.forEach((category) => {
        if (!category || !category._id) return;
        const count = allDishes.filter((dish) => dish.category === category._id).length;
        counts[category._id] = count;
      });
      setCategoryItemCounts(counts);
    }
  }, [categories, allDishes]);

  // Default category
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Set default quantity to 1 for filtered dishes
  useEffect(() => {
    if (selectedCategory && allDishes.length > 0) {
      const filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
      setFilteredDishes(filtered);

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
  }, [selectedCategory, allDishes]);

  // Error states
  if (isCategoriesError || isDishesError) {
    if (isOnline) {
      enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
    }
  }

  // Loading state
  if ((isCategoriesLoading && isOnline) || (isDishesLoading && isOnline) || isLoadingOffline) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1f1f1f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02ca3a] mx-auto mb-4"></div>
          <p className="text-[#f5f5f5] text-lg">
            {isOnline ? 'Loading menu...' : 'Loading cached menu...'}
          </p>
        </div>
      </div>
    );
  }

  // Increment/Decrement
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

  // Select variation
  const handleVariationChange = (dishId, variation) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [dishId]: variation,
    }));
  };

  // Add to cart handler
  const handleAddToCart = (item) => {
    const count = itemCounts[item._id] || 1;

    // Check if this is a custom dish
    if (item.category === CUSTOM_CATEGORY_ID) {
      setSelectedCustomDish(item);
      setCustomDishName("");
      setCustomDishPrice('');
      setIsCustomDishModalOpen(true);
      return;
    }

    const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);
    if (!selectedVariation) {
      enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
      return;
    }

    const newObj = {
      _id: item._id,
      menuItem: item._id,
      dishId: item._id,
      dishName: item.dishName,
      section: item.section || selectedVariation.section || null,
      variationName: selectedVariation.name,
      pricePerQuantity: selectedVariation.price,
      quantity: count,
      price: selectedVariation.price * count,
    };

    dispatch(addItems(newObj));
    enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [item._id]: 1,
    }));
  };

  // ✅ Custom dish handler with unique ID
  // const handleAddCustomDish = () => {
  //   if (!customDishName || !customDishPrice) {
  //     enqueueSnackbar("Please enter name and price!", { variant: "warning" });
  //     return;
  //   }
    
  //   const count = itemCounts[selectedCustomDish._id] || 1;
    
  //   // Generate truly unique ID for each custom dish
  //   const customDishId = `custom-${uuid()}`;
    
  //   const newObj = {
  //     _id: customDishId,
  //     menuItem: customDishId,
  //     dishId: customDishId,
  //     dishName: customDishName,
  //     section: selectedCustomDish.section || null,
  //     variationName: "Custom",
  //     pricePerQuantity: parseFloat(customDishPrice),
  //     quantity: count,
  //     price: parseFloat(customDishPrice) * count,
  //   };
    
  //   dispatch(addItems(newObj));
  //   enqueueSnackbar(`${customDishName} added to cart!`, { variant: "success" });
  //   setIsCustomDishModalOpen(false);
  //   setCustomDishName("");
  //   setCustomDishPrice('');
  // };

const handleAddCustomDish = () => {
  if (!customDishName || !customDishPrice) {
    enqueueSnackbar("Please enter name and price!", { variant: "warning" });
    return;
  }

  const count = itemCounts[selectedCustomDish._id] || 1;

  // FIXED: proper UUID
  const customDishId = `custom-${uuidv4()}`;

  const newObj = {
    _id: customDishId,
    menuItem: customDishId,
    dishId: customDishId,
    dishName: customDishName,
    section: selectedCustomDish.section || null,
    variationName: "Custom",
    pricePerQuantity: parseFloat(customDishPrice),
    quantity: count,
    price: parseFloat(customDishPrice) * count,
  };

  dispatch(addItems(newObj));
  enqueueSnackbar(`${customDishName} added to cart!`, { variant: "success" });
  setIsCustomDishModalOpen(false);
  setCustomDishName("");
  setCustomDishPrice('');
};



  return (
    <div className="h-full flex flex-col">
      {/* Categories Section */}
      <div className="h-[22vh] lg:h-[20vh] xl:h-[22vh] 2xl:h-[24vh] min-h-[160px] lg:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px] border-b-2 border-[#2a2a2a] flex flex-col flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-2 lg:py-1.5 xl:py-2 flex-shrink-0">
          {/* <h2 className="text-xl lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">Menu Categories</h2> */}
        </div>

        {/* Scrollable Categories */}
        <div className="flex-1 py-1 px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 pb-3 lg:pb-2 xl:pb-3 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.length === 0 ? (
            <div className="text-center text-[#ababab] text-lg lg:text-base xl:text-lg font-semibold py-6 lg:py-4 xl:py-6">
              No categories found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {categories.map((category, index) => {
                if (!category || !category._id) {
                  console.warn(`⚠️ Skipping invalid category at index ${index}`);
                  return null;
                }
                
                // ✅ Ensure unique key with fallback
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
                          onError={e => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500"></div>
                      </>
                    ) : (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${getBgColor(index)} 0%, ${getBgColor(index)}dd 100%)`
                          }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                      </>
                    )}

                    <div className="relative z-10">
                      <h3
                        className={`text-xs lg:text-[11px] xl:text-xs 2xl:text-sm font-bold line-clamp-2 mb-1 ${
                          hasImage
                            ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                            : 'text-white drop-shadow-lg'
                        }`}
                      >
                        {category.categoryName}
                      </h3>

                      <div className="flex items-center gap-1.5 lg:gap-1 xl:gap-1.5">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 lg:px-1 lg:py-0.5 xl:px-1.5 xl:py-0.5 2xl:px-2 2xl:py-1 rounded-full transition-all duration-300 ${
                          hasImage
                            ? 'bg-black/70 backdrop-blur-md border border-white/10'
                            : 'bg-white/25 backdrop-blur-sm border border-white/20'
                        } ${isSelected ? 'ring-1 ring-yellow-400/50' : ''}`}>
                          <p className="text-white text-[10px] lg:text-[9px] xl:text-[10px] 2xl:text-xs font-semibold">
                            {itemCount} Items
                          </p>
                          {isSelected && (
                            <GrRadialSelected className="text-yellow-400 flex-shrink-0 animate-pulse" size={10} />
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-xl ring-2 ring-yellow-400 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-xl ring-1 ring-yellow-300/50 blur-sm pointer-events-none"></div>
                      </>
                    )}

                    {!isSelected && (
                      <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <hr className="border-[#2a2a2a] border-t-2" />

      {/* Dishes Section */}
      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-6 py-3 lg:py-2 xl:py-3 2xl:py-4 pb-16 lg:pb-12 xl:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-2 xl:gap-3 2xl:gap-4">
            {filteredDishes.map((item, index) => {
              if (!item || !item._id) {
                console.warn(`⚠️ Skipping invalid dish at index ${index}`);
                return null;
              }

              // ✅ Ensure unique key with fallback
              const uniqueKey = ensureUniqueKey(item._id, index, 'dish-');
              const variations = item.variations || [];
              const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

              return (
                <div
                  key={uniqueKey}
                  className="relative flex flex-col items-start justify-between p-3 lg:p-2.5 xl:p-3 2xl:p-4 rounded-xl h-auto cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] hover:scale-[1.02] hover:shadow-xl shadow-lg group overflow-hidden border-2 border-[#2a2a2a] hover:border-[#3a3a3a]"
                >
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none group-hover:ring-white/20 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/5 transition-all duration-500 rounded-xl"></div>

                  <div className="relative z-10 w-full">
                    {/* Header */}
                    <div className="flex items-start justify-between w-full mb-2 lg:mb-1.5 xl:mb-2">
                      <h1 className="text-[#f5f5f5] text-base lg:text-sm xl:text-base 2xl:text-lg font-bold drop-shadow-sm pr-2 line-clamp-2">
                        {item.dishName}
                      </h1>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="text-[#02ca3a] hover:text-[#03e844] transition-all duration-300 hover:scale-110 flex-shrink-0"
                      >
                        <GiShoppingCart size={24} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
                      </button>
                    </div>

                    {/* Variations */}
                    {variations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 my-2 lg:my-1.5 xl:my-2">
                        {variations.map((variation, vIndex) => {
                          // ✅ Unique key for variations
                          const varKey = `${item._id}-${variation.name}-${vIndex}`;
                          
                          return (
                            <button
                              key={varKey}
                              onClick={() => handleVariationChange(item._id, variation)}
                              className={`px-2.5 py-1 lg:px-2 lg:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 2xl:py-1.5 rounded-lg text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-300 border backdrop-blur-sm ${
                                selectedVar?.name === variation.name
                                  ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30 scale-105'
                                  : 'bg-[#2f2f2f]/80 text-white border-[#3a3a3a] hover:bg-[#3a3a3a] hover:border-[#4a4a4a] hover:scale-105'
                              }`}
                            >
                              {variation.name} - BHD {variation.price.toFixed(3)}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Price and Controls */}
                    <div className="flex items-center justify-between w-full mt-3 lg:mt-2 xl:mt-3 pt-2 lg:pt-1.5 xl:pt-2 border-t border-[#3a3a3a]">
                      <p className="text-[#f5f5f5] text-lg lg:text-base xl:text-lg 2xl:text-xl font-bold drop-shadow-sm">
                        {selectedVar ? `BHD ${selectedVar.price.toFixed(3)}` : 'N/A'}
                      </p>
                      <div className="flex items-center justify-between bg-black/40 backdrop-blur-md px-3 py-1.5 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-2 rounded-lg gap-4 lg:gap-3 xl:gap-4 2xl:gap-5 border-2 border-[#3a3a3a] shadow-inner">
                        <button
                          onClick={() => decrement(item._id)}
                          className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95"
                        >
                          &minus;
                        </button>
                        <span className="text-white font-bold text-base lg:text-sm xl:text-base 2xl:text-lg min-w-[16px] lg:min-w-[14px] xl:min-w-[16px] 2xl:min-w-[20px] text-center">
                          {itemCounts[item._id] || 1}
                        </span>
                        <button
                          onClick={() => increment(item._id)}
                          className="text-yellow-500 hover:text-yellow-400 text-xl lg:text-lg xl:text-xl 2xl:text-2xl cursor-pointer transition-all duration-200 hover:scale-125 active:scale-95"
                        >
                          &#43;
                        </button>
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
            <input
              type="text"
              placeholder="Dish Name"
              value={customDishName}
              onChange={(e) => setCustomDishName(e.target.value)}
              className="w-full mb-3 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm"
            />
            <input
              type="number"
              placeholder="Price"
              value={customDishPrice}
              onChange={(e) => setCustomDishPrice(e.target.value)}
              className="w-full mb-4 lg:mb-3 xl:mb-4 px-3 py-2 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-2 rounded-lg bg-[#2a2a2a] text-white text-sm lg:text-xs xl:text-sm"
            />
            <div className="flex justify-end gap-3 lg:gap-2 xl:gap-3">
              <button
                onClick={() => setIsCustomDishModalOpen(false)}
                className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-gray-500 rounded-lg text-white text-sm lg:text-xs xl:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomDish}
                className="px-4 py-2 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 bg-yellow-500 rounded-lg text-black font-semibold text-sm lg:text-xs xl:text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuContainer;