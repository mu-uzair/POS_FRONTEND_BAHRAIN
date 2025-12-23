
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory,KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect } from 'react';
// import { fetchAndCacheRecentOrders, startAutoRefresh } from './utils/getOrdersOffline';
// import { fetchInitialData } from './utils/offlineMenu';
// import { fetchDeliveryBoys } from './utils/offlineDeliveryBoys';
// import { fetchCustomers } from './utils/offlineCustomers';


// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"]; // Keep lowercase
//     const {isAuth} = useSelector(state => state.user);



//     if(isLoading) return <FullScreenLoader />



//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}

//             <Routes>
//                 <Route path="/" element={
//                     <ProtectedRoute>
//                         <Home />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/auth" element={isAuth ? <Navigate to = "/"/> :<Auth/>} />
//                 <Route path="/orders" element={
//                     <ProtectedRoute>
//                         <Orders />
//                     </ProtectedRoute>
//                 } /> {/* lowercase orders */}
//                 <Route path="/tables" element={
//                     <ProtectedRoute>
//                         <Tables />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/menu" element={
//                     <ProtectedRoute>
//                         <Menu />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/dashboard" element={
//                     <ProtectedRoute>
//                         <Dashboard />
//                     </ProtectedRoute>
//                 }
//                  /> {/* lowercase menu */}

//                 <Route
//                  path="/Inventory" 
//                  element={
//                     <ProtectedRoute>
//                         <Inventory />
//                     </ProtectedRoute>
//                 } 
//                 />

//                 <Route
//                  path="/kitchensection" 
//                  element={
//                     <ProtectedRoute>
//                         <KitchenSection />
//                     </ProtectedRoute>
//                 } 
//                 />
//                 <Route path="*" element={<div>Not Found</div>} />

//                 <Route
//                  path="/grillsection" 
//                  element={
//                     <ProtectedRoute>
//                         <GrillSection />
//                     </ProtectedRoute>
//                 } 
//                 />
//                 <Route
//                  path="/deliverymetrics" 
//                  element={
//                     <ProtectedRoute>
//                         <DeliveryMetrics />
//                     </ProtectedRoute>
//                 } 
//                 />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) {
//         return <Navigate to="/auth" />
//     }
//     return children;

// }


// function App() {


//  useEffect(() => {
//     async function initPOS() {
//       try {
//         // fetch categories & dishes once
//         await fetchInitialData().catch(err => {
//           console.warn('⚠️ Failed to fetch categories/dishes, using cache if available', err);
//         });
//         // fetch customer once
//         await fetchCustomers().catch(err => {
//           console.warn('⚠️ Failed to fetch customer, using cache if available', err);
//         });

//         // fetch delivery boys once
//         await fetchDeliveryBoys().catch(err => {
//           console.warn('⚠️ Failed to fetch delivery boys, using cache if available', err);
//         });

//         // fetch orders immediately
//         await fetchAndCacheRecentOrders().catch(err => {
//           console.warn('⚠️ Failed to fetch recent orders, using cache if available', err);
//         });

//         // start auto-refresh for orders
//         startAutoRefresh();
//       } catch (err) {
//         console.error('❌ Unexpected error during POS initialization', err);
//       }
//     }

//     initPOS();
//   }, []);
//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// export default App;



// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect } from 'react';
// import { fetchAndCacheRecentOrders, startAutoRefresh } from './utils/getOrdersOffline';
// import { fetchInitialData } from './utils/offlineMenu';
// import { fetchDeliveryBoys } from './utils/offlineDeliveryBoys';
// import { fetchCustomers } from './utils/offlineCustomers';
// import { useQueryClient } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";
// import { updateOrderStatus } from "./https/index";
// import { deleteOrder } from "./https/index";

// // ✅ Import offline utilities
// import { save, load } from "./utils/offlineStore";
// import { addOrder } from "./https";

// // ✅ Offline storage keys
// const OFFLINE_PENDING_SYNC_KEY = "offline:pendingSync";
// const OFFLINE_ORDERS_KEY = "offline:orders";

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}

//             <Routes>
//                 <Route path="/" element={
//                     <ProtectedRoute>
//                         <Home />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={
//                     <ProtectedRoute>
//                         <Orders />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/tables" element={
//                     <ProtectedRoute>
//                         <Tables />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/menu" element={
//                     <ProtectedRoute>
//                         <Menu />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/dashboard" element={
//                     <ProtectedRoute>
//                         <Dashboard />
//                     </ProtectedRoute>
//                 } />
//                 <Route
//                     path="/Inventory"
//                     element={
//                         <ProtectedRoute>
//                             <Inventory />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/kitchensection"
//                     element={
//                         <ProtectedRoute>
//                             <KitchenSection />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/grillsection"
//                     element={
//                         <ProtectedRoute>
//                             <GrillSection />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/deliverymetrics"
//                     element={
//                         <ProtectedRoute>
//                             <DeliveryMetrics />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) {
//         return <Navigate to="/auth" />
//     }
//     return children;
// }

// function App() {
//     const queryClient = useQueryClient();

//     // ✅ GLOBAL OFFLINE SYNC FUNCTION
//     useEffect(() => {
//         const syncOfflineOrders = async () => {
//             try {
//                 console.log("🔄 [GLOBAL SYNC] Checking for offline orders to sync...");

//                 const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
//                 console.log(`📦 [GLOBAL SYNC] Found ${pendingSync.length} items in sync queue`);

//                 if (pendingSync.length === 0) {
//                     console.log("✅ [GLOBAL SYNC] No offline orders to sync");
//                     return;
//                 }

//                 console.log("📋 [GLOBAL SYNC] PENDING SYNC QUEUE:", pendingSync);
//                 enqueueSnackbar(`Syncing ${pendingSync.length} offline orders...`, {
//                     variant: "info"
//                 });

//                 const failedSync = [];
//                 let successCount = 0;

//                 for (const syncItem of pendingSync) {
//                     try {
//                         console.log(`🔄 [GLOBAL SYNC] Processing: ${syncItem.type} - OrderID: ${syncItem.orderId}`);

                   

//                         // if (syncItem.type === "addOrder") {
//                         //     // existing logic
//                         //     const { isOffline, syncStatus, createdAt: offlineCreatedAt, updatedAt, ...cleanOrder } = syncItem.data;
//                         //     const response = await addOrder(cleanOrder);
//                         //     // remove from offline:orders after successful sync
//                         if (syncItem.type === "addOrder") {
//                         const { isOffline, syncStatus, createdAt: offlineCreatedAt, updatedAt, ...cleanOrder } = syncItem.data;
//                         const response = await addOrder(cleanOrder);
                        
//                         // ✅ Remove from offline:orders after successful sync
//                         const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
//                         const updatedOfflineOrders = offlineOrders.filter(
//                             o => (o._id || o.orderId) !== syncItem.orderId
//                         );
//                         await save(OFFLINE_ORDERS_KEY, updatedOfflineOrders);
//                         console.log(`🗑️ [GLOBAL SYNC] Removed order ${syncItem.orderId} from offline:orders`);
                        
//                         successCount++;
//                         } else if (syncItem.type === "updateStatus") {
//                             // NEW: handle offline status updates
//                             const { orderId, data } = syncItem;

//                             // Call your API to update order status on server
//                             await updateOrderStatus({ orderId, orderStatus: data.orderStatus });

//                             console.log(`✅ [GLOBAL SYNC] Status update for order ${orderId} synced successfully`);

//                             // Remove from offline:pendingSync
//                             const updatedPending = pendingSync.filter(item => item.orderId !== orderId);
//                             await save(OFFLINE_PENDING_SYNC_KEY, updatedPending);
//                             console.log(`🗑️ [GLOBAL SYNC] Removed ${orderId} from pendingSync`);
//                             successCount++;
//                         }
                       
                        
//                         else {
//                             console.warn(`⚠️ [GLOBAL SYNC] Unknown sync type: ${syncItem.type}`);
//                             failedSync.push(syncItem);
//                         }

//                     } catch (err) {
//                         console.error(`❌ [GLOBAL SYNC] Failed to sync order ${syncItem.orderId}:`, err);
//                         console.error("Error details:", err.response?.data || err.message);
//                         failedSync.push(syncItem);
//                     }
//                 }

//                 // Update sync queue with only failed items
//                 await save(OFFLINE_PENDING_SYNC_KEY, failedSync);

//                 console.log(`✅ [GLOBAL SYNC] Sync complete: ${successCount} succeeded, ${failedSync.length} failed`);

//                 if (failedSync.length === 0) {
//                     enqueueSnackbar(`All ${successCount} offline orders synced successfully!`, {
//                         variant: "success"
//                     });

//                     // Invalidate cache to refresh UI across all pages
//                     await queryClient.invalidateQueries(["orders"]);
//                     console.log("✅ [GLOBAL SYNC] Cache invalidated - UI will refresh with synced orders");
//                 } else {
//                     enqueueSnackbar(
//                         `${successCount} orders synced. ${failedSync.length} failed - will retry later.`,
//                         { variant: "warning" }
//                     );
//                     console.log("⚠️ [GLOBAL SYNC] FAILED ITEMS:", failedSync);
//                 }
//             } catch (error) {
//                 console.error("❌ [GLOBAL SYNC] SYNC ERROR:", error);
//                 enqueueSnackbar("Error syncing offline orders", { variant: "error" });
//             }
//         };

//         // Run sync when app mounts if online
//         if (navigator.onLine) {
//             console.log("🌐 [APP INIT] Device is ONLINE - Running sync...");
//             syncOfflineOrders();
//         } else {
//             console.log("📴 [APP INIT] Device is OFFLINE - Sync deferred");
//         }

//         // Listen for online event
//         const handleOnline = () => {
//             console.log("🌐 [ONLINE EVENT] DEVICE BACK ONLINE - Starting sync...");
//             syncOfflineOrders();
//         };

//         window.addEventListener("online", handleOnline);

//         // Cleanup listener on unmount
//         return () => {
//             window.removeEventListener("online", handleOnline);
//         };
//     }, [queryClient]);

