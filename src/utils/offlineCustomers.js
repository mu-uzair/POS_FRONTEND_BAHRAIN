
// // testing 
// // ============================================
// // FILE 2: utils/offlineCustomers.js
// // ============================================
// import { 
//   getCachedCustomers,
//   updateCachedData,
//   STORAGE_KEYS
// } from './offlineStore.js';
// import { getCustomers } from '../https/index.js';

// /**
//  * Fetch customers from server and store locally
//  */
// export async function fetchCustomers() {
//   try {
//     if (!navigator.onLine) {
//       console.log('📴 Offline - using cached customers');
//       return await getCachedCustomers();
//     }

//     console.log('🔄 Fetching fresh customers data...');
//     const res = await getCustomers();
//     const customers = res.data?.data || [];

//     await updateCachedData(STORAGE_KEYS.CUSTOMERS, customers);
//     console.log(`✅ Cached ${customers.length} customers`);
//     return customers;

//   } catch (err) {
//     console.warn('⚠️ Failed to fetch customers:', err);
//     return await getCachedCustomers();
//   }
// }

// // Re-export for convenience
// export { getCachedCustomers };




// // utils/offlineCustomers.js - FIXED: Use context instead of navigator.onLine
// import { 
//   getCachedCustomers,
//   updateCachedData,
//   STORAGE_KEYS
// } from './offlineStore.js';
// import { getCustomers } from '../https/index.js';

// let offlineModeContext = null;

// // ✅ Initialize with offline context
// export function initializeCustomersCache(getOfflineStatus) {
//   offlineModeContext = getOfflineStatus;
//   console.log('✅ Customers cache initialized with offline context');
// }

// // ✅ Export for App.jsx (if needed in main application)


// /**
//  * Check if we're truly online, using the provided context.
//  */
// function isTrulyOnline() {
//   if (offlineModeContext) {
//     const status = offlineModeContext();
//     return !status.isOfflineMode && status.hasInternetConnection;
//   }
//   // Fallback if context was not initialized (should not happen if setup correctly)
//   return navigator.onLine;
// }

// /**
//  * Fetch customers from server and store locally
//  * Falls back to cache if offline or API fails
//  */
// export async function fetchCustomers() {
//   try {
//     // ✅ FIX: Check true online status
//     if (!isTrulyOnline()) {
//       console.log('📴 Offline or no internet - using cached customers');
//       return await getCachedCustomers();
//     }

//     console.log('🔄 Fetching fresh customers data...');
//     const res = await getCustomers();
//     const customers = res.data?.data || [];

//     await updateCachedData(STORAGE_KEYS.CUSTOMERS, customers);
//     console.log(`✅ Cached ${customers.length} customers`);
//     return customers;

//   } catch (err) {
//     console.warn('⚠️ Failed to fetch customers:', err);
//     // Fallback to cached data
//     return await getCachedCustomers();
//   }
// }

// // Re-export for convenience
// export { getCachedCustomers };




// ============================================
// FILE 2: utils/offlineCustomers.js - FIXED
// ============================================
import { 
  getCachedCustomers,
  updateCachedData,
  STORAGE_KEYS
} from './offlineStore.js';
import { getCustomers } from '../https/index.js';

let customersContext = null;

export function initializeCustomersCache(getOfflineStatus) {
  customersContext = getOfflineStatus;
  console.log('✅ [CUSTOMERS CACHE] Initialized');
}

function isCustomersOnline() {
  if (customersContext) {
    const status = customersContext();
    return !status.isOfflineMode && status.hasInternetConnection;
  }
  return navigator.onLine;
}

export async function fetchCustomers() {
  try {
    if (!isCustomersOnline()) {
      console.log('📴 [CUSTOMERS] Offline - using cache');
      return await getCachedCustomers();
    }

    console.log('🔄 [CUSTOMERS] Fetching from server...');
    const res = await getCustomers();
    const customers = res.data?.data || [];

    await updateCachedData(STORAGE_KEYS.CUSTOMERS, customers);
    console.log(`✅ [CUSTOMERS] Cached ${customers.length} customers`);
    return customers;

  } catch (err) {
    console.warn('⚠️ [CUSTOMERS] Fetch failed:', err.message);
    return await getCachedCustomers();
  }
}

export { getCachedCustomers };