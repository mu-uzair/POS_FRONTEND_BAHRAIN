// // offlineStore.js
// import localforage from 'localforage';
// import { deleteOrder } from '../https/index.js'; // 👈 your API call (adjust path if needed)

// // Configure the IndexedDB instance for POS data
// localforage.config({
//   name: 'POS', // Database name
//   storeName: 'pos_store', // Table/Store name
//   version: 1.0,
//   description: 'Local storage for offline POS operations'
// });

// export const save = (k, v) => localforage.setItem(k, v);
// export const load = (k) => localforage.getItem(k);
// export const remove = (k) => localforage.removeItem(k);
// export const clearAll = () => localforage.clear();


// export const isTrulyOfflineOrder = async (orderId) => {
//   try {
//     const cachedOrders = (await load('offline:orders')) || [];

//     const found = cachedOrders.find(
//       (o) => o._id === orderId || o.orderId == orderId
//     );

//     if (!found) return false;

//     // ✅ If no _id in the structure, it’s an offline-created order
//     return !found._id;
//   } catch (error) {
//     console.error("Error checking offline order:", error);
//     return false;
//   }
// };





// export const removeOrderFromCache = async (orderId) => {
//   if (!orderId) {
//     console.warn("⚠️ removeOrderFromCache called without a valid orderId");
//     return false;
//   }

//   console.log('🗑️ Request to remove order:', orderId);

//   try {
//     let cachedOrders = (await load('offline:orders')) || [];
//     const orderToDelete = cachedOrders.find(
//       o => o._id === orderId || o.orderId == orderId
//     );

//     if (!orderToDelete) {
//       console.warn('⚠️ Order not found in offline:orders:', orderId);
//       return false;
//     }

//     // 🔹 Do NOT call API — only clean from local cache
//     console.log('🧹 Removing order locally from offline cache (no API call)...');

//     // Remove from offline:orders
//     cachedOrders = cachedOrders.filter(
//       o => o._id !== orderId && o.orderId != orderId
//     );
//     await save('offline:orders', cachedOrders);
 
//     console.log('✅ Removed order from offline:orders');

//     // Clean up pendingSync
//     const pendingSync = (await load('offline:pendingSync')) || [];
//     const updatedSync = pendingSync.filter(item => {
//       const idInData = item?.data?._id || item?.data?.orderId;
//       const topLevelId = item?.orderId || item?._id;
//       return idInData !== orderId && topLevelId !== orderId;
//     });
//     await save('offline:pendingSync', updatedSync);
//     console.log('✅ Cleaned offline:pendingSync');

//     return true;
//   } catch (err) {
//     console.error('❌ Error removing order from cache:', err);
//     return false;
//   }
// };


// export const updateOrderStatusInCache = async (orderId, newStatus) => {
//   try {
//     // ---- Update offline:orders ----
//     const cachedOrders = (await load("offline:orders")) || [];
//     const updatedOrders = cachedOrders.map((o) => {
//       // Use _id if available, otherwise orderId
//       const idToCheck = o._id || o.orderId;
//       if (idToCheck === orderId) {
//         return { ...o, orderStatus: newStatus };
//       }
//       return o;
//     });
//     await save("offline:orders", updatedOrders);
//     console.log("✅ Updated offline:orders");

//     // ---- Update offline:pendingSync ----
//     const pendingSync = (await load("offline:pendingSync")) || [];

//     const index = pendingSync.findIndex((item) => {
//       const idInData = item?.data?._id || item?.data?.orderId;
//       const topLevelId = item?.orderId || item?._id;
//       return idInData === orderId || topLevelId === orderId;
//     });

