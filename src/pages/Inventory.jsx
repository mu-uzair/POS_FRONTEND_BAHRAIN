// import React, { useState } from 'react';
// import { MdCategory, MdTableBar } from "react-icons/md";
// import { BiDish } from "react-icons/bi";
// import DishesModal from '../components/dashboard/DishModal';
// import EditPanel from '../components/Inventory/InventoryEditPanel';

// import { FaBoxesStacked, FaTruckMoving } from "react-icons/fa6";
// import ProductModal from '../components/Inventory/ProductModal';
// import VendorModal from '../components/Inventory/VendorModal';
// import CategoryModal from "../components/Inventory/categoryModal"; // ✅ new import

// import ProductsList from '../components/Inventory/ProductsList';
// import Logs from '../components/Inventory/Logs';
// import InventoryMetrics from '../components/Inventory/InventoryMetrics';

// const buttons = [
//     { label: "Add Product", icon: <FaBoxesStacked size={25} />, action: "Product" },
//     { label: "Add Vendor", icon: <FaTruckMoving size={25} />, action: "Vendor" },
//     { label: "Add Vendor", icon: <FaTruckMoving size={25} />, action: "Category" },
// ];

// const tabs = ["Metrics", "Product List", "Edit Panel", "Logs"];

// const inventory = () => {
//     const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//     const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
//     const [isDishModalOpen, setIsDishModalOpen] = useState(false);
//     const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

//     const [activeTab, setActiveTab] = useState("Metrics");

//     const handleOpenModal = (action) => {
//         if (action === "Product") {
//             setIsProductModalOpen(true);
//         } else if (action === "Vendor") {
//             setIsVendorModalOpen(true);
//         } else if (action === "Dishes") {
//             setIsDishModalOpen(true);
//         }
//         else if (action === "Category") setIsCategoryModalOpen(true);
//     };

//     return (
//         <div className='bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar'>
//             <div className='container mx-auto flex items-center justify-between py-14 px-6 md:px-0'>
//                 <div className='flex items-center gap-3'>
//                     {buttons.map(({ label, icon, action }) => (
//                         <button
//                             key={action}
//                             onClick={() => handleOpenModal(action)}
//                             className='bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2'
//                         >
//                             {label} {icon}
//                         </button>
//                     ))}
//                 </div>

//                 <div className='flex items-center gap-3'>
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab}
//                             className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${activeTab === tab ? 'bg-[#262626]' : 'bg-[#1a1a1a] hover:bg-[#262626]'
//                                 }`}
//                             onClick={() => setActiveTab(tab)}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Render content based on active tab */}
//             {activeTab === "Metrics" && <InventoryMetrics />}
//             {activeTab === "Product List" && <ProductsList />}
//             {activeTab === "Edit Panel" && (
//                 <EditPanel
//                     onOpenTableModal={() => handleOpenModal("Table")}
//                     onOpenCategoryModal={() => handleOpenModal("Category")}
//                     onOpenDishesModal={() => handleOpenModal("Dishes")}
//                 />
//             )}
//             {activeTab === "Logs" && <Logs />}

//             {/* Modals */}
//             {isProductModalOpen && <ProductModal setIsproductModalOpen={setIsProductModalOpen} />}
//             {isVendorModalOpen && <VendorModal setIsVendorModalOpen={setIsVendorModalOpen} />}
//             {isDishModalOpen && <DishesModal setIsDishModalOpen={setIsDishModalOpen} />}
//             {isCategoryModalOpen && (
//                 <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
//             )}

//         </div>
//     );
// };

// export default inventory;


// import React, { useState } from 'react';
// import { MdCategory } from "react-icons/md";
// import { BiDish } from "react-icons/bi";
// import { FaBoxesStacked, FaTruckMoving } from "react-icons/fa6";

// import EditPanel from '../components/Inventory/InventoryEditPanel';
// import ProductModal from '../components/Inventory/ProductModal';
// import VendorModal from '../components/Inventory/VendorModal';
// import CategoryModal from "../components/Inventory/categoryModal";
// import DishRecipeModal from "../components/Inventory/dishRecipeModal"; // ✅ Correct modal import

// import ProductsList from '../components/Inventory/ProductsList';
// import Logs from '../components/Inventory/Logs';
// import InventoryMetrics from '../components/Inventory/InventoryMetrics';

