// // utils/getOrdersOffline.js - FIXED VERSION
// import {
//   updateOrdersCache,
//   getCachedOrders,
//   STORAGE_KEYS,
//   save,
//   load
// } from './offlineStore.js';

// let refreshInterval;
// let queryClientInstance = null;

// // ✅ Initialize with queryClient from your app
// export function initializeOfflineCache(queryClient) {
//   queryClientInstance = queryClient;
//   console.log('✅ Offline cache initialized with QueryClient');
// }



// // utils/getOrdersOffline.js
// export async function fetchAndCacheRecentOrders(forceRefresh = false) {
//   try {
//     if (!queryClientInstance) {
//       console.warn('⚠️ QueryClient not initialized. Call initializeOfflineCache() first.');
//       return await getCachedOrders();
//     }

//     // If force refresh, refetch queries first
//     if (forceRefresh) {
//       console.log('🔄 Force refreshing orders from server...');
//       await queryClientInstance.refetchQueries({ queryKey: ["orders"] });
      
//       // Wait a bit for the refetch to complete
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }

//     // Get all orders from React Query cache
//     const queryData = queryClientInstance.getQueriesData({ queryKey: ["orders"] });
    
//     let allOrders = [];
    
//     // Extract orders from all cached queries
//     for (const [key, data] of queryData) {
//       if (data?.pages) {
//         // Infinite query format
//         const orders = data.pages.flatMap(page => page?.data || []);
//         allOrders.push(...orders);
//       } else if (data?.data?.data) {
//         // Regular query format
//         allOrders.push(...data.data.data);
//       } else if (Array.isArray(data)) {
//         // Direct array format
//         allOrders.push(...data);
//       }
//     }

//     if (allOrders.length === 0 && !forceRefresh) {
//       console.log('📦 No orders in React Query cache yet');
//       return await getCachedOrders();
//     }

//     // ✅ Update cache with latest data
//     const cachedOrders = await updateOrdersCache(allOrders);

//     // Update metadata
//     await save(STORAGE_KEYS.METADATA, {
//       lastOrdersSync: Date.now(),
//       orderCount: cachedOrders.length
//     });

//     console.log(`✅ Synced ${cachedOrders.length} orders to cache`);
//     return cachedOrders;

//   } catch (err) {
//     console.warn('⚠️ Failed to cache orders:', err.message || err);
//     return await getCachedOrders();
//   }
// }

// // ✅ Export getCachedOrders from offlineStore
// export { getCachedOrders };

// // ✅ Start background refresh - syncs React Query to IndexedDB periodically
// export function startAutoRefresh(intervalMs = 30 * 1000) { // Changed to 30 seconds
//   if (refreshInterval) {
//     console.log('⚠️ Auto-refresh already running');
//     return;
//   }

//   console.log(`🔄 Starting auto-refresh (every ${intervalMs / 1000}s)`);
  
//   refreshInterval = setInterval(() => {
//     if (navigator.onLine && queryClientInstance) {
//       fetchAndCacheRecentOrders().catch(err => 
//         console.warn('⚠️ Background cache update failed:', err)
//       );
//     }
//   }, intervalMs);
// }

// // ✅ Stop background refresh
// export function stopAutoRefresh() {
//   if (refreshInterval) {
//     clearInterval(refreshInterval);
//     refreshInterval = null;
//     console.log('🛑 Auto-refresh stopped');
//   }
// }

// // utils/getOrdersOffline.js - FIXED VERSION
// import {
//   updateOrdersCache,
//   getCachedOrders,
//   STORAGE_KEYS,
//   save,
//   load
// } from './offlineStore.js';

// let refreshInterval;
// let queryClientInstance = null;

// // ✅ Initialize with queryClient from your app
// export function initializeOfflineCache(queryClient) {
//   queryClientInstance = queryClient;
//   console.log('✅ Offline cache initialized with QueryClient');
// }

// /**
//  * Fetch and cache recent orders from React Query
//  * ✅ FIXED: Pass isServerRefresh flag to prevent cache clearing
//  */
// export async function fetchAndCacheRecentOrders(forceRefresh = false) {
//   try {
//     if (!queryClientInstance) {
//       console.warn('⚠️ QueryClient not initialized. Call initializeOfflineCache() first.');
//       return await getCachedOrders();
//     }

