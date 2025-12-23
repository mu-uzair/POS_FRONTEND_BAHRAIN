// // testing 
// // ============================================
// // FILE 1: utils/offlineMenu.js
// // ============================================
// import { 
//   getCachedCategories, 
//   getCachedDishes,
//   updateCachedData,
//   STORAGE_KEYS
// } from './offlineStore.js';
// import { getCategories, getDishes } from '../https/index.js';

// /**
//  * Fetch categories and dishes from server and store locally
//  * Falls back to cache if offline or API fails
//  */
// export async function fetchInitialData() {
//   try {
//     if (!navigator.onLine) {
//       console.log('📴 Offline - using cached menu data');
//       return await getCachedInitialData();
//     }

//     console.log('🔄 Fetching fresh menu data...');
    
//     // Fetch both in parallel
//     const [catRes, dishRes] = await Promise.all([
//       getCategories().catch(err => {
//         console.warn('⚠️ Categories fetch failed:', err);
//         return { data: { data: [] } };
//       }),
//       getDishes().catch(err => {
//         console.warn('⚠️ Dishes fetch failed:', err);
//         return { data: { data: [] } };
//       })
//     ]);

//     const categories = catRes.data?.data || [];
//     const dishes = dishRes.data?.data || [];

//     // Save to cache
//     await updateCachedData(STORAGE_KEYS.CATEGORIES, categories);
//     await updateCachedData(STORAGE_KEYS.DISHES, dishes);

//     console.log(`✅ Cached ${categories.length} categories and ${dishes.length} dishes`);
//     return { categories, dishes };

//   } catch (err) {
//     console.error('❌ Failed to fetch menu data:', err);
//     // Fallback to cached data
//     return await getCachedInitialData();
//   }
// }

// /**
//  * Get locally cached categories and dishes
//  */
// export async function getCachedInitialData() {
//   const categories = await getCachedCategories();
//   const dishes = await getCachedDishes();
  
//   console.log(`📦 Retrieved ${categories.length} categories and ${dishes.length} dishes from cache`);
//   return { categories, dishes };
// }

// // Re-export for convenience
// export { getCachedCategories, getCachedDishes };







// // utils/offlineMenu.js - FIXED: Use context instead of navigator.onLine
// import { 
//   getCachedCategories, 
//   getCachedDishes,
//   updateCachedData,
//   STORAGE_KEYS
// } from './offlineStore.js';
// import { getCategories, getDishes } from '../https/index.js';

// let offlineModeContext = null;

// // ✅ Initialize with offline context
// export function initializeMenuCache(getOfflineStatus) {
//   offlineModeContext = getOfflineStatus;
//   console.log('✅ Menu cache initialized with offline context');
// }



// /**
//  * Check if we're truly online
//  */
// function isTrulyOnline() {
//   if (offlineModeContext) {
//     const status = offlineModeContext();
//     return !status.isOfflineMode && status.hasInternetConnection;
//   }
//   return navigator.onLine;
// }

// /**
//  * Fetch categories and dishes from server and store locally
//  * Falls back to cache if offline or API fails
//  */
// export async function fetchInitialData() {
//   try {
//     // ✅ FIX: Check true online status
//     if (!isTrulyOnline()) {
//       console.log('📴 Offline or no internet - using cached menu data');
//       return await getCachedInitialData();
//     }

//     console.log('🔄 Fetching fresh menu data...');
    
//     // Fetch both in parallel
//     const [catRes, dishRes] = await Promise.all([
//       getCategories().catch(err => {
//         console.warn('⚠️ Categories fetch failed:', err);
//         return { data: { data: [] } };
//       }),
//       getDishes().catch(err => {
//         console.warn('⚠️ Dishes fetch failed:', err);
//         return { data: { data: [] } };
//       })
//     ]);

//     const categories = catRes.data?.data || [];
//     const dishes = dishRes.data?.data || [];

//     // Save to cache
//     await updateCachedData(STORAGE_KEYS.CATEGORIES, categories);
//     await updateCachedData(STORAGE_KEYS.DISHES, dishes);

//     console.log(`✅ Cached ${categories.length} categories and ${dishes.length} dishes`);
//     return { categories, dishes };

//   } catch (err) {
//     console.error('❌ Failed to fetch menu data:', err);
//     // Fallback to cached data
//     return await getCachedInitialData();
//   }
// }

// /**
//  * Get locally cached categories and dishes
//  */
// export async function getCachedInitialData() {
//   const categories = await getCachedCategories();
//   const dishes = await getCachedDishes();
  
//   console.log(`📦 Retrieved ${categories.length} categories and ${dishes.length} dishes from cache`);
//   return { categories, dishes };
// }

// // Re-export for convenience
// export { getCachedCategories, getCachedDishes };




// ============================================
// FILE 1: utils/offlineMenu.js - FIXED
// ============================================
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
  console.log('✅ [MENU CACHE] Initialized');
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

    console.log('🔄 [MENU] Fetching from server...');
    
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

    console.log(`✅ [MENU] Cached ${categories.length} categories, ${dishes.length} dishes`);
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