// // ✅ Updated Buttons
// const buttons = [
//   { label: "Add Product", icon: <FaBoxesStacked size={22} />, action: "Product" },
//   { label: "Add Vendor", icon: <FaTruckMoving size={22} />, action: "Vendor" },
//   { label: "Add Category", icon: <MdCategory size={22} />, action: "Category" },
//   { label: "Add Dish Recipe", icon: <BiDish size={22} />, action: "DishRecipe" }, // ✅ Updated label
// ];

// const tabs = ["Metrics", "Product List", "Edit Panel", "Logs"];

// const Inventory = () => {
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//   const [isDishRecipeModalOpen, setIsDishRecipeModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("Metrics");

//   // ✅ Handle which modal to open
//   const handleOpenModal = (action) => {
//     switch (action) {
//       case "Product":
//         setIsProductModalOpen(true);
//         break;
//       case "Vendor":
//         setIsVendorModalOpen(true);
//         break;
//       case "Category":
//         setIsCategoryModalOpen(true);
//         break;
//       case "DishRecipe":
//         setIsDishRecipeModalOpen(true);
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <div className="bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
//       {/* --- Header Section --- */}
//       <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-0">
//         {/* Action Buttons */}
//         <div className="flex items-center gap-3">
//           {buttons.map(({ label, icon, action }) => (
//             <button
//               key={action}
//               onClick={() => handleOpenModal(action)}
//               className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
//             >
//               {icon} {label}
//             </button>
//           ))}
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center gap-3">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
//                 activeTab === tab ? 'bg-[#262626]' : 'bg-[#1a1a1a] hover:bg-[#262626]'
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* --- Dynamic Tab Content --- */}
//       {activeTab === "Metrics" && <InventoryMetrics />}
//       {activeTab === "Product List" && <ProductsList />}
//       {activeTab === "Edit Panel" && (
//         <EditPanel
//           onOpenCategoryModal={() => handleOpenModal("Category")}
//           onOpenDishRecipeModal={() => handleOpenModal("DishRecipe")}
//         />
//       )}
//       {activeTab === "Logs" && <Logs />}

//       {/* --- Modals Section --- */}
//       {isProductModalOpen && (
//         <ProductModal setIsproductModalOpen={setIsProductModalOpen} />
//       )}
//       {isVendorModalOpen && (
//         <VendorModal setIsVendorModalOpen={setIsVendorModalOpen} />
//       )}
//       {isCategoryModalOpen && (
//         <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
//       )}
//       {isDishRecipeModalOpen && (
//         <DishRecipeModal setIsDishRecipeModalOpen={setIsDishRecipeModalOpen} />
//       )}
//     </div>
//   );
// };

// export default Inventory;


// import React, { useState } from 'react';
// import { MdCategory } from "react-icons/md";
// import { BiDish } from "react-icons/bi";
// import { FaBoxesStacked, FaTruckMoving } from "react-icons/fa6";

// import EditPanel from '../components/Inventory/InventoryEditPanel';
// import ProductModal from '../components/Inventory/ProductModal';
// import VendorModal from '../components/Inventory/VendorModal';
// import CategoryModal from "../components/Inventory/categoryModal";
// import DishRecipeModal from "../components/Inventory/dishRecipeModal";

// import ProductsList from '../components/Inventory/ProductsList';
// import Logs from '../components/Inventory/Logs';
// import InventoryMetrics from '../components/Inventory/InventoryMetrics';

// // Updated Buttons
// const buttons = [
//     { label: "Add Product", icon: <FaBoxesStacked size={22} />, action: "Product" },
//     { label: "Add Vendor", icon: <FaTruckMoving size={22} />, action: "Vendor" },
//     { label: "Add Category", icon: <MdCategory size={22} />, action: "Category" },
//     { label: "Add Dish Recipe", icon: <BiDish size={22} />, action: "DishRecipe" },
// ];

// const tabs = ["Metrics", "Product List", "Edit Panel", "Logs"];

// const Inventory = () => {
//     const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//     const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
//     const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//     const [isDishRecipeModalOpen, setIsDishRecipeModalOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState("Metrics");

//     // Handle which modal to open
//     const handleOpenModal = (action) => {
//         switch (action) {
//             case "Product":
//                 setIsProductModalOpen(true);
//                 break;
//             case "Vendor":
//                 setIsVendorModalOpen(true);
//                 break;
//             case "Category":
//                 setIsCategoryModalOpen(true);
//                 break;
//             case "DishRecipe":
//                 setIsDishRecipeModalOpen(true);
//                 break;
//             default:
//                 break;
//         }
//     };