//     if (index !== -1) {
//       // Order exists in pendingSync → update status
//       pendingSync[index] = {
//         ...pendingSync[index],
//         data: { ...pendingSync[index].data, orderStatus: newStatus },
//       };
//     } else {
//       // Order not in pendingSync → add for offline sync
//       const orderToSync = cachedOrders.find((o) => (o._id || o.orderId) === orderId);
//       if (orderToSync) {
//         pendingSync.push({
//           type: "updateStatus",
//           orderId: orderToSync._id || orderToSync.orderId, // map _id if available
//           timestamp: Date.now(),
//           data: { ...orderToSync, orderStatus: newStatus },
//         });
//       }
//     }

//     await save("offline:pendingSync", pendingSync);
//     console.log("✅ Updated offline:pendingSync");

//     return true;
//   } catch (err) {
//     console.error("❌ Error updating order status in cache:", err);
//     return false;
//   }
// };



// // utils/offlineStore.js - CONSOLIDATED VERSION
// import localforage from 'localforage';

// // Configure the IndexedDB instance
// localforage.config({
//   name: 'POS',
//   storeName: 'pos_store',
//   version: 1.0,
//   description: 'Local storage for offline POS operations'
// });

// // Base operations
// export const save = (k, v) => localforage.setItem(k, v);
// export const load = (k) => localforage.getItem(k);
// export const remove = (k) => localforage.removeItem(k);
// export const clearAll = () => localforage.clear();

// // ============================================
// // UNIFIED STORAGE KEYS - USE ONLY THESE
// // ============================================
// export const STORAGE_KEYS = {
//   // Orders
//   ORDERS_CACHE: 'offline:orders',           // All cached orders (last 6 hours)
//   PENDING_SYNC: 'offline:pendingSync',      // Orders waiting to sync
  
//   // Menu & Reference Data
//   CATEGORIES: 'offline:categories',
//   DISHES: 'offline:dishes',
//   CUSTOMERS: 'offline:customers',
//   DELIVERY_BOYS: 'offline:deliveryBoys',
  
//   // Auth
//   AUTH_SESSION: 'offlineAuth',
//   USER_DATA: 'offlineUser',
  
//   // Metadata
//   METADATA: 'offline:meta'
// };

// // ============================================
// // ORDERS MANAGEMENT
// // ============================================

// /**
//  * Get all cached orders (used for display)
//  */
// export async function getCachedOrders() {
//   const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
//   const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
//   return orders.filter(o => new Date(o.createdAt).getTime() >= sixHoursAgo);
// }

// /**
//  * Update orders cache (from API or React Query)
//  */
// export async function updateOrdersCache(newOrders) {
//   const existing = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
  
//   // Merge and deduplicate by _id or orderId
//   const orderMap = new Map();
//   [...existing, ...newOrders].forEach(order => {
//     const id = order._id || order.orderId;
//     if (id) orderMap.set(id, order);
//   });
  
//   // Filter to last 6 hours
//   const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
//   const filtered = Array.from(orderMap.values()).filter(o => 
//     new Date(o.createdAt).getTime() >= sixHoursAgo
//   );
  
//   await save(STORAGE_KEYS.ORDERS_CACHE, filtered);
//   return filtered;
// }

// /**
//  * Add order to pending sync queue
//  */
// export async function addToPendingSync(syncItem) {
//   const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
  
//   // Check if already exists
//   const exists = pending.some(item => 
//     (item.orderId || item.data?.orderId) === (syncItem.orderId || syncItem.data?.orderId)
//   );
  
//   if (!exists) {
//     pending.push({
//       ...syncItem,
//       timestamp: Date.now(),
//       retryCount: 0
//     });
//     await save(STORAGE_KEYS.PENDING_SYNC, pending);
//     console.log('✅ Added to sync queue:', syncItem.orderId || syncItem.data?.orderId);
//   }
  
//   return pending;
// }

// /**
//  * Get all items waiting to sync
//  */
// export async function getPendingSync() {
//   return (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
// }

