import React, { useEffect, useRef } from 'react'
import { FaNotesMedical } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { addItems, removeItem } from '../../redux/slice/cartSlice';

const CartInfo = () => {


    const cartData = useSelector(state => state.cart);
    const scrolLRef = useRef();
    const dispatch =useDispatch();

    useEffect(()=>{
if(scrolLRef.current){
    scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
    })
}
    },[cartData])

    const handleRemove = (itemId) =>{
        // console.log(itemId)
        dispatch(removeItem(itemId))
    }

    const handleAdd =(item) => {
        // console.log("item details: ", item)
        dispatch(addItems(item))

    }

    return (
        <div>
            <div className='px-4 py-2'>
                <h1 className='text-lg text-[#e4e4e4] font-semibold tracking-wide'>Order Details</h1>
                <div className='mt-4 overflow-y-scroll hidden-scrollbar h-[380px]' ref={scrolLRef}>


                    {cartData.length === 0 ? (
                        <p className='text-[#ababab] text-s flex justify-center items-center h-[380px]'>Order not started. Add menu items to continue!</p>) :
                         cartData.map((item) => {
                        return (
                            <div className='bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2'>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-[#ababab] font-semibold tracking-wide text-md'>{item.name}</h1>
                                    <p className='text-[#ababab] font-semibold'>x{item.quantity}</p>
                                </div>
                                <div className='flex items-center justify-between mt-3'>
                                    <div className='flex items-center gap-3'>
                                        <RiDeleteBin2Fill
                                        onClick={()=>handleRemove(item.id)}
                                        className="text-[#ababab] cursor-pointer" size={20} />
                                        <FaNotesMedical 
                                        onClick={()=>handleAdd(item)}
                                        className="text-[#ababab] cursor-pointer" size={20} />
                                    </div>
                                    <p className='text-[#f5f5f5] text-md font-bold'>Rs {item.price}</p>
                                </div>
                            </div>)
                    })}
                </div>
            </div>
        </div>
    )
}

export default CartInfo
