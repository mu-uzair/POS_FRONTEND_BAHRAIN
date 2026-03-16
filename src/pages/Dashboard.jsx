import React, { useState } from "react";
import { MdCategory, MdTableBar } from "react-icons/md";
import { BiDish, BiUserPlus } from "react-icons/bi";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import CategoryModal from "../components/dashboard/CategoryModal";
import DishesModal from "../components/dashboard/DishModal";
import EditPanel from "../components/dashboard/EditPanel";
import Metrics from "../components/dashboard/Metrics";
import DeliveryBoyModal from "../components/dashboard/DeliveryBoyModal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "Table" },
  { label: "Add Category", icon: <MdCategory />, action: "Category" },
  { label: "Add Dishes", icon: <BiDish />, action: "Dishes" },
  { label: "Add Delivery Boy", icon: <BiUserPlus />, action: "DeliveryBoy" },
];

const tabs = ["Metrics", "Orders", "Edit Panel"];

const Dashboard = () => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDeliveryBoyModalOpen, setIsDeliveryBoyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    switch (action) {
      case "Table":
        setIsTableModalOpen(true);
        break;
      case "Category":
        setIsCategoryModalOpen(true);
        break;
      case "Dishes":
        setIsDishModalOpen(true);
        break;
      case "DeliveryBoy":
        setIsDeliveryBoyModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      {/* HEADER SECTION */}
      <div className="container mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 px-4 md:px-6 lg:px-8 gap-6">
        {/* BUTTON GROUP */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2 transition-all"
            >
              {label} {icon}
            </button>
          ))}
        </div>

        {/* TAB GROUP */}
        <div className="flex flex-wrap justify-center lg:justify-end gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2 transition-all ${
                activeTab === tab
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-4 sm:px-6 md:px-8">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Edit Panel" && (
          <EditPanel
            onOpenTableModal={() => handleOpenModal("Table")}
            onOpenCategoryModal={() => handleOpenModal("Category")}
            onOpenDishesModal={() => handleOpenModal("Dishes")}
            onOpenDeliveryBoyModal={() => handleOpenModal("DeliveryBoy")}
          />
        )}
      </div>

      {/* MODALS */}
      {isTableModalOpen && (
        <Modal setIsTableModalOpen={setIsTableModalOpen} />
      )}
      {isCategoryModalOpen && (
        <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
      )}
      {isDishModalOpen && (
        <DishesModal setIsDishModalOpen={setIsDishModalOpen} />
      )}
      {isDeliveryBoyModalOpen && (
        <DeliveryBoyModal
          setIsDeliveryBoyModalOpen={setIsDeliveryBoyModalOpen}
        />
      )}
    </div>
  );
};

export default Dashboard;
