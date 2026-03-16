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
  // console.log('✅ [ORDERS CACHE] Initialized with QueryClient and context');
}

// ============================================
// ONLINE CHECK
// ============================================

function isTrulyOnline() {
  if (offlineModeContext) {
    const status = offlineModeContext();
    const isOnline = !status.isOfflineMode && status.hasInternetConnection && status.actualOnlineStatus;
    
    // if (import.meta.env.MODE === 'development') {
    //   console.log('🔍 [ORDERS CACHE] Online check:', {
    //     isOnline,
    //     isOfflineMode: status.isOfflineMode,
    //     hasInternet: status.hasInternetConnection,
    //     interface: status.actualOnlineStatus
    //   });
    // }
    
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
      // console.log('📦 [ORDERS CACHE] No orders in React Query cache yet');
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

    // console.log(`✅ [ORDERS CACHE] Synced ${cachedOrders.length} orders to cache`);
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
    // console.log('🔄 [AUTO-REFRESH] Cleared existing interval');
  }

  // console.log('▶️ [AUTO-REFRESH] Starting periodic refresh (30s)');
  
  autoRefreshInterval = setInterval(() => {
    // ✅ CRITICAL: Check if online before refreshing
    if (!isTrulyOnline()) {
      console.log('⏸️ [AUTO-REFRESH] Skipping - System offline');
      return;
    }

    // console.log('🔄 [AUTO-REFRESH] Refreshing orders...');
    fetchAndCacheRecentOrders().catch(err => {
      console.warn('⚠️ [AUTO-REFRESH] Failed:', err.message);
    });
  }, 30000); // 30 seconds
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    // console.log('⏹️ [AUTO-REFRESH] Stopped');
  }
};