// /**
//  * Remove item from sync queue after successful sync
//  */
// export async function removeFromPendingSync(orderId) {
//   const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
//   const updated = pending.filter(item => {
//     const itemId = item.orderId || item.data?.orderId || item.data?._id;
//     return itemId !== orderId;
//   });
//   await save(STORAGE_KEYS.PENDING_SYNC, updated);
//   console.log('✅ Removed from sync queue:', orderId);
// }

// /**
//  * Update retry count for failed sync
//  */
// export async function incrementSyncRetry(orderId) {
//   const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
//   const updated = pending.map(item => {
//     const itemId = item.orderId || item.data?.orderId || item.data?._id;
//     if (itemId === orderId) {
//       return { ...item, retryCount: (item.retryCount || 0) + 1 };
//     }
//     return item;
//   });
//   await save(STORAGE_KEYS.PENDING_SYNC, updated);
// }

// /**
//  * Check if order is truly offline-created (never synced to server)
//  * ✅ UPDATED: Checks for absence of _id (backend-generated ID)
//  */
// export async function isTrulyOfflineOrder(orderId) {
//   try {
//     const cachedOrders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];

//     const found = cachedOrders.find(
//       (o) => o._id === orderId || o.orderNo === orderId || o.orderId === orderId
//     );

//     if (!found) return false;

//     // ✅ If no _id field, it's an offline-created order (not synced yet)
//     return !found._id;
//   } catch (error) {
//     console.error("Error checking offline order:", error);
//     return false;
//   }
// }

// /**
//  * Remove order from cache
//  * ✅ UPDATED: Uses orderNo as fallback identifier for offline orders
//  */
// export async function removeOrderFromCache(orderId) {
//   if (!orderId) {
//     console.warn("⚠️ removeOrderFromCache called without a valid orderId");
//     return false;
//   }

//   console.log('🗑️ Request to remove order:', orderId);

//   try {
//     let cachedOrders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
//     const orderToDelete = cachedOrders.find(
//       o => o._id === orderId || o.orderNo === orderId || o.orderId === orderId
//     );

//     if (!orderToDelete) {
//       console.warn('⚠️ Order not found in cache:', orderId);
//       return false;
//     }

//     console.log('🧹 Removing order from cache (local only)...');

//     // Remove from cache
//     cachedOrders = cachedOrders.filter(
//       o => o._id !== orderId && o.orderNo !== orderId && o.orderId !== orderId
//     );
//     await save(STORAGE_KEYS.ORDERS_CACHE, cachedOrders);
 
//     console.log('✅ Removed order from cache');

//     // Clean up pendingSync
//     const pendingSync = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
//     const updatedSync = pendingSync.filter(item => {
//       const itemId = item?.data?._id || item?.data?.orderNo || item?.data?.orderId || item?.orderId;
//       return itemId !== orderId;
//     });
//     await save(STORAGE_KEYS.PENDING_SYNC, updatedSync);
//     console.log('✅ Cleaned pendingSync');

//     return true;
//   } catch (err) {
//     console.error('❌ Error removing order from cache:', err);
//     return false;
//   }
// }

// /**
//  * Update order status in cache
//  * ✅ UPDATED: Uses orderNo as fallback identifier for offline orders
//  */
// export async function updateOrderStatusInCache(orderId, newStatus) {
//   try {
//     // Update in orders cache
//     const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
//     const updated = orders.map(o => {
//       const id = o._id || o.orderNo || o.orderId;
//       if (id === orderId) {
//         return { ...o, orderStatus: newStatus, updatedAt: new Date().toISOString() };
//       }
//       return o;
//     });
//     await save(STORAGE_KEYS.ORDERS_CACHE, updated);
    
//     // Add to pending sync if not already there
//     const order = updated.find(o => {
//       const id = o._id || o.orderNo || o.orderId;
//       return id === orderId;
//     });
    
//     if (order) {
//       await addToPendingSync({
//         type: 'updateStatus',
//         orderId: order._id || order.orderNo, // Use _id if available, else orderNo
//         data: { orderStatus: newStatus }
//       });
//     }
    
