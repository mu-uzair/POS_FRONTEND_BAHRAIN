import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdOutlineTableRestaurant } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import DineInTakeAwayModal from "./DineInTakeAwayModal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slice/customerSlice";
import { removeAllItems} from "../../redux/slice/cartSlice";
import { setEditingMode } from "../../redux/slice/editOrderSlice";

const BottomNav = () => {
  

  const dispatch = useDispatch();
  const [guestCount, setGuestCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDineInTakeAwayModalOpen, setIsDineInTakeAwayModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openDineInTakeAwayModal = () => {
    console.log("Opening DineInTakeAwayModal"); // Debugging
    setIsDineInTakeAwayModalOpen(true);
  };

  const closeDineInTakeAwayModal = () => {
    console.log("Closing DineInTakeAwayModal"); // Debugging
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
    // Set default values if name or phone is empty
    const customerName = name.trim() || "Seated Customer"; // Default name
    const customerPhone = phone.trim() || "N/A"; // Default phone

    // Dispatch customer details including default values
    dispatch(setCustomer({
      name: customerName,
      phone: customerPhone,
      guests: guestCount,
      orderType: "Dine-in"
    }));
    navigate("/Tables");
  };


  const handleDelivery = () => {
    // Dispatch default values for Take Away
    dispatch(
      setCustomer({
        name: "Walk-In Customer", // Default name
        phone: "N/A", // Default phone
        guests: 0, // No guests for Take Away
        orderType: "Delivery", // Set orderType
      })
    );
    closeDineInTakeAwayModal();
    navigate("/Menu"); // Redirect to menu
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around'>
      {/* Buttons for navigation */}
      <button onClick={() => navigate("/")} className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
        <FaHome className="inline mr-2 " size={30} /><p>Home</p>
      </button>

      <button onClick={() => navigate("/Orders")} className={`flex items-center justify-center font-bold ${isActive("/Orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
        <MdOutlineReorder className="inline mr-2 " size={30} /><p>Orders</p>
      </button>

      <button onClick={() => navigate("/Tables")} className={`flex items-center justify-center font-bold ${isActive("/Tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"} w-[300px] rounded-[20px]`}>
        <MdOutlineTableRestaurant className="inline mr-2" size={30} /><p>Tables</p>
      </button>

      <button className="flex items-center justify-center text-[#ababab] w-[200px]"><CiCircleMore className="inline mr-2" size={30} /><p>More</p></button>

      {/* Button to open DineInTakeAwayModal */}
      <button
        disabled={isActive("/Tables") || isActive("/menu")}
        // onClick={openDineInTakeAwayModal}
        onClick={() => {
          openDineInTakeAwayModal();
          // Set editingMode to false in Redux (new order)
          dispatch(setEditingMode(false));// to change update order to place order button
          dispatch(removeAllItems()); //to empty the cart
          
        }}
        className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-3 items-center"
      >
        <BiSolidDish size={30} />
      </button>

      {/* DineInTakeAwayModal */}
      <DineInTakeAwayModal
        isOpen={isDineInTakeAwayModalOpen} // Pass isOpen prop
        onClose={closeDineInTakeAwayModal} // Pass onClose prop
        onDineIn={() => {
          
          closeDineInTakeAwayModal();
          openModal();
          


        }}
        handleTakeAway={() => {
          // Dispatch default values for Take Away
          dispatch(
            setCustomer({
              name: "Walk-In Customer", // Default name
              phone: "N/A", // Default phone
              guests: 0, // No guests for Take Away
              orderType: "Take Away", // Set orderType
            })
          );
          closeDineInTakeAwayModal();
          navigate("/Menu"); // Redirect to menu
        }}
        handleDelivery={handleDelivery} // Pass onDelivery prop
      />

      {/* Modal for Dine-In details */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium tracking-wide">Customer Name</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Customer Name" className="bg-transparent flex-1 text-white focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium tracking-wide">Customer Phone Number</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" placeholder="+92-3XX-XXXXXXX" className="bg-transparent flex-1 text-white focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-2xl cursor-pointer">&minus;</button>
            <span className="text-white">{guestCount} person</span>
            <button onClick={increment} className="text-yellow-500 text-2xl cursor-pointer">&#43;</button>
          </div>
        </div>
        <button onClick={handleCreateOrder} className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default BottomNav;
