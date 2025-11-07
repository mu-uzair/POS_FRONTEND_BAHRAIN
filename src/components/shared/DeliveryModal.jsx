// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { IoMdClose } from "react-icons/io";
// import { enqueueSnackbar } from "notistack";
// import { getDeliveryBoys } from "../../https"; // ✅ add this API call like addCategory

// const DeliveryModal = ({ isOpen, onClose, onCreateDelivery }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     deliveryBoy: "",
//   });

//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch active delivery boys when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       const fetchBoys = async () => {
//         try {
//           setLoading(true);
//           const res = await getDeliveryBoys(); // ✅ this returns res.data
//           setDeliveryBoys(res?.data.data || []); // ✅ fixed here
//         } catch (err) {
//           console.error("Error fetching delivery boys:", err);
//           enqueueSnackbar("Failed to fetch delivery boys.", { variant: "error" });
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchBoys();
//     }
//   }, [isOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreate = () => {
//     if (!formData.deliveryBoy) {
//       enqueueSnackbar("Please select a delivery boy!", { variant: "warning" });
//       return;
//     }

//     onCreateDelivery({
//       name: formData.name.trim() || "Delivery Customer",
//       phone: formData.phone.trim() || "N/A",
//       deliveryBoy: formData.deliveryBoy,
//     });

//     enqueueSnackbar("Delivery order created successfully!", {
//       variant: "success",
//     });

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.25 }}
//         className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-white"
//         >
//           <IoMdClose size={22} />
//         </button>

//         {/* Title */}
//         <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
//           Create Delivery Order
//         </h2>

//         {/* Customer Name */}
//         <label className="block text-[#ababab] mb-2 text-sm font-medium">
//           Customer Name
//         </label>
//         <input
//           type="text"
//           name="name"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="Enter name"
//           value={formData.name}
//           onChange={handleInputChange}
//         />

//         {/* Phone */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Phone Number
//         </label>
//         <input
//           type="text"
//           name="phone"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="+92-3XX-XXXXXXX"
//           value={formData.phone}
//           onChange={handleInputChange}
//         />

//         {/* Delivery Boy Dropdown */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Assign Delivery Boy
//         </label>
//         {loading ? (
//           <p className="text-yellow-400">Loading delivery boys...</p>
//         ) : (
//           <select
//             name="deliveryBoy"
//             className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//             value={formData.deliveryBoy}
//             onChange={handleInputChange}
//           >
//             <option value="">Select delivery boy</option>
//             {deliveryBoys.length > 0 ? (
//               deliveryBoys.map((boy) => (
//                 <option key={boy._id} value={boy._id}>
//                   {boy.name}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No delivery boys found</option>
//             )}
//           </select>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreate}
//             className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600"
//           >
//             Create Order
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DeliveryModal;



// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { IoMdClose } from "react-icons/io";
// import { enqueueSnackbar } from "notistack";
// import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https"; // ✅ confirmed endpoints

// const DeliveryModal = ({ isOpen, onClose, onCreateDelivery }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     deliveryBoy: "",
//   });

//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);

//   // ✅ Fetch active delivery boys when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       const fetchBoys = async () => {
//         try {
//           setLoading(true);
//           const res = await getDeliveryBoys();
//           setDeliveryBoys(res?.data?.data || []);
//         } catch (err) {
//           console.error("Error fetching delivery boys:", err);
//           enqueueSnackbar("Failed to fetch delivery boys.", { variant: "error" });
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchBoys();
//     }
//   }, [isOpen]);

//   // ✅ Search customer by phone when user stops typing for a short delay
//   useEffect(() => {
//     if (!formData.phone) return;

//     const delayDebounce = setTimeout(() => {
//       if (formData.phone.length >= 10) {
//         handleSearchCustomer(formData.phone);
//       }
//     }, 600); // debounce to avoid too many API calls

//     return () => clearTimeout(delayDebounce);
//   }, [formData.phone]);

//   // ✅ Search customer API call
//   const handleSearchCustomer = async (phone) => {
//     try {
//       setSearching(true);
//       const res = await searchCustomer(phone);
//       if (res?.data?.data) {
//         const customer = res.data.data;
//         setFormData((prev) => ({
//           ...prev,
//           name: customer.name || "",
//           address: customer.address || "",
//         }));
//         enqueueSnackbar("Existing customer found — data filled automatically.", {
//           variant: "info",
//         });
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           name: "",
//           address: "",
//         }));
//       }
//     } catch (err) {
//       console.error("Error searching customer:", err);
//     } finally {
//       setSearching(false);
//     }
//   };

