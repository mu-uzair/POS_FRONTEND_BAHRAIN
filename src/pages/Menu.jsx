// import React from 'react'
// import BottomNav from '../components/shared/BottomNav'
// import BackButton from "../components/shared/BackButton"
// import { MdRestaurantMenu } from "react-icons/md";
// import MenuContainer from '../components/Menu/MenuContainer';
// import { useSelector } from 'react-redux';
// import { FaNotesMedical } from 'react-icons/fa';
// import { RiDeleteBin2Fill } from "react-icons/ri";
// import CustomerInfo from '../components/Menu/CustomerInfo';
// import CartInfo from '../components/Menu/CartInfo';
// import BillInfo from '../components/Menu/BillInfo';




// const Menu = () => {
    

//     const customerData = useSelector(state => state.customer);

    

//     return (
//         <div>
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">



//                 {/* LEFT DIV */}
//                 <div className="flex-[3] ">


//                     <div className="flex items-center justify-between px-10 py-2 mt-2">
//                         <div className="flex items-center ">
//                             <BackButton />
//                             <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider ">Menu</h1>

//                         </div>
//                         <div className="flex items-center justify-around gap-4 ">
//                             <div className="flex item-center gap-3 cursor-pointer">
//                                 <MdRestaurantMenu className="text-[#f5f5f5] text-4xl translate-y-.5" />
//                                 <div className="flex flex-col items-start">
//                                     <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">{customerData.customerName || "Customer Name"}</h1>

//                                     <p className="text-xs text-[#ababab] font-medium">Table : {customerData.table?.tableNo || "N/A"}</p>
//                                 </div>

//                             </div>

//                         </div>
//                     </div>

//                     <MenuContainer />

//                 </div>
//                 {/* RIGHT DIV */}
//                 <div className="flex-[1] bg-[#1a1a1a] mt-2 mb-2 mr-3 h-[900px] rounded-lg pt-2 hidden-scrollbar">

//                     {/* customer info */}
//                     <CustomerInfo/>
//                     <hr className='border-[#2a2a2a] border-t-2' />
//                     {/* cart Items   */}

//                     <CartInfo/>
//                     <hr className='border-[#2a2a2a] border-t-2' />

//                     {/* Bill Info */}
//                     <BillInfo/>


//                 </div>


//                 <BottomNav />
//             </section>
//         </div>
//     )
// }

// export default Menu



// this is the correct cod efor the scrollbar issue of dishes
// import React from 'react'
// import BottomNav from '../components/shared/BottomNav'
// import BackButton from "../components/shared/BackButton"
// import { MdRestaurantMenu } from "react-icons/md";
// import MenuContainer from '../components/Menu/MenuContainer';
// import { useSelector } from 'react-redux';
// import { FaNotesMedical } from 'react-icons/fa';
// import { RiDeleteBin2Fill } from "react-icons/ri";
// import CustomerInfo from '../components/Menu/CustomerInfo';
// import CartInfo from '../components/Menu/CartInfo';
// import BillInfo from '../components/Menu/BillInfo';

// const Menu = () => {
//     const customerData = useSelector(state => state.customer);

//     return (
//         <div>
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
//                 {/* LEFT DIV */}
//                 <div className="flex-[3] flex flex-col min-h-0">
//                     <div className="flex items-center justify-between px-10 py-2 mt-2 flex-shrink-0">
//                         <div className="flex items-center">
//                             <BackButton />
//                             <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Menu</h1>
//                         </div>
//                         <div className="flex items-center justify-around gap-4">
//                             <div className="flex item-center gap-3 cursor-pointer">
//                                 <MdRestaurantMenu className="text-[#f5f5f5] text-4xl translate-y-.5" />
//                                 <div className="flex flex-col items-start">
//                                     <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
//                                         {customerData.customerName || "Customer Name"}
//                                     </h1>
//                                     <p className="text-xs text-[#ababab] font-medium">
//                                         Table : {customerData.table?.tableNo || "N/A"}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex-1 min-h-0 overflow-hidden">
//                         <MenuContainer />
//                     </div>
//                 </div>

//                 {/* RIGHT DIV */}
//                 <div className="flex-[1] bg-[#1a1a1a] mt-2 mb-2 mr-3 h-[900px] rounded-lg pt-2 hidden-scrollbar">
//                     {/* customer info */}
//                     <CustomerInfo />
//                     <hr className='border-[#2a2a2a] border-t-2' />
//                     {/* cart Items */}
//                     <CartInfo />
//                     <hr className='border-[#2a2a2a] border-t-2' />
//                     {/* Bill Info */}
//                     <BillInfo />
//                 </div>

//                 <BottomNav />
//             </section>
//         </div>
//     )
// }