//     // If force refresh, refetch queries first
//     if (forceRefresh) {
//       console.log('🔄 Force refreshing orders from server...');
//       await queryClientInstance.refetchQueries({ queryKey: ["orders"] });
      
//       // Wait a bit for the refetch to complete
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }

//     // Get all orders from React Query cache
//     const queryData = queryClientInstance.getQueriesData({ queryKey: ["orders"] });
    
//     let allOrders = [];
    
//     // Extract orders from all cached queries
//     for (const [key, data] of queryData) {
//       if (data?.pages) {
//         // Infinite query format
//         const orders = data.pages.flatMap(page => page?.data || []);
//         allOrders.push(...orders);
//       } else if (data?.data?.data) {
//         // Regular query format
//         allOrders.push(...data.data.data);
//       } else if (Array.isArray(data)) {
//         // Direct array format
//         allOrders.push(...data);
//       }
//     }

//     if (allOrders.length === 0 && !forceRefresh) {
//       console.log('📦 No orders in React Query cache yet');
//       return await getCachedOrders();
//     }

//     // ✅ FIX: Pass isServerRefresh flag to smart merge function
//     const cachedOrders = await updateOrdersCache(allOrders, { 
//       isServerRefresh: forceRefresh 
//     });

//     // Update metadata
//     await save(STORAGE_KEYS.METADATA, {
//       lastOrdersSync: Date.now(),
//       orderCount: cachedOrders.length
//     });

//     console.log(`✅ Synced ${cachedOrders.length} orders to cache`);
//     return cachedOrders;

//   } catch (err) {
//     console.warn('⚠️ Failed to cache orders:', err.message || err);
//     return await getCachedOrders();
//   }
// }

// // ✅ Export getCachedOrders from offlineStore
// export { getCachedOrders };

// // ✅ Start background refresh - syncs React Query to IndexedDB periodically
// export function startAutoRefresh(intervalMs = 30 * 1000) { // 30 seconds
//   if (refreshInterval) {
//     console.log('⚠️ Auto-refresh already running');
//     return;
//   }

//   console.log(`🔄 Starting auto-refresh (every ${intervalMs / 1000}s)`);
  
//   refreshInterval = setInterval(() => {
//     if (navigator.onLine && queryClientInstance) {
//       fetchAndCacheRecentOrders(true).catch(err => 
//         console.warn('⚠️ Background cache update failed:', err)
//       );
//     }
//   }, intervalMs);
// }

// // ✅ Stop background refresh
// export function stopAutoRefresh() {
//   if (refreshInterval) {
//     clearInterval(refreshInterval);
//     refreshInterval = null;
//     console.log('🛑 Auto-refresh stopped');
//   }
// }



// import {
//   updateOrdersCache,
//   getCachedOrders,
//   STORAGE_KEYS,
//   save,
//   load
// } from './offlineStore.js';

// let refreshInterval;
// let queryClientInstance = null;
// let offlineModeContext = null; // ✅ Store context reference

// let autoRefreshInterval = null;
// let offlineStatusGetter = null;

// // ✅ Initialize with queryClient AND offline context
// export function initializeOfflineCache(queryClient, getOfflineStatus) {
//   queryClientInstance = queryClient;
//   offlineModeContext = getOfflineStatus; // Function that returns { isOfflineMode, hasInternetConnection }
//   console.log('✅ Offline cache initialized with QueryClient and context');
// }

// /**
//  * Check if we're truly online (not just navigator.onLine)
//  */
// function isTrulyOnline() {
//   // Use context if available
//   if (offlineModeContext) {
//     const status = offlineModeContext();
//     return !status.isOfflineMode && status.hasInternetConnection;
//   }
  
//   // Fallback to navigator.onLine
//   return navigator.onLine;
// }

// /**
//  * Fetch and cache recent orders from React Query
//  */
// export async function fetchAndCacheRecentOrders(forceRefresh = false) {
//   try {
//     if (!queryClientInstance) {
//       console.warn('⚠️ QueryClient not initialized. Call initializeOfflineCache() first.');
//       return await getCachedOrders();
//     }

//     // ✅ FIX: Check true online status, not just navigator.onLine
//     if (!isTrulyOnline()) {
//       console.log('📴 Offline or no internet - using cached orders');
//       return await getCachedOrders();
//     }

