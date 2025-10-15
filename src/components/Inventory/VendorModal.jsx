import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { addVendor } from '../../https/index'; // Import the addVendor API function

const VendorModal = ({ setIsVendorModalOpen }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [vendorData, setVendorData] = useState({
        name: '',
        contact: '',
        address: '',
        notes: ""
    });

    // Mutation for adding a vendor
    const vendorMutation = useMutation({
        mutationFn: (reqData) => addVendor(reqData),
        onSuccess: (res) => {
            console.log("Backend Response (Success):", res);
            setIsVendorModalOpen(false);

            if (res.data && typeof res.data.message === 'string') {
                console.log("Success Message:", res.data.message);
                enqueueSnackbar(res.data.message, { variant: 'success' });
            } else if (res.message) {
                console.log("Success Message:", res.message);
                enqueueSnackbar(res.message, { variant: 'success' });
            } else {
                console.log("No success message found in response. Using fallback message.");
                enqueueSnackbar('Vendor added successfully!', { variant: 'success' });
            }
        },
        onError: (error) => {
            console.error("Error Details:", error);
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    console.log("Error Message:", error.response.data.message);
                    enqueueSnackbar(error.response.data.message, { variant: 'error' });
                } else {
                    console.log("No error message found in response. Using fallback message.");
                    enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
                }
            } else {
                console.log("No response data found. Using fallback message.");
                enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
            }
        },
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVendorData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Vendor Data:", vendorData);
        vendorMutation.mutate(vendorData);
    };

    // Close modal
    const handleCloseVendorModal = () => {
        setIsVendorModalOpen(false);
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 },
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 ">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-gradient-to-br from-[#262626] to-[#1f1f1f] p-8 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-96 max-w-full mx-4 font-sans relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-yellow-400/10 rounded-xl animate-pulse opacity-0 hover:opacity-20 transition-opacity duration-500"></div>

                <div className="flex justify-between items-center mb-6 relative z-10 ">
                    <h2 className="text-[#f5f5f5] text-2xl font-bold tracking-tight">Add Vendor</h2>
                    <button
                        onClick={handleCloseVendorModal}
                        className="text-[#f5f5f5] hover:text-red-500 hover:bg-gray-700 p-1 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Vendor Name */}
                    <motion.div variants={inputVariants} initial="hidden" animate="visible">
                        <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Vendor Name</label>
                        <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
                            <input
                                type="text"
                                name="name"
                                value={vendorData.name}
                                onChange={handleInputChange}
                                className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
                                placeholder="Enter vendor name"
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div variants={inputVariants} initial="hidden" animate="visible">
                        <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Contact 
                        <span className="text-gray-500 text-xs"> (Optional)</span>
                        </label>
                        <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
                            <input
                                type="text"
                                name="contact"
                                value={vendorData.contact}
                                onChange={handleInputChange}
                                className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
                                placeholder="e.g., 123-456-7890"
                            />
                        </div>
                    </motion.div>

                    {/* Address */}
                    <motion.div variants={inputVariants} initial="hidden" animate="visible">
                        <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">Address
                        <span className="text-gray-500 text-xs"> (Optional)</span>
                        </label>
                        <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
                            <input
                                type="text"
                                name="address"
                                value={vendorData.address}
                                onChange={handleInputChange}
                                className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500"
                                placeholder="e.g., 123 Market Street"
                            />
                        </div>
                    </motion.div>

                    {/* Notes */}
                    <motion.div variants={inputVariants} initial="hidden" animate="visible">
                        <label className="block text-sm font-medium text-[#ababab] hover:text-yellow-300">
                            Notes <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <div className="flex items-center rounded-lg bg-[#1f1f1f] border border-gray-600 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30 hover:shadow-lg">
                            <textarea
                                name="notes"
                                value={vendorData.notes}
                                onChange={handleInputChange}
                                className="bg-transparent flex-1 text-white focus:outline-none p-3 placeholder-gray-500 resize-y min-h-[80px]"
                                placeholder="e.g., Delivers on Mondays only"
                            />
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div className="mt-6" variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <button
                            type="submit"
                            className={`w-full rounded py-3 text-lg font-bold transition-all duration-300 ${vendorMutation.isPending
                                    ? 'bg-yellow-300 cursor-not-allowed'
                                    : 'bg-yellow-600 hover:bg-yellow-400 hover:shadow-xl'
                                } text-gray-900 relative overflow-hidden`}
                            disabled={vendorMutation.isPending}
                        >
                            <span className="relative z-10">
                                {vendorMutation.isPending ? 'Adding...' : 'Add Vendor'}
                            </span>
                            {!vendorMutation.isPending && (
                                <span className="absolute inset-0 bg-yellow-500 opacity-0 hover:opacity-30 transition-opacity duration-300"></span>
                            )}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default VendorModal;