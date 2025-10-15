import React, { useState } from 'react';
import { MdCategory, MdTableBar } from "react-icons/md";
import { BiDish } from "react-icons/bi";
import DishesModal from '../components/dashboard/DishModal';
import EditPanel from '../components/Inventory/InventoryEditPanel';

import { FaBoxesStacked, FaTruckMoving } from "react-icons/fa6";
import ProductModal from '../components/Inventory/ProductModal';
import VendorModal from '../components/Inventory/VendorModal';
import ProductsList from '../components/Inventory/ProductsList';
import Logs from '../components/Inventory/Logs';
import InventoryMetrics from '../components/Inventory/InventoryMetrics';

const buttons = [
    { label: "Add Product", icon: <FaBoxesStacked size={25} />, action: "Product" },
    { label: "Add Vendor", icon: <FaTruckMoving size={25} />, action: "Vendor" },
];

const tabs = ["Metrics", "Product List", "Edit Panel", "Logs"];

const inventory = () => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [isDishModalOpen, setIsDishModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Metrics");

    const handleOpenModal = (action) => {
        if (action === "Product") {
            setIsProductModalOpen(true);
        } else if (action === "Vendor") {
            setIsVendorModalOpen(true);
        } else if (action === "Dishes") {
            setIsDishModalOpen(true);
        }
    };

    return (
        <div className='bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar'>
            <div className='container mx-auto flex items-center justify-between py-14 px-6 md:px-0'>
                <div className='flex items-center gap-3'>
                    {buttons.map(({ label, icon, action }) => (
                        <button
                            key={action}
                            onClick={() => handleOpenModal(action)}
                            className='bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2'
                        >
                            {label} {icon}
                        </button>
                    ))}
                </div>

                <div className='flex items-center gap-3'>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                                activeTab === tab ? 'bg-[#262626]' : 'bg-[#1a1a1a] hover:bg-[#262626]'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render content based on active tab */}
            {activeTab === "Metrics" && <InventoryMetrics />}
            {activeTab === "Product List" && <ProductsList />}
            {activeTab === "Edit Panel" && (
                <EditPanel
                    onOpenTableModal={() => handleOpenModal("Table")}
                    onOpenCategoryModal={() => handleOpenModal("Category")}
                    onOpenDishesModal={() => handleOpenModal("Dishes")}
                />
            )}
            {activeTab === "Logs" && <Logs />}

            {/* Modals */}
            {isProductModalOpen && <ProductModal setIsproductModalOpen={setIsProductModalOpen} />}
            {isVendorModalOpen && <VendorModal setIsVendorModalOpen={setIsVendorModalOpen} />}
            {isDishModalOpen && <DishesModal setIsDishModalOpen={setIsDishModalOpen} />}
        </div>
    );
};

export default inventory;