//     // ✅ Initialize POS data (existing logic)
//     useEffect(() => {
//         async function initPOS() {
//             try {
//                 console.log("🚀 [POS INIT] Initializing POS system...");

//                 // Fetch categories & dishes once
//                 await fetchInitialData().catch(err => {
//                     console.warn('⚠️ Failed to fetch categories/dishes, using cache if available', err);
//                 });

//                 // Fetch customers once
//                 await fetchCustomers().catch(err => {
//                     console.warn('⚠️ Failed to fetch customers, using cache if available', err);
//                 });

//                 // Fetch delivery boys once
//                 await fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ Failed to fetch delivery boys, using cache if available', err);
//                 });

//                 // Fetch orders immediately
//                 await fetchAndCacheRecentOrders().catch(err => {
//                     console.warn('⚠️ Failed to fetch recent orders, using cache if available', err);
//                 });

//                 // Start auto-refresh for orders
//                 startAutoRefresh();

//                 console.log("✅ [POS INIT] POS system initialized successfully");
//             } catch (err) {
//                 console.error('❌ [POS INIT] Unexpected error during POS initialization', err);
//             }
//         }

//         initPOS();
//     }, []);

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect } from 'react';
// import { fetchAndCacheRecentOrders, startAutoRefresh } from './utils/getOrdersOffline';
// import { fetchInitialData } from './utils/offlineMenu';
// import { fetchDeliveryBoys } from './utils/offlineDeliveryBoys';
// import { fetchCustomers } from './utils/offlineCustomers';
// import { useQueryClient } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";
// import { updateOrderStatus } from "./https/index";
// import { deleteOrder } from "./https/index";

// // ✅ Import offline utilities
// import { save, load } from "./utils/offlineStore";
// import { addOrder } from "./https";

// // ✅ Import Offline Mode Context
// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';

// // ✅ Offline storage keys
// const OFFLINE_PENDING_SYNC_KEY = "offline:pendingSync";
// const OFFLINE_ORDERS_KEY = "offline:orders";

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}

//             <Routes>
//                 <Route path="/" element={
//                     <ProtectedRoute>
//                         <Home />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={
//                     <ProtectedRoute>
//                         <Orders />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/tables" element={
//                     <ProtectedRoute>
//                         <Tables />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/menu" element={
//                     <ProtectedRoute>
//                         <Menu />
//                     </ProtectedRoute>
//                 } />
//                 <Route path="/dashboard" element={
//                     <ProtectedRoute>
//                         <Dashboard />
//                     </ProtectedRoute>
//                 } />
//                 <Route
//                     path="/Inventory"
//                     element={
//                         <ProtectedRoute>
//                             <Inventory />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/kitchensection"
//                     element={
//                         <ProtectedRoute>
//                             <KitchenSection />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/grillsection"
//                     element={
//                         <ProtectedRoute>
//                             <GrillSection />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route
//                     path="/deliverymetrics"
//                     element={
//                         <ProtectedRoute>
//                             <DeliveryMetrics />
//                         </ProtectedRoute>
//                     }
//                 />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) {
//         return <Navigate to="/auth" />
//     }
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const { isOfflineMode, actualOnlineStatus } = useOfflineMode();

//     // ✅ GLOBAL OFFLINE SYNC FUNCTION
//     useEffect(() => {
//         const syncOfflineOrders = async () => {
//             // Only sync when online AND not in manual offline mode
//             if (!actualOnlineStatus || isOfflineMode) {
//                 console.log("⏸️ [GLOBAL SYNC] Sync skipped - Device offline or in offline mode");
//                 return;
//             }

//             try {
//                 console.log("🔄 [GLOBAL SYNC] Checking for offline orders to sync...");

//                 const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
//                 console.log(`📦 [GLOBAL SYNC] Found ${pendingSync.length} items in sync queue`);

//                 if (pendingSync.length === 0) {
//                     console.log("✅ [GLOBAL SYNC] No offline orders to sync");
//                     return;
//                 }

//                 console.log("📋 [GLOBAL SYNC] PENDING SYNC QUEUE:", pendingSync);
//                 enqueueSnackbar(`Syncing ${pendingSync.length} offline orders...`, {
//                     variant: "info"
//                 });

//                 const failedSync = [];
//                 let successCount = 0;

//                 for (const syncItem of pendingSync) {
//                     try {
//                         console.log(`🔄 [GLOBAL SYNC] Processing: ${syncItem.type} - OrderID: ${syncItem.orderId}`);

//                         if (syncItem.type === "addOrder") {
//                             const { isOffline, syncStatus, createdAt: offlineCreatedAt, updatedAt, ...cleanOrder } = syncItem.data;
//                             const response = await addOrder(cleanOrder);
                            
//                             // ✅ Remove from offline:orders after successful sync
//                             const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
//                             const updatedOfflineOrders = offlineOrders.filter(
//                                 o => (o._id || o.orderId) !== syncItem.orderId
//                             );
//                             await save(OFFLINE_ORDERS_KEY, updatedOfflineOrders);
//                             console.log(`🗑️ [GLOBAL SYNC] Removed order ${syncItem.orderId} from offline:orders`);
                            
//                             successCount++;
//                         } else if (syncItem.type === "updateStatus") {
//                             const { orderId, data } = syncItem;
//                             await updateOrderStatus({ orderId, orderStatus: data.orderStatus });
//                             console.log(`✅ [GLOBAL SYNC] Status update for order ${orderId} synced successfully`);
//                             successCount++;
//                         } else {
//                             console.warn(`⚠️ [GLOBAL SYNC] Unknown sync type: ${syncItem.type}`);
//                             failedSync.push(syncItem);
//                         }

//                     } catch (err) {
//                         console.error(`❌ [GLOBAL SYNC] Failed to sync order ${syncItem.orderId}:`, err);
//                         console.error("Error details:", err.response?.data || err.message);
//                         failedSync.push(syncItem);
//                     }
//                 }

//                 // Update sync queue with only failed items
//                 await save(OFFLINE_PENDING_SYNC_KEY, failedSync);

//                 console.log(`✅ [GLOBAL SYNC] Sync complete: ${successCount} succeeded, ${failedSync.length} failed`);

//                 if (failedSync.length === 0) {
//                     enqueueSnackbar(`All ${successCount} offline orders synced successfully!`, {
//                         variant: "success"
//                     });
//                     await queryClient.invalidateQueries(["orders"]);
//                     console.log("✅ [GLOBAL SYNC] Cache invalidated - UI will refresh with synced orders");
//                 } else {
//                     enqueueSnackbar(
//                         `${successCount} orders synced. ${failedSync.length} failed - will retry later.`,
//                         { variant: "warning" }
//                     );
//                     console.log("⚠️ [GLOBAL SYNC] FAILED ITEMS:", failedSync);
//                 }
//             } catch (error) {
//                 console.error("❌ [GLOBAL SYNC] SYNC ERROR:", error);
//                 enqueueSnackbar("Error syncing offline orders", { variant: "error" });
//             }
//         };

//         // Run sync when switching to online mode
//         if (actualOnlineStatus && !isOfflineMode) {
//             console.log("🌐 [MODE CHANGE] Online mode active - Running sync...");
//             syncOfflineOrders();
//         }

//         // Listen for online event
//         const handleOnline = () => {
//             if (!isOfflineMode) {
//                 console.log("🌐 [ONLINE EVENT] DEVICE BACK ONLINE - Starting sync...");
//                 syncOfflineOrders();
//             }
//         };

//         window.addEventListener("online", handleOnline);

//         return () => {
//             window.removeEventListener("online", handleOnline);
//         };
//     }, [queryClient, isOfflineMode, actualOnlineStatus]);

//     // ✅ Initialize POS data
//     useEffect(() => {
//         async function initPOS() {
//             try {
//                 console.log("🚀 [POS INIT] Initializing POS system...");

//                 // Fetch categories & dishes once
//                 await fetchInitialData().catch(err => {
//                     console.warn('⚠️ Failed to fetch categories/dishes, using cache if available', err);
//                 });

//                 // Fetch customers once
//                 await fetchCustomers().catch(err => {
//                     console.warn('⚠️ Failed to fetch customers, using cache if available', err);
//                 });

//                 // Fetch delivery boys once
//                 await fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ Failed to fetch delivery boys, using cache if available', err);
//                 });

//                 // Fetch orders immediately (only if online)
//                 if (actualOnlineStatus && !isOfflineMode) {
//                     await fetchAndCacheRecentOrders().catch(err => {
//                         console.warn('⚠️ Failed to fetch recent orders, using cache if available', err);
//                     });
//                 }

//                 // Start auto-refresh for orders (will respect offline mode)
//                 startAutoRefresh();

//                 console.log("✅ [POS INIT] POS system initialized successfully");
//             } catch (err) {
//                 console.error('❌ [POS INIT] Unexpected error during POS initialization', err);
//             }
//         }

//         initPOS();
//     }, [actualOnlineStatus, isOfflineMode]);

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;

// testing 


// // ============================================
// // FILE 4: App.js (UPDATED & SIMPLIFIED)
// // ============================================
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect } from 'react';
// import { useQueryClient } from "@tanstack/react-query";

// // ✅ Unified imports
// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { fetchAndCacheRecentOrders, startAutoRefresh, initializeOfflineCache, stopAutoRefresh } from './utils/getOrdersOffline';
// import { fetchInitialData } from './utils/offlineMenu';
// import { fetchDeliveryBoys } from './utils/offlineDeliveryBoys';
// import { fetchCustomers } from './utils/offlineCustomers';
// import { fetchAndCacheTables } from './utils/offlineTable';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const { isOfflineMode, actualOnlineStatus, hasInternetConnection } = useOfflineMode();
    
//     // ✅ SINGLE sync manager - handles all sync operations
//     const { syncPendingItems } = useSyncManager();

//     // ✅ Initialize POS data on mount
//     useEffect(() => {
//         async function initPOS() {
//             try {
//                 console.log("🚀 [POS INIT] Initializing POS system...");

//                 // Initialize offline cache with queryClient
//                 initializeOfflineCache(queryClient);

