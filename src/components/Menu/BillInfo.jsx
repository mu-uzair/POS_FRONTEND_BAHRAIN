// // BillInfo.jsx - UPDATED imports and logic (everything before return)

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

// // ✅ Import unified offline system
// import { useOfflineMode } from "../../constants/OfflineModeContext";
// import { useCreateOrder } from "../../hooks/useCreateOrder";
// import { useUpdateOrderStatus } from "../../hooks/useUpdateOrder";
// import {
//   isTrulyOfflineOrder,
//   addToPendingSync,
//   updateOrdersCache,
//   updateOrderStatusInCache,
//   updateOrderInCache,
//   STORAGE_KEYS,
//   load,
//   save
// } from "../../utils/offlineStore";

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

//   // ✅ Get offline mode from context
//   const { isOfflineMode } = useOfflineMode();

//   // ✅ Use unified order creation hook
//   const { createOrder, isCreating } = useCreateOrder();

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

//   // const handleCommentChange = (e) => {
//   //   const value = e.target.value;
//   //   setOrderComment(value);

//   //   dispatch(setCustomer({
//   //     ...customerData,
//   //     comment: value,
//   //   }));
//   // };

//     // ✅ FIXED: Don't dispatch on every comment change
//   const handleCommentChange = (e) => {
//     const value = e.target.value;
//     setOrderComment(value);
    
//     // ✅ Don't dispatch immediately - just update local state
//     // The comment will be included when placing/updating the order
//   };

//   const roundTo3 = (num) => {
//     const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
//     return Math.round(n * 1000) / 1000;
//   };

//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//   };

//   // ✅ TAX INCLUSIVE CALCULATION
//   useEffect(() => {
//     const discountAmount = roundTo3((total * discountPercentage) / 100);
//     const totalAfterDiscount = roundTo3(total - discountAmount);
//     const basePrice = roundTo3(totalAfterDiscount / 1.10);
//     const calculatedTax = roundTo3(totalAfterDiscount - basePrice);

//     setTax(calculatedTax);
//     setTotalPriceWithTax(roundBhd(totalAfterDiscount));
//   }, [total, paymentMethod, discountPercentage]);

//   // ✅ Mutation for adding new order (ONLINE ONLY)
//   const orderMutation = useMutation({
//     mutationFn: (reqData) => addOrder(reqData),
//     onSuccess: async (resData) => {
//       console.log("✅ ONLINE ORDER PLACED:", resData.data);
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

//   // ✅ Mutation for order update (ONLINE ONLY)
//   const updateOrderMutation = useMutation({
//     mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
//     onSuccess: async (resData, variables) => {
//       console.log("✅ ONLINE ORDER UPDATED:", resData.data);
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

//         console.log("✅ Cache invalidated after order update");
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
//   // const handleDeliveryOrder = async (deliveryData) => {
//   //   try {
//   //     dispatch(
//   //       setCustomer({
//   //         name: deliveryData.name,
//   //         phone: deliveryData.phone,
//   //         guests: 0,
//   //         orderType: "Delivery",
//   //       })
//   //     );

//   //     const deliveryInfo = {
//   //       address: deliveryData.address,
//   //       deliveryBoyId: deliveryData.deliveryBoy,
//   //       phone: deliveryData.phone,
//   //       name: deliveryData.name
//   //     };

//   //     dispatch(setDeliveryInfo(deliveryInfo));
//   //     setIsDeliveryModalOpen(false);

//   //     setTimeout(() => {
//   //       handlePlaceOrder();
//   //     }, 100);
//   //   } catch (error) {
//   //     console.error("Delivery Order Error:", error);
//   //     enqueueSnackbar("Failed to create delivery order!", { variant: "error" });
//   //   }
//   // };


//   const handleDeliveryOrder = async (deliveryData) => {
//     try {
//       const updatedCustomerData = {
//         ...customerData,
//         customerName: deliveryData.name,
//         customerPhone: deliveryData.phone,
//         guests: 0,
//         orderType: "Delivery",
//         deliveryAddress: deliveryData.address,
//         deliveryBoyId: deliveryData.deliveryBoy,
//       };

//       dispatch(setCustomer(updatedCustomerData));
//       setIsDeliveryModalOpen(false);

//       // ✅ Only auto-submit if cart has items
//       if (cartData.length > 0) {
//         setTimeout(() => {
//           handlePlaceOrder();
//         }, 200);
//       } else {
//         enqueueSnackbar("Delivery details saved! Add items to place order.", {
//           variant: "success"
//         });
//       }
//     } catch (error) {
//       console.error("Delivery Order Error:", error);
//       enqueueSnackbar("Failed to save delivery details!", { variant: "error" });
//     }
//   };

//   // ✅ UNIFIED: Handle placing order (works both online and offline)
//   // const handlePlaceOrder = async () => {
//   //   if (!paymentMethod) {
//   //     enqueueSnackbar("Please select payment method!", { variant: "warning" });
//   //     return;
//   //   }
//   //   if (cartData.length === 0) {
//   //     enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
//   //     return;
//   //   }

//   //   if (customerData.orderType === "Delivery") {
//   //     if (!customerData.customerPhone || customerData.customerPhone.trim() === "") {
//   //       enqueueSnackbar("Please enter delivery phone number!", { variant: "warning" });
//   //       setIsDeliveryModalOpen(true);
//   //       return;
//   //     }
//   //   }

//   //   setStoredTotal(total);

//   //   // ✅ TAX INCLUSIVE CALCULATION
//   //   const discountAmount = roundTo3((total * discountPercentage) / 100);
//   //   const totalWithTax = roundTo3(total - discountAmount);
//   //   const basePrice = roundTo3(totalWithTax / 1.10);
//   //   const calculatedTax = roundTo3(totalWithTax - basePrice);

