import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllDishRecipes,
  deleteDishRecipe,
  getCategories,
  getDishes,
} from "../../https";
import { enqueueSnackbar } from "notistack";
import { FiTrash2, FiChevronDown, FiChevronUp, FiX  } from "react-icons/fi";
import { CiInboxOut } from "react-icons/ci";

const DishRecipeEditPanel = () => {
  const queryClient = useQueryClient();
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const [expandedRecipes, setExpandedRecipes] = useState({});

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch categories!", { variant: "error" });
    },
  });

  

  // Fetch all dishes
  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch dishes!", { variant: "error" });
    },
  });

  // Fetch dish recipes
  const { data: recipesData, isLoading: recipesLoading, isError: recipesError } = useQuery({
    queryKey: ["dishRecipes"],
    queryFn: getAllDishRecipes,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch dish recipes!", { variant: "error" });
    },
  });

  // Extract data
  const recipes = Array.isArray(recipesData?.data?.data) ? recipesData.data.data : [];
  const categories = Array.isArray(categoriesData?.data?.data) ? categoriesData.data.data : [];
  const allDishes = Array.isArray(dishesData?.data?.data) ? dishesData.data.data : [];

  // Filter dishes by selected category
  const filteredDishes = useMemo(() => {
    if (!selectedCategory) return allDishes;
    return allDishes.filter((dish) => dish.category === selectedCategory);
  }, [allDishes, selectedCategory]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;
    
    if (recipeSearchQuery) {
      filtered = filtered.filter((recipe) => {
        const dishName = allDishes.find((d) => d._id === recipe.dishId?._id)?.dishName || recipe.dishId?.dishName || "";
        return (
          dishName.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
          recipe.variationName?.toLowerCase().includes(recipeSearchQuery.toLowerCase())
        );
      });
    }
    
    if (selectedDish) {
      filtered = filtered.filter((recipe) => recipe.dishId?._id === selectedDish);
    }
    
    return filtered;
  }, [recipes, recipeSearchQuery, selectedDish, allDishes]);

  // Mutation for deleting a dish recipe
  const deleteRecipeMutation = useMutation({
    mutationFn: deleteDishRecipe,
    onSuccess: () => {
      enqueueSnackbar("Dish recipe deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishRecipes"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete dish recipe!", { variant: "error" });
    },
  });

  // Handle deleting a recipe
  const handleDeleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this dish recipe?")) {
      deleteRecipeMutation.mutate(id);
    }
  };

  // Get dish name by ID
  const getDishName = (dishId) => {
    const dish = allDishes.find((d) => d._id === dishId);
    return dish?.dishName || "Unknown Dish";
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category?.categoryName || "Unknown Category";
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedDish("");
  };

  // Toggle recipe expansion
  const toggleRecipeExpansion = (recipeId) => {
    setExpandedRecipes((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

   const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [selectedRecipeForStockOut, setSelectedRecipeForStockOut] = useState(null);
  const [quantitySold, setQuantitySold] = useState('');
  
  const handleStockOutClick = (recipe) => {
    setSelectedRecipeForStockOut(recipe);
    setQuantitySold('');
    setShowStockOutModal(true);
  };

  const handleStockOutSubmit = () => {
    if (!quantitySold || quantitySold <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    // Your stock out logic here
    console.log('Stock out:', {
      recipeId: selectedRecipeForStockOut._id,
      quantitySold: parseFloat(quantitySold)
    });
    
    // Close modal and reset
    setShowStockOutModal(false);
    setSelectedRecipeForStockOut(null);
    setQuantitySold('');
  };

  const handleCloseModal = () => {
    setShowStockOutModal(false);
    setSelectedRecipeForStockOut(null);
    setQuantitySold('');
  };
//   return (
//     <div>
//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
//         <input
//           type="text"
//           placeholder="Search by dish or variation name..."
//           value={recipeSearchQuery}
//           onChange={(e) => setRecipeSearchQuery(e.target.value)}
//           className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => handleCategoryChange(e.target.value)}
//           className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//         >
//           <option value="">All Categories</option>
//           {categories.map((category) => (
//             <option key={category._id} value={category._id}>
//               {category.categoryName}
//             </option>
//           ))}
//         </select>
//         <select
//           value={selectedDish}
//           onChange={(e) => setSelectedDish(e.target.value)}
//           className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
//         >
//           <option value="">All Dishes</option>
//           {filteredDishes.map((dish) => (
//             <option key={dish._id} value={dish._id}>
//               {dish.dishName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Loading State */}
//       {recipesLoading && (
//         <div className="flex justify-center items-center py-12">
//           <svg
//             className="animate-spin h-8 w-8 text-gray-400"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8H4z"
//             />
//           </svg>
//           <span className="ml-3 text-gray-400">Loading dish recipes...</span>
//         </div>
//       )}

//       {/* Error State */}
//       {recipesError && (
//         <div className="text-center text-red-400 py-12">
//           Failed to load dish recipes. Please try again.
//         </div>
//       )}

//       {/* Empty State */}
//       {!recipesLoading && !recipesError && filteredRecipes.length === 0 && (
//         <div className="text-center text-gray-400 py-12">
//           No dish recipes found.
//         </div>
//       )}

//       {/* Desktop Table View */}
//       {!recipesLoading && !recipesError && filteredRecipes.length > 0 && (
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full text-left text-[#f5f5f5]">
//             <thead className="bg-[#333] text-[#ababab]">
//               <tr>
//                 <th className="pl-5 py-3">Category</th>
//                 <th className="pl-5 py-3">Dish Name</th>
//                 <th className="pl-5 py-3">Variation</th>
//                 <th className="pl-5 py-3">Ingredients</th>
//                 <th className="p-3 text-center w-24">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRecipes.map((recipe) => {
//                 const dish = allDishes.find((d) => d._id === recipe.dishId?._id);
//                 const isExpanded = expandedRecipes[recipe._id];
//                 const ingredients = recipe.ingredients || [];
//                 const showToggle = ingredients.length > 5;
//                 const displayedIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);

//                 return (
//                   <tr key={recipe._id} className="border-b border-gray-600 hover:bg-[#333]">
//                     <td className="py-3 pl-5">
//                       <span className="text-[#f5f5f5] text-sm">
//                         {dish ? getCategoryName(dish.category) : "Unknown"}
//                       </span>
//                     </td>
//                     <td className="py-3 pl-5">
//                       <span className="text-[#f5f5f5] font-medium">
//                         {getDishName(recipe.dishId?._id)}
//                       </span>
//                     </td>
//                     <td className="py-3 pl-5">
//                       <span className="text-[#f5f5f5]">
//                         {recipe.variationName || "—"}
//                       </span>
//                     </td>
//                     <td className="py-3 pl-5 pr-3">
//                       <div className="text-sm max-w-md">
//                         {ingredients.length > 0 ? (
//                           <>
//                             <ul className="space-y-1">
//                               {displayedIngredients.map((ing, idx) => (
//                                 <li key={idx} className="text-gray-300">
//                                   <span className="font-medium text-[#f5f5f5]">{ing.productId?.name || "Unknown"}</span>
//                                   {" • "}
//                                   <span className="text-gray-400">{ing.quantityUsed} {ing.productId?.unit || ""}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                             {showToggle && (
//                               <button
//                                 onClick={() => toggleRecipeExpansion(recipe._id)}
//                                 className="mt-2 text-blue-400 hover:text-blue-500 text-xs flex items-center gap-1"
//                               >
//                                 {isExpanded ? (
//                                   <>
//                                     <FiChevronUp size={14} />
//                                     Show Less
//                                   </>
//                                 ) : (
//                                   <>
//                                     <FiChevronDown size={14} />
//                                     Show {ingredients.length - 5} More
//                                   </>
//                                 )}
//                               </button>
//                             )}
//                           </>
//                         ) : (
//                           <span className="text-gray-500">No ingredients</span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-3 px-3 text-center">
//                       <button
//                         onClick={() => handleDeleteRecord(recipe._id)}
//                         className="text-red-500 hover:text-red-600 transition-colors duration-200 inline-flex items-center justify-center"
//                         title="Delete"
//                         disabled={deleteRecipeMutation.isLoading}
//                       >
//                         {deleteRecipeMutation.isLoading && deleteRecipeMutation.variables === recipe._id ? (
//                           <svg
//                             className="animate-spin h-5 w-5 text-red-500"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             />
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8v8H4z"
//                             />
//                           </svg>
//                         ) : (
//                           <FiTrash2 size={20} />
//                         )}
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Mobile/Tablet Card View */}
//       {!recipesLoading && !recipesError && filteredRecipes.length > 0 && (
//         <div className="lg:hidden space-y-4">
//           {filteredRecipes.map((recipe) => {
//             const dish = allDishes.find((d) => d._id === recipe.dishId?._id);
//             const isExpanded = expandedRecipes[recipe._id];
//             const ingredients = recipe.ingredients || [];
//             const showToggle = ingredients.length > 5;
//             const displayedIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);

//             return (
//               <div key={recipe._id} className="bg-[#333] rounded-lg p-4 border border-gray-600">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex-1">
//                     <h3 className="text-[#f5f5f5] font-semibold text-lg">
//                       {getDishName(recipe.dishId?._id)}
//                     </h3>
//                     {recipe.variationName && (
//                       <p className="text-gray-400 text-sm mt-1">{recipe.variationName}</p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => handleDeleteRecord(recipe._id)}
//                     className="text-red-500 hover:text-red-600 transition-colors duration-200 ml-3"
//                     title="Delete"
//                     disabled={deleteRecipeMutation.isLoading}
//                   >
//                     {deleteRecipeMutation.isLoading && deleteRecipeMutation.variables === recipe._id ? (
//                       <svg
//                         className="animate-spin h-5 w-5 text-red-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8H4z"
//                         />
//                       </svg>
//                     ) : (
//                       <FiTrash2 size={22} />
//                     )}
//                   </button>
//                 </div>

//                 {/* Category Badge */}
//                 <div className="mb-3">
//                   <span className="inline-block bg-[#1a1a1a] text-gray-300 text-xs px-3 py-1 rounded-full">
//                     {dish ? getCategoryName(dish.category) : "Unknown"}
//                   </span>
//                 </div>

//                 {/* Ingredients */}
//                 <div>
//                   <h4 className="text-[#ababab] text-sm font-medium mb-2">Ingredients:</h4>
//                   {ingredients.length > 0 ? (
//                     <>
//                       <ul className="space-y-2">
//                         {displayedIngredients.map((ing, idx) => (
//                           <li key={idx} className="flex justify-between items-center text-sm bg-[#1a1a1a] px-3 py-2 rounded">
//                             <span className="text-[#f5f5f5] font-medium">{ing.productId?.name || "Unknown"}</span>
//                             <span className="text-gray-400">{ing.quantityUsed} {ing.productId?.unit || ""}</span>
//                           </li>
//                         ))}
//                       </ul>
//                       {showToggle && (
//                         <button
//                           onClick={() => toggleRecipeExpansion(recipe._id)}
//                           className="mt-3 text-blue-400 hover:text-blue-500 text-sm flex items-center gap-1 w-full justify-center"
//                         >
//                           {isExpanded ? (
//                             <>
//                               <FiChevronUp size={16} />
//                               Show Less
//                             </>
//                           ) : (
//                             <>
//                               <FiChevronDown size={16} />
//                               Show {ingredients.length - 5} More Ingredients
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <p className="text-gray-500 text-sm">No ingredients</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DishRecipeEditPanel;
return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by dish or variation name..."
          value={recipeSearchQuery}
          onChange={(e) => setRecipeSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <select
          value={selectedDish}
          onChange={(e) => setSelectedDish(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Dishes</option>
          {filteredDishes.map((dish) => (
            <option key={dish._id} value={dish._id}>
              {dish.dishName}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {recipesLoading && (
        <div className="flex justify-center items-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="ml-3 text-gray-400">Loading dish recipes...</span>
        </div>
      )}

      {/* Error State */}
      {recipesError && (
        <div className="text-center text-red-400 py-12">
          Failed to load dish recipes. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!recipesLoading && !recipesError && filteredRecipes.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No dish recipes found.
        </div>
      )}

      {/* Desktop Table View */}
      {!recipesLoading && !recipesError && filteredRecipes.length > 0 && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="pl-5 py-3">Category</th>
                <th className="pl-5 py-3">Dish Name</th>
                <th className="pl-5 py-3">Variation</th>
                <th className="pl-5 py-3">Ingredients</th>
                <th className="p-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => {
                const dish = allDishes.find((d) => d._id === recipe.dishId?._id);
                const isExpanded = expandedRecipes[recipe._id];
                const ingredients = recipe.ingredients || [];
                const showToggle = ingredients.length > 5;
                const displayedIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);

                return (
                  <tr key={recipe._id} className="border-b border-gray-600 hover:bg-[#333]">
                    <td className="py-3 pl-5">
                      <span className="text-[#f5f5f5] text-sm">
                        {dish ? getCategoryName(dish.category) : "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 pl-5">
                      <span className="text-[#f5f5f5] font-medium">
                        {getDishName(recipe.dishId?._id)}
                      </span>
                    </td>
                    <td className="py-3 pl-5">
                      <span className="text-[#f5f5f5]">
                        {recipe.variationName || "—"}
                      </span>
                    </td>
                    <td className="py-3 pl-5 pr-3">
                      <div className="text-sm max-w-md">
                        {ingredients.length > 0 ? (
                          <>
                            <ul className="space-y-1">
                              {displayedIngredients.map((ing, idx) => (
                                <li key={idx} className="text-gray-300">
                                  <span className="font-medium text-[#f5f5f5]">{ing.productId?.name || "Unknown"}</span>
                                  {" • "}
                                  <span className="text-gray-400">{ing.quantityUsed} {ing.productId?.unit || ""}</span>
                                </li>
                              ))}
                            </ul>
                            {showToggle && (
                              <button
                                onClick={() => toggleRecipeExpansion(recipe._id)}
                                className="mt-2 text-blue-400 hover:text-blue-500 text-xs flex items-center gap-1"
                              >
                                {isExpanded ? (
                                  <>
                                    <FiChevronUp size={14} />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <FiChevronDown size={14} />
                                    Show {ingredients.length - 5} More
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">No ingredients</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleStockOutClick(recipe)}
                          className="text-orange-500 hover:text-orange-600 transition-colors duration-200 inline-flex items-center justify-center"
                          title="Stock Out"
                        >
                          <CiInboxOut size={22} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(recipe._id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200 inline-flex items-center justify-center"
                          title="Delete"
                          disabled={deleteRecipeMutation.isLoading}
                        >
                          {deleteRecipeMutation.isLoading && deleteRecipeMutation.variables === recipe._id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-red-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                          ) : (
                            <FiTrash2 size={20} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile/Tablet Card View */}
      {!recipesLoading && !recipesError && filteredRecipes.length > 0 && (
        <div className="lg:hidden space-y-4">
          {filteredRecipes.map((recipe) => {
            const dish = allDishes.find((d) => d._id === recipe.dishId?._id);
            const isExpanded = expandedRecipes[recipe._id];
            const ingredients = recipe.ingredients || [];
            const showToggle = ingredients.length > 5;
            const displayedIngredients = isExpanded ? ingredients : ingredients.slice(0, 5);

            return (
              <div key={recipe._id} className="bg-[#333] rounded-lg p-4 border border-gray-600">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-[#f5f5f5] font-semibold text-lg">
                      {getDishName(recipe.dishId?._id)}
                    </h3>
                    {recipe.variationName && (
                      <p className="text-gray-400 text-sm mt-1">{recipe.variationName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleStockOutClick(recipe)}
                      className="text-orange-500 hover:text-orange-600 transition-colors duration-200"
                      title="Stock Out"
                    >
                      <CiInboxOut size={24} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(recipe._id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      title="Delete"
                      disabled={deleteRecipeMutation.isLoading}
                    >
                      {deleteRecipeMutation.isLoading && deleteRecipeMutation.variables === recipe._id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        <FiTrash2 size={22} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-[#1a1a1a] text-gray-300 text-xs px-3 py-1 rounded-full">
                    {dish ? getCategoryName(dish.category) : "Unknown"}
                  </span>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="text-[#ababab] text-sm font-medium mb-2">Ingredients:</h4>
                  {ingredients.length > 0 ? (
                    <>
                      <ul className="space-y-2">
                        {displayedIngredients.map((ing, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm bg-[#1a1a1a] px-3 py-2 rounded">
                            <span className="text-[#f5f5f5] font-medium">{ing.productId?.name || "Unknown"}</span>
                            <span className="text-gray-400">{ing.quantityUsed} {ing.productId?.unit || ""}</span>
                          </li>
                        ))}
                      </ul>
                      {showToggle && (
                        <button
                          onClick={() => toggleRecipeExpansion(recipe._id)}
                          className="mt-3 text-blue-400 hover:text-blue-500 text-sm flex items-center gap-1 w-full justify-center"
                        >
                          {isExpanded ? (
                            <>
                              <FiChevronUp size={16} />
                              Show Less
                            </>
                          ) : (
                            <>
                              <FiChevronDown size={16} />
                              Show {ingredients.length - 5} More Ingredients
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">No ingredients</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Out Modal */}
      {showStockOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg shadow-xl max-w-md w-full border border-gray-600">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <h2 className="text-xl font-semibold text-[#f5f5f5]">Stock Out</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  Dish: <span className="text-[#f5f5f5] font-medium">
                    {selectedRecipeForStockOut && getDishName(selectedRecipeForStockOut.dishId?._id)}
                  </span>
                </p>
                {selectedRecipeForStockOut?.variationName && (
                  <p className="text-gray-400 text-sm">
                    Variation: <span className="text-[#f5f5f5]">
                      {selectedRecipeForStockOut.variationName}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#ababab] text-sm font-medium mb-2">
                  Quantity Sold
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantitySold}
                  onChange={(e) => setQuantitySold(e.target.value)}
                  placeholder="Enter quantity sold"
                  className="w-full px-4 py-2 rounded-lg bg-[#333] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-600">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-[#333] text-[#f5f5f5] hover:bg-[#444] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStockOutSubmit}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Confirm Stock Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishRecipeEditPanel;