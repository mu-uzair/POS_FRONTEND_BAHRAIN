import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getTransactions,
  deleteTransaction,
  getAllRecipeTransactions,
  rollbackRecipeStock,
} from "../../https/index";

const Logs = () => {
  const [activeTab, setActiveTab] = useState("product"); // 'product' | 'recipe'
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryClient = useQueryClient();

  // ----------- Product Transactions ------------
  const productQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    enabled: activeTab === "product",
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      enqueueSnackbar("Transaction deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to delete transaction!", { variant: "error" });
    },
  });

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteProductMutation.mutate(id);
    }
  };

  // ----------- Recipe Transactions ------------
  const recipeQuery = useQuery({
    queryKey: ["recipe-transactions"],
    queryFn: getAllRecipeTransactions,
    enabled: activeTab === "recipe",
  });

  const rollbackRecipeMutation = useMutation({
    mutationFn: rollbackRecipeStock,
    onSuccess: () => {
      enqueueSnackbar("Recipe transaction rolled back successfully!", { variant: "success" });
      queryClient.invalidateQueries(["recipe-transactions"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || "Failed to rollback recipe transaction!", { variant: "error" });
    },
  });

  const handleRollback = (transactionId) => {
    if (window.confirm("Rollback this recipe transaction? (This will restore the deducted stock.)")) {
      rollbackRecipeMutation.mutate(transactionId);
    }
  };

  // ----------- Filters & Utilities ------------
  const filterBySearchAndDate = (list, keyName) => {
    return list.filter((item) => {
      const matchesSearch = keyName
        ? item[keyName]?.toLowerCase().includes(search.toLowerCase())
        : true;
      const withinDateRange =
        (!startDate || new Date(item.date || item.createdAt) >= new Date(startDate)) &&
        (!endDate || new Date(item.date || item.createdAt) <= new Date(endDate));
      return matchesSearch && withinDateRange;
    });
  };

  const productTransactions = Array.isArray(productQuery.data?.data?.data)
    ? filterBySearchAndDate(productQuery.data.data.data, "productName")
    : [];

  const recipeTransactions = Array.isArray(recipeQuery.data?.data?.data)
    ? filterBySearchAndDate(recipeQuery.data.data.data, "recipeName")
    : [];

  // ----------- UI ------------
  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Transaction History</h2>

      {/* Tabs */}
      <div className="flex mb-4 space-x-3">
        <button
          onClick={() => setActiveTab("product")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "product" ? "bg-blue-600 text-white" : "bg-[#333] text-gray-300"
          }`}
        >
          Product Transactions
        </button>
        <button
          onClick={() => setActiveTab("recipe")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "recipe" ? "bg-blue-600 text-white" : "bg-[#333] text-gray-300"
          }`}
        >
          Recipe Transactions
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder={`Search by ${activeTab === "recipe" ? "Recipe" : "Product"} name...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#333] text-white p-2 rounded-lg outline-none"
        />
        <div className="flex items-center gap-2 text-gray-400">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#333] text-white p-2 rounded-lg outline-none"
          />
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#333] text-white p-2 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* TABLES */}
      {activeTab === "product" ? (
        <TransactionTable
          data={productTransactions}
          isLoading={productQuery.isLoading}
          isError={productQuery.isError}
          error={productQuery.error}
          handleDelete={handleDeleteProduct}
        />
      ) : (
        <RecipeTransactionTable
          data={recipeTransactions}
          isLoading={recipeQuery.isLoading}
          isError={recipeQuery.isError}
          error={recipeQuery.error}
          handleRollback={handleRollback}
        />
      )}
    </div>
  );
};

// ---------- TABLE COMPONENTS ----------

const TransactionTable = ({ data, isLoading, isError, error, handleDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-[#f5f5f5] table-auto">
      <thead className="bg-[#333] text-[#ababab]">
        <tr>
          <th className="pl-5 py-3">Product</th>
          <th className="pl-5 py-3">Vendor</th>
          <th className="pl-5 py-3">Type</th>
          <th className="pl-5 py-3">Quantity</th>
          <th className="pl-5 py-3">Unit Cost</th>
          <th className="pl-5 py-3">Date</th>
          <th className="pl-5 py-3">Notes</th>
          <th className="pl-5 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="8" className="text-center text-gray-400 py-4">Loading...</td>
          </tr>
        ) : isError ? (
          <tr>
            <td colSpan="8" className="text-center text-gray-400 py-4">
              {error?.message || "Failed to fetch"}
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center text-gray-400 py-4">No transactions found.</td>
          </tr>
        ) : (
          data.map((tx) => (
            <tr key={tx._id} className="border-b border-gray-600 hover:bg-[#333]">
              <td className="py-3 pl-5">{tx.productName}</td>
              <td className="py-3 pl-5">{tx.vendorName}</td>
              <td className="py-3 pl-5">{tx.type}</td>
              <td className="py-3 pl-5">{tx.quantity}</td>
              <td className="py-3 pl-5">{tx.unitCost || "N/A"}</td>
              <td className="py-3 pl-5">
                {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
              </td>
              <td className="py-3 pl-5">{tx.notes || "N/A"}</td>
              <td className="py-3 pl-5">
                <button onClick={() => handleDelete(tx._id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const RecipeTransactionTable = ({ data, isLoading, isError, error, handleRollback }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left text-[#f5f5f5] table-auto">
      <thead className="bg-[#333] text-[#ababab]">
        <tr>
          <th className="pl-5 py-3">Recipe</th>
          <th className="pl-5 py-3">Dish</th>
          <th className="pl-5 py-3">Variation</th>
          <th className="pl-5 py-3">Quantity</th>
          <th className="pl-5 py-3">Type</th>
          <th className="pl-5 py-3">Date</th>
          <th className="pl-5 py-3">Notes</th>
          <th className="pl-5 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr><td colSpan="8" className="text-center text-gray-400 py-4">Loading...</td></tr>
        ) : isError ? (
          <tr><td colSpan="8" className="text-center text-gray-400 py-4">{error?.message}</td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan="8" className="text-center text-gray-400 py-4">No recipe transactions.</td></tr>
        ) : (
          data.map((tx) => (
            <tr key={tx._id} className="border-b border-gray-600 hover:bg-[#333]">
              <td className="py-3 pl-5">{tx.recipeName}</td>
              <td className="py-3 pl-5">{tx.dishId?.name || "N/A"}</td>
              <td className="py-3 pl-5">{tx.variationName || "N/A"}</td>
              <td className="py-3 pl-5">{tx.quantityOfDishes}</td>
              <td className="py-3 pl-5">{tx.type}</td>
              <td className="py-3 pl-5">
                {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
              </td>
              <td className="py-3 pl-5">{tx.notes || "N/A"}</td>
              <td className="py-3 pl-5">
                <button
                  onClick={() => handleRollback(tx._id)}
                  className="text-yellow-400 hover:text-yellow-600"
                >
                  Rollback
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Logs;
