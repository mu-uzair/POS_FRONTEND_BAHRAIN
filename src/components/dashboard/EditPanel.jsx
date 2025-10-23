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
} from "../../https"; // CORRECTED: Changed relative path './https' to module name 'https'
import { enqueueSnackbar } from "notistack";

const EditPanel = () => {
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState("dishes");
  const [selectedCategory, setSelectedCategory] = useState("");

  // State to track edits
  const [edits, setEdits] = useState({});

  // Fetch dishes
  const { data: dishesData } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch tables
  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: getTable,
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
    onError: () => {
      enqueueSnackbar("Failed to update dish!", { variant: "error" });
    },
  });

  // Mutation for deleting a dish
  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete dish!", { variant: "error" });
    },
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update category!", { variant: "error" });
    },
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete category!", { variant: "error" });
    },
  });

  // Mutation for updating a table
  const updateTableMutation = useMutation({
    mutationFn: updateTableData,
    onSuccess: () => {
      enqueueSnackbar("Table updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update table!", { variant: "error" });
    },
  });

  // Mutation for deleting a table
  const deleteTableMutation = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      enqueueSnackbar("Table deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete table!", { variant: "error" });
    },
  });

  // Handle editing a simple field (dishName, categoryName, etc.)
  const handleEditField = (entity, id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [id]: {
          ...prev[entity]?.[id],
          [field]: value,
        },
      },
    }));
  };

  // Handle editing a variation price (nested array field)
  const handleEditVariationPrice = (dish, variationIndex, newValueInDollars) => {
    // 1. Get the current, possibly edited variations array, or the original one
    const currentVariations =
      edits.dish?.[dish._id]?.variations || dish.variations || [];

    // 2. Create a copy and update the price for the specific index
    const updatedVariations = currentVariations.map((v, i) => {
      if (i === variationIndex) {
        // --- CONVERSION FIX ---
        // Convert the input value (in dollars) to an integer (in milli-cents) for storage
        // const priceInMilliCents = Math.round(parseFloat(newValueInDollars) * 1000);
        // return { ...v, price: isNaN(priceInMilliCents) ? 0 : priceInMilliCents };
        const priceAsNumber = parseFloat(newValueInDollars);
return { ...v, price: isNaN(priceAsNumber) ? 0 : parseFloat(priceAsNumber.toFixed(3)) };

        // --- END CONVERSION FIX ---
      }
      return v;
    });

    // 3. Update the main edits state under 'variations' field
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

  // Handle updating a record
  const handleUpdate = (entity, id) => {
    let updatedData = edits[entity]?.[id];

    if (!updatedData) {
      enqueueSnackbar("No changes to update!", { variant: "info" });
      return;
    }

    // IMPORTANT: Create a mutable copy of the changes to perform currency conversion
    updatedData = { ...updatedData };

    // Specific preparation for dish updates (removing dishPrice and ensuring variations are in cents)
    if (entity === "dish") {
      // Remove the deprecated dishPrice field if it somehow got in there
      delete updatedData.dishPrice;

      // Note: Variations prices are already converted to the correct stored unit in handleEditVariationPrice
    }

    switch (entity) {
      case "dish":
        updateDishMutation.mutate({ _id: id, ...updatedData });
        break;
      case "category":
        updateCategoryMutation.mutate({ _id: id, ...updatedData });
        break;
      case "table":
        updateTableMutation.mutate({ _id: id, ...updatedData });
        break;
      default:
        break;
    }

    // Clear the edits for this entity
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
    // NOTE: Using console.log instead of window.confirm for Canvas environment safety
    console.log("Confirming deletion for entity:", entity, "ID:", id);

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
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Edit Panel</h2>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setSelectedOption("dishes")}
          className={`px-4 py-2 rounded-lg ${
            selectedOption === "dishes"
              ? "bg-[#333] text-[#f5f5f5]"
              : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
          }`}
        >
          Dishes
        </button>
        <button
          onClick={() => setSelectedOption("categories")}
          className={`px-4 py-2 rounded-lg ${
            selectedOption === "categories"
              ? "bg-[#333] text-[#f5f5f5]"
              : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setSelectedOption("tables")}
          className={`px-4 py-2 rounded-lg ${
            selectedOption === "tables"
              ? "bg-[#333] text-[#f5f5f5]"
              : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
          }`}
        >
          Tables
        </button>
      </div>

      {selectedOption === "dishes" && (
        <div className="overflow-x-auto">
          {/* Category Dropdown */}
          <div className="mb-4 px-1">
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
            >
              <option value="">All Categories</option>
              {categoriesData?.data.data.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Dishes Table */}
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="pl-5 w-1/3">Name</th>
                <th className="pl-5 w-1/3">Variations (Price)</th>
                <th className="pl-5 w-1/6">Category</th>
                <th className="p-3 text-center w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes?.map((dish) => {
                // Determine the current edited dish name (for controlled input)
                const currentDishName =
                  edits.dish?.[dish._id]?.dishName !== undefined
                    ? edits.dish[dish._id].dishName
                    : dish.dishName;

                // Determine the current edited category ID (for controlled select)
                const currentCategory =
                  edits.dish?.[dish._id]?.category !== undefined
                    ? edits.dish[dish._id].category
                    : dish.category;

                return (
                  <tr
                    key={dish._id}
                    className="border-b border-gray-600 hover:bg-[#333]"
                  >
                    <td className="p-4">
                      <input
                        type="text"
                        value={currentDishName}
                        onChange={(e) =>
                          handleEditField("dish", dish._id, "dishName", e.target.value)
                        }
                        className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                      />
                    </td>
                    <td className="p-4">
                      {/* --- VARIATIONS LOGIC --- */}
                      <div className="flex flex-col gap-1 w-full text-sm">
                        {/* Ensure dish.variations exists and is an array before mapping */}
                        {Array.isArray(dish.variations) && dish.variations.length > 0 ? (
                          dish.variations.map((variation, index) => {
                            // Get the current edited variations array from the state, or fall back to the original array
                            const currentVariations =
                              edits.dish?.[dish._id]?.variations || dish.variations;

                            // Get the specific price, ensuring we use the original if the edit state for that index is missing
                            const priceInStoredUnit =
                              currentVariations[index]?.price !== undefined
                                ? currentVariations[index].price
                                : variation.price;

                            // --- CONVERSION FIX ---
                            // Convert stored unit (milli-cents) to dollars for display
                            // const priceInDollars = (Math.max(0, priceInStoredUnit) / 1000).toFixed(2);
                            const priceInDollars = parseFloat(priceInStoredUnit ?? 0).toFixed(3);

                            // --- END CONVERSION FIX ---

                            return (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-xs text-[#ababab] w-14 font-medium truncate">
                                  {variation.name}:
                                </span>
                                <input
                                  type="number"
                                  // Controlled input using the calculated price in dollars
                                  value={priceInDollars}
                                  onChange={(e) =>
                                    handleEditVariationPrice(dish, index, e.target.value)
                                  }
                                  min="0"
                                  step="0.001"
                                  className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-20 text-right text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-sm text-red-400">No variations found.</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={currentCategory}
                        onChange={(e) =>
                          handleEditField("dish", dish._id, "category", e.target.value)
                        }
                        className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categoriesData?.data.data.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleUpdate("dish", dish._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteRecord("dish", dish._id)}
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedOption === "categories" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="pl-5">Name</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesData?.data.data.map((category) => (
                <tr
                  key={category._id}
                  className="text-[#f5f5f5] border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    <input
                      type="text"
                      defaultValue={category.categoryName}
                      onChange={(e) =>
                        handleEditField("category", category._id, "categoryName", e.target.value)
                      }
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleUpdate("category", category._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteRecord("category", category._id)}
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOption === "tables" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[#f5f5f5]">
            <thead className="bg-[#333] text-[#ababab]">
              <tr>
                <th className="pl-5">Table No</th>
                <th className="pl-5">Seats</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tablesData?.data.data.map((table) => (
                <tr
                  key={table._id}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={table.tableNo}
                      onChange={(e) =>
                        handleEditField("table", table._id, "tableNo", e.target.value)
                      }
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={table.seats}
                      onChange={(e) =>
                        handleEditField("table", table._id, "seats", e.target.value)
                      }
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleUpdate("table", table._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 cursor-pointer"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteRecord("table", table._id)}
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditPanel;