//                 // Fetch reference data (categories, dishes, customers, delivery boys)
//                 // These will use cached data if offline
//                 await Promise.allSettled([
//                     fetchInitialData().catch(err => 
//                         console.warn('⚠️ Menu data fetch failed, using cache', err)
//                     ),
//                     fetchCustomers().catch(err => 
//                         console.warn('⚠️ Customers fetch failed, using cache', err)
//                     ),
//                     fetchDeliveryBoys().catch(err => 
//                         console.warn('⚠️ Delivery boys fetch failed, using cache', err)
//                     ),
//                     fetchAndCacheTables().catch(err => 
//                         console.warn('⚠️ Table fetch failed, using cache', err)
//                     )
//                 ]);

//                 // Fetch orders if online
//                 if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
//                     await fetchAndCacheRecentOrders().catch(err =>
//                         console.warn('⚠️ Orders fetch failed, using cache', err)
//                     );
//                 }

//                 // Start auto-refresh for orders (respects offline mode)
//                 startAutoRefresh();

//                 console.log("✅ [POS INIT] POS system initialized successfully");
//             } catch (err) {
//                 console.error('❌ [POS INIT] Unexpected error', err);
//             }
//         }

//         initPOS();

//         // Cleanup on unmount
//         return () => {
//             console.log("🛑 [POS] Cleaning up");
//         };
//     }, [queryClient, actualOnlineStatus, hasInternetConnection, isOfflineMode]);

//     // ✅ Refresh orders cache when coming online
//     useEffect(() => {
//         if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
//             console.log("🔄 [POS] Online - refreshing orders cache");
//             fetchAndCacheRecentOrders().catch(err =>
//                 console.warn('⚠️ Failed to refresh orders', err)
//             );
//         }
//     }, [actualOnlineStatus, hasInternetConnection, isOfflineMode]);

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     const queryClient = useQueryClient();
//      useEffect(() => {
//     initializeOfflineCache(queryClient);
//     startAutoRefresh(30000); 
    
//     return () => stopAutoRefresh();
//   }, [queryClient]);
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;

// // App.jsx - FIXED: Initialize all caches with offline context
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect } from 'react';
// import { useQueryClient } from "@tanstack/react-query";

// // ✅ Unified imports
// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { fetchAndCacheRecentOrders, startAutoRefresh, initializeOfflineCache, stopAutoRefresh } from './utils/getOrdersOffline';
// import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
// import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
// import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
// import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const offlineContext = useOfflineMode(); // ✅ Get full context
//     const { isOfflineMode, actualOnlineStatus, hasInternetConnection } = offlineContext;
    
//     // ✅ SINGLE sync manager - handles all sync operations
//     const { syncPendingItems } = useSyncManager();

//     // ✅ Initialize POS data on mount
//     useEffect(() => {
//         async function initPOS() {
//             try {
//                 console.log("🚀 [POS INIT] Initializing POS system...");

//                 // ✅ FIX: Create a function that returns current offline status
//                 const getOfflineStatus = () => ({
//                     isOfflineMode: offlineContext.isOfflineMode,
//                     hasInternetConnection: offlineContext.hasInternetConnection,
//                     actualOnlineStatus: offlineContext.actualOnlineStatus
//                 });

//                 // ✅ Initialize ALL caches with offline context
//                 initializeOfflineCache(queryClient, getOfflineStatus);
//                 initializeMenuCache(getOfflineStatus);
//                 initializeCustomersCache(getOfflineStatus);
//                 initializeDeliveryBoysCache(getOfflineStatus);
//                 initializeTablesCache(getOfflineStatus); // ✅ ADD THIS

//                 // Fetch reference data (these now respect offline mode internally)
//                 await Promise.allSettled([
//                     fetchInitialData().catch(err => 
//                         console.warn('⚠️ Menu data fetch failed, using cache', err)
//                     ),
//                     fetchCustomers().catch(err => 
//                         console.warn('⚠️ Customers fetch failed, using cache', err)
//                     ),
//                     fetchDeliveryBoys().catch(err => 
//                         console.warn('⚠️ Delivery boys fetch failed, using cache', err)
//                     ),
//                     fetchAndCacheTables().catch(err => 
//                         console.warn('⚠️ Table fetch failed, using cache', err)
//                     )
//                 ]);

//                 // Fetch orders (now respects offline mode internally)
//                 await fetchAndCacheRecentOrders().catch(err =>
//                     console.warn('⚠️ Orders fetch failed, using cache', err)
//                 );

//                 // Start auto-refresh (respects offline mode internally)
//                 startAutoRefresh();

//                 console.log("✅ [POS INIT] POS system initialized successfully");
//             } catch (err) {
//                 console.error('❌ [POS INIT] Unexpected error', err);
//             }
//         }

//         initPOS();

//         // Cleanup on unmount
//         return () => {
//             console.log("🛑 [POS] Cleaning up");
//             stopAutoRefresh();
//         };
//     }, [queryClient]); // ✅ Only depend on queryClient, context is captured

//     // ✅ Refresh orders cache when coming online
//     useEffect(() => {
//         if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
//             console.log("🔄 [POS] Online - refreshing orders cache");
//             fetchAndCacheRecentOrders().catch(err =>
//                 console.warn('⚠️ Failed to refresh orders', err)
//             );
//         }
//     }, [actualOnlineStatus, hasInternetConnection, isOfflineMode]);

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;


// // App.jsx - Fixed to prevent API calls when offline is detected
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect, useState, useCallback } from 'react';
// import { useQueryClient } from "@tanstack/react-query";
// import { enqueueSnackbar } from 'notistack';

// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { 
//     fetchAndCacheRecentOrders, 
//     startAutoRefresh, 
//     initializeOfflineCache, 
//     stopAutoRefresh 
// } from './utils/getOrdersOffline';
// import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
// import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
// import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
// import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
// import { 
//     initializeSmartRequest, 
//     isSmartRequestInitialized,
//     processQueuedRequests,
//     getQueueSize
// } from './utils/smartRequest';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const offlineContext = useOfflineMode();
//     const { 
//         isOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection,
//         manualOfflineMode 
//     } = offlineContext;
    
//     const { syncPendingItems } = useSyncManager();
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [initError, setInitError] = useState(null);

//     // ============================================
//     // STEP 1: INITIALIZE SMART REQUEST SYSTEM FIRST
//     // ============================================
//     useEffect(() => {
//         const initSmartRequest = () => {
//             try {
//                 console.log("🔧 [INIT] Initializing Smart Request System...");
                
//                 if (isSmartRequestInitialized()) {
//                     console.log("✅ [INIT] Smart Request already initialized");
//                     return;
//                 }

//                 const getOfflineContext = () => {
//                     try {
//                         return {
//                             isOfflineMode: offlineContext.isOfflineMode,
//                             manualOfflineMode: offlineContext.manualOfflineMode,
//                             actualOnlineStatus: offlineContext.actualOnlineStatus,
//                             hasInternetConnection: offlineContext.hasInternetConnection
//                         };
//                     } catch (error) {
//                         console.error('❌ [INIT] Error getting offline context:', error);
//                         return {
//                             isOfflineMode: !navigator.onLine,
//                             manualOfflineMode: false,
//                             actualOnlineStatus: navigator.onLine,
//                             hasInternetConnection: navigator.onLine
//                         };
//                     }
//                 };

//                 initializeSmartRequest(getOfflineContext);
//                 console.log("✅ [INIT] Smart Request System initialized successfully");
//             } catch (error) {
//                 console.error('❌ [INIT] Failed to initialize Smart Request:', error);
//                 setInitError(error.message);
//                 enqueueSnackbar('System initialization error', { variant: 'error' });
//             }
//         };

//         initSmartRequest();
//     }, []);

//     // ============================================
//     // STEP 2: INITIALIZE POS SYSTEM - ONLY WHEN ONLINE
//     // ============================================
//     const initializePOS = useCallback(async () => {
//         if (isInitialized) {
//             console.log("⚠️ [POS] Already initialized, skipping");
//             return;
//         }

//         try {
//             console.log("🚀 [POS] Starting initialization...");

//             const getOfflineStatus = () => ({
//                 isOfflineMode: offlineContext.isOfflineMode,
//                 hasInternetConnection: offlineContext.hasInternetConnection,
//                 actualOnlineStatus: offlineContext.actualOnlineStatus
//             });

//             // ✅ ALWAYS initialize caches first (even offline)
//             console.log("📦 [POS] Initializing caches...");
//             initializeOfflineCache(queryClient, getOfflineStatus);
//             initializeMenuCache(getOfflineStatus);
//             initializeCustomersCache(getOfflineStatus);
//             initializeDeliveryBoysCache(getOfflineStatus);
//             initializeTablesCache(getOfflineStatus);

//             // ✅ CHECK: Only fetch if ONLINE
//             if (isOfflineMode) {
//                 console.log("📴 [POS] System is OFFLINE - Skipping API calls");
//                 console.log("📦 [POS] Using cached data only");
                
//                 setIsInitialized(true);
                
//                 enqueueSnackbar('Working in offline mode with cached data', { 
//                     variant: 'info',
//                     autoHideDuration: 3000 
//                 });
                
//                 return; // ✅ STOP HERE - Don't make any API calls
//             }

//             // ✅ ONLINE: Fetch reference data
//             console.log("🌐 [POS] System is ONLINE - Fetching reference data...");
//             const dataFetches = [
//                 fetchInitialData().catch(err => {
//                     console.warn('⚠️ [POS] Menu data fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchCustomers().catch(err => {
//                     console.warn('⚠️ [POS] Customers fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ [POS] Delivery boys fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchAndCacheTables().catch(err => {
//                     console.warn('⚠️ [POS] Tables fetch failed:', err.message);
//                     return null;
//                 })
//             ];

//             const results = await Promise.allSettled(dataFetches);
//             const successCount = results.filter(r => r.status === 'fulfilled').length;
//             console.log(`📊 [POS] Reference data: ${successCount}/${results.length} successful`);

//             // Fetch orders
//             console.log("📋 [POS] Fetching orders...");
//             await fetchAndCacheRecentOrders().catch(err => {
//                 console.warn('⚠️ [POS] Orders fetch failed:', err.message);
//                 return null;
//             });

//             // Start auto-refresh (only when online)
//             console.log("⏰ [POS] Starting auto-refresh...");
//             startAutoRefresh();

//             setIsInitialized(true);
//             console.log("✅ [POS] Initialization complete");

//             enqueueSnackbar('POS System ready', { 
//                 variant: 'success',
//                 autoHideDuration: 2000 
//             });

//         } catch (error) {
//             console.error('❌ [POS] Initialization failed:', error);
//             setInitError(error.message);
//             enqueueSnackbar('Failed to initialize POS system', { 
//                 variant: 'error',
//                 persist: true 
//             });
//         }
//     }, [queryClient, offlineContext, isOfflineMode, isInitialized]);

//     // ✅ Wait for offline detection to complete before initializing
//     useEffect(() => {
//         // Wait a bit for offline detection to stabilize
//         const timer = setTimeout(() => {
//             console.log(`🔍 [POS] Offline status: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
//             initializePOS();
//         }, 500); // Small delay to let offline detection complete

//         return () => {
//             clearTimeout(timer);
//             console.log("🛑 [POS] Cleaning up");
//             stopAutoRefresh();
//         };
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ============================================
//     // STEP 3: HANDLE ONLINE/OFFLINE TRANSITIONS
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized) return;

//         const handleOnlineTransition = async () => {
//             console.log("🌐 [TRANSITION] Going online - syncing data");
            
//             try {
//                 const queueSize = getQueueSize();
//                 if (queueSize > 0) {
//                     console.log(`📤 [SYNC] Processing ${queueSize} queued requests...`);
//                     const results = await processQueuedRequests();
                    
//                     if (results.succeeded > 0) {
//                         enqueueSnackbar(
//                             `Synced ${results.succeeded} pending operations`, 
//                             { variant: 'success' }
//                         );
//                     }
                    
//                     if (results.failed > 0) {
//                         console.warn(`⚠️ [SYNC] ${results.failed} operations failed`);
//                     }
//                 }

//                 await syncPendingItems();

//                 console.log("🔄 [SYNC] Refreshing orders cache");
//                 await fetchAndCacheRecentOrders();

//                 // Start auto-refresh when coming online
//                 startAutoRefresh();

//                 console.log("✅ [TRANSITION] Online transition complete");
//             } catch (error) {
//                 console.error('❌ [TRANSITION] Sync failed:', error);
//                 enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
//             }
//         };

//         const handleOfflineTransition = () => {
//             console.log("📴 [TRANSITION] Going offline - stopping auto-refresh");
//             stopAutoRefresh();
//             enqueueSnackbar('Working in offline mode with cached data', { 
//                 variant: 'info',
//                 autoHideDuration: 3000 
//             });
//         };

//         // Detect transition
//         if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
//             handleOnlineTransition();
//         } else if (isOfflineMode) {
//             handleOfflineTransition();
//         }
//     }, [actualOnlineStatus, hasInternetConnection, isOfflineMode, isInitialized, syncPendingItems]);

//     // ============================================
//     // STEP 4: PERIODIC CACHE REFRESH (ONLY WHEN ONLINE)
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized || isOfflineMode) {
//             console.log("⏸️ [CACHE] Periodic refresh paused (offline or not initialized)");
//             return;
//         }

//         console.log("▶️ [CACHE] Starting periodic refresh (online mode)");
//         const refreshInterval = setInterval(() => {
//             console.log("⏰ [CACHE] Periodic refresh triggered");
//             fetchAndCacheRecentOrders().catch(err => 
//                 console.warn('⚠️ [CACHE] Periodic refresh failed:', err)
//             );
//         }, 5 * 60 * 1000); // 5 minutes

//         return () => {
//             console.log("⏸️ [CACHE] Stopping periodic refresh");
//             clearInterval(refreshInterval);
//         };
//     }, [isInitialized, isOfflineMode]);

//     // ============================================
//     // STEP 5: LOGGING & MONITORING
//     // ============================================
//     useEffect(() => {
//         const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//         console.log(`${statusEmoji} [APP] Status Update:`, {
//             isOfflineMode,
//             manualOfflineMode,
//             actualOnlineStatus,
//             hasInternetConnection,
//             isInitialized,
//             timestamp: new Date().toLocaleTimeString()
//         });
//     }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isInitialized]);

//     if (initError) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 padding: '20px',
//                 textAlign: 'center'
//             }}>
//                 <h2>⚠️ Initialization Error</h2>
//                 <p style={{ color: '#dc2626', marginBottom: '20px' }}>{initError}</p>
//                 <button 
//                     onClick={() => window.location.reload()}
//                     style={{
//                         padding: '10px 20px',
//                         background: '#3b82f6',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Reload Application
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;






// // App.jsx - COMPLETE FIX with React Query sync
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect, useState, useCallback } from 'react';
// import { useQueryClient, onlineManager } from "@tanstack/react-query";
// import { enqueueSnackbar } from 'notistack';

// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { 
//     fetchAndCacheRecentOrders, 
//     startAutoRefresh, 
//     initializeOfflineCache, 
//     stopAutoRefresh 
// } from './utils/getOrdersOffline';
// import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
// import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
// import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
// import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
// import { 
//     initializeSmartRequest, 
//     isSmartRequestInitialized,
//     processQueuedRequests,
//     getQueueSize
// } from './utils/smartRequest';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const offlineContext = useOfflineMode();
//     const { 
//         isOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection,
//         manualOfflineMode,
//         isCheckingConnectivity 
//     } = offlineContext;
    
//     const { syncPendingItems } = useSyncManager();
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [initError, setInitError] = useState(null);

//     // ============================================
//     // 🔧 FIX 1: SYNC REACT QUERY ONLINE MANAGER
//     // ============================================
//     useEffect(() => {
//         const isTrulyOnline = hasInternetConnection && !isOfflineMode;
//         onlineManager.setOnline(isTrulyOnline);
        
//         console.log(`🔄 [RQ SYNC] OnlineManager set to: ${isTrulyOnline}`, {
//             hasInternetConnection,
//             isOfflineMode,
//             actualOnlineStatus
//         });
//     }, [isOfflineMode, hasInternetConnection, actualOnlineStatus]);

//     // ============================================
//     // STEP 1: INITIALIZE SMART REQUEST SYSTEM FIRST
//     // ============================================
//     useEffect(() => {
//         const initSmartRequest = () => {
//             try {
//                 console.log("🔧 [INIT] Initializing Smart Request System...");
                
//                 if (isSmartRequestInitialized()) {
//                     console.log("✅ [INIT] Smart Request already initialized");
//                     return;
//                 }

//                 const getOfflineContext = () => {
//                     try {
//                         return {
//                             isOfflineMode: offlineContext.isOfflineMode,
//                             manualOfflineMode: offlineContext.manualOfflineMode,
//                             actualOnlineStatus: offlineContext.actualOnlineStatus,
//                             hasInternetConnection: offlineContext.hasInternetConnection
//                         };
//                     } catch (error) {
//                         console.error('❌ [INIT] Error getting offline context:', error);
//                         return {
//                             isOfflineMode: !navigator.onLine,
//                             manualOfflineMode: false,
//                             actualOnlineStatus: navigator.onLine,
//                             hasInternetConnection: navigator.onLine
//                         };
//                     }
//                 };

//                 initializeSmartRequest(getOfflineContext);
//                 console.log("✅ [INIT] Smart Request System initialized successfully");
//             } catch (error) {
//                 console.error('❌ [INIT] Failed to initialize Smart Request:', error);
//                 setInitError(error.message);
//                 enqueueSnackbar('System initialization error', { variant: 'error' });
//             }
//         };

//         initSmartRequest();
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ============================================
//     // STEP 2: INITIALIZE POS SYSTEM - WAIT FOR CONNECTIVITY CHECK
//     // ============================================
//     const initializePOS = useCallback(async () => {
//         if (isInitialized) {
//             console.log("⚠️ [POS] Already initialized, skipping");
//             return;
//         }

//         // ✅ CRITICAL: Wait for connectivity check to complete
//         if (isCheckingConnectivity) {
//             console.log("⏳ [POS] Waiting for connectivity check to complete...");
//             return;
//         }

//         try {
//             console.log("🚀 [POS] Starting initialization...");

//             const getOfflineStatus = () => ({
//                 isOfflineMode: offlineContext.isOfflineMode,
//                 hasInternetConnection: offlineContext.hasInternetConnection,
//                 actualOnlineStatus: offlineContext.actualOnlineStatus
//             });

//             // ✅ ALWAYS initialize caches first (even offline)
//             console.log("📦 [POS] Initializing caches...");
//             initializeOfflineCache(queryClient, getOfflineStatus);
//             initializeMenuCache(getOfflineStatus);
//             initializeCustomersCache(getOfflineStatus);
//             initializeDeliveryBoysCache(getOfflineStatus);
//             initializeTablesCache(getOfflineStatus);

//             // ✅ CHECK: Only fetch if ONLINE
//             if (isOfflineMode) {
//                 console.log("📴 [POS] System is OFFLINE - Skipping API calls");
//                 console.log("📦 [POS] Using cached data only");
                
//                 setIsInitialized(true);
                
//                 enqueueSnackbar('Working in offline mode with cached data', { 
//                     variant: 'info',
//                     autoHideDuration: 3000 
//                 });
                
//                 return; // ✅ STOP HERE - Don't make any API calls
//             }

//             // ✅ ONLINE: Fetch reference data
//             console.log("🌐 [POS] System is ONLINE - Fetching reference data...");
//             const dataFetches = [
//                 fetchInitialData().catch(err => {
//                     console.warn('⚠️ [POS] Menu data fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchCustomers().catch(err => {
//                     console.warn('⚠️ [POS] Customers fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ [POS] Delivery boys fetch failed:', err.message);
//                     return null;
//                 }),
//                 fetchAndCacheTables().catch(err => {
//                     console.warn('⚠️ [POS] Tables fetch failed:', err.message);
//                     return null;
//                 })
//             ];

//             const results = await Promise.allSettled(dataFetches);
//             const successCount = results.filter(r => r.status === 'fulfilled').length;
//             console.log(`📊 [POS] Reference data: ${successCount}/${results.length} successful`);

//             // Fetch orders
//             console.log("📋 [POS] Fetching orders...");
//             await fetchAndCacheRecentOrders().catch(err => {
//                 console.warn('⚠️ [POS] Orders fetch failed:', err.message);
//                 return null;
//             });

//             // Start auto-refresh (only when online)
//             console.log("⏰ [POS] Starting auto-refresh...");
//             startAutoRefresh();

//             setIsInitialized(true);
//             console.log("✅ [POS] Initialization complete");

//             enqueueSnackbar('POS System ready', { 
//                 variant: 'success',
//                 autoHideDuration: 2000 
//             });

//         } catch (error) {
//             console.error('❌ [POS] Initialization failed:', error);
//             setInitError(error.message);
//             enqueueSnackbar('Failed to initialize POS system', { 
//                 variant: 'error',
//                 persist: true 
//             });
//         }
//     }, [queryClient, offlineContext, isOfflineMode, isInitialized, isCheckingConnectivity]);

//     // ✅ Trigger initialization when connectivity check completes
//     useEffect(() => {
//         if (!isCheckingConnectivity) {
//             console.log(`🔍 [POS] Connectivity check complete. Offline status: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
            
//             // Small delay to ensure state is fully propagated
//             const timer = setTimeout(() => {
//                 initializePOS();
//             }, 100);

//             return () => clearTimeout(timer);
//         }
//     }, [isCheckingConnectivity, initializePOS]);

//     // Cleanup on unmount
//     useEffect(() => {
//         return () => {
//             console.log("🛑 [POS] Cleaning up");
//             stopAutoRefresh();
//         };
//     }, []);

//     // ============================================
//     // STEP 3: HANDLE ONLINE/OFFLINE TRANSITIONS
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized) return;

//         const handleOnlineTransition = async () => {
//             console.log("🌐 [TRANSITION] Going online - syncing data");
            
//             try {
//                 const queueSize = getQueueSize();
//                 if (queueSize > 0) {
//                     console.log(`📤 [SYNC] Processing ${queueSize} queued requests...`);
//                     const results = await processQueuedRequests();
                    
//                     if (results.succeeded > 0) {
//                         enqueueSnackbar(
//                             `Synced ${results.succeeded} pending operations`, 
//                             { variant: 'success' }
//                         );
//                     }
                    
//                     if (results.failed > 0) {
//                         console.warn(`⚠️ [SYNC] ${results.failed} operations failed`);
//                     }
//                 }

//                 await syncPendingItems();

//                 console.log("🔄 [SYNC] Refreshing orders cache");
//                 await fetchAndCacheRecentOrders();

//                 // Start auto-refresh when coming online
//                 startAutoRefresh();

//                 console.log("✅ [TRANSITION] Online transition complete");
//             } catch (error) {
//                 console.error('❌ [TRANSITION] Sync failed:', error);
//                 enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
//             }
//         };

//         const handleOfflineTransition = () => {
//             console.log("📴 [TRANSITION] Going offline - stopping auto-refresh");
//             stopAutoRefresh();
//             enqueueSnackbar('Working in offline mode with cached data', { 
//                 variant: 'info',
//                 autoHideDuration: 3000 
//             });
//         };

//         // Detect transition
//         if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
//             handleOnlineTransition();
//         } else if (isOfflineMode) {
//             handleOfflineTransition();
//         }
//     }, [actualOnlineStatus, hasInternetConnection, isOfflineMode, isInitialized, syncPendingItems]);

//     // ============================================
//     // STEP 4: PERIODIC CACHE REFRESH (ONLY WHEN ONLINE)
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized || isOfflineMode) {
//             console.log("⏸️ [CACHE] Periodic refresh paused (offline or not initialized)");
//             return;
//         }

//         console.log("▶️ [CACHE] Starting periodic refresh (online mode)");
//         const refreshInterval = setInterval(() => {
//             console.log("⏰ [CACHE] Periodic refresh triggered");
//             fetchAndCacheRecentOrders().catch(err => 
//                 console.warn('⚠️ [CACHE] Periodic refresh failed:', err)
//             );
//         }, 5 * 60 * 1000); // 5 minutes

//         return () => {
//             console.log("⏸️ [CACHE] Stopping periodic refresh");
//             clearInterval(refreshInterval);
//         };
//     }, [isInitialized, isOfflineMode]);

//     // ============================================
//     // STEP 5: LOGGING & MONITORING
//     // ============================================
//     useEffect(() => {
//         const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//         console.log(`${statusEmoji} [APP] Status Update:`, {
//             isOfflineMode,
//             manualOfflineMode,
//             actualOnlineStatus,
//             hasInternetConnection,
//             isCheckingConnectivity,
//             isInitialized,
//             timestamp: new Date().toLocaleTimeString()
//         });
//     }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isCheckingConnectivity, isInitialized]);

//     if (initError) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 padding: '20px',
//                 textAlign: 'center'
//             }}>
//                 <h2>⚠️ Initialization Error</h2>
//                 <p style={{ color: '#dc2626', marginBottom: '20px' }}>{initError}</p>
//                 <button 
//                     onClick={() => window.location.reload()}
//                     style={{
//                         padding: '10px 20px',
//                         background: '#3b82f6',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Reload Application
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;





// App.jsx - COMPLETE FIX with robust offline support
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
// import Header from "./components/shared/Header";
// import { useSelector } from "react-redux";
// import useLoadData from "./hooks/useLoadData";
// import FullScreenLoader from "./components/shared/FullScreenLoader";
// import { useEffect, useState, useCallback } from 'react';
// import { useQueryClient, onlineManager } from "@tanstack/react-query";
// import { enqueueSnackbar } from 'notistack';

// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { 
//     fetchAndCacheRecentOrders, 
//     startAutoRefresh, 
//     initializeOfflineCache, 
//     stopAutoRefresh 
// } from './utils/getOrdersOffline';
// import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
// import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
// import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
// import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
// import { 
//     initializeSmartRequest, 
//     isSmartRequestInitialized,
//     processQueuedRequests,
//     getQueueSize
// } from './utils/smartRequest';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const offlineContext = useOfflineMode();
//     const { 
//         isOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection,
//         manualOfflineMode,
//         isCheckingConnectivity 
//     } = offlineContext;
    
//     const { syncPendingItems } = useSyncManager();
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [initError, setInitError] = useState(null);

//     // ============================================
//     // STEP 1: SYNC REACT QUERY ONLINE MANAGER
//     // ============================================
//     useEffect(() => {
//         const isTrulyOnline = hasInternetConnection && actualOnlineStatus && !manualOfflineMode;
//         onlineManager.setOnline(isTrulyOnline);
        
//         console.log(`🔄 [RQ SYNC] OnlineManager: ${isTrulyOnline}`, {
//             hasInternetConnection,
//             actualOnlineStatus,
//             manualOfflineMode,
//             isOfflineMode
//         });
//     }, [isOfflineMode, hasInternetConnection, actualOnlineStatus, manualOfflineMode]);

//     // ============================================
//     // STEP 2: INITIALIZE SMART REQUEST SYSTEM
//     // ============================================
//     useEffect(() => {
//         const initSmartRequest = () => {
//             try {
//                 console.log("🔧 [INIT] Smart Request System...");
                
//                 if (isSmartRequestInitialized()) {
//                     console.log("✅ [INIT] Already initialized");
//                     return;
//                 }

//                 // Create getter function for offline context
//                 const getOfflineContext = () => {
//                     try {
//                         return {
//                             isOfflineMode: offlineContext.isOfflineMode,
//                             manualOfflineMode: offlineContext.manualOfflineMode,
//                             actualOnlineStatus: offlineContext.actualOnlineStatus,
//                             hasInternetConnection: offlineContext.hasInternetConnection
//                         };
//                     } catch (error) {
//                         console.error('❌ [INIT] Context error:', error);
//                         return {
//                             isOfflineMode: !navigator.onLine,
//                             manualOfflineMode: false,
//                             actualOnlineStatus: navigator.onLine,
//                             hasInternetConnection: navigator.onLine
//                         };
//                     }
//                 };

//                 initializeSmartRequest(getOfflineContext);
//                 console.log("✅ [INIT] Smart Request initialized");
//             } catch (error) {
//                 console.error('❌ [INIT] Smart Request failed:', error);
//                 setInitError(error.message);
//                 enqueueSnackbar('System initialization error', { variant: 'error' });
//             }
//         };

//         initSmartRequest();
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // ============================================
//     // STEP 3: INITIALIZE POS SYSTEM
//     // ============================================
//     const initializePOS = useCallback(async () => {
//         if (isInitialized) {
//             console.log("⚠️ [POS] Already initialized");
//             return;
//         }

//         // ✅ CRITICAL: Wait for connectivity check
//         if (isCheckingConnectivity) {
//             console.log("⏳ [POS] Waiting for connectivity check...");
//             return;
//         }

//         try {
//             console.log("🚀 [POS] Starting initialization...");
//             console.log(`📊 [POS] Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);

//             // Create status getter
//             const getOfflineStatus = () => ({
//                 isOfflineMode: offlineContext.isOfflineMode,
//                 hasInternetConnection: offlineContext.hasInternetConnection,
//                 actualOnlineStatus: offlineContext.actualOnlineStatus
//             });

//             // ✅ ALWAYS initialize caches (works offline)
//             console.log("📦 [POS] Initializing caches...");
//             initializeOfflineCache(queryClient, getOfflineStatus);
//             initializeMenuCache(getOfflineStatus);
//             initializeCustomersCache(getOfflineStatus);
//             initializeDeliveryBoysCache(getOfflineStatus);
//             initializeTablesCache(getOfflineStatus);

//             // ✅ CHECK: Only fetch from server if ONLINE
//             if (isOfflineMode) {
//                 console.log("📴 [POS] OFFLINE MODE - Using cached data only");
//                 console.log("📦 [POS] Skipping all API calls");
                
//                 setIsInitialized(true);
                
//                 enqueueSnackbar('Working offline with cached data', { 
//                     variant: 'info',
//                     autoHideDuration: 3000 
//                 });
                
//                 return; // ✅ STOP - No API calls in offline mode
//             }

//             // ✅ ONLINE MODE: Fetch reference data
//             console.log("🌐 [POS] ONLINE MODE - Fetching from server...");
            
//             // Fetch all reference data (with error handling)
//             const dataFetches = [
//                 fetchInitialData().catch(err => {
//                     console.warn('⚠️ [POS] Menu failed:', err.message);
//                     return null;
//                 }),
//                 fetchCustomers().catch(err => {
//                     console.warn('⚠️ [POS] Customers failed:', err.message);
//                     return null;
//                 }),
//                 fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ [POS] Delivery boys failed:', err.message);
//                     return null;
//                 }),
//                 fetchAndCacheTables().catch(err => {
//                     console.warn('⚠️ [POS] Tables failed:', err.message);
//                     return null;
//                 })
//             ];

//             const results = await Promise.allSettled(dataFetches);
//             const successCount = results.filter(r => r.status === 'fulfilled').length;
//             console.log(`📊 [POS] Reference data: ${successCount}/${results.length} OK`);

//             // Fetch orders
//             console.log("📋 [POS] Fetching orders...");
//             await fetchAndCacheRecentOrders().catch(err => {
//                 console.warn('⚠️ [POS] Orders failed:', err.message);
//             });

//             // Start auto-refresh
//             console.log("⏰ [POS] Starting auto-refresh...");
//             startAutoRefresh();

//             setIsInitialized(true);
//             console.log("✅ [POS] Initialization complete");

//             enqueueSnackbar('POS System ready', { 
//                 variant: 'success',
//                 autoHideDuration: 2000 
//             });

//         } catch (error) {
//             console.error('❌ [POS] Initialization failed:', error);
//             setInitError(error.message);
//             enqueueSnackbar('Failed to initialize POS', { 
//                 variant: 'error',
//                 persist: true 
//             });
//         }
//     }, [queryClient, offlineContext, isOfflineMode, isInitialized, isCheckingConnectivity]);

//     // ✅ Trigger init when connectivity check completes
//     useEffect(() => {
//         if (!isCheckingConnectivity) {
//             console.log(`🔍 [POS] Connectivity check done. Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
            
//             const timer = setTimeout(() => {
//                 initializePOS();
//             }, 100);

//             return () => clearTimeout(timer);
//         }
//     }, [isCheckingConnectivity, initializePOS, isOfflineMode]);

//     // Cleanup
//     useEffect(() => {
//         return () => {
//             console.log("🛑 [POS] Cleanup");
//             stopAutoRefresh();
//         };
//     }, []);

//     // ============================================
//     // STEP 4: HANDLE ONLINE/OFFLINE TRANSITIONS
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized) return;

