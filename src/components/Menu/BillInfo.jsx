// import React, { useState, useEffect } from "react";
// import { sendToPrinters } from "../../https/printBridge";
// import { useDispatch, useSelector } from "react-redux";
// import { getTotalPrice } from "../../redux/slice/cartSlice";
// import { enqueueSnackbar } from "notistack";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { addOrder, updateOrder, updateTable } from "../../https";
// import { removeAllItems } from "../../redux/slice/cartSlice";
// import { removeCustomer, confirmOrder, setCustomer } from "../../redux/slice/customerSlice";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { roundBhd } from "../../utils";
// import Invoice from "../invoice/Invoice";
// import DeliveryModal from "../shared/DeliveryModal";
// import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// // ✅ Import offline store utilities
// import { save, load } from "../../utils/offlineStore";

// // ✅ Offline storage keys
// const OFFLINE_ORDERS_KEY = "offline:orders";
// const OFFLINE_PENDING_SYNC_KEY = "offline:pendingSync";

// // ✅ Calculate delta items helper
// const calculateDeltaItems = (currentItems, previousItems) => {
//   const deltaItems = [];
  
//   currentItems.forEach((currentItem) => {
//     const previousItem = previousItems.find(
//       (prev) =>
//         prev.menuItem === (currentItem.menuItem || currentItem.dishId || currentItem.id) &&
//         (prev.variationName?.toLowerCase?.().trim?.() ===
//           currentItem.variationName?.toLowerCase?.().trim?.() ||
//           (!prev.variationName && !currentItem.variationName))
//     );

//     if (!previousItem) {
//       deltaItems.push({
//         ...currentItem,
//         quantity: currentItem.quantity,
//         isNew: true
//       });
//     } else if (currentItem.quantity > previousItem.quantity) {
//       const additionalQuantity = currentItem.quantity - previousItem.quantity;
//       deltaItems.push({
//         ...currentItem,
//         quantity: additionalQuantity,
//         isNew: false,
//         previousQuantity: previousItem.quantity
//       });
//     }
//   });

//   console.log("📊 Delta Calculation:", {
//     previous: previousItems.length,
//     current: currentItems.length,
//     delta: deltaItems.length,
//     deltaItems
//   });

//   return deltaItems;
// };

// const BillInfo = () => {
//   const dispatch = useDispatch();
//   const queryClient = useQueryClient();
//   const isEditing = useSelector((state) => state.editOrder.isEditing);
//   const customerData = useSelector((state) => state.customer);
//   const cartData = useSelector((state) => state.cart);
//   const total = useSelector(getTotalPrice);

//   const [paymentMethod, setPaymentMethod] = useState(
//     customerData.paymentMethod || "Cash"
//   );
//   const [tax, setTax] = useState(0);
//   const [totalPriceWithTax, setTotalPriceWithTax] = useState(0);
//   const [showInvoice, setShowInvoice] = useState(false);
//   const [orderInfo, setOrderInfo] = useState(null);
//   const [placedOrderData, setPlacedOrderData] = useState(null);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [storedTotal, setStoredTotal] = useState(0);
//   const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
//   const [orderComment, setOrderComment] = useState(customerData.comment || "");

//   const handleCommentChange = (e) => {
//     const value = e.target.value;
//     setOrderComment(value);
    
//     dispatch(setCustomer({
//       ...customerData,
//       comment: value,
//     }));
//   };

//   const roundTo3 = (num) => {
//     const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
//     return Math.round(n * 1000) / 1000;
//   };

//   const handlePaymentMethodChange = (method) => {
//     dispatch(setPaymentMethod(method));
//   };

//   useEffect(() => {
//     const taxRate = 10;
//     const calculatedTax = roundTo3((total * taxRate) / 100);
//     const totalWithTax = roundTo3(total + calculatedTax);
//     const discountAmount = roundTo3((totalWithTax * discountPercentage) / 100);
//     const finalTotal = totalWithTax - discountAmount;
//     setTax(calculatedTax);
//     setTotalPriceWithTax(roundBhd(finalTotal));
//   }, [total, paymentMethod, discountPercentage]);

//   // ✅ Mutation for adding new order
//   const orderMutation = useMutation({
//     mutationFn: (reqData) => addOrder(reqData),
//     onSuccess: async (resData) => {
//       console.log("✅ ONLINE ORDER PLACED - Server Response:", resData.data);
//       dispatch(removeAllItems());
//       setOrderComment("");
//       const { data } = resData.data;

//       const tableDataForReceipt = customerData.table
//         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//         : data.table;

//       const orderDataForReceipt = {
//         ...data,
//         table: tableDataForReceipt,
//       };

//       setPlacedOrderData(orderDataForReceipt);
//       console.log("Placed Order Data:", orderDataForReceipt);

//       const tableData = {
//         tableId: data.table,
//         status: "Booked",
//         orderId: data._id,
//       };

//       setTimeout(() => tableUpdateMutation.mutate(tableData), 1500);

//       await queryClient.invalidateQueries(["orders"]);

//       enqueueSnackbar("Order Placed!", { variant: "success" });
//       dispatch(setCustomer({
//         ...customerData,
//         comment: "",
//       }));
      
//       // ✅ CRITICAL: Confirm order AFTER successful placement to increment counter
//       dispatch(confirmOrder());
//     },
//     onError: (error) => {
//       console.error("❌ ONLINE ORDER PLACEMENT FAILED:", error);
//       enqueueSnackbar("Failed to place order!", { variant: "error" });
//     },
//   });

//   // ✅ Mutation for table update
//   const tableUpdateMutation = useMutation({
//     mutationFn: (reqData) => updateTable(reqData),
//     onSuccess: async () => {
//       dispatch(removeCustomer());
//       dispatch(removeAllItems());

//       await queryClient.invalidateQueries(["tables"]);
//     },
//     onError: (error) => {
//       console.error("Table Update Error:", error);
//     },
//   });

//   // ✅ Mutation for order update
//   const updateOrderMutation = useMutation({
//     mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
//     onSuccess: async (resData, variables) => {
//       console.log("✅ ONLINE ORDER UPDATED - Server Response:", resData.data);
//       dispatch(removeAllItems());
//       setOrderComment("");

//       const serverData = resData?.data?.data || {};

//       const tableDataForReceipt = customerData.table
//         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//         : serverData.table;

//       let updatedOrderDataForReceipt = {
//         ...serverData,
//         table: tableDataForReceipt,
//       };