//   //   const items = cartData.map((item) => ({
//   //     orderNo: customerData.orderNo,
//   //     menuItem: item.dishId || item.id,
//   //     name: item.name,
//   //     variationName: item.variationName || null,
//   //     pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
//   //     quantity: item.quantity,
//   //     price: roundTo3(item.price),
//   //     section: item.section || null,
//   //     notes: item.notes || "",
//   //     status: "pending"
//   //   }));

//   //   const orderData = {
//   //     orderNo: customerData.orderNo,
//   //     orderId: customerData.orderId,
//   //     customerDetails: {
//   //       name: customerData.customerName,
//   //       phone: customerData.customerPhone,
//   //       guests: customerData.guests,
//   //       orderType: customerData.orderType,
//   //     },
//   //     orderStatus: "In Progress",
//   //     bills: {
//   //       total: roundTo3(basePrice),
//   //       tax: roundTo3(calculatedTax),
//   //       totalWithTax: roundBhd(totalWithTax),
//   //       discountPercentage: roundTo3(discountPercentage),
//   //       discountAmount: roundTo3(discountAmount),
//   //     },
//   //     items,
//   //     paymentMethod,
//   //     comment: orderComment.trim(),
//   //   };
//   //   console.log("Order data to be sent:", orderData);

//   //   if (customerData.orderType === "Dine-in") {
//   //     orderData.table = customerData.table.tableId;
//   //   } else if (customerData.orderType === "Delivery") {
//   //     orderData.deliveryAddress = customerData.deliveryAddress;
//   //     orderData.deliveryBoyId = customerData.deliveryBoyId;
//   //   }



//   //   try {
//   //     // ✅ Use unified order creation hook
//   //     const result = await createOrder(orderData);

//   //     if (result.success) {
//   //       const tableDataForReceipt = customerData.table
//   //         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//   //         : null;

//   //       const orderDataForReceipt = {
//   //         ...result.data,
//   //         _id: result.data._id || result.data.orderId,
//   //         table: tableDataForReceipt,
//   //       };

//   //       setPlacedOrderData(orderDataForReceipt);
//   //       setStoredTotal(total);

//   //       // ✅ Mark table as booked for Dine-in orders (ONLINE mode only)
//   //       if (customerData.orderType === "Dine-in" && customerData.table?.tableId && !result.isOffline) {
//   //         try {
//   //           const tableData = {
//   //             tableId: customerData.table.tableId,
//   //             status: "Booked",
//   //             orderId: result.data._id || result.data.orderId,
//   //           };

//   //           // Use mutation to update table
//   //           await tableUpdateMutation.mutateAsync(tableData);
//   //           console.log("✅ Table marked as booked:", customerData.table.tableNo);
//   //         } catch (tableError) {
//   //           console.error("❌ Failed to mark table as booked:", tableError);
//   //           enqueueSnackbar("Order placed but table status not updated", { variant: "warning" });
//   //         }
//   //       }

//   //       // // Send to printer (works offline too)
//   //       // if (result.isOffline) {
//   //       //   try {
//   //       //     const printData = {
//   //       //       ...orderDataForReceipt,
//   //       //       isReprint: false,
//   //       //       deltaItems: items,
//   //       //     };
//   //       //     await sendToPrinters(printData);
//   //       //   } catch (printError) {
//   //       //     console.error("Printer error:", printError);
//   //       //   }
//   //       // }

//   //       dispatch(removeAllItems());
//   //       setOrderComment("");
//   //       dispatch(confirmOrder());
//   //       dispatch(setCustomer({
//   //         ...customerData,
//   //         comment: "",
//   //       }));

//   //       // ✅ Only remove customer data after table is updated
//   //       if (customerData.orderType === "Dine-in" && !result.isOffline) {
//   //         dispatch(removeCustomer());
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error("❌ ORDER PLACEMENT ERROR:", error);
//   //     enqueueSnackbar("Failed to place order!", { variant: "error" });
//   //   }
//   // };

//   // testing for price mismatch

//   const handlePlaceOrder = async () => {
//   if (!paymentMethod) {
//     enqueueSnackbar("Please select payment method!", { variant: "warning" });
//     return;
//   }
//   if (cartData.length === 0) {
//     enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
//     return;
//   }
//   if (customerData.orderType === "Delivery") {
//     if (!customerData.customerPhone || customerData.customerPhone.trim() === "") {
//       enqueueSnackbar("Please enter delivery phone number!", { variant: "warning" });
//       setIsDeliveryModalOpen(true);
//       return;
//     }
//   }

//   // ✅ FIX: Snapshot total NOW before any dispatches clear the cart
//   const capturedTotal = total;
//   setStoredTotal(capturedTotal);

//   // ✅ Use capturedTotal everywhere in this function (not `total`)
//   const discountAmount = roundTo3((capturedTotal * discountPercentage) / 100);
//   const totalWithTax = roundTo3(capturedTotal - discountAmount);
//   const basePrice = roundTo3(totalWithTax / 1.10);
//   const calculatedTax = roundTo3(totalWithTax - basePrice);

//   const items = cartData.map((item) => ({
//     orderNo: customerData.orderNo,
//     menuItem: item.menuItem || item.dishId || item._id,
//     name: item.name || item.dishName,
//     variationName: item.variationName || null,
//     pricePerQuantity: roundTo3(item.pricePerQuantity),           // ✅ unit price
//     quantity: item.quantity,
//     price: roundTo3(item.pricePerQuantity * item.quantity),      // ✅ recomputed, never trust item.price
//     section: item.section || null,
//     notes: item.notes || "",
//     status: "pending"
//   }));

//   const orderData = {
//     orderNo: customerData.orderNo,
//     orderId: customerData.orderId,
//     customerDetails: {
//       name: customerData.customerName,
//       phone: customerData.customerPhone,
//       guests: customerData.guests,
//       orderType: customerData.orderType,
//     },
//     orderStatus: "In Progress",
//     bills: {
//       total: roundTo3(basePrice),
//       tax: roundTo3(calculatedTax),
//       totalWithTax: roundBhd(totalWithTax),
//       discountPercentage: roundTo3(discountPercentage),
//       discountAmount: roundTo3(discountAmount),
//     },
//     items,
//     paymentMethod,
//     comment: orderComment.trim(),
//   };

