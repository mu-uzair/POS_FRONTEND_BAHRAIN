import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { enqueueSnackbar } from "notistack";
import { getDeliveryBoys, searchCustomer, addCustomer } from "../../https";
import { useDispatch } from "react-redux";
import { setDeliveryInfo } from "../../redux/slice/customerSlice";

// ✅ CRITICAL FIX: Use OfflineModeContext instead of navigator.onLine
import { useOfflineMode } from "../../constants/OfflineModeContext";

// Offline helpers
import { save, load } from "../../utils/offlineStore";
import { getCachedDeliveryBoys } from "../../utils/offlineDeliveryBoys";
import { getCachedCustomers } from "../../utils/offlineCustomers";

const OFF_PENDING_CUSTOMERS = "offline:pendingCustomers";

const DeliveryModal = ({ isOpen, onClose, existingData, ordertype }) => {
  const dispatch = useDispatch();


  // 🎯 KEY FIX: Use offline context instead of navigator.onLine
  const { isOfflineMode } = useOfflineMode();

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

        // ✅ FIXED: Use isOfflineMode instead of navigator.onLine
        if (!isOfflineMode) {
          // ONLINE: fetch from API
          // console.log('🌐 [DELIVERY MODAL] Fetching delivery boys from API...');
          const res = await getDeliveryBoys();
          const boys = res.data?.data || [];
          await save("offline:deliveryBoys", boys);
          activeBoys = boys.filter((b) => b.is_active);
          // console.log(`✅ [DELIVERY MODAL] Fetched ${activeBoys.length} active delivery boys`);
        } else {
          // OFFLINE: use cached
          console.log('📦 [DELIVERY MODAL] Using cached delivery boys (offline mode)');
          const cached = await getCachedDeliveryBoys();
          activeBoys = cached.filter((b) => b.is_active);
          console.log(`📦 [DELIVERY MODAL] Loaded ${activeBoys.length} cached delivery boys`);
        }

        setDeliveryBoys(activeBoys);
        if (activeBoys.length > 0) {
          setFormData((prev) => ({ ...prev, deliveryBoy: activeBoys[0]._id }));
        }

        const cached = await getCachedCustomers();
        setCachedCustomers(cached);
        // console.log(`📦 [DELIVERY MODAL] Loaded ${cached.length} cached customers`);
      } catch (err) {
        console.error("❌ [DELIVERY MODAL] Error loading data:", err);
        enqueueSnackbar("Failed to load delivery boys", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, isOfflineMode]); // ✅ Added isOfflineMode dependency


  useEffect(() => {
    // 🛡️ FIX: Only search if the modal is actually open AND there is a phone number
    // This stops the "Takeaway" N/A search from happening in the background!
    if (!isOpen || !formData.phone) return;

    const delay = setTimeout(() => {
      if (formData.phone.length >= 3) {
        handleSearchCustomer(formData.phone);
      }
    }, 600);

    return () => clearTimeout(delay);

    // 🛡️ FIX: Add isOpen to the dependency array
  }, [formData.phone, isOfflineMode, isOpen]);

  const handleSearchCustomer = async (phone) => {
    try {
      setSearching(true);
      let customer = null;

      // ✅ FIXED: Use isOfflineMode instead of navigator.onLine
      if (!isOfflineMode) {
        // console.log(`🔍 [DELIVERY MODAL] Searching customer online: ${phone}`);
        const res = await searchCustomer(phone);
        if (Array.isArray(res?.data?.data) && res.data.data.length > 0)
          customer = res.data.data[0];
        else if (res?.data?.data && typeof res.data.data === "object")
          customer = res.data.data;

        if (customer) {
          // console.log(`✅ [DELIVERY MODAL] Found customer online:`, customer.name);
        }
      } else {
        // OFFLINE search
        console.log(`📦 [DELIVERY MODAL] Searching customer offline: ${phone}`);
        await new Promise((r) => setTimeout(r, 30)); // UX delay
        const found = cachedCustomers.find((c) => {
          const customerPhone = c.phone || c.phone_number;
          return customerPhone && customerPhone.toString().includes(phone.toString());
        });
        if (found) {
          customer = found;
          console.log(`✅ [DELIVERY MODAL] Found customer in cache:`, customer.name);
        }
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
        // console.log('ℹ️ [DELIVERY MODAL] No customer found');
      }
    } catch (err) {
      console.error("❌ [DELIVERY MODAL] Customer search failed:", err);
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

      // ✅ FIXED: Use isOfflineMode instead of navigator.onLine
      if (!isOfflineMode) {
        console.log('🌐 [DELIVERY MODAL] Creating customer online...');
        await addCustomer(customerData);
        console.log('✅ [DELIVERY MODAL] Customer created online');
      } else {
        console.log('📦 [DELIVERY MODAL] Saving customer offline...');
        const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
        pending.push(customerData);
        await save(OFF_PENDING_CUSTOMERS, pending);
        enqueueSnackbar("Saved offline — will sync when online.", { variant: "info" });
        console.log(`📦 [DELIVERY MODAL] Customer queued (${pending.length} pending)`);
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
      console.error("❌ [DELIVERY MODAL] Error saving delivery info:", err);
      enqueueSnackbar("Failed to save delivery info.", { variant: "error" });
    }
  };

  // Auto-sync offline customers when online
  useEffect(() => {
    const handleOnline = async () => {
      // ✅ FIXED: Use isOfflineMode instead of navigator.onLine
      if (isOfflineMode) {
        console.log('⚠️ [DELIVERY MODAL] Still offline, skipping sync');
        return; // Don't sync if still offline
      }

      const pending = (await load(OFF_PENDING_CUSTOMERS)) || [];
      if (!pending.length) return;

      console.log(`🔄 [DELIVERY MODAL] Syncing ${pending.length} offline customers...`);
      enqueueSnackbar(`Syncing ${pending.length} offline customers...`, { variant: "info" });

      const remaining = [];
      for (const customer of pending) {
        try {
          await addCustomer(customer);
          console.log(`✅ [DELIVERY MODAL] Synced:`, customer.phone_number);
        } catch (err) {
          console.error("❌ [DELIVERY MODAL] Sync failed for:", customer.phone_number, err);
          remaining.push(customer);
        }
      }

      await save(OFF_PENDING_CUSTOMERS, remaining);

      if (!remaining.length) {
        enqueueSnackbar("Offline customers synced successfully!", { variant: "success" });
        console.log('✅ [DELIVERY MODAL] All customers synced');
      } else {
        enqueueSnackbar(`${remaining.length} customers failed to sync. Will retry later.`, { variant: "warning" });
        console.log(`⚠️ [DELIVERY MODAL] ${remaining.length} customers failed to sync`);
      }
    };

    // Trigger sync when going online
    handleOnline();
  }, [isOfflineMode]); // ✅ Run when offline mode changes

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
          {/* ✅ Show offline indicator */}
          {isOfflineMode && (
            <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded">
              OFFLINE MODE
            </span>
          )}
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