import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllDishRecipes,
  deleteDishRecipe,
  getCategories,
  getDishes,
  // Only adjustStockByRecipeApi is needed for stock actions
  adjustStockByRecipeApi, 
} from "../../https";
import { enqueueSnackbar,closeSnackbar } from "notistack";
import { FiTrash2, FiChevronDown, FiChevronUp, FiX  } from "react-icons/fi";
import { CiInboxOut } from "react-icons/ci";
import { LuWarehouse } from "react-icons/lu"; 

// Utility function to safely access error message
const getErrorMessage = (error) => {
    // Checks for status codes 409 (Conflict - Insufficient Stock) or other server errors
    return error.response?.data?.message || "An unknown error occurred during stock adjustment.";
};

const DishRecipeEditPanel = () => {
  const queryClient = useQueryClient();
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDish, setSelectedDish] = useState("");
  const [expandedRecipes, setExpandedRecipes] = useState({});

  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [selectedRecipeForStockOut, setSelectedRecipeForStockOut] = useState(null);
  const [quantitySold, setQuantitySold] = useState('');
  
  // --- FETCH QUERIES (UNCHANGED) ---

  const { data: categoriesData } = useQuery({ /* ... categories query ... */     queryKey: ["categories"],     queryFn: getCategories,     staleTime: 5 * 60 * 1000,     cacheTime: 10 * 60 * 1000,     refetchOnMount: false,     refetchOnWindowFocus: false,     onError: () => {       enqueueSnackbar("Failed to fetch categories!", { variant: "error" });     },   });
  const { data: dishesData } = useQuery({ /* ... dishes query ... */     queryKey: ["dishes"],     queryFn: getDishes,     staleTime: 5 * 60 * 1000,     cacheTime: 10 * 60 * 1000,     refetchOnMount: false,     refetchOnWindowFocus: false,     onError: () => {       enqueueSnackbar("Failed to fetch dishes!", { variant: "error" });     },   });
  const { data: recipesData, isLoading: recipesLoading, isError: recipesError } = useQuery({ /* ... recipes query ... */     queryKey: ["dishRecipes"],     queryFn: getAllDishRecipes,     staleTime: 5 * 60 * 1000,     cacheTime: 10 * 60 * 1000,     refetchOnMount: false,     refetchOnWindowFocus: false,     onError: () => {       enqueueSnackbar("Failed to fetch dish recipes!", { variant: "error" });     },   });

  // Extract & Filter Data (UNCHANGED)
  const recipes = Array.isArray(recipesData?.data?.data) ? recipesData.data.data : [];
  const categories = Array.isArray(categoriesData?.data?.data) ? categoriesData.data.data : [];
  const allDishes = Array.isArray(dishesData?.data?.data) ? dishesData.data.data : [];
  const filteredDishes = useMemo(() => { /* ... filter logic ... */ return allDishes; }, [allDishes, selectedCategory]);
  const filteredRecipes = useMemo(() => { /* ... filter logic ... */ return recipes; }, [recipes, recipeSearchQuery, selectedDish, allDishes]);

  // --- MUTATIONS ---

  // 1. Mutation for deleting a dish recipe (UNCHANGED)
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
  
  // 2. Mutation for stock out deduction (UNCHANGED)
  const adjustStockMutation = useMutation({
    mutationFn: ({ recipeId, quantity }) => 
        adjustStockByRecipeApi({ recipeId, quantity }),
    onSuccess: (data) => {
        const message = data.message || "Stock adjusted successfully!";
        enqueueSnackbar(message, { variant: "success" });
        // Invalidate relevant queries to update inventory data
        queryClient.invalidateQueries(["products"]); 
        queryClient.invalidateQueries(["recipeTransactions"]); 
        handleCloseModal();
    },
    onError: (error) => {
        const message = getErrorMessage(error);
        enqueueSnackbar(message, { variant: "error", autoHideDuration: 8000 });
        
        // If it's a 409 Conflict (Insufficient Stock), KEEP the modal open 
        if (error?.response?.status !== 409) {
            handleCloseModal();
        }
    },
  });

  // --- HANDLERS (Rollback handlers removed) ---

 // Handle deleting a recipe (FIXED)
