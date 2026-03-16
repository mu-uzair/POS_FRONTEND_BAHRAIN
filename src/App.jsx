// // App.jsx - SIMPLIFIED FINAL VERSION
// import { useEffect, useState, useCallback } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { useQueryClient, onlineManager } from '@tanstack/react-query';
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
//     processQueuedRequests,
//     getQueueSize
// } from './utils/smartRequest';

// // Components
// import Header from './components/shared/Header';
// import FullScreenLoader from './components/shared/FullScreenLoader';
// import { Home, Orders, Auth, Tables, Menu, Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics } from './pages';
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
        
//         console.log(`🔄 [RQ SYNC] OnlineManager: ${isTrulyOnline}`);
//     }, [isOfflineMode, hasInternetConnection, actualOnlineStatus, manualOfflineMode]);

//     // ============================================
//     // STEP 2: INITIALIZE POS SYSTEM
//     // ============================================
//     const initializePOS = useCallback(async () => {
//         if (isInitialized) {
//             console.log("⚠️ [POS] Already initialized");
//             return;
//         }

//         if (isCheckingConnectivity) {
//             console.log("⏳ [POS] Waiting for connectivity check...");
//             return;
//         }

//         try {
//             console.log("🚀 [POS] Starting initialization...");
//             console.log(`📊 [POS] Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);

//             const getOfflineStatus = () => ({
//                 isOfflineMode: offlineContext.isOfflineMode,
//                 hasInternetConnection: offlineContext.hasInternetConnection,
//                 actualOnlineStatus: offlineContext.actualOnlineStatus
//             });

//             // ✅ ALWAYS initialize caches first
//             console.log("📦 [POS] Initializing caches...");
//             initializeOfflineCache(queryClient, getOfflineStatus);
//             initializeMenuCache(getOfflineStatus);
//             initializeCustomersCache(getOfflineStatus);
//             initializeDeliveryBoysCache(getOfflineStatus);
//             initializeTablesCache(getOfflineStatus);

//             // ✅ CHECK: Only fetch if ONLINE
//             if (isOfflineMode) {
//                 console.log("📴 [POS] OFFLINE - Using cached data only");
//                 setIsInitialized(true);
//                 enqueueSnackbar('Working offline with cached data', { 
//                     variant: 'info',
//                     autoHideDuration: 3000 
//                 });
//                 return;
//             }

//             // ✅ ONLINE: Fetch all reference data
//             console.log("🌐 [POS] ONLINE - Fetching reference data...");
            
//             // Fetch menu
//             const menuResult = await fetchInitialData().catch(err => {
//                 console.warn('⚠️ [POS] Menu failed:', err.message);
//                 return { categories: [], dishes: [] };
//             });
//             console.log(`✅ [POS] Menu: ${menuResult.categories?.length || 0} cats, ${menuResult.dishes?.length || 0} dishes`);

//             // Fetch customers
//             const customersResult = await fetchCustomers().catch(err => {
//                 console.warn('⚠️ [POS] Customers failed:', err.message);
//                 return [];
//             });
//             console.log(`✅ [POS] Customers: ${customersResult?.length || 0}`);

//             // Fetch delivery boys
//             const deliveryBoysResult = await fetchDeliveryBoys().catch(err => {
//                 console.warn('⚠️ [POS] Delivery boys failed:', err.message);
//                 return [];
//             });
//             console.log(`✅ [POS] Delivery boys: ${deliveryBoysResult?.length || 0}`);

//             // ✅ Fetch tables (simplified like menu)
//             const tablesResult = await fetchAndCacheTables().catch(err => {
//                 console.warn('⚠️ [POS] Tables failed:', err.message);
//                 return [];
//             });
//             console.log(`✅ [POS] Tables: ${tablesResult?.length || 0}`);

//             // Fetch orders
//             const ordersResult = await fetchAndCacheRecentOrders().catch(err => {
//                 console.warn('⚠️ [POS] Orders failed:', err.message);
//                 return [];
//             });
//             console.log(`✅ [POS] Orders: ${ordersResult?.length || 0}`);

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
//             console.log(`🔍 [POS] Ready. Mode: ${isOfflineMode ? 'OFFLINE' : 'ONLINE'}`);
//             const timer = setTimeout(() => initializePOS(), 100);
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
//                     console.log(`📤 [SYNC] Processing ${queueSize} queued...`);
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