//     // If force refresh, refetch queries first
//     if (forceRefresh) {
//       console.log('🔄 Force refreshing orders from server...');
//       await queryClientInstance.refetchQueries({ queryKey: ["orders"] });
      
//       // Wait a bit for the refetch to complete
//       await new Promise(resolve => setTimeout(resolve, 500));
//     }

//     // Get all orders from React Query cache
//     const queryData = queryClientInstance.getQueriesData({ queryKey: ["orders"] });
    
//     let allOrders = [];
    
//     // Extract orders from all cached queries
//     for (const [key, data] of queryData) {
//       if (data?.pages) {
//         // Infinite query format
//         const orders = data.pages.flatMap(page => page?.data || []);
//         allOrders.push(...orders);
//       } else if (data?.data?.data) {
//         // Regular query format
//         allOrders.push(...data.data.data);
//       } else if (Array.isArray(data)) {
//         // Direct array format
//         allOrders.push(...data);
//       }
//     }

//     if (allOrders.length === 0 && !forceRefresh) {
//       console.log('📦 No orders in React Query cache yet');
//       return await getCachedOrders();
//     }

//     // Update cache with server data
//     const cachedOrders = await updateOrdersCache(allOrders, { 
//       isServerRefresh: forceRefresh 
//     });

//     // Update metadata
//     await save(STORAGE_KEYS.METADATA, {
//       lastOrdersSync: Date.now(),
//       orderCount: cachedOrders.length
//     });

//     console.log(`✅ Synced ${cachedOrders.length} orders to cache`);
//     return cachedOrders;

//   } catch (err) {
//     console.warn('⚠️ Failed to cache orders:', err.message || err);
//     return await getCachedOrders();
//   }
// }

// // ✅ Export getCachedOrders from offlineStore
// export { getCachedOrders };

// // // ✅ Start background refresh - syncs React Query to IndexedDB periodically
// // export function startAutoRefresh(intervalMs = 30 * 1000) { // 30 seconds
// //   if (refreshInterval) {
// //     console.log('⚠️ Auto-refresh already running');
// //     return;
// //   }

// //   console.log(`🔄 Starting auto-refresh (every ${intervalMs / 1000}s)`);
  
// //   refreshInterval = setInterval(() => {
// //     // ✅ FIX: Check true online status
// //     if (isTrulyOnline() && queryClientInstance) {
// //       fetchAndCacheRecentOrders(true).catch(err => 
// //         console.warn('⚠️ Background cache update failed:', err)
// //       );
// //     }
// //   }, intervalMs);
// // }

// // // ✅ Stop background refresh
// // export function stopAutoRefresh() {
// //   if (refreshInterval) {
// //     clearInterval(refreshInterval);
// //     refreshInterval = null;
// //     console.log('🛑 Auto-refresh stopped');
// //   }
// // }

// // / ✅ NEW: Initialize with offline status getter
// export const initializeAutoRefreshWithOfflineCheck = (getOfflineStatus) => {
//   offlineStatusGetter = getOfflineStatus;
//   console.log('✅ [AUTO-REFRESH] Initialized with offline status checker');
// };

// export const startAutoRefresh = () => {
//   // Clear any existing interval
//   if (autoRefreshInterval) {
//     clearInterval(autoRefreshInterval);
//     console.log('🔄 [AUTO-REFRESH] Cleared existing interval');
//   }

//   console.log('▶️ [AUTO-REFRESH] Starting periodic order refresh...');
  
//   autoRefreshInterval = setInterval(() => {
//     // ✅ CHECK: Don't refresh if offline
//     if (offlineStatusGetter) {
//       const status = offlineStatusGetter();
//       if (status.isOfflineMode) {
//         console.log('⏸️ [AUTO-REFRESH] Skipping refresh - System is offline');
//         return; // Skip this refresh cycle
//       }
//     }

//     console.log('🔄 [AUTO-REFRESH] Refreshing orders...');
//     fetchAndCacheRecentOrders().catch(err => {
//       console.warn('⚠️ [AUTO-REFRESH] Refresh failed:', err.message);
//     });
//   }, 30000); // 30 seconds
// };

// // ✅ UPDATED: Stop auto-refresh
// export const stopAutoRefresh = () => {
//   if (autoRefreshInterval) {
//     clearInterval(autoRefreshInterval);
//     autoRefreshInterval = null;
//     console.log('⏹️ [AUTO-REFRESH] Stopped');
//   }
// };







