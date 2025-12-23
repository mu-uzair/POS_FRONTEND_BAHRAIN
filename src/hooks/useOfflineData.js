// // ============================================
// // FILE 5: hooks/useOfflineData.js (UPDATED)
// // ============================================
// import { useState, useEffect } from "react";
// import { fetchInitialData, getCachedInitialData } from "../utils/offlineMenu";
// import { getCachedOrders, fetchAndCacheRecentOrders } from "../utils/getOrdersOffline";

// export default function useOfflineData() {
//   const [categories, setCategories] = useState([]);
//   const [dishes, setDishes] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadOfflineData() {
//       try {
//         // 1️⃣ Load cached data first (instant)
//         const { categories: cachedCats, dishes: cachedDishes } = await getCachedInitialData();
//         setCategories(cachedCats);
//         setDishes(cachedDishes);

//         // 2️⃣ Load cached orders (instant)
//         const cachedOrders = await getCachedOrders();
//         setOrders(cachedOrders);

//         setLoading(false);

//         // 3️⃣ Then fetch fresh data in background (only if online)
//         if (navigator.onLine) {
//           fetchInitialData()
//             .then(({ categories: freshCats, dishes: freshDishes }) => {
//               setCategories(freshCats);
//               setDishes(freshDishes);
//             })
//             .catch(err => console.warn('Failed to refresh menu', err));

//           fetchAndCacheRecentOrders()
//             .then(freshOrders => setOrders(freshOrders))
//             .catch(err => console.warn('Failed to refresh orders', err));
//         }

//       } catch (err) {
//         console.error("⚠️ Failed to load offline data", err);
//         setLoading(false);
//       }
//     }

//     loadOfflineData();
//   }, []);

//   return { categories, dishes, orders, loading };
// }




// // hooks/useOfflineData.js - FIXED: Use offline context instead of navigator.onLine
// import { useState, useEffect } from "react";
// import { fetchInitialData, getCachedInitialData } from "../utils/offlineMenu";
// import { getCachedOrders, fetchAndCacheRecentOrders } from "../utils/getOrdersOffline";
// import { useOfflineMode } from "../constants/OfflineModeContext";

// export default function useOfflineData() {
//   const [categories, setCategories] = useState([]);
//   const [dishes, setDishes] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // ✅ FIX: Use offline context instead of navigator.onLine
//   const { isOfflineMode, hasInternetConnection, isCheckingConnectivity } = useOfflineMode();

//   useEffect(() => {
//     async function loadOfflineData() {
//       try {
//         console.log('📦 [useOfflineData] Loading data...', {
//           isOfflineMode,
//           hasInternetConnection,
//           isCheckingConnectivity
//         });

//         // 1️⃣ Load cached data first (instant)
//         const { categories: cachedCats, dishes: cachedDishes } = await getCachedInitialData();
//         setCategories(cachedCats);
//         setDishes(cachedDishes);

//         // 2️⃣ Load cached orders (instant)
//         const cachedOrders = await getCachedOrders();
//         setOrders(cachedOrders);

//         setLoading(false);

//         // ✅ 3️⃣ FIXED: Only fetch if truly online (not just navigator.onLine)
//         if (!isOfflineMode && hasInternetConnection) {
//           console.log('🌐 [useOfflineData] Online - refreshing data from server');
          
//           fetchInitialData()
//             .then(({ categories: freshCats, dishes: freshDishes }) => {
//               console.log('✅ [useOfflineData] Menu refreshed');
//               setCategories(freshCats);
//               setDishes(freshDishes);
//             })
//             .catch(err => console.warn('⚠️ Failed to refresh menu:', err.message));

//           fetchAndCacheRecentOrders()
//             .then(freshOrders => {
//               console.log('✅ [useOfflineData] Orders refreshed');
//               setOrders(freshOrders);
//             })
//             .catch(err => console.warn('⚠️ Failed to refresh orders:', err.message));
//         } else {
//           console.log('📴 [useOfflineData] Offline - using cached data only');
//         }

//       } catch (err) {
//         console.error("❌ [useOfflineData] Failed to load data:", err);
//         setLoading(false);
//       }
//     }

//     // ✅ Wait for connectivity check to complete before loading data
//     if (!isCheckingConnectivity) {
//       loadOfflineData();
//     }
//   }, [isOfflineMode, hasInternetConnection, isCheckingConnectivity]);

//   return { categories, dishes, orders, loading };
// }










// ============================================
// FILE 2: hooks/useOfflineData.js - COMPLETE FIX
// ============================================
import { useState, useEffect } from "react";
import { fetchInitialData, getCachedInitialData } from "../utils/offlineMenu";
import { getCachedOrders, fetchAndCacheRecentOrders } from "../utils/getOrdersOffline";
import { useOfflineMode } from "../constants/OfflineModeContext";

export default function useOfflineData() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isOfflineMode, hasInternetConnection, isCheckingConnectivity } = useOfflineMode();

  useEffect(() => {
    async function loadOfflineData() {
      try {
        console.log('📦 [useOfflineData] Loading...', {
          isOfflineMode,
          hasInternetConnection,
          isCheckingConnectivity
        });

        // 1️⃣ Load cached data FIRST (instant, works offline)
        console.log('📦 [useOfflineData] Loading from cache...');
        const { categories: cachedCats, dishes: cachedDishes } = await getCachedInitialData();
        setCategories(cachedCats);
        setDishes(cachedDishes);

        const cachedOrders = await getCachedOrders();
        setOrders(cachedOrders);

        console.log(`✅ [useOfflineData] Cache loaded: ${cachedCats.length} categories, ${cachedDishes.length} dishes, ${cachedOrders.length} orders`);
        
        setLoading(false);

        // 2️⃣ If ONLINE, refresh from server (non-blocking)
        if (!isOfflineMode && hasInternetConnection) {
          console.log('🌐 [useOfflineData] Online → Refreshing from server...');
          
          // Fetch menu (non-blocking)
          fetchInitialData()
            .then(({ categories: freshCats, dishes: freshDishes }) => {
              console.log(`✅ [useOfflineData] Menu refreshed: ${freshCats.length} categories, ${freshDishes.length} dishes`);
              setCategories(freshCats);
              setDishes(freshDishes);
            })
            .catch(err => {
              console.warn('⚠️ [useOfflineData] Menu refresh failed:', err.message);
            });

          // Fetch orders (non-blocking)
          fetchAndCacheRecentOrders()
            .then(freshOrders => {
              console.log(`✅ [useOfflineData] Orders refreshed: ${freshOrders.length} orders`);
              setOrders(freshOrders);
            })
            .catch(err => {
              console.warn('⚠️ [useOfflineData] Orders refresh failed:', err.message);
            });
        } else {
          console.log('📴 [useOfflineData] Offline → Using cache only');
        }

      } catch (err) {
        console.error("❌ [useOfflineData] Failed:", err);
        setLoading(false);
      }
    }

    // ✅ Wait for connectivity check before loading
    if (!isCheckingConnectivity) {
      loadOfflineData();
    } else {
      console.log('⏳ [useOfflineData] Waiting for connectivity check...');
    }
  }, [isOfflineMode, hasInternetConnection, isCheckingConnectivity]);

  return { categories, dishes, orders, loading };
}