//   // ✅ Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Create delivery + add customer
//   const handleCreate = async () => {
//     const { name, phone, address, deliveryBoy } = formData;

//     if (!phone.trim()) {
//       enqueueSnackbar("Customer phone is required!", { variant: "warning" });
//       return;
//     }
//     if (!deliveryBoy) {
//       enqueueSnackbar("Please select a delivery boy!", { variant: "warning" });
//       return;
//     }

//     try {
//       // 🔹 Save customer to backend
//       await addCustomer({ name, phone, address });

//       // 🔹 Create delivery order
//       onCreateDelivery({
//         name: name.trim(),
//         phone: phone.trim(),
//         address: address.trim(),
//         deliveryBoy,
//       });

//       enqueueSnackbar("Delivery order created successfully!", { variant: "success" });
//       onClose();
//     } catch (err) {
//       console.error("Error creating delivery:", err);
//       enqueueSnackbar("Failed to create delivery order.", { variant: "error" });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.25 }}
//         className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-white"
//         >
//           <IoMdClose size={22} />
//         </button>

//         {/* Title */}
//         <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
//           Create Delivery Order
//         </h2>

//         {/* Phone */}
//         <label className="block text-[#ababab] mb-2 text-sm font-medium">
//           Phone Number
//         </label>
//         <input
//           type="text"
//           name="phone"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="+92-3XX-XXXXXXX"
//           value={formData.phone}
//           onChange={handleInputChange}
//         />
//         {searching && (
//           <p className="text-xs text-yellow-400 mt-1">Searching customer...</p>
//         )}

//         {/* Name */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Customer Name
//         </label>
//         <input
//           type="text"
//           name="name"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="Enter name"
//           value={formData.name}
//           onChange={handleInputChange}
//         />

//         {/* Address */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Address
//         </label>
//         <textarea
//           name="address"
//           rows="3"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none resize-none"
//           placeholder="Enter delivery address"
//           value={formData.address}
//           onChange={handleInputChange}
//         ></textarea>

//         {/* Delivery Boy */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Assign Delivery Boy
//         </label>
//         {loading ? (
//           <p className="text-yellow-400">Loading delivery boys...</p>
//         ) : (
//           <select
//             name="deliveryBoy"
//             className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//             value={formData.deliveryBoy}
//             onChange={handleInputChange}
//           >
//             <option value="">Select delivery boy</option>
//             {deliveryBoys.length > 0 ? (
//               deliveryBoys.map((boy) => (
//                 <option key={boy._id} value={boy._id}>
//                   {boy.name}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No delivery boys found</option>
//             )}
//           </select>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreate}
//             className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600"
//           >
//             Create Order
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DeliveryModal;


// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { IoMdClose } from "react-icons/io";
// import { enqueueSnackbar } from "notistack";
// import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https";

// const DeliveryModal = ({ isOpen, onClose, onCreateDelivery }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     deliveryBoy: "",
//   });

//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);

//   // ✅ Fetch delivery boys and filter for active ones
//   useEffect(() => {
//     if (isOpen) {
//       const fetchBoys = async () => {
//         try {
//           setLoading(true);
//           const res = await getDeliveryBoys();
          
//           // Filter to show only active delivery boys
//           const activeBoys = (res?.data?.data || []).filter(boy => boy.is_active === true);
//           setDeliveryBoys(activeBoys);
          
//           if (activeBoys.length === 0) {
//             enqueueSnackbar("No active delivery boys available.", { variant: "warning" });
//           }
//         } catch (err) {
//           console.error("Error fetching delivery boys:", err);
//           enqueueSnackbar("Failed to fetch delivery boys.", { variant: "error" });
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchBoys();
//     }
//   }, [isOpen]);

//   // ✅ Search customer by phone when user stops typing for a short delay
//   useEffect(() => {
//     if (!formData.phone) return;

//     const delayDebounce = setTimeout(() => {
//       if (formData.phone.length >= 10) {
//         handleSearchCustomer(formData.phone);
//       }
//     }, 600);

//     return () => clearTimeout(delayDebounce);
//   }, [formData.phone]);