//     console.log('✅ Updated order status in cache:', orderId, newStatus);
//     return true;
//   } catch (err) {
//     console.error('❌ Error updating order status:', err);
//     return false;
//   }
// }


// // ============================================
// // MENU & REFERENCE DATA
// // ============================================

// export async function getCachedCategories() {
//   return (await load(STORAGE_KEYS.CATEGORIES)) || [];
// }

// export async function getCachedDishes() {
//   return (await load(STORAGE_KEYS.DISHES)) || [];
// }

// export async function getCachedCustomers() {
//   return (await load(STORAGE_KEYS.CUSTOMERS)) || [];
// }

// export async function getCachedDeliveryBoys() {
//   return (await load(STORAGE_KEYS.DELIVERY_BOYS)) || [];
// }

// export async function updateCachedData(key, data) {
//   await save(key, data);
//   console.log(`✅ Updated cached ${key}`);
// }

// utils/offlineStore.js - COMPLETE FIXED VERSION
import localforage from 'localforage';

// Configure the IndexedDB instance
localforage.config({
  name: 'POS',
  storeName: 'pos_store',
  version: 1.0,
  description: 'Local storage for offline POS operations'
});

// Base operations
export const save = (k, v) => localforage.setItem(k, v);
export const load = (k) => localforage.getItem(k);
export const remove = (k) => localforage.removeItem(k);
export const clearAll = () => localforage.clear();

// ============================================
// UNIFIED STORAGE KEYS - USE ONLY THESE
// ============================================
export const STORAGE_KEYS = {
  // Orders
  ORDERS_CACHE: 'offline:orders',
  PENDING_SYNC: 'offline:pendingSync',
  
  // Menu & Reference Data
  CATEGORIES: 'offline:categories',
  DISHES: 'offline:dishes',
  CUSTOMERS: 'offline:customers',
  DELIVERY_BOYS: 'offline:deliveryBoys',
    TABLES: 'offline:tables', 
  
  // Auth
  AUTH_SESSION: 'offlineAuth',
  USER_DATA: 'offlineUser',
  
  // Metadata
  METADATA: 'offline:meta'
};

/**
 * Helper: Get all possible IDs from an order
 */
function getAllOrderIds(order) {
  return [
    order._id,
    order.orderId,
    order.orderNo,
    order.tempId,
    String(order._id),
    String(order.orderId),
    String(order.orderNo),
    String(order.tempId)
  ].filter(Boolean);
}

/**
 * Helper: Check if two orders match by any ID
 */
function orderIdsMatch(id1, id2) {
  if (!id1 || !id2) return false;
  
  // Direct match
  if (id1 === id2) return true;
  
  // String match
  if (String(id1) === String(id2)) return true;
  
  return false;
}

/**
 * Helper: Find order in array by any ID
 */