const handleDeleteRecord = (id) => {
    enqueueSnackbar(
        `Are you sure you want to delete this dish recipe?`,
        {
            variant: 'warning',
            persist: true, 
            action: (snackbarId) => (
                <button 
                    onClick={() => {
                        deleteRecipeMutation.mutate(id);
                        // 🛑 THE FIX: Use the destructured closeSnackbar function
                        closeSnackbar(snackbarId); 
                    }}
                    className="text-white font-bold underline ml-4"
                >
                    Yes, Delete
                </button>
            ),
        }
    );
};


  // Get dish name by ID (UNCHANGED)
  const getDishName = (dishId) => {
    const dish = allDishes.find((d) => d._id === dishId);
    return dish?.dishName || "Unknown Dish";
  };

  // Get category name by ID (UNCHANGED)
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    return category?.categoryName || "Unknown Category";
  };

  // Handle category change (UNCHANGED)
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedDish("");
  };

  // Toggle recipe expansion (UNCHANGED)
  const toggleRecipeExpansion = (recipeId) => {
    setExpandedRecipes((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };
  
  // Open modal handler (UNCHANGED)
  const handleStockOutClick = (recipe) => {
    setSelectedRecipeForStockOut(recipe);
    setQuantitySold('1'); // Set a default quantity
    setShowStockOutModal(true);
  };

  // Submit handler (UNCHANGED)
  const handleStockOutSubmit = () => {
    const quantity = parseFloat(quantitySold);

    if (isNaN(quantity) || quantity <= 0) {
      enqueueSnackbar('Please enter a valid quantity greater than zero.', { variant: 'warning' });
      return;
    }

    if (!selectedRecipeForStockOut) {
        enqueueSnackbar('No recipe selected.', { variant: 'error' });
        return;
    }
    
    // Call the mutation with recipe ID and quantity
    adjustStockMutation.mutate({
        recipeId: selectedRecipeForStockOut._id,
        quantity: quantity,
    });
  };

  const handleCloseModal = () => {
    setShowStockOutModal(false);
    setSelectedRecipeForStockOut(null);
    setQuantitySold('');
  };



return (
    // Updated: Main background to deep dark gray
    <div className="p-6 bg-[#262626] min-h-screen">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 flex items-center">
            {/* Updated: Icon color adjusted slightly for better visibility on dark BG */}
            <LuWarehouse className="mr-3 text-emerald-400" />
            Dish Recipe Inventory Management
        </h1>

        {/* Search and Filters */}
        {/* Updated: Panel background to slightly lighter dark gray */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-[#2e2c2c] rounded-xl shadow-lg">
            {/* Updated: Input field styling for dark theme */}
            <input
                type="text"
                placeholder="Search recipe by dish or variation name..."
                value={recipeSearchQuery}
                onChange={(e) => setRecipeSearchQuery(e.target.value)}
                className="p-3 border border-[#3f3d3d] bg-[#3f3d3d] text-gray-100 rounded-lg flex-1 min-w-[200px] focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            />
            {/* Updated: Select styling for dark theme */}
            <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="p-3 border border-[#3f3d3d] bg-[#3f3d3d] text-gray-100 rounded-lg w-full sm:w-auto focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.categoryName}</option>
                ))}
            </select>
            {/* Updated: Select styling for dark theme */}
            <select
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                disabled={!selectedCategory && filteredDishes.length === allDishes.length}
                className="p-3 border border-[#3f3d3d] bg-[#3f3d3d] text-gray-100 rounded-lg w-full sm:w-auto focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 disabled:bg-[#3f3d3d] disabled:text-gray-400"
            >
                <option value="">All Dishes</option>
                {filteredDishes.map((d) => (
                    <option key={d._id} value={d._id}>{d.dishName}</option>
                ))}
            </select>
        </div>

        {/* Recipes List */}
        <div className="space-y-4">
            {recipesLoading && <div className="text-center py-10 text-gray-400">Loading recipes...</div>}
            {recipesError && <div className="text-center py-10 text-red-400">Error loading recipes.</div>}

            {filteredRecipes.length === 0 && !recipesLoading && (
                // Updated: Text and BG for no results
                <div className="text-center py-10 text-gray-400 bg-gray-800 rounded-xl shadow-lg">No recipes found matching criteria.</div>
            )}

            {filteredRecipes.map((recipe) => {
                const isExpanded = expandedRecipes[recipe._id];
                const dishName = getDishName(recipe.dishId?._id);
                const categoryId = allDishes.find(d => d._id === recipe.dishId?._id)?.category;
                const categoryName = getCategoryName(categoryId);
                
                return (
                    // Updated: Recipe card background
                    <div key={recipe._id} className="bg-[#2e2c2c] rounded-xl shadow-lg overflow-hidden transition-all duration-300">
                        {/* Header Row */}
                        {/* Updated: Border color for separation */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-600">
                            <div className="flex-1 min-w-0">
                                {/* Updated: Text color */}
                                <p className="text-xl font-semibold text-white truncate">
                                    {dishName} 
                                    {/* Updated: Text color */}
                                    {recipe.variationName && <span className="ml-2 text-base font-normal text-gray-400">({recipe.variationName})</span>}
                                </p>
                                {/* Updated: Text color for category */}
                                <p className="text-sm text-emerald-400 mt-1">{categoryName}</p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                                
                                {/* Stock Out Button (Colors remain for accent) */}
                                <button
                                    onClick={() => handleStockOutClick(recipe)}
                                    disabled={adjustStockMutation.isLoading}
                                    className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition duration-150 shadow-md flex items-center justify-center text-sm font-medium disabled:opacity-50"
                                    title="Process Stock Out"
                                >
                                    <CiInboxOut className="h-5 w-5 mr-1" />
                                    Stock Out
                                </button>

                                {/* Delete Button (Colors remain for danger) */}
                                <button
                                    onClick={() => handleDeleteRecord(recipe._id)}
                                    disabled={deleteRecipeMutation.isLoading || adjustStockMutation.isLoading}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete Recipe"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                                
                                {/* Toggle Button */}
                                {/* Updated: Background and hover state for dark theme */}
                                <button
                                    onClick={() => toggleRecipeExpansion(recipe._id)}
                                    className="p-2 bg-[#3f3d3d] text-gray-200 rounded-lg hover:bg-gray-600 transition duration-150"
                                    title={isExpanded ? "Collapse" : "Expand"}
                                >
                                    {isExpanded ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Ingredients List (Expanded Content) */}
                        {isExpanded && (
                            // Updated: Expanded content background and border
                            <div className="p-4 bg-gray-700 border-t border-gray-600">
                                {/* Updated: Text color */}
                                <h3 className="text-lg font-semibold text-gray-100 mb-3">Ingredients:</h3>
                                <ul className="list-disc list-inside space-y-1 pl-4">
                                    {recipe.ingredients.map((ing, index) => (
                                        // Updated: Text color
                                        <li key={index} className="text-gray-300 text-sm">
                                            <span className="font-medium">{ing.productId?.name || "Unknown Product"}</span>: {ing.quantityUsed} {ing.productId?.unit || 'unit'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* --- Stock Out Modal (Theme Updated) --- */}
        {showStockOutModal && selectedRecipeForStockOut && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                {/* Updated: Modal background */}
                <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                    
                    {/* Close Button (Updated: Text color) */}
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                        title="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    {/* Updated: Text color */}
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">Process Stock Out</h2>
                    {/* Updated: Text color and accent color */}
                    <p className="text-gray-300 mb-6">
                        Deduct inventory for: <span className="font-semibold text-emerald-400">
                            {getDishName(selectedRecipeForStockOut.dishId?._id)} ({selectedRecipeForStockOut.variationName})
                        </span>
                    </p>

                    <div className="space-y-4">
                        {/* Quantity Input */}
                        <div>
                            {/* Updated: Label text color */}
                            <label htmlFor="quantitySold" className="block text-sm font-medium text-gray-100 mb-1">
                                Quantity of Dishes Sold/Produced
                            </label>
                            {/* Updated: Input field styling for dark theme */}
                            <input
                                id="quantitySold"
                                type="number"
                                min="0.01"
                                step="any"
                                value={quantitySold}
                                onChange={(e) => setQuantitySold(e.target.value)}
                                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="e.g., 5"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end space-x-3">
                        {/* Updated: Cancel button styling for dark theme */}
                        <button
                            onClick={handleCloseModal}
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-150"
                        >
                            Cancel
                        </button>
                        {/* Deduct Stock button (Color remains for accent) */}
                        <button
                            onClick={handleStockOutSubmit}
                            disabled={adjustStockMutation.isLoading}
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition duration-150 shadow-md disabled:opacity-50 flex items-center"
                        >
                            {adjustStockMutation.isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </>
                            ) : (
                                'Deduct Stock'
                            )}
                        </button>
                    </div>

                </div>
            </div>
        )}
    </div>
);
};

export default DishRecipeEditPanel;

