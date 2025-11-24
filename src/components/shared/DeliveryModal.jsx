// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { IoMdClose } from "react-icons/io";
// import { enqueueSnackbar } from "notistack";
// import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https";
// import { useDispatch } from "react-redux";
// import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// const DeliveryModal = ({ isOpen, onClose, onCreateDelivery,existingData  }) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     deliveryBoy: "",
//   });

//   // ✅ Populate form when modal opens
//   useEffect(() => {
//     if (existingData) {
//       setFormData({
//         name: existingData.customerName || "",
//         phone: existingData.customerPhone || "",
//         address: existingData.deliveryAddress || "",
//         deliveryBoy: existingData.deliveryBoyId || "",
//       });
//     }
//   }, [existingData, isOpen]); // update every time modal opens

//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);

//   // ✅ Fetch delivery boys and filter for active ones + auto-select first
//   useEffect(() => {
//     if (isOpen) {
//       const fetchBoys = async () => {
//         try {
//           setLoading(true);
//           const res = await getDeliveryBoys();

//           // Filter to show only active delivery boys
//           const activeBoys = (res?.data?.data || []).filter(boy => boy.is_active === true);
//           setDeliveryBoys(activeBoys);

//           // 🔹 Auto-select the first delivery boy if available
//           if (activeBoys.length > 0) {
//             setFormData((prev) => ({
//               ...prev,
//               deliveryBoy: activeBoys[0]._id,
//             }));
//           } else {
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
//       if (formData.phone.length >= 1) {
//         handleSearchCustomer(formData.phone);
//       }
//     }, 600);

//     return () => clearTimeout(delayDebounce);
//   }, [formData.phone]);


//   const handleSearchCustomer = async (phone) => {
//     try {
//       setSearching(true);
//       const res = await searchCustomer(phone);

//       let customer = null;

//       // ✅ handle both object and array responses
//       if (Array.isArray(res?.data?.data) && res.data.data.length > 0) {
//         customer = res.data.data[0];
//       } else if (res?.data?.data && typeof res.data.data === "object") {
//         customer = res.data.data;
//       }
//       console.log("Search Customer Response:", res);
//       if (customer) {
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
//       // 🔹 Save customer info to backend
//       await addCustomer({ name, phone, address });

//       // 🔹 Update Redux state only
//       dispatch(
//         setDeliveryInfo({
//           name: name.trim(),
//           phone: phone.trim(),
//           address: address.trim(),
//           deliveryBoyId: deliveryBoy,
//         })
//       );

//       enqueueSnackbar("Delivery info saved! You can now place the order.", { variant: "success" });

//       // Reset form
//       setFormData({
//         name: "",
//         phone: "",
//         address: "",
//         deliveryBoy: "",
//       });

//       onClose(); // Close modal
//     } catch (err) {
//       console.error("Error saving delivery info:", err);
//       enqueueSnackbar("Failed to save delivery info.", { variant: "error" });
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

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { IoMdClose } from "react-icons/io";
// import { enqueueSnackbar } from "notistack";
// import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https"; // ✅ your APIs
// import { useDispatch } from "react-redux";
// import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// // ✅ Offline helpers
// import { save, load } from "../../utils/offlineStore";
// import { getCachedDeliveryBoys, fetchDeliveryBoys } from "../../utils//offlineDeliveryBoys";
// import { getCachedCustomers, fetchCustomers } from "../../utils/offlineCustomers";

// const OFF_PENDING_CUSTOMERS = "offline:pendingCustomers";

// const DeliveryModal = ({ isOpen, onClose, existingData }) => {
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     deliveryBoy: "",
//   });

//   const [deliveryBoys, setDeliveryBoys] = useState([]);
//   const [cachedCustomers, setCachedCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searching, setSearching] = useState(false);

//   // ✅ Load existing data when modal opens
//   useEffect(() => {
//     if (existingData) {
//       setFormData({
//         name: existingData.customerName || "",
//         phone: existingData.customerPhone || "",
//         address: existingData.deliveryAddress || "",
//         deliveryBoy: existingData.deliveryBoyId || "",
//       });
//     }
//   }, [existingData, isOpen]);

//   // ✅ Fetch delivery boys and customers (online/offline)
//   useEffect(() => {
//     if (!isOpen) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         let activeBoys = [];

//         if (navigator.onLine) {
//           // 🟢 ONLINE — fetch from API and cache
//           const res = await getDeliveryBoys();
//           const boys = res.data?.data || [];
//           await save("offline:deliveryBoys", boys);
//           activeBoys = boys.filter((b) => b.is_active);
//         } else {
//           // 🔴 OFFLINE — use cached
//           const cached = await getCachedDeliveryBoys();
//           activeBoys = cached.filter((b) => b.is_active);
//         }

//         setDeliveryBoys(activeBoys);
//         if (activeBoys.length > 0) {
//           setFormData((prev) => ({ ...prev, deliveryBoy: activeBoys[0]._id }));
//         }

//         // Fetch cached customers for offline search
//         const cached = await getCachedCustomers();
//         setCachedCustomers(cached);
//       } catch (err) {
//         console.error("Error loading data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [isOpen]);

//   // ✅ Search customer (online/offline)
//   useEffect(() => {
//     if (!formData.phone) return;

//     const delay = setTimeout(() => {
//       if (formData.phone.length >= 3) handleSearchCustomer(formData.phone);
//     }, 600);

//     return () => clearTimeout(delay);
//   }, [formData.phone]);

//   const handleSearchCustomer = async (phone) => {
//     try {
//       setSearching(true);
//       let customer = null;

//       if (navigator.onLine) {
//         const res = await searchCustomer(phone);
//         if (Array.isArray(res?.data?.data) && res.data.data.length > 0)
//           customer = res.data.data[0];
//         else if (res?.data?.data && typeof res.data.data === "object")
//           customer = res.data.data;
//       } 
//       // else {
//       //   const found = cachedCustomers.find((c) =>
//       //     c.phone_number?.toString().includes(phone_number.toString())
//       //   );
//       //   if (found) customer = found;
//       // }
//        else {
//   setSearching(true);
//   await new Promise(r => setTimeout(r, 30)); // small delay for UX
//   const found = cachedCustomers.find((c) => {
//     const customerPhone = c.phone || c.phone_number;
//     return (
//       customerPhone &&
//       customerPhone.toString().includes(phone.toString())
//     );
//   });
//   if (found) customer = found;
// }

//       if (customer) {
//         setFormData((prev) => ({
//           ...prev,
//           name: customer.name || "",
//           address: customer.address || "",
//         }));
//         enqueueSnackbar("Existing customer found — data filled automatically.", {
//           variant: "info",
//         });
//       } else {
//         setFormData((prev) => ({ ...prev, name: "", address: "" }));
//       }
//     } catch (err) {
//       console.error("Customer search failed:", err);
//     } finally {
//       setSearching(false);
//     }
//   };

//   // ✅ Input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Create order (online/offline)
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
//       if (navigator.onLine) {
//         await addCustomer({ name, phone, address });
//       } else {
//         // Save offline for later sync
//         const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
//         pending.push({ name, phone, address });
//         await save(OFF_PENDING_CUSTOMERS, pending);
//         enqueueSnackbar("Saved offline — will sync when online.", { variant: "info" });
//       }

//       dispatch(
//         setDeliveryInfo({
//           name: name.trim(),
//           phone: phone.trim(),
//           address: address.trim(),
//           deliveryBoyId: deliveryBoy,
//         })
//       );

//       enqueueSnackbar("Delivery info saved!", { variant: "success" });
//       setFormData({ name: "", phone: "", address: "", deliveryBoy: "" });
//       onClose();
//     } catch (err) {
//       console.error("Error saving delivery info:", err);
//       enqueueSnackbar("Failed to save delivery info.", { variant: "error" });
//     }
//   };

//   // ✅ Sync offline customers when online again
//  useEffect(() => {
//   const handleOnline = async () => {
//     const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
//     if (pending.length === 0) return;

//     enqueueSnackbar(`Syncing ${pending.length} offline customers...`, { variant: "info" });

//     const remaining = [];

//     for (const customer of pending) {
//       try {
//         await addCustomer(customer); // send to server
//       } catch (err) {
//         console.error("Sync failed for:", customer.phone, err);
//         remaining.push(customer); // keep unsynced customers
//       }
//     }

//     // Save only unsynced customers back to IndexedDB
//     await save(OFF_PENDING_CUSTOMERS, remaining);

//     if (remaining.length === 0) {
//       enqueueSnackbar("Offline customers synced successfully!", { variant: "success" });
//     } else {
//       enqueueSnackbar(`${remaining.length} customers failed to sync. Will retry later.`, { variant: "warning" });
//     }
//   };

//   // Run once in case we are already online
//   if (navigator.onLine) handleOnline();

//   window.addEventListener("online", handleOnline);
//   return () => window.removeEventListener("online", handleOnline);
// }, []);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.25 }}
//         className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
//       >
//         <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
//           <IoMdClose size={22} />
//         </button>

//         <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
//           Create Delivery Order
//         </h2>

//         {/* Phone */}
//         <label className="block text-[#ababab] mb-2 text-sm font-medium">Phone Number</label>
//         <input
//           type="text"
//           name="phone"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="+92-3XX-XXXXXXX"
//           value={formData.phone}
//           onChange={handleInputChange}
//         />
//         {searching && <p className="text-xs text-yellow-400 mt-1">Searching customer...</p>}

//         {/* Name */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Customer Name</label>
//         <input
//           type="text"
//           name="name"
//           className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
//           placeholder="Enter name"
//           value={formData.name}
//           onChange={handleInputChange}
//         />

//         {/* Address */}
//         <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Address</label>
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
//                   {boy.name} {boy.phone ? `- ${boy.phone}` : ""}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No active delivery boys available</option>
//             )}
//           </select>
//         )}

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
import { useDispatch } from "react-redux";
import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// Offline helpers
import { save, load } from "../../utils/offlineStore";
import { getCachedDeliveryBoys } from "../../utils/offlineDeliveryBoys";
import { getCachedCustomers } from "../../utils/offlineCustomers";

const OFF_PENDING_CUSTOMERS = "offline:pendingCustomers";

const DeliveryModal = ({ isOpen, onClose, existingData }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryBoy: "",
  });

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [cachedCustomers, setCachedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Load existing data when modal opens
  useEffect(() => {
    if (existingData) {
      setFormData({
        name: existingData.customerName || "",
        phone: existingData.customerPhone || "",
        address: existingData.deliveryAddress || "",
        deliveryBoy: existingData.deliveryBoyId || "",
      });
    }
  }, [existingData, isOpen]);

  // Fetch delivery boys and customers (online/offline)
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let activeBoys = [];

        if (navigator.onLine) {
          // ONLINE: fetch from API
          const res = await getDeliveryBoys();
          const boys = res.data?.data || [];
          await save("offline:deliveryBoys", boys);
          activeBoys = boys.filter((b) => b.is_active);
        } else {
          // OFFLINE: use cached
          const cached = await getCachedDeliveryBoys();
          activeBoys = cached.filter((b) => b.is_active);
        }

        setDeliveryBoys(activeBoys);
        if (activeBoys.length > 0) {
          setFormData((prev) => ({ ...prev, deliveryBoy: activeBoys[0]._id }));
        }

        const cached = await getCachedCustomers();
        setCachedCustomers(cached);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Search customer (online/offline)
  useEffect(() => {
    if (!formData.phone) return;

    const delay = setTimeout(() => {
      if (formData.phone.length >= 3) handleSearchCustomer(formData.phone);
    }, 600);

    return () => clearTimeout(delay);
  }, [formData.phone]);

  const handleSearchCustomer = async (phone) => {
    try {
      setSearching(true);
      let customer = null;

      if (navigator.onLine) {
        const res = await searchCustomer(phone);
        if (Array.isArray(res?.data?.data) && res.data.data.length > 0)
          customer = res.data.data[0];
        else if (res?.data?.data && typeof res.data.data === "object")
          customer = res.data.data;
      } else {
        // OFFLINE search
        await new Promise((r) => setTimeout(r, 30)); // UX delay
        const found = cachedCustomers.find((c) => {
          const customerPhone = c.phone || c.phone_number;
          return customerPhone && customerPhone.toString().includes(phone.toString());
        });
        if (found) customer = found;
      }

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
        setFormData((prev) => ({ ...prev, name: "", address: "" }));
      }
    } catch (err) {
      console.error("Customer search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create order (online/offline)
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
      const customerData = {
        name: name.trim(),
        phone_number: phone.trim(),
        address: address.trim(),
      };

      if (navigator.onLine) {
        await addCustomer(customerData);
      } else {
        const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
        pending.push(customerData);
        await save(OFF_PENDING_CUSTOMERS, pending);
        enqueueSnackbar("Saved offline — will sync when online.", { variant: "info" });
      }

      dispatch(
        setDeliveryInfo({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          deliveryBoyId: deliveryBoy,
        })
      );

      enqueueSnackbar("Delivery info saved!", { variant: "success" });
      setFormData({ name: "", phone: "", address: "", deliveryBoy: "" });
      onClose();
    } catch (err) {
      console.error("Error saving delivery info:", err);
      enqueueSnackbar("Failed to save delivery info.", { variant: "error" });
    }
  };

  // Auto-sync offline customers when online
  useEffect(() => {
    const handleOnline = async () => {
      const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
      if (!pending.length) return;

      enqueueSnackbar(`Syncing ${pending.length} offline customers...`, { variant: "info" });

      const remaining = [];
      for (const customer of pending) {
        try {
          await addCustomer(customer);
        } catch (err) {
          console.error("Sync failed for:", customer.phone_number, err);
          remaining.push(customer);
        }
      }

      await save(OFF_PENDING_CUSTOMERS, remaining);

      if (!remaining.length) {
        enqueueSnackbar("Offline customers synced successfully!", { variant: "success" });
      } else {
        enqueueSnackbar(`${remaining.length} customers failed to sync. Will retry later.`, { variant: "warning" });
      }
    };

    // Run once if online
    if (navigator.onLine) handleOnline();

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg relative"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <IoMdClose size={22} />
        </button>

        <h2 className="text-lg text-[#f5f5f5] mb-4 text-center font-semibold">
          Create Delivery Order
        </h2>

        {/* Phone */}
        <label className="block text-[#ababab] mb-2 text-sm font-medium">Phone Number</label>
        <input
          type="text"
          name="phone"
          className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
          placeholder="+92-3XX-XXXXXXX"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {searching && <p className="text-xs text-yellow-400 mt-1">Searching customer...</p>}

        {/* Name */}
        <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Customer Name</label>
        <input
          type="text"
          name="name"
          className="w-full bg-[#1f1f1f] rounded-lg text-white p-3 focus:outline-none"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleInputChange}
        />

        {/* Address */}
        <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Address</label>
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
                  {boy.name} {boy.phone ? `- ${boy.phone}` : ""}
                </option>
              ))
            ) : (
              <option disabled>No active delivery boys available</option>
            )}
          </select>
        )}

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