//       if (!resData?.data?.data) {
//         updatedOrderDataForReceipt = {
//           ...placedOrderData,
//           ...variables.updateData,
//           table: tableDataForReceipt,
//         };
//       }

//       setPlacedOrderData(updatedOrderDataForReceipt);

//       try {
//         await queryClient.invalidateQueries(["orders"]);
//         await queryClient.refetchQueries(["orders"], { active: true });

//         if (variables.orderId) {
//           await queryClient.invalidateQueries(["order", variables.orderId]);
//         }

//         console.log("✅ Cache invalidated and refetched after order update");
//       } catch (cacheError) {
//         console.error("Cache invalidation error:", cacheError);
//       }

//       enqueueSnackbar("Order updated successfully!", { variant: "success" });
//     },
//     onError: (error) => {
//       console.error("❌ ONLINE ORDER UPDATE FAILED:", error);
//       enqueueSnackbar(
//         error?.response?.data?.message || "Failed to update order.",
//         { variant: "error" }
//       );
//     },
//   });

//   // ✅ Handle Delivery Order with Customer Info
//   const handleDeliveryOrder = async (deliveryData) => {
//     try {
//       dispatch(
//         setCustomer({
//           name: deliveryData.name,
//           phone: deliveryData.phone,
//           guests: 0,
//           orderType: "Delivery",
//         })
//       );

//       const deliveryInfo = {
//         address: deliveryData.address,
//         deliveryBoyId: deliveryData.deliveryBoy,
//         phone: deliveryData.phone,
//         name: deliveryData.name
//       };

//       dispatch(setDeliveryInfo(deliveryInfo));
//       setIsDeliveryModalOpen(false);

//       setTimeout(() => {
//         handlePlaceOrder();
//       }, 100);
//     } catch (error) {
//       console.error("Delivery Order Error:", error);
//       enqueueSnackbar("Failed to create delivery order!", { variant: "error" });
//     }
//   };

//   // ✅ NEW: Save order offline to IndexedDB
//   const saveOrderOffline = async (orderData) => {
//     try {
//       console.log("💾 SAVING ORDER OFFLINE...", orderData);
      
//       const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
      
//       // Mark order as offline with proper structure
//       const offlineOrder = {
//         ...orderData,
//         isOffline: true,
//         createdAt: new Date().toISOString(),
//         syncStatus: "pending"
//       };

//       offlineOrders.push(offlineOrder);
//       await save(OFFLINE_ORDERS_KEY, offlineOrders);

//       // ✅ Save to pending sync queue separately
//       const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
//       pendingSync.push({
//         type: "addOrder",
//         orderId: offlineOrder.orderId,
//         data: offlineOrder,
//         timestamp: Date.now()
//       });
//       await save(OFFLINE_PENDING_SYNC_KEY, pendingSync);

//       console.log("✅ ORDER SAVED OFFLINE:", offlineOrder);
//       console.log("📦 TOTAL OFFLINE ORDERS:", offlineOrders.length);
//       console.log("📋 PENDING SYNC QUEUE:", pendingSync.length);
      
//       return offlineOrder;
//     } catch (error) {
//       console.error("❌ FAILED TO SAVE ORDER OFFLINE:", error);
//       throw error;
//     }
//   };

//   // ✅ NEW: Update existing offline order in IndexedDB (FIXED)
//   const updateOfflineOrder = async (orderId, updateData) => {
//     try {
//       console.log("🔄 UPDATING OFFLINE ORDER...", { orderId, updateData });
      
//       const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
//       console.log("📦 Current offline orders before update:", offlineOrders);
      
//       const orderIndex = offlineOrders.findIndex(
//         (order) => order.orderId === orderId
//       );

//       if (orderIndex === -1) {
//         console.error("❌ OFFLINE ORDER NOT FOUND:", orderId);
//         throw new Error("Offline order not found");
//       }

//       console.log("🎯 FOUND ORDER AT INDEX:", orderIndex);
//       console.log("📄 OLD ORDER DATA:", offlineOrders[orderIndex]);

//       // ✅ Properly merge the order data
//       offlineOrders[orderIndex] = {
//         ...offlineOrders[orderIndex],
//         ...updateData,
//         orderId: orderId, // Keep original orderId
//         isOffline: true, // Maintain offline flag
//         updatedAt: new Date().toISOString(),
//         syncStatus: "pending"
//       };

//       await save(OFFLINE_ORDERS_KEY, offlineOrders);

//       // ✅ Update pending sync queue - replace old entry with updated one
//       const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
      
//       // Remove old entry for this orderId
//       const filteredSync = pendingSync.filter(item => item.orderId !== orderId);
      
//       // Add updated entry
//       filteredSync.push({
//         type: "addOrder", // Use addOrder since we're syncing the complete order
//         orderId: orderId,
//         data: offlineOrders[orderIndex],
//         timestamp: Date.now()
//       });
      
//       await save(OFFLINE_PENDING_SYNC_KEY, filteredSync);

//       console.log("✅ OFFLINE ORDER UPDATED:", offlineOrders[orderIndex]);
//       console.log("📦 TOTAL OFFLINE ORDERS:", offlineOrders.length);
//       console.log("📋 UPDATED SYNC QUEUE:", filteredSync.length);

//       return offlineOrders[orderIndex];
//     } catch (error) {
//       console.error("❌ FAILED TO UPDATE OFFLINE ORDER:", error);
//       throw error;
//     }
//   };

//   // ✅ Handle placing order (ONLINE & OFFLINE) - FIXED orderNo increment + printing
//   const handlePlaceOrder = async () => {
//     if (!paymentMethod) {
//       enqueueSnackbar("Please select payment method!", { variant: "warning" });
//       return;
//     }
//     if (cartData.length === 0) {
//       enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
//       return;
//     }

//     if (customerData.orderType === "Delivery") {
//       if (!customerData.customerPhone || customerData.customerPhone.trim() === "") {
//         enqueueSnackbar("Please enter delivery phone number!", { variant: "warning" });
//         setIsDeliveryModalOpen(true);
//         return;
//       }
//     }

//     setStoredTotal(total);

//     const taxRate = 10;
//     const discountAmount = roundTo3((total * discountPercentage) / 100);
//     const discountedTotal = roundTo3(total - discountAmount);
//     const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
//     const totalWithTax = roundBhd(discountedTotal + calculatedTax);

//     const items = cartData.map((item) => ({
//       orderNo: customerData.orderNo,
//       menuItem: item.dishId || item.id,
//       name: item.name,
//       variationName: item.variationName || null,
//       pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
//       quantity: item.quantity,
//       price: roundTo3(item.price),
//       section: item.section || null,
//       notes: item.notes || "",
//       status: "pending"
//     }));

