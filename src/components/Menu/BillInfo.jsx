// import React, { useState, useEffect } from "react";
// import { sendToPrinters } from "../../https/printBridge";

// import { useDispatch, useSelector } from "react-redux";
// import { getTotalPrice } from "../../redux/slice/cartSlice";
// import { enqueueSnackbar } from "notistack";
// import { useMutation } from "@tanstack/react-query";
// import { addOrder, updateOrder, updateTable } from "../../https";
// import { removeAllItems } from "../../redux/slice/cartSlice";
// import { removeCustomer, confirmOrder, setCustomer } from "../../redux/slice/customerSlice";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import { roundBhd } from "../../utils";
// import Invoice from "../invoice/Invoice";
// import DeliveryModal from "../shared/DeliveryModal";
// import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// const BillInfo = () => {
//   const dispatch = useDispatch();
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

//   const roundTo3 = (num) => {
//     const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
//     return Math.round(n * 1000) / 1000;
//   };

//   const handlePaymentMethodChange = (method) => {
//     dispatch(setPaymentMethod(method));
//   };

//   // // ✅ Calculate total with tax (auto BHD rounded)
//   // useEffect(() => {
//   //   let taxRate = 10;
//   //   const discountAmount = (total * discountPercentage) / 100;
//   //   const discountedTotal = total - discountAmount;
//   //   const calculatedTax = (total * taxRate) / 100;
//   //   const totalWithTax = discountedTotal + calculatedTax;
//   //   setTax(calculatedTax);
//   //   setTotalPriceWithTax(roundBhd(totalWithTax));
//   // }, [total, paymentMethod, discountPercentage]);

//   // ✅ FIXED: Calculate total with tax (discount AFTER tax)
//   useEffect(() => {
//     const taxRate = 10;

//     // Step 1: Calculate tax on subtotal
//     const calculatedTax = roundTo3((total * taxRate) / 100);

//     // Step 2: Add tax to get total with tax
//     const totalWithTax = roundTo3(total + calculatedTax);

//     // Step 3: Apply discount to the total-with-tax
//     const discountAmount = roundTo3((totalWithTax * discountPercentage) / 100);
//     const finalTotal = totalWithTax - discountAmount;

//     // Step 4: Apply BHD rounding at the very end
//     setTax(calculatedTax);
//     setTotalPriceWithTax(roundBhd(finalTotal));
//   }, [total, paymentMethod, discountPercentage]);

//   // ✅ Mutation for adding new order
//   const orderMutation = useMutation({
//     mutationFn: (reqData) => addOrder(reqData),
//     onSuccess: (resData) => {
//       dispatch(removeAllItems());
//       const { data } = resData.data;



//       // Manually construct the table object for the receipt
//       const tableDataForReceipt = customerData.table
//         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//         : data.table; // Fallback

//       const orderDataForReceipt = {
//         ...data,
//         // Replace the simple ID with the full table object for the receipt to use
//         table: tableDataForReceipt,
//       };



//       // setPlacedOrderData(data);
//       setPlacedOrderData(orderDataForReceipt);
//       console.log("Placed Order Data:", orderDataForReceipt);

//       const tableData = {
//         tableId: data.table,
//         status: "Booked",
//         orderId: data._id,
//       };

//       setTimeout(() => tableUpdateMutation.mutate(tableData), 1500);
//       enqueueSnackbar("Order Placed!", { variant: "success" });
//     },
//     onError: (error) => {
//       console.error("Add Order Error:", error);
//       enqueueSnackbar("Failed to place order!", { variant: "error" });
//     },
//   });

//   // ✅ Mutation for table update
//   const tableUpdateMutation = useMutation({
//     mutationFn: (reqData) => updateTable(reqData),
//     onSuccess: () => {
//       dispatch(removeCustomer());
//       dispatch(removeAllItems());
//     },
//     onError: (error) => {
//       console.error("Table Update Error:", error);
//     },
//   });

//   // ✅ Mutation for order update (fixed)
//   const updateOrderMutation = useMutation({
//     mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
//     onSuccess: (resData) => {
//       // NOTE: storedTotal is already set in handleUpdateOrder before mutation
//       //   dispatch(removeAllItems());
//       //   enqueueSnackbar("Order updated successfully!", { variant: "success" });

//       //   // ✅ Fix: store updated order so print receipt works too
//       //   if (resData?.data?.data) {
//       //     setPlacedOrderData(resData.data.data);
//       //   } else {
//       //     // Fallback: use local data if backend doesn’t return updated order
//       //     setPlacedOrderData((prev) => ({
//       //       ...prev,
//       //       ...updateData,
//       //     }));
//       //   }
//       // },
//       dispatch(removeAllItems());
//       enqueueSnackbar("Order updated successfully!", { variant: "success" });

//       // Get the updated data from the server response
//       const serverData = resData?.data?.data || {};

//       // 1. Get the necessary table data from the current Redux state (which is correct now)
//       const tableDataForReceipt = customerData.table
//         ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
//         : serverData.table; // Fallback to server data if customerData is missing (e.g., Take Away)

//       // 2. Construct the final data object for the receipt state
//       let updatedOrderDataForReceipt = { // 🛑 FIX: Changed declaration from 'const' to 'let'
//         ...serverData,
//         // If the server response didn't include the table, ensure we add it from Redux state
//         table: tableDataForReceipt,
//       };

//       // Fallback if the backend returns nothing (less likely now)
//       if (!resData?.data?.data) {
//         // This assignment is now valid because updatedOrderDataForReceipt is declared with 'let'
//         updatedOrderDataForReceipt = {
//           ...placedOrderData,
//           ...updateData,
//           table: tableDataForReceipt,
//         };
//       }

//       setPlacedOrderData(updatedOrderDataForReceipt);

//       // You might want to remove this if you only want to clear state on final payment
//       // dispatch(removeCustomer());
//     },
//     onError: (error) => {
//       enqueueSnackbar("Failed to update order.", { variant: "error" });
//     },
//   });


//   // ✅ Handle Delivery Order with Customer Info
//   const handleDeliveryOrder = async (deliveryData) => {
//     try {
//       // Update customer info with delivery details
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

//       // Close the modal
//       setIsDeliveryModalOpen(false);

//       // Now place the order with delivery info
//       // Wait a tiny bit for Redux to update
//       setTimeout(() => {
//         handlePlaceOrder();
//       }, 100);

//     } catch (error) {
//       console.error("Delivery Order Error:", error);
//       enqueueSnackbar("Failed to create delivery order!", { variant: "error" });
//     }
//   };


//   // ✅ Handle placing order
//   const handlePlaceOrder = async () => {
//     if (!paymentMethod) {
//       enqueueSnackbar("Please select payment method!", { variant: "warning" });
//       return;
//     }
//     if (cartData.length === 0) {
//       enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
//       return;
//     }

//     // setStoredTotal(total); // <-- Correctly saves the current total

//     // const discountAmount = roundTo3((total * discountPercentage) / 100);
//     // const taxRate = 10;
//     // const discountedTotal = roundTo3(total - discountAmount);
//     // const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
//     // const totalWithTax = roundBhd(discountedTotal + calculatedTax);
//     setStoredTotal(total);

//     const taxRate = 10;
//     const discountAmount = roundTo3((total * discountPercentage) / 100);
//     const discountedTotal = roundTo3(total - discountAmount);
//     const calculatedTax = roundTo3((discountedTotal * taxRate) / 100); // ✅ Tax on discounted
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
//     };

//     if (customerData.orderType === "Dine-in") {
//       orderData.table = customerData.table.tableId;
//       // orderData.table = customerData.table?.tableNo;
//       console.log("table id sent to backend:", customerData.table?.tableId);
//       // console.log("table no in orderData:", customerData.table?.tableNo);
//     } else if (customerData.orderType === "Delivery") {
//       orderData.deliveryAddress = customerData.deliveryAddress;
//       orderData.deliveryBoyId = customerData.deliveryBoyId;
//     }

//     try {
//       // await orderMutation.mutateAsync(orderData);
//       // ✅ Wait for the order to be successfully placed
//       const response = await orderMutation.mutateAsync(orderData);

//       // ✅ Only increment counter AFTER successful order placement
//       dispatch(confirmOrder());
//       //  dispatch(removeCustomer());
//     } catch (error) {
//       console.error("Order Placement Error:", error);
//     }
//   };

//   // ✅ Handle updating existing order
//   // const handleUpdateOrder = async () => {
//   //   if (cartData.length === 0) {
//   //     enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
//   //     return;
//   //   }


//   //   setStoredTotal(total);

//   //   const taxRate = 10;
//   //   const discountAmount = roundTo3((total * discountPercentage) / 100);
//   //   const discountedTotal = roundTo3(total - discountAmount);
//   //   const calculatedTax = roundTo3((discountedTotal * taxRate) / 100); // ✅ Tax on discounted
//   //   const totalWithTax = roundBhd(discountedTotal + calculatedTax);


//   //   const items = cartData.map((item) => ({
//   //     orderNo: customerData.orderNo,
//   //     menuItem: item.dishId || item.id,
//   //     name: item.name,
//   //     variationName: item.variationName || null,
//   //     pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
//   //     quantity: item.quantity,
//   //     price: roundTo3(item.price),
//   //     section: item.section || null,
//   //   }));

//   //   const updateData = {
//   //     customerDetails: {
//   //       name: customerData.customerName || "Walk-In Customer",
//   //       phone: customerData.customerPhone || "N/A",
//   //       guests: customerData.guests || 0,
//   //       orderType: customerData.orderType || "Take Away",
//   //     },
//   //     bills: {
//   //       total: roundTo3(total), // This 'total' is the correct current cart total
//   //       tax: roundTo3(calculatedTax),
//   //       totalWithTax,
//   //       discountPercentage: roundTo3(discountPercentage),
//   //       discountAmount: roundTo3(discountAmount),
//   //     },
//   //     items,
//   //     paymentMethod,
//   //     orderStatus: "In Progress",
//   //   };

//   //   if (customerData.orderType === "Dine-in" && customerData.table?.tableId) {
//   //     updateData.table = customerData.table.tableId;
//   //   } else if (customerData.orderType === "Delivery") {
//   //     updateData.deliveryAddress = customerData.deliveryAddress;
//   //     updateData.deliveryBoyId = customerData.deliveryBoyId;
//   //   }

//   //   await updateOrderMutation.mutateAsync({
//   //     orderId: customerData.orderId,
//   //     updateData,
//   //   });
//   // };



//   const handleUpdateOrder = async () => {
//     if (!customerData.orderId) {
//       enqueueSnackbar("No existing order to update!", { variant: "warning" });
//       return;
//     }

//     const oldItems = customerData.items || [];
//     const mergedItems = [];
//     const currentOrderNo = customerData.orderNo || null;

//     // 🚨 Track if there are any changes to the order
//     let hasChanges = false;

//     console.log("🧩 Original order items before update:", oldItems);
//     console.log("🛒 Current cart data before update:", cartData);

//     // 🔍 Safety check
//     if (oldItems.length === 0) {
//       console.warn("⚠️ WARNING: oldItems is empty! Make sure 'items' is in Redux initialState");
//     }

//     // 🚨 CRITICAL: If oldItems is empty, we have a Redux state issue!
//     if (oldItems.length === 0 && cartData.length > 0) {
//       console.error("❌❌❌ CRITICAL: oldItems is EMPTY but cartData has items!");
//       console.error("This means customerData.items is not being stored in Redux!");
//       console.error("Check your setCustomer reducer to ensure it saves the 'items' field.");
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
//         // 🟢 Case 1: Item exists already
//         if (existing.status === "Ready") {
//           if (item.quantity > existing.quantity) {
//             // ✅ Quantity increased - split into ready part and new pending part
//             hasChanges = true; // 🚨 Mark that changes occurred

//             const readyPart = {
//               ...existing,
//               quantity: existing.quantity, // Keep original ready quantity
//               status: "Ready" // ✅ Preserve capital R
//             };

//             const newPart = {
//               name: item.name,
//               variationName: item.variationName || null,
//               notes: item.notes || "",
//               price: item.price,
//               section: item.section,
//               menuItem: item.dishId || item.id,
//               orderNo: currentOrderNo,
//               quantity: item.quantity - existing.quantity, // Only the added quantity
//               status: "pending", // ✅ New quantity is pending (lowercase)
//             };

//             mergedItems.push(readyPart, newPart);

//           } else if (item.quantity < existing.quantity) {
//             // ✅ Quantity decreased - keep ready but update quantity
//             hasChanges = true; // 🚨 Mark that changes occurred

//             mergedItems.push({
//               ...existing,
//               quantity: item.quantity,
//               status: "Ready" // ✅ Preserve capital R
//             });

//           } else {
//             // ✅ Quantity same - keep ready as-is (NO CHANGE, NO FLAG)
//             mergedItems.push({
//               ...existing,
//               status: "Ready" // ✅ Preserve capital R
//             });
//           }

//         } else {
//           // 🟡 Case 2: Existing item not ready (pending/in-progress)
//           if (item.quantity !== existing.quantity) {
//             hasChanges = true; // 🚨 Quantity changed
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
//             status: existing.status ?? "pending", // Keep existing status
//           });
//         }

//       } else {
//         // 🔵 Case 3: Brand new item - add as pending
//         hasChanges = true; // 🚨 New item added

//         mergedItems.push({
//           name: item.name,
//           variationName: item.variationName || null,
//           notes: item.notes || "",
//           price: item.price,
//           section: item.section,
//           menuItem: item.dishId || item.id,
//           orderNo: currentOrderNo,
//           quantity: item.quantity,
//           status: "pending", // ✅ New items are pending (lowercase)
//         });
//       }
//     });

//     // 🗑️ Check if any items were removed
//     oldItems.forEach((oldItem) => {
//       const stillExists = cartData.find(
//         (item) =>
//           (item.dishId || item.id) === oldItem.menuItem &&
//           (item.variationName?.toLowerCase?.().trim?.() ===
//             oldItem.variationName?.toLowerCase?.().trim?.() ||
//             (!item.variationName && !oldItem.variationName))
//       );

//       if (!stillExists) {
//         hasChanges = true; // 🚨 Item was removed
//       }
//     });

//     // 🧮 Recalculate totals
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
//     };

//     // 🚨 CRITICAL: If there are changes, set orderStatus back to "In Progress"
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
//       const response = await updateOrderMutation.mutateAsync({
//         orderId: customerData.orderId,
//         updateData,
//       });

//       // ✅ SOLUTION 1: Update Redux with the backend response (most reliable)
//       const updatedOrder = response?.data?.data || response?.data;

//       if (updatedOrder && updatedOrder.items) {
//         dispatch(setCustomer({
//           ...customerData,
//           items: updatedOrder.items, // Use backend's updated items
//         }));
//         console.log("✅ Redux state synced with backend items:", updatedOrder.items);
//       } else {
//         // ✅ SOLUTION 2: Fallback - use our merged items if backend doesn't return full order
//         dispatch(setCustomer({
//           ...customerData,
//           items: mergedItems,
//         }));
//         console.log("✅ Redux state updated with merged items:", mergedItems);
//       }

//       if (hasChanges) {
//         enqueueSnackbar("Order updated with new items!", { variant: "success" });
//       } else {
//         enqueueSnackbar("Order updated!", { variant: "success" });
//       }

//     } catch (err) {
//       console.error("Update Order Error:", err);
//     }
//   };

//   // ✅ Handle discount input
//   const handleDiscountChange = (e) => {
//     const value = parseFloat(e.target.value) || 0;
//     if (value >= 0 && value <= 100) setDiscountPercentage(value);
//   };

//   const handlePrintButton = async () => {
//     // if (placedOrderData) {
//     //   // Note: storedTotal now correctly holds the total from the last order/update
//     //   const discountAmount = (storedTotal * discountPercentage) / 100;
//     //   const taxRate = 10;
//     //   const discountedTotal = storedTotal - discountAmount;
//     //   const calculatedTax = (discountedTotal * taxRate) / 100;
//     //   const totalWithTax = roundBhd(discountedTotal + calculatedTax);
//     if (placedOrderData) {
//       const taxRate = 10;
//       const discountAmount = roundTo3((storedTotal * discountPercentage) / 100);
//       const discountedTotal = roundTo3(storedTotal - discountAmount);
//       const calculatedTax = roundTo3((discountedTotal * taxRate) / 100); // ✅ Tax on discounted
//       const totalWithTax = roundBhd(discountedTotal + calculatedTax);


//       const updatedOrderInfo = {
//         ...placedOrderData,
//         bills: {
//           ...placedOrderData.bills,
//           total: storedTotal,
//           tax: calculatedTax,
//           totalWithTax,
//           discountPercentage,
//           discountAmount,
//         },
//       };

//       setOrderInfo(updatedOrderInfo);
//       setShowInvoice(true);

//       // 🖨️ Send to printer bridge
//       try {
//         const res = await sendToPrinters(updatedOrderInfo);
//         console.log("✅ Print sent:", res);
//         enqueueSnackbar("Receipt sent to printers!", { variant: "success" });
//       } catch (error) {
//         console.error("Print Error:", error);
//         enqueueSnackbar("Failed to send to printer bridge!", {
//           variant: "error",
//         });
//       }
//     } else {
//       enqueueSnackbar("Please place or update an order first!", {
//         variant: "warning",
//       });
//     }
//   };
//   return (
//     <>
//       <div className="flex items-center justify-between px-5 mt-2">
//         <p className="text-xs text-[#ababab] font-medium mt-2">
//           Items({cartData.length})
//         </p>
//         <h1 className="text-[#f5f5f5] text-md font-bold">
//           BHD {total.toFixed(3)}
//         </h1>
//       </div>
//       <div className="flex items-center justify-between px-5 mt-2">
//         <p className="text-xs text-[#ababab] font-medium mt-2">
//           Tax({paymentMethod === "Cash" ? "10%" : "10%"})
//         </p>
//         <h1 className="text-[#f5f5f5] text-md font-bold">
//           BHD {tax.toFixed(3)}
//         </h1>
//       </div>
//       <div className="flex items-center justify-between px-5 mt-2">
//         <p className="text-xs text-[#ababab] font-medium mt-2">Discount</p>
//         <div className="flex items-center gap-2">
//           <input
//             type="number"
//             value={discountPercentage}
//             onChange={handleDiscountChange}
//             className="text-[#f5f5f5] text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 w-20"
//           />
//         </div>
//       </div>
//       <div className="flex items-center justify-between px-5 mt-2">
//         <p className="text-xs text-[#ababab] font-medium mt-2">Total With Tax</p>
//         <h1 className="text-[#f5f5f5] text-md font-bold">
//           BHD {totalPriceWithTax.toFixed(3)}
//         </h1>
//       </div>

//       <div className="flex flex-col sm:flex-row items-center gap-3 px-5 mt-4 w-full">
//         <button
//           onClick={() => setPaymentMethod("Cash")}
//           className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Cash" ? "bg-[#383737] scale-105 shadow-md" : ""
//             }`}
//         >
//           Cash
//         </button>
//         <button
//           onClick={() => setPaymentMethod("Online")}
//           className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Online" ? "bg-[#383737] scale-105 shadow-md" : ""
//             }`}
//         >
//           Online
//         </button>
//         <button
//           onClick={() => setPaymentMethod("Benefit")}
//           className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Benefit"
//             ? "bg-[#383737] scale-105 shadow-md"
//             : ""
//             }`}
//         >
//           Benefit
//         </button>
//       </div>

//       <div className="flex items-center gap-3 px-5 mt-4">
//         <button
//           onClick={handlePrintButton}
//           className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg"
//         >
//           Print Receipt
//         </button>

//         {/* {customerData.orderType === "Delivery" && !isEditing ? (
//           // For NEW Delivery Orders - Show "Enter Delivery Details"
//           <button
//             onClick={() => setIsDeliveryModalOpen(true)}
//             disabled={cartData.length === 0}
//             className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Enter Delivery Details
//           </button>
//         ) : (
//           // For Dine-in, Takeaway, or EDITING existing orders
//           <button
//             onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
//             disabled={cartData.length === 0}
//             className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isEditing ? "Update Order" : "Place Order"}
//           </button>
//         )} */}


//         <button
//           onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
//           className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
//         >
//           {isEditing ? "Update Order" : "Place Order"}
//         </button>
//       </div>
//       {/* Separate Delivery Details Button - Shows only for Delivery orders */}
//       {customerData.orderType === "Delivery" && (
//         <div className="px-5 mt-3">
//           <button
//             onClick={() => setIsDeliveryModalOpen(true)}
//             className="bg-[#ff6b35] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg hover:bg-[#ff5520] transition-colors"
//           >
//             📍 Enter Delivery Details
//           </button>
//         </div>
//       )}

//       {showInvoice && (
//         <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
//       )}
//       {/* Delivery Modal */}
//       <DeliveryModal
//         isOpen={isDeliveryModalOpen}
//         onClose={() => setIsDeliveryModalOpen(false)}
//         onCreateDelivery={handleDeliveryOrder}
//         existingData={customerData} // ✅ Pass Redux data

//       />
//     </>
//   );
// };

// export default BillInfo;


import React, { useState, useEffect } from "react";
import { sendToPrinters } from "../../https/printBridge";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slice/cartSlice";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ ADD useQueryClient
import { addOrder, updateOrder, updateTable } from "../../https";
import { removeAllItems } from "../../redux/slice/cartSlice";
import { removeCustomer, confirmOrder, setCustomer } from "../../redux/slice/customerSlice";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import { roundBhd } from "../../utils";
import Invoice from "../invoice/Invoice";
import DeliveryModal from "../shared/DeliveryModal";
import { setDeliveryInfo } from "../../redux/slice/customerSlice";

const BillInfo = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // ✅ ADD THIS
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

  const roundTo3 = (num) => {
    const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
    return Math.round(n * 1000) / 1000;
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethod(method));
  };

  // ✅ Calculate total with tax
  useEffect(() => {
    const taxRate = 10;
    const calculatedTax = roundTo3((total * taxRate) / 100);
    const totalWithTax = roundTo3(total + calculatedTax);
    const discountAmount = roundTo3((totalWithTax * discountPercentage) / 100);
    const finalTotal = totalWithTax - discountAmount;
    setTax(calculatedTax);
    setTotalPriceWithTax(roundBhd(finalTotal));
  }, [total, paymentMethod, discountPercentage]);

  // ✅ Mutation for adding new order
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: async (resData) => {
      dispatch(removeAllItems());
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

      // ✅ Invalidate orders cache after adding new order
      await queryClient.invalidateQueries(["orders"]);

      enqueueSnackbar("Order Placed!", { variant: "success" });
    },
    onError: (error) => {
      console.error("Add Order Error:", error);
      enqueueSnackbar("Failed to place order!", { variant: "error" });
    },
  });

  // ✅ Mutation for table update
  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: async () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());

      // ✅ Invalidate tables cache
      await queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.error("Table Update Error:", error);
    },
  });

  // ✅ Mutation for order update - FIXED VERSION
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
    onSuccess: async (resData, variables) => {
      dispatch(removeAllItems());

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

      // ✅ CRITICAL FIX: Invalidate and refetch React Query cache
      try {
        await queryClient.invalidateQueries(["orders"]);
        await queryClient.refetchQueries(["orders"], { active: true });

        // Invalidate specific order if orderId exists
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
      console.error("Update order mutation error:", error);
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

  // ✅ Handle placing order
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
        setIsDeliveryModalOpen(true); // Open the delivery modal
        return;
      }
      if (!customerData.deliveryAddress || customerData.deliveryAddress.trim() === "") {
        enqueueSnackbar("Please enter delivery address!", { variant: "warning" });
        setIsDeliveryModalOpen(true); // Open the delivery modal
        return;
      }
      if (!customerData.customerName || customerData.customerName.trim() === "") {
        enqueueSnackbar("Please enter customer name!", { variant: "warning" });
        setIsDeliveryModalOpen(true); // Open the delivery modal
        return;
      }
    }


    setStoredTotal(total);

    const taxRate = 10;
    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const discountedTotal = roundTo3(total - discountAmount);
    const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
    const totalWithTax = roundBhd(discountedTotal + calculatedTax);

    const items = cartData.map((item) => ({
      orderNo: customerData.orderNo,
      menuItem: item.dishId || item.id,
      name: item.name,
      variationName: item.variationName || null,
      pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
      quantity: item.quantity,
      price: roundTo3(item.price),
      section: item.section || null,
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
        total: roundTo3(total),
        tax: roundTo3(calculatedTax),
        totalWithTax,
        discountPercentage: roundTo3(discountPercentage),
        discountAmount: roundTo3(discountAmount),
      },
      items,
      paymentMethod,
    };

    if (customerData.orderType === "Dine-in") {
      orderData.table = customerData.table.tableId;
      console.log("table id sent to backend:", customerData.table?.tableId);
    } else if (customerData.orderType === "Delivery") {
      orderData.deliveryAddress = customerData.deliveryAddress;
      orderData.deliveryBoyId = customerData.deliveryBoyId;
    }

    try {
      const response = await orderMutation.mutateAsync(orderData);
      dispatch(confirmOrder());
    } catch (error) {
      console.error("Order Placement Error:", error);
    }
  };

  // ✅ Handle updating existing order - FIXED VERSION
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

    if (oldItems.length === 0) {
      console.warn("⚠️ WARNING: oldItems is empty! Make sure 'items' is in Redux initialState");
    }

    if (oldItems.length === 0 && cartData.length > 0) {
      console.error("❌ CRITICAL: oldItems is EMPTY but cartData has items!");
      console.error("Check your setCustomer reducer to ensure it saves the 'items' field.");
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

    const taxRate = 10;
    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const discountedTotal = roundTo3(total - discountAmount);
    const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
    const totalWithTax = roundBhd(discountedTotal + calculatedTax);

    const updateData = {
      orderNo: currentOrderNo,
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
        orderType: customerData.orderType,
      },
      bills: {
        total: roundTo3(total),
        tax: calculatedTax,
        totalWithTax,
        discountPercentage: roundTo3(discountPercentage),
        discountAmount: roundTo3(discountAmount),
      },
      items: mergedItems,
      paymentMethod,
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
      // const response = await updateOrderMutation.mutateAsync({
      //   orderId: customerData.orderId,
      //   updateData,
      // });

      // // ✅ Update Redux with backend response
      // const updatedOrder = response?.data?.data || response?.data;

      // if (updatedOrder && updatedOrder.items) {
      //   dispatch(setCustomer({
      //     ...customerData,
      //     items: updatedOrder.items,
      //   }));
      //   console.log("✅ Redux state synced with backend items:", updatedOrder.items);
      // } else {
      //   dispatch(setCustomer({
      //     ...customerData,
      //     items: mergedItems,
      //   }));
      //   console.log("✅ Redux state updated with merged items:", mergedItems);
      // }
      const response = await updateOrderMutation.mutateAsync({
        orderId: customerData.orderId,
        updateData,
      });

      // ✅ Update Redux with backend response
      const updatedOrder = response?.data?.data || response?.data;

      // ✅ CRITICAL FIX: Update placedOrderData for printing
      const tableDataForReceipt = customerData.table
        ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
        : updatedOrder?.table;

      const updatedOrderDataForReceipt = {
        ...(updatedOrder || updateData),
        table: tableDataForReceipt,
        _id: customerData.orderId,
        orderId: customerData.orderId,
      };

      setPlacedOrderData(updatedOrderDataForReceipt); // ✅ THIS WAS MISSING!
      setStoredTotal(total); // ✅ Update stored total for printing

      if (updatedOrder && updatedOrder.items) {
        dispatch(setCustomer({
          ...customerData,
          items: updatedOrder.items,
        }));
        console.log("✅ Redux state synced with backend items:", updatedOrder.items);
      } else {
        dispatch(setCustomer({
          ...customerData,
          items: mergedItems,
        }));
        console.log("✅ Redux state updated with merged items:", mergedItems);
      }

      if (hasChanges) {
        enqueueSnackbar("Order updated with new items!", { variant: "success" });
      } else {
        enqueueSnackbar("Order updated!", { variant: "success" });
      }
    } catch (err) {
      console.error("Update Order Error:", err);
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to update order!",
        { variant: "error" }
      );
    }
  };

  // ✅ Handle discount input
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) setDiscountPercentage(value);
  };

  const handlePrintButton = async () => {
    if (placedOrderData) {
      const taxRate = 10;
      const discountAmount = roundTo3((storedTotal * discountPercentage) / 100);
      const discountedTotal = roundTo3(storedTotal - discountAmount);
      const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
      const totalWithTax = roundBhd(discountedTotal + calculatedTax);

      const updatedOrderInfo = {
        ...placedOrderData,
        bills: {
          ...placedOrderData.bills,
          total: storedTotal,
          tax: calculatedTax,
          totalWithTax,
          discountPercentage,
          discountAmount,
        },
      };

      setOrderInfo(updatedOrderInfo);
      setShowInvoice(true);

      try {
        const res = await sendToPrinters(updatedOrderInfo);
        console.log("✅ Print sent:", res);
        enqueueSnackbar("Receipt sent to printers!", { variant: "success" });
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
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Items({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          BHD {total.toFixed(3)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Tax({paymentMethod === "Cash" ? "10%" : "10%"})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          BHD {tax.toFixed(3)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Discount</p>
        <div className="flex items-center gap-2">
          {/* <input
            type="number"
            value={discountPercentage}
            onChange={handleDiscountChange}
            className="text-[#f5f5f5] text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 w-20"
          /> */}
          <input
            type="number"
            value={discountPercentage > 0 ? discountPercentage : ""}
            onChange={handleDiscountChange}
            placeholder="0" // Set placeholder to indicate the expected input
            className="text-[#f5f5f5] text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 w-20 text-center"
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Total With Tax</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          BHD {totalPriceWithTax.toFixed(3)}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 px-5 mt-4 w-full">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Cash" ? "bg-[#383737] scale-105 shadow-md" : ""
            }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Online" ? "bg-[#383737] scale-105 shadow-md" : ""
            }`}
        >
          Online
        </button>
        <button
          onClick={() => setPaymentMethod("Benefit")}
          className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Benefit" ? "bg-[#383737] scale-105 shadow-md" : ""
            }`}
        >
          Benefit
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePrintButton}
          className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg"
        >
          Print Receipt
        </button>

        <button
          onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
          disabled={cartData.length === 0}
          className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? "Update Order" : "Place Order"}
        </button>
      </div>

      {customerData.orderType === "Delivery" && (
        <div className="px-5 mt-3">
          <button
            onClick={() => setIsDeliveryModalOpen(true)}
            className="bg-[#ff6b35] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg hover:bg-[#ff5520] transition-colors"
          >
            📍 Enter Delivery Details
          </button>
        </div>
      )}

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onCreateDelivery={handleDeliveryOrder}
        existingData={customerData}
      />
    </>
  );
};

export default BillInfo;