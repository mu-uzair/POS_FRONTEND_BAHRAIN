import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDishes,
  updateDish,
  deleteDish,
  getCategories,
  updateCategory,
  deleteCategory,
  getTable,
  updateTableData,
  deleteTable,
  getDeliveryBoys,
  updateDeliveryBoy,
  deleteDeliveryBoy,
} from "../../https";
import { enqueueSnackbar } from "notistack";

const EditPanel = () => {
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState("dishes");
  const [selectedCategory, setSelectedCategory] = useState("");

  // State to track edits
  const [edits, setEdits] = useState({});

  // Fetch dishes
  const { data: dishesData, isLoading: dishesLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch tables
  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTable,
  });

  // Fetch delivery boys
  const { data: deliveryBoysData, isLoading: deliveryBoysLoading } = useQuery({
    queryKey: ["deliveryBoys", "all"],
    queryFn: () => {
      return getDeliveryBoys();
    },
  });

  // Filter dishes based on selected category
  const filteredDishes = selectedCategory
    ? dishesData?.data?.data?.filter((dish) => dish.category === selectedCategory)
    : dishesData?.data?.data;

  // Mutation for updating a dish
  const updateDishMutation = useMutation({
    mutationFn: updateDish,
    onSuccess: () => {
      enqueueSnackbar("Dish updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update dish!", { variant: "error" });
    },
  });

  // Mutation for deleting a dish
  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete dish!", { variant: "error" });
    },
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update category!", { variant: "error" });
    },
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete category!", { variant: "error" });
    },
  });

  // Mutation for updating a table
  const updateTableMutation = useMutation({
    mutationFn: updateTableData,
    onSuccess: () => {
      enqueueSnackbar("Table updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update table!", { variant: "error" });
    },
  });

  // Mutation for deleting a table
  const deleteTableMutation = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      enqueueSnackbar("Table deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update table!", { variant: "error" });
    },
  });

  // Mutation for updating a delivery boy
  const updateDeliveryBoyMutation = useMutation({
    mutationFn: ({ id, data }) => updateDeliveryBoy(id, data),
    onSuccess: () => {
      enqueueSnackbar("Delivery boy updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["deliveryBoys"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update delivery boy!", { variant: "error" });
    },
  });

  // Mutation for deleting a delivery boy
  const deleteDeliveryBoyMutation = useMutation({
    mutationFn: deleteDeliveryBoy,
    onSuccess: () => {
      enqueueSnackbar("Delivery boy deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["deliveryBoys"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete delivery boy!", { variant: "error" });
    },
  });

  // Handle editing a simple field
  const handleEditField = (entity, id, field, value) => {
    setEdits((prev) => {
      const updatedEdits = {
        ...prev,
        [entity]: {
          ...prev[entity],
          [id]: {
            ...prev[entity]?.[id],
            [field]: value,
          },
        },
      };

      console.log(`Editing ${entity} ${id}, field: ${field}, value:`, value);
      console.log('Updated edits state:', updatedEdits);

      return updatedEdits;
    });
  };

  // Handle editing a variation price
  const handleEditVariationPrice = (dish, variationIndex, newValueInDollars) => {
    const currentVariations =
      edits.dish?.[dish._id]?.variations || dish.variations || [];

    const updatedVariations = currentVariations.map((v, i) => {
      if (i === variationIndex) {
        const priceAsNumber = parseFloat(newValueInDollars);
        return { ...v, price: isNaN(priceAsNumber) ? 0 : parseFloat(priceAsNumber.toFixed(3)) };
      }
      return v;
    });

    setEdits((prev) => ({
      ...prev,
      dish: {
        ...prev.dish,
        [dish._id]: {
          ...prev.dish?.[dish._id],
          variations: updatedVariations,
        },
      },
    }));
  };

  // Handle editing base price
  const handleEditBasePrice = (dish, newPrice) => {
    const priceAsNumber = parseFloat(newPrice);

    setEdits((prev) => ({
      ...prev,
      dish: {
        ...prev.dish,
        [dish._id]: {
          ...prev.dish?.[dish._id],
          basePrice: isNaN(priceAsNumber) ? 0 : parseFloat(priceAsNumber.toFixed(3)),
        },
      },
    }));
  };

  // Handle updating a record
  const handleUpdate = (entity, id) => {
    let updatedData = edits[entity]?.[id];

    if (!updatedData || Object.keys(updatedData).length === 0) {
      enqueueSnackbar("No changes to update!", { variant: "info" });
      return;
    }

    updatedData = { ...updatedData };

    console.log(`Updating ${entity} with ID ${id}:`, updatedData);

    if (entity === "dish") {
      delete updatedData.dishPrice;
    }

    if (entity === "deliveryBoy") {
      console.log('Delivery Boy Update Data:', updatedData);
      console.log('is_active value:', updatedData.is_active);
    }

    const cleanedData = {};
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] !== undefined) {
        cleanedData[key] = updatedData[key];
      }
    });

    console.log('Cleaned data to send:', cleanedData);

    switch (entity) {
      case "dish":
        updateDishMutation.mutate({ _id: id, ...cleanedData });
        break;
      case "category":
        updateCategoryMutation.mutate({ _id: id, ...cleanedData });
        break;
      case "table":
        updateTableMutation.mutate({ _id: id, ...cleanedData });
        break;
      case "deliveryBoy":
        console.log('Sending delivery boy update with data:', cleanedData);
        updateDeliveryBoyMutation.mutate({ id, data: cleanedData });
        break;
      default:
        break;
    }

    setEdits((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [id]: undefined,
      },
    }));
  };

  // Handle deleting a record
  const handleDeleteRecord = (entity, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    switch (entity) {
      case "dish":
        deleteDishMutation.mutate(id);
        break;
      case "category":
        deleteCategoryMutation.mutate(id);
        break;
      case "table":
        deleteTableMutation.mutate(id);
        break;
      case "deliveryBoy":
        deleteDeliveryBoyMutation.mutate(id);
        break;
      default:
        break;
    }
  };

  // Navigation buttons
  const navButtons = [
    { key: "dishes", label: "Dishes", icon: "🍽️" },
    { key: "categories", label: "Categories", icon: "📁" },
    { key: "tables", label: "Tables", icon: "🪑" },
    { key: "deliveryBoys", label: "Delivery Boys", icon: "🏍️" },
  ];

  // ADD THIS ENTIRE COMPONENT HERE:
  const PriceInput = ({ dish, index, variation }) => {
    const currentVariations = edits.dish?.[dish._id]?.variations || dish.variations;
    const priceInStoredUnit = currentVariations[index]?.price !== undefined
      ? currentVariations[index].price
      : variation.price;

    const [localValue, setLocalValue] = useState(parseFloat(priceInStoredUnit ?? 0).toFixed(3));

    React.useEffect(() => {
      setLocalValue(parseFloat(priceInStoredUnit ?? 0).toFixed(3));
    }, [priceInStoredUnit]);

    const handleChange = (e) => {
      const value = e.target.value;
      if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
        setLocalValue(value);
      }
    };

    const handleBlur = () => {
      const numValue = parseFloat(localValue);
      if (!isNaN(numValue)) {
        const formatted = numValue.toFixed(3);
        setLocalValue(formatted);
        handleEditVariationPrice(dish, index, formatted);
      } else {
        setLocalValue('0.000');
        handleEditVariationPrice(dish, index, '0.000');
      }
    };

    return (
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0.000"
        inputMode="decimal"
        className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-24 text-right text-sm border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    );
  };
  // ============================================
  // CONTINUE TO PART 2 FOR THE RETURN/JSX
  // ============================================
  // ============================================
  // PART 2: JSX RETURN SECTION
  // Copy this after Part 1's handlers and before closing the component
  // ============================================

  return (
    <div className="container mx-auto bg-[#262626] p-3 sm:p-4 md:p-6 rounded-lg overflow-y-auto h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
        Edit Panel
      </h2>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
        {navButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSelectedOption(btn.key)}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 flex items-center justify-center gap-2 ${selectedOption === btn.key
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
              }`}
          >
            <span className="text-base sm:text-lg">{btn.icon}</span>
            <span className="hidden sm:inline">{btn.label}</span>
            <span className="sm:hidden">{btn.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* DISHES SECTION */}
      {selectedOption === "dishes" && (
        <div className="overflow-x-auto">
          <div className="mb-4 px-1">
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categoriesData?.data?.data?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {dishesLoading ? (
            <div className="text-center text-[#ababab] py-8">Loading dishes...</div>
          ) : (
            <div className="hidden md:block">
              <table className="w-full text-left text-[#f5f5f5]">
                <thead className="bg-[#333] text-[#ababab] text-sm">
                  <tr>
                    <th className="p-3 sm:p-4">Name</th>
                    <th className="p-3 sm:p-4">Price</th>
                    <th className="p-3 sm:p-4">Category</th>
                    <th className="p-3 sm:p-4">Section</th>
                    <th className="p-3 sm:p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDishes?.map((dish) => {
                    const currentDishName =
                      edits.dish?.[dish._id]?.dishName !== undefined
                        ? edits.dish[dish._id].dishName
                        : dish.dishName;

                    const currentCategory =
                      edits.dish?.[dish._id]?.category !== undefined
                        ? edits.dish[dish._id].category
                        : dish.category;

                    const currentSection =
                      edits.dish?.[dish._id]?.section !== undefined
                        ? edits.dish[dish._id].section
                        : dish.section;

                    const hasVariations = Array.isArray(dish.variations) && dish.variations.length > 0;

                    return (
                      <tr key={dish._id} className="border-b border-gray-600 hover:bg-[#333] transition-colors">
                        <td className="p-3 sm:p-4">
                          <input
                            type="text"
                            value={currentDishName}
                            onChange={(e) => handleEditField("dish", dish._id, "dishName", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 sm:p-4">
                          {hasVariations ? (
                            <div className="flex flex-col gap-2">
                          
                              {dish.variations.map((variation, index) => {
                                return (
                                  <div key={index} className="flex items-center gap-2">
                                    <span className="text-xs text-[#ababab] w-16 font-medium">
                                      {variation.name}:
                                    </span>
                                    <PriceInput dish={dish} index={index} variation={variation} />
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#ababab] font-medium">Price:</span>
                              <input
                                type="number"
                                value={
                                  edits.dish?.[dish._id]?.basePrice !== undefined
                                    ? edits.dish[dish._id].basePrice
                                    : parseFloat(dish.basePrice ?? 0).toFixed(3)
                                }
                                onChange={(e) => handleEditBasePrice(dish, e.target.value)}
                                min="0"
                                step="0.001"
                                className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-24 text-right text-sm border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </td>
                        <td className="p-3 sm:p-4">
                          <select
                            value={currentCategory}
                            onChange={(e) => handleEditField("dish", dish._id, "category", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="" disabled>Select category</option>
                            {categoriesData?.data?.data?.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.categoryName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 sm:p-4">
                          <select
                            value={currentSection || ""}
                            onChange={(e) => handleEditField("dish", dish._id, "section", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">null</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Grill">Grill</option>
                          </select>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate("dish", dish._id)}
                              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("dish", dish._id)}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Delete
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

          {/* Mobile Card View for Dishes */}
          <div className="md:hidden space-y-4">
            {filteredDishes?.map((dish) => {
              const currentDishName = edits.dish?.[dish._id]?.dishName !== undefined ? edits.dish[dish._id].dishName : dish.dishName;
              const currentCategory = edits.dish?.[dish._id]?.category !== undefined ? edits.dish[dish._id].category : dish.category;
              const currentSection = edits.dish?.[dish._id]?.section !== undefined ? edits.dish[dish._id].section : dish.section;
              const hasVariations = Array.isArray(dish.variations) && dish.variations.length > 0;

              return (
                <div key={dish._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#ababab] text-xs mb-1">Dish Name</label>
                      <input
                        type="text"
                        value={currentDishName}
                        onChange={(e) => handleEditField("dish", dish._id, "dishName", e.target.value)}
                        className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[#ababab] text-xs mb-1">{hasVariations ? "Variations" : "Price"}</label>
                      {hasVariations ? (
                        <div className="space-y-2">
                         
                          {dish.variations.map((variation, index) => {
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sm text-[#ababab] w-20 font-medium">{variation.name}:</span>
                                <PriceInput dish={dish} index={index} variation={variation} />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={edits.dish?.[dish._id]?.basePrice !== undefined ? edits.dish[dish._id].basePrice : parseFloat(dish.basePrice ?? 0).toFixed(3)}
                          onChange={(e) => handleEditBasePrice(dish, e.target.value)}
                          min="0"
                          step="0.001"
                          className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full text-right border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-[#ababab] text-xs mb-1">Category</label>
                      <select
                        value={currentCategory}
                        onChange={(e) => handleEditField("dish", dish._id, "category", e.target.value)}
                        className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled>Select category</option>
                        {categoriesData?.data?.data?.map((category) => (
                          <option key={category._id} value={category._id}>{category.categoryName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#ababab] text-xs mb-1">Section</label>
                      <select
                        value={currentSection || ""}
                        onChange={(e) => handleEditField("dish", dish._id, "section", e.target.value)}
                        className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">None</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Grill">Grill</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleUpdate("dish", dish._id)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("dish", dish._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CATEGORIES SECTION */}
      {selectedOption === "categories" && (
        <div className="overflow-x-auto">
          {categoriesLoading ? (
            <div className="text-center text-[#ababab] py-8">Loading categories...</div>
          ) : (
            <>
              <div className="hidden sm:block">
                <table className="w-full text-left text-[#f5f5f5]">
                  <thead className="bg-[#333] text-[#ababab] text-sm">
                    <tr>
                      <th className="p-3 sm:p-4">Category Name</th>
                      <th className="p-3 sm:p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesData?.data?.data?.map((category) => (
                      <tr key={category._id} className="border-b border-gray-600 hover:bg-[#333] transition-colors">
                        <td className="p-3 sm:p-4">
                          <input
                            type="text"
                            defaultValue={category.categoryName}
                            onChange={(e) => handleEditField("category", category._id, "categoryName", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate("category", category._id)}
                              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("category", category._id)}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-4">
                {categoriesData?.data?.data?.map((category) => (
                  <div key={category._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#ababab] text-xs mb-1">Category Name</label>
                        <input
                          type="text"
                          defaultValue={category.categoryName}
                          onChange={(e) => handleEditField("category", category._id, "categoryName", e.target.value)}
                          className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate("category", category._id)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteRecord("category", category._id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}


      {/* TABLES SECTION */}
      {selectedOption === "tables" && (
        <div className="overflow-x-auto">
          {tablesLoading ? (
            <div className="text-center text-[#ababab] py-8">Loading tables...</div>
          ) : (
            <>
              <div className="hidden sm:block">
                <table className="w-full text-left text-[#f5f5f5]">
                  <thead className="bg-[#333] text-[#ababab] text-sm">
                    <tr>
                      <th className="p-3 sm:p-4">Table Number</th>
                      <th className="p-3 sm:p-4">Seats</th>
                      {/* NEW: Status Header */}
                      <th className="p-3 sm:p-4">Status</th>
                      <th className="p-3 sm:p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablesData?.data?.data?.map((table) => (
                      <tr key={table._id} className="border-b border-gray-600 hover:bg-[#333] transition-colors">
                        <td className="p-3 sm:p-4">
                          <input
                            type="number"
                            defaultValue={table.tableNo}
                            onChange={(e) => handleEditField("table", table._id, "tableNo", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 sm:p-4">
                          <input
                            type="number"
                            defaultValue={table.seats}
                            onChange={(e) => handleEditField("table", table._id, "seats", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        {/* NEW: Status Dropdown for Desktop */}
                        <td className="p-3 sm:p-4">
                          <select
                            defaultValue={table.status}
                            onChange={(e) => handleEditField("table", table._id, "status", e.target.value)}
                            className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            aria-label="Table Status"
                          >
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                          </select>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate("table", table._id)}
                              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("table", table._id)}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-4">
                {tablesData?.data?.data?.map((table) => (
                  <div key={table._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#ababab] text-xs mb-1">Table Number</label>
                        <input
                          type="number"
                          defaultValue={table.tableNo}
                          onChange={(e) => handleEditField("table", table._id, "tableNo", e.target.value)}
                          className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[#ababab] text-xs mb-1">Seats</label>
                        <input
                          type="number"
                          defaultValue={table.seats}
                          onChange={(e) => handleEditField("table", table._id, "seats", e.target.value)}
                          className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      {/* NEW: Status Dropdown for Mobile */}
                      <div>
                        <label className="block text-[#ababab] text-xs mb-1">Status</label>
                        <select
                          defaultValue={table.status}
                          onChange={(e) => handleEditField("table", table._id, "status", e.target.value)}
                          className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          aria-label="Table Status"
                        >
                          <option value="Available">Available</option>
                          <option value="Booked">Booked</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate("table", table._id)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteRecord("table", table._id)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* DELIVERY BOYS SECTION */}
      {selectedOption === "deliveryBoys" && (
        <div className="overflow-x-auto">
          {deliveryBoysLoading ? (
            <div className="text-center text-[#ababab] py-8">Loading delivery boys...</div>
          ) : !deliveryBoysData?.data?.data || deliveryBoysData.data.data.length === 0 ? (
            <div className="text-center text-[#ababab] py-8 bg-[#1a1a1a] rounded-lg border border-gray-600">
              <p className="text-lg mb-2">No delivery boys found</p>
              <p className="text-sm">Add a delivery boy to get started</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:block">
                <table className="w-full text-left text-[#f5f5f5]">
                  <thead className="bg-[#333] text-[#ababab] text-sm">
                    <tr>
                      <th className="p-3 sm:p-4">Name</th>
                      <th className="p-3 sm:p-4">Phone</th>
                      <th className="p-3 sm:p-4 text-center">Status</th>
                      <th className="p-3 sm:p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryBoysData?.data?.data?.map((boy) => {
                      const currentName = edits.deliveryBoy?.[boy._id]?.name !== undefined ? edits.deliveryBoy[boy._id].name : boy.name;
                      const currentPhone = edits.deliveryBoy?.[boy._id]?.phone !== undefined ? edits.deliveryBoy[boy._id].phone : boy.phone;
                      const currentStatus = edits.deliveryBoy?.[boy._id]?.is_active !== undefined ? edits.deliveryBoy[boy._id].is_active : boy.is_active;

                      return (
                        <tr key={boy._id} className="border-b border-gray-600 hover:bg-[#333] transition-colors">
                          <td className="p-3 sm:p-4">
                            <input
                              type="text"
                              value={currentName}
                              onChange={(e) => handleEditField("deliveryBoy", boy._id, "name", e.target.value)}
                              className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3 sm:p-4">
                            <input
                              type="text"
                              value={currentPhone}
                              onChange={(e) => handleEditField("deliveryBoy", boy._id, "phone", e.target.value)}
                              className="bg-[#1a1a1a] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={currentStatus}
                                onChange={(e) => handleEditField("deliveryBoy", boy._id, "is_active", e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              <span className="ml-2 text-sm text-[#ababab]">
                                {currentStatus ? "Active" : "Inactive"}
                              </span>
                            </label>
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleUpdate("deliveryBoy", boy._id)}
                                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => handleDeleteRecord("deliveryBoy", boy._id)}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-4">
                {deliveryBoysData?.data?.data?.map((boy) => {
                  const currentName = edits.deliveryBoy?.[boy._id]?.name !== undefined ? edits.deliveryBoy[boy._id].name : boy.name;
                  const currentPhone = edits.deliveryBoy?.[boy._id]?.phone !== undefined ? edits.deliveryBoy[boy._id].phone : boy.phone;
                  const currentVehicleType = edits.deliveryBoy?.[boy._id]?.vehicle_type !== undefined ? edits.deliveryBoy[boy._id].vehicle_type : boy.vehicle_type;
                  const currentVehicleNumber = edits.deliveryBoy?.[boy._id]?.vehicle_number !== undefined ? edits.deliveryBoy[boy._id].vehicle_number : boy.vehicle_number;
                  const currentStatus = edits.deliveryBoy?.[boy._id]?.is_active !== undefined ? edits.deliveryBoy[boy._id].is_active : boy.is_active;

                  return (
                    <div key={boy._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[#f5f5f5] font-semibold text-lg">Delivery Boy</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                            {currentStatus ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div>
                          <label className="block text-[#ababab] text-xs mb-1">Name</label>
                          <input
                            type="text"
                            value={currentName}
                            onChange={(e) => handleEditField("deliveryBoy", boy._id, "name", e.target.value)}
                            className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[#ababab] text-xs mb-1">Phone</label>
                          <input
                            type="text"
                            value={currentPhone}
                            onChange={(e) => handleEditField("deliveryBoy", boy._id, "phone", e.target.value)}
                            className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#ababab] text-xs mb-1">Vehicle Type</label>
                            <input
                              type="text"
                              value={currentVehicleType || ""}
                              onChange={(e) => handleEditField("deliveryBoy", boy._id, "vehicle_type", e.target.value)}
                              placeholder="Bike, Car"
                              className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[#ababab] text-xs mb-1">Vehicle #</label>
                            <input
                              type="text"
                              value={currentVehicleNumber || ""}
                              onChange={(e) => handleEditField("deliveryBoy", boy._id, "vehicle_number", e.target.value)}
                              placeholder="ABC-123"
                              className="bg-[#262626] text-[#f5f5f5] px-3 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <label className="text-[#ababab] text-sm">Active Status</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentStatus}
                              onChange={(e) => handleEditField("deliveryBoy", boy._id, "is_active", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdate("deliveryBoy", boy._id)}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteRecord("deliveryBoy", boy._id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EditPanel;