//   if (customerData.orderType === "Dine-in") {
//     orderData.table = customerData.table.tableId;
//   } else if (customerData.orderType === "Delivery") {
//     orderData.deliveryAddress = customerData.deliveryAddress;
//     orderData.deliveryBoyId = customerData.deliveryBoyId;
//   }

//   try {
//     const result = await createOrder(orderData);

//     if (result.success) {
//       const tableDataForReceipt = customerData.table
//         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//         : null;

//       const orderDataForReceipt = {
//         ...result.data,
//         _id: result.data._id || result.data.orderId,
//         table: tableDataForReceipt,
//         // ✅ Attach the bills we calculated so print uses same numbers
//         bills: orderData.bills,
//       };

//       setPlacedOrderData(orderDataForReceipt);
//       // storedTotal already set above as capturedTotal

//       if (customerData.orderType === "Dine-in" && customerData.table?.tableId && !result.isOffline) {
//         try {
//           const tableData = {
//             tableId: customerData.table.tableId,
//             status: "Booked",
//             orderId: result.data._id || result.data.orderId,
//           };
//           await tableUpdateMutation.mutateAsync(tableData);
//         } catch (tableError) {
//           console.error("❌ Failed to mark table as booked:", tableError);
//           enqueueSnackbar("Order placed but table status not updated", { variant: "warning" });
//         }
//       }

//       dispatch(removeAllItems());
//       setOrderComment("");
//       setDiscountPercentage(0); // ✅ FIX: Reset discount after order
//       dispatch(confirmOrder());
//       dispatch(setCustomer({ ...customerData, comment: "" }));

//       if (customerData.orderType === "Dine-in" && !result.isOffline) {
//         dispatch(removeCustomer());
//       }
//     }
//   } catch (error) {
//     console.error("❌ ORDER PLACEMENT ERROR:", error);
//     enqueueSnackbar("Failed to place order!", { variant: "error" });
//   }
// };


//   const handleUpdateOrder = async () => {
//     if (!customerData.orderId) {
//       enqueueSnackbar("No existing order to update!", { variant: "warning" });
//       return;
//     }

//     const oldItems = customerData.items || [];
//     const mergedItems = [];
//     const currentOrderNo = customerData.orderNo || null;
//     let hasChanges = false;

//     console.log("🧩 Original order items:", oldItems);
//     console.log("🛒 Current cart data:", cartData);

//     // Merge logic (same as before)
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

//     // ✅ TAX INCLUSIVE CALCULATION
//     const discountAmount = roundTo3((total * discountPercentage) / 100);
//     const totalWithTax = roundTo3(total - discountAmount);
//     const basePrice = roundTo3(totalWithTax / 1.10);
//     const calculatedTax = roundTo3(totalWithTax - basePrice);

//     const updateData = {
//       orderNo: currentOrderNo,
//       customerDetails: {
//         name: customerData.customerName,
//         phone: customerData.customerPhone,
//         guests: customerData.guests,
//         orderType: customerData.orderType,
//       },
//       bills: {
//         total: roundTo3(basePrice),
//         tax: calculatedTax,
//         totalWithTax: roundBhd(totalWithTax),
//         discountPercentage: roundTo3(discountPercentage),
//         discountAmount: roundTo3(discountAmount),
//       },
//       items: mergedItems,
//       paymentMethod,
//       comment: orderComment.trim(),
//     };

//     if (hasChanges) {
//       updateData.orderStatus = "In Progress";
//     }

//     if (customerData.orderType === "Dine-in") {
//       updateData.table = customerData.table.tableId;
//     } else if (customerData.orderType === "Delivery") {
//       updateData.deliveryAddress = customerData.deliveryAddress;
//       updateData.deliveryBoyId = customerData.deliveryBoyId;
//     }

//     try {
//       if (!isOfflineMode) {
//         // ============================================
//         // ONLINE MODE - Use API
//         // ============================================
//         console.log("🌐 ONLINE - Updating order via API...");
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

//         enqueueSnackbar(
//           hasChanges ? "Order updated with new items!" : "Order updated!",
//           { variant: "success" }
//         );

//       }

//       else {
//         // ============================================
//         // OFFLINE MODE - Update cache AND queue
//         // ============================================
//         console.log("📴 OFFLINE - Updating order...");
//         console.log("   Order ID:", customerData.orderId);

//         const isOfflineCreated = await isTrulyOfflineOrder(customerData.orderId);
//         console.log("   Is offline-created:", isOfflineCreated);

//         // ✅ STEP 1: ALWAYS update the cache first (for both offline & online orders)
//         console.log("   💾 Updating cache...");

//         const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
//         const updatedOrders = orders.map(o => {
//           // Check all possible IDs
//           const matches =
//             o._id === customerData.orderId ||
//             o.orderId === customerData.orderId ||
//             o.orderNo === customerData.orderNo ||
//             String(o._id) === String(customerData.orderId) ||
//             String(o.orderId) === String(customerData.orderId);

//           if (matches) {
//             console.log("   ✅ Found order in cache, updating...");
//             return {
//               ...o,
//               ...updateData,
//               updatedAt: new Date().toISOString()
//             };
//           }
//           return o;
//         });

//         await save(STORAGE_KEYS.ORDERS_CACHE, updatedOrders);
//         console.log("   ✅ Cache updated");

//         // ✅ STEP 2: Add to pending sync (different logic for offline vs online orders)
//         if (isOfflineCreated) {
//           // OFFLINE-CREATED ORDER: Update the addOrder item
//           console.log("   📦 Offline order - updating addOrder item");
//           await updateOrderInCache(customerData.orderId, updateData);