function findOrderById(orders, searchId) {
  return orders.find(order => {
    const ids = getAllOrderIds(order);
    return ids.some(id => orderIdsMatch(id, searchId));
  });
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

/**
 * Get all cached orders (used for display)
 */
export async function getCachedOrders() {
  const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
  const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
  return orders.filter(o => new Date(o.createdAt).getTime() >= sixHoursAgo);
}

/**
 * Update orders cache (from API or React Query)
 * ✅ ONLY updates cache, does NOT add to pendingSync
 */
export async function updateOrdersCache(newOrders) {
  const existing = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
  
  // Merge and deduplicate by _id or orderId
  const orderMap = new Map();
  [...existing, ...newOrders].forEach(order => {
    const id = order._id || order.orderId;
    if (id) orderMap.set(id, order);
  });
  
  // Filter to last 6 hours
  const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
  const filtered = Array.from(orderMap.values()).filter(o => 
    new Date(o.createdAt).getTime() >= sixHoursAgo
  );
  
  await save(STORAGE_KEYS.ORDERS_CACHE, filtered);
  // console.log(`✅ Updated orders cache: ${filtered.length} orders`);
  return filtered;
}

/**
 * Add order to pending sync queue
 * ✅ FIXED: Prevents duplicates, handles updates by type
 */
export async function addToPendingSync(syncItem) {
  const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
  
  const orderId = syncItem.orderId || syncItem.data?.orderId || syncItem.data?._id;
  
  if (!orderId) {
    console.warn('⚠️ Cannot add to sync queue - no orderId found');
    return pending;
  }

  // ✅ Find existing item with same orderId AND type
  const existingIndex = pending.findIndex(item => {
    const itemId = item.orderId || item.data?.orderId || item.data?._id;
    return itemId === orderId && item.type === syncItem.type;
  });
  
  if (existingIndex !== -1) {
    // ✅ Update existing item
    pending[existingIndex] = {
      ...pending[existingIndex],
      ...syncItem,
      timestamp: Date.now(),
      retryCount: pending[existingIndex].retryCount || 0
    };
    console.log(`🔄 Updated sync queue item: ${orderId} (${syncItem.type})`);
  } else {
    // ✅ Add new item
    pending.push({
      ...syncItem,
      timestamp: Date.now(),
      retryCount: 0
    });
    console.log(`✅ Added to sync queue: ${orderId} (${syncItem.type})`);
  }
  
  await save(STORAGE_KEYS.PENDING_SYNC, pending);
  return pending;
}

/**
 * Get all items waiting to sync
 */
export async function getPendingSync() {
  return (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
}

/**
 * Remove item from sync queue after successful sync
 * ✅ FIXED: Can filter by type
 */
export async function removeFromPendingSync(orderId, type = null) {
  const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
  
  const updated = pending.filter(item => {
    const itemId = item.orderId || item.data?.orderId || item.data?._id;
    
    // If type specified, match both orderId and type
    if (type) {
      return !(itemId === orderId && item.type === type);
    }
    
    // Otherwise just match orderId
    return itemId !== orderId;
  });
  
  await save(STORAGE_KEYS.PENDING_SYNC, updated);
  console.log(`✅ Removed from sync queue: ${orderId}${type ? ` (${type})` : ''}`);
  return updated;
}

/**
 * Update retry count for failed sync
 */
export async function incrementSyncRetry(orderId) {
  const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
  const updated = pending.map(item => {
    const itemId = item.orderId || item.data?.orderId || item.data?._id;
    if (itemId === orderId) {
      return { ...item, retryCount: (item.retryCount || 0) + 1 };
    }
    return item;
  });
  await save(STORAGE_KEYS.PENDING_SYNC, updated);
}

/**
 * Check if order is truly offline-created (never synced to server)
 */
export async function isTrulyOfflineOrder(orderId) {
  try {
    const cachedOrders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];

    const found = cachedOrders.find(
      (o) => o._id === orderId || o.orderNo === orderId || o.orderId === orderId
    );

    if (!found) return false;

    // ✅ If no _id field, it's an offline-created order (not synced yet)
    return !found._id;
  } catch (error) {
    console.error("Error checking offline order:", error);
    return false;
  }
}


// export async function removeOrderFromCache(orderId) {
//   if (!orderId) {
//     console.warn("⚠️ No orderId provided");
//     return false;
//   }

//   console.log('🗑️ Removing order:', orderId);

//   try {
//     // STEP 1: Find the order first to get all its IDs
//     const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
//     const orderToDelete = findOrderById(orders, orderId);
    
//     if (!orderToDelete) {
//       console.warn('⚠️ Order not found in cache');
//     }
    
//     const orderIds = orderToDelete ? getAllOrderIds(orderToDelete) : [orderId];
//     console.log('   Order IDs to remove:', orderIds);
    
//     // STEP 2: Remove from cache
//     const remainingOrders = orders.filter(o => {
//       const ids = getAllOrderIds(o);
//       return !ids.some(id => orderIds.some(ordId => orderIdsMatch(id, ordId)));
//     });
    
//     await save(STORAGE_KEYS.ORDERS_CACHE, remainingOrders);
//     console.log(`✅ Removed from cache (${orders.length} -> ${remainingOrders.length})`);

//     // STEP 3: Remove ALL sync items for this order
//     const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
//     console.log(`   Checking ${pending.length} pending items...`);
    
//     const remainingPending = pending.filter(item => {
//       const itemIds = [
//         item.orderId,
//         item.data?.orderId,
//         item.data?.orderNo,
//         item.data?.tempId,
//         String(item.orderId),
//         String(item.data?.orderId),
//         String(item.data?.orderNo)
//       ].filter(Boolean);
      
//       const matches = itemIds.some(itemId => 
//         orderIds.some(ordId => orderIdsMatch(itemId, ordId))
//       );
      
//       if (matches) {
//         console.log(`   🧹 Removing ${item.type} item`);
//         return false;
//       }
      
//       return true;
//     });
    
//     await save(STORAGE_KEYS.PENDING_SYNC, remainingPending);
//     console.log(`✅ Cleaned pendingSync (${pending.length} -> ${remainingPending.length})`);

//     // STEP 4: Update metadata
//     const metadata = (await load(STORAGE_KEYS.METADATA)) || {};
//     if (metadata.orderCount) {
//       metadata.orderCount = Math.max(0, remainingOrders.length);
//       await save(STORAGE_KEYS.METADATA, metadata);
//     }

//     return true;
//   } catch (err) {
//     console.error('❌ Error:', err);
//     return false;
//   }
// }


export async function removeOrderFromCache(orderId) {
  if (!orderId) return false;

  try {
    const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];

    // 🔐 PRIMARY ID for cache delete (SAFE)
    const normalizedTargetId = String(orderId);

    const orderToDelete = orders.find(o => {
      const pid = o._id || o.orderId || o.offlineId;
      return pid && String(pid) === normalizedTargetId;
    });

    if (!orderToDelete) {
      console.warn("⚠️ Order not found in cache");
      return false;
    }

    // STEP 1: REMOVE FROM CACHE (STRICT)
    const remainingOrders = orders.filter(o => {
      const pid = o._id || o.orderId || o.offlineId;
      return !pid || String(pid) !== normalizedTargetId;
    });

    await save(STORAGE_KEYS.ORDERS_CACHE, remainingOrders);
    console.log(
      `🗑️ Cache: ${orders.length} → ${remainingOrders.length}`
    );

    // STEP 2: PREPARE IDS FOR SYNC CLEANUP (CONTROLLED)
    const syncIds = [
      orderToDelete._id,
      orderToDelete.orderId,
      orderToDelete.offlineId,
      orderToDelete.tempId,
      orderToDelete.orderNo
    ]
      .filter(Boolean)
      .map(String);

    // STEP 3: REMOVE FROM PENDING SYNC (SAFE MULTI-ID)
    const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];

    const remainingPending = pending.filter(item => {
      const itemIds = [
        item.orderId,
        item.data?.orderId,
        item.data?.tempId,
        item.data?.orderNo
      ]
        .filter(Boolean)
        .map(String);

      const matches = itemIds.some(id => syncIds.includes(id));

      if (matches) {
        console.log(`🧹 Removing pending ${item.type}`);
        return false;
      }

      return true;
    });

    await save(STORAGE_KEYS.PENDING_SYNC, remainingPending);
    console.log(
      `🔄 PendingSync: ${pending.length} → ${remainingPending.length}`
    );

    return true;
  } catch (err) {
    console.error("❌ removeOrderFromCache failed:", err);
    return false;
  }
}




