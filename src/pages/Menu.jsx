import React from 'react'
import BottomNav from '../components/shared/BottomNav'
import BackButton from "../components/shared/BackButton"
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from '../components/Menu/MenuContainer';
import { useSelector } from 'react-redux';
import { FaNotesMedical } from 'react-icons/fa';
import { RiDeleteBin2Fill } from "react-icons/ri";
import CustomerInfo from '../components/Menu/CustomerInfo';
import CartInfo from '../components/Menu/CartInfo';
import BillInfo from '../components/Menu/BillInfo';




const Menu = () => {
    

    const customerData = useSelector(state => state.customer);

    

    return (
        <div>
            <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">



                {/* LEFT DIV */}
                <div className="flex-[3] ">


                    <div className="flex items-center justify-between px-10 py-2 mt-2">
                        <div className="flex items-center ">
                            <BackButton />
                            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider ">Menu</h1>

                        </div>
                        <div className="flex items-center justify-around gap-4 ">
                            <div className="flex item-center gap-3 cursor-pointer">
                                <MdRestaurantMenu className="text-[#f5f5f5] text-4xl translate-y-.5" />
                                <div className="flex flex-col items-start">
                                    <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">{customerData.customerName || "Customer Name"}</h1>

                                    <p className="text-xs text-[#ababab] font-medium">Table : {customerData.table?.tableNo || "N/A"}</p>
                                </div>

                            </div>

                        </div>
                    </div>

                    <MenuContainer />

                </div>
                {/* RIGHT DIV */}
                <div className="flex-[1] bg-[#1a1a1a] mt-2 mb-2 mr-3 h-[900px] rounded-lg pt-2 hidden-scrollbar">

                    {/* customer info */}
                    <CustomerInfo/>
                    <hr className='border-[#2a2a2a] border-t-2' />
                    {/* cart Items   */}

                    <CartInfo/>
                    <hr className='border-[#2a2a2a] border-t-2' />

                    {/* Bill Info */}
                    <BillInfo/>


                </div>


                <BottomNav />
            </section>
        </div>
    )
}

export default Menu