//     const orderData = {
//       orderNo: customerData.orderNo,
//       orderId: customerData.orderId,
//       customerDetails: {
//         name: customerData.customerName,
//         phone: customerData.customerPhone,
//         guests: customerData.guests,
//         orderType: customerData.orderType,
//       },
//       orderStatus: "In Progress",
//       bills: {
//         total: roundTo3(total),
//         tax: roundTo3(calculatedTax),
//         totalWithTax,
//         discountPercentage: roundTo3(discountPercentage),
//         discountAmount: roundTo3(discountAmount),
//       },
//       items,
//       paymentMethod,
//       comment: orderComment.trim(),
//     };

//     if (customerData.orderType === "Dine-in") {
//       orderData.table = customerData.table.tableId;
//       console.log("table id sent to backend:", customerData.table?.tableId);
//     } else if (customerData.orderType === "Delivery") {
//       orderData.deliveryAddress = customerData.deliveryAddress;
//       orderData.deliveryBoyId = customerData.deliveryBoyId;
//     }

//     try {
//       // ✅ Check if online or offline
//       if (navigator.onLine) {
//         console.log("🌐 ONLINE - Placing order via API...");
//         // ONLINE: Use existing mutation - confirmOrder is called in onSuccess
//         const response = await orderMutation.mutateAsync(orderData);
//       } else {
//         console.log("📴 OFFLINE - Saving order locally...");
//         // OFFLINE: Save to IndexedDB
//         const offlineOrder = await saveOrderOffline(orderData);
        
//         // Create order data for receipt/display
//         const tableDataForReceipt = customerData.table
//           ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//           : null;

//         const orderDataForReceipt = {
//           ...offlineOrder,
//           _id: offlineOrder.orderId,
//           table: tableDataForReceipt,
//         };

//         setPlacedOrderData(orderDataForReceipt);
//         setStoredTotal(total);
        
//         // ✅ FIX: Send to printer immediately in offline mode
//         try {
//           console.log("🖨️ OFFLINE - Sending order to printer...");
//           const printData = {
//             ...orderDataForReceipt,
//             bills: {
//               total: roundTo3(total),
//               tax: calculatedTax,
//               totalWithTax,
//               discountPercentage: roundTo3(discountPercentage),
//               discountAmount: roundTo3(discountAmount),
//             },
//             isReprint: false,
//             deltaItems: items, // All items are new in offline order
//           };
          
//           const printResponse = await sendToPrinters(printData);
//           console.log("✅ OFFLINE - Print sent successfully:", printResponse);
//           enqueueSnackbar("Order saved offline & sent to printer!", { variant: "success" });
//         } catch (printError) {
//           console.error("❌ OFFLINE - Print failed:", printError);
//           enqueueSnackbar("Order saved offline, but printing failed.", { variant: "warning" });
//         }
        
//         dispatch(removeAllItems());
//         setOrderComment("");
        
//         // ✅ CRITICAL: Confirm order in offline mode too to increment counter
//         dispatch(confirmOrder());
        
//         dispatch(setCustomer({
//           ...customerData,
//           comment: "",
//         }));
//       }
//     } catch (error) {
//       console.error("❌ ORDER PLACEMENT ERROR:", error);
//       enqueueSnackbar("Failed to place order!", { variant: "error" });
//     }
//   };

//   // ✅ Handle updating existing order (ONLINE & OFFLINE)
//   const handleUpdateOrder = async () => {
//     if (!customerData.orderId) {
//       enqueueSnackbar("No existing order to update!", { variant: "warning" });
//       return;
//     }

//     const oldItems = customerData.items || [];
//     const mergedItems = [];
//     const currentOrderNo = customerData.orderNo || null;
//     let hasChanges = false;

//     console.log("🧩 Original order items before update:", oldItems);
//     console.log("🛒 Current cart data before update:", cartData);

//     if (oldItems.length === 0 && cartData.length > 0) {
//       console.error("❌ CRITICAL: oldItems is EMPTY but cartData has items!");
//     }

//     cartData.forEach((item) => {
//       const existing = oldItems.find(
//         (old) =>
//           old.menuItem === (item.dishId || item.id) &&
//           (old.variationName?.toLowerCase?.().trim?.() ===
//             item.variationName?.toLowerCase?.().trim?.() ||
//             (!old.variationName && !item.variationName))
//       );

//       if (existing) {
//         if (existing.status === "Ready") {
//           if (item.quantity > existing.quantity) {
//             hasChanges = true;
//             const readyPart = {
//               ...existing,
//               quantity: existing.quantity,
//               status: "Ready"
//             };
//             const newPart = {
//               name: item.name,
//               variationName: item.variationName || null,
//               notes: item.notes || "",
//               price: item.price,
//               section: item.section,
//               menuItem: item.dishId || item.id,
//               orderNo: currentOrderNo,
//               quantity: item.quantity - existing.quantity,
//               status: "pending",
//             };
//             mergedItems.push(readyPart, newPart);
//           } else if (item.quantity < existing.quantity) {
//             hasChanges = true;
//             mergedItems.push({
//               ...existing,
//               quantity: item.quantity,
//               status: "Ready"
//             });
//           } else {
//             mergedItems.push({
//               ...existing,
//               status: "Ready"
//             });
//           }
//         } else {
//           if (item.quantity !== existing.quantity) {
//             hasChanges = true;
//           }
//           mergedItems.push({
//             ...existing,
//             name: item.name,
//             variationName: item.variationName || null,
//             notes: item.notes || "",
//             price: item.price,
//             section: item.section,
//             menuItem: item.dishId || item.id,
//             orderNo: currentOrderNo,
//             quantity: item.quantity,
//             status: existing.status ?? "pending",
//           });
//         }
//       } else {
//         hasChanges = true;
//         mergedItems.push({
//           name: item.name,
//           variationName: item.variationName || null,
//           notes: item.notes || "",
//           price: item.price,
//           section: item.section,
//           menuItem: item.dishId || item.id,
//           orderNo: currentOrderNo,
//           quantity: item.quantity,
//           status: "pending",
//         });
//       }
//     });

//     oldItems.forEach((oldItem) => {
//       const stillExists = cartData.find(
//         (item) =>
//           (item.dishId || item.id) === oldItem.menuItem &&
//           (item.variationName?.toLowerCase?.().trim?.() ===
//             oldItem.variationName?.toLowerCase?.().trim?.() ||
//             (!item.variationName && !oldItem.variationName))
//       );
//       if (!stillExists) {
//         hasChanges = true;
//       }
//     });

