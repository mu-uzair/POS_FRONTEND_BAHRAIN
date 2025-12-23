


// // ============================================
// // FILE 3: utils/offlineDeliveryBoys.js
// // ============================================
// import { 
//   getCachedDeliveryBoys,
//   updateCachedData,
//   STORAGE_KEYS
// } from './offlineStore.js';
// import { getDeliveryBoys } from '../https/index.js';

// /**
//  * Fetch delivery boys from server and store locally
//  */
// export async function fetchDeliveryBoys() {
//   try {
//     if (!navigator.onLine) {
//       console.log('📴 Offline - using cached delivery boys');
//       return await getCachedDeliveryBoys();
//     }

//     console.log('🔄 Fetching fresh delivery boys data...');
//     const res = await getDeliveryBoys();
//     const deliveryBoys = res.data?.data || [];

//     await updateCachedData(STORAGE_KEYS.DELIVERY_BOYS, deliveryBoys);
//     console.log(`✅ Cached ${deliveryBoys.length} delivery boys`);
//     return deliveryBoys;

//   } catch (err) {
//     console.warn('⚠️ Failed to fetch delivery boys:', err);
//     return await getCachedDeliveryBoys();
//   }
// }

// // Re-export for convenience
// export { getCachedDeliveryBoys };

// utils/offlineDeliveryBoys.js - FIXED: Use context instead of navigator.onLine
import { 
  getCachedDeliveryBoys,
  updateCachedData,
  STORAGE_KEYS
} from './offlineStore.js';
import { getDeliveryBoys } from '../https/index.js';

let offlineModeContext = null;

// ✅ Initialize with offline context
export function initializeDeliveryBoysCache(getOfflineStatus) {
  offlineModeContext = getOfflineStatus;
  console.log('✅ Delivery Boys cache initialized with offline context');
}


/**
 * Check if we're truly online, using the provided context.
 */
function isTrulyOnline() {
  if (offlineModeContext) {
    const status = offlineModeContext();
    return !status.isOfflineMode && status.hasInternetConnection;
  }
  // Fallback if context was not initialized
  return navigator.onLine;
}

/**
 * Fetch delivery boys from server and store locally
 * Falls back to cache if offline or API fails
 */
export async function fetchDeliveryBoys() {
  try {
    // ✅ FIX: Check true online status
    if (!isTrulyOnline()) {
      console.log('📴 Offline or no internet - using cached delivery boys');
      return await getCachedDeliveryBoys();
    }

    console.log('🔄 Fetching fresh delivery boys data...');
    const res = await getDeliveryBoys();
    const deliveryBoys = res.data?.data || [];

    await updateCachedData(STORAGE_KEYS.DELIVERY_BOYS, deliveryBoys);
    console.log(`✅ Cached ${deliveryBoys.length} delivery boys`);
    return deliveryBoys;

  } catch (err) {
    console.warn('⚠️ Failed to fetch delivery boys:', err);
    // Fallback to cached data
    return await getCachedDeliveryBoys();
  }
}

// Re-export for convenience
export { getCachedDeliveryBoys };