// export default Menu

// code for testign the mobile cart drawer

// import React, { useState } from 'react'
// import BottomNav from '../components/shared/BottomNav'
// import BackButton from "../components/shared/BackButton"
// import { MdRestaurantMenu } from "react-icons/md";
// import { FiShoppingCart } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";
// import MenuContainer from '../components/Menu/MenuContainer';
// import { useSelector } from 'react-redux';
// import CustomerInfo from '../components/Menu/CustomerInfo';
// import CartInfo from '../components/Menu/CartInfo';
// import BillInfo from '../components/Menu/BillInfo';




// const emptyArray = []; // ✅ Memoized fallback

// const Menu = () => {
//   const customerData = useSelector(state => state.customer);
//   console.log("customerData in Menu:", customerData);
//   const cartItems = useSelector(state => state.cart?.cart ?? emptyArray); // ✅ No new array each render
//   const [isCartOpen, setIsCartOpen] = useState(false);
  
//   const totalItems = Array.isArray(cartItems)
//     ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
//     : 0;
//     return (
//         <div>
//             <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex flex-col lg:flex-row gap-3">
//                 {/* LEFT DIV */}
//                 <div className="flex-[3] flex flex-col min-h-0 relative">
//                     <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-2 mt-2 flex-shrink-0">
//                         <div className="flex items-center">
//                             <BackButton />
//                             <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">Menu</h1>
//                         </div>
//                         <div className="flex items-center justify-around gap-2 sm:gap-4">
//                             <div className="flex item-center gap-2 sm:gap-3 cursor-pointer">
//                                 <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl translate-y-.5" />
//                                 <div className="flex flex-col items-start">
//                                     <h1 className="text-sm sm:text-md text-[#f5f5f5] font-semibold tracking-wide">
//                                         {customerData.customerName || "Customer Name"}
//                                     </h1>
//                                     <p className="text-xs text-[#ababab] font-medium">
//                                         Table : {customerData.table?.tableNo || "N/A"}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex-1 min-h-0 overflow-hidden">
//                         <MenuContainer />
//                     </div>

//                     {/* Floating Cart Button - Only visible on mobile/tablet */}
//                     <button
//                         onClick={() => setIsCartOpen(true)}
//                         className="lg:hidden fixed bottom-24 right-6 bg-yellow-500 text-black rounded-full p-4 shadow-lg z-50 hover:bg-yellow-600 transition-all"
//                         aria-label="Open Cart"
//                     >
//                         <FiShoppingCart size={24} />
//                         {totalItems > 0 && (
//                             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
//                                 {totalItems}
//                             </span>
//                         )}
//                     </button>

//                     {/* Mobile Cart Modal/Drawer */}
//                     {isCartOpen && (
//                         <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
//                             <div 
//                                 className="absolute right-0 top-0 h-full w-full sm:w-96 bg-[#1a1a1a] shadow-xl overflow-y-auto"
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 {/* Close Button */}
//                                 <div className="sticky top-0 bg-[#1a1a1a] z-10 p-4 flex items-center justify-between border-b-2 border-[#2a2a2a]">
//                                     <h2 className="text-white text-xl font-bold">Your Order</h2>
//                                     <button 
//                                         onClick={() => setIsCartOpen(false)}
//                                         className="text-white hover:text-red-500 transition-colors"
//                                         aria-label="Close Cart"
//                                     >
//                                         <IoClose size={28} />
//                                     </button>
//                                 </div>

//                                 {/* Cart Content */}
//                                 <div className="p-4">
//                                     <CustomerInfo />
//                                     <hr className='border-[#2a2a2a] border-t-2 my-4' />
//                                     <CartInfo />
//                                     <hr className='border-[#2a2a2a] border-t-2 my-4' />
//                                     <BillInfo />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* RIGHT DIV - Hidden on mobile and tablet, visible on large screens */}
//                 <div className="hidden lg:flex lg:flex-[1] bg-[#1a1a1a] mt-2 mb-2 mr-3 rounded-lg pt-2 flex-col overflow-hidden">
//                     {/* customer info */}
//                     <CustomerInfo />
//                     <hr className='border-[#2a2a2a] border-t-2' />
//                     {/* cart Items */}
//                     <CartInfo />
//                     <hr className='border-[#2a2a2a] border-t-2' />
//                     {/* Bill Info */}
//                     <BillInfo />
//                 </div>

//                 <BottomNav />
//             </section>
//         </div>
//     )
// }

// export default Menu


