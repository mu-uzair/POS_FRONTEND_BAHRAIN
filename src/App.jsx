
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



import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from "./pages";
import Header from "./components/shared/Header";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";
import { useEffect } from 'react';
import { fetchAndCacheRecentOrders, startAutoRefresh } from './utils/getOrdersOffline';
import { fetchInitialData } from './utils/offlineMenu';
import { fetchDeliveryBoys } from './utils/offlineDeliveryBoys';
import { fetchCustomers } from './utils/offlineCustomers';
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { updateOrderStatus } from "./https/index";
import { deleteOrder } from "./https/index";

// ✅ Import offline utilities
import { save, load } from "./utils/offlineStore";
import { addOrder } from "./https";

// ✅ Offline storage keys
const OFFLINE_PENDING_SYNC_KEY = "offline:pendingSync";
const OFFLINE_ORDERS_KEY = "offline:orders";

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
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                } />
                <Route path="/tables" element={
                    <ProtectedRoute>
                        <Tables />
                    </ProtectedRoute>
                } />
                <Route path="/menu" element={
                    <ProtectedRoute>
                        <Menu />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route
                    path="/Inventory"
                    element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/kitchensection"
                    element={
                        <ProtectedRoute>
                            <KitchenSection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/grillsection"
                    element={
                        <ProtectedRoute>
                            <GrillSection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/deliverymetrics"
                    element={
                        <ProtectedRoute>
                            <DeliveryMetrics />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </>
    );
}

function ProtectedRoute({ children }) {
    const { isAuth } = useSelector(state => state.user);
    if (!isAuth) {
        return <Navigate to="/auth" />
    }
    return children;
}

function App() {
    const queryClient = useQueryClient();

    // ✅ GLOBAL OFFLINE SYNC FUNCTION
    useEffect(() => {
        const syncOfflineOrders = async () => {
            try {
                console.log("🔄 [GLOBAL SYNC] Checking for offline orders to sync...");

                const pendingSync = (await load(OFFLINE_PENDING_SYNC_KEY)) || [];
                console.log(`📦 [GLOBAL SYNC] Found ${pendingSync.length} items in sync queue`);

                if (pendingSync.length === 0) {
                    console.log("✅ [GLOBAL SYNC] No offline orders to sync");
                    return;
                }

                console.log("📋 [GLOBAL SYNC] PENDING SYNC QUEUE:", pendingSync);
                enqueueSnackbar(`Syncing ${pendingSync.length} offline orders...`, {
                    variant: "info"
                });

                const failedSync = [];
                let successCount = 0;

                for (const syncItem of pendingSync) {
                    try {
                        console.log(`🔄 [GLOBAL SYNC] Processing: ${syncItem.type} - OrderID: ${syncItem.orderId}`);

                   

                        // if (syncItem.type === "addOrder") {
                        //     // existing logic
                        //     const { isOffline, syncStatus, createdAt: offlineCreatedAt, updatedAt, ...cleanOrder } = syncItem.data;
                        //     const response = await addOrder(cleanOrder);
                        //     // remove from offline:orders after successful sync
                        if (syncItem.type === "addOrder") {
                        const { isOffline, syncStatus, createdAt: offlineCreatedAt, updatedAt, ...cleanOrder } = syncItem.data;
                        const response = await addOrder(cleanOrder);
                        
                        // ✅ Remove from offline:orders after successful sync
                        const offlineOrders = (await load(OFFLINE_ORDERS_KEY)) || [];
                        const updatedOfflineOrders = offlineOrders.filter(
                            o => (o._id || o.orderId) !== syncItem.orderId
                        );
                        await save(OFFLINE_ORDERS_KEY, updatedOfflineOrders);
                        console.log(`🗑️ [GLOBAL SYNC] Removed order ${syncItem.orderId} from offline:orders`);
                        
                        successCount++;
                        } else if (syncItem.type === "updateStatus") {
                            // NEW: handle offline status updates
                            const { orderId, data } = syncItem;

                            // Call your API to update order status on server
                            await updateOrderStatus({ orderId, orderStatus: data.orderStatus });

                            console.log(`✅ [GLOBAL SYNC] Status update for order ${orderId} synced successfully`);

                            // Remove from offline:pendingSync
                            const updatedPending = pendingSync.filter(item => item.orderId !== orderId);
                            await save(OFFLINE_PENDING_SYNC_KEY, updatedPending);
                            console.log(`🗑️ [GLOBAL SYNC] Removed ${orderId} from pendingSync`);
                            successCount++;
                        }
                       
                        
                        else {
                            console.warn(`⚠️ [GLOBAL SYNC] Unknown sync type: ${syncItem.type}`);
                            failedSync.push(syncItem);
                        }

                    } catch (err) {
                        console.error(`❌ [GLOBAL SYNC] Failed to sync order ${syncItem.orderId}:`, err);
                        console.error("Error details:", err.response?.data || err.message);
                        failedSync.push(syncItem);
                    }
                }

                // Update sync queue with only failed items
                await save(OFFLINE_PENDING_SYNC_KEY, failedSync);

                console.log(`✅ [GLOBAL SYNC] Sync complete: ${successCount} succeeded, ${failedSync.length} failed`);

                if (failedSync.length === 0) {
                    enqueueSnackbar(`All ${successCount} offline orders synced successfully!`, {
                        variant: "success"
                    });

                    // Invalidate cache to refresh UI across all pages
                    await queryClient.invalidateQueries(["orders"]);
                    console.log("✅ [GLOBAL SYNC] Cache invalidated - UI will refresh with synced orders");
                } else {
                    enqueueSnackbar(
                        `${successCount} orders synced. ${failedSync.length} failed - will retry later.`,
                        { variant: "warning" }
                    );
                    console.log("⚠️ [GLOBAL SYNC] FAILED ITEMS:", failedSync);
                }
            } catch (error) {
                console.error("❌ [GLOBAL SYNC] SYNC ERROR:", error);
                enqueueSnackbar("Error syncing offline orders", { variant: "error" });
            }
        };

        // Run sync when app mounts if online
        if (navigator.onLine) {
            console.log("🌐 [APP INIT] Device is ONLINE - Running sync...");
            syncOfflineOrders();
        } else {
            console.log("📴 [APP INIT] Device is OFFLINE - Sync deferred");
        }

        // Listen for online event
        const handleOnline = () => {
            console.log("🌐 [ONLINE EVENT] DEVICE BACK ONLINE - Starting sync...");
            syncOfflineOrders();
        };

        window.addEventListener("online", handleOnline);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("online", handleOnline);
        };
    }, [queryClient]);

    // ✅ Initialize POS data (existing logic)
    useEffect(() => {
        async function initPOS() {
            try {
                console.log("🚀 [POS INIT] Initializing POS system...");

                // Fetch categories & dishes once
                await fetchInitialData().catch(err => {
                    console.warn('⚠️ Failed to fetch categories/dishes, using cache if available', err);
                });

                // Fetch customers once
                await fetchCustomers().catch(err => {
                    console.warn('⚠️ Failed to fetch customers, using cache if available', err);
                });

                // Fetch delivery boys once
                await fetchDeliveryBoys().catch(err => {
                    console.warn('⚠️ Failed to fetch delivery boys, using cache if available', err);
                });

                // Fetch orders immediately
                await fetchAndCacheRecentOrders().catch(err => {
                    console.warn('⚠️ Failed to fetch recent orders, using cache if available', err);
                });

                // Start auto-refresh for orders
                startAutoRefresh();

                console.log("✅ [POS INIT] POS system initialized successfully");
            } catch (err) {
                console.error('❌ [POS INIT] Unexpected error during POS initialization', err);
            }
        }

        initPOS();
    }, []);

    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