//     const taxRate = 10;
//     const discountAmount = roundTo3((total * discountPercentage) / 100);
//     const discountedTotal = roundTo3(total - discountAmount);
//     const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
//     const totalWithTax = roundBhd(discountedTotal + calculatedTax);

//     const updateData = {
//       orderNo: currentOrderNo,
//       customerDetails: {
//         name: customerData.customerName,
//         phone: customerData.customerPhone,
//         guests: customerData.guests,
//         orderType: customerData.orderType,
//       },
//       bills: {
//         total: roundTo3(total),
//         tax: calculatedTax,
//         totalWithTax,
//         discountPercentage: roundTo3(discountPercentage),
//         discountAmount: roundTo3(discountAmount),
//       },
//       items: mergedItems,
//       paymentMethod,
//       comment: orderComment.trim(),
//     };

//     if (hasChanges) {
//       updateData.orderStatus = "In Progress";
//       console.log("⚠️ Order has changes - setting orderStatus to 'In Progress'");
//     }

//     console.log("📦 Final merged items sent to updateOrder:", mergedItems);
//     console.log("🔄 Has changes:", hasChanges);

//     if (customerData.orderType === "Dine-in") {
//       updateData.table = customerData.table.tableId;
//     } else if (customerData.orderType === "Delivery") {
//       updateData.deliveryAddress = customerData.deliveryAddress;
//       updateData.deliveryBoyId = customerData.deliveryBoyId;
//     }

//     try {
//       // ✅ Check if online or offline
//       if (navigator.onLine) {
//         console.log("🌐 ONLINE - Updating order via API...");
//         // ONLINE: Use existing mutation
//         const response = await updateOrderMutation.mutateAsync({
//           orderId: customerData.orderId,
//           updateData,
//         });

//         const updatedOrder = response?.data?.data || response?.data;

//         const tableDataForReceipt = customerData.table
//           ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//           : updatedOrder?.table;

//         const updatedOrderDataForReceipt = {
//           ...(updatedOrder || updateData),
//           table: tableDataForReceipt,
//           _id: customerData.orderId,
//           orderId: customerData.orderId,
//         };

//         setPlacedOrderData(updatedOrderDataForReceipt);
//         setStoredTotal(total);

//         if (updatedOrder && updatedOrder.items) {
//           dispatch(setCustomer({
//             ...customerData,
//             comment: "",
//             items: updatedOrder.items,
//           }));
//         } else {
//           dispatch(setCustomer({
//             ...customerData,
//             items: mergedItems,
//           }));
//         }

//         if (hasChanges) {
//           enqueueSnackbar("Order updated with new items!", { variant: "success" });
//         } else {
//           enqueueSnackbar("Order updated!", { variant: "success" });
//         }
//       } else {
//         console.log("📴 OFFLINE - Updating order locally...");
//         // OFFLINE: Update in IndexedDB
//         const updatedOfflineOrder = await updateOfflineOrder(
//           customerData.orderId,
//           updateData
//         );

//         const tableDataForReceipt = customerData.table
//           ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//           : null;

//         const updatedOrderDataForReceipt = {
//           ...updatedOfflineOrder,
//           table: tableDataForReceipt,
//           _id: customerData.orderId,
//           orderId: customerData.orderId,
//         };

//         setPlacedOrderData(updatedOrderDataForReceipt);
//         setStoredTotal(total);

//         dispatch(removeAllItems());
//         setOrderComment("");
        
//         dispatch(setCustomer({
//           ...customerData,
//           comment: "",
//           items: mergedItems,
//         }));

//         enqueueSnackbar("Order updated offline — will sync when online.", { 
//           variant: "info" 
//         });
//       }
//     } catch (err) {
//       console.error("❌ UPDATE ORDER ERROR:", err);
//       enqueueSnackbar(
//         err?.message || "Failed to update order!",
//         { variant: "error" }
//       );
//     }
//   };

//   // ✅ Handle discount input
//   const handleDiscountChange = (e) => {
//     const value = parseFloat(e.target.value) || 0;
//     if (value >= 0 && value <= 100) setDiscountPercentage(value);
//   };



//   // ✅ FIXED: Handle print button with proper reprint detection
// const handlePrintButton = async () => {
//   if (placedOrderData) {
//     const taxRate = 10;
//     const discountAmount = roundTo3((storedTotal * discountPercentage) / 100);
//     const discountedTotal = roundTo3(storedTotal - discountAmount);
//     const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
//     const totalWithTax = roundBhd(discountedTotal + calculatedTax);

//     const previousItems = customerData.printedItems || [];
//     const currentItems = placedOrderData.items || [];
    
//     // ✅ CRITICAL FIX: Only calculate delta if this is truly a reprint (editing mode)
//     const isActualReprint = isEditing && previousItems.length > 0;
//     const deltaItems = isActualReprint 
//       ? calculateDeltaItems(currentItems, previousItems)
//       : currentItems; // For first print, all items are "new"

//     console.log("🖨️ Print Button Debug:", {
//       isEditing,
//       previousItemsCount: previousItems.length,
//       currentItemsCount: currentItems.length,
//       isActualReprint,
//       deltaItemsCount: deltaItems.length,
//       orderType: customerData.orderType
//     });

//     const updatedOrderInfo = {
//       ...placedOrderData,
//       bills: {
//         ...placedOrderData.bills,
//         total: storedTotal,
//         tax: calculatedTax,
//         totalWithTax,
//         discountPercentage,
//         discountAmount,
//       },
//       // ✅ FIX: Only set isReprint if we're in editing mode AND have previous items
//       isReprint: isActualReprint,
//       deltaItems: deltaItems,
//     };

//     setOrderInfo(updatedOrderInfo);
//     setShowInvoice(true);

//     try {
//       const res = await sendToPrinters(updatedOrderInfo);
//       console.log("✅ Print sent:", res);
//       enqueueSnackbar("Receipt sent to printers!", { variant: "success" });

//       // ✅ Only update printedItems after successful print
//       dispatch(setCustomer({
//         ...customerData,
//         printedItems: currentItems
//       }));
//     } catch (error) {
//       console.error("Print Error:", error);
//       enqueueSnackbar("Failed to send to printer bridge!", {
//         variant: "error",
//       });
//     }
//   } else {
//     enqueueSnackbar("Please place or update an order first!", {
//       variant: "warning",
//     });
//   }
// };

