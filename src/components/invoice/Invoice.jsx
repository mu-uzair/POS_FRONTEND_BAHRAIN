import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

const Receipt = ({ orderInfo, setShowInvoice }) => {
    const receiptRef = useRef(null);
    const kitchenReceiptRef = useRef(null); // Ref for kitchen receipt
    const customerData = useSelector(state => state.customer);
    const user = useSelector(state => state.user);
    const [activeReceipt, setActiveReceipt] = useState("sales"); // State to control which receipt is visible

    // Get order date and time and format it
    // const orderDateTime = new Date(orderInfo?.createdAt);
    // const formattedOrderDateTime = orderDateTime.toLocaleString();
    const orderDateTime = new Date(orderInfo?.createdAt || orderInfo?.updatedAt || Date.now());
const formattedOrderDateTime = orderDateTime.toLocaleString();


    // Determine sales tax percentage based on payment method
    const salesTaxPercentage = orderInfo?.paymentMethod === "Cash" ? 15 : 8;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-2">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
                {/* Sales Receipt */}
                <div
                    ref={receiptRef}
                    className="text-sm"
                    style={{ display: activeReceipt === "sales" ? "block" : "none" }} // Show/hide based on activeReceipt
                >
                    <div className="text-center mb-2 receipt-header">
                        <img
                            src={logo}
                            alt="restaurant logo"
                            className="mx-auto w-24 h-auto object-contain mb-3 logo-print"
                        />
                        <h2 className="text-xl font-bold">Savoury Bites</h2>
                        <p>Address: Shop no.2 plot no.19-C, Rahat Commercial Lane-3 Phase VI, D.H.A, Karachi</p>
                        <p>Telp. +92 337 8018705</p>
                        <div className="text-left mt-2">
                            <p>
                                <strong>Payment Method:</strong> {orderInfo?.paymentMethod}
                            </p>
                            <p>
                                <strong>Order Type:</strong> {orderInfo?.customerDetails?.orderType}
                            </p>
                            <p className="text-xs font-medium mt-1">
                                Invoice No: #{customerData.orderId || "N/A"}
                            </p>
                            <p className="text-xs font-medium mt-1">    
                                Order Date: {formattedOrderDateTime}
                            </p>
                            {user && <p className="text-xs font-medium mt-1">User: {user.role} </p>}
                        </div>
                    </div>

                    <div className="text-center my-2">
                        <p>----------------------------------</p>
                        <p className="font-bold">SALE RECEIPT</p>
                        <p>----------------------------------</p>
                    </div>

                    <div className="flex justify-between mb-2 border">
                        <p className="font-bold">Description</p>
                        <p className="font-bold">Price</p>
                    </div>

                    <div className="mb-2">
                        {orderInfo?.items?.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <p>
                                    {item.quantity} x {item.name}
                                </p>
                                <p>Rs{item.price?.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center my-2">
                        <p>----------------------------------</p>
                    </div>

                    <div className="flex justify-between mb-2">
                        <p className="font-bold">Subtotal</p>
                        <p className="font-bold">{orderInfo?.bills?.total?.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between mb-2">
                        <p className="font-bold">Sales Tax ({salesTaxPercentage}%)</p>
                        <p className="font-bold">
                            Rs{orderInfo?.bills?.tax?.toFixed(2)}
                        </p>
                    </div>

<div className="flex justify-between">
    <p className="font-bold">
        Discount ({orderInfo?.bills.discountPercentage || 0}%)
    </p>
    <p className="font-bold">
        - Rs {orderInfo?.bills.discountAmount?.toFixed(2) || 0}
    </p>
</div>

                    <div className="text-center my-2">
                        <p>----------------------------------</p>
                    </div>

                    <div className="flex justify-between ">
                        <p className="font-bold">Total</p>
                        <p className="font-bold">
                            {orderInfo?.bills?.totalWithTax?.toFixed(2)}
                        </p>
                    </div>

                    <div className="text-center my-">
                        <p>----------------------------------</p>
                    </div>

                    <div className="text-center my-">
                        <p>----------------------------------</p>
                    </div>

                    <div className="text-center">
                        <p className="font-bold">THANK YOU!</p>
                    </div>
                    
                    {/* Powered by Hasnova */}
                    <div className="text-center mt-4 text-xs text-gray-500">
                        <p>Powered by Hasnova</p>
                    </div>
                </div>

                {/* Kitchen Receipt */}
                <div
                    ref={kitchenReceiptRef}
                    className="text-sm"
                    style={{ display: activeReceipt === "kitchen" ? "block" : "none" }} // Show/hide based on activeReceipt
                >
                    <div className="text-center mb-2 receipt-header">
                        <img
                            src={logo}
                            alt="restaurant logo"
                            className="mx-auto w-24 h-auto object-contain mb-3 logo-print"
                        />
                        <h2 className="text-xl font-bold">Savoury Bites</h2>
                        <p>Address: Shop no.2 plot no.19-C, Rahat Commercial Lane-3 Phase VI, D.H.A, Karachi</p>
                        <p>Telp. +92 337 8018705</p>
                        <div className="text-left mt-2">
                            <p className="text-xs font-medium mt-1">
                                Order Date: {formattedOrderDateTime}
                            </p>
                            <p>
                                <strong>Order Type:</strong> {orderInfo?.customerDetails?.orderType}
                            </p>
                        </div>
                    </div>

                    <div className="text-center my-2">
                        <p>----------------------------------</p>
                        <p className="font-bold">KITCHEN RECEIPT</p>
                        <p>----------------------------------</p>
                    </div>

                    <div className="flex justify-between mb-2 border">
                        <p className="font-bold">Description</p>
                        <p className="font-bold">Quantity</p>
                    </div>

                    <div className="mb-2">
                        {orderInfo?.items?.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <p>{item.name}</p>
                                <p>{item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center my-2">
                        <p>----------------------------------</p>
                    </div>

                    <div className="text-center">
                        <p className="font-bold">THANK YOU!</p>
                    </div>
                    
                    {/* Powered by Hasnova */}
                    <div className="text-center mt-4 text-xs text-gray-500">
                        <p>Powered by Hasnova</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setActiveReceipt("sales")} // Show Sales Receipt
                        className="text-blue-500 hover:underline text-sm px-4 py-2 rounded-lg"
                    >
                        Sales Receipt
                    </button>
                    <button
                        onClick={() => setActiveReceipt("kitchen")} // Show Kitchen Receipt
                        className="text-green-500 hover:underline text-sm px-4 py-2 rounded-lg"
                    >
                        Kitchen Receipt
                    </button>
                    <button
                        onClick={() => setShowInvoice(false)} // Close the modal
                        className="text-red-500 hover:underline text-sm px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Receipt;