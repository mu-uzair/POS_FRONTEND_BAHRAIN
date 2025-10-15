


import React from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { FaCircle, FaLongArrowAltRight } from 'react-icons/fa';
import { getAvatarName } from '../../utils';
import { MdFileDownloadDone } from 'react-icons/md';

const OrderList = ({ order }) => {
  // Destructure order with fallback values
  const {
    customerDetails = { name: 'Unknown Customer' },
    items = [],
    table = { tableNo: null },
    orderStatus = 'Unknown',
  } = order || {};

  return (
    <div className="flex items-center gap-5 mb-5">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
            {getAvatarName(customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-[100%]">
            <div className="flex flex-col items-start gap-1">
                <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                    {customerDetails.name}
                </h1>
                <p className="text-[#ababab] text-sm">{items.length} Items</p>
            </div>
            <div>
                {/* Conditionally render table number */}
                {table.tableNo ? (
                    <h1 className="text-[#f6b100] font-semibold border rounded-lg p-1">
                        Table No : <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
                        {table.tableNo}
                    </h1>
                ) : (
                    <h1 className="text-[#f6b100] font-semibold border rounded-lg p-1">
                        {order.customerDetails.orderType === "Take Away" ? "Take Away" : "Delivery"}
                    </h1>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                {orderStatus === "Ready" ? (
                    <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                        <IoCheckmarkDone className="inline mr-2" />
                        {orderStatus}
                    </p>
                ) : orderStatus === "Completed" ? (
                    <p className="text-blue-600 bg-[#2e3a4a] px-2 py-1 rounded-lg">
                        <MdFileDownloadDone className="inline mr-2" />
                        {orderStatus}
                    </p>
                ) : (
                    <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                        <FaCircle className="inline mr-2" />
                        {orderStatus}
                    </p>
                )}
            </div>
        </div>
    </div>
);
};

export default OrderList;