import React, { useState } from "react";

import { FaCircle } from "react-icons/fa";
import { getAvatarName, formatDateAndTme } from "../../utils/index";
import { useDispatch } from "react-redux";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FcPrint } from "react-icons/fc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Import the new verification function from  https/index
import { updateOrderStatus, deleteOrder, updateTable, verifyAdminPassword } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { MdFileDownloadDone, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
import { setCartItems } from "../../redux/slice/cartSlice";
import { sendToPrinters } from "../../https/printBridge";
import { updateOrderStatusInCache, removeOrderFromCache, isTrulyOfflineOrder } from "../../utils/offlineStore";
import { useOfflineMode } from "../../constants/OfflineModeContext";
import { load, save, STORAGE_KEYS } from "../../utils/offlineStore";

const OrderCard = ({ order }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Add offline mode hook
  const { isOfflineMode } = useOfflineMode();



  // 🔐 Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  // "delete" or "edit"
  const [passwordAction, setPasswordAction] = useState(null);

  // 🔔 Confirmation modal for status changes
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // 🔄 Local state to track current order status for immediate UI updates
  const [localOrderStatus, setLocalOrderStatus] = useState(order.orderStatus);

  // ✅ Get user role from localStorage
  const getUserRole = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user?.role?.toLowerCase().trim() || null;
    } catch (error) {
      console.error("❌ Error getting user role:", error);
      return null;
    }
  };




  // Check if order is from offline cache
  const isOfflineOrder = async (orderId) => {
    try {
      const cachedOrders = (await load('offline:orders')) || [];
      return cachedOrders.some(o => (o._id === orderId || o.orderId === orderId));
    } catch (error) {
      console.error("Error checking offline order:", error);
      return false;
    }
  };

  // --- MUTATIONS ---

  // ✅ Table update mutation (Unchanged)
  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, status }) => updateTable({ tableId, status }),
    onSuccess: () => {
      enqueueSnackbar("Table status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Error updating table status:", error);
      enqueueSnackbar("Failed to update table status!", { variant: "error" });
    },
  });

  // ✅ Password Verification Mutation (NEW)
  const verifyPasswordMutation = useMutation({
    mutationFn: (password) => verifyAdminPassword(password),
    onSuccess: () => {
      enqueueSnackbar("Password verified!", { variant: "success" });
      if (passwordAction === "edit") {
        proceedWithEdit();
      } else if (passwordAction === "delete") {
        // If password is correct, proceed to delete without asking for it again
        deleteOrderMutation.mutate({ ...order, password: adminPassword });
      }
      // Reset state after success
      setShowPasswordModal(false);
      setAdminPassword("");
      setPasswordAction(null);
    },
    onError: (error) => {
      console.error("Error verifying password:", error);
      const errorMessage = error?.response?.data?.message || "Invalid admin password.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });



const orderStatusUpdateMutation = useMutation({
  mutationFn: ({ orderId, orderStatus }) => 
    updateOrderStatus({ orderId, orderStatus }),
  onSuccess: async (data, variables) => {
    console.log('✅ [ONLINE] Status updated via API');
    console.log('   OrderID:', variables.orderId);
    console.log('   New Status:', variables.orderStatus);
    
    const message = data?.message || "Order status updated successfully!";
    enqueueSnackbar(message, { variant: "success" });
    
    // ✅ IMMEDIATE: Update local state for instant UI change
    setLocalOrderStatus(variables.orderStatus);
    
    // ✅ DIRECT CACHE UPDATE: Update IndexedDB immediately
    try {
      console.log('💾 Updating cache directly...');
      
      // Load current cache
      const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
      console.log(`   Found ${orders.length} orders in cache`);
      
      // Find and update the order with IMPROVED ID matching
      let found = false;
      const updatedOrders = orders.map(o => {
        // ✅ IMPROVED: Check all possible ID combinations
        const matches = 
          o._id === variables.orderId ||
          o.orderId === variables.orderId ||
          String(o._id) === String(variables.orderId) ||
          String(o.orderId) === String(variables.orderId);
        
        if (matches) {
          found = true;
          console.log(`   ✅ Found order (cache _id: ${o._id}, search id: ${variables.orderId})`);
          console.log(`   📝 Updating status: ${o.orderStatus} → ${variables.orderStatus}`);
          return { 
            ...o, 
            orderStatus: variables.orderStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      
      if (found) {
        // Save updated cache
        await save(STORAGE_KEYS.ORDERS_CACHE, updatedOrders);
        console.log('✅ Cache saved successfully!');
        
        // Verify the update
        const verify = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
        const verifyOrder = verify.find(o => 
          o._id === variables.orderId ||
          o.orderId === variables.orderId ||
          String(o._id) === String(variables.orderId) ||
          String(o.orderId) === String(variables.orderId)
        );
        
        if (verifyOrder) {
          console.log(`✅ Verification SUCCESS: Status is now "${verifyOrder.orderStatus}"`);
        } else {
          console.error('❌ Verification FAILED: Order not found after save');
        }
      } else {
        console.warn(`⚠️ Order ${variables.orderId} not found in cache`);
        console.warn('   Cache IDs:', orders.map(o => ({ _id: o._id, orderId: o.orderId })));
      }
      
    } catch (err) {
      console.error('❌ Failed to update cache:', err);
    }
    
    // ✅ ALSO: Invalidate React Query (for next page load)
    await queryClient.invalidateQueries(["orders"]);
    
    if (variables.orderStatus === "Completed" && order.table) {
      updateTableMutation.mutate({ 
        tableId: order.table._id, 
        status: "Available" 
      });
    }

    setShowConfirmModal(false);
    setPendingStatus(null);
  },
  onError: (error) => {
    console.error("❌ [ONLINE] Status update failed:", error);
    const errorMessage = 
      error?.response?.data?.message || 
      "Failed to update order status!";
    enqueueSnackbar(errorMessage, { variant: "error" });

    setShowConfirmModal(false);
    setPendingStatus(null);
  },
});



  const deleteOrderMutation = useMutation({
  mutationFn: (order) => deleteOrder(order._id, order.password),
  onSuccess: async (data, deletedOrder) => {
    console.log('✅ [ONLINE DELETE] Order deleted from backend');
    console.log('   Order ID:', deletedOrder._id);
    
    try {
      // ✅ STEP 1: Remove from IndexedDB cache
      console.log('   🗑️ Removing from cache...');
      const removed = await removeOrderFromCache(deletedOrder._id);
      
      if (removed) {
        console.log('   ✅ Removed from cache');
      } else {
        console.warn('   ⚠️ Order not found in cache (might be already removed)');
      }
      
      // ✅ STEP 2: Invalidate React Query to refresh UI
      console.log('   🔄 Invalidating React Query...');
      await queryClient.invalidateQueries(["orders"]);
      console.log('   ✅ React Query invalidated');
      
      // ✅ STEP 3: Update table status if needed
      if (deletedOrder.table) {
        console.log('   🪑 Updating table status...');
        updateTableMutation.mutate({
          tableId: deletedOrder.table._id,
          status: "Available"
        });
      }
      
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      
    } catch (err) {
      console.error('❌ Error cleaning up after delete:', err);
      // Still show success since backend delete worked
      enqueueSnackbar("Order deleted (cache cleanup error)", { 
        variant: "warning" 
      });
    }
  },
  onError: (error) => {
    console.error("❌ Error deleting order:", error);
    enqueueSnackbar("Failed to delete order!", { variant: "error" });
  },
});


  // --- HANDLERS ---

  // --- PRINTING HANDLER ---
  const handlePrintOrder = async (order) => {
    try {
      enqueueSnackbar("🖨️ Sending receipt to cashier printer...", { variant: "info" });

      const response = await sendToPrinters({
        ...order,
        target: "cashier", // only cashier printer
      });

      enqueueSnackbar(response?.message || "✅ Receipt printed successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Print error:", error);
      enqueueSnackbar(`❌ Print failed: ${error.message}`, { variant: "error" });
    }
  };


  // ✅ Handle status change with confirmation for critical statuses (Unchanged)
  const isOnline = () => navigator.onLine;


  // ============================================
  // HANDLE STATUS CHANGE
  // ============================================
  const handleStatusChange = async (newStatus) => {
    const orderId = order._id || order.orderId;

    // ============================================
    // HANDLE DELETE
    // ============================================
    if (newStatus === "delete") {
      const isOfflineCreated = await isTrulyOfflineOrder(orderId);

      // Prevent deleting online orders while offline
      if (isOfflineMode && !isOfflineCreated) {
        enqueueSnackbar(
          "⚠️ Cannot delete online orders while offline. Please connect to the internet.",
          { variant: "warning" }
        );
        return;
      }

      if (!window.confirm("Are you sure you want to delete this order?")) {
        return;
      }

      // Delete offline-created order
      if (isOfflineCreated) {
        const removed = await removeOrderFromCache(orderId);
        if (removed) {
          enqueueSnackbar("✅ Offline order removed successfully", {
            variant: "success"
          });
          queryClient.invalidateQueries(["orders"]);
        } else {
          enqueueSnackbar("❌ Failed to remove offline order", {
            variant: "error"
          });
        }
        return;
      }
      const userRole = getUserRole();
      if (userRole === "admin") {
        deleteOrderMutation.mutate({ ...order, password: null });
      } else {
        setPasswordAction("delete");
        setShowPasswordModal(true);
      }
      
      return;
    }

    // ============================================
    // HANDLE STATUS UPDATE
    // ============================================

    if (isOfflineMode) {
      // ------------------------------------------------
      // OFFLINE MODE: Update cache and queue for sync
      // ------------------------------------------------
      console.log(`📴 [OFFLINE] Updating status: ${orderId} -> ${newStatus}`);

      try {
        // ✅ Update in cache with addToSync = true
        const updated = await updateOrderStatusInCache(orderId, newStatus, true);

        if (!updated) {
          enqueueSnackbar("Failed to update order status offline", {
            variant: "error"
          });
          return;
        }

        // ✅ Update local state immediately
        setLocalOrderStatus(newStatus);

        // ✅ Manually update React Query cache for instant UI update
        queryClient.setQueryData(["orders"], (oldData) => {
          if (!oldData) return oldData;

          if (oldData?.pages) {
            // Infinite query format
            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                data: page.data?.map(ord => {
                  const id = ord._id || ord.orderId;
                  if (id === orderId) {
                    return { ...ord, orderStatus: newStatus };
                  }
                  return ord;
                }) || []
              }))
            };
          } else if (Array.isArray(oldData)) {
            // Array format
            return oldData.map(ord => {
              const id = ord._id || ord.orderId;
              if (id === orderId) {
                return { ...ord, orderStatus: newStatus };
              }
              return ord;
            });
          }

          return oldData;
        });

        enqueueSnackbar(
          `Order status updated to ${newStatus} (offline - will sync when online)`,
          { variant: "warning", autoHideDuration: 4000 }
        );

        console.log(`✅ [OFFLINE] Status updated and queued for sync`);

      } catch (error) {
        console.error('❌ [OFFLINE] Status update failed:', error);
        enqueueSnackbar("Failed to update status offline", { variant: "error" });
      }

      return;
    }

    // ------------------------------------------------
    // ONLINE MODE: Call API only
    // ------------------------------------------------
    console.log(`🌐 [ONLINE] Updating status via API: ${orderId} -> ${newStatus}`);

    // Check if confirmation needed for critical statuses
    if (newStatus === "Completed" || newStatus === "Cancelled") {
      setPendingStatus(newStatus);
      setShowConfirmModal(true);
    } else {
      // Direct update for non-critical statuses
      orderStatusUpdateMutation.mutate({
        orderId: order._id,
        orderStatus: newStatus
      });
    }
  };

  // ✅ Confirm status change (Unchanged)
  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      orderStatusUpdateMutation.mutate({
        orderId: order._id,
        orderStatus: pendingStatus
      });
    }
  };

  // ✅ Edit order logic - with password protection
  const handleEditOrder = () => {
    if (!order?.items?.length) return;

    const userRole = getUserRole();

    // If admin, proceed directly
    if (userRole === "admin") {
      proceedWithEdit();
    } else {
      // Show password modal for non-admins
      setPasswordAction("edit");
      setShowPasswordModal(true);
    }
  };

  // ✅ Proceed with edit after password verification (Unchanged)
  const proceedWithEdit = () => {
    dispatch(setEditingMode(true));


    // console.log("🧾 Original order items before edit:", order.items);
    // --- FIX: STRUCTURE THE TABLE DATA FOR REDUX STATE ---
    const tableDataForRedux = order.table
      ? {
        // Map the server's ID field (likely _id) to your Redux's tableId
        tableId: order.table._id || order.table,
        // Map the server's table number field to your Redux's tableNo
        tableNo: order.table.tableNo || null,
      }
      : null;
    console.log("Table Data for Redux:", tableDataForRedux);



    const itemsForCart = order.items.map((item) => {
      const variationKey =
        item.variationName?.toLowerCase?.().trim?.() || "default";

      return {
        orderNo: order.orderNo || null,
        id: item.menuItem,
        dishId: item.menuItem,
        menuItem: item.menuItem, // keep for backend consistency
        name: item.name,
        variationName: item.variationName || null,
        variationKey, // ✅ normalized key added
        pricePerQuantity: Number((item.pricePerQuantity || item.price).toFixed(3)),
        price: Number((item.pricePerQuantity || item.price).toFixed(3)),
        quantity: Number(item.quantity) || 1,
        section: item.section || null,
        status: item.status || "Pending",
      };
    });

    // console.log("🛒 Items sent to Redux cart:", itemsForCart);
    console.log("🧾 Order items in OrderCard before dispatch:", order.items);

    dispatch(
      setCustomer({
        name: order.customerDetails?.name,
        phone: order.customerDetails?.phone,
        guests: order.customerDetails?.guests,
        orderType: order.customerDetails?.orderType,
        paymentMethod: order.paymentMethod || "Online",
        orderId: order.orderId || order._id,
        orderNo: order.orderNo || null,
        // table: order.table || null,
        table: tableDataForRedux,
        isEdit: true,
        items: order.items || [],
        comment: order.comment || "",
        printedItems: order.items || [],
      })
    );

    if (order.customerDetails?.orderType === "Delivery") {
      dispatch(
        setDeliveryInfo({
          address: order.deliveryAddress,
          deliveryBoyId: order.deliveryBoyId,
          phone: order.customerDetails?.phone,
          name: order.customerDetails?.name,
        })
      );
    }

    dispatch(setCartItems(itemsForCart));
    navigate("/Menu");
  };

  // ✅ Confirm password from modal
  const handleConfirmPassword = async () => {
    if (!adminPassword) {
      enqueueSnackbar("Admin password required!", { variant: "error" });
      return;
    }

    // Trigger the password verification mutation
    verifyPasswordMutation.mutate(adminPassword);
  };

  // Get confirmation message based on status (Unchanged)
  const getConfirmationMessage = () => {
    // ... (unchanged logic)
    if (pendingStatus === "Completed") {
      return {
        title: "Complete Order?",
        message: "This will automatically deduct ingredients from inventory. Are you sure?",
        icon: "✅",
        color: "blue"
      };
    }
    if (pendingStatus === "Cancelled") {
      const willRollback = order.orderStatus === "Completed";
      return {
        title: "Cancel Order?",
        message: willRollback
          ? "This will roll back the inventory deduction. Are you sure?"
          : "Are you sure you want to cancel this order?",
        icon: "⚠️",
        color: "red"
      };
    }
    return { title: "", message: "", icon: "", color: "blue" };
  };

  const confirmInfo = getConfirmationMessage();

  // Get password modal title based on action (Unchanged)
  const getPasswordModalTitle = () => {
    if (passwordAction === "delete") {
      return "Delete Order - Admin Password Required";
    }
    if (passwordAction === "edit") {
      return "Edit Order - Admin Password Required";
    }
    return "Admin Password Required";
  };

  const getPasswordModalDescription = () => {
    if (passwordAction === "delete") {
      return "Enter admin password to delete this order.";
    }
    if (passwordAction === "edit") {
      return "Enter admin password to edit this order.";
    }
    return "Enter admin password to proceed.";
  };

  // Check if any critical action is loading
  const isPasswordVerificationLoading = verifyPasswordMutation.isLoading;
  const isOrderDeletionLoading = deleteOrderMutation.isLoading;



  return (
    <>
      {/* 🧾 Order Card - Responsive */}
      {/* ... (rest of the card JSX, unchanged) */}
      <div className="w-full max-w-[450px] bg-[#262626] p-3 sm:p-4 rounded-lg mb-4 h-auto">
        {/* Header Section */}
        <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
          {/* Avatar */}
          <button className="bg-[#f6b100] p-2 sm:p-2.5 lg:p-3 text-base sm:text-lg lg:text-xl font-bold rounded-lg flex-shrink-0">
            {getAvatarName(order.customerDetails.name)}
          </button>


          {/* Main Content Wrapper */}
          <div className="flex-1 min-w-0">
            {/* Customer Info & Actions Container */}
            <div className="flex flex-col gap-3">
             
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-sm sm:text-base lg:text-lg font-semibold tracking-wide truncate">
                  {order.customerDetails.name}
                </h1>

                <button
                  onClick={() => handlePrintOrder(order)}
                  className="text-gray-400 hover:scale-3d transition-colors"
                  title="Print Receipt"
                >
                  <FcPrint size={16} className="sm:w-7 sm:h-7 hover:scale-105" />
                </button>
              </div>

              {/* Customer Details Below */}
              <div className="flex flex-col items-start gap-1 mt-1">
                <p className="text-[#ababab] text-xs sm:text-sm">
                  #{order.orderId} / {order.customerDetails.orderType}
                </p>
                <p className="text-[#ababab] text-xs sm:text-sm">#{order.orderNo}</p>
                {order.table && (
                  <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
                    Table
                    <FaLongArrowAltRight className="text-[#ababab] mx-1 sm:mx-2 inline" />
                    {order.table.tableNo}
                  </p>
                )}
              </div>

              {/* Actions & Status Section */}
              <div className="flex flex-col gap-2">
                {/* Action Buttons Row */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleEditOrder}
                    className="bg-[#1a1a1a] text-blue-500 hover:text-blue-400 p-2 rounded-lg flex-shrink-0 disabled:opacity-50"
                    title="Edit Order"
                    disabled={orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading}
                  >
                    <MdEdit size={18} className="sm:w-5 sm:h-5" />
                  </button>

                  <select
                    className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 px-2 py-2 rounded-lg focus:outline-none text-xs sm:text-sm flex-1 min-w-[120px] ${localOrderStatus === "Ready"
                      ? "text-green-500"
                      : localOrderStatus === "Completed"
                        ? "text-blue-500"
                        : localOrderStatus === "Cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    value={localOrderStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading}
                  >
                    <option className="text-yellow-500" value="In Progress">
                      In Progress
                    </option>
                    <option className="text-green-500" value="Ready">
                      Ready
                    </option>
                    <option className="text-blue-500" value="Completed">
                      Completed
                    </option>
                    <option className="text-red-500" value="Cancelled">
                      Cancelled
                    </option>
                    <option className="text-red-500" value="delete">
                      Delete Order
                    </option>


                  </select>

                </div>

                {/* Status Indicator */}
                <p className="text-[#ababab] text-xs sm:text-sm flex items-center">
                  {orderStatusUpdateMutation.isLoading || isPasswordVerificationLoading ? (
                    <span className="animate-pulse text-gray-400">Processing action...</span>
                  ) : localOrderStatus === "Ready" ? (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-green-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Order Ready</span>
                    </>
                  ) : localOrderStatus === "Completed" ? (
                    <>
                      <MdFileDownloadDone className="inline mr-1 sm:mr-2 text-blue-600 text-sm sm:text-base flex-shrink-0" />
                      <span>Order Completed</span>
                    </>
                  ) : localOrderStatus === "Cancelled" ? (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-red-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Order Cancelled</span>
                    </>
                  ) : (
                    <>
                      <FaCircle className="inline mr-1 sm:mr-2 text-yellow-600 text-[8px] sm:text-xs flex-shrink-0" />
                      <span>Now Cooking</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 text-[#ababab] gap-1 sm:gap-0">
          <p className="text-xs sm:text-sm">{formatDateAndTme(order.createdAt)}</p>
          <p className="text-xs sm:text-sm">{order.items.length} Items</p>
        </div>

        <hr className="text-[#f5f5f5] mt-3 sm:mt-4 border-t border-gray-500" />

        {/* Total Section */}
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold">Total</h1>
          <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
            BHD {order.bills.totalWithTax.toFixed(3)}
          </p>
        </div>
      </div>

      {/* 🔔 Status Change Confirmation Modal (Unchanged) */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[420px] border border-gray-700">
            {/* ... (Modal content) ... */}
            <div className="text-center mb-4">
              <div className="text-4xl sm:text-5xl mb-3">{confirmInfo.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-50">
                {confirmInfo.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {confirmInfo.message}
              </p>
            </div>

            {orderStatusUpdateMutation.isLoading && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-400 text-sm">Processing...</span>
              </div>
            )}

            <div className="flex justify-end gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingStatus(null);
                }}
                disabled={orderStatusUpdateMutation.isLoading}
                className="px-4 sm:px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={orderStatusUpdateMutation.isLoading}
                className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${confirmInfo.color === "red"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 Password Modal - Responsive (Updated button states) */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-[#2e2c2c] p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-[320px] sm:max-w-[400px] border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-50">
              {getPasswordModalTitle()}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              {getPasswordModalDescription()}
            </p>

            <input
              type="password"
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded-lg w-full p-2 sm:p-2.5 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConfirmPassword()}
              disabled={isPasswordVerificationLoading || deleteOrderMutation}
            />

            {isPasswordVerificationLoading && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-400 text-sm">Verifying...</span>
              </div>
            )}

            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword("");
                  setPasswordAction(null);
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm sm:text-base transition-colors disabled:opacity-50"
                disabled={isPasswordVerificationLoading || isOrderDeletionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPassword}
                disabled={isPasswordVerificationLoading || isOrderDeletionLoading}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-sm sm:text-base transition-colors disabled:opacity-50 ${passwordAction === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isPasswordVerificationLoading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;