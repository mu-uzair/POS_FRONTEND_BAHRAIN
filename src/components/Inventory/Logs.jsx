import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTransactions, deleteTransaction } from "../../https/index";

const Logs = () => {
  console.log("Logs Component - Rendering");

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
    onSuccess: (data) => {
      console.log("getTransactions Success:", data);
    },
    onError: (error) => {
      console.error("getTransactions Error:", error);
      enqueueSnackbar(error.message || "Failed to fetch transaction history!", { variant: "error" });
    },
  });

  const transactions = Array.isArray(data?.data?.data) ? data.data.data : [];

  console.log("Transactions:", transactions);

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      enqueueSnackbar("Transaction deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["transactions"]);
    },
    onError: (error) => {
      console.error("deleteTransaction Error:", error);
      enqueueSnackbar(error.message || "Failed to delete transaction!", { variant: "error" });
    },
  });

  const handleDelete = (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(transactionId);
    }
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Transaction History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5] table-auto">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="pl-5 py-3 w-[15%]">Product</th>
              <th className="pl-5 py-3 w-[15%]">Vendor Name</th>
              <th className="pl-5 py-3 w-[10%]">Type</th>
              <th className="pl-5 py-3 w-[10%]">Quantity</th>
              <th className="pl-5 py-3 w-[10%]">Unit Cost</th>
              <th className="pl-5 py-3 w-[15%]">Date</th>
              <th className="pl-5 py-3 w-[15%]">Notes</th>
              <th className="pl-5 py-3 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-4">
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400 mr-2"
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
                    <span>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-4">
                  Failed to load transactions: {error?.message || "Unknown error"}
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-400 py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-600 hover:bg-[#333]">
                  <td className="py-3 pl-5">{transaction.productName || "Unknown Product"}</td>
                  <td className="py-3 pl-5">{transaction.vendorName || "N/A"}</td>
                  <td className="py-3 pl-5">{transaction.type === "in" ? "Stock In" : "Stock Out"}</td>
                  <td className="py-3 pl-5">{transaction.quantity}</td>
                  <td className="py-3 pl-5">
                    {typeof transaction.unitCost === "number"
                      ? `Rs${transaction.unitCost.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="py-3 pl-5">
                    {new Date(transaction.date).toLocaleDateString()}{" "}
                    {new Date(transaction.date).toLocaleTimeString()}
                  </td>
                  <td className="py-3 pl-5">{transaction.notes || "N/A"}</td>
                  <td className="py-3 pl-5">
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading && deleteMutation.variables === transaction._id
                        ? "Deleting..."
                        : "Delete"}
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

export default Logs;