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

//   // State for selected category, all dishes, and filtered dishes
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [allDishes, setAllDishes] = useState([]);
//   const [filteredDishes, setFilteredDishes] = useState([]);
//   const [itemCounts, setItemCounts] = useState({});
//   const [categoryItemCounts, setCategoryItemCounts] = useState({});

//   // Fetch categories
//   // Robustly fetch categories and always use array
//   const { data: categoriesResponse, isError: isCategoriesError, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const response = await getCategories();
//       console.log('Categories Response:', response);
//       // Accepts both array and object with data property
//       if (Array.isArray(response.data)) return response.data;
//       if (Array.isArray(response.data?.data)) return response.data.data;
//       return [];
//     },
//     onError: () => {
//       enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
//     },
//   });

//   // Always use categories as an array
//   const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];

//   // Fetch all dishes
//   const { data: dishes, isError: isDishesError, isLoading: isDishesLoading, refetch: refetchDishes } = useQuery({
//     queryKey: ['dishes'],
//     queryFn: async () => {
//       const response = await getDishes();
//       console.log('Dishes API Response:', response);
//       setAllDishes(response.data.data); // Store all dishes in state
//       return response.data.data;
//     },
//   });

//   // Re-fetch data when the component mounts
//   useEffect(() => {
//     refetchCategories();
//     refetchDishes();
//   }, [refetchCategories, refetchDishes]);

//   // Calculate the number of dishes for each category
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

//   // Set the default category when both categories and dishes are loaded
//   useEffect(() => {
//     if (categories.length > 0 && selectedCategory === null) {
//       setSelectedCategory(categories[0]);
//     }
//   }, [categories, selectedCategory]);

//   // Update filteredDishes when selectedCategory or allDishes changes
//   useEffect(() => {
//     if (selectedCategory && allDishes.length > 0) {
//       const filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
//       console.log('Filtered Dishes:', filtered); // Debugging
//       setFilteredDishes(filtered);
//     } else {
//       setFilteredDishes([]); // Reset filteredDishes if no category or dishes are selected
//     }
//   }, [selectedCategory, allDishes]);

//   // Handle errors for categories and dishes fetch
//   if (isCategoriesError || isDishesError) {
//     enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
//   }

//   // Show loading state while fetching categories or dishes
//   if (isCategoriesLoading || isDishesLoading) {
//     return <div>Loading...</div>;
//   }

//   // Increment item count
//   const increment = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: (prevCounts[id] || 0) + 1,
//     }));
//   };

//   // Decrement item count
//   const decrement = (id) => {
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [id]: Math.max((prevCounts[id] || 0) - 1, 0),
//     }));
//   };

//   // Add item to cart
//   const handleAddToCart = (item) => {
//     const count = itemCounts[item._id] || 0;
//     if (count === 0) return;
//     const { dishName, dishPrice } = item;
//     const newObj = {
//       id: uuidv4(),
//       name: dishName,
//       pricePerQuantity: dishPrice,
//       quantity: count,
//       price: dishPrice,
//     };
//     dispatch(addItems(newObj));
//     setItemCounts((prevCounts) => ({
//       ...prevCounts,
//       [item._id]: 0, // Reset the count for this item after adding to cart
//     }));
//   };

//   return (
//     <>
//       {/* Menu Categories */}
//       <div className="grid grid-cols-4 gap-4 px-10 py-4 overflow-y-scroll h-[240px] hidden-scrollbar">
//         {categories.length === 0 ? (
//           <div className="col-span-4 text-center text-[#ababab] text-lg font-semibold">No categories found</div>
//         ) : (
//           categories.map((category, index) => {
//             if (!category || !category._id) return null;
//             return (
//               <div
//                 key={category._id}
//                 className="flex flex-col items-start justify-between p-4 rounded-lg h-[120px] cursor-pointer transition-transform hover:scale-104"
//                 style={{ backgroundColor: getBgColor(index) }}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   console.log('Selected Category:', {
//                     id: category._id,
//                     name: category.categoryName,
//                   });
//                 }}
//               >
//                 <div className="flex items-center justify-between w-full mb-2">
//                   <h1 className="text-[#f5f5f5] text-lg font-semibold">
//                     {category.categoryName}
//                   </h1>
//                   {selectedCategory?._id === category._id && (
//                     <GrRadialSelected className="text-white size={20}" />
//                   )}
//                 </div>
//                 {/* Category image preview */}
//                 {category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim()) && (
//                   <div className="w-full flex justify-center mb-2">
//                     <img
//                       src={category.imageUrl}
//                       alt={category.categoryName}
//                       className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full border border-[#383838] bg-white transition-all duration-200"
//                       style={{ maxWidth: '100%', height: 'auto', maxHeight: '80px', minHeight: '48px' }}
//                       onError={e => { e.target.style.display = 'none'; }}
//                     />
//                   </div>
//                 )}
//                 <p className="text-white text-sm font-semibold">
//                   {categoryItemCounts[category._id] || 0} Items
//                 </p>
//               </div>
//             );
//           })
//         )}
//       </div>
//       <hr className="border-[#2a2a2a] border-t-2 mt-4" />

//       {/* Dishes for Selected Category */}
//       <div>
//         <div className="grid grid-cols-4 gap-4 px-10 py-4 overflow-y-scroll h-auto hidden-scrollbar">
//           {filteredDishes.map((item) => {
//             console.log('Rendering Dish:', {
//               id: item._id,
//               name: item.dishName,
//               price: item.variations,
//             }); // Debugging
//             return (
//               <div
//                 key={item._id}
//                 className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer transition-transform hover:scale-104 hover:bg-[#2a2a2a] bg-[#1a1a1a]"
//               >
//                 <div className="flex items-start justify-between w-full">
//                   <h1 className="text-[#f5f5f5] text-lg font-semibold">
//                     {item.dishName}
//                   </h1>
//                   <button
//                     onClick={() => handleAddToCart(item)}
//                     className="text-[#02ca3a] cursor-pointer"
//                   >
//                     <GiShoppingCart size={30} />
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between w-full">
//                   <p className="text-[#f5f5f5] text-xl font-bold">
//                     Rs{item.dishPrice}
//                   </p>
//                   <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 z-1">
//                     <button
//                       onClick={() => decrement(item._id)}
//                       className="text-yellow-500 text-2xl cursor-pointer"
//                     >
//                       &minus;
//                     </button>
//                     <span className="text-white">
//                       {itemCounts[item._id] || 0}
//                     </span>
//                     <button
//                       onClick={() => increment(item._id)}
//                       className="text-yellow-500 text-2xl cursor-pointer"
//                     >
//                       &#43;
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
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

// Function to generate a static color for each category
const getBgColor = (index) => {
  const bgarr = ["#FF6B6B", "#7F56D9", "#3B82F6", "#22C55E", "#F59E0B", "#10B981"];
  return bgarr[index % bgarr.length];
};

const MenuContainer = () => {
  const dispatch = useDispatch();

  // States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [categoryItemCounts, setCategoryItemCounts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});

  // Fetch categories
  const { data: categoriesResponse, isError: isCategoriesError, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    },
    onError: () => {
      enqueueSnackbar('Failed to fetch categories!', { variant: 'error' });
    },
  });

  const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];

  // Fetch dishes
  const { data: dishes, isError: isDishesError, isLoading: isDishesLoading, refetch: refetchDishes } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const response = await getDishes();

      // 🟢 Convert prices from BHD * 1000 → BHD
      const convertedDishes = (response.data.data || []).map((dish) => ({
        ...dish,
        variations: dish.variations?.map((v) => ({
          ...v,
          price: v.price / 1000, // convert price to BHD
        })) || [],
      }));

      setAllDishes(convertedDishes);
      return convertedDishes;
    },
  });

  useEffect(() => {
    refetchCategories();
    refetchDishes();
  }, [refetchCategories, refetchDishes]);

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

  // Filter dishes for selected category
  useEffect(() => {
    if (selectedCategory && allDishes.length > 0) {
      const filtered = allDishes.filter((dish) => dish.category === selectedCategory._id);
      setFilteredDishes(filtered);
    } else {
      setFilteredDishes([]);
    }
  }, [selectedCategory, allDishes]);

  // Error and loading states
  if (isCategoriesError || isDishesError) {
    enqueueSnackbar('Failed to fetch data!', { variant: 'error' });
  }

  if (isCategoriesLoading || isDishesLoading) {
    return <div>Loading...</div>;
  }

  // Increment/Decrement
  const increment = (id) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  const decrement = (id) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max((prevCounts[id] || 0) - 1, 0),
    }));
  };

  // Select variation
  const handleVariationChange = (dishId, variation) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [dishId]: variation,
    }));
  };