//                 // ✅ Refresh ALL caches (including tables)
//                 console.log("🔄 [SYNC] Refreshing caches...");
//                 await Promise.all([
//                     fetchAndCacheRecentOrders(),
//                     fetchInitialData(),
//                     fetchCustomers(),
//                     fetchDeliveryBoys(),
//                     fetchAndCacheTables() // ✅ Tables included
//                 ]).catch(err => console.warn('⚠️ Refresh failed:', err));

//                 startAutoRefresh();
//                 console.log("✅ [TRANSITION] Complete");
//             } catch (error) {
//                 console.error('❌ [TRANSITION] Failed:', error);
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
//         if (actualOnlineStatus && hasInternetConnection && !manualOfflineMode && !isOfflineMode) {
//             handleOnlineTransition();
//         } else if (isOfflineMode) {
//             handleOfflineTransition();
//         }
//     }, [actualOnlineStatus, hasInternetConnection, manualOfflineMode, isOfflineMode, isInitialized, syncPendingItems]);

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
//             Promise.all([
//                 fetchAndCacheRecentOrders(),
//                 fetchAndCacheTables() // ✅ Refresh tables too
//             ]).catch(err => console.warn('⚠️ Refresh failed:', err));
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
//         const emoji = isOfflineMode ? '🔴' : '🟢';
//         console.log(`${emoji} [APP]`, {
//             mode: isOfflineMode ? 'OFFLINE' : 'ONLINE',
//             manual: manualOfflineMode,
//             interface: actualOnlineStatus,
//             internet: hasInternetConnection,
//             initialized: isInitialized
//         });
//     }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isInitialized]);

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


// App.jsx
import { useEffect, useState, useCallback, useRef, Component } from 'react';
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
  stopAutoRefresh,
} from './utils/getOrdersOffline';
import { fetchInitialData, initializeMenuCache } from './utils/offlineMenu';
import { fetchDeliveryBoys, initializeDeliveryBoysCache } from './utils/offlineDeliveryBoys';
import { fetchCustomers, initializeCustomersCache } from './utils/offlineCustomers';
import { fetchAndCacheTables, initializeTablesCache } from './utils/offlineTable';
import { processQueuedRequests, getQueueSize } from './utils/smartRequest';

import Header from './components/shared/Header';
import FullScreenLoader from './components/shared/FullScreenLoader';
import {
  Home, Orders, Auth, Tables, Menu,
  Dashboard, Inventory, KitchenSection, GrillSection, DeliveryMetrics,
} from './pages';
import useLoadData from './hooks/useLoadData';

// ─────────────────────────────────────────────────────────────
// CONSTANTS  (no magic numbers scattered through the file)
// ─────────────────────────────────────────────────────────────
const CACHE_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const INIT_DELAY_MS = 100;                         // small debounce before init