//   // ✅ Search customer API call
//   const handleSearchCustomer = async (phone) => {
//     try {
//       setSearching(true);
//       const res = await searchCustomer(phone);
//       if (res?.data?.data) {
//         const customer = res.data.data;
//         setFormData((prev) => ({
//           ...prev,
//           name: customer.name || "",
//           address: customer.address || "",
//         }));
//         enqueueSnackbar("Existing customer found — data filled automatically.", {
//           variant: "info",
//         });
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           name: "",
//           address: "",
//         }));
//       }
//     } catch (err) {
//       console.error("Error searching customer:", err);
//     } finally {
//       setSearching(false);
//     }
//   };

//   // ✅ Input change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Create delivery + add customer
//   const handleCreate = async () => {
//     const { name, phone, address, deliveryBoy } = formData;

//     if (!phone.trim()) {
//       enqueueSnackbar("Customer phone is required!", { variant: "warning" });
//       return;
//     }
//     if (!deliveryBoy) {
//       enqueueSnackbar("Please select a delivery boy!", { variant: "warning" });
//       return;
//     }

//     try {
//       // 🔹 Save customer to backend
//       await addCustomer({ name, phone, address });

//       // 🔹 Create delivery order
//       onCreateDelivery({
//         name: name.trim(),
//         phone: phone.trim(),
//         address: address.trim(),
//         deliveryBoy,
//       });

//       enqueueSnackbar("Delivery order created successfully!", { variant: "success" });
      
//       // Reset form
//       setFormData({
//         name: "",
//         phone: "",
//         address: "",
//         deliveryBoy: "",
//       });
      
//       onClose();
//     } catch (err) {
//       console.error("Error creating delivery:", err);
//       enqueueSnackbar("Failed to create delivery order.", { variant: "error" });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.25 }}
//         className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-white"
//         >
//           <IoMdClose size={22} />
//         </button>

//         {/* Title */}
//         <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
//           Create Delivery Order
//         </h2>

//         {/* Phone */}
//         <label className="block text-[#ababab] mb-2 text-sm font-medium">
//           Phone Number
//         </label>
//         <input
//           type="text"
//           name="phone"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="+92-3XX-XXXXXXX"
//           value={formData.phone}
//           onChange={handleInputChange}
//         />
//         {searching && (
//           <p className="text-xs text-yellow-400 mt-1">Searching customer...</p>
//         )}

//         {/* Name */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Customer Name
//         </label>
//         <input
//           type="text"
//           name="name"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="Enter name"
//           value={formData.name}
//           onChange={handleInputChange}
//         />

//         {/* Address */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Address
//         </label>
//         <textarea
//           name="address"
//           rows="3"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none resize-none"
//           placeholder="Enter delivery address"
//           value={formData.address}
//           onChange={handleInputChange}
//         ></textarea>

//         {/* Delivery Boy */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
//           Assign Delivery Boy
//         </label>
//         {loading ? (
//           <p className="text-yellow-400">Loading delivery boys...</p>
//         ) : (
//           <select
//             name="deliveryBoy"
//             className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//             value={formData.deliveryBoy}
//             onChange={handleInputChange}
//           >
//             <option value="">Select delivery boy</option>
//             {deliveryBoys.length > 0 ? (
//               deliveryBoys.map((boy) => (
//                 <option key={boy._id} value={boy._id}>
//                   {boy.name} {boy.phone ? `- ${boy.phone}` : ''}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No active delivery boys available</option>
//             )}
//           </select>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreate}
//             disabled={deliveryBoys.length === 0}
//             className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Create Order
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default DeliveryModal;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { enqueueSnackbar } from "notistack";
import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https";

