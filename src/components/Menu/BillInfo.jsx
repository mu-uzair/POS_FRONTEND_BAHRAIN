

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalPrice } from '../../redux/slice/cartSlice';
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { addOrder, updateOrder, updateTable } from '../../https';
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
            taxRate = 15;
        } else if (paymentMethod === 'Online') {
            taxRate = 8;
        } else {
            taxRate = 0;
        }

        const discountAmount = (total * discountPercentage) / 100;
        const discountedTotal = total - discountAmount;
        const calculatedTax = (discountedTotal * taxRate) / 100;
        const totalWithTax = discountedTotal + calculatedTax;

        console.log('Calculated Tax:', calculatedTax, 'Total With Tax:', totalWithTax);

        setTax(calculatedTax);
        setTotalPriceWithTax(totalWithTax);
    }, [total, paymentMethod, discountPercentage]);







    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            enqueueSnackbar('Please select payment method!', { variant: 'warning' });
            return;
        }

        if (customerData.orderType === 'Dine-in' && !customerData.table) {
            enqueueSnackbar('Please select a table!', { variant: 'warning' });
            return;
        }

        if (cartData.length === 0) {
            enqueueSnackbar('Please add items to the cart!', { variant: 'warning' });
            return;
        }

        // Store the total value before emptying the cart
        setStoredTotal(total);

        // Calculate discount amount
        const discountAmount = (total * discountPercentage) / 100;

        // Calculate tax and total with tax
        let taxRate;
        if (paymentMethod === 'Cash') {
            taxRate = 15;
        } else if (paymentMethod === 'Online') {
            taxRate = 8;
        } else {
            taxRate = 0;
        }
        const discountedTotal = total - discountAmount;
        const calculatedTax = (discountedTotal * taxRate) / 100;
        const totalWithTax = discountedTotal + calculatedTax;

        const orderData = {
            orderId: { orderId: customerData.orderId },
            customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
                orderType: customerData.orderType,
            },
            orderStatus: 'In Progress',
            bills: {
                total: total,
                tax: calculatedTax,
                totalWithTax: totalWithTax,
                discountPercentage: discountPercentage,
                discountAmount: discountAmount,
            },
            items: cartData,
            paymentMethod: paymentMethod,
        };

        if (customerData.orderType === 'Dine-in') {
            orderData.table = customerData.table.tableId;
        }

        console.log('Order Data:', orderData);

        try {
            await orderMutation.mutateAsync(orderData);

            if (customerData.orderType === 'Dine-in') {
                await updateTableStatus(customerData.table.tableId, 'Booked');
                enqueueSnackbar('Order placed successfully and table status updated!', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    // const handleUpdateOrder = async () => {
    //     try {
    //         // Calculate values
    //         const discountAmount = (total * discountPercentage) / 100;
    //         const taxRate = paymentMethod === 'Cash' ? 15 : 8;
    //         const discountedTotal = total - discountAmount;
    //         const calculatedTax = (discountedTotal * taxRate) / 100;
    //         const totalWithTax = discountedTotal + calculatedTax;

    //         // Prepare items - ensure proper ID format
    //         const items = cartData.map(item => ({
    //             menuItem: item.id, // or new mongoose.Types.ObjectId(item.id) if needed
    //             name: item.name,
    //             price: item.price,
    //             quantity: item.quantity
    //         }));

    //         // Build update payload
    //         const updateData = {
    //             customerDetails: {
    //                 name: customerData.customerName || "Walk-In Customer",
    //                 phone: customerData.customerPhone || "N/A",
    //                 guests: customerData.guests || "0",
    //                 orderType: customerData.orderType || "Take Away"
    //             },
    //             items,
    //             bills: {
    //                 total: total,
    //                 tax: calculatedTax,
    //                 totalWithTax: totalWithTax,
    //                 discountPercentage: discountPercentage,
    //                 discountAmount: discountAmount
    //             },
    //             paymentMethod: paymentMethod,
    //             orderStatus: 'In Progress'
    //         };

    //         // Add table reference if exists
    //         if (customerData.table?.tableId) {
    //             updateData.table = customerData.table.tableId;
    //         }

    //         console.log('Final update payload:', JSON.stringify(updateData, null, 2));

    //         // Execute update
    //         const response = await updateOrderMutation.mutateAsync({
    //             orderId: customerData.orderId,
    //             updateData
    //         });

    //         enqueueSnackbar('Order updated successfully!', { variant: 'success' });
    //         dispatch(isEditing(false));

    //     } catch (error) {
    //         console.error('Detailed update error:', {
    //             message: error.message,
    //             responseData: error.response?.data,
    //             config: error.config,
    //             stack: error.stack
    //         });

    //         enqueueSnackbar(
    //             error.response?.data?.message || 'Failed to update order',
    //             { variant: 'error' }
    //         );
    //     }

        
    // };

    const handleUpdateOrder = async () => {
        try {
            const discountAmount = (total * discountPercentage) / 100;
            const taxRate = paymentMethod === 'Cash' ? 15 : 8;
            const discountedTotal = total - discountAmount;
            const calculatedTax = (discountedTotal * taxRate) / 100;
            const totalWithTax = discountedTotal + calculatedTax;
    
            const items = cartData.map(item => ({
                menuItem: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));
    
            const updateData = {
                customerDetails: {
                    name: customerData.customerName || "Walk-In Customer",
                    phone: customerData.customerPhone || "N/A",
                    guests: customerData.guests || "0",
                    orderType: customerData.orderType || "Take Away"
                },
                items,
                bills: {
                    total: total,
                    tax: calculatedTax,
                    totalWithTax: totalWithTax,
                    discountPercentage: discountPercentage,
                    discountAmount: discountAmount
                },
                paymentMethod: paymentMethod,
                orderStatus: 'In Progress'
            };
    
            if (customerData.table?.tableId) {
                updateData.table = customerData.table.tableId;
            }
    
            const response = await updateOrderMutation.mutateAsync({
                orderId: customerData.orderId,
                updateData
            });
    
            // 🔥 Store updated data for printing
            setStoredTotal(total); // so tax and discount can be re-calculated during print
            setPlacedOrderData({ _id: customerData.orderId, ...updateData });
    
            enqueueSnackbar('Order updated successfully!', { variant: 'success' });
            dispatch(isEditing(false));
    
        } catch (error) {
            console.error('Detailed update error:', {
                message: error.message,
                responseData: error.response?.data,
                config: error.config,
                stack: error.stack
            });
    
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to update order',
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
                taxRate = 15;
            } else if (paymentMethod === 'Online') {
                taxRate = 8;
            } else {
                taxRate = 0;
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
                <h1 className="text-[#f5f5f5] text-md font-bold">Rs {total.toFixed(2)}</h1>
            </div>
            <div className="flex items-center justify-between px-5 mt-2">
                <p className="text-xs text-[#ababab] font-medium mt-2">Tax({paymentMethod === 'Cash' ? '15%' : '8%'})</p>
                <h1 className="text-[#f5f5f5] text-md font-bold">Rs {tax.toFixed(2)}</h1>
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
                <h1 className="text-[#f5f5f5] text-md font-bold">Rs {totalPriceWithTax.toFixed(2)}</h1>
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

            <div className="flex items-center gap-3 px-5 mt-4">
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