export async function updateOrderInCache(orderId, updatedData) {
  try {
    console.log(`🔄 updateOrderInCache: ${orderId}`);
    
    const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
    const foundOrder = findOrderById(orders, orderId);
    
    if (!foundOrder) {
      console.warn(`⚠️ Order ${orderId} not found`);
      return false;
    }
    
    const isOfflineOrder = !foundOrder._id;
    console.log(`   Found order (offline: ${isOfflineOrder})`);
    
    // Update in cache
    const updated = orders.map(o => {
      if (getAllOrderIds(o).some(id => orderIdsMatch(id, orderId))) {
        return { ...o, ...updatedData, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    
    await save(STORAGE_KEYS.ORDERS_CACHE, updated);
    console.log(`✅ Cache updated`);
    
    // Smart pending sync
    if (isOfflineOrder) {
      console.log('   📦 Updating addOrder item...');
      
      const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
      const foundOrderIds = getAllOrderIds(foundOrder);
      
      let addOrderIndex = -1;
      for (let i = 0; i < pending.length; i++) {
        if (pending[i].type === 'addOrder') {
          const itemIds = [
            pending[i].orderId,
            pending[i].data?.orderId,
            pending[i].data?.orderNo,
            String(pending[i].orderId),
            String(pending[i].data?.orderId)
          ].filter(Boolean);
          
          if (itemIds.some(itemId => 
            foundOrderIds.some(ordId => orderIdsMatch(itemId, ordId))
          )) {
            addOrderIndex = i;
            break;
          }
        }
      }
      
      if (addOrderIndex !== -1) {
        pending[addOrderIndex] = {
          ...pending[addOrderIndex],
          data: {
            ...pending[addOrderIndex].data,
            ...updatedData,
            updatedAt: new Date().toISOString()
          },
          timestamp: Date.now()
        };
        
        // Remove redundant updateOrder items
        const cleanedPending = pending.filter((item, idx) => {
          if (idx === addOrderIndex) return true;
          if (item.type !== 'updateOrder') return true;
          
          const itemIds = [
            item.orderId,
            item.data?.orderId,
            String(item.orderId)
          ].filter(Boolean);
          
          const isForThisOrder = itemIds.some(itemId => 
            foundOrderIds.some(ordId => orderIdsMatch(itemId, ordId))
          );
          
          if (isForThisOrder) {
            console.log(`   🧹 Removing redundant updateOrder`);
            return false;
          }
          return true;
        });
        
        await save(STORAGE_KEYS.PENDING_SYNC, cleanedPending);
        console.log(`   ✅ Updated addOrder with edited data`);
      }
      
    } else {
      console.log('   🌐 Creating updateOrder for online order');
      await addToPendingSync({
        type: 'updateOrder',
        orderId: foundOrder._id || orderId,
        data: updatedData
      });
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}


export async function updateOrderStatusInCache(orderId, newStatus, addToSync = true) {
  try {
    console.log(`🔄 updateOrderStatusInCache called`);
    console.log(`   orderId: ${orderId} (${typeof orderId})`);
    console.log(`   newStatus: ${newStatus}`);
    
    // STEP 1: Load orders
    const orders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
    console.log(`   Total orders: ${orders.length}`);
    
    if (orders.length === 0) {
      console.warn('⚠️ No orders in cache');
      return false;
    }
    
    // STEP 2: Find the order using helper
    const foundOrder = findOrderById(orders, orderId);
    
    if (!foundOrder) {
      console.error(`❌ Order not found for ID: ${orderId}`);
      console.log('   Available orders:');
      orders.forEach((o, i) => {
        console.log(`   ${i + 1}. IDs:`, getAllOrderIds(o));
      });
      return false;
    }
    
    const isOfflineOrder = !foundOrder._id;
    console.log(`   ✅ Found order (offline: ${isOfflineOrder})`);
    console.log(`   Current status: ${foundOrder.orderStatus}`);
    
    // STEP 3: Update order
    const updated = orders.map(o => {
      if (getAllOrderIds(o).some(id => orderIdsMatch(id, orderId))) {
        return { 
          ...o, 
          orderStatus: newStatus, 
          updatedAt: new Date().toISOString() 
        };
      }
      return o;
    });
    
    await save(STORAGE_KEYS.ORDERS_CACHE, updated);
    console.log(`✅ Cache updated`);
    
    // STEP 4: Smart pending sync
    if (addToSync) {
      if (isOfflineOrder) {
        console.log('   📦 Updating addOrder item...');
        
        const pending = (await load(STORAGE_KEYS.PENDING_SYNC)) || [];
        
        // Find addOrder item using ALL possible IDs
        let addOrderIndex = -1;
        const foundOrderIds = getAllOrderIds(foundOrder);
        
        for (let i = 0; i < pending.length; i++) {
          if (pending[i].type === 'addOrder') {
            const itemIds = [
              pending[i].orderId,
              pending[i].data?.orderId,
              pending[i].data?.orderNo,
              pending[i].data?.tempId,
              String(pending[i].orderId),
              String(pending[i].data?.orderId),
              String(pending[i].data?.orderNo)
            ].filter(Boolean);
            
            // Check if any ID matches
            const matches = itemIds.some(itemId => 
              foundOrderIds.some(ordId => orderIdsMatch(itemId, ordId))
            );
            
            if (matches) {
              addOrderIndex = i;
              console.log(`   ✅ Found addOrder item at index ${i}`);
              break;
            }
          }
        }
        
        if (addOrderIndex !== -1) {
          // Update the addOrder item
          pending[addOrderIndex] = {
            ...pending[addOrderIndex],
            data: {
              ...pending[addOrderIndex].data,
              orderStatus: newStatus,
              updatedAt: new Date().toISOString()
            },
            timestamp: Date.now()
          };
          
          console.log(`   ✅ Updated addOrder status to: ${newStatus}`);
          
          // Remove any updateStatus items for this order
          const cleanedPending = pending.filter((item, idx) => {
            if (idx === addOrderIndex) return true; // Keep the addOrder
            if (item.type !== 'updateStatus') return true; // Keep other types
            
            // Check if this updateStatus is for our order
            const itemIds = [
              item.orderId,
              item.data?.orderId,
              String(item.orderId),
              String(item.data?.orderId)
            ].filter(Boolean);
            
            const isForThisOrder = itemIds.some(itemId => 
              foundOrderIds.some(ordId => orderIdsMatch(itemId, ordId))
            );
            
            if (isForThisOrder) {
              console.log(`   🧹 Removing redundant updateStatus item`);
              return false;
            }
            
            return true;
          });
          
          await save(STORAGE_KEYS.PENDING_SYNC, cleanedPending);
          console.log(`   ✅ Smart sync complete`);
          
        } else {
          console.warn('   ⚠️ addOrder item not found, creating updateStatus');
          await addToPendingSync({
            type: 'updateStatus',
            orderId: foundOrder.orderId || foundOrder.orderNo || orderId,
            data: { orderStatus: newStatus }
          });
        }
        
      } else {
        // Online order - create separate updateStatus
        console.log('   🌐 Creating updateStatus for online order');
        await addToPendingSync({
          type: 'updateStatus',
          orderId: foundOrder._id || orderId,
          data: { orderStatus: newStatus }
        });
      }
    }
    
    return true;
    
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}


// ============================================
// MENU & REFERENCE DATA
// ============================================

export async function getCachedCategories() {
  return (await load(STORAGE_KEYS.CATEGORIES)) || [];
}

export async function getCachedDishes() {
  return (await load(STORAGE_KEYS.DISHES)) || [];
}

export async function getCachedCustomers() {
  return (await load(STORAGE_KEYS.CUSTOMERS)) || [];
}

export async function getCachedDeliveryBoys() {
  return (await load(STORAGE_KEYS.DELIVERY_BOYS)) || [];
}

export async function updateCachedData(key, data) {
  await save(key, data);
  // console.log(`✅ Updated cached ${key}`);
}