const DeliveryModal = ({ isOpen, onClose, onCreateDelivery }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryBoy: "",
  });

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // ✅ Fetch delivery boys and filter for active ones + auto-select first
  useEffect(() => {
    if (isOpen) {
      const fetchBoys = async () => {
        try {
          setLoading(true);
          const res = await getDeliveryBoys();
          
          // Filter to show only active delivery boys
          const activeBoys = (res?.data?.data || []).filter(boy => boy.is_active === true);
          setDeliveryBoys(activeBoys);
          
          // 🔹 Auto-select the first delivery boy if available
          if (activeBoys.length > 0) {
            setFormData((prev) => ({
              ...prev,
              deliveryBoy: activeBoys[0]._id,
            }));
          } else {
            enqueueSnackbar("No active delivery boys available.", { variant: "warning" });
          }
        } catch (err) {
          console.error("Error fetching delivery boys:", err);
          enqueueSnackbar("Failed to fetch delivery boys.", { variant: "error" });
        } finally {
          setLoading(false);
        }
      };
      fetchBoys();
    }
  }, [isOpen]);

  // ✅ Search customer by phone when user stops typing for a short delay
  useEffect(() => {
    if (!formData.phone) return;

    const delayDebounce = setTimeout(() => {
      if (formData.phone.length >= 1) {
        handleSearchCustomer(formData.phone);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [formData.phone]);

  // ✅ Search customer API call
  // const handleSearchCustomer = async (phone) => {
  //   try {
  //     setSearching(true);
  //     const res = await searchCustomer(phone);
  //     if (res?.data?.data) {
  //       const customer = res.data.data;
  //       setFormData((prev) => ({
  //         ...prev,
  //         name: customer.name || "",
  //         address: customer.address || "",
  //       }));
  //       enqueueSnackbar("Existing customer found — data filled automatically.", {
  //         variant: "info",
  //       });
  //     } else {
  //       setFormData((prev) => ({
  //         ...prev,
  //         name: "",
  //         address: "",
  //       }));
  //     }
  //   } catch (err) {
  //     console.error("Error searching customer:", err);
  //   } finally {
  //     setSearching(false);
  //   }
  // };

  const handleSearchCustomer = async (phone) => {
  try {
    setSearching(true);
    const res = await searchCustomer(phone);

    let customer = null;

    // ✅ handle both object and array responses
    if (Array.isArray(res?.data?.data) && res.data.data.length > 0) {
      customer = res.data.data[0];
    } else if (res?.data?.data && typeof res.data.data === "object") {
      customer = res.data.data;
    }
console.log("Search Customer Response:", res);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        name: customer.name || "",
        address: customer.address || "",
      }));

      enqueueSnackbar("Existing customer found — data filled automatically.", {
        variant: "info",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        address: "",
      }));
    }
  } catch (err) {
    console.error("Error searching customer:", err);
  } finally {
    setSearching(false);
  }
};


  // ✅ Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Create delivery + add customer
  const handleCreate = async () => {
    const { name, phone, address, deliveryBoy } = formData;

    if (!phone.trim()) {
      enqueueSnackbar("Customer phone is required!", { variant: "warning" });
      return;
    }
    if (!deliveryBoy) {
      enqueueSnackbar("Please select a delivery boy!", { variant: "warning" });
      return;
    }

    try {
      // 🔹 Save customer to backend
      await addCustomer({ name, phone, address });

      // 🔹 Create delivery order
      onCreateDelivery({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        deliveryBoy,
      });

      enqueueSnackbar("Delivery order created successfully!", { variant: "success" });
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        address: "",
        deliveryBoy: "",
      });
      
      onClose();
    } catch (err) {
      console.error("Error creating delivery:", err);
      enqueueSnackbar("Failed to create delivery order.", { variant: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <IoMdClose size={22} />
        </button>

        {/* Title */}
        <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
          Create Delivery Order
        </h2>

        {/* Phone */}
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Phone Number
        </label>
        <input
          type="text"
          name="phone"
          className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
          placeholder="+92-3XX-XXXXXXX"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {searching && (
          <p className="text-xs text-yellow-400 mt-1">Searching customer...</p>
        )}

        {/* Name */}
        <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
          Customer Name
        </label>
        <input
          type="text"
          name="name"
          className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleInputChange}
        />

        {/* Address */}
        <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
          Address
        </label>
        <textarea
          name="address"
          rows="3"
          className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none resize-none"
          placeholder="Enter delivery address"
          value={formData.address}
          onChange={handleInputChange}
        ></textarea>

        {/* Delivery Boy */}
        <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">
          Assign Delivery Boy
        </label>
        {loading ? (
          <p className="text-yellow-400">Loading delivery boys...</p>
        ) : (
          <select
            name="deliveryBoy"
            className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
            value={formData.deliveryBoy}
            onChange={handleInputChange}
          >
            <option value="">Select delivery boy</option>
            {deliveryBoys.length > 0 ? (
              deliveryBoys.map((boy) => (
                <option key={boy._id} value={boy._id}>
                  {boy.name} {boy.phone ? `- ${boy.phone}` : ''}
                </option>
              ))
            ) : (
              <option disabled>No active delivery boys available</option>
            )}
          </select>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={deliveryBoys.length === 0}
            className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryModal;