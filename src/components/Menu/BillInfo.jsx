import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPrice } from '../../redux/slice/cartSlice';
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { addOrder, updateOrder, updateTable, getOrderById } from '../../https';
import { removeAllItems } from '../../redux/slice/cartSlice';
import { removeCustomer } from '../../redux/slice/customerSlice';
import { setEditingMode } from '../../redux/slice/editOrderSlice';
import Invoice from "../invoice/Invoice";



const BillInfo = () => {

    const isEditing = useSelector((state) => state.editOrder.isEditing);

    const dispatch = useDispatch();
    const customerData = useSelector((state) => state.customer);
    const cartData = useSelector((state) => state.cart);
    const total = useSelector(getTotalPrice);

    // Get paymentMethod from Redux instead of local state
    const [paymentMethod, setPaymentMethod] = useState(customerData.paymentMethod || 'Cash');
    const [tax, setTax] = useState(0);
    const [totalPriceWithTax, setTotalPriceWithTax] = useState(0);
    const [showInvoice, setShowInvoice] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [placedOrderData, setPlacedOrderData] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [storedTotal, setStoredTotal] = useState(0);

    // ✅ Round to 3 decimals consistently
    const roundTo3 = (num) => {
        const n = typeof num === "string" ? parseFloat(num) : Number(num || 0);
        return Math.round(n * 1000) / 1000;
    };


    // Add this function to update payment method in Redux
    const handlePaymentMethodChange = (method) => {
        dispatch(setPaymentMethod(method));
    };

    useEffect(() => {
        console.log('useEffect triggered. Total:', total,
            'Payment Method:', paymentMethod,
            'Discount Percentage:', discountPercentage);

        let taxRate;
        if (paymentMethod === 'Cash') {
            taxRate = 10;
        } else if (paymentMethod === 'Online' || paymentMethod === 'Benefit') {
            taxRate = 10;
        } else {
            taxRate = 10;
        }

        const discountAmount = (total * discountPercentage) / 100;
        const discountedTotal = total - discountAmount;
        const calculatedTax = (discountedTotal * taxRate) / 100;
        const totalWithTax = discountedTotal + calculatedTax;

        console.log('Calculated Tax:', calculatedTax, 'Total With Tax:', totalWithTax);

        setTax(calculatedTax);
        setTotalPriceWithTax(totalWithTax);
    }, [total, paymentMethod, discountPercentage]);






    // checking why order is not placing 

    const handlePlaceOrder = async () => {
        console.log('Customer Data:', customerData);
        // --- General Validation Checks ---
        if (!paymentMethod) {
            enqueueSnackbar('Please select payment method!', { variant: 'warning' });
            return;
        }

        if (customerData.orderType === 'Dine-in' && !customerData.table) {
            enqueueSnackbar('Please select a table!', { variant: 'warning' });
            return;
        }

        // --- DELIVERY VALIDATION (Uses fields from updated customerData) ---
        if (customerData.orderType === 'Delivery') {
            if (!customerData.deliveryAddress || customerData.deliveryAddress.trim() === '') {
                enqueueSnackbar('Delivery address is required!', { variant: 'warning' });
                return;
            }
            // This checks if the delivery boy has been assigned (null is the default state)
            if (!customerData.deliveryBoyId) {
                enqueueSnackbar('A delivery boy must be assigned!', { variant: 'warning' });
                return;
            }
            // Ensure customer phone is present for delivery
            if (!customerData.customerPhone || customerData.customerPhone.trim() === '') {
                enqueueSnackbar('Customer phone number is required for delivery!', { variant: 'warning' });
                return;
            }
        }
        // --- END DELIVERY VALIDATION ---

        if (cartData.length === 0) {
            enqueueSnackbar('Please add items to the cart!', { variant: 'warning' });
            return;
        }

        // Store total before clearing the cart
        setStoredTotal(total);

        // Calculate discount and tax
        const discountAmount = roundTo3((total * discountPercentage) / 100);
        let taxRate;
        if (paymentMethod === 'Cash') taxRate = 10;
        else if (paymentMethod === 'Online' || paymentMethod === 'Benefit') taxRate = 10;
        else taxRate = 0;

        const discountedTotal = roundTo3(total - discountAmount);
        const calculatedTax = roundTo3((discountedTotal * taxRate) / 100);
        const totalWithTax = roundTo3(discountedTotal + calculatedTax);
        // ✅ Map items to include section
        const items = cartData.map(item => ({
            menuItem: item.dishId || item.id,
            name: item.name,
            variationName: item.variationName || null, // ✅ added
            pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
            quantity: item.quantity,
            price: roundTo3(item.price),
            section: item.section || null, // ✅ added safely
        }));

        // Base Order Data Payload
        const orderData = {
            // orderId: { orderId: customerData.orderId },
            orderId: customerData.orderId,
            customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
                orderType: customerData.orderType,
            },
            orderStatus: 'In Progress',
            bills: {
                total: roundTo3(total),
                tax: roundTo3(calculatedTax),
                totalWithTax: roundTo3(totalWithTax),
                discountPercentage: roundTo3(discountPercentage),
                discountAmount: roundTo3(discountAmount),
            },
            items, // ✅ include mapped items with section
            paymentMethod: paymentMethod,
        };

        // --- CONDITIONAL FIELD ADDITION ---
        if (customerData.orderType === 'Dine-in') {
            orderData.table = customerData.table.tableId;
        }
        // ADDING REQUIRED DELIVERY FIELDS FROM REDUX STATE
        else if (customerData.orderType === 'Delivery') {
            orderData.deliveryAddress = customerData.deliveryAddress;
            orderData.deliveryBoyId = customerData.deliveryBoyId;
        }
        // --- END CONDITIONAL FIELD ADDITION ---

        console.log('Order Data:', orderData);

        try {
            await orderMutation.mutateAsync(orderData);

            if (customerData.orderType === 'Dine-in') {
                await updateTable(customerData.table, 'Booked');
                enqueueSnackbar('Order placed successfully and table status updated!', { variant: 'success' });
            } else if (customerData.orderType === 'Delivery') {
                enqueueSnackbar('Delivery order placed successfully!', { variant: 'success' });
            } else {
                // Fallback success message for Pickup or other types
                enqueueSnackbar('Order placed successfully!', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error placing order:', error);

            // --- IMPROVED ERROR HANDLING ---
            if (typeof axios !== 'undefined' && axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || error.response.statusText || 'Server validation failed.';
                enqueueSnackbar(`Failed to place order: ${errorMessage}`, { variant: 'error' });
                console.error("Server Response Details:", error.response.data);
            } else {
                enqueueSnackbar(`Failed to place order: ${error.message}`, { variant: 'error' });
            }
            // --- END IMPROVED ERROR HANDLING ---
        }
    };





    const handleUpdateOrder = async () => {


        // --- General Validation Checks ---
        if (!paymentMethod) {
            enqueueSnackbar('Please select payment method!', { variant: 'warning' });
            return;
        }

        //   if (customerData.orderType === 'Dine-in' && !customerData.table) {
        //     enqueueSnackbar('Please select a table!', { variant: 'warning' });
        //     return;
        //   }

        // --- DELIVERY VALIDATION ---
        if (customerData.orderType === 'Delivery') {
            if (!customerData.deliveryAddress || customerData.deliveryAddress.trim() === '') {
                enqueueSnackbar('Delivery address is required!', { variant: 'warning' });
                return;
            }
            if (!customerData.deliveryBoyId) {
                enqueueSnackbar('A delivery boy must be assigned!', { variant: 'warning' });
                return;
            }
            if (!customerData.customerPhone || customerData.customerPhone.trim() === '') {
                enqueueSnackbar('Customer phone number is required for delivery!', { variant: 'warning' });
                return;
            }
        }

        // --- Cart Validation ---
        if (cartData.length === 0) {
            enqueueSnackbar('Please add items to the cart!', { variant: 'warning' });
            return;
        }

        // --- Billing Calculations ---
        const discountAmount = roundTo3((total * discountPercentage) / 100);
        const taxRate =
            paymentMethod === 'Cash' ? 10 :
                (paymentMethod === 'Online' || paymentMethod === 'Benefit' ? 10 : 10);

        const discountedTotal = roundTo3(total - discountAmount);
        const calculatedTax =  roundTo3((discountedTotal * taxRate) / 100);
        const totalWithTax = roundTo3(discountedTotal + calculatedTax);
        

        // --- Map Items ---
        const items = cartData.map(item => ({
            menuItem: item.dishId || item.id || item._id || item.menuItem,
            name: item.name || item.dishName,
            variationName: item.variationName || null, // ✅ added
            pricePerQuantity: roundTo3(item.pricePerQuantity || item.price),
            quantity: item.quantity,
            price: roundTo3(item.price),
            section: item.section || null,
        }));

        // --- Construct Update Payload ---
        const updateData = {
            customerDetails: {
                name: customerData.customerName || "Walk-In Customer",
                phone: customerData.customerPhone || "N/A",
                guests: customerData.guests || 0,
                orderType: customerData.orderType || "Take Away",
            },
            bills: {
                total: roundTo3(total),
                tax: roundTo3(calculatedTax),
                totalWithTax: roundTo3(totalWithTax),
                discountPercentage: roundTo3(discountPercentage),
                discountAmount: roundTo3(discountAmount),
            },
            items,
            paymentMethod,
            orderStatus: 'In Progress',
        };

        // --- Attach Conditional Fields ---
        if (customerData.orderType === 'Dine-in' && customerData.table?.tableId) {
            updateData.table = customerData.table.tableId;
        } else if (customerData.orderType === 'Delivery') {
            updateData.deliveryAddress = customerData.deliveryAddress;
            updateData.deliveryBoyId = customerData.deliveryBoyId;
        }

        console.log("Final Update Data:", updateData);

        try {
            await updateOrderMutation.mutateAsync({
                orderId: customerData.orderId,
                updateData,
            });

            // ✅ Preserve data for print or further actions
            setStoredTotal(total);
            setPlacedOrderData({ _id: customerData.orderId, ...updateData });

            enqueueSnackbar('Order updated successfully!', { variant: 'success' });
            dispatch(setEditingMode(false));
        } catch (error) {
            console.error('Detailed update error:', {
                message: error.message,
                responseData: error.response?.data,
                config: error.config,
                stack: error.stack,
            });

            enqueueSnackbar(
                error.response?.data?.message || 'Failed to update order.',
                { variant: 'error' }
            );
        }
    };



    // Update mutation
    const updateOrderMutation = useMutation({
        mutationFn: ({ orderId, updateData }) => updateOrder(orderId, updateData),
        onSuccess: (data) => {
            // Handle success (if you need to update local state)
            console.log('Updated order data:', data);
            dispatch(removeAllItems());
            dispatch(removeCustomer());
        },
        onError: (error) => {
            console.error('Update mutation error:', error);
        }
    });


    const orderMutation = useMutation({
        mutationFn: (reqData) => addOrder(reqData),
        onSuccess: (resData) => {
            dispatch(removeAllItems());

            const { data } = resData.data;
            console.log('Order data from API:', data);

            setPlacedOrderData(data);
            const tableData = {
                tableId: data.table,
                status: 'Booked',
                orderId: data._id,
            };
            console.log('Table Data:', tableData);

            setTimeout(() => {
                tableUpdateMutation.mutate(tableData);
            }, 1500);

            enqueueSnackbar('Order Placed!', {
                variant: 'success',
            });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const tableUpdateMutation = useMutation({
        mutationFn: (reqData) => updateTable(reqData),
        onSuccess: (resData) => {
            dispatch(removeCustomer());
            dispatch(removeAllItems());
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const handleDiscountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        if (value >= 0 && value <= 100) {
            setDiscountPercentage(value);
        }
    };

    const handlePrintButton = () => {
        if (placedOrderData) {
            // Calculate discount amount using storedTotal
            const discountAmount = (storedTotal * discountPercentage) / 100;

            // Calculate tax and total with tax
            let taxRate;
            if (paymentMethod === 'Cash') {
                taxRate = 10;
            } else if (paymentMethod === 'Online' || paymentMethod === 'Benefit') {
                taxRate = 10;
            } else {
                taxRate = 10;
            }
            const discountedTotal = storedTotal - discountAmount;
            const calculatedTax = (discountedTotal * taxRate) / 100;
            const totalWithTax = discountedTotal + calculatedTax;

            // Update orderInfo with discount details
            const updatedOrderInfo = {
                ...placedOrderData,
                bills: {
                    ...placedOrderData.bills,
                    total: storedTotal,
                    tax: calculatedTax,
                    totalWithTax: totalWithTax,
                    discountPercentage: discountPercentage,
                    discountAmount: discountAmount,
                },
            };

            console.log('Updated Order Info:', updatedOrderInfo);

            setOrderInfo(updatedOrderInfo);

            setShowInvoice(true);
        } else {
            enqueueSnackbar('Please place an order first!', { variant: 'warning' });
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-5 mt-2">
                <p className="text-xs text-[#ababab] font-medium mt-2">Items({cartData.length})</p>
                <h1 className="text-[#f5f5f5] text-md font-bold">BHD {total.toFixed(3)}</h1>
            </div>
            <div className="flex items-center justify-between px-5 mt-2">
                <p className="text-xs text-[#ababab] font-medium mt-2">Tax({paymentMethod === 'Cash' ? '10%' : '10%'})</p>
                <h1 className="text-[#f5f5f5] text-md font-bold">BHD {tax.toFixed(3)}</h1>
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
                <h1 className="text-[#f5f5f5] text-md font-bold">BHD {totalPriceWithTax.toFixed(3)}</h1>
            </div>

            {/* <div className="flex items-center gap-3 px-5 mt-4">
                <button
                    onClick={() => setPaymentMethod('Cash')}
                    className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === 'Cash' ? 'bg-[#383737]' : ''
                        }`}
                >
                    Cash
                </button>
                <button
                    onClick={() => setPaymentMethod('Online')}
                    className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === 'Online' ? 'bg-[#383737]' : ''
                        }`}
                >
                    Online
                </button>
            </div> */}

            <div className="flex flex-col sm:flex-row items-center gap-3 px-5 mt-4 w-full">
                <button
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === 'Cash' ? 'bg-[#383737] scale-105 shadow-md' : ''}`}
                >
                    Cash
                </button>
                <button
                    onClick={() => setPaymentMethod('Online')}
                    className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === 'Online' ? 'bg-[#383737] scale-105 shadow-md' : ''}`}
                >
                    Online
                </button>
                <button
                    onClick={() => setPaymentMethod('Benefit')}
                    className={`flex-1 bg-[#1f1f1f] px-4 py-3 rounded-lg text-[#ababab] font-semibold transition-colors duration-150 ${paymentMethod === 'Benefit' ? 'bg-[#383737] scale-105 shadow-md' : ''}`}
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
                {/* <button
                    onClick={handlePlaceOrder}
                    className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
                >
                    Place Order
                </button> */}

                <button
                    onClick={isEditing ? handleUpdateOrder : handlePlaceOrder}
                    className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg"
                >
                    {isEditing ? 'Update Order' : 'Place Order'}
                </button>

            </div>
            {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}
        </>
    );
};

export default BillInfo;