// import React, { useState } from 'react'
// import BottomNav from '../components/shared/BottomNav'
// import BackButton from "../components/shared/BackButton"
// import { MdRestaurantMenu } from "react-icons/md";
// import { FiShoppingCart } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";
// import MenuContainer from '../components/Menu/MenuContainer';
// import { useSelector } from 'react-redux';
// import CustomerInfo from '../components/Menu/CustomerInfo';
// import CartInfo from '../components/Menu/CartInfo';
// import BillInfo from '../components/Menu/BillInfo';

// const emptyArray = []; // ✅ Memoized fallback

// const Menu = () => {
//   const customerData = useSelector(state => state.customer);
//   console.log("customerData in Menu:", customerData);
//   const cartItems = useSelector(state => state.cart?.cart ?? emptyArray); // ✅ No new array each render
//   const [isCartOpen, setIsCartOpen] = useState(false);
  
//   const totalItems = Array.isArray(cartItems)
//     ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
//     : 0;

//   return (
//     <div>
//       <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex flex-col lg:flex-row lg:gap-4 xl:gap-6 lg:p-3 xl:p-4">
//         {/* LEFT DIV */}
//         <div className="flex-[3] flex flex-col min-h-0 relative lg:bg-[#1a1a1a] lg:rounded-lg lg:overflow-hidden">
//           <div className="flex items-center justify-between px-4 sm:px-6 lg:px-6 xl:px-8 py-4 lg:py-4 xl:py-6 flex-shrink-0">
//             <div className="flex items-center gap-2 lg:gap-3">
//               <BackButton />
//               <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-xl xl:text-2xl font-bold tracking-wider">Menu</h1>
//             </div>
//             <div className="flex items-center justify-around gap-2 sm:gap-4">
//               <div className="flex item-center gap-2 sm:gap-3 cursor-pointer">
//                 <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl lg:text-3xl xl:text-4xl translate-y-.5" />
//                 <div className="flex flex-col items-start">
//                   <h1 className="text-sm sm:text-md lg:text-sm xl:text-md text-[#f5f5f5] font-semibold tracking-wide">
//                     {customerData.customerName || "Customer Name"}
//                   </h1>
//                   <p className="text-xs lg:text-[11px] xl:text-xs text-[#ababab] font-medium">
//                     Table : {customerData.table?.tableNo || "N/A"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-6 xl:px-8 pb-4">
//             <MenuContainer />
//           </div>

//           {/* Floating Cart Button - Only visible on mobile/tablet */}
//           <button
//             onClick={() => setIsCartOpen(true)}
//             className="lg:hidden fixed bottom-24 right-6 bg-yellow-500 text-black rounded-full p-4 shadow-lg z-50 hover:bg-yellow-600 transition-all"
//             aria-label="Open Cart"
//           >
//             <FiShoppingCart size={24} />
//             {totalItems > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
//                 {totalItems}
//               </span>
//             )}
//           </button>

//           {/* Mobile Cart Modal/Drawer */}
//           {isCartOpen && (
//             <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
//               <div 
//                 className="absolute right-0 top-0 h-full w-full sm:w-96 bg-[#1a1a1a] shadow-xl overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Close Button */}
//                 <div className="sticky top-0 bg-[#1a1a1a] z-10 p-4 flex items-center justify-between border-b-2 border-[#2a2a2a]">
//                   <h2 className="text-white text-xl font-bold">Your Order</h2>
//                   <button 
//                     onClick={() => setIsCartOpen(false)}
//                     className="text-white hover:text-red-500 transition-colors"
//                     aria-label="Close Cart"
//                   >
//                     <IoClose size={28} />
//                   </button>
//                 </div>

//                 {/* Cart Content */}
//                 <div className="p-4">
//                   <CustomerInfo />
//                   <hr className='border-[#2a2a2a] border-t-2 my-4' />
//                   <CartInfo />
//                   <hr className='border-[#2a2a2a] border-t-2 my-4' />
//                   <BillInfo />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT DIV - Hidden on mobile and tablet, visible on large screens */}
//         <div className="hidden lg:flex lg:flex-[1.2] xl:flex-[1] bg-[#1a1a1a] rounded-lg flex-col overflow-hidden max-h-full">
//           {/* Customer Info - Fixed Header */}
//           <div className="flex-shrink-0 p-4 xl:p-6">
//             <CustomerInfo />
//           </div>
          
//           <hr className='border-[#2a2a2a] border-t-2' />
          
//           {/* Cart Items - Scrollable Section */}
//           <div className="flex-1 overflow-y-auto px-4 xl:px-6 py-3 xl:py-4 min-h-0">
//             <CartInfo />
//           </div>
          
//           <hr className='border-[#2a2a2a] border-t-2' />
          
//           {/* Bill Info - Fixed Footer */}
//           <div className="flex-shrink-0 p-4 xl:p-6">
//             <BillInfo />
//           </div>
//         </div>