import React, { useState, useEffect } from "react";
import { sendToPrinters } from "../../https/printBridge";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slice/cartSlice";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrder, updateOrder, updateTable } from "../../https";
import { removeAllItems } from "../../redux/slice/cartSlice";
import { removeCustomer, confirmOrder, setCustomer } from "../../redux/slice/customerSlice";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import { roundBhd } from "../../utils";
import Invoice from "../invoice/Invoice";
import DeliveryModal from "../shared/DeliveryModal";
import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// ✅ Import offline store utilities
import { save, load } from "../../utils/offlineStore";

// ✅ Offline storage keys
const OFFLINE_ORDERS_KEY = "offline:orders";
const OFFLINE_PENDING_SYNC_KEY = "offline:pendingSync";

// ✅ Calculate delta items helper
const calculateDeltaItems = (currentItems, previousItems) => {
  const deltaItems = [];
  
  currentItems.forEach((currentItem) => {
    const previousItem = previousItems.find(
      (prev) =>
        prev.menuItem === (currentItem.menuItem || currentItem.dishId || currentItem.id) &&
        (prev.variationName?.toLowerCase?.().trim?.() ===
          currentItem.variationName?.toLowerCase?.().trim?.() ||
          (!prev.variationName && !currentItem.variationName))
    );

    if (!previousItem) {
      deltaItems.push({
        ...currentItem,
        quantity: currentItem.quantity,
        isNew: true
      });
    } else if (currentItem.quantity > previousItem.quantity) {
      const additionalQuantity = currentItem.quantity - previousItem.quantity;
      deltaItems.push({
        ...currentItem,
        quantity: additionalQuantity,
        isNew: false,
        previousQuantity: previousItem.quantity
      });
    }
  });

  console.log("📊 Delta Calculation:", {
    previous: previousItems.length,
    current: currentItems.length,
    delta: deltaItems.length,
    deltaItems
  });

  return deltaItems;
};

