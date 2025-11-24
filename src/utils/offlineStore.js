// offlineStore.js
import localforage from 'localforage';
import { deleteOrder } from '../https/index.js'; // 👈 your API call (adjust path if needed)

// Configure the IndexedDB instance for POS data
localforage.config({
  name: 'POS', // Database name
  storeName: 'pos_store', // Table/Store name
  version: 1.0,
  description: 'Local storage for offline POS operations'
});

export const save = (k, v) => localforage.setItem(k, v);
export const load = (k) => localforage.getItem(k);
export const remove = (k) => localforage.removeItem(k);
export const clearAll = () => localforage.clear();


export const isTrulyOfflineOrder = async (orderId) => {
  try {
    const cachedOrders = (await load('offline:orders')) || [];

    const found = cachedOrders.find(
      (o) => o._id === orderId || o.orderId == orderId
    );

    if (!found) return false;

    // ✅ If no _id in the structure, it’s an offline-created order
    return !found._id;
  } catch (error) {
    console.error("Error checking offline order:", error);
    return false;
  }
};





export const removeOrderFromCache = async (orderId) => {
  if (!orderId) {
    console.warn("⚠️ removeOrderFromCache called without a valid orderId");
    return false;
  }

  console.log('🗑️ Request to remove order:', orderId);

  try {
    let cachedOrders = (await load('offline:orders')) || [];
    const orderToDelete = cachedOrders.find(
      o => o._id === orderId || o.orderId == orderId
    );

    if (!orderToDelete) {
      console.warn('⚠️ Order not found in offline:orders:', orderId);
      return false;
    }

    // 🔹 Do NOT call API — only clean from local cache
    console.log('🧹 Removing order locally from offline cache (no API call)...');

    // Remove from offline:orders
    cachedOrders = cachedOrders.filter(
      o => o._id !== orderId && o.orderId != orderId
    );
    await save('offline:orders', cachedOrders);
 
    console.log('✅ Removed order from offline:orders');

    // Clean up pendingSync
    const pendingSync = (await load('offline:pendingSync')) || [];
    const updatedSync = pendingSync.filter(item => {
      const idInData = item?.data?._id || item?.data?.orderId;
      const topLevelId = item?.orderId || item?._id;
      return idInData !== orderId && topLevelId !== orderId;
    });
    await save('offline:pendingSync', updatedSync);
    console.log('✅ Cleaned offline:pendingSync');

    return true;
  } catch (err) {
    console.error('❌ Error removing order from cache:', err);
    return false;
  }
};


export const updateOrderStatusInCache = async (orderId, newStatus) => {
  try {
    // ---- Update offline:orders ----
    const cachedOrders = (await load("offline:orders")) || [];
    const updatedOrders = cachedOrders.map((o) => {
      // Use _id if available, otherwise orderId
      const idToCheck = o._id || o.orderId;
      if (idToCheck === orderId) {
        return { ...o, orderStatus: newStatus };
      }
      return o;
    });
    await save("offline:orders", updatedOrders);
    console.log("✅ Updated offline:orders");

    // ---- Update offline:pendingSync ----
    const pendingSync = (await load("offline:pendingSync")) || [];

    const index = pendingSync.findIndex((item) => {
      const idInData = item?.data?._id || item?.data?.orderId;
      const topLevelId = item?.orderId || item?._id;
      return idInData === orderId || topLevelId === orderId;
    });

    if (index !== -1) {
      // Order exists in pendingSync → update status
      pendingSync[index] = {
        ...pendingSync[index],
        data: { ...pendingSync[index].data, orderStatus: newStatus },
      };
    } else {
      // Order not in pendingSync → add for offline sync
      const orderToSync = cachedOrders.find((o) => (o._id || o.orderId) === orderId);
      if (orderToSync) {
        pendingSync.push({
          type: "updateStatus",
          orderId: orderToSync._id || orderToSync.orderId, // map _id if available
          timestamp: Date.now(),
          data: { ...orderToSync, orderStatus: newStatus },
        });
      }
    }

    await save("offline:pendingSync", pendingSync);
    console.log("✅ Updated offline:pendingSync");

    return true;
  } catch (err) {
    console.error("❌ Error updating order status in cache:", err);
    return false;
  }
};
