// import React, { useState } from 'react'
// import { MdCategory, MdTableBar } from "react-icons/md";
// import { BiDish } from "react-icons/bi";
// // import Metrics from '../components/dashboard/Metrics';
// import RecentOrders from '../components/dashboard/RecentOrders';
// import Modal from '../components/dashboard/Modal';
// import CategoryModal from '../components/dashboard/CategoryModal';
// import DishesModal from '../components/dashboard/DishModal';
// import EditPanel from '../components/dashboard/EditPanel';



// const buttons = [
//     { label: "Add Table", icon: <MdTableBar />, action: "Table" },
//     { label: "Add Category", icon: <MdCategory />, action: "Category" },
//     { label: "Add Dishes", icon: <BiDish />, action: "Dishes" },
// ]

// const tabs = ["Metrics", "Orders", "Edit Panel"];

// const Dashboard = () => {

//     const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
//     const [isDishModalOpen, setIsDishModalOpen] = useState(false);

//     const [isTableModalOpen, setIsTableModalOpen] = useState(false);
//     const [activeTab, setActiveTab] = useState("Metrics");

//     const handleOpenModal = (action) => {
//         // if(action === "Table") setIsTableModalOpen(true);
//         if (action === "Table") {
//             setIsTableModalOpen(true);
//         } else if (action === "Category") {
//             setIsCategoryModalOpen(true);
//         } else if (action === "Dishes") {
//             setIsDishModalOpen(true); // Open the dishes modal
//         }
//     }


//     return (
//         <div className='bg-[#1f1f1f] h-[calc(100vh-5rem)]'>

//             <div className='container mx-auto flex items-center justify-between 
//         py-14 px-6 md:px-0'>

//                 <div className='flex items-center gap-3 '>
//                     {
//                         buttons.map(({ label, icon, action }) => {

//                             return (
//                                 <button
//                                 onClick={() => handleOpenModal(action)} 
//                                 // onClick={handleOpenModal(action)} 
//                                 className='bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3
//                         rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center
//                         gap-2'>
//                                     {label} {icon}
//                                 </button>
//                             )
//                         })
//                     }

//                 </div>
//                 {/* matrix buttons */}
//                 <div className='flex items-center gap-3 '>
//                     {
//                         tabs.map((tab) => {

//                             return (

//                                 <button
//                                     className={`px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold 
//                                         text-md flex items-center gap-2 ${activeTab === tab ? 
//                                             'bg-[#262626]' : 'bg-[#1a1a1a] hover:bg-[#262626]'
//                                         }`}
//                                     onClick={() => setActiveTab(tab)}
//                                 >
//                                     {tab}
//                                 </button>
//                             )
//                         })
//                     }

//                 </div>

//             </div>
           
//               {/* {activeTab === "Metrics" && <Metrics/>}       */}
//               {activeTab === "Orders" && <RecentOrders />}      
//               {activeTab ===  "Edit Panel" && <EditPanel/>}

//            {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen }/>}
//            {isCategoryModalOpen && <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen}/>}
//            {isDishModalOpen && <DishesModal setIsDishModalOpen={setIsDishModalOpen}/>}

//         </div>
//     )
// }

// export default Dashboard


import React, { useState } from 'react';
import { MdCategory, MdTableBar } from "react-icons/md";
import { BiDish } from "react-icons/bi";
import RecentOrders from '../components/dashboard/RecentOrders';
import Modal from '../components/dashboard/Modal';
import CategoryModal from '../components/dashboard/CategoryModal';
import DishesModal from '../components/dashboard/DishModal';
import EditPanel from '../components/dashboard/EditPanel';
import Metrics from '../components/dashboard/Metrics';

const buttons = [
    { label: "Add Table", icon: <MdTableBar />, action: "Table" },
    { label: "Add Category", icon: <MdCategory />, action: "Category" },
    { label: "Add Dishes", icon: <BiDish />, action: "Dishes" },
];

const tabs = ["Metrics", "Orders", "Edit Panel"];

const Dashboard = () => {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isDishModalOpen, setIsDishModalOpen] = useState(false);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Metrics");

    const handleOpenModal = (action) => {
        if (action === "Table") {
            setIsTableModalOpen(true);
        } else if (action === "Category") {
            setIsCategoryModalOpen(true);
        } else if (action === "Dishes") {
            setIsDishModalOpen(true);
        }
    };

    return (
        <div className='bg-[#1f1f1f] pb-5 overflow-y-scroll h-[calc(100vh-5rem)] hidden-scrollbar'>
            <div className='container mx-auto flex items-center justify-between py-14 px-6 md:px-0 '>
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
            {activeTab === "Metrics" && <Metrics/>}
            {activeTab === "Orders" && <RecentOrders />}
            {activeTab === "Edit Panel" && (
                <EditPanel
                    onOpenTableModal={() => handleOpenModal("Table")}
                    onOpenCategoryModal={() => handleOpenModal("Category")}
                    onOpenDishesModal={() => handleOpenModal("Dishes")}
                />
            )}

            {/* Modals */}
            {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
            {isCategoryModalOpen && <CategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />}
            {isDishModalOpen && <DishesModal setIsDishModalOpen={setIsDishModalOpen} />}
            
        </div>
    );
};

export default Dashboard;