const BillInfo = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isEditing = useSelector((state) => state.editOrder.isEditing);
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);

  const [paymentMethod, setPaymentMethod] = useState(
    customerData.paymentMethod || "Cash"
  );
  const [tax, setTax] = useState(0);
  const [totalPriceWithTax, setTotalPriceWithTax] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [placedOrderData, setPlacedOrderData] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [storedTotal, setStoredTotal] = useState(0);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [orderComment, setOrderComment] = useState(customerData.comment || "");

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setOrderComment(value);
    
    dispatch(setCustomer({
      ...customerData,
      comment: value,
    }));
  };

  const roundTo3 = (num) => {
    const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
    return Math.round(n * 1000) / 1000;
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethod(method));
  };

  // ✅ TAX INCLUSIVE CALCULATION - Reverse calculation to extract tax
  useEffect(() => {
    // Prices are already tax-inclusive (increased by 100 fils per dish)
    // We need to reverse-calculate to show the breakdown
    // Formula: If total is 10.000 BHD (inclusive), then:
    // Base price = 10.000 / 1.10 = 9.091 BHD
    // Tax = 10.000 - 9.091 = 0.909 BHD
    
    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const totalAfterDiscount = roundTo3(total - discountAmount);
    
    // Reverse calculate: extract tax from inclusive price
    const basePrice = roundTo3(totalAfterDiscount / 1.10); // Divide by 1.10 to get base
    const calculatedTax = roundTo3(totalAfterDiscount - basePrice); // Tax is the difference
    
    setTax(calculatedTax);
    setTotalPriceWithTax(roundBhd(totalAfterDiscount)); // This is already tax-inclusive
  }, [total, paymentMethod, discountPercentage]);

  // ✅ Mutation for adding new order
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: async (resData) => {
      console.log("✅ ONLINE ORDER PLACED - Server Response:", resData.data);
      dispatch(removeAllItems());
      setOrderComment("");
      const { data } = resData.data;

      const tableDataForReceipt = customerData.table
        ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
        : data.table;

      const orderDataForReceipt = {
        ...data,
        table: tableDataForReceipt,
      };

      setPlacedOrderData(orderDataForReceipt);
      console.log("Placed Order Data:", orderDataForReceipt);

      const tableData = {
        tableId: data.table,
        status: "Booked",
        orderId: data._id,
      };

      setTimeout(() => tableUpdateMutation.mutate(tableData), 1500);

      await queryClient.invalidateQueries(["orders"]);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      dispatch(setCustomer({
        ...customerData,
        comment: "",
      }));
      
      // ✅ CRITICAL: Confirm order AFTER successful placement to increment counter
      dispatch(confirmOrder());
    },
    onError: (error) => {
      console.error("❌ ONLINE ORDER PLACEMENT FAILED:", error);
      enqueueSnackbar("Failed to place order!", { variant: "error" });
    },
  });

  // ✅ Mutation for table update
  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: async () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());

      await queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Table Update Error:", error);
    },
  });

  // ✅ Mutation for order update
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
    onSuccess: async (resData, variables) => {
      console.log("✅ ONLINE ORDER UPDATED - Server Response:", resData.data);
      dispatch(removeAllItems());
      setOrderComment("");

      const serverData = resData?.data?.data || {};

      const tableDataForReceipt = customerData.table
        ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
        : serverData.table;

      let updatedOrderDataForReceipt = {
        ...serverData,
        table: tableDataForReceipt,
      };

      if (!resData?.data?.data) {
        updatedOrderDataForReceipt = {
          ...placedOrderData,
          ...variables.updateData,
          table: tableDataForReceipt,
        };
      }

      setPlacedOrderData(updatedOrderDataForReceipt);

      try {
        await queryClient.invalidateQueries(["orders"]);
        await queryClient.refetchQueries(["orders"], { active: true });

        if (variables.orderId) {
          await queryClient.invalidateQueries(["order", variables.orderId]);
        }

        console.log("✅ Cache invalidated and refetched after order update");
      } catch (cacheError) {
        console.error("Cache invalidation error:", cacheError);
      }

      enqueueSnackbar("Order updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      console.error("❌ ONLINE ORDER UPDATE FAILED:", error);
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to update order.",
        { variant: "error" }
      );
    },
  });

  // ✅ Handle Delivery Order with Customer Info
  const handleDeliveryOrder = async (deliveryData) => {
    try {
      dispatch(
        setCustomer({
          name: deliveryData.name,
          phone: deliveryData.phone,
          guests: 0,
          orderType: "Delivery",
        })
      );

      const deliveryInfo = {
        address: deliveryData.address,
        deliveryBoyId: deliveryData.deliveryBoy,
        phone: deliveryData.phone,
        name: deliveryData.name
      };

      dispatch(setDeliveryInfo(deliveryInfo));
      setIsDeliveryModalOpen(false);

      setTimeout(() => {
        handlePlaceOrder();
      }, 100);
    } catch (error) {
      console.error("Delivery Order Error:", error);
      enqueueSnackbar("Failed to create delivery order!", { variant: "error" });
    }
  };

  // ✅ NEW: Save order offline to IndexedDB
  const saveOrderOffline = async (orderData) => {
    try {
      console.log("💾 SAVING ORDER OFFLINE...", orderData);
      
      const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
      
      // Mark order as offline with proper structure
      const offlineOrder = {
        ...orderData,
        isOffline: true,
        createdAt: new Date().toISOString(),
        syncStatus: "pending"
      };

      offlineOrders.push(offlineOrder);
      await save(OFFLINE_ORDERS_KEY, offlineOrders);

      // ✅ Save to pending sync queue separately
      const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
      pendingSync.push({
        type: "addOrder",
        orderId: offlineOrder.orderId,
        data: offlineOrder,
        timestamp: Date.now()
      });
      await save(OFFLINE_PENDING_SYNC_KEY, pendingSync);

      console.log("✅ ORDER SAVED OFFLINE:", offlineOrder);
      console.log("📦 TOTAL OFFLINE ORDERS:", offlineOrders.length);
      console.log("📋 PENDING SYNC QUEUE:", pendingSync.length);
      
      return offlineOrder;
    } catch (error) {
      console.error("❌ FAILED TO SAVE ORDER OFFLINE:", error);
      throw error;
    }
  };

  // ✅ NEW: Update existing offline order in IndexedDB (FIXED)
  const updateOfflineOrder = async (orderId, updateData) => {
    try {
      console.log("🔄 UPDATING OFFLINE ORDER...", { orderId, updateData });
      
      const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
      console.log("📦 Current offline orders before update:", offlineOrders);
      
      const orderIndex = offlineOrders.findIndex(
        (order) => order.orderId === orderId
      );

      if (orderIndex === -1) {
        console.error("❌ OFFLINE ORDER NOT FOUND:", orderId);
        throw new Error("Offline order not found");
      }

      console.log("🎯 FOUND ORDER AT INDEX:", orderIndex);
      console.log("📄 OLD ORDER DATA:", offlineOrders[orderIndex]);

      // ✅ Properly merge the order data
      offlineOrders[orderIndex] = {
        ...offlineOrders[orderIndex],
        ...updateData,
        orderId: orderId, // Keep original orderId
        isOffline: true, // Maintain offline flag
        updatedAt: new Date().toISOString(),
        syncStatus: "pending"
      };

      await save(OFFLINE_ORDERS_KEY, offlineOrders);

      // ✅ Update pending sync queue - replace old entry with updated one
      const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
      
      // Remove old entry for this orderId
      const filteredSync = pendingSync.filter(item => item.orderId !== orderId);
      
      // Add updated entry
      filteredSync.push({
        type: "addOrder", // Use addOrder since we're syncing the complete order
        orderId: orderId,
        data: offlineOrders[orderIndex],
        timestamp: Date.now()
      });
      
      await save(OFFLINE_PENDING_SYNC_KEY, filteredSync);

      console.log("✅ OFFLINE ORDER UPDATED:", offlineOrders[orderIndex]);
      console.log("📦 TOTAL OFFLINE ORDERS:", offlineOrders.length);
      console.log("📋 UPDATED SYNC QUEUE:", filteredSync.length);

      return offlineOrders[orderIndex];
    } catch (error) {
      console.error("❌ FAILED TO UPDATE OFFLINE ORDER:", error);
      throw error;
    }
  };

  // ✅ Handle placing order (ONLINE & OFFLINE) - TAX INCLUSIVE
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select payment method!", { variant: "warning" });
      return;
    }
    if (cartData.length === 0) {
      enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
      return;
    }

    if (customerData.orderType === "Delivery") {
      if (!customerData.customerPhone || customerData.customerPhone.trim() === "") {
        enqueueSnackbar("Please enter delivery phone number!", { variant: "warning" });
        setIsDeliveryModalOpen(true);
        return;
      }
    }

    setStoredTotal(total);

    // ✅ TAX INCLUSIVE CALCULATION
    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const totalWithTax = roundTo3(total - discountAmount); // Already includes tax
    const basePrice = roundTo3(totalWithTax / 1.10); // Extract base price
    const calculatedTax = roundTo3(totalWithTax - basePrice); // Tax is difference

    const items = cartData.map((item) => ({
      orderNo: customerData.orderNo,
      menuItem: item.dishId || item.id,
      name: item.name,
      variationName: item.variationName || null,
      pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
      quantity: item.quantity,
      price: roundTo3(item.price),
      section: item.section || null,
      notes: item.notes || "",
      status: "pending"
    }));

    const orderData = {
      orderNo: customerData.orderNo,
      orderId: customerData.orderId,
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
        orderType: customerData.orderType,
      },
      orderStatus: "In Progress",
      bills: {
        total: roundTo3(basePrice), // Base price (without tax)
        tax: roundTo3(calculatedTax), // Extracted tax
        totalWithTax: roundBhd(totalWithTax), // Total inclusive
        discountPercentage: roundTo3(discountPercentage),
        discountAmount: roundTo3(discountAmount),
      },
      items,
      paymentMethod,
      comment: orderComment.trim(),
    };

    if (customerData.orderType === "Dine-in") {
      orderData.table = customerData.table.tableId;
      console.log("table id sent to backend:", customerData.table?.tableId);
    } else if (customerData.orderType === "Delivery") {
      orderData.deliveryAddress = customerData.deliveryAddress;
      orderData.deliveryBoyId = customerData.deliveryBoyId;
    }

    try {
      // ✅ Check if online or offline
      if (navigator.onLine) {
        console.log("🌐 ONLINE - Placing order via API...");
        // ONLINE: Use existing mutation - confirmOrder is called in onSuccess
        const response = await orderMutation.mutateAsync(orderData);
      } else {
        console.log("📴 OFFLINE - Saving order locally...");
        // OFFLINE: Save to IndexedDB
        const offlineOrder = await saveOrderOffline(orderData);
        
        // Create order data for receipt/display
        const tableDataForReceipt = customerData.table
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : null;

        const orderDataForReceipt = {
          ...offlineOrder,
          _id: offlineOrder.orderId,
          table: tableDataForReceipt,
        };

        setPlacedOrderData(orderDataForReceipt);
        setStoredTotal(total);
        
        // ✅ FIX: Send to printer immediately in offline mode
        try {
          console.log("🖨️ OFFLINE - Sending order to printer...");
          const printData = {
            ...orderDataForReceipt,
            bills: {
              total: roundTo3(basePrice),
              tax: calculatedTax,
              totalWithTax: roundBhd(totalWithTax),
              discountPercentage: roundTo3(discountPercentage),
              discountAmount: roundTo3(discountAmount),
            },
            isReprint: false,
            deltaItems: items, // All items are new in offline order
          };
          
          const printResponse = await sendToPrinters(printData);
          console.log("✅ OFFLINE - Print sent successfully:", printResponse);
          enqueueSnackbar("Order saved offline & sent to printer!", { variant: "success" });
        } catch (printError) {
          console.error("❌ OFFLINE - Print failed:", printError);
          enqueueSnackbar("Order saved offline, but printing failed.", { variant: "warning" });
        }
        
        dispatch(removeAllItems());
        setOrderComment("");
        
        // ✅ CRITICAL: Confirm order in offline mode too to increment counter
        dispatch(confirmOrder());
        
        dispatch(setCustomer({
          ...customerData,
          comment: "",
        }));
      }
    } catch (error) {
      console.error("❌ ORDER PLACEMENT ERROR:", error);
      enqueueSnackbar("Failed to place order!", { variant: "error" });
    }
  };

  // ✅ Handle updating existing order (ONLINE & OFFLINE) - TAX INCLUSIVE
  const handleUpdateOrder = async () => {
    if (!customerData.orderId) {
      enqueueSnackbar("No existing order to update!", { variant: "warning" });
      return;
    }

    const oldItems = customerData.items || [];
    const mergedItems = [];
    const currentOrderNo = customerData.orderNo || null;
    let hasChanges = false;

    console.log("🧩 Original order items before update:", oldItems);
    console.log("🛒 Current cart data before update:", cartData);

    if (oldItems.length === 0 && cartData.length > 0) {
      console.error("❌ CRITICAL: oldItems is EMPTY but cartData has items!");
    }

    cartData.forEach((item) => {
      const existing = oldItems.find(
        (old) =>
          old.menuItem === (item.dishId || item.id) &&
          (old.variationName?.toLowerCase?.().trim?.() ===
            item.variationName?.toLowerCase?.().trim?.() ||
            (!old.variationName && !item.variationName))
      );

      if (existing) {
        if (existing.status === "Ready") {
          if (item.quantity > existing.quantity) {
            hasChanges = true;
            const readyPart = {
              ...existing,
              quantity: existing.quantity,
              status: "Ready"
            };
            const newPart = {
              name: item.name,
              variationName: item.variationName || null,
              notes: item.notes || "",
              price: item.price,
              section: item.section,
              menuItem: item.dishId || item.id,
              orderNo: currentOrderNo,
              quantity: item.quantity - existing.quantity,
              status: "pending",
            };
            mergedItems.push(readyPart, newPart);
          } else if (item.quantity < existing.quantity) {
            hasChanges = true;
            mergedItems.push({
              ...existing,
              quantity: item.quantity,
              status: "Ready"
            });
          } else {
            mergedItems.push({
              ...existing,
              status: "Ready"
            });
          }
        } else {
          if (item.quantity !== existing.quantity) {
            hasChanges = true;
          }
          mergedItems.push({
            ...existing,
            name: item.name,
            variationName: item.variationName || null,
            notes: item.notes || "",
            price: item.price,
            section: item.section,
            menuItem: item.dishId || item.id,
            orderNo: currentOrderNo,
            quantity: item.quantity,
            status: existing.status ?? "pending",
          });
        }
      } else {
        hasChanges = true;
        mergedItems.push({
          name: item.name,
          variationName: item.variationName || null,
          notes: item.notes || "",
          price: item.price,
          section: item.section,
          menuItem: item.dishId || item.id,
          orderNo: currentOrderNo,
          quantity: item.quantity,
          status: "pending",
        });
      }
    });

    oldItems.forEach((oldItem) => {
      const stillExists = cartData.find(
        (item) =>
          (item.dishId || item.id) === oldItem.menuItem &&
          (item.variationName?.toLowerCase?.().trim?.() ===
            oldItem.variationName?.toLowerCase?.().trim?.() ||
            (!item.variationName && !oldItem.variationName))
      );
      if (!stillExists) {
        hasChanges = true;
      }
    });

    // ✅ TAX INCLUSIVE CALCULATION
    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const totalWithTax = roundTo3(total - discountAmount);
    const basePrice = roundTo3(totalWithTax / 1.10);
    const calculatedTax = roundTo3(totalWithTax - basePrice);

    const updateData = {
      orderNo: currentOrderNo,
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
        orderType: customerData.orderType,
      },
      bills: {
        total: roundTo3(basePrice),
        tax: calculatedTax,
        totalWithTax: roundBhd(totalWithTax),
        discountPercentage: roundTo3(discountPercentage),
        discountAmount: roundTo3(discountAmount),
      },
      items: mergedItems,
      paymentMethod,
      comment: orderComment.trim(),
    };

    if (hasChanges) {
      updateData.orderStatus = "In Progress";
      console.log("⚠️ Order has changes - setting orderStatus to 'In Progress'");
    }

    console.log("📦 Final merged items sent to updateOrder:", mergedItems);
    console.log("🔄 Has changes:", hasChanges);

    if (customerData.orderType === "Dine-in") {
      updateData.table = customerData.table.tableId;
    } else if (customerData.orderType === "Delivery") {
      updateData.deliveryAddress = customerData.deliveryAddress;
      updateData.deliveryBoyId = customerData.deliveryBoyId;
    }

    try {
      // ✅ Check if online or offline
      if (navigator.onLine) {
        console.log("🌐 ONLINE - Updating order via API...");
        // ONLINE: Use existing mutation
        const response = await updateOrderMutation.mutateAsync({
          orderId: customerData.orderId,
          updateData,
        });

        const updatedOrder = response?.data?.data || response?.data;

        const tableDataForReceipt = customerData.table
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : updatedOrder?.table;

        const updatedOrderDataForReceipt = {
          ...(updatedOrder || updateData),
          table: tableDataForReceipt,
          _id: customerData.orderId,
          orderId: customerData.orderId,
        };

        setPlacedOrderData(updatedOrderDataForReceipt);
        setStoredTotal(total);

        if (updatedOrder && updatedOrder.items) {
          dispatch(setCustomer({
            ...customerData,
            comment: "",
            items: updatedOrder.items,
          }));
        } else {
          dispatch(setCustomer({
            ...customerData,
            items: mergedItems,
          }));
        }

        if (hasChanges) {
          enqueueSnackbar("Order updated with new items!", { variant: "success" });
        } else {
          enqueueSnackbar("Order updated!", { variant: "success" });
        }
      } else {
        console.log("📴 OFFLINE - Updating order locally...");
        // OFFLINE: Update in IndexedDB
        const updatedOfflineOrder = await updateOfflineOrder(
          customerData.orderId,
          updateData
        );

        const tableDataForReceipt = customerData.table
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : null;

        const updatedOrderDataForReceipt = {
          ...updatedOfflineOrder,
          table: tableDataForReceipt,
          _id: customerData.orderId,
          orderId: customerData.orderId,
        };

        setPlacedOrderData(updatedOrderDataForReceipt);
        setStoredTotal(total);

        dispatch(removeAllItems());
        setOrderComment("");
        
        dispatch(setCustomer({
          ...customerData,
          comment: "",
          items: mergedItems,
        }));

        enqueueSnackbar("Order updated offline — will sync when online.", { 
          variant: "info" 
        });
      }
    } catch (err) {
      console.error("❌ UPDATE ORDER ERROR:", err);
      enqueueSnackbar(
        err?.message || "Failed to update order!",
        { variant: "error" }
      );
    }
  };

  // ✅ Handle discount input
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) setDiscountPercentage(value);
  };

  // ✅ Handle print button with proper reprint detection - TAX INCLUSIVE
  const handlePrintButton = async () => {
    if (placedOrderData) {
      // ✅ TAX INCLUSIVE CALCULATION
      const discountAmount = roundTo3((storedTotal * discountPercentage) / 100);
      const totalWithTax = roundTo3(storedTotal - discountAmount);
      const basePrice = roundTo3(totalWithTax / 1.10);
      const calculatedTax = roundTo3(totalWithTax - basePrice);

      const previousItems = customerData.printedItems || [];
      const currentItems = placedOrderData.items || [];
      
      // ✅ CRITICAL FIX: Only calculate delta if this is truly a reprint (editing mode)
      const isActualReprint = isEditing && previousItems.length > 0;
      const deltaItems = isActualReprint 
        ? calculateDeltaItems(currentItems, previousItems)
        : currentItems; // For first print, all items are "new"

      console.log("🖨️ Print Button Debug:", {
        isEditing,
        previousItemsCount: previousItems.length,
        currentItemsCount: currentItems.length,
        isActualReprint,
        deltaItemsCount: deltaItems.length,
        orderType: customerData.orderType
      });

      const updatedOrderInfo = {
        ...placedOrderData,
        bills: {
          ...placedOrderData.bills,
          total: basePrice,
          tax: calculatedTax,
          totalWithTax: roundBhd(totalWithTax),
          discountPercentage,
          discountAmount,
        },
        // ✅ FIX: Only set isReprint if we're in editing mode AND have previous items
        isReprint: isActualReprint,
        deltaItems: deltaItems,
      };

      setOrderInfo(updatedOrderInfo);
      setShowInvoice(true);

      try {
        const res = await sendToPrinters(updatedOrderInfo);
        console.log("✅ Print sent:", res);
        enqueueSnackbar("Receipt sent to printers!", { variant: "success" });

        // ✅ Only update printedItems after successful print
        dispatch(setCustomer({
          ...customerData,
          printedItems: currentItems
        }));
      } catch (error) {
        console.error("Print Error:", error);
        enqueueSnackbar("Failed to send to printer bridge!", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please place or update an order first!", {
        variant: "warning",
      });
    }
  };

 



  return (
    <div className="space-y-2 lg:space-y-2 xl:space-y-2.5 ">
      {/* Items Total */}
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
          Items({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
          BHD {total.toFixed(3)}
        </h1>
      </div>

      {/* Tax */}
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
          Tax({paymentMethod === "Cash" ? "10%" : "10%"})
        </p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
          BHD {tax.toFixed(3)}
        </h1>
      </div>

      {/* Discount */}
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
          Discount
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={discountPercentage > 0 ? discountPercentage : ""}
            onChange={handleDiscountChange}
            placeholder="0"
            className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 lg:py-0.5 xl:py-1 w-16 lg:w-14 xl:w-16 2xl:w-20 text-center focus:border-[#f6b100] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Total With Tax */}
      <div className="flex items-center justify-between pb-2.5 lg:pb-2 xl:pb-2.5 border-b border-[#2a2a2a]">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
          Total With Tax
        </p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
          BHD {totalPriceWithTax.toFixed(3)}
        </h1>
      </div>
      {/* Order Comment/Notes */}
      <div className="flex  gap-1 pt-1">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
          Order Notes (Optional)
        </p>
        <textarea
          value={orderComment}
          onChange={(e) => setOrderComment(e.target.value)}
          placeholder="Add special instructions or notes..."
          rows={3}
          className="text-[#f5f5f5] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm bg-[#1f1f1f] border border-[#555] rounded-lg px-3 py-2 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 w-full h-10 resize-none focus:border-[#f6b100] focus:outline-none transition-colors"
        />
      </div>

      {/* Payment Method Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 w-full pt-2.5 lg:pt-2 xl:pt-2.5">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Cash" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
            }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Online" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
            }`}
        >
          Online
        </button>
        <button
          onClick={() => setPaymentMethod("Benefit")}
          className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Benefit" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
            }`}
        >
          Benefit
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 pt-2.5 lg:pt-2 xl:pt-2.5 pb-4">
        <button
          onClick={handlePrintButton}
          className="bg-[#025cca] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#0147a3] transition-colors"
        >
          Print Receipt
        </button>

        <button
          onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
          disabled={cartData.length === 0}
          className="bg-[#f6b100] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e5a200] transition-colors"
        >
          {isEditing ? "Update Order" : "Place Order"}
        </button>
      </div>

      {/* Delivery Button - Conditional */}
      {customerData.orderType === "Delivery" && (
        <div className="pt-2.5 lg:pt-2 xl:pt-2.5 pb-12">
          <button
            onClick={() => setIsDeliveryModalOpen(true)}
            className="bg-[#ff6b35] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#ff5520] transition-colors flex items-center justify-center gap-2"
          >
            <span>📍</span> Enter Delivery Details
          </button>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      {/* Delivery Modal */}
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onCreateDelivery={handleDeliveryOrder}
        existingData={customerData}
      />
    </div>
  );
};

export default BillInfo;
