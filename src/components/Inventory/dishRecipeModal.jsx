import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
    getDishes,
    getAllProducts,
    addDishRecipe,
    updateDishRecipe,
    getAllDishRecipes,
    getCategories,
    getAllInventoryCategories
} from "../../https";
import { FiX, FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle, FiEdit3 } from "react-icons/fi";

const DishRecipeModal = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const [selectedDishCategory, setSelectedDishCategory] = useState("");
    const [selectedProductCategory, setSelectedProductCategory] = useState("");
    const [dishId, setDishId] = useState("");
    const [variationName, setVariationName] = useState("");
    const [ingredients, setIngredients] = useState([{ productId: "", quantityUsed: "" }]);
    const [loading, setLoading] = useState(false);
    const [existingRecipe, setExistingRecipe] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    // 🔹 Fetch dish categories
    const { data: dishCategoriesRes, isLoading: dishCategoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => await getCategories(),
        onError: (err) => {
            console.error("❌ Dish Categories Fetch Error:", err);
            enqueueSnackbar("Failed to load dish categories", { variant: "error" });
        },
    });

    // 🔹 Fetch product categories (inventory categories)
    const { data: productCategoriesRes, isLoading: productCategoriesLoading } = useQuery({
        queryKey: ["inventoryCategories"],
        queryFn: async () => await getAllInventoryCategories(),
        onError: (err) => {
            console.error("❌ Product Categories Fetch Error:", err);
            enqueueSnackbar("Failed to load product categories", { variant: "error" });
        },
    });

    // 🔹 Fetch dishes
    const { data: dishesRes, isLoading: dishesLoading } = useQuery({
        queryKey: ["dishes"],
        queryFn: async () => await getDishes(),
        onError: (err) => {
            console.error("❌ Dishes Fetch Error:", err);
            enqueueSnackbar("Failed to load dishes", { variant: "error" });
        },
    });

    // 🔹 Fetch products (ingredients)
    const { data: productsRes, isLoading: productsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => await getAllProducts(),
        onError: (err) => {
            console.error("❌ Products Fetch Error:", err);
            enqueueSnackbar("Failed to load products", { variant: "error" });
        },
    });

    // 🔹 Fetch dish recipes
    const { data: recipesRes, isLoading: recipesLoading } = useQuery({
        queryKey: ["dishRecipes"],
        queryFn: async () => await getAllDishRecipes(),
        onError: (err) => {
            console.error("❌ Recipes Fetch Error:", err);
            enqueueSnackbar("Failed to load recipes", { variant: "error" });
        },
    });

    // 🧩 Safe parsing
    const dishCategories = Array.isArray(dishCategoriesRes?.data?.data)
        ? dishCategoriesRes.data.data
        : [];

    const productCategories = Array.isArray(productCategoriesRes)
        ? productCategoriesRes
        : [];

    const dishes = Array.isArray(dishesRes?.data?.data)
        ? dishesRes.data.data
        : Array.isArray(dishesRes?.data)
            ? dishesRes.data
            : [];

    const products = Array.isArray(productsRes?.data?.data)
        ? productsRes.data.data
        : Array.isArray(productsRes?.data)
            ? productsRes.data
            : Array.isArray(productsRes)
                ? productsRes
                : [];

    const recipes = Array.isArray(recipesRes?.data?.data)
        ? recipesRes.data.data
        : [];

    // 🔹 Filter dishes by selected category
    const filteredDishes = selectedDishCategory
        ? dishes.filter((d) => d.category === selectedDishCategory)
        : dishes;

    //   // 🔹 Filter products by selected category
    //   const filteredProducts = selectedProductCategory
    //     ? products.filter((p) => p.category === selectedProductCategory)
    //     : products;


    // ✅ Corrected Code
    const filteredProducts = selectedProductCategory
        ? products.filter((p) => (p.category?._id || p.category) === selectedProductCategory)
        : products;

    // 🔹 Selected dish & variations
    const selectedDish = dishes.find((d) => d._id === dishId);
    const dishVariations = selectedDish?.variations || [];

    // 🔹 Check for existing recipe when dish and variation are selected
    useEffect(() => {
        if (dishId && variationName) {
            const recipe = recipes.find(
                (r) => r.dishId?._id === dishId && r.variationName === variationName
            );

            if (recipe) {
                console.log("✅ Found existing recipe:", recipe);
                setExistingRecipe(recipe);
                setIsUpdate(true);

                // Auto-fill ingredients from existing recipe
                const formattedIngredients = recipe.ingredients.map((ing) => ({
                    productId: ing.productId?._id || ing.productId,
                    quantityUsed: ing.quantityUsed,
                }));
                setIngredients(formattedIngredients.length > 0 ? formattedIngredients : [{ productId: "", quantityUsed: "" }]);

                enqueueSnackbar("Recipe found! You can now update it.", { variant: "info" });
            } else {
                console.log("ℹ️ No existing recipe found. Creating new one.");
                setExistingRecipe(null);
                setIsUpdate(false);
                setIngredients([{ productId: "", quantityUsed: "" }]);
            }
        }
    }, [dishId, variationName, recipes]);

    // 🔹 Ingredient change
    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { productId: "", quantityUsed: "" }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        } else {
            enqueueSnackbar("At least one ingredient is required", { variant: "warning" });
        }
    };

    // 🔹 Reset form
    const resetForm = () => {
        setSelectedDishCategory("");
        setSelectedProductCategory("");
        setDishId("");
        setVariationName("");
        setIngredients([{ productId: "", quantityUsed: "" }]);
        setExistingRecipe(null);
        setIsUpdate(false);
    };

    // 🔹 Submit handler (Add or Update)
    const handleSubmit = async () => {
        if (!dishId || !variationName) {
            enqueueSnackbar("Dish and variation are required", { variant: "error" });
            return;
        }

        if (ingredients.some((i) => !i.productId || !i.quantityUsed || i.quantityUsed <= 0)) {
            enqueueSnackbar("Each ingredient must have a valid product and quantity", { variant: "error" });
            return;
        }

        const payload = {
            dishId,
            variationName,
            ingredients: ingredients.map((ing) => ({
                productId: ing.productId,
                quantityUsed: parseFloat(ing.quantityUsed),
            })),
        };

        console.log("📦 Submitting Payload:", payload);

        try {
            setLoading(true);

            if (isUpdate && existingRecipe) {
                // For update, send the recipe ID as URL parameter
                await updateDishRecipe(existingRecipe._id, payload);
                enqueueSnackbar("Recipe updated successfully", { variant: "success" });
            } else {
                await addDishRecipe(payload);
                enqueueSnackbar("Recipe added successfully", { variant: "success" });
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries(["dishRecipes"]);

            resetForm();
            onClose();
        } catch (err) {
            console.error("❌ Submit Error:", err);
            enqueueSnackbar(
                err.response?.data?.message || `Error ${isUpdate ? "updating" : "adding"} recipe`,
                { variant: "error" }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] text-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {isUpdate ? (
                            <FiEdit3 className="text-yellow-300 text-2xl" />
                        ) : (
                            <FiCheckCircle className="text-green-300 text-2xl" />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">
                                {isUpdate ? "Update Recipe" : "Create New Recipe"}
                            </h2>
                            <p className="text-indigo-100 text-sm mt-0.5">
                                {isUpdate ? "Modify existing recipe details" : "Add a new dish recipe to your menu"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Alert Banner for Update Mode */}
                {isUpdate && (
                    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 px-6 py-3 flex items-center gap-3">
                        <FiAlertCircle className="text-yellow-500 text-xl flex-shrink-0" />
                        <p className="text-yellow-200 text-sm">
                            You're editing an existing recipe. Changes will update the current version.
                        </p>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    <div className="space-y-6">
                        {/* Selection Section */}
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm">1</span>
                                Select Dish Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Dish Category Filter */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                                        Dish Category <span className="text-gray-500">(Filter)</span>
                                    </label>
                                    <select
                                        value={selectedDishCategory}
                                        onChange={(e) => {
                                            setSelectedDishCategory(e.target.value);
                                            setDishId("");
                                            setVariationName("");
                                        }}
                                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all hover:border-gray-500"
                                        disabled={dishCategoriesLoading}
                                    >
                                        <option value="">All Dish Categories</option>
                                        {dishCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dish Select */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                                        Dish <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={dishId}
                                        onChange={(e) => {
                                            setDishId(e.target.value);
                                            setVariationName("");
                                            setIngredients([{ productId: "", quantityUsed: "" }]);
                                            setExistingRecipe(null);
                                            setIsUpdate(false);
                                        }}
                                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all hover:border-gray-500"
                                        disabled={dishesLoading}
                                    >
                                        <option value="">Select a dish</option>
                                        {filteredDishes.map((d) => (
                                            <option key={d._id} value={d._id}>
                                                {d.dishName}
                                            </option>
                                        ))}
                                    </select>
                                    {filteredDishes.length === 0 && selectedDishCategory && (
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                            <FiAlertCircle size={14} />
                                            No dishes in this category
                                        </p>
                                    )}
                                </div>

                                {/* Variation Select */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-300 text-sm">
                                        Variation <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={variationName}
                                        onChange={(e) => setVariationName(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!dishId}
                                    >
                                        <option value="">Select a variation</option>
                                        {dishVariations.map((v, i) => (
                                            <option key={i} value={v.name}>
                                                {v.name} — {v.price} BHD
                                            </option>
                                        ))}
                                    </select>
                                    {!dishId && (
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                            <FiAlertCircle size={14} />
                                            Select a dish first
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ingredients Section */}
                        <div className="bg-[#2a2a2a] rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm">2</span>
                                    Configure Ingredients
                                    {isUpdate && (
                                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                            Pre-loaded
                                        </span>
                                    )}
                                </h3>

                                {/* Product Category Filter */}
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedProductCategory}
                                        onChange={(e) => setSelectedProductCategory(e.target.value)}
                                        className="bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                        disabled={productCategoriesLoading}
                                    >
                                        <option value="">All Products</option>
                                        {productCategories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={addIngredient}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <FiPlus size={18} />
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {ingredients.map((ing, index) => {
                                    const selectedProduct = products.find(p => p._id === ing.productId);
                                    return (
                                        <div key={index} className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-600 hover:border-indigo-500 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-semibold text-sm">
                                                    {index + 1}
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Product</label>
                                                        <select
                                                            value={ing.productId}
                                                            onChange={(e) => handleIngredientChange(index, "productId", e.target.value)}
                                                            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                            disabled={productsLoading}
                                                        >
                                                            <option value="">Select product</option>
                                                            {filteredProducts.map((p) => (
                                                                <option key={p._id} value={p._id}>
                                                                    {p.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">
                                                            Quantity {selectedProduct && <span className="text-indigo-400">({selectedProduct.unit})</span>}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                            value={ing.quantityUsed}
                                                            onChange={(e) =>
                                                                handleIngredientChange(index, "quantityUsed", e.target.value)
                                                            }
                                                            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeIngredient(index)}
                                                    className="flex-shrink-0 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                                    disabled={ingredients.length === 1}
                                                    title={ingredients.length === 1 ? "At least one ingredient required" : "Remove ingredient"}
                                                >
                                                    <FiTrash2 size={18} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {ingredients.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <FiAlertCircle className="mx-auto mb-2" size={32} />
                                    <p>No ingredients added yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-[#1a1a1a] px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-gray-400">
                        <span className="text-red-400">*</span> Required fields
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="flex-1 sm:flex-initial bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || recipesLoading}
                            className={`flex-1 sm:flex-initial ${isUpdate
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                } text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : isUpdate ? (
                                <>
                                    <FiEdit3 size={18} />
                                    Update Recipe
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle size={18} />
                                    Create Recipe
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
      `}</style>
        </div>
    );
};

export default DishRecipeModal;