// Add to cart
const handleAddToCart = (item) => {
  const count = itemCounts[item._id] || 0;
  if (count === 0) return;

  const selectedVariation = selectedVariations[item._id] || item.variations?.find(v => v.isDefault);
  if (!selectedVariation) {
    enqueueSnackbar('Please select a variation first.', { variant: 'warning' });
    return;
  }

  // ✅ Use MongoDB _id as dishId (real reference)
  const newObj = {
    _id: item._id, // real MongoDB dish ID
    dishName: item.dishName,
    section: item.section || selectedVariation.section || null, // ✅ include section
    variationName: selectedVariation.name,
    pricePerQuantity: selectedVariation.price,
    quantity: count,
    price: selectedVariation.price * count,
  };

  dispatch(addItems(newObj));
  enqueueSnackbar(`${item.dishName} (${selectedVariation.name}) added to cart!`, { variant: 'success' });

  setItemCounts((prevCounts) => ({
    ...prevCounts,
    [item._id]: 0,
  }));
};




  return (
    <>
      {/* Menu Categories */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 overflow-y-scroll h-[240px] hidden-scrollbar">
        {categories.length === 0 ? (
          <div className="col-span-4 text-center text-[#ababab] text-lg font-semibold">No categories found</div>
        ) : (
          categories.map((category, index) => {
            if (!category || !category._id) return null;
            return (
              <div
                key={category._id}
                className="flex flex-col items-start justify-between p-4 rounded-lg h-[120px] cursor-pointer transition-transform hover:scale-104"
                style={{ backgroundColor: getBgColor(index) }}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <h1 className="text-[#f5f5f5] text-lg font-semibold">{category.categoryName}</h1>
                  {selectedCategory?._id === category._id && (
                    <GrRadialSelected className="text-white" size={20} />
                  )}
                </div>

                {category.imageUrl && /^https?:\/\//i.test(category.imageUrl.trim()) && (
                  <div className="w-full flex justify-center mb-2">
                    <img
                      src={category.imageUrl}
                      alt={category.categoryName}
                      className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-full border border-[#383838] bg-white"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <p className="text-white text-sm font-semibold">
                  {categoryItemCounts[category._id] || 0} Items
                </p>
              </div>
            );
          })
        )}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Dishes */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 overflow-y-scroll h-auto hidden-scrollbar">
        {filteredDishes.map((item) => {
          const variations = item.variations || [];
          const selectedVar = selectedVariations[item._id] || variations.find(v => v.isDefault);

          return (
            <div
              key={item._id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-auto cursor-pointer transition-transform hover:scale-104 hover:bg-[#2a2a2a] bg-[#1a1a1a]"
            >
              <div className="flex items-start justify-between w-full mb-2">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">{item.dishName}</h1>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="text-[#02ca3a] cursor-pointer"
                >
                  <GiShoppingCart size={30} />
                </button>
              </div>

              {/* Variation Selector */}
              {variations.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {variations.map((variation) => (
                    <button
                      key={variation.name}
                      onClick={() => handleVariationChange(item._id, variation)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all border ${
                        selectedVar?.name === variation.name
                          ? 'bg-yellow-500 text-black border-yellow-500'
                          : 'bg-[#2f2f2f] text-white border-[#3a3a3a] hover:bg-[#3a3a3a]'
                      }`}
                    >
                      {variation.name} - BHD {variation.price.toFixed(3)}
                    </button>
                  ))}
                </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center justify-between w-full mt-2">
                <p className="text-[#f5f5f5] text-xl font-bold">
                  {selectedVar ? `BHD ${selectedVar.price.toFixed(3)}` : 'N/A'}
                </p>
                <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6">
                  <button
                    onClick={() => decrement(item._id)}
                    className="text-yellow-500 text-2xl cursor-pointer"
                  >
                    &minus;
                  </button>
                  <span className="text-white">{itemCounts[item._id] || 0}</span>
                  <button
                    onClick={() => increment(item._id)}
                    className="text-yellow-500 text-2xl cursor-pointer"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MenuContainer;
