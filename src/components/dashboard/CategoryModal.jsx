import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoMdClose } from "react-icons/io";
import { useMutation } from '@tanstack/react-query';
import { addCategory } from '../../https';
import { enqueueSnackbar } from 'notistack';



const CategoryModal = ({setIsCategoryModalOpen}) => {

    const [categoryData, setCategoryData] = useState({
        categoryName: ""
    } );

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setCategoryData((prev) => ({...prev, [name]: value}))
      };

      const handleSubmit =  (e) => {
        e.preventDefault();
        console.log(categoryData)
        categoryMutation.mutate(categoryData);
      };



    const handleCloseCategoryModal = () => {
        setIsCategoryModalOpen(false);
    };

    const categoryMutation = useMutation({
        mutationFn: (reqData) => addCategory(reqData),
        onSuccess: (res) =>{
            setIsCategoryModalOpen(false);
            // const {data} = res;
            if (typeof res.message === 'string') {
                enqueueSnackbar(res.message, { variant: "success" });
            } else {
                enqueueSnackbar("Category added successfully!", { variant: "success" }); // Fallback message
                console.error("Invalid message:", res.message); // Log the invalid message
            }
            
            console.log(res.data);
            // enqueueSnackbar(res.message, {variant: "success"})
            // console.log(data)
        },
        onError: (error) => {
             if (error.response && error.response.data && error.response.data.message) { // Corrected spelling
                    enqueueSnackbar(error.response.data.message, { variant: "error" });
                } else {
                    enqueueSnackbar("An unexpected error occurred.", { variant: "error" });
                    console.error("Error adding category:", error);
                }
        }

    })


  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>

    <motion.div
      initilal={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
    >

      {/* Modal Header */}

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-[#f5f5f5] text-xl font-semi-bold'>
          Add Category
        </h2>
        <button 
        onClick={handleCloseCategoryModal}
         className='text-[#f5f5f5] hover:text-red-500'>
          <IoMdClose size={24} />

        </button>
      </div>

      {/* modal body */}

      <form 
      onSubmit={handleSubmit}
       className='space-y-4 mt-10'>
        <div className="classname">
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Category Name
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="text"
              name='categoryName'
              value={categoryData.categoryName}
              onChange={handleInputChange}

              className='bg-transparent flex-1 text-white focus:outline-none'
              required
            />

          </div>

        </div>

        {/* <div className="classname">
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Disciption
          </label>
          <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
            <input
              type="number"
              name='seats'
            //   value={tableData.seats}
            //   onChange={handleInputChange}

              className='bg-transparent flex-1 text-white focus:outline-none'
              required
            />

          </div>

        </div> */}
        <button type='submit' className='w-full rounded mt-6 py-3 text-lg bg-yellow-400 text-grey-900 font-bold'>
          Add Category</button>
      </form>


    </motion.div>

  </div>
  )
}

export default CategoryModal