//         } else {
//           // ONLINE ORDER: Create updateOrder item
//           console.log("   🌐 Online order - creating updateOrder item");
//           await addToPendingSync({
//             type: 'updateOrder',
//             orderId: customerData.orderId,
//             data: updateData,
//             timestamp: Date.now()
//           });
//         }
//         console.log("   ✅ Added to pending sync");

//         // ✅ STEP 3: Update UI
//         const tableDataForReceipt = customerData.table
//           ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//           : null;

//         const updatedOrderDataForReceipt = {
//           ...updateData,
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

//         enqueueSnackbar("Order updated offline - will sync when online", {
//           variant: "info"
//         });

//         console.log("✅ [OFFLINE UPDATE] Complete");
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

//   // ✅ Handle print button
//   // const handlePrintButton = async () => {
//   //   if (placedOrderData) {
//   //     const discountAmount = roundTo3((storedTotal * discountPercentage) / 100);
//   //     const totalWithTax = roundTo3(storedTotal - discountAmount);
//   //     const basePrice = roundTo3(totalWithTax / 1.10);
//   //     const calculatedTax = roundTo3(totalWithTax - basePrice);

//   //     const previousItems = customerData.printedItems || [];
//   //     const currentItems = placedOrderData.items || [];

//   //     const isActualReprint = isEditing && previousItems.length > 0;
//   //     const deltaItems = isActualReprint
//   //       ? calculateDeltaItems(currentItems, previousItems)
//   //       : currentItems;

//   //     const updatedOrderInfo = {
//   //       ...placedOrderData,
//   //       bills: {
//   //         ...placedOrderData.bills,
//   //         total: basePrice,
//   //         tax: calculatedTax,
//   //         totalWithTax: roundBhd(totalWithTax),
//   //         discountPercentage,
//   //         discountAmount,
//   //       },
//   //       isReprint: isActualReprint,
//   //       deltaItems: deltaItems,
//   //     };

//   //     setOrderInfo(updatedOrderInfo);
//   //     setShowInvoice(true);

//   //     try {
//   //       await sendToPrinters(updatedOrderInfo);
//   //       console.log("✅ Print sent successfully");
//   //       enqueueSnackbar("Receipt sent to printers!", { variant: "success" });

//   //       dispatch(setCustomer({
//   //         ...customerData,
//   //         printedItems: currentItems
//   //       }));
//   //     } catch (error) {
//   //       console.error("Print Error:", error);
//   //       enqueueSnackbar("Failed to send to printer!", {
//   //         variant: "error",
//   //       });
//   //     }
//   //   } else {
//   //     enqueueSnackbar("Please place or update an order first!", {
//   //       variant: "warning",
//   //     });
//   //   }
//   // };

//   // testing for the price mismatch

//   const handlePrintButton = async () => {
//   if (!placedOrderData) {
//     enqueueSnackbar("Please place or update an order first!", { variant: "warning" });
//     return;
//   }

//   const previousItems = customerData.printedItems || [];
//   const currentItems = placedOrderData.items || [];
//   const isActualReprint = isEditing && previousItems.length > 0;
//   const deltaItems = isActualReprint
//     ? calculateDeltaItems(currentItems, previousItems)
//     : currentItems;

//   // ✅ FIX: Trust placedOrderData.bills (set at order time) instead of
//   //         recalculating from storedTotal which may be stale/zero
//   const updatedOrderInfo = {
//     ...placedOrderData,
//     bills: placedOrderData.bills,   // ✅ Use stored bills, not recalculated
//     isReprint: isActualReprint,
//     deltaItems,
//   };

//   setOrderInfo(updatedOrderInfo);
//   setShowInvoice(true);

//   try {
//     await sendToPrinters(updatedOrderInfo);
//     console.log("✅ Print sent successfully");
//     enqueueSnackbar("Receipt sent to printers!", { variant: "success" });
//     dispatch(setCustomer({ ...customerData, printedItems: currentItems }));
//   } catch (error) {
//     console.error("Print Error:", error);
//     enqueueSnackbar("Failed to send to printer!", { variant: "error" });
//   }
// };




// useEffect(() => {
//   console.table(cartData.map(item => ({
//     name: item.name,
//     variation: item.variationName,
//     qty: item.quantity,
//     pricePerQty: item.pricePerQuantity,
//     totalPrice: item.price,
//     computed: item.pricePerQuantity * item.quantity,
//     match: item.price === item.pricePerQuantity * item.quantity
//   })));
//   console.log("Redux total:", total);
// }, [cartData, total]);


//   return (
//     <div className="space-y-2 lg:space-y-2 xl:space-y-2.5 ">
//       {/* Items Total */}
//       <div className="flex items-center justify-between">
//         <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
//           Items({cartData.length})
//         </p>
//         <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
//           BHD {total.toFixed(3)}
//         </h1>
//       </div>

//       {/* Tax */}
//       <div className="flex items-center justify-between">
//         <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
//           Tax({paymentMethod === "Cash" ? "10%" : "10%"})
//         </p>
//         <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
//           BHD {tax.toFixed(3)}
//         </h1>
//       </div>

//       {/* Discount */}
//       <div className="flex items-center justify-between">
//         <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
//           Discount
//         </p>
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             value={discountPercentage > 0 ? discountPercentage : ""}
//             onChange={handleDiscountChange}
//             placeholder="0"
//             className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 lg:py-0.5 xl:py-1 w-16 lg:w-14 xl:w-16 2xl:w-20 text-center focus:border-[#f6b100] focus:outline-none transition-colors"
//           />
//         </div>
//       </div>

//       {/* Total With Tax */}
//       <div className="flex items-center justify-between pb-2.5 lg:pb-2 xl:pb-2.5 border-b border-[#2a2a2a]">
//         <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
//           Total With Tax
//         </p>
//         <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">
//           BHD {totalPriceWithTax.toFixed(3)}
//         </h1>
//       </div>

