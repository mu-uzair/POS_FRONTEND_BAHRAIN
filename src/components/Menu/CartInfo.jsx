import React, { useEffect, useRef } from 'react'
import { FaNotesMedical } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { addItems, removeItem } from '../../redux/slice/cartSlice';

const CartInfo = () => {
    const cartData = useSelector(state => state.cart);
    const scrollRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [cartData])

    const handleRemove = (itemId) => {
        dispatch(removeItem(itemId))
    }

    const handleAdd = (item) => {
        dispatch(addItems({ ...item, quantity: 1 }))
    }

    return (
        <div className='flex flex-col' style={{ maxHeight: 'calc(100vh - 600px)', minHeight: '150px' }}>
            {/* Header - Fixed */}
            <div className='mb-2 lg:mb-2 xl:mb-3 2xl:mb-4 flex-shrink-0'>
                <h1 className='text-lg lg:text-sm xl:text-base 2xl:text-lg text-[#e4e4e4] font-semibold tracking-wide'>
                    Order Details
                </h1>
            </div>

            {/* Scrollable Cart Items - Takes remaining space */}
            <div 
                className='flex-1 overflow-y-auto overflow-x-hidden pr-1'
                ref={scrollRef}
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#3a3a3a #1f1f1f'
                }}
            >
                {cartData.length === 0 ? (
                    <div className='flex justify-center items-center h-full min-h-[150px]'>
                        <p className='text-[#ababab] text-sm lg:text-xs xl:text-sm 2xl:text-sm text-center px-4'>
                            Order not started. Add menu items to continue!
                        </p>
                    </div>
                ) : (
                    <div className='space-y-2 lg:space-y-1.5 xl:space-y-2 pb-2'>
                        {cartData.map((item, index) => (
                            <div 
                                key={item.id || index} 
                                className='bg-[#1f1f1f] rounded-lg px-3 py-2.5 lg:px-2 lg:py-2 xl:px-2.5 xl:py-2.5 2xl:px-3 2xl:py-3'
                            >
                                {/* Item Name and Quantity */}
                                <div className='flex items-start justify-between gap-2'>
                                    <h1 className='text-[#ababab] font-semibold tracking-wide text-sm lg:text-[11px] xl:text-xs 2xl:text-sm leading-tight flex-1'>
                                        {item.name}
                                        {item.variationName && (
                                            <span className='text-[#888] text-xs lg:text-[10px] xl:text-[11px] 2xl:text-xs ml-1'>
                                                ({item.variationName})
                                            </span>
                                        )}
                                    </h1>
                                    <p className='text-[#ababab] font-semibold text-sm lg:text-[11px] xl:text-xs 2xl:text-sm flex-shrink-0'>
                                        x{item.quantity}
                                    </p>
                                </div>

                                {/* Actions and Price */}
                                <div className='flex items-center justify-between mt-2 lg:mt-1.5 xl:mt-2'>
                                    <div className='flex items-center gap-2.5 lg:gap-1.5 xl:gap-2 2xl:gap-2.5'>
                                        <RiDeleteBin2Fill
                                            onClick={() => handleRemove(item.id)}
                                            className="text-[#ababab] hover:text-red-500 cursor-pointer transition-colors" 
                                            size={16}
                                        />
                                        <FaNotesMedical
                                            onClick={() => handleAdd(item)}
                                            className="text-[#ababab] hover:text-green-500 cursor-pointer transition-colors" 
                                            size={16}
                                        />
                                    </div>
                                    <p className='text-[#f5f5f5] text-sm lg:text-[11px] xl:text-xs 2xl:text-sm font-bold'>
                                        BHD {item.price.toFixed(3)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                div::-webkit-scrollbar {
                    width: 5px;
                }
                
                div::-webkit-scrollbar-track {
                    background: #1f1f1f;
                    border-radius: 10px;
                }
                
                div::-webkit-scrollbar-thumb {
                    background: #3a3a3a;
                    border-radius: 10px;
                }
                
                div::-webkit-scrollbar-thumb:hover {
                    background: #4a4a4a;
                }
            `}</style>
        </div>
    )
}

export default CartInfo;