//         const handleOnlineTransition = async () => {
//             console.log("🌐 [TRANSITION] → ONLINE");
            
//             try {
//                 // Process queued requests
//                 const queueSize = getQueueSize();
//                 if (queueSize > 0) {
//                     console.log(`📤 [SYNC] Processing ${queueSize} queued requests...`);
//                     const results = await processQueuedRequests();
                    
//                     if (results.succeeded > 0) {
//                         enqueueSnackbar(
//                             `Synced ${results.succeeded} operations`, 
//                             { variant: 'success' }
//                         );
//                     }
//                 }

//                 // Sync pending items
//                 await syncPendingItems();

//                 // Refresh caches
//                 console.log("🔄 [SYNC] Refreshing caches...");
//                 await Promise.all([
//                     fetchAndCacheRecentOrders().catch(err => 
//                         console.warn('⚠️ Orders refresh failed:', err)
//                     ),
//                     fetchInitialData().catch(err => 
//                         console.warn('⚠️ Menu refresh failed:', err)
//                     ),
//                     fetchCustomers().catch(err => 
//                         console.warn('⚠️ Customers refresh failed:', err)
//                     ),
//                     fetchDeliveryBoys().catch(err => 
//                         console.warn('⚠️ Delivery boys refresh failed:', err)
//                     ),
//                     fetchAndCacheTables().catch(err => 
//                         console.warn('⚠️ Tables refresh failed:', err)
//                     )
//                 ]);

//                 // Start auto-refresh
//                 startAutoRefresh();

//                 console.log("✅ [TRANSITION] Online complete");
//             } catch (error) {
//                 console.error('❌ [TRANSITION] Sync failed:', error);
//                 enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
//             }
//         };

//         const handleOfflineTransition = () => {
//             console.log("📴 [TRANSITION] → OFFLINE");
//             stopAutoRefresh();
//             enqueueSnackbar('Working offline with cached data', { 
//                 variant: 'info',
//                 autoHideDuration: 3000 
//             });
//         };

//         // Detect transition
//         const wasPreviouslyOffline = !actualOnlineStatus || !hasInternetConnection;
//         const isNowOnline = actualOnlineStatus && hasInternetConnection && !manualOfflineMode;

//         if (isNowOnline && !isOfflineMode) {
//             handleOnlineTransition();
//         } else if (isOfflineMode && !wasPreviouslyOffline) {
//             handleOfflineTransition();
//         }
//     }, [
//         actualOnlineStatus, 
//         hasInternetConnection, 
//         manualOfflineMode,
//         isOfflineMode, 
//         isInitialized, 
//         syncPendingItems
//     ]);

//     // ============================================
//     // STEP 5: PERIODIC CACHE REFRESH (ONLINE ONLY)
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized || isOfflineMode) {
//             console.log("⏸️ [CACHE] Periodic refresh paused");
//             return;
//         }

//         console.log("▶️ [CACHE] Starting periodic refresh");
//         const refreshInterval = setInterval(() => {
//             console.log("⏰ [CACHE] Periodic refresh");
//             fetchAndCacheRecentOrders().catch(err => 
//                 console.warn('⚠️ Periodic refresh failed:', err)
//             );
//         }, 5 * 60 * 1000); // 5 minutes

//         return () => {
//             console.log("⏸️ [CACHE] Stopping periodic refresh");
//             clearInterval(refreshInterval);
//         };
//     }, [isInitialized, isOfflineMode]);

//     // ============================================
//     // STEP 6: STATUS LOGGING
//     // ============================================
//     useEffect(() => {
//         const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//         console.log(`${statusEmoji} [APP STATUS]`, {
//             mode: isOfflineMode ? 'OFFLINE' : 'ONLINE',
//             manual: manualOfflineMode,
//             interface: actualOnlineStatus,
//             internet: hasInternetConnection,
//             checking: isCheckingConnectivity,
//             initialized: isInitialized,
//             time: new Date().toLocaleTimeString()
//         });
//     }, [
//         isOfflineMode, 
//         manualOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection, 
//         isCheckingConnectivity, 
//         isInitialized
//     ]);

//     // ============================================
//     // ERROR SCREEN
//     // ============================================
//     if (initError) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 padding: '20px',
//                 textAlign: 'center',
//                 backgroundColor: '#1a1a1a',
//                 color: 'white'
//             }}>
//                 <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>
//                     ⚠️ Initialization Error
//                 </h2>
//                 <p style={{ marginBottom: '20px', color: '#9ca3af' }}>
//                     {initError}
//                 </p>
//                 <button 
//                     onClick={() => window.location.reload()}
//                     style={{
//                         padding: '12px 24px',
//                         background: '#3b82f6',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         fontSize: '16px',
//                         fontWeight: '600'
//                     }}
//                 >
//                     Reload Application
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;





// // App.jsx - FIXED: No more initializeSmartRequest needed
// import { useEffect, useState, useCallback } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { QueryClient, QueryClientProvider, useQueryClient, onlineManager } from '@tanstack/react-query';
// import { SnackbarProvider, enqueueSnackbar } from 'notistack';

// import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
// import { useSyncManager } from './hooks/useSyncManager';
// import { 
//     fetchAndCacheRecentOrders, 
//     startAutoRefresh, 
//     initializeOfflineCache, 
//     stopAutoRefresh 
// } from './utils/getOrdersOffline';
// import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
// import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
// import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
// import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
// import { 
//     processQueuedRequests,
//     getQueueSize
// } from './utils/smartRequest';

// // Your components
// import Header from '../src/components/shared/Header';
// import FullScreenLoader from './components/shared/FullScreenLoader';
// import Home from './pages/Home';
// import Auth from './pages/Auth';
// import Orders from './pages/Orders';
// import Tables from './pages/Tables';
// import Menu from './pages/Menu';
// import Dashboard from './pages/Dashboard';
// import Inventory from './pages/Inventory';
// import KitchenSection from './pages/KitchenSection';
// import GrillSection from './pages/GrillSection';
// import DeliveryMetrics from './pages/DeliveryMetrics';
// import useLoadData from './hooks/useLoadData';

// function Layout() {
//     const isLoading = useLoadData();
//     const location = useLocation();
//     const hideHeaderRoutes = ["/auth"];
//     const { isAuth } = useSelector(state => state.user);

//     if (isLoading) return <FullScreenLoader />

//     return (
//         <>
//             {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
//             <Routes>
//                 <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//                 <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
//                 <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
//                 <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
//                 <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
//                 <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//                 <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
//                 <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
//                 <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
//                 <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
//                 <Route path="*" element={<div>Not Found</div>} />
//             </Routes>
//         </>
//     );
// }

// function ProtectedRoute({ children }) {
//     const { isAuth } = useSelector(state => state.user);
//     if (!isAuth) return <Navigate to="/auth" />
//     return children;
// }

// function AppContent() {
//     const queryClient = useQueryClient();
//     const offlineContext = useOfflineMode();
//     const { 
//         isOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection,
//         manualOfflineMode,
//         isCheckingConnectivity 
//     } = offlineContext;
    
//     const { syncPendingItems } = useSyncManager();
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [initError, setInitError] = useState(null);

//     // ============================================
//     // STEP 1: SYNC REACT QUERY ONLINE MANAGER
//     // ============================================
//     useEffect(() => {
//         const isTrulyOnline = hasInternetConnection && actualOnlineStatus && !manualOfflineMode;
//         onlineManager.setOnline(isTrulyOnline);
        
//         console.log(`🔄 [RQ SYNC] OnlineManager: ${isTrulyOnline}`, {
//             hasInternetConnection,
//             actualOnlineStatus,
//             manualOfflineMode,
//             isOfflineMode
//         });
//     }, [isOfflineMode, hasInternetConnection, actualOnlineStatus, manualOfflineMode]);

//     // ============================================
//     // STEP 2: INITIALIZE POS SYSTEM (NO MORE initializeSmartRequest NEEDED!)
//     // ============================================
//     const initializePOS = useCallback(async () => {
//         if (isInitialized) {
//             console.log("⚠️ [POS] Already initialized");
//             return;
//         }

//         // ✅ CRITICAL: Wait for connectivity check
//         if (isCheckingConnectivity) {
//             console.log("⏳ [POS] Waiting for connectivity check...");
//             return;
//         }

//         try {
//             console.log("🚀 [POS] Starting initialization...");
//             console.log(`📊 [POS] Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);

//             // Create status getter
//             const getOfflineStatus = () => ({
//                 isOfflineMode: offlineContext.isOfflineMode,
//                 hasInternetConnection: offlineContext.hasInternetConnection,
//                 actualOnlineStatus: offlineContext.actualOnlineStatus
//             });

//             // ✅ ALWAYS initialize caches (works offline)
//             console.log("📦 [POS] Initializing caches...");
//             initializeOfflineCache(queryClient, getOfflineStatus);
//             initializeMenuCache(getOfflineStatus);
//             initializeCustomersCache(getOfflineStatus);
//             initializeDeliveryBoysCache(getOfflineStatus);
//             initializeTablesCache(getOfflineStatus);

//             // ✅ CHECK: Only fetch from server if ONLINE
//             if (isOfflineMode) {
//                 console.log("📴 [POS] OFFLINE MODE - Using cached data only");
//                 console.log("📦 [POS] Skipping all API calls");
                
//                 setIsInitialized(true);
                
//                 enqueueSnackbar('Working offline with cached data', { 
//                     variant: 'info',
//                     autoHideDuration: 3000 
//                 });
                
//                 return; // ✅ STOP - No API calls in offline mode
//             }

//             // ✅ ONLINE MODE: Fetch reference data
//             console.log("🌐 [POS] ONLINE MODE - Fetching from server...");
            
//             // Fetch all reference data (with error handling)
//             const dataFetches = [
//                 fetchInitialData().catch(err => {
//                     console.warn('⚠️ [POS] Menu failed:', err.message);
//                     return null;
//                 }),
//                 fetchCustomers().catch(err => {
//                     console.warn('⚠️ [POS] Customers failed:', err.message);
//                     return null;
//                 }),
//                 fetchDeliveryBoys().catch(err => {
//                     console.warn('⚠️ [POS] Delivery boys failed:', err.message);
//                     return null;
//                 }),
//                 fetchAndCacheTables().catch(err => {
//                     console.warn('⚠️ [POS] Tables failed:', err.message);
//                     return null;
//                 })
//             ];

//             const results = await Promise.allSettled(dataFetches);
//             const successCount = results.filter(r => r.status === 'fulfilled').length;
//             console.log(`📊 [POS] Reference data: ${successCount}/${results.length} OK`);

//             // Fetch orders
//             console.log("📋 [POS] Fetching orders...");
//             await fetchAndCacheRecentOrders().catch(err => {
//                 console.warn('⚠️ [POS] Orders failed:', err.message);
//             });

//             // Start auto-refresh
//             console.log("⏰ [POS] Starting auto-refresh...");
//             startAutoRefresh();

//             setIsInitialized(true);
//             console.log("✅ [POS] Initialization complete");

//             enqueueSnackbar('POS System ready', { 
//                 variant: 'success',
//                 autoHideDuration: 2000 
//             });

//         } catch (error) {
//             console.error('❌ [POS] Initialization failed:', error);
//             setInitError(error.message);
//             enqueueSnackbar('Failed to initialize POS', { 
//                 variant: 'error',
//                 persist: true 
//             });
//         }
//     }, [queryClient, offlineContext, isOfflineMode, isInitialized, isCheckingConnectivity]);

//     // ✅ Trigger init when connectivity check completes
//     useEffect(() => {
//         if (!isCheckingConnectivity) {
//             console.log(`🔍 [POS] Connectivity check done. Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
            
//             const timer = setTimeout(() => {
//                 initializePOS();
//             }, 100);

//             return () => clearTimeout(timer);
//         }
//     }, [isCheckingConnectivity, initializePOS, isOfflineMode]);

//     // Cleanup
//     useEffect(() => {
//         return () => {
//             console.log("🛑 [POS] Cleanup");
//             stopAutoRefresh();
//         };
//     }, []);

//     // ============================================
//     // STEP 3: HANDLE ONLINE/OFFLINE TRANSITIONS
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized) return;

//         const handleOnlineTransition = async () => {
//             console.log("🌐 [TRANSITION] → ONLINE");
            
//             try {
//                 // Process queued requests
//                 const queueSize = getQueueSize();
//                 if (queueSize > 0) {
//                     console.log(`📤 [SYNC] Processing ${queueSize} queued requests...`);
//                     const results = await processQueuedRequests();
                    
//                     if (results.succeeded > 0) {
//                         enqueueSnackbar(
//                             `Synced ${results.succeeded} operations`, 
//                             { variant: 'success' }
//                         );
//                     }
//                 }

//                 // Sync pending items
//                 await syncPendingItems();

//                 // Refresh caches
//                 console.log("🔄 [SYNC] Refreshing caches...");
//                 await Promise.all([
//                     fetchAndCacheRecentOrders().catch(err => 
//                         console.warn('⚠️ Orders refresh failed:', err)
//                     ),
//                     fetchInitialData().catch(err => 
//                         console.warn('⚠️ Menu refresh failed:', err)
//                     ),
//                     fetchCustomers().catch(err => 
//                         console.warn('⚠️ Customers refresh failed:', err)
//                     ),
//                     fetchDeliveryBoys().catch(err => 
//                         console.warn('⚠️ Delivery boys refresh failed:', err)
//                     ),
//                     fetchAndCacheTables().catch(err => 
//                         console.warn('⚠️ Tables refresh failed:', err)
//                     )
//                 ]);

//                 // Start auto-refresh
//                 startAutoRefresh();

//                 console.log("✅ [TRANSITION] Online complete");
//             } catch (error) {
//                 console.error('❌ [TRANSITION] Sync failed:', error);
//                 enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
//             }
//         };

//         const handleOfflineTransition = () => {
//             console.log("📴 [TRANSITION] → OFFLINE");
//             stopAutoRefresh();
//             enqueueSnackbar('Working offline with cached data', { 
//                 variant: 'info',
//                 autoHideDuration: 3000 
//             });
//         };

//         // Detect transition
//         const wasPreviouslyOffline = !actualOnlineStatus || !hasInternetConnection;
//         const isNowOnline = actualOnlineStatus && hasInternetConnection && !manualOfflineMode;

//         if (isNowOnline && !isOfflineMode) {
//             handleOnlineTransition();
//         } else if (isOfflineMode && !wasPreviouslyOffline) {
//             handleOfflineTransition();
//         }
//     }, [
//         actualOnlineStatus, 
//         hasInternetConnection, 
//         manualOfflineMode,
//         isOfflineMode, 
//         isInitialized, 
//         syncPendingItems
//     ]);

//     // ============================================
//     // STEP 4: PERIODIC CACHE REFRESH (ONLINE ONLY)
//     // ============================================
//     useEffect(() => {
//         if (!isInitialized || isOfflineMode) {
//             console.log("⏸️ [CACHE] Periodic refresh paused");
//             return;
//         }

//         console.log("▶️ [CACHE] Starting periodic refresh");
//         const refreshInterval = setInterval(() => {
//             console.log("⏰ [CACHE] Periodic refresh");
//             fetchAndCacheRecentOrders().catch(err => 
//                 console.warn('⚠️ Periodic refresh failed:', err)
//             );
//         }, 5 * 60 * 1000); // 5 minutes

//         return () => {
//             console.log("⏸️ [CACHE] Stopping periodic refresh");
//             clearInterval(refreshInterval);
//         };
//     }, [isInitialized, isOfflineMode]);

//     // ============================================
//     // STEP 5: STATUS LOGGING
//     // ============================================
//     useEffect(() => {
//         const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//         console.log(`${statusEmoji} [APP STATUS]`, {
//             mode: isOfflineMode ? 'OFFLINE' : 'ONLINE',
//             manual: manualOfflineMode,
//             interface: actualOnlineStatus,
//             internet: hasInternetConnection,
//             checking: isCheckingConnectivity,
//             initialized: isInitialized,
//             time: new Date().toLocaleTimeString()
//         });
//     }, [
//         isOfflineMode, 
//         manualOfflineMode, 
//         actualOnlineStatus, 
//         hasInternetConnection, 
//         isCheckingConnectivity, 
//         isInitialized
//     ]);

//     // ============================================
//     // ERROR SCREEN
//     // ============================================
//     if (initError) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 padding: '20px',
//                 textAlign: 'center',
//                 backgroundColor: '#1a1a1a',
//                 color: 'white'
//             }}>
//                 <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>
//                     ⚠️ Initialization Error
//                 </h2>
//                 <p style={{ marginBottom: '20px', color: '#9ca3af' }}>
//                     {initError}
//                 </p>
//                 <button 
//                     onClick={() => window.location.reload()}
//                     style={{
//                         padding: '12px 24px',
//                         background: '#3b82f6',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         fontSize: '16px',
//                         fontWeight: '600'
//                     }}
//                 >
//                     Reload Application
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <Router>
//             <Layout />
//         </Router>
//     );
// }

// function App() {
//     return (
//         <OfflineModeProvider>
//             <AppContent />
//         </OfflineModeProvider>
//     );
// }

// export default App;



// App.jsx - SIMPLIFIED FINAL VERSION
import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQueryClient, onlineManager } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { OfflineModeProvider, useOfflineMode } from './constants/OfflineModeContext';
import { useSyncManager } from './hooks/useSyncManager';
import { 
    fetchAndCacheRecentOrders, 
    startAutoRefresh, 
    initializeOfflineCache, 
    stopAutoRefresh 
} from './utils/getOrdersOffline';
import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
import { 
    processQueuedRequests,
    getQueueSize
} from './utils/smartRequest';

// Components
import Header from './components/shared/Header';
import FullScreenLoader from './components/shared/FullScreenLoader';
import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from './pages';
import useLoadData from './hooks/useLoadData';

function Layout() {
    const isLoading = useLoadData();
    const location = useLocation();
    const hideHeaderRoutes = ["/auth"];
    const { isAuth } = useSelector(state => state.user);

    if (isLoading) return <FullScreenLoader />

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header />}
            <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
                <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/kitchensection" element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
                <Route path="/grillsection" element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
                <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </>
    );
}

function ProtectedRoute({ children }) {
    const { isAuth } = useSelector(state => state.user);
    if (!isAuth) return <Navigate to="/auth" />
    return children;
}

function AppContent() {
    const queryClient = useQueryClient();
    const offlineContext = useOfflineMode();
    const { 
        isOfflineMode, 
        actualOnlineStatus, 
        hasInternetConnection,
        manualOfflineMode,
        isCheckingConnectivity 
    } = offlineContext;
    
    const { syncPendingItems } = useSyncManager();
    const [isInitialized, setIsInitialized] = useState(false);
    const [initError, setInitError] = useState(null);

    // ============================================
    // STEP 1: SYNC REACT QUERY ONLINE MANAGER
    // ============================================
    useEffect(() => {
        const isTrulyOnline = hasInternetConnection && actualOnlineStatus && !manualOfflineMode;
        onlineManager.setOnline(isTrulyOnline);
        
        console.log(`🔄 [RQ SYNC] OnlineManager: ${isTrulyOnline}`);
    }, [isOfflineMode, hasInternetConnection, actualOnlineStatus, manualOfflineMode]);

    // ============================================
    // STEP 2: INITIALIZE POS SYSTEM
    // ============================================
    const initializePOS = useCallback(async () => {
        if (isInitialized) {
            console.log("⚠️ [POS] Already initialized");
            return;
        }

        if (isCheckingConnectivity) {
            console.log("⏳ [POS] Waiting for connectivity check...");
            return;
        }

        try {
            console.log("🚀 [POS] Starting initialization...");
            console.log(`📊 [POS] Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);

            const getOfflineStatus = () => ({
                isOfflineMode: offlineContext.isOfflineMode,
                hasInternetConnection: offlineContext.hasInternetConnection,
                actualOnlineStatus: offlineContext.actualOnlineStatus
            });

            // ✅ ALWAYS initialize caches first
            console.log("📦 [POS] Initializing caches...");
            initializeOfflineCache(queryClient, getOfflineStatus);
            initializeMenuCache(getOfflineStatus);
            initializeCustomersCache(getOfflineStatus);
            initializeDeliveryBoysCache(getOfflineStatus);
            initializeTablesCache(getOfflineStatus);

            // ✅ CHECK: Only fetch if ONLINE
            if (isOfflineMode) {
                console.log("📴 [POS] OFFLINE - Using cached data only");
                setIsInitialized(true);
                enqueueSnackbar('Working offline with cached data', { 
                    variant: 'info',
                    autoHideDuration: 3000 
                });
                return;
            }

            // ✅ ONLINE: Fetch all reference data
            console.log("🌐 [POS] ONLINE - Fetching reference data...");
            
            // Fetch menu
            const menuResult = await fetchInitialData().catch(err => {
                console.warn('⚠️ [POS] Menu failed:', err.message);
                return { categories: [], dishes: [] };
            });
            console.log(`✅ [POS] Menu: ${menuResult.categories?.length || 0} cats, ${menuResult.dishes?.length || 0} dishes`);

            // Fetch customers
            const customersResult = await fetchCustomers().catch(err => {
                console.warn('⚠️ [POS] Customers failed:', err.message);
                return [];
            });
            console.log(`✅ [POS] Customers: ${customersResult?.length || 0}`);

            // Fetch delivery boys
            const deliveryBoysResult = await fetchDeliveryBoys().catch(err => {
                console.warn('⚠️ [POS] Delivery boys failed:', err.message);
                return [];
            });
            console.log(`✅ [POS] Delivery boys: ${deliveryBoysResult?.length || 0}`);

            // ✅ Fetch tables (simplified like menu)
            const tablesResult = await fetchAndCacheTables().catch(err => {
                console.warn('⚠️ [POS] Tables failed:', err.message);
                return [];
            });
            console.log(`✅ [POS] Tables: ${tablesResult?.length || 0}`);

            // Fetch orders
            const ordersResult = await fetchAndCacheRecentOrders().catch(err => {
                console.warn('⚠️ [POS] Orders failed:', err.message);
                return [];
            });
            console.log(`✅ [POS] Orders: ${ordersResult?.length || 0}`);

            // Start auto-refresh
            console.log("⏰ [POS] Starting auto-refresh...");
            startAutoRefresh();

            setIsInitialized(true);
            console.log("✅ [POS] Initialization complete");

            enqueueSnackbar('POS System ready', { 
                variant: 'success',
                autoHideDuration: 2000 
            });

        } catch (error) {
            console.error('❌ [POS] Initialization failed:', error);
            setInitError(error.message);
            enqueueSnackbar('Failed to initialize POS', { 
                variant: 'error',
                persist: true 
            });
        }
    }, [queryClient, offlineContext, isOfflineMode, isInitialized, isCheckingConnectivity]);

    // ✅ Trigger init when connectivity check completes
    useEffect(() => {
        if (!isCheckingConnectivity) {
            console.log(`🔍 [POS] Ready. Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
            const timer = setTimeout(() => initializePOS(), 100);
            return () => clearTimeout(timer);
        }
    }, [isCheckingConnectivity, initializePOS, isOfflineMode]);

    // Cleanup
    useEffect(() => {
        return () => {
            console.log("🛑 [POS] Cleanup");
            stopAutoRefresh();
        };
    }, []);

    // ============================================
    // STEP 3: HANDLE ONLINE/OFFLINE TRANSITIONS
    // ============================================
    useEffect(() => {
        if (!isInitialized) return;

        const handleOnlineTransition = async () => {
            console.log("🌐 [TRANSITION] → ONLINE");
            
            try {
                // Process queued requests
                const queueSize = getQueueSize();
                if (queueSize > 0) {
                    console.log(`📤 [SYNC] Processing ${queueSize} queued...`);
                    const results = await processQueuedRequests();
                    
                    if (results.succeeded > 0) {
                        enqueueSnackbar(
                            `Synced ${results.succeeded} operations`, 
                            { variant: 'success' }
                        );
                    }
                }

                // Sync pending items
                await syncPendingItems();

                // ✅ Refresh ALL caches (including tables)
                console.log("🔄 [SYNC] Refreshing caches...");
                await Promise.all([
                    fetchAndCacheRecentOrders(),
                    fetchInitialData(),
                    fetchCustomers(),
                    fetchDeliveryBoys(),
                    fetchAndCacheTables() // ✅ Tables included
                ]).catch(err => console.warn('⚠️ Refresh failed:', err));

                startAutoRefresh();
                console.log("✅ [TRANSITION] Complete");
            } catch (error) {
                console.error('❌ [TRANSITION] Failed:', error);
                enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
            }
        };

        const handleOfflineTransition = () => {
            console.log("📴 [TRANSITION] → OFFLINE");
            stopAutoRefresh();
            enqueueSnackbar('Working offline with cached data', { 
                variant: 'info',
                autoHideDuration: 3000 
            });
        };

        // Detect transition
        if (actualOnlineStatus && hasInternetConnection && !manualOfflineMode && !isOfflineMode) {
            handleOnlineTransition();
        } else if (isOfflineMode) {
            handleOfflineTransition();
        }
    }, [actualOnlineStatus, hasInternetConnection, manualOfflineMode, isOfflineMode, isInitialized, syncPendingItems]);

    // ============================================
    // STEP 4: PERIODIC CACHE REFRESH (ONLINE ONLY)
    // ============================================
    useEffect(() => {
        if (!isInitialized || isOfflineMode) {
            console.log("⏸️ [CACHE] Periodic refresh paused");
            return;
        }

        console.log("▶️ [CACHE] Starting periodic refresh");
        const refreshInterval = setInterval(() => {
            console.log("⏰ [CACHE] Periodic refresh");
            Promise.all([
                fetchAndCacheRecentOrders(),
                fetchAndCacheTables() // ✅ Refresh tables too
            ]).catch(err => console.warn('⚠️ Refresh failed:', err));
        }, 5 * 60 * 1000); // 5 minutes

        return () => {
            console.log("⏸️ [CACHE] Stopping periodic refresh");
            clearInterval(refreshInterval);
        };
    }, [isInitialized, isOfflineMode]);

    // ============================================
    // STEP 5: STATUS LOGGING
    // ============================================
    useEffect(() => {
        const emoji = isOfflineMode ? '🔴' : '🟢';
        console.log(`${emoji} [APP]`, {
            mode: isOfflineMode ? 'OFFLINE' : 'ONLINE',
            manual: manualOfflineMode,
            interface: actualOnlineStatus,
            internet: hasInternetConnection,
            initialized: isInitialized
        });
    }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isInitialized]);

    // ============================================
    // ERROR SCREEN
    // ============================================
    if (initError) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#1a1a1a',
                color: 'white'
            }}>
                <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>
                    ⚠️ Initialization Error
                </h2>
                <p style={{ marginBottom: '20px', color: '#9ca3af' }}>
                    {initError}
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '12px 24px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}
                >
                    Reload Application
                </button>
            </div>
        );
    }

    return (
        <Router>
            <Layout />
        </Router>
    );
}

function App() {
    return (
        <OfflineModeProvider>
            <AppContent />
        </OfflineModeProvider>
    );
}

export default App;