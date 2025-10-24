// import React, { useState } from "react";
// import { FaHome } from "react-icons/fa";
// import { MdOutlineReorder, MdOutlineTableRestaurant } from "react-icons/md";
// import { BiSolidDish } from "react-icons/bi";
// import { CiCircleMore } from "react-icons/ci";
// import { useNavigate, useLocation } from "react-router-dom";
// import Modal from "./Modal";
// import DineInTakeAwayModal from "./DineInTakeAwayModal";
// import { useDispatch, useSelector } from "react-redux";
// import { setCustomer } from "../../redux/slice/customerSlice";
// import { removeAllItems } from "../../redux/slice/cartSlice";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import DeliveryModal from "./DeliveryModal";




// const BottomNav = () => {


//   const dispatch = useDispatch();
//   const [guestCount, setGuestCount] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isDineInTakeAwayModalOpen, setIsDineInTakeAwayModalOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showSection, setShowSection] = useState(false);
//   const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);



//   const openDineInTakeAwayModal = () => {
//     console.log("Opening DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(true);
//   };

//   const closeDineInTakeAwayModal = () => {
//     console.log("Closing DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(false);
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const increment = () => {
//     if (guestCount >= 7) return;
//     setGuestCount((prev) => prev + 1);
//   };

//   const decrement = () => {
//     if (guestCount <= 0) return;
//     setGuestCount((prev) => prev - 1);
//   };

//   const isActive = (path) => location.pathname === path;


//   const handleCreateOrder = () => {
//     // Set default values if name or phone is empty
//     const customerName = name.trim() || "Seated Customer"; // Default name
//     const customerPhone = phone.trim() || "N/A"; // Default phone

//     // Dispatch customer details including default values
//     dispatch(setCustomer({
//       name: customerName,
//       phone: customerPhone,
//       guests: guestCount,
//       orderType: "Dine-in"
//     }));
//     navigate("/Tables");
//   };


//   // const handleDelivery = () => {
//   //   // Dispatch default values for Take Away
//   //   dispatch(
//   //     setCustomer({
//   //       name: "Walk-In Customer", // Default name
//   //       phone: "N/A", // Default phone
//   //       guests: 0, // No guests for Take Away
//   //       orderType: "Delivery", // Set orderType
//   //     })
//   //   );
//   //   closeDineInTakeAwayModal();
//   //   navigate("/Menu"); // Redirect to menu
//   // };

//   const handleDelivery = () => {
//     closeDineInTakeAwayModal();
//     setIsDeliveryModalOpen(true);
//   };



//   return (
//     <div className='fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around'>
//       {/* Buttons for navigation */}
//       <button onClick={() => navigate("/")} className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <FaHome className="inline mr-2 " size={30} /><p>Home</p>
//       </button>

//       <button onClick={() => navigate("/Orders")} className={`flex items-center justify-center font-bold ${isActive("/Orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineReorder className="inline mr-2 " size={30} /><p>Orders</p>
//       </button>

//       <button onClick={() => navigate("/Tables")} className={`flex items-center justify-center font-bold ${isActive("/Tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineTableRestaurant className="inline mr-2" size={30} /><p>Tables</p>
//       </button>


//       {/* More Button */}
//       <div className="relative">
//         <button
//           onClick={() => setShowSection((prev) => !prev)}
//           className={`flex items-center justify-center font-bold text-[#ababab] w-[200px] rounded-[20px] ${showSection ? "bg-[#343434]" : ""
//             }`}
//         >
//           <CiCircleMore className="inline mr-2" size={30} />
//           <p>More</p>
//         </button>

//         {/* Dropdown Menu */}
//         {showSection && (
//           <div className="absolute bottom-16 left-0 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-lg w-[200px] z-50">
//             <button
//               onClick={() => {
//                 navigate("/GrillSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍖 Grill Section
//             </button>
//             <button
//               onClick={() => {
//                 navigate("/KitchenSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍳 Kitchen Section
//             </button>
//           </div>
//         )}
//       </div>


//       {/* Button to open DineInTakeAwayModal */}
//       <button
//         disabled={isActive("/Tables") || isActive("/Menu")}
//         // onClick={openDineInTakeAwayModal}
//         onClick={() => {
//           openDineInTakeAwayModal();
//           // Set editingMode to false in Redux (new order)
//           dispatch(setEditingMode(false));// to change update order to place order button
//           dispatch(removeAllItems()); //to empty the cart

//         }}
//         className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-3 items-center"
//       >
//         <BiSolidDish size={30} />
//       </button>

//       {/* DineInTakeAwayModal */}
//       <DineInTakeAwayModal
//         isOpen={isDineInTakeAwayModalOpen} // Pass isOpen prop
//         onClose={closeDineInTakeAwayModal} // Pass onClose prop
//         onDineIn={() => {

//           closeDineInTakeAwayModal();
//           openModal();



//         }}
//         handleTakeAway={() => {
//           // Dispatch default values for Take Away
//           dispatch(
//             setCustomer({
//               name: "Walk-In Customer", // Default name
//               phone: "N/A", // Default phone
//               guests: 0, // No guests for Take Away
//               orderType: "Take Away", // Set orderType
//             })
//           );
//           closeDineInTakeAwayModal();
//           navigate("/Menu"); // Redirect to menu
//         }}
//         handleDelivery={handleDelivery} // Pass onDelivery prop
//       />
//       <DeliveryModal
//         isOpen={isDeliveryModalOpen}
//         onClose={() => setIsDeliveryModalOpen(false)}
//         onCreateDelivery={(data) => {
//           // Dispatch delivery info to Redux
//           dispatch(
//             setCustomer({
//               name: data.name,
//               phone: data.phone,
//               guests: 0,
//               orderType: "Delivery",
//               deliveryBoy: data.deliveryBoy,
//             })
//           );
//           navigate("/Menu");
//         }}
//       />


//       {/* Modal for Dine-In details */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
//         <div>
//           <label className="block text-[#ababab] mb-2 text-sm font-medium tracking-wide">Customer Name</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Customer Name" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium tracking-wide">Customer Phone Number</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="+92-3XX-XXXXXXX" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
//           <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
//             <button onClick={decrement} className="text-yellow-500 text-2xl cursor-pointer">&minus;</button>
//             <span className="text-white">{guestCount} person</span>
//             <button onClick={increment} className="text-yellow-500 text-2xl cursor-pointer">&#43;</button>
//           </div>
//         </div>
//         <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
//           Create Order
//         </button>
//       </Modal>
//     </div>
//   );
// };

// export default BottomNav;

// gettign delevry detail phone not address

// import React, { useState } from "react";
// import { FaHome } from "react-icons/fa";
// import { MdOutlineReorder, MdOutlineTableRestaurant } from "react-icons/md";
// import { BiSolidDish } from "react-icons/bi";
// import { CiCircleMore } from "react-icons/ci";
// import { useNavigate, useLocation } from "react-router-dom";
// import Modal from "./Modal";
// import DineInTakeAwayModal from "./DineInTakeAwayModal";
// import { useDispatch } from "react-redux";
// import { setCustomer } from "../../redux/slice/customerSlice";
// import { removeAllItems } from "../../redux/slice/cartSlice";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import DeliveryModal from "./DeliveryModal";


// const BottomNav = () => {


//   const dispatch = useDispatch();
//   const [guestCount, setGuestCount] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isDineInTakeAwayModalOpen, setIsDineInTakeAwayModalOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showSection, setShowSection] = useState(false);
//   const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);



//   const openDineInTakeAwayModal = () => {
//     console.log("Opening DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(true);
//   };

//   const closeDineInTakeAwayModal = () => {
//     console.log("Closing DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(false);
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const increment = () => {
//     if (guestCount >= 7) return;
//     setGuestCount((prev) => prev + 1);
//   };

//   const decrement = () => {
//     if (guestCount <= 0) return;
//     setGuestCount((prev) => prev - 1);
//   };

//   const isActive = (path) => location.pathname === path;


//   const handleCreateOrder = () => {
//     // Set default values if name or phone is empty
//     const customerName = name.trim() || "Seated Customer"; // Default name
//     const customerPhone = phone.trim() || "N/A"; // Default phone

//     const customerData = {
//       name: customerName,
//       phone: customerPhone,
//       guests: guestCount,
//       orderType: "Dine-in"
//     };

//     // Log the data before dispatching
//     console.log("Dine-in Order Data Dispatched:", customerData);

//     // Dispatch customer details including default values
//     dispatch(setCustomer(customerData));
//     navigate("/Tables");
//   };


//   const handleDelivery = () => {
//     closeDineInTakeAwayModal();
//     setIsDeliveryModalOpen(true);
//   };



//   return (
//     <div className='fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around'>
//       {/* Buttons for navigation */}
//       <button onClick={() => navigate("/")} className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <FaHome className="inline mr-2 " size={30} /><p>Home</p>
//       </button>

//       <button onClick={() => navigate("/Orders")} className={`flex items-center justify-center font-bold ${isActive("/Orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineReorder className="inline mr-2 " size={30} /><p>Orders</p>
//       </button>

//       <button onClick={() => navigate("/Tables")} className={`flex items-center justify-center font-bold ${isActive("/Tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineTableRestaurant className="inline mr-2" size={30} /><p>Tables</p>
//       </button>


//       {/* More Button */}
//       <div className="relative">
//         <button
//           onClick={() => setShowSection((prev) => !prev)}
//           className={`flex items-center justify-center font-bold text-[#ababab] w-[200px] rounded-[20px] ${showSection ? "bg-[#343434]" : ""
//             }`}
//         >
//           <CiCircleMore className="inline mr-2" size={30} />
//           <p>More</p>
//         </button>

//         {/* Dropdown Menu */}
//         {showSection && (
//           <div className="absolute bottom-16 left-0 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-lg w-[200px] z-50">
//             <button
//               onClick={() => {
//                 navigate("/GrillSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍖 Grill Section
//             </button>
//             <button
//               onClick={() => {
//                 navigate("/KitchenSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍳 Kitchen Section
//             </button>
//           </div>
//         )}
//         </div>


//       {/* Button to open DineInTakeAwayModal */}
//       <button
//         disabled={isActive("/Tables") || isActive("/Menu")}
//         // onClick={openDineInTakeAwayModal}
//         onClick={() => {
//           openDineInTakeAwayModal();
//           // Set editingMode to false in Redux (new order)
//           dispatch(setEditingMode(false));// to change update order to place order button
//           dispatch(removeAllItems()); //to empty the cart

//         }}
//         className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-3 items-center"
//       >
//         <BiSolidDish size={30} />
//       </button>

//       {/* DineInTakeAwayModal */}
//       <DineInTakeAwayModal
//         isOpen={isDineInTakeAwayModalOpen} // Pass isOpen prop
//         onClose={closeDineInTakeAwayModal} // Pass onClose prop
//         onDineIn={() => {

//           closeDineInTakeAwayModal();
//           openModal();



//         }}
//         handleTakeAway={() => {
//           // Dispatch default values for Take Away
//           dispatch(
//             setCustomer({
//               name: "Walk-In Customer", // Default name
//               phone: "N/A", // Default phone
//               guests: 0, // No guests for Take Away
//               orderType: "Take Away", // Set orderType
//             })
//           );
//           closeDineInTakeAwayModal();
//           navigate("/Menu"); // Redirect to menu
//         }}
//         handleDelivery={handleDelivery} // Pass onDelivery prop
//       />
//       <DeliveryModal
//         isOpen={isDeliveryModalOpen}
//         onClose={() => setIsDeliveryModalOpen(false)}
//         onCreateDelivery={(data) => {
//           const customerData = {
//             name: data.name,
//             phone: data.phone,
//             guests: 0,
//             orderType: "Delivery",
//             deliveryAddress: data.deliveryAddress, 
//             deliveryBoyId: data.deliveryBoy,
//           };

//           // Log the data before dispatching
//           console.log("Delivery Order Data Dispatched:", customerData);

//           // Dispatch delivery info to Redux
//           dispatch(setCustomer(customerData));
//           navigate("/Menu");
//         }}
//       />


//       {/* Modal for Dine-In details */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
//         <div>
//           <label className="block text-[#ababab] mb-2 text-sm font-medium tracking-wide">Customer Name</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Customer Name" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium tracking-wide">Customer Phone Number</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="+92-3XX-XXXXXXX" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
//           <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
//             <button onClick={decrement} className="text-yellow-500 text-2xl cursor-pointer">&minus;</button>
//             <span className="text-white">{guestCount} person</span>
//             <button onClick={increment} className="text-yellow-500 text-2xl cursor-pointer">&#43;</button>
//           </div>
//         </div>
//         <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
//           Create Order
//         </button>
//       </Modal>
//     </div>
//   );
// };

// export default BottomNav;

// fixing delivery address issue

// import React, { useState } from "react";
// import { FaHome } from "react-icons/fa";
// import { MdOutlineReorder, MdOutlineTableRestaurant } from "react-icons/md";
// import { BiSolidDish } from "react-icons/bi";
// import { CiCircleMore } from "react-icons/ci";
// import { useNavigate, useLocation } from "react-router-dom";
// import Modal from "./Modal";
// import DineInTakeAwayModal from "./DineInTakeAwayModal";
// import { useDispatch } from "react-redux";
// import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
// import { removeAllItems } from "../../redux/slice/cartSlice";
// import { setEditingMode } from "../../redux/slice/editOrderSlice";
// import DeliveryModal from "./DeliveryModal";


// const BottomNav = () => {


//   const dispatch = useDispatch();
//   const [guestCount, setGuestCount] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isDineInTakeAwayModalOpen, setIsDineInTakeAwayModalOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showSection, setShowSection] = useState(false);
//   const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);



//   const openDineInTakeAwayModal = () => {
//     console.log("Opening DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(true);
//   };

//   const closeDineInTakeAwayModal = () => {
//     console.log("Closing DineInTakeAwayModal"); // Debugging
//     setIsDineInTakeAwayModalOpen(false);
//   };

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const increment = () => {
//     if (guestCount >= 7) return;
//     setGuestCount((prev) => prev + 1);
//   };

//   const decrement = () => {
//     if (guestCount <= 0) return;
//     setGuestCount((prev) => prev - 1);
//   };

//   const isActive = (path) => location.pathname === path;


//   const handleCreateOrder = () => {
//     // Set default values if name or phone is empty
//     const customerName = name.trim() || "Seated Customer"; // Default name
//     const customerPhone = phone.trim() || "N/A"; // Default phone

//     const customerData = {
//       name: customerName,
//       phone: customerPhone,
//       guests: guestCount,
//       orderType: "Dine-in"
//     };

//     // Log the data before dispatching
//     console.log("Dine-in Order Data Dispatched:", customerData);

//     // Dispatch customer details including default values
//     dispatch(setCustomer(customerData));
//     navigate("/Tables");
//   };


//   const handleDelivery = () => {
//     closeDineInTakeAwayModal();
//     setIsDeliveryModalOpen(true);
//   };



//   return (
//     <div className='fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around'>
//       {/* Buttons for navigation */}
//       <button onClick={() => navigate("/")} className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <FaHome className="inline mr-2 " size={30} /><p>Home</p>
//       </button>

//       <button onClick={() => navigate("/Orders")} className={`flex items-center justify-center font-bold ${isActive("/Orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineReorder className="inline mr-2 " size={30} /><p>Orders</p>
//       </button>

//       <button onClick={() => navigate("/Tables")} className={`flex items-center justify-center font-bold ${isActive("/Tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
//         <MdOutlineTableRestaurant className="inline mr-2" size={30} /><p>Tables</p>
//       </button>


//       {/* More Button */}
//       <div className="relative">
//         <button
//           onClick={() => setShowSection((prev) => !prev)}
//           className={`flex items-center justify-center font-bold text-[#ababab] w-[200px] rounded-[20px] ${showSection ? "bg-[#343434]" : ""
//             }`}
//         >
//           <CiCircleMore className="inline mr-2" size={30} />
//           <p>More</p>
//         </button>

//         {/* Dropdown Menu */}
//         {showSection && (
//           <div className="absolute bottom-16 left-0 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-lg w-[200px] z-50">
//             <button
//               onClick={() => {
//                 navigate("/GrillSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍖 Grill Section
//             </button>
//             <button
//               onClick={() => {
//                 navigate("/KitchenSection");
//                 setShowSection(false);
//               }}
//               className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-[#2a2a2a]"
//             >
//               🍳 Kitchen Section
//             </button>
//           </div>
//         )}
//       </div>


//       {/* Button to open DineInTakeAwayModal */}
//       <button
//         disabled={isActive("/Tables") || isActive("/Menu")}
//         // onClick={openDineInTakeAwayModal}
//         onClick={() => {
//           openDineInTakeAwayModal();
//           // Set editingMode to false in Redux (new order)
//           dispatch(setEditingMode(false));// to change update order to place order button
//           dispatch(removeAllItems()); //to empty the cart

//         }}
//         className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-3 items-center"
//       >
//         <BiSolidDish size={30} />
//       </button>

//       {/* DineInTakeAwayModal */}
//       <DineInTakeAwayModal
//         isOpen={isDineInTakeAwayModalOpen} // Pass isOpen prop
//         onClose={closeDineInTakeAwayModal} // Pass onClose prop
//         onDineIn={() => {

//           closeDineInTakeAwayModal();
//           openModal();



//         }}
//         handleTakeAway={() => {
//           // Dispatch default values for Take Away
//           dispatch(
//             setCustomer({
//               name: "Walk-In Customer", // Default name
//               phone: "N/A", // Default phone
//               guests: 0, // No guests for Take Away
//               orderType: "Take Away", // Set orderType
//             })
//           );
//           closeDineInTakeAwayModal();
//           navigate("/Menu"); // Redirect to menu
//         }}
//         handleDelivery={handleDelivery} // Pass onDelivery prop
//       />
//       <DeliveryModal
//         isOpen={isDeliveryModalOpen}
//         onClose={() => setIsDeliveryModalOpen(false)}
//         onCreateDelivery={(data) => {
//           // Ensure the address is explicitly a trimmed string to pass downstream validation safely
//           const address = data.address ? String(data.address).trim() : '';

//           // --- 1. Dispatch base customer and order type info ---
//           dispatch(
//             setCustomer({
//               name: data.name,
//               phone: data.phone,
//               guests: 0,
//               orderType: "Delivery",
//             })
//           );

//           // --- 2. Dispatch delivery specific info using the new action ---
//           // This should correctly set deliveryAddress and deliveryBoyId
//           const deliveryInfo = {
//             address: address,
//             deliveryBoyId: data.deliveryBoy,
//             // Optionally include name/phone for redundancy, but setCustomer should handle it.
//             phone: data.phone,
//             name: data.name
//           };

//           console.log("Delivery Customer Base Dispatched:", { name: data.name, phone: data.phone, orderType: "Delivery" });
//           console.log("Delivery Address/Boy Dispatched:", deliveryInfo);

//           dispatch(setDeliveryInfo(deliveryInfo));

//           navigate("/Menu");
//         }}
//       />


//       {/* Modal for Dine-In details */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
//         <div>
//           <label className="block text-[#ababab] mb-2 text-sm font-medium tracking-wide">Customer Name</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Customer Name" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium tracking-wide">Customer Phone Number</label>
//           <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
//             <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="+92-3XX-XXXXXXX" className="bg-transparent flex-1 text-white focus:outline-none" />
//           </div>
//         </div>
//         <div>
//           <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
//           <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
//             <button onClick={decrement} className="text-yellow-500 text-2xl cursor-pointer">&minus;</button>
//             <span className="text-white">{guestCount} person</span>
//             <button onClick={increment} className="text-yellow-500 text-2xl cursor-pointer">&#43;</button>
//           </div>
//         </div>
//         <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
//           Create Order
//         </button>
//       </Modal>
//     </div>
//   );
// };

// export default BottomNav;

// rsponsive bottom nav for mobile and desktop

import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdOutlineTableRestaurant } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import DineInTakeAwayModal from "./DineInTakeAwayModal";
import { useDispatch } from "react-redux";
import { setCustomer, setDeliveryInfo } from "../../redux/slice/customerSlice";
import { removeAllItems } from "../../redux/slice/cartSlice";
import { setEditingMode } from "../../redux/slice/editOrderSlice";
import DeliveryModal from "./DeliveryModal";

const BottomNav = () => {
  const dispatch = useDispatch();
  const [guestCount, setGuestCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDineInTakeAwayModalOpen, setIsDineInTakeAwayModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const openDineInTakeAwayModal = () => {
    console.log("Opening DineInTakeAwayModal");
    setIsDineInTakeAwayModalOpen(true);
  };

  const closeDineInTakeAwayModal = () => {
    console.log("Closing DineInTakeAwayModal");
    setIsDineInTakeAwayModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    if (guestCount >= 7) return;
    setGuestCount((prev) => prev + 1);
  };

  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    const customerName = name.trim() || "Seated Customer";
    const customerPhone = phone.trim() || "N/A";

    const customerData = {
      name: customerName,
      phone: customerPhone,
      guests: guestCount,
      orderType: "Dine-in"
    };

    console.log("Dine-in Order Data Dispatched:", customerData);
    dispatch(setCustomer(customerData));
    navigate("/Tables");
  };

  const handleDelivery = () => {
    closeDineInTakeAwayModal();
    setIsDeliveryModalOpen(true);
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 md:h-20 flex justify-around items-center px-2 md:px-4 lg:px-8 z-40'>
      {/* Navigation Buttons - Responsive sizing */}
      <button 
        onClick={() => navigate("/")} 
        className={`flex items-center justify-center font-bold ${
          isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } flex-1 max-w-[200px] lg:max-w-[300px] h-12 rounded-[20px] transition-colors`}
      >
        <FaHome className="inline mr-1 md:mr-2" size={24} />
        <p className="text-sm md:text-base hidden sm:inline">Home</p>
      </button>

      <button 
        onClick={() => navigate("/Orders")} 
        className={`flex items-center justify-center font-bold ${
          isActive("/Orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } flex-1 max-w-[200px] lg:max-w-[300px] h-12 rounded-[20px] mx-1 md:mx-2 transition-colors`}
      >
        <MdOutlineReorder className="inline mr-1 md:mr-2" size={24} />
        <p className="text-sm md:text-base hidden sm:inline">Orders</p>
      </button>

      <button 
        onClick={() => navigate("/Tables")} 
        className={`flex items-center justify-center font-bold ${
          isActive("/Tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        } flex-1 max-w-[200px] lg:max-w-[300px] h-12 rounded-[20px] transition-colors`}
      >
        <MdOutlineTableRestaurant className="inline mr-1 md:mr-2" size={24} />
        <p className="text-sm md:text-base hidden sm:inline">Tables</p>
      </button>

      {/* More Button with Dropdown */}
      <div className="relative flex-1 max-w-[150px] lg:max-w-[200px] ml-1 md:ml-2">
        <button
          onClick={() => setShowSection((prev) => !prev)}
          className={`flex items-center justify-center font-bold text-[#ababab] w-full h-12 rounded-[20px] ${
            showSection ? "bg-[#343434]" : ""
          } transition-colors`}
        >
          <CiCircleMore className="inline mr-1 md:mr-2" size={24} />
          <p className="text-sm md:text-base hidden sm:inline">More</p>
        </button>

        {/* Dropdown Menu - Responsive positioning */}
        {showSection && (
          <div className="absolute bottom-16 md:bottom-20 left-0 right-0 md:left-auto md:right-auto md:w-[200px] bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                navigate("/GrillSection");
                setShowSection(false);
              }}
              className="block w-full text-left px-4 py-3 text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors text-sm md:text-base"
            >
              🍖 Grill Section
            </button>
            <button
              onClick={() => {
                navigate("/KitchenSection");
                setShowSection(false);
              }}
              className="block w-full text-left px-4 py-3 text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors text-sm md:text-base"
            >
              🍳 Kitchen Section
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button - Responsive sizing and positioning */}
      <button
        disabled={isActive("/Tables") || isActive("/Menu")}
        onClick={() => {
          openDineInTakeAwayModal();
          dispatch(setEditingMode(false));
          dispatch(removeAllItems());
        }}
        className={`absolute bottom-8 md:bottom-11 left-1/2 transform -translate-x-1/2 bg-[#F6B100] text-[#f5f5f5] rounded-full p-3 md:p-4 flex items-center justify-center shadow-lg transition-all hover:bg-[#e5a000] ${
          (isActive("/Tables") || isActive("/Menu")) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <BiSolidDish size={28} className="md:w-8 md:h-8" />
      </button>

      {/* DineInTakeAwayModal */}
      <DineInTakeAwayModal
        isOpen={isDineInTakeAwayModalOpen}
        onClose={closeDineInTakeAwayModal}
        onDineIn={() => {
          closeDineInTakeAwayModal();
          openModal();
        }}
        handleTakeAway={() => {
          dispatch(
            setCustomer({
              name: "Walk-In Customer",
              phone: "N/A",
              guests: 0,
              orderType: "Take Away",
            })
          );
          closeDineInTakeAwayModal();
          navigate("/Menu");
        }}
        handleDelivery={handleDelivery}
      />

      {/* DeliveryModal */}
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onCreateDelivery={(data) => {
          const address = data.address ? String(data.address).trim() : '';

          dispatch(
            setCustomer({
              name: data.name,
              phone: data.phone,
              guests: 0,
              orderType: "Delivery",
            })
          );

          const deliveryInfo = {
            address: address,
            deliveryBoyId: data.deliveryBoy,
            phone: data.phone,
            name: data.name
          };

          console.log("Delivery Customer Base Dispatched:", { name: data.name, phone: data.phone, orderType: "Delivery" });
          console.log("Delivery Address/Boy Dispatched:", deliveryInfo);

          dispatch(setDeliveryInfo(deliveryInfo));
          navigate("/Menu");
        }}
      />

      {/* Modal for Dine-In details */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium tracking-wide">Customer Name</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              type="text" 
              placeholder="Enter Customer Name" 
              className="bg-transparent flex-1 text-white focus:outline-none text-sm md:text-base" 
            />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium tracking-wide">Customer Phone Number</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              type="number" 
              placeholder="+92-3XX-XXXXXXX" 
              className="bg-transparent flex-1 text-white focus:outline-none text-sm md:text-base" 
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button 
              onClick={decrement} 
              className="text-yellow-500 text-2xl md:text-3xl cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-[#2a2a2a] rounded transition-colors"
            >
              &minus;
            </button>
            <span className="text-white text-sm md:text-base">{guestCount} person</span>
            <button 
              onClick={increment} 
              className="text-yellow-500 text-2xl md:text-3xl cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-[#2a2a2a] rounded transition-colors"
            >
              &#43;
            </button>
          </div>
        </div>
        <button 
          onClick={handleCreateOrder} 
          className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700 transition-colors font-medium text-sm md:text-base"
        >
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default BottomNav;