// utils/getOrdersOffline.js - COMPLETE FIX with robust offline detection
import {
  updateOrdersCache,
  getCachedOrders,
  STORAGE_KEYS,
  save,
  load
} from './offlineStore.js';

let queryClientInstance = null;
let offlineModeContext = null;
let autoRefreshInterval = null;

// ============================================
// INITIALIZATION
// ============================================

export function initializeOfflineCache(queryClient, getOfflineStatus) {
  queryClientInstance = queryClient;
  offlineModeContext = getOfflineStatus;
  console.log('✅ [ORDERS CACHE] Initialized with QueryClient and context');
}

// ============================================
// ONLINE CHECK
// ============================================

function isTrulyOnline() {
  if (offlineModeContext) {
    const status = offlineModeContext();
    const isOnline = !status.isOfflineMode && status.hasInternetConnection && status.actualOnlineStatus;
    
    if (import.meta.env.MODE === 'development') {
      console.log('🔍 [ORDERS CACHE] Online check:', {
        isOnline,
        isOfflineMode: status.isOfflineMode,
        hasInternet: status.hasInternetConnection,
        interface: status.actualOnlineStatus
      });
    }
    
    return isOnline;
  }
  
  // Fallback
  return navigator.onLine;
}

// ============================================
// FETCH AND CACHE ORDERS
// ============================================

export async function fetchAndCacheRecentOrders(forceRefresh = false) {
  try {
    if (!queryClientInstance) {
      console.warn('⚠️ [ORDERS CACHE] QueryClient not initialized');
      return await getCachedOrders();
    }

    // ✅ CRITICAL: Check if truly online BEFORE attempting fetch
    if (!isTrulyOnline()) {
      console.log('📴 [ORDERS CACHE] Offline or no internet → Using cache');
      return await getCachedOrders();
    }

    // Force refresh if requested
    if (forceRefresh) {
      console.log('🔄 [ORDERS CACHE] Force refreshing from server...');
      await queryClientInstance.refetchQueries({ queryKey: ["orders"] });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Get orders from React Query cache
    const queryData = queryClientInstance.getQueriesData({ queryKey: ["orders"] });
    
    let allOrders = [];
    
    // Extract orders from all cached queries
    for (const [key, data] of queryData) {
      if (data?.pages) {
        // Infinite query format
        const orders = data.pages.flatMap(page => page?.data || []);
        allOrders.push(...orders);
      } else if (data?.data?.data) {
        // Regular query format
        allOrders.push(...data.data.data);
      } else if (Array.isArray(data)) {
        // Direct array format
        allOrders.push(...data);
      }
    }

    if (allOrders.length === 0 && !forceRefresh) {
      console.log('📦 [ORDERS CACHE] No orders in React Query cache yet');
      return await getCachedOrders();
    }

    // Update cache with server data
    const cachedOrders = await updateOrdersCache(allOrders, { 
      isServerRefresh: forceRefresh 
    });

    // Update metadata
    await save(STORAGE_KEYS.METADATA, {
      lastOrdersSync: Date.now(),
      orderCount: cachedOrders.length
    });

    console.log(`✅ [ORDERS CACHE] Synced ${cachedOrders.length} orders to cache`);
    return cachedOrders;

  } catch (err) {
    console.warn('⚠️ [ORDERS CACHE] Fetch failed:', err.message);
    return await getCachedOrders();
  }
}

// Export getCachedOrders for direct use
export { getCachedOrders };

// ============================================
// AUTO-REFRESH MANAGEMENT
// ============================================

export const startAutoRefresh = () => {
  // Clear existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    console.log('🔄 [AUTO-REFRESH] Cleared existing interval');
  }

  console.log('▶️ [AUTO-REFRESH] Starting periodic refresh (30s)');
  
  autoRefreshInterval = setInterval(() => {
    // ✅ CRITICAL: Check if online before refreshing
    if (!isTrulyOnline()) {
      console.log('⏸️ [AUTO-REFRESH] Skipping - System offline');
      return;
    }

    console.log('🔄 [AUTO-REFRESH] Refreshing orders...');
    fetchAndCacheRecentOrders().catch(err => {
      console.warn('⚠️ [AUTO-REFRESH] Failed:', err.message);
    });
  }, 30000); // 30 seconds
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    console.log('⏹️ [AUTO-REFRESH] Stopped');
  }
};