// ─────────────────────────────────────────────────────────────
// ERROR BOUNDARY  (catches unexpected UI crashes in sub-pages)
// ─────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <h2 className="error-boundary-title">⚠️ Something went wrong</h2>
          <p className="error-boundary-message">{this.state.error?.message}</p>
          <button className="error-boundary-btn" onClick={this.handleReload}>
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────
// INIT ERROR SCREEN  (styles in CSS, not inline)
// ─────────────────────────────────────────────────────────────
function InitErrorScreen({ message }) {
  return (
    <div className="init-error-screen">
      <h2 className="init-error-title">⚠️ Initialization Error</h2>
      <p className="init-error-message">{message}</p>
      <button className="init-error-btn" onClick={() => window.location.reload()}>
        Reload Application
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────
function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const { isAuth } = useSelector((state) => state.user);

  const HIDE_HEADER_ROUTES = ['/auth'];

  if (isLoading) return <FullScreenLoader />;

  return (
    <>
      {!HIDE_HEADER_ROUTES.includes(location.pathname.toLowerCase()) && <Header />}
      <Routes>
        <Route path="/"                element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/auth"            element={isAuth ? <Navigate to="/" /> : <Auth />} />
        <Route path="/orders"          element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/tables"          element={<ProtectedRoute><Tables /></ProtectedRoute>} />
        <Route path="/menu"            element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inventory"       element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/kitchensection"  element={<ProtectedRoute><KitchenSection /></ProtectedRoute>} />
        <Route path="/grillsection"    element={<ProtectedRoute><GrillSection /></ProtectedRoute>} />
        <Route path="/deliverymetrics" element={<ProtectedRoute><DeliveryMetrics /></ProtectedRoute>} />
        <Route path="*"                element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) return <Navigate to="/auth" />;
  return children;
}

// ─────────────────────────────────────────────────────────────
// SYNC ORCHESTRATOR  (atomic sync with resume-on-failure)
// ─────────────────────────────────────────────────────────────

/**
 * Runs all sync steps in order.
 * If any step fails it is logged and skipped — we never leave the app
 * in a half-synced state without at least attempting every step.
 *
 * @param {Function} syncPendingItems  - from useSyncManager
 * @param {AbortSignal} signal         - cancel if component unmounts mid-sync
 */
async function runSyncOrchestrator(syncPendingItems, signal) {
  const steps = [
    {
      name: 'QueuedRequests',
      run: async () => {
        const queueSize = getQueueSize();
        if (queueSize === 0) return;
        const results = await processQueuedRequests();
        if (results.succeeded > 0) {
          enqueueSnackbar(`Synced ${results.succeeded} offline operations`, {
            variant: 'success',
          });
        }
      },
    },
    {
      name: 'PendingItems',
      run: () => syncPendingItems(),
    },
    {
      name: 'CacheRefresh',
      run: () =>
        Promise.all([
          fetchAndCacheRecentOrders(),
          fetchInitialData(),
          fetchCustomers(),
          fetchDeliveryBoys(),
          fetchAndCacheTables(),
        ]),
    },
  ];

  for (const step of steps) {
    // Stop if the component that triggered this sync has unmounted
    if (signal.aborted) {
      console.warn(`[SYNC] Aborted before step: ${step.name}`);
      return;
    }

    try {
      await step.run();
    //   console.log(`✅ [SYNC] Step complete: ${step.name}`);
    } catch (err) {
      // Log and continue — partial sync is better than a crash
      console.warn(`⚠️ [SYNC] Step failed (${step.name}):`, err.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// APP CONTENT
// ─────────────────────────────────────────────────────────────
function AppContent() {
  const queryClient = useQueryClient();
  const offlineContext = useOfflineMode();
  const {
    isOfflineMode,
    actualOnlineStatus,
    hasInternetConnection,
    manualOfflineMode,
    isCheckingConnectivity,
  } = offlineContext;

  const { syncPendingItems } = useSyncManager();

  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError]         = useState(null);

  // Tracks whether initialization is currently running so we never
  // start a second concurrent init (replaces the fragile isInitialized check).
  const isInitializingRef = useRef(false);

  // ── 1. Keep React Query's online manager in sync ──────────
  useEffect(() => {
    const isTrulyOnline =
      hasInternetConnection && actualOnlineStatus && !manualOfflineMode;
    onlineManager.setOnline(isTrulyOnline);
  }, [hasInternetConnection, actualOnlineStatus, manualOfflineMode]);

  // ── 2. Initialize POS (runs once after connectivity check) ─
  const initializePOS = useCallback(async () => {
    // Guard: don't run if already initializing or done
    if (isInitialized || isInitializingRef.current) return;
    isInitializingRef.current = true;

    try {
      const getOfflineStatus = () => ({
        isOfflineMode:         offlineContext.isOfflineMode,
        hasInternetConnection: offlineContext.hasInternetConnection,
        actualOnlineStatus:    offlineContext.actualOnlineStatus,
      });

      // Always initialize local caches first (works offline too)
      initializeOfflineCache(queryClient, getOfflineStatus);
      initializeMenuCache(getOfflineStatus);
      initializeCustomersCache(getOfflineStatus);
      initializeDeliveryBoysCache(getOfflineStatus);
      initializeTablesCache(getOfflineStatus);

      if (isOfflineMode) {
        enqueueSnackbar('Working offline with cached data', {
          variant: 'info',
          autoHideDuration: 3000,
        });
        setIsInitialized(true);
        return;
      }

      // Online: fetch all reference data in parallel for speed
      const [menu, customers, deliveryBoys, tables, orders] = await Promise.allSettled([
        fetchInitialData(),
        fetchCustomers(),
        fetchDeliveryBoys(),
        fetchAndCacheTables(),
        fetchAndCacheRecentOrders(),
      ]);

      // Log results without throwing on individual failures
      const log = (label, result) => {
        if (result.status === 'fulfilled') {
          const count = result.value?.length ?? result.value?.categories?.length ?? '?';
        //   console.log(`✅ [POS] ${label}: ${count}`);
        } else {
          console.warn(`⚠️ [POS] ${label} failed:`, result.reason?.message);
        }
      };

      log('Menu categories', { status: 'fulfilled', value: menu.value?.categories });
      log('Customers',       customers);
      log('DeliveryBoys',    deliveryBoys);
      log('Tables',          tables);
      log('Orders',          orders);

      startAutoRefresh();
      setIsInitialized(true);

      enqueueSnackbar('POS System ready', { variant: 'success', autoHideDuration: 2000 });
    } catch (error) {
      console.error('[POS] Initialization failed:', error);
      setInitError(error.message);
      enqueueSnackbar('Failed to initialize POS', { variant: 'error', persist: true });
    } finally {
      isInitializingRef.current = false;
    }
  }, [queryClient, offlineContext, isOfflineMode, isInitialized]);

  // FIX: timer is always cleared — no stale timers from rapid connectivity flickers
  useEffect(() => {
    if (isCheckingConnectivity) return;
    const timer = setTimeout(initializePOS, INIT_DELAY_MS);
    return () => clearTimeout(timer); // ← critical cleanup
  }, [isCheckingConnectivity, initializePOS]);

  // Cleanup auto-refresh on unmount
  useEffect(() => () => stopAutoRefresh(), []);

  // ── 3. Handle online / offline transitions ─────────────────
  useEffect(() => {
    if (!isInitialized) return;

    const isTrulyOnline =
      actualOnlineStatus && hasInternetConnection && !manualOfflineMode && !isOfflineMode;

    if (!isTrulyOnline) {
      stopAutoRefresh();
      enqueueSnackbar('Working offline with cached data', {
        variant: 'info',
        autoHideDuration: 3000,
      });
      return;
    }

    // FIX: AbortController prevents setState on unmounted component
    const controller = new AbortController();

    const handleOnlineTransition = async () => {
      try {
        await runSyncOrchestrator(syncPendingItems, controller.signal);

        if (!controller.signal.aborted) {
          startAutoRefresh();
          // console.log('✅ [TRANSITION] → ONLINE complete');
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('[TRANSITION] Failed:', error);
          enqueueSnackbar('Some data may not be synced', { variant: 'warning' });
        }
      }
    };

    handleOnlineTransition();

    // Cleanup: abort the async chain if deps change before it finishes
    return () => controller.abort();
  }, [
    actualOnlineStatus,
    hasInternetConnection,
    manualOfflineMode,
    isOfflineMode,
    isInitialized,
    syncPendingItems,
  ]);

  // ── 4. Periodic cache refresh (online only) ────────────────
  useEffect(() => {
    if (!isInitialized || isOfflineMode) return;

    const refreshInterval = setInterval(() => {
      Promise.all([
        fetchAndCacheRecentOrders(),
        fetchAndCacheTables(),
      ]).catch((err) => console.warn('[CACHE] Periodic refresh failed:', err));
    }, CACHE_REFRESH_INTERVAL_MS);

    return () => clearInterval(refreshInterval);
  }, [isInitialized, isOfflineMode]);

  // ── 5. Render ──────────────────────────────────────────────
  if (initError) return <InitErrorScreen message={initError} />;

  return (
    <Router>
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    </Router>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <OfflineModeProvider>
      <AppContent />
    </OfflineModeProvider>
  );
}

export default App;