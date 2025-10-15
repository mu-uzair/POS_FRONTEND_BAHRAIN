import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  adjustStock,
  getAllVendors,
  updateVendor,
  deleteVendor,
} from "../../https";
import { enqueueSnackbar } from "notistack";
import { FiEdit, FiTrash2, FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

const InventoryEditPanel = () => {
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState("products");
  const [stockAdjustment, setStockAdjustment] = useState({ productId: null, type: null, quantity: "" });
  const [edits, setEdits] = useState({});
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  // Fetch products
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: () => {
      enqueueSnackbar("Failed to fetch products!", { variant: "error" });
    },
  });

  // Fetch vendors
  const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useQuery({
    queryKey: ["vendors"],
    queryFn: getAllVendors,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.log("Error fetching vendors:", error);
      enqueueSnackbar("Failed to fetch vendors!", { variant: "error" });
    },
  });

  // Extract data (updated to match the correct response structure)
  const products = Array.isArray(productsData) ? productsData : [];
  const vendors = Array.isArray(vendorsData?.data?.data.data) ? vendorsData.data.data.data : [];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (productSearchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    }
    if (selectedVendor) {
      filtered = filtered.filter(
        (product) => (product.vendor?._id || product.vendor) === selectedVendor
      );
    }
    return filtered;
  }, [products, productSearchQuery, selectedVendor]);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors;
    if (vendorSearchQuery) {
      filtered = filtered.filter((vendor) =>
        vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [vendors, vendorSearchQuery]);

  // Mutation for updating a product
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      enqueueSnackbar("Product updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update product!", { variant: "error" });
    },
  });

  // Mutation for deleting a product
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      enqueueSnackbar("Product deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete product!", { variant: "error" });
    },
  });

  // Mutation for adjusting stock
  const adjustStockMutation = useMutation({
    mutationFn: ({ id, data }) => adjustStock(id, data),
    onSuccess: () => {
      enqueueSnackbar("Stock adjusted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["products"]);
      setStockAdjustment({ productId: null, type: null, quantity: "" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to adjust stock!", { variant: "error" });
    },
  });

  // Mutation for updating a vendor
  const updateVendorMutation = useMutation({
    mutationFn: updateVendor,
    onSuccess: () => {
      enqueueSnackbar("Vendor updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["vendors"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update vendor!", { variant: "error" });
    },
  });

  // Mutation for deleting a vendor
  const deleteVendorMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      enqueueSnackbar("Vendor deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["vendors"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete vendor!", { variant: "error" });
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

    const fullData = {
      _id: id,
      ...(entity === "product"
        ? { name: products.find((p) => p._id === id).name }
        : { name: vendors.find((v) => v._id === id).name }),
      ...(entity === "product"
        ? {
          unit: products.find((p) => p._id === id).unit,
          quantity_in_stock: products.find((p) => p._id === id).quantity_in_stock,
          reorder_threshold: products.find((p) => p._id === id).reorder_threshold,
          cost_per_unit: products.find((p) => p._id === id).cost_per_unit,
          vendor: products.find((p) => p._id === id).vendor?._id || products.find((p) => p._id === id).vendor,
        }
        : {
          contact: vendors.find((v) => v._id === id)?.contact || "",
          address: vendors.find((v) => v._id === id)?.address || "",
          notes: vendors.find((v) => v._id === id)?.notes || "",
        }),
      ...updatedData,
    };

    switch (entity) {
      case "product":
        updateProductMutation.mutate(fullData);
        break;
      case "vendor":
        updateVendorMutation.mutate(fullData);
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
    if (window.confirm("Are you sure you want to delete this record?")) {
      switch (entity) {
        case "product":
          deleteProductMutation.mutate(id);
          break;
        case "vendor":
          deleteVendorMutation.mutate(id);
          break;
      }
    }
  };

  // Handle stock adjustment
  const handleStockAdjust = (productId, type) => {
    setStockAdjustment({ productId, type, quantity: "" });
  };

  const handleStockSubmit = () => {
    if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
      enqueueSnackbar("Please enter a valid quantity!", { variant: "error" });
      return;
    }
    adjustStockMutation.mutate({
      id: stockAdjustment.productId,
      data: { quantity: Number(stockAdjustment.quantity), type: stockAdjustment.type },
    });
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Inventory Edit Panel</h2>
      <div className="flex gap-3 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedOption("products")}
          className={`px-4 py-2 rounded-lg ${selectedOption === "products" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
            }`}
        >
          Products
        </button>
        <button
          onClick={() => setSelectedOption("vendors")}
          className={`px-4 py-2 rounded-lg ${selectedOption === "vendors" ? "bg-[#333] text-[#f5f5f5]" : "bg-[#1a1a1a] hover:bg-[#333] text-[#f5f5f5]"
            }`}
        >
          Vendors
        </button>
      </div>

      {selectedOption === "products" && (
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by product name..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="min-w-[200px]">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[#f5f5f5]">
              <thead className="bg-[#333] text-[#ababab]">
                <tr>
                  <th className="pl-5 py-3">Name</th>
                  <th className="pl-5 py-3">Unit</th>
                  <th className="pl-5 py-3">Stock</th>
                  <th className="pl-5 py-3">Reorder Threshold</th>
                  <th className="pl-5 py-3">Cost per Unit</th>
                  <th className="pl-5 py-3">Vendor</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400 py-4">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-400 mx-auto"
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
                      Loading products...
                    </td>
                  </tr>
                ) : productsError ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400 py-4">
                      Failed to load products.
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400 py-4">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-600 hover:bg-[#333]">
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={product.name}
                          onChange={(e) => handleEditField("product", product._id, "name", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <select
                          defaultValue={product.unit}
                          onChange={(e) => handleEditField("product", product._id, "unit", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        >
                          <option value="pcs">pcs</option>
                          <option value="kg">kg</option>
                          <option value="L">L</option>
                        </select>
                      </td>
                      <td className="py-3 pl-5">{product.quantity_in_stock}</td>
                      <td className="py-3 pl-5">
                        <input
                          type="number"
                          defaultValue={product.reorder_threshold}
                          onChange={(e) => handleEditField("product", product._id, "reorder_threshold", Number(e.target.value))}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <input
                          type="number"
                          defaultValue={product.cost_per_unit}
                          onChange={(e) => handleEditField("product", product._id, "cost_per_unit", Number(e.target.value))}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <select
                          defaultValue={product.vendor?._id || product.vendor}
                          onChange={(e) => handleEditField("product", product._id, "vendor", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        >
                          <option value="">Select Vendor</option>
                          {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                              {vendor.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-center flex justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => handleUpdate("product", product._id)}
                          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                          title="Update"
                          disabled={updateProductMutation.isLoading}
                        >
                          {updateProductMutation.isLoading && updateProductMutation.variables?._id === product._id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-blue-500"
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
                            <FiEdit size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteRecord("product", product._id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          title="Delete"
                          disabled={deleteProductMutation.isLoading}
                        >
                          {deleteProductMutation.isLoading && deleteProductMutation.variables === product._id ? (
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
                        <button
                          onClick={() => handleStockAdjust(product._id, "in")}
                          className="text-green-500 hover:text-green-600 transition-colors duration-200"
                          title="Stock In"
                          disabled={adjustStockMutation.isLoading}
                        >
                          <FiArrowUpCircle size={30} />
                        </button>
                        <button
                          onClick={() => handleStockAdjust(product._id, "out")}
                          className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                          title="Stock Out"
                          disabled={adjustStockMutation.isLoading}
                        >
                          <FiArrowDownCircle size={30} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOption === "vendors" && (
        <div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by vendor name..."
                value={vendorSearchQuery}
                onChange={(e) => setVendorSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[#f5f5f5]">
              <thead className="bg-[#333] text-[#ababab]">
                <tr>
                  <th className="pl-5 py-3">Name</th>
                  <th className="pl-5 py-3">Contact</th>
                  <th className="pl-5 py-3">Address</th>
                  <th className="pl-5 py-3">Notes</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorsLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-4">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-400 mx-auto"
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
                      Loading vendors...
                    </td>
                  </tr>
                ) : vendorsError ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-4">
                      Failed to load vendors.
                    </td>
                  </tr>
                ) : filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-4">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="border-b border-gray-600 hover:bg-[#333]">
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.name || ""}
                          onChange={(e) => handleEditField("vendor", vendor._id, "name", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.contact || ""}
                          placeholder="Not provided"
                          onChange={(e) => handleEditField("vendor", vendor._id, "contact", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <input
                          type="text"
                          defaultValue={vendor.address || ""}
                          placeholder="Not provided"
                          onChange={(e) => handleEditField("vendor", vendor._id, "address", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
                        />
                      </td>
                      <td className="py-3 pl-5">
                        <textarea
                          defaultValue={vendor.notes || ""}
                          placeholder="Not provided"
                          onChange={(e) => handleEditField("vendor", vendor._id, "notes", e.target.value)}
                          className="bg-[#1a1a1a] text-[#f5f5f5] px-2 py-1 rounded-lg w-full placeholder-gray-500"
                          rows="2"
                        />
                      </td>
                      <td className="py-3 px-3 text-center flex justify-center gap-1">
                        <button
                          onClick={() => handleUpdate("vendor", vendor._id)}
                          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                          title="Update"
                          disabled={updateVendorMutation.isLoading}
                        >
                          {updateVendorMutation.isLoading && updateVendorMutation.variables?._id === vendor._id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-blue-500"
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
                            <FiEdit size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteRecord("vendor", vendor._id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                          title="Delete"
                          disabled={deleteVendorMutation.isLoading}
                        >
                          {deleteVendorMutation.isLoading && deleteVendorMutation.variables === vendor._id ? (
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stockAdjustment.productId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#262626] p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
              {stockAdjustment.type === "in" ? "Stock In" : "Stock Out"}
            </h2>
            <div className="mb-4">
              <label className="block text-[#ababab] mb-1">Quantity</label>
              <input
                type="number"
                value={stockAdjustment.quantity}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#f5f5f5] border border-gray-600 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStockAdjustment({ productId: null, type: null, quantity: "" })}
                className="px-4 py-2 bg-gray-600 text-[#f5f5f5] rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStockSubmit}
                className="px-4 py-2 bg-blue-600 text-[#f5f5f5] rounded-lg hover:bg-blue-700"
                disabled={adjustStockMutation.isLoading}
              >
                {adjustStockMutation.isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-[#f5f5f5] inline-block"
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
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryEditPanel;