// // hooks/useOfflineData.js
// import { useState, useEffect } from "react";
// import { fetchInitialData } from "../utils/offlineMenu";
// import { getCachedOrders } from "../utils/getOrdersOffline";

// export default function useOfflineData() {
//   const [categories, setCategories] = useState([]);
//   const [dishes, setDishes] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   async function loadOfflineData() {
//     try {
//       // 1️⃣ Load cached data first
//       const { categories: cachedCats, dishes: cachedDishes } = await getCachedInitialData();
//       setCategories(cachedCats);
//       setDishes(cachedDishes);

//       // 2️⃣ Load cached orders
//       const cachedOrders = await getCachedOrders();
//       setOrders(cachedOrders);

//       setLoading(false);

//       // 3️⃣ Then fetch fresh data in background (optional)
//       fetchInitialData()
//         .then(({ categories: freshCats, dishes: freshDishes }) => {
//           setCategories(freshCats);
//           setDishes(freshDishes);
//         })
//         .catch(err => console.warn('Failed to refresh menu', err));

//       fetchAndCacheRecentOrders()
//         .then(freshOrders => setOrders(freshOrders))
//         .catch(err => console.warn('Failed to refresh orders', err));

//     } catch (err) {
//       console.error("⚠️ Failed to load offline data", err);
//       setLoading(false);
//     }
//   }

//   loadOfflineData();
// }, []);


//   return { categories, dishes, orders, loading };
// }


// hooks/useOfflineData.js
import { useState, useEffect } from "react";
import { fetchInitialData, getCachedInitialData } from "../utils/offlineMenu";
import { getCachedOrders, fetchAndCacheRecentOrders } from "../utils/getOrdersOffline";

export default function useOfflineData() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOfflineData() {
      try {
        // 1️⃣ Load cached data first (instant)
        const { categories: cachedCats, dishes: cachedDishes } = await getCachedInitialData();
        setCategories(cachedCats);
        setDishes(cachedDishes);

        // 2️⃣ Load cached orders (instant)
        const cachedOrders = await getCachedOrders();
        setOrders(cachedOrders);

        setLoading(false);

        // 3️⃣ Then fetch fresh data in background (only if online)
        if (navigator.onLine) {
          fetchInitialData()
            .then(({ categories: freshCats, dishes: freshDishes }) => {
              setCategories(freshCats);
              setDishes(freshDishes);
            })
            .catch(err => console.warn('Failed to refresh menu', err));

          fetchAndCacheRecentOrders()
            .then(freshOrders => setOrders(freshOrders))
            .catch(err => console.warn('Failed to refresh orders', err));
        }

      } catch (err) {
        console.error("⚠️ Failed to load offline data", err);
        setLoading(false);
      }
    }

    loadOfflineData();
  }, []);

  return { categories, dishes, orders, loading };
}