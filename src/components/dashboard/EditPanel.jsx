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
} from "../../https";
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
    ? dishesData?.data.data.filter((dish) => dish.category === selectedCategory)
    : dishesData?.data.data;

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

  // Handle editing a field
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

  // Handle updating a record
  const handleUpdate = (entity, id) => {
    const updatedData = edits[entity]?.[id];
    if (!updatedData) {
      enqueueSnackbar("No changes to update!", { variant: "info" });
      return;
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
    if (window.confirm("Are you sure you want to delete this record?")) {
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
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Edit Panel</h2>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setSelectedOption("dishes")}
          className={`px-4 py-2 rounded-lg ${selectedOption === "dishes" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
            }`}
        >
          Dishes
        </button>
        <button
          onClick={() => setSelectedOption("categories")}
          className={`px-4 py-2 rounded-lg ${selectedOption === "categories" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
            }`}
        >
          Categories
        </button>
        <button
          onClick={() => setSelectedOption("tables")}
          className={`px-4 py-2 rounded-lg ${selectedOption === "tables" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
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
                
                <th className="pl-5">Name</th>
                <th className="pl-5">Price</th>
                <th className="pl-5">Category</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDishes?.map((dish) => (
                <tr key={dish._id} className="border-b border-gray-600 hover:bg-[#333]">
                  <td className="p-4">
                    <input
                      type="text"
                      defaultValue={dish.dishName}
                      onChange={(e) => handleEditField("dish", dish._id, "dishName", e.target.value)}
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={dish.dishPrice}
                      onChange={(e) => handleEditField("dish", dish._id, "dishPrice", e.target.value)}
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4">
                    <select
                      defaultValue={dish.category}
                      onChange={(e) => handleEditField("dish", dish._id, "category", e.target.value)}
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
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
              ))}
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
                <tr key={category._id} className="text-[#f5f5f5] border-b border-gray-600 hover:bg-[#333]">
                  <td className="p-4">
                    <input
                      type="text"
                      defaultValue={category.categoryName}
                      onChange={(e) => handleEditField("category", category._id, "categoryName", e.target.value)}
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
                <tr key={table._id} className="border-b border-gray-600 hover:bg-[#333]">
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={table.tableNo}
                      onChange={(e) => handleEditField("table", table._id, "tableNo", e.target.value)}
                      className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      defaultValue={table.seats}
                      onChange={(e) => handleEditField("table", table._id, "seats", e.target.value)}
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