//         <BottomNav />
//       </section>
//     </div>
//   )
// }

// export default Menu


import React, { useState } from 'react'
import BottomNav from '../components/shared/BottomNav'
import BackButton from "../components/shared/BackButton"
import { MdRestaurantMenu } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import MenuContainer from '../components/Menu/MenuContainer';
import { useSelector } from 'react-redux';
import CustomerInfo from '../components/Menu/CustomerInfo';
import CartInfo from '../components/Menu/CartInfo';
import BillInfo from '../components/Menu/BillInfo';

const emptyArray = [];

const Menu = () => {
  const customerData = useSelector(state => state.customer);
  console.log("customerData in Menu:", customerData);
  const cartItems = useSelector(state => state.cart?.cart ?? emptyArray);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  return (
    <div>
      <section className="bg-[#1f1f1f] h-[calc(100vh-6rem)] overflow-hidden flex flex-col lg:flex-row lg:gap-3 xl:gap-4 2xl:gap-5 lg:p-2 xl:p-3 2xl:p-4">
        {/* LEFT DIV */}
        <div className="flex-[3] flex flex-col min-h-0 relative lg:bg-[#1a1a1a] lg:rounded-lg lg:overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 py-3 lg:py-3 xl:py-4 2xl:py-5 flex-shrink-0">
            <div className="flex items-center gap-2 lg:gap-2 xl:gap-3">
              <BackButton />
              <h1 className="text-[#f5f5f5] text-xl sm:text-2xl lg:text-lg xl:text-xl 2xl:text-2xl font-bold tracking-wider">
                Menu
              </h1>
            </div>
            <div className="flex items-center justify-around gap-2 sm:gap-4">
              <div className="flex item-center gap-2 sm:gap-3 lg:gap-2 xl:gap-3 cursor-pointer">
                <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl lg:text-2xl xl:text-3xl 2xl:text-4xl translate-y-.5" />
                <div className="flex flex-col items-start">
                  <h1 className="text-sm sm:text-md lg:text-xs xl:text-sm 2xl:text-md text-[#f5f5f5] font-semibold tracking-wide">
                    {customerData.customerName || "Customer Name"}
                  </h1>
                  <p className="text-xs lg:text-[10px] xl:text-xs 2xl:text-xs text-[#ababab] font-medium">
                    Table : {customerData.table?.tableNo || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Container */}
          <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 pb-3 lg:pb-2 xl:pb-3 2xl:pb-4">
            <MenuContainer />
          </div>

          {/* Floating Cart Button - Mobile/Tablet */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="lg:hidden fixed bottom-24 right-6 bg-yellow-500 text-black rounded-full p-4 shadow-lg z-50 hover:bg-yellow-600 transition-all"
            aria-label="Open Cart"
          >
            <FiShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Cart Modal */}
          {isCartOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
              <div 
                className="absolute right-0 top-0 h-full w-full sm:w-96 bg-[#1a1a1a] shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-[#1a1a1a] z-10 p-4 flex items-center justify-between border-b-2 border-[#2a2a2a]">
                  <h2 className="text-white text-xl font-bold">Your Order</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-white hover:text-red-500 transition-colors"
                    aria-label="Close Cart"
                  >
                    <IoClose size={28} />
                  </button>
                </div>
                <div className="p-4">
                  <CustomerInfo />
                  <hr className='border-[#2a2a2a] border-t-2 my-4' />
                  <CartInfo />
                  <hr className='border-[#2a2a2a] border-t-2 my-4' />
                  <BillInfo />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT DIV - Desktop Cart */}
        <div className="hidden lg:flex lg:flex-[1.3] xl:flex-[1.2] 2xl:flex-[1] bg-[#1a1a1a] rounded-lg flex-col overflow-hidden">
          {/* Customer Info - Fixed */}
          <div className="flex-shrink-0 p-3 xl:p-4 2xl:p-5 border-b-2 border-[#2a2a2a]">
            <CustomerInfo />
          </div>
          
          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 xl:px-4 2xl:px-5 py-2 xl:py-3 2xl:py-4 min-h-0 border-b-2 border-[#2a2a2a]">
            <CartInfo />
          </div>
          
          {/* Bill Info - Scrollable with flexible height */}
          <div className="flex-shrink-0 overflow-y-auto px-3 xl:px-4 2xl:px-5 py-3 xl:py-4 2xl:py-5" 
               style={{
                 maxHeight: 'calc(50vh - 100px)',
                 scrollbarWidth: 'thin',
                 scrollbarColor: '#3a3a3a #1f1f1f'
               }}>
            <BillInfo />
          </div>
        </div>

        <BottomNav />
      </section>
    </div>
  )
}

export default Menu;