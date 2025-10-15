import React from 'react'
import { getAvatarName, getRandomBG } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateTable } from '../../redux/slice/customerSlice'
import { FaLongArrowAltRight } from 'react-icons/fa'

const TableCard = ({id, name, status, initials,seats}) => {
   const dispatch = useDispatch();
   
    const navigate = useNavigate();
    const handleClick = (name) =>{
        if(status === "Booked") return;
        const table = { tableId: id, tableNo: name}
        dispatch(updateTable({table}))
        navigate(`/menu`);
    }
   
    return (
        <div onClick={() => handleClick(name)} key={id} className='w-[350px] bg-[#262626] p-4 rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105'>
            <div className='flex items-center justify-between px-1'>
                <h1 className='text-[#f5f5f5] text-xl font-semibold'>Table <FaLongArrowAltRight
                 className='text-[#ababab] ml-2 inline'/> {name}</h1>
                <p className={`${status === "Booked" ? "text-green-600 bg-[#2e4a40]" : "text-white bg-[#664a04]"} px-2 py-1 rounded-lg`}>
  {status}
</p>


            </div>
            <div className='flex justify-center my-5'>
            <h1 
                    className="text-white rounded-full p-4 text-2xl" 
                    style={{ backgroundColor: initials ?  getRandomBG() : "#1f1f1f"}}  // ✅ Apply inline styles
                >
  {getAvatarName(initials) || "N/A"}
</h1>


            </div>
            <p className='text-[#ababab] text-xs'>
                Seats: <span className='text-[#f5f5f5]'>
                {seats}
                </span>
            </p>
        </div>
    )
}

export default TableCard


// chatgpt code for responsiveness
// import React from 'react';

// const TableCard = () => {
//     return (
//         <div className='w-[350px] bg-[#262626] p-4 rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105'>
//             <div className='flex items-center justify-between px-1'>
//                 <h1 className='text-[#f5f5f5] text-xl font-semibold'>Table 1</h1>
//                 <p className='text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg'>
//                     Booked
//                 </p>
//             </div>
//             <div className='flex justify-center my-5'>
//                 <h1 className='bg-[#025cca] text-white rounded-full p-4 text-2xl'>MU</h1>
//             </div>
//         </div>
//     );
// };

// export default TableCard;
