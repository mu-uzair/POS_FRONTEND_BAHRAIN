import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const BackButton = () => {

    const navigate = useNavigate();
  return (
    <button onClick={()=> navigate(-1)} className='bg-[#025cca] p-3 text-xl font-bold rounded-full text-white -translate-x-5'><IoMdArrowRoundBack />
</button>
  )
}

export default BackButton
