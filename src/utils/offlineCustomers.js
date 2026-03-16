import { 
  getCachedCustomers,
  updateCachedData,
  STORAGE_KEYS
} from './offlineStore.js';
import { getCustomers } from '../https/index.js';

let customersContext = null;

export function initializeCustomersCache(getOfflineStatus) {
  customersContext = getOfflineStatus;
  // console.log('✅ [CUSTOMERS CACHE] Initialized');
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
      // console.log('📴 [CUSTOMERS] Offline - using cache');
      return await getCachedCustomers();
    }

    // console.log('🔄 [CUSTOMERS] Fetching from server...');
    const res = await getCustomers();
    const customers = res.data?.data || [];

    await updateCachedData(STORAGE_KEYS.CUSTOMERS, customers);
    // console.log(`✅ [CUSTOMERS] Cached ${customers.length} customers`);
    return customers;

  } catch (err) {
    console.warn('⚠️ [CUSTOMERS] Fetch failed:', err.message);
    return await getCachedCustomers();
  }
}

export { getCachedCustomers };