//       {/* Order Comment/Notes */}
//       <div className="flex flex-col gap-1 pt-1">
//         <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
//           Order Notes (Optional)
//         </p>
//         <textarea
//           value={orderComment}
//           onChange={handleCommentChange}
//           placeholder="Add special instructions or notes..."
//           rows={3}
//           className="text-[#f5f5f5] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm bg-[#1f1f1f] border border-[#555] rounded-lg px-3 py-2 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 w-full resize-none focus:border-[#f6b100] focus:outline-none transition-colors"
//         />
//       </div>

//       {/* Payment Method Buttons */}
//       <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 w-full pt-2.5 lg:pt-2 xl:pt-2.5">
//         <button
//           onClick={() => setPaymentMethod("Cash")}
//           className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Cash" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
//             }`}
//         >
//           Cash
//         </button>
//         <button
//           onClick={() => setPaymentMethod("Online")}
//           className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Online" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
//             }`}
//         >
//           Online
//         </button>
//         <button
//           onClick={() => setPaymentMethod("Benefit")}
//           className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${paymentMethod === "Benefit" ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
//             }`}
//         >
//           Benefit
//         </button>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 pt-2.5 lg:pt-2 xl:pt-2.5 pb-4">
//         <button
//           onClick={handlePrintButton}
//           className="bg-[#025cca] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#0147a3] transition-colors"
//         >
//           Print Receipt
//         </button>

//         <button
//           onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
//           disabled={cartData.length === 0}
//           className="bg-[#f6b100] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e5a200] transition-colors"
//         >
//           {isEditing ? "Update Order" : "Place Order"}
//         </button>
//       </div>

//       {/* Delivery Button - Conditional */}
//       {customerData.orderType === "Delivery" && (
//         <div className="pt-2.5 lg:pt-2 xl:pt-2.5 pb-12">
//           <button
//             onClick={() => setIsDeliveryModalOpen(true)}
//             className="bg-[#ff6b35] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#ff5520] transition-colors flex items-center justify-center gap-2"
//           >
//             <span>📍</span> Enter Delivery Details
//           </button>
//         </div>
//       )}

//       {/* Invoice Modal */}
//       {showInvoice && (
//         <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
//       )}

//       {/* Delivery Modal */}
//       <DeliveryModal
//         isOpen={isDeliveryModalOpen}
//         onClose={() => setIsDeliveryModalOpen(false)}
//         onCreateDelivery={handleDeliveryOrder}
//         existingData={customerData}
//       />
//     </div>
//   );
// };

// export default BillInfo;



import React, { useState, useEffect } from "react";
import { sendToPrinters } from "../../https/printBridge";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slice/cartSlice";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrder, updateOrder, updateTable } from "../../https";
import { removeAllItems } from "../../redux/slice/cartSlice";
import { removeCustomer, confirmOrder, setCustomer } from "../../redux/slice/customerSlice";
import { roundBhd } from "../../utils";
import Invoice from "../invoice/Invoice";
import DeliveryModal from "../shared/DeliveryModal";
import { useOfflineMode } from "../../constants/OfflineModeContext";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import {
  isTrulyOfflineOrder,
  addToPendingSync,
  updateOrderInCache,
  STORAGE_KEYS,
  load,
  save
} from "../../utils/offlineStore";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const roundTo3 = (num) => {
  const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
  return Math.round(n * 1000) / 1000;
};

// Recompute a safe line price from unit price × quantity.
// Never trust item.price directly — it may be a stale accumulated total.
const safeLinePrice = (item) =>
  roundTo3((Number(item.pricePerQuantity) || 0) * (Number(item.quantity) || 0));

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
      deltaItems.push({ ...currentItem, quantity: currentItem.quantity, isNew: true });
    } else if (currentItem.quantity > previousItem.quantity) {
      deltaItems.push({
        ...currentItem,
        quantity: currentItem.quantity - previousItem.quantity,
        isNew: false,
        previousQuantity: previousItem.quantity
      });
    }
  });
  return deltaItems;
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

