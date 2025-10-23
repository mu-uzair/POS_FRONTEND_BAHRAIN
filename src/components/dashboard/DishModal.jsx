


// changes made for the new section kitchen, grill

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoClose, IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCategories, addDish } from '../../https';
import { useSnackbar } from 'notistack';

const DishModal = ({ setIsDishModalOpen }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [dishData, setDishData] = useState({
        dishName: '',
        category: '',
        section: '', // 👈 NEW FIELD
    });

    const [variations, setVariations] = useState([
        { name: '', price: '', isDefault: true },
    ]);

    // --- Fetch Categories ---
    const { data: resData, isError, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['category'],
        queryFn: getCategories,
        onError: () => enqueueSnackbar('Failed to fetch categories.', { variant: 'error' }),
    });

    // --- Variation Handlers ---
    const addVariation = () => {
        setVariations([...variations, { name: '', price: '', isDefault: false }]);
    };

    const removeVariation = (index) => {
        if (variations.length > 1) {
            setVariations(variations.filter((_, i) => i !== index));
        } else {
            enqueueSnackbar('A dish must have at least one variation.', { variant: 'warning' });
        }
    };

    const handleVariationChange = (index, field, value) => {
        const newVariations = variations.map((v, i) =>
            i === index ? { ...v, [field]: value } : v
        );
        setVariations(newVariations);
    };

    const setDefaultVariation = (index) => {
        const newVariations = variations.map((v, i) => ({
            ...v,
            isDefault: i === index,
        }));
        setVariations(newVariations);
    };

    // --- Input Handler ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDishData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseDishModal = () => {
        setIsDishModalOpen(false);
    };

    // --- Add Dish Mutation ---
    const dishMutation = useMutation({
        mutationFn: addDish,
        onSuccess: (res) => {
            setIsDishModalOpen(false);
            const message = res?.data?.message || res.message || 'Dish added successfully!';
            enqueueSnackbar(message, { variant: 'success' });
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || error.message || 'An unexpected error occurred.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        },
    });

    // --- Submit Logic ---
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!dishData.dishName || !dishData.category) {
            enqueueSnackbar("Please fill in Dish Name and select a Category.", { variant: 'error' });
            return;
        }

        let validationFailed = false;
        const formattedVariations = variations
            .filter(v => v.name && v.price !== '')
            .map(v => {
                if (validationFailed) return null;

                const priceFloat = parseFloat(v.price);
                if (isNaN(priceFloat) || priceFloat < 0) {
                    enqueueSnackbar(`Invalid price for variation: ${v.name || 'Unnamed Variation'}.`, { variant: 'error' });
                    validationFailed = true;
                    return null;
                }
                // const priceInSmallestUnit = Math.round(parseFloat(v.price).toFixed(3) * 1000);

                // return {
                //     name: v.name.trim(),
                //     price: priceInSmallestUnit,
                //     isDefault: v.isDefault,
                // };
                return {
                    name: v.name.trim(),
                    price: parseFloat(parseFloat(v.price).toFixed(3)), // keep 3 decimals only
                    isDefault: v.isDefault,
                };
            })
            .filter(v => v !== null);

        if (validationFailed) return;

        if (formattedVariations.length === 0) {
            enqueueSnackbar("A dish must have at least one valid variation.", { variant: 'error' });
            return;
        }

        const hasDefault = formattedVariations.some(v => v.isDefault);
        if (!hasDefault && formattedVariations.length > 0) {
            formattedVariations[0].isDefault = true;
        }

        const finalDishPayload = {
            ...dishData,
            section: dishData.section || null, // 👈 Convert empty string to null
            variations: formattedVariations,
        };

        console.log("Final Payload Sent:", finalDishPayload);
        dishMutation.mutate(finalDishPayload);
    };

    const isPending = dishMutation.isPending;

    // --- Component Render ---
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-[#262626] p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-[#3a3a3a] pb-3">
                    <h2 className="text-[#f5f5f5] text-2xl font-bold">Add New Dish</h2>
                    <button
                        onClick={handleCloseDishModal}
                        className="text-[#f5f5f5] hover:text-red-500 transition-colors p-1"
                    >
                        <IoClose size={28} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Dish Name */}
                    <div>
                        <label className="block text-[#ababab] mb-2 text-sm font-medium">Dish Name</label>
                        <input
                            type="text"
                            name="dishName"
                            value={dishData.dishName}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-[#1f1f1f] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-[#ababab] mb-2 text-sm font-medium">Category</label>
                        <select
                            name="category"
                            value={dishData.category}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-[#1f1f1f] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                            disabled={isCategoriesLoading || isError}
                        >
                            <option value="" disabled>
                                {isCategoriesLoading ? 'Loading categories...' : 'Select a category'}
                            </option>
                            {resData?.data?.data?.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                            {isError && (
                                <option value="" disabled>Error loading categories</option>
                            )}
                        </select>
                    </div>

                    {/* Section Dropdown 👇 */}
                    <div>
                        <label className="block text-[#ababab] mb-2 text-sm font-medium">Section</label>
                        <select
                            name="section"
                            value={dishData.section}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-[#1f1f1f] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">None</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Grill">Grill</option>
                        </select>
                    </div>

                    {/* Variations */}
                    <div className="p-4 bg-[#1f1f1f] rounded-lg border border-[#3a3a3a]">
                        <h3 className="text-lg font-bold mb-3 text-yellow-400">Variations</h3>

                        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 border-b border-[#3a3a3a] pb-2 mb-2">
                            <span className="col-span-6">Name</span>
                            <span className="col-span-3 text-right">Price</span>
                            <span className="col-span-2 text-center">Default</span>
                            <span className="col-span-1"></span>
                        </div>

                        {variations.map((v, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-center">
                                <input
                                    type="text"
                                    value={v.name}
                                    onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                                    className="col-span-6 p-2 rounded-lg bg-[#262626] text-white focus:ring-1 focus:ring-yellow-400"
                                    placeholder="Small / Full Plate"
                                    required
                                />
                                <input
                                    type="number"
                                    value={v.price}
                                    onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                                    className="col-span-3 p-2 rounded-lg bg-[#262626] text-white text-right focus:ring-1 focus:ring-yellow-400"
                                    placeholder="0.400"
                                    step="0.001"
                                    required
                                />
                                <div className="col-span-2 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={v.isDefault}
                                        onChange={() => setDefaultVariation(index)}
                                        className="h-5 w-5 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 cursor-pointer"
                                    />
                                </div>
                                <div className="col-span-1">
                                    {variations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariation(index)}
                                            className="text-red-500 hover:text-red-400 p-1"
                                        >
                                            <IoRemoveCircleOutline size={22} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addVariation}
                            className="w-full flex items-center justify-center py-2 mt-2 text-yellow-400 hover:bg-[#3a3a3a] rounded-lg"
                        >
                            <IoAddCircleOutline size={20} className="mr-2" />
                            Add Variation
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-[#1f1f1f] font-bold hover:bg-yellow-500 disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? 'Adding Dish...' : 'Add Dish'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default DishModal;
