// import React, { useEffect, useRef } from 'react'
// import { FaNotesMedical } from "react-icons/fa6";
// import { RiDeleteBin2Fill } from "react-icons/ri";
// import { useDispatch, useSelector } from 'react-redux';
// import { addItems, removeItem } from '../../redux/slice/cartSlice';

// const CartInfo = () => {


//     const cartData = useSelector(state => state.cart);
//     const scrolLRef = useRef();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (scrolLRef.current) {
//             scrolLRef.current.scrollTo({
//                 top: scrolLRef.current.scrollHeight,
//                 behavior: "smooth"
//             })
//         }
//     }, [cartData])

//     const handleRemove = (itemId) => {
//         // console.log(itemId)
//         dispatch(removeItem(itemId))
//     }

//     const handleAdd = (item) => {
//         // console.log("item details: ", item)
//         dispatch(addItems(item))

//     }

//     return (
//         <div>
//             <div className='px-4 py-2'>
//                 <h1 className='text-lg text-[#e4e4e4] font-semibold tracking-wide'>Order Details</h1>
//                 <div className='mt-4 overflow-y-scroll hidden-scrollbar h-[380px]' ref={scrolLRef}>


//                     {cartData.length === 0 ? (
//                         <p className='text-[#ababab] text-s flex justify-center items-center h-[380px]'>Order not started. Add menu items to continue!</p>) :
//                         cartData.map((item) => {
//                             return (
//                                 <div className='bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2'>
//                                     <div className='flex items-center justify-between'>
//                                         <h1 className='text-[#ababab] font-semibold tracking-wide text-md'>{item.name}  {item.variationName ? ` (${item.variationName})` : ''}
//                                         </h1>
//                                         <p className='text-[#ababab] font-semibold'>x{item.quantity}</p>
//                                     </div>
//                                     <div className='flex items-center justify-between mt-3'>
//                                         <div className='flex items-center gap-3'>
//                                             <RiDeleteBin2Fill
//                                                 onClick={() => handleRemove(item.id)}
//                                                 className="text-[#ababab] cursor-pointer" size={20} />
//                                             <FaNotesMedical
//                                                 // onClick={()=>handleAdd(item)}
//                                                 onClick={() => handleAdd({ ...item, quantity: 1 })}

//                                                 className="text-[#ababab] cursor-pointer" size={20} />
//                                         </div>
//                                         <p className='text-[#f5f5f5] text-md font-bold'>BHD {item.price.toFixed(3)}</p>
//                                     </div>
//                                 </div>)
//                         })}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CartInfo


// import React, { useEffect, useRef } from 'react'
// import { FaNotesMedical } from "react-icons/fa6";
// import { RiDeleteBin2Fill } from "react-icons/ri";
// import { useDispatch, useSelector } from 'react-redux';
// import { addItems, removeItem } from '../../redux/slice/cartSlice';

// const CartInfo = () => {
//     const cartData = useSelector(state => state.cart);
//     const scrollRef = useRef();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTo({
//                 top: scrollRef.current.scrollHeight,
//                 behavior: "smooth"
//             })
//         }
//     }, [cartData])

//     const handleRemove = (itemId) => {
//         dispatch(removeItem(itemId))
//     }

//     const handleAdd = (item) => {
//         dispatch(addItems({ ...item, quantity: 1 }))
//     }

//     return (
//         <div>
//             {/* Header */}
//             <div className='mb-3 lg:mb-4'>
//                 <h1 className='text-lg lg:text-base xl:text-lg text-[#e4e4e4] font-semibold tracking-wide'>
//                     Order Details
//                 </h1>
//             </div>

//             {/* Scrollable Cart Items */}
//             <div 
//                 className='overflow-y-auto pr-1 max-h-[calc(100vh-500px)] lg:max-h-[calc(100vh-420px)] xl:max-h-[calc(100vh-450px)]' 
//                 ref={scrollRef}
//                 style={{
//                     scrollbarWidth: 'thin',
//                     scrollbarColor: '#3a3a3a #1f1f1f'
//                 }}
//             >
//                 {cartData.length === 0 ? (
//                     <div className='flex justify-center items-center h-full min-h-[200px]'>
//                         <p className='text-[#ababab] text-sm lg:text-xs xl:text-sm text-center px-4'>
//                             Order not started. Add menu items to continue!
//                         </p>
//                     </div>
//                 ) : (
//                     <div className='space-y-2 lg:space-y-1.5 xl:space-y-2'>
//                         {cartData.map((item, index) => (
//                             <div 
//                                 key={item.id || index} 
//                                 className='bg-[#1f1f1f] rounded-lg px-3 py-3 lg:px-2.5 lg:py-2.5 xl:px-3 xl:py-3'
//                             >
//                                 {/* Item Name and Quantity */}
//                                 <div className='flex items-start justify-between gap-2'>
//                                     <h1 className='text-[#ababab] font-semibold tracking-wide text-sm lg:text-xs xl:text-sm leading-tight flex-1'>
//                                         {item.name}
//                                         {item.variationName && (
//                                             <span className='text-[#888] text-xs lg:text-[10px] xl:text-xs ml-1'>
//                                                 ({item.variationName})
//                                             </span>
//                                         )}
//                                     </h1>
//                                     <p className='text-[#ababab] font-semibold text-sm lg:text-xs xl:text-sm flex-shrink-0'>
//                                         x{item.quantity}
//                                     </p>
//                                 </div>

//                                 {/* Actions and Price */}
//                                 <div className='flex items-center justify-between mt-2.5 lg:mt-2 xl:mt-2.5'>
//                                     <div className='flex items-center gap-2.5 lg:gap-2 xl:gap-2.5'>
//                                         <RiDeleteBin2Fill
//                                             onClick={() => handleRemove(item.id)}
//                                             className="text-[#ababab] hover:text-red-500 cursor-pointer transition-colors" 
//                                             size={18}
//                                         />
//                                         <FaNotesMedical
//                                             onClick={() => handleAdd(item)}
//                                             className="text-[#ababab] hover:text-green-500 cursor-pointer transition-colors" 
//                                             size={18}
//                                         />
//                                     </div>
//                                     <p className='text-[#f5f5f5] text-sm lg:text-xs xl:text-sm font-bold'>
//                                         BHD {item.price.toFixed(3)}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <style jsx>{`
//                 /* Custom scrollbar for webkit browsers */
//                 div::-webkit-scrollbar {
//                     width: 6px;
//                 }
                
//                 div::-webkit-scrollbar-track {
//                     background: #1f1f1f;
//                     border-radius: 10px;
//                 }
                
//                 div::-webkit-scrollbar-thumb {
//                     background: #3a3a3a;
//                     border-radius: 10px;
//                 }
                
//                 div::-webkit-scrollbar-thumb:hover {
//                     background: #4a4a4a;
//                 }
//             `}</style>
//         </div>
//     )
// }

// export default CartInfo

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
        <div className='h-full flex flex-col'>
            {/* Header - Fixed */}
            <div className='mb-2 lg:mb-2 xl:mb-3 2xl:mb-4 flex-shrink-0'>
                <h1 className='text-lg lg:text-sm xl:text-base 2xl:text-lg text-[#e4e4e4] font-semibold tracking-wide'>
                    Order Details
                </h1>
            </div>

            {/* Scrollable Cart Items - Takes remaining space */}
            <div 
                className='flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0' 
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