const BillInfo = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isOfflineMode } = useOfflineMode();
  const { createOrder } = useCreateOrder();

  const isEditing    = useSelector((state) => state.editOrder.isEditing);
  const customerData = useSelector((state) => state.customer);
  const cartData     = useSelector((state) => state.cart);
  const total        = useSelector(getTotalPrice);

  const [paymentMethod,      setPaymentMethod]      = useState(customerData.paymentMethod || "Cash");
  const [tax,                setTax]                = useState(0);
  const [totalPriceWithTax,  setTotalPriceWithTax]  = useState(0);
  const [showInvoice,        setShowInvoice]        = useState(false);
  const [orderInfo,          setOrderInfo]          = useState(null);
  const [placedOrderData,    setPlacedOrderData]    = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [storedTotal,        setStoredTotal]        = useState(0);
  const [isDeliveryModalOpen,setIsDeliveryModalOpen]= useState(false);
  const [orderComment,       setOrderComment]       = useState(customerData.comment || "");

  // ── Debug log ────────────────────────────────────────────────
  // Remove before production
  useEffect(() => {
    console.table(cartData.map(item => ({
      name:        item.name,
      variation:   item.variationName,
      qty:         item.quantity,
      pricePerQty: item.pricePerQuantity,
      totalPrice:  item.price,
      computed:    roundTo3(item.pricePerQuantity * item.quantity),
      match:       Math.abs(item.price - item.pricePerQuantity * item.quantity) < 0.001,
    })));
    console.log("Redux total:", total);
  }, [cartData, total]);

  // ── Tax display ───────────────────────────────────────────────
  useEffect(() => {
    const discountAmount    = roundTo3((total * discountPercentage) / 100);
    const totalAfterDiscount = roundTo3(total - discountAmount);
    const basePrice         = roundTo3(totalAfterDiscount / 1.10);
    const calculatedTax     = roundTo3(totalAfterDiscount - basePrice);
    setTax(calculatedTax);
    setTotalPriceWithTax(roundBhd(totalAfterDiscount));
  }, [total, paymentMethod, discountPercentage]);

  const handleCommentChange = (e) => setOrderComment(e.target.value);
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) setDiscountPercentage(value);
  };

  // ── Mutations ─────────────────────────────────────────────────

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: async () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
      await queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => console.error("Table Update Error:", error),
  });

  // ✅ FIX 7: updateOrderMutation.onSuccess now attaches bills to placedOrderData
  // so handlePrintButton can read placedOrderData.bills correctly.
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
    onSuccess: async (resData, variables) => {
      dispatch(removeAllItems());
      setOrderComment("");

      const serverData = resData?.data?.data || {};
      const tableDataForReceipt = customerData.table
        ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
        : serverData.table;

      // ✅ Always attach bills so print can use them
      const updatedOrderDataForReceipt = resData?.data?.data
        ? { ...serverData,      table: tableDataForReceipt, bills: variables.updateData.bills }
        : { ...placedOrderData, ...variables.updateData, table: tableDataForReceipt, bills: variables.updateData.bills };

      setPlacedOrderData(updatedOrderDataForReceipt);

      try {
        await queryClient.invalidateQueries(["orders"]);
        await queryClient.refetchQueries(["orders"], { active: true });
        if (variables.orderId) await queryClient.invalidateQueries(["order", variables.orderId]);
      } catch (cacheError) {
        console.error("Cache invalidation error:", cacheError);
      }

      enqueueSnackbar("Order updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      console.error("❌ ONLINE ORDER UPDATE FAILED:", error);
      enqueueSnackbar(error?.response?.data?.message || "Failed to update order.", { variant: "error" });
    },
  });

  // ── Delivery handler ──────────────────────────────────────────

  const handleDeliveryOrder = async (deliveryData) => {
    try {
      const updatedCustomerData = {
        ...customerData,
        customerName:    deliveryData.name,
        customerPhone:   deliveryData.phone,
        guests:          0,
        orderType:       "Delivery",
        deliveryAddress: deliveryData.address,
        deliveryBoyId:   deliveryData.deliveryBoy,
      };
      dispatch(setCustomer(updatedCustomerData));
      setIsDeliveryModalOpen(false);
      if (cartData.length > 0) {
        setTimeout(() => handlePlaceOrder(), 200);
      } else {
        enqueueSnackbar("Delivery details saved! Add items to place order.", { variant: "success" });
      }
    } catch (error) {
      console.error("Delivery Order Error:", error);
      enqueueSnackbar("Failed to save delivery details!", { variant: "error" });
    }
  };

  // ── Place Order ───────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select payment method!", { variant: "warning" });
      return;
    }
    if (cartData.length === 0) {
      enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
      return;
    }
    if (customerData.orderType === "Delivery" &&
        (!customerData.customerPhone || customerData.customerPhone.trim() === "")) {
      enqueueSnackbar("Please enter delivery phone number!", { variant: "warning" });
      setIsDeliveryModalOpen(true);
      return;
    }

    // ✅ Snapshot total before any dispatches
    const capturedTotal  = total;
    setStoredTotal(capturedTotal);

    const discountAmount  = roundTo3((capturedTotal * discountPercentage) / 100);
    const totalWithTax    = roundTo3(capturedTotal - discountAmount);
    const basePrice       = roundTo3(totalWithTax / 1.10);
    const calculatedTax   = roundTo3(totalWithTax - basePrice);

    const items = cartData.map((item) => ({
      orderNo:          customerData.orderNo,
      menuItem:         item.menuItem || item.dishId || item._id,
      name:             item.name || item.dishName,
      variationName:    item.variationName || null,
      pricePerQuantity: roundTo3(item.pricePerQuantity),
      quantity:         item.quantity,
      price:            safeLinePrice(item), // ✅ always recomputed
      section:          item.section || null,
      notes:            item.notes || "",
      status:           "pending",
    }));

    const bills = {
      total:              roundTo3(basePrice),
      tax:                roundTo3(calculatedTax),
      totalWithTax:       roundBhd(totalWithTax),
      discountPercentage: roundTo3(discountPercentage),
      discountAmount:     roundTo3(discountAmount),
    };

    const orderData = {
      orderNo:         customerData.orderNo,
      orderId:         customerData.orderId,
      customerDetails: {
        name:      customerData.customerName,
        phone:     customerData.customerPhone,
        guests:    customerData.guests,
        orderType: customerData.orderType,
      },
      orderStatus: "In Progress",
      bills,
      items,
      paymentMethod,
      comment: orderComment.trim(),
    };

    if (customerData.orderType === "Dine-in")   orderData.table          = customerData.table.tableId;
    if (customerData.orderType === "Delivery")  { orderData.deliveryAddress = customerData.deliveryAddress; orderData.deliveryBoyId = customerData.deliveryBoyId; }

    try {
      const result = await createOrder(orderData);
      if (result.success) {
        const tableDataForReceipt = customerData.table
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : null;

        setPlacedOrderData({
          ...result.data,
          _id:   result.data._id || result.data.orderId,
          table: tableDataForReceipt,
          bills, // ✅ always attach so print reads correct numbers
        });

        if (customerData.orderType === "Dine-in" && customerData.table?.tableId && !result.isOffline) {
          try {
            await tableUpdateMutation.mutateAsync({
              tableId: customerData.table.tableId,
              status:  "Booked",
              orderId: result.data._id || result.data.orderId,
            });
          } catch (tableError) {
            console.error("❌ Failed to mark table as booked:", tableError);
            enqueueSnackbar("Order placed but table status not updated", { variant: "warning" });
          }
        }

        dispatch(removeAllItems());
        setOrderComment("");
        setDiscountPercentage(0);
        dispatch(confirmOrder());
        dispatch(setCustomer({ ...customerData, comment: "" }));
        if (customerData.orderType === "Dine-in" && !result.isOffline) dispatch(removeCustomer());
      }
    } catch (error) {
      console.error("❌ ORDER PLACEMENT ERROR:", error);
      enqueueSnackbar("Failed to place order!", { variant: "error" });
    }
  };

  // ── Update Order ──────────────────────────────────────────────

  const handleUpdateOrder = async () => {
    if (!customerData.orderId) {
      enqueueSnackbar("No existing order to update!", { variant: "warning" });
      return;
    }

    // ✅ FIX 5: Capture total NOW — same race-condition fix as handlePlaceOrder
    const capturedTotal  = total;
    const oldItems       = customerData.items || [];
    const mergedItems    = [];
    const currentOrderNo = customerData.orderNo || null;
    let hasChanges       = false;

    cartData.forEach((item) => {
      // ✅ FIX 6: Match on item.menuItem first (what cartSlice stores),
      // falling back to dishId/id for backwards compatibility
      const cartMenuItemId = item.menuItem || item.dishId || item.id;

      const existing = oldItems.find(
        (old) =>
          old.menuItem === cartMenuItemId &&
          (old.variationName?.toLowerCase?.().trim?.() ===
            item.variationName?.toLowerCase?.().trim?.() ||
            (!old.variationName && !item.variationName))
      );

      if (existing) {
        if (existing.status === "Ready") {
          if (item.quantity > existing.quantity) {
            hasChanges = true;
            const existingUnitPrice = Number(existing.pricePerQuantity) > 0
              ? existing.pricePerQuantity
              : roundTo3(existing.price / existing.quantity);

            mergedItems.push(
              // Ready part — keep existing quantity untouched
              {
                ...existing,
                quantity: existing.quantity,
                // ✅ FIX 4a: recompute from unit price
                price:    roundTo3(existingUnitPrice * existing.quantity),
                status:   "Ready",
              },
              // New part — only the additional units
              {
                name:             item.name || item.dishName,
                variationName:    item.variationName || null,
                notes:            item.notes || "",
                pricePerQuantity: roundTo3(item.pricePerQuantity),
                // ✅ FIX 4b: price for ADDITIONAL qty only
                price:            roundTo3(item.pricePerQuantity * (item.quantity - existing.quantity)),
                section:          item.section,
                menuItem:         cartMenuItemId,
                orderNo:          currentOrderNo,
                quantity:         item.quantity - existing.quantity,
                status:           "pending",
              }
            );
          } else if (item.quantity < existing.quantity) {
            hasChanges = true;
            const existingUnitPrice = Number(existing.pricePerQuantity) > 0
              ? existing.pricePerQuantity
              : roundTo3(existing.price / existing.quantity);
            mergedItems.push({
              ...existing,
              quantity: item.quantity,
              price:    roundTo3(existingUnitPrice * item.quantity), // ✅ FIX 4c
              status:   "Ready",
            });
          } else {
            const existingUnitPrice = Number(existing.pricePerQuantity) > 0
              ? existing.pricePerQuantity
              : roundTo3(existing.price / existing.quantity);
            mergedItems.push({
              ...existing,
              price:  roundTo3(existingUnitPrice * existing.quantity), // ✅ FIX 4d
              status: "Ready",
            });
          }
        } else {
          if (item.quantity !== existing.quantity) hasChanges = true;
          mergedItems.push({
            ...existing,
            name:             item.name || item.dishName,
            variationName:    item.variationName || null,
            notes:            item.notes || "",
            pricePerQuantity: roundTo3(item.pricePerQuantity),
            price:            safeLinePrice(item), // ✅ FIX 4e: always recomputed
            section:          item.section,
            menuItem:         cartMenuItemId,
            orderNo:          currentOrderNo,
            quantity:         item.quantity,
            status:           existing.status ?? "pending",
          });
        }
      } else {
        hasChanges = true;
        mergedItems.push({
          name:             item.name || item.dishName,
          variationName:    item.variationName || null,
          notes:            item.notes || "",
          pricePerQuantity: roundTo3(item.pricePerQuantity),
          price:            safeLinePrice(item), // ✅ FIX 4f: always recomputed
          section:          item.section,
          menuItem:         cartMenuItemId,
          orderNo:          currentOrderNo,
          quantity:         item.quantity,
          status:           "pending",
        });
      }
    });

    oldItems.forEach((oldItem) => {
      const stillExists = cartData.find(
        (item) =>
          (item.menuItem || item.dishId || item.id) === oldItem.menuItem &&
          (item.variationName?.toLowerCase?.().trim?.() ===
            oldItem.variationName?.toLowerCase?.().trim?.() ||
            (!item.variationName && !oldItem.variationName))
      );
      if (!stillExists) hasChanges = true;
    });

    // ✅ FIX 5: Use capturedTotal, not live `total`
    const discountAmount  = roundTo3((capturedTotal * discountPercentage) / 100);
    const totalWithTax    = roundTo3(capturedTotal - discountAmount);
    const basePrice       = roundTo3(totalWithTax / 1.10);
    const calculatedTax   = roundTo3(totalWithTax - basePrice);

    const bills = {
      total:              roundTo3(basePrice),
      tax:                roundTo3(calculatedTax),
      totalWithTax:       roundBhd(totalWithTax),
      discountPercentage: roundTo3(discountPercentage),
      discountAmount:     roundTo3(discountAmount),
    };

    const updateData = {
      orderNo:         currentOrderNo,
      customerDetails: {
        name:      customerData.customerName,
        phone:     customerData.customerPhone,
        guests:    customerData.guests,
        orderType: customerData.orderType,
      },
      bills,
      items:         mergedItems,
      paymentMethod,
      comment:       orderComment.trim(),
    };

    if (hasChanges) updateData.orderStatus = "In Progress";
    if (customerData.orderType === "Dine-in")  updateData.table          = customerData.table.tableId;
    if (customerData.orderType === "Delivery") { updateData.deliveryAddress = customerData.deliveryAddress; updateData.deliveryBoyId = customerData.deliveryBoyId; }

    try {
      if (!isOfflineMode) {
        // ── ONLINE ─────────────────────────────────────────────
        await updateOrderMutation.mutateAsync({ orderId: customerData.orderId, updateData });
        // onSuccess handles setPlacedOrderData with bills attached (FIX 7)
        setStoredTotal(capturedTotal);

        dispatch(setCustomer({
          ...customerData,
          comment: "",
          items:   mergedItems,
        }));

        enqueueSnackbar(hasChanges ? "Order updated with new items!" : "Order updated!", { variant: "success" });

      } else {
        // ── OFFLINE ────────────────────────────────────────────
        const isOfflineCreated = await isTrulyOfflineOrder(customerData.orderId);
        const orders           = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];

        await save(
          STORAGE_KEYS.ORDERS_CACHE,
          orders.map((o) => {
            const matches =
              o._id     === customerData.orderId ||
              o.orderId === customerData.orderId ||
              o.orderNo === customerData.orderNo ||
              String(o._id)     === String(customerData.orderId) ||
              String(o.orderId) === String(customerData.orderId);
            return matches ? { ...o, ...updateData, updatedAt: new Date().toISOString() } : o;
          })
        );

        if (isOfflineCreated) {
          await updateOrderInCache(customerData.orderId, updateData);
        } else {
          await addToPendingSync({ type: 'updateOrder', orderId: customerData.orderId, data: updateData, timestamp: Date.now() });
        }

        const tableDataForReceipt = customerData.table
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : null;

        setPlacedOrderData({
          ...updateData,
          bills, // ✅ always attach
          table:   tableDataForReceipt,
          _id:     customerData.orderId,
          orderId: customerData.orderId,
        });
        setStoredTotal(capturedTotal);
        dispatch(removeAllItems());
        setOrderComment("");
        dispatch(setCustomer({ ...customerData, comment: "", items: mergedItems }));
        enqueueSnackbar("Order updated offline - will sync when online", { variant: "info" });
      }
    } catch (err) {
      console.error("❌ UPDATE ORDER ERROR:", err);
      enqueueSnackbar(err?.message || "Failed to update order!", { variant: "error" });
    }
  };

  // ── Print ─────────────────────────────────────────────────────

  const handlePrintButton = async () => {
    if (!placedOrderData) {
      enqueueSnackbar("Please place or update an order first!", { variant: "warning" });
      return;
    }

    const previousItems   = customerData.printedItems || [];
    const currentItems    = placedOrderData.items || [];
    const isActualReprint = isEditing && previousItems.length > 0;
    const deltaItems      = isActualReprint ? calculateDeltaItems(currentItems, previousItems) : currentItems;

    // ✅ Trust placedOrderData.bills — set at order time, always correct
    const updatedOrderInfo = {
      ...placedOrderData,
      bills:     placedOrderData.bills,
      isReprint: isActualReprint,
      deltaItems,
    };

    setOrderInfo(updatedOrderInfo);
    setShowInvoice(true);

    try {
      await sendToPrinters(updatedOrderInfo);
      enqueueSnackbar("Receipt sent to printers!", { variant: "success" });
      dispatch(setCustomer({ ...customerData, printedItems: currentItems }));
    } catch (error) {
      console.error("Print Error:", error);
      enqueueSnackbar("Failed to send to printer!", { variant: "error" });
    }
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-2 lg:space-y-2 xl:space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">Items({cartData.length})</p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">BHD {total.toFixed(3)}</h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">Tax(10%)</p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">BHD {tax.toFixed(3)}</h1>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">Discount</p>
        <input
          type="number"
          value={discountPercentage > 0 ? discountPercentage : ""}
          onChange={handleDiscountChange}
          placeholder="0"
          className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 lg:py-0.5 xl:py-1 w-16 lg:w-14 xl:w-16 2xl:w-20 text-center focus:border-[#f6b100] focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center justify-between pb-2.5 lg:pb-2 xl:pb-2.5 border-b border-[#2a2a2a]">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">Total With Tax</p>
        <h1 className="text-[#f5f5f5] text-sm lg:text-xs xl:text-sm 2xl:text-md font-bold">BHD {totalPriceWithTax.toFixed(3)}</h1>
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">Order Notes (Optional)</p>
        <textarea
          value={orderComment}
          onChange={handleCommentChange}
          placeholder="Add special instructions or notes..."
          rows={3}
          className="text-[#f5f5f5] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm bg-[#1f1f1f] border border-[#555] rounded-lg px-3 py-2 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 w-full resize-none focus:border-[#f6b100] focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 w-full pt-2.5 lg:pt-2 xl:pt-2.5">
        {["Cash", "Online", "Benefit"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`flex-1 w-full bg-[#1f1f1f] px-2.5 py-2 lg:px-2 lg:py-1.5 xl:px-2.5 xl:py-2 2xl:px-3 2xl:py-2.5 rounded-lg text-[#ababab] text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-all duration-150 hover:bg-[#2a2a2a] ${
              paymentMethod === method ? "bg-[#383737] scale-105 shadow-md ring-2 ring-yellow-500/50" : ""
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 pt-2.5 lg:pt-2 xl:pt-2.5 pb-4">
        <button onClick={handlePrintButton} className="bg-[#025cca] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#0147a3] transition-colors">
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

      {customerData.orderType === "Delivery" && (
        <div className="pt-2.5 lg:pt-2 xl:pt-2.5 pb-12">
          <button onClick={() => setIsDeliveryModalOpen(true)} className="bg-[#ff6b35] px-2.5 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm lg:text-xs xl:text-sm 2xl:text-base hover:bg-[#ff5520] transition-colors flex items-center justify-center gap-2">
            <span>📍</span> Enter Delivery Details
          </button>
        </div>
      )}

      {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}

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