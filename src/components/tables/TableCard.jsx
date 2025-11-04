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


// import React from 'react'
// import { getAvatarName, getRandomBG } from '../../utils'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { updateTable } from '../../redux/slice/customerSlice'
// import { FaLongArrowAltRight } from 'react-icons/fa'

// const TableCard = ({id, name, status, initials, seats}) => {
//    const dispatch = useDispatch();
//    
//     const navigate = useNavigate();
//     
//     // Using a simple function name without passing 'name' again, as it's a prop
//     const handleClick = () =>{ 
//         if(status === "Booked") return;
//         
//         // ✅ FIX: Create the COMPLETE table object here 
//         const table = { 
//           // Assuming 'id' is the MongoDB _id and 'name' is the table number
//           tableId: id, 
//           tableNo: name, 
//           status: status,
//           seats: seats,
//           // If you need the initials, you can add them too: initials: initials,
//         };

//         // ✅ FIX: Dispatch the complete object directly as the payload
//         // This ensures the Redux state holds the full details
//         dispatch(updateTable(table)); 
//         
//         navigate(`/menu`);
//     }
//    
//     return (
//         <div onClick={handleClick} key={id} className='w-[350px] bg-[#262626] p-4 rounded-lg mb-4 cursor-pointer transition-transform hover:scale-105'>
//             <div className='flex items-center justify-between px-1'>
//                 <h1 className='text-[#f5f5f5] text-xl font-semibold'>Table <FaLongArrowAltRight
//                  className='text-[#ababab] ml-2 inline'/> {name}</h1>
//                 <p className={`${status === "Booked" ? "text-green-600 bg-[#2e4a40]" : "text-white bg-[#664a04]"} px-2 py-1 rounded-lg`}>
//   {status}
// </p>


//             </div>
//             <div className='flex justify-center my-5'>
//             <h1 
//                     className="text-white rounded-full p-4 text-2xl" 
//                     style={{ backgroundColor: initials ?  getRandomBG() : "#1f1f1f"}}  // ✅ Apply inline styles
//                 >
//   {getAvatarName(initials) || "N/A"}
// </h1>


//             </div>
//             <p className='text-[#ababab] text-xs'>
//                 Seats: <span className='text-[#f5f5f5]'>
//                 {seats}
//                 </span>
//             </p>
//         </div>
//     )
// }

// export default TableCard;
