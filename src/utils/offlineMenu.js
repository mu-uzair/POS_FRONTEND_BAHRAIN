//  utils/offlineMenu.js 

import { 
  getCachedCategories, 
  getCachedDishes,
  updateCachedData,
  STORAGE_KEYS
} from './offlineStore.js';
import { getCategories, getDishes } from '../https/index.js';

let offlineModeContext = null;

export function initializeMenuCache(getOfflineStatus) {
  offlineModeContext = getOfflineStatus;
  // console.log('✅ [MENU CACHE] Initialized');
}

function isTrulyOnline() {
  if (offlineModeContext) {
    const status = offlineModeContext();
    return !status.isOfflineMode && status.hasInternetConnection;
  }
  return navigator.onLine;
}

export async function fetchInitialData() {
  try {
    // ✅ CRITICAL: Check offline status BEFORE any API call
    if (!isTrulyOnline()) {
      console.log('📴 [MENU] Offline - using cache only');
      return await getCachedInitialData();
    }

    // console.log('🔄 [MENU] Fetching from server...');
    
    const [catRes, dishRes] = await Promise.all([
      getCategories().catch(err => {
        console.warn('⚠️ Categories failed:', err.message);
        return { data: { data: [] } };
      }),
      getDishes().catch(err => {
        console.warn('⚠️ Dishes failed:', err.message);
        return { data: { data: [] } };
      })
    ]);

    const categories = catRes.data?.data || [];
    const dishes = dishRes.data?.data || [];

    await updateCachedData(STORAGE_KEYS.CATEGORIES, categories);
    await updateCachedData(STORAGE_KEYS.DISHES, dishes);

    // console.log(`✅ [MENU] Cached ${categories.length} categories, ${dishes.length} dishes`);
    return { categories, dishes };

  } catch (err) {
    console.error('❌ [MENU] Fetch failed:', err);
    return await getCachedInitialData();
  }
}

export async function getCachedInitialData() {
  const categories = await getCachedCategories();
  const dishes = await getCachedDishes();
  
  console.log(`📦 [MENU] Cache: ${categories.length} categories, ${dishes.length} dishes`);
  return { categories, dishes };
}

export { getCachedCategories, getCachedDishes };