//     return (
//         <div className="bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
//             {/* --- Header Section --- */}
//             <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-0">
//                 {/* Action Buttons */}
//                 <div className="flex items-center gap-3">
//                     {buttons.map(({ label, icon, action }) => (
//                         <button
//                             key={action}
//                             onClick={() => handleOpenModal(action)}
//                             className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
//                         >
//                             {icon} {label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Tabs */}
//                 <div className="flex items-center gap-3">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab}
//                             className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
//                                 activeTab === tab ? 'bg-[#262626]' : 'bg-[#1a1a1a] hover:bg-[#262626]'
//                             }`}
//                             onClick={() => setActiveTab(tab)}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* --- Dynamic Tab Content --- */}
//             {activeTab === "Metrics" && <InventoryMetrics />}
//             {activeTab === "Product List" && <ProductsList />}
//             {activeTab === "Edit Panel" && (
//                 <EditPanel
//                     onOpenCategoryModal={() => handleOpenModal("Category")}
//                     onOpenDishRecipeModal={() => handleOpenModal("DishRecipe")}
//                 />
//             )}
//             {activeTab === "Logs" && <Logs />}

//             {/* --- Modals Section (FIXED) --- */}
//             {isProductModalOpen && (
//                 <ProductModal setIsproductModalOpen={setIsProductModalOpen} />
//             )}
//             {isVendorModalOpen && (
//                 <VendorModal setIsVendorModalOpen={setIsVendorModalOpen} />
//             )}
//             {isCategoryModalOpen && (
//                 <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
//             )}
//             {isDishRecipeModalOpen && (
//                 // ✅ CORRECTED: Passing 'open' and 'onClose' props
//                 <DishRecipeModal 
//                     open={isDishRecipeModalOpen} 
//                     onClose={() => setIsDishRecipeModalOpen(false)} 
//                 />
//             )}
//         </div>
//     );
// };

// export default Inventory;


import React, { useState } from "react";
import { MdCategory } from "react-icons/md";
import { BiDish } from "react-icons/bi";
import { FaBoxesStacked, FaTruckMoving } from "react-icons/fa6";

import EditPanel from "../components/Inventory/InventoryEditPanel";
import ProductModal from "../components/Inventory/ProductModal";
import VendorModal from "../components/Inventory/VendorModal";
import CategoryModal from "../components/Inventory/categoryModal";
import DishRecipeModal from "../components/Inventory/dishRecipeModal";

import ProductsList from "../components/Inventory/ProductsList";
import Logs from "../components/Inventory/Logs";
import InventoryMetrics from "../components/Inventory/InventoryMetrics";

// Button definitions
const buttons = [
  { label: "Add Product", icon: <FaBoxesStacked size={22} />, action: "Product" },
  { label: "Add Vendor", icon: <FaTruckMoving size={22} />, action: "Vendor" },
  { label: "Add Category", icon: <MdCategory size={22} />, action: "Category" },
  { label: "Add Dish Recipe", icon: <BiDish size={22} />, action: "DishRecipe" },
];

const tabs = ["Metrics", "Product List", "Edit Panel", "Logs"];

const Inventory = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishRecipeModalOpen, setIsDishRecipeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Metrics");

  // Handles modal opening logic
  const handleOpenModal = (action) => {
    switch (action) {
      case "Product":
        setIsProductModalOpen(true);
        break;
      case "Vendor":
        setIsVendorModalOpen(true);
        break;
      case "Category":
        setIsCategoryModalOpen(true);
        break;
      case "DishRecipe":
        setIsDishRecipeModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar">
      {/* --- Header Section --- */}
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-0">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Dynamic Tab Content --- */}
      {activeTab === "Metrics" && <InventoryMetrics />}
      {activeTab === "Product List" && <ProductsList />}
      {activeTab === "Edit Panel" && (
        <EditPanel
          onOpenCategoryModal={() => handleOpenModal("Category")}
          onOpenDishRecipeModal={() => handleOpenModal("DishRecipe")}
        />
      )}
      {activeTab === "Logs" && <Logs />}

      {/* --- Modals Section --- */}
      {isProductModalOpen && (
        <ProductModal setIsproductModalOpen={setIsProductModalOpen} />
      )}

      {isVendorModalOpen && (
        <VendorModal setIsVendorModalOpen={setIsVendorModalOpen} />
      )}

      {isCategoryModalOpen && (
        <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
      )}

      {isDishRecipeModalOpen && (
        <DishRecipeModal
          open={isDishRecipeModalOpen}
          onClose={() => setIsDishRecipeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Inventory;
