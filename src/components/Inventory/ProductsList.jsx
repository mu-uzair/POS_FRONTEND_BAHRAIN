import React, { useState } from "react";
import { formatDateAndTme } from "../../utils/index";
import { FaEdit, FaTrash } from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../https";
import { enqueueSnackbar } from "notistack";

const ProductsList = () => {
  // Fetch products using React Query
  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getAllProducts(),
    placeholderData: keepPreviousData,
    onError: () => {
      enqueueSnackbar("Failed to fetch products!", { variant: "error" });
    },
  });

  // Use resData directly since it’s an array
  const products = Array.isArray(resData) ? resData : [];

  console.log("API resData:", resData, "Products:", products);

  // Calculate summary stats
  const totalProducts = products.length;
  const lowStockCount = products.reduce(
    (count, p) => count + (p.quantity_in_stock <= p.reorder_threshold ? 1 : 0),
    0
  );
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.quantity_in_stock * p.cost_per_unit,
    0
  );

  // Placeholder action handlers (for future edit/delete)
  const handleEdit = (productId) => {
    enqueueSnackbar("Edit functionality coming soon!", { variant: "info" });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      enqueueSnackbar("Delete functionality coming soon!", { variant: "info" });
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Products</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-[#1a1a1a] p-4 rounded-lg">
        <div>
          <p className="text-[#ababab]">Total Products</p>
          <p className="text-[#f5f5f5] text-lg font-bold">{totalProducts}</p>
        </div>
        <div>
          <p className="text-[#ababab]">Low Stock Items</p>
          <p className="text-[#f5f5f5] text-lg font-bold">{lowStockCount}</p>
        </div>
        <div>
          <p className="text-[#ababab]">Total Stock Value</p>
          <p className="text-[#f5f5f5] text-lg font-bold">Rs {totalStockValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reorder Threshold</th>
              <th className="p-3">Cost per Unit</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 p-4">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 p-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className={`border-b border-gray-600 hover:bg-[#333] ${
                    product.quantity_in_stock <= product.reorder_threshold
                      ? "bg-red-900/20"
                      : ""
                  }`}
                >
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.unit}</td>
                  <td className="p-4">
                    {product.quantity_in_stock}
                    {product.quantity_in_stock <= product.reorder_threshold && (
                      <span className="ml-2 text-red-400 text-xs font-semibold">
                        Low
                      </span>
                    )}
                  </td>
                  <td className="p-4">{product.reorder_threshold}</td>
                  <td className="p-4">Rs {product.cost_per_unit.toFixed(2)}</td>
                  <td className="p-4">{product.vendor?.name || "Unknown"}</td>
                  <td className="p-4">{formatDateAndTme(product.createdAt)}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-400 hover:text-blue-500 transition"
                      title="Edit"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-400 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;