import React, { useState, useEffect } from "react";
import { sendToPrinters } from "../../https/printBridge";

import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slice/cartSlice";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { addOrder, updateOrder, updateTable } from "../../https";
import { removeAllItems } from "../../redux/slice/cartSlice";
import { removeCustomer,confirmOrder } from "../../redux/slice/customerSlice";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import { roundBhd } from "../../utils";
import Invoice from "../invoice/Invoice";

const BillInfo = () => {
  const dispatch = useDispatch();
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

  const roundTo3 = (num) => {
    const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
    return Math.round(n * 1000) / 1000;
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethod(method));
  };

  // ✅ Calculate total with tax (auto BHD rounded)
  useEffect(() => {
    let taxRate = 10;
    const discountAmount = (total * discountPercentage) / 100;
    const discountedTotal = total - discountAmount;
    const calculatedTax = (total * taxRate) / 100;
    const totalWithTax = discountedTotal + calculatedTax;
    setTax(calculatedTax);
    setTotalPriceWithTax(roundBhd(totalWithTax));
  }, [total, paymentMethod, discountPercentage]);

  // ✅ Mutation for adding new order
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      dispatch(removeAllItems());
      const { data } = resData.data;



      // Manually construct the table object for the receipt
      const tableDataForReceipt = customerData.table 
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : data.table; // Fallback

          const orderDataForReceipt = {
          ...data,
          // Replace the simple ID with the full table object for the receipt to use
          table: tableDataForReceipt, 
      };



      // setPlacedOrderData(data);
      setPlacedOrderData(orderDataForReceipt);
      console.log("Placed Order Data:", orderDataForReceipt);

      const tableData = {
        tableId: data.table,
        status: "Booked",
        orderId: data._id,
      };

      setTimeout(() => tableUpdateMutation.mutate(tableData), 1500);
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
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.error("Table Update Error:", error);
    },
  });

  // ✅ Mutation for order update (fixed)
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
    onSuccess: (resData) => {
      // NOTE: storedTotal is already set in handleUpdateOrder before mutation
    //   dispatch(removeAllItems());
    //   enqueueSnackbar("Order updated successfully!", { variant: "success" });

    //   // ✅ Fix: store updated order so print receipt works too
    //   if (resData?.data?.data) {
    //     setPlacedOrderData(resData.data.data);
    //   } else {
    //     // Fallback: use local data if backend doesn’t return updated order
    //     setPlacedOrderData((prev) => ({
    //       ...prev,
    //       ...updateData,
    //     }));
    //   }
    // },
    dispatch(removeAllItems());
      enqueueSnackbar("Order updated successfully!", { variant: "success" });

      // Get the updated data from the server response
      const serverData = resData?.data?.data || {}; 

      // 1. Get the necessary table data from the current Redux state (which is correct now)
      const tableDataForReceipt = customerData.table 
          ? { _id: customerData.table.tableId, tableNo: customerData.table.tableNo }
          : serverData.table; // Fallback to server data if customerData is missing (e.g., Take Away)

      // 2. Construct the final data object for the receipt state
      let updatedOrderDataForReceipt = { // 🛑 FIX: Changed declaration from 'const' to 'let'
        ...serverData,
        // If the server response didn't include the table, ensure we add it from Redux state
        table: tableDataForReceipt, 
      };
      
      // Fallback if the backend returns nothing (less likely now)
      if (!resData?.data?.data) {
        // This assignment is now valid because updatedOrderDataForReceipt is declared with 'let'
        updatedOrderDataForReceipt = { 
          ...placedOrderData, 
          ...updateData, 
          table: tableDataForReceipt, 
        };
      }

      setPlacedOrderData(updatedOrderDataForReceipt);
      
      // You might want to remove this if you only want to clear state on final payment
      // dispatch(removeCustomer());
    },
    onError: (error) => {
      enqueueSnackbar("Failed to update order.", { variant: "error" });
    },
  });

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

    setStoredTotal(total); // <-- Correctly saves the current total

    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const taxRate = 10;
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
      // orderData.table = customerData.table?.tableNo;
      console.log("table id sent to backend:", customerData.table?.tableId);
      // console.log("table no in orderData:", customerData.table?.tableNo);
    } else if (customerData.orderType === "Delivery") {
      orderData.deliveryAddress = customerData.deliveryAddress;
      orderData.deliveryBoyId = customerData.deliveryBoyId;
    }

    try {
      // await orderMutation.mutateAsync(orderData);
       // ✅ Wait for the order to be successfully placed
    const response = await orderMutation.mutateAsync(orderData);
    
    // ✅ Only increment counter AFTER successful order placement
    dispatch(confirmOrder());
    //  dispatch(removeCustomer());
    } catch (error) {
      console.error("Order Placement Error:", error);
    }
  };

  // ✅ Handle updating existing order
  const handleUpdateOrder = async () => {
    if (cartData.length === 0) {
      enqueueSnackbar("Please add items to the cart!", { variant: "warning" });
      return;
    }

    // 🛑 FIX HERE: Update storedTotal with the current Redux total
    // This ensures the print button uses the new total after the update.
    setStoredTotal(total);

    const discountAmount = roundTo3((total * discountPercentage) / 100);
    const taxRate = 10;
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

    const updateData = {
      customerDetails: {
        name: customerData.customerName || "Walk-In Customer",
        phone: customerData.customerPhone || "N/A",
        guests: customerData.guests || 0,
        orderType: customerData.orderType || "Take Away",
      },
      bills: {
        total: roundTo3(total), // This 'total' is the correct current cart total
        tax: roundTo3(calculatedTax),
        totalWithTax,
        discountPercentage: roundTo3(discountPercentage),
        discountAmount: roundTo3(discountAmount),
      },
      items,
      paymentMethod,
      orderStatus: "In Progress",
    };

    if (customerData.orderType === "Dine-in" && customerData.table?.tableId) {
      updateData.table = customerData.table.tableId;
    } else if (customerData.orderType === "Delivery") {
      updateData.deliveryAddress = customerData.deliveryAddress;
      updateData.deliveryBoyId = customerData.deliveryBoyId;
    }

    await updateOrderMutation.mutateAsync({
      orderId: customerData.orderId,
      updateData,
    });
  };

  // ✅ Handle discount input
  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value >= 0 && value <= 100) setDiscountPercentage(value);
  };

  const handlePrintButton = async () => {
    if (placedOrderData) {
      // Note: storedTotal now correctly holds the total from the last order/update
      const discountAmount = (storedTotal * discountPercentage) / 100;
      const taxRate = 10;
      const discountedTotal = storedTotal - discountAmount;
      const calculatedTax = (discountedTotal * taxRate) / 100;
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

      // 🖨️ Send to printer bridge
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
          <input
            type="number"
            value={discountPercentage}
            onChange={handleDiscountChange}
            className="text-[#f5f5f5] text-md font-bold bg-transparent border border-[#555] rounded-lg px-2 py-1 w-20"
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
          className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === "Benefit"
              ? "bg-[#383737] scale-105 shadow-md"
              : ""
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
          className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
        >
          {isEditing ? "Update Order" : "Place Order"}
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default BillInfo;
