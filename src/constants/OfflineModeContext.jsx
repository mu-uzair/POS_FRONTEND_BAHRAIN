// // contexts/OfflineModeContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { enqueueSnackbar } from 'notistack';

// const OfflineModeContext = createContext();

// export const useOfflineMode = () => {
//   const context = useContext(OfflineModeContext);
//   if (!context) {
//     throw new Error('useOfflineMode must be used within OfflineModeProvider');
//   }
//   return context;
// };

// export const OfflineModeProvider = ({ children }) => {
//   // Check localStorage for saved preference
//   const getSavedMode = () => {
//     try {
//       const saved = localStorage.getItem('offlineMode');
//       return saved === 'true';
//     } catch {
//       return false;
//     }
//   };

//   const [manualOfflineMode, setManualOfflineMode] = useState(getSavedMode());
//   const [actualOnlineStatus, setActualOnlineStatus] = useState(navigator.onLine);
//   const [hasInternetConnection, setHasInternetConnection] = useState(true);
//   const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(true); 

//   // ✅ CHECK EXTERNAL INTERNET CONNECTIVITY
//   // This works even on localhost because it tries to reach external sites
//   const checkInternetConnectivity = useCallback(async () => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);

//       // Try multiple external endpoints (these will fail when internet is down)
//       const endpoints = [
//         { url: 'https://www.google.com/favicon.ico', name: 'Google' },
//         { url: 'https://www.cloudflare.com/favicon.ico', name: 'Cloudflare' },
//         { url: 'https://1.1.1.1', name: 'Cloudflare DNS' }
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint.url, {
//             method: 'HEAD',
//             mode: 'no-cors', // Important: allows cross-origin requests
//             cache: 'no-cache',
//             signal: controller.signal
//           });
          
//           clearTimeout(timeoutId);
//           console.log(`✅ [INTERNET CHECK] Successfully reached: ${endpoint.name}`);
//           return true;
//         } catch (err) {
//           console.warn(`⚠️ [INTERNET CHECK] Failed to reach: ${endpoint.name}`);
//           continue;
//         }
//       }

//       clearTimeout(timeoutId);
//       console.warn('❌ [INTERNET CHECK] All external endpoints failed - No internet');
//       return false;
//     } catch (error) {
//       console.error('❌ [INTERNET CHECK] Error:', error.message);
//       return false;
//     }
//   }, []);

//   // ✅ COMPREHENSIVE CONNECTIVITY CHECK
//   const performConnectivityCheck = useCallback(async () => {
//     console.log('🔍 [CONNECTIVITY CHECK] Starting...');
//     setIsCheckingConnectivity(true); // ✅ Set loading state


//     // Step 1: Check browser's network interface status
//     const browserOnline = navigator.onLine;
//     console.log(`📡 [BROWSER STATUS] navigator.onLine = ${browserOnline}`);

//     if (!browserOnline) {
//       // Definitely offline - cable unplugged or WiFi off
//       console.log('📴 [RESULT] Offline (network interface down)');
//       setActualOnlineStatus(false);
//       setHasInternetConnection(false);
//       return false;
//     }

//     // Step 2: Browser says online, but verify actual internet connectivity
//     // This is crucial for localhost testing - it tries external sites
//     const hasInternet = await checkInternetConnectivity();
//     console.log(`🌐 [INTERNET CHECK] Has connectivity = ${hasInternet}`);

//     setActualOnlineStatus(browserOnline);
//     setHasInternetConnection(hasInternet);

//     if (!hasInternet) {
//       console.log('⚠️ [RESULT] Network interface up but NO INTERNET (router disconnected)');
//     } else {
//       console.log('✅ [RESULT] Fully online with internet');
//     }

//     return hasInternet;
//   }, [checkInternetConnectivity]);

//   // ✅ PERIODIC HEALTH CHECKS - Run every 10 seconds
//   useEffect(() => {
//     let intervalId;

//     const startHealthChecks = () => {
//       // Initial check
//       performConnectivityCheck();

//       // Periodic checks every 10 seconds
//       intervalId = setInterval(() => {
//         console.log('⏰ [PERIODIC CHECK] Running scheduled connectivity check...');
//         performConnectivityCheck();
//       }, 10000); // 10 seconds
//     };

//     startHealthChecks();

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//         console.log('🛑 [CLEANUP] Stopped periodic connectivity checks');
//       }
//     };
//   }, [performConnectivityCheck]);

//   // ✅ LISTEN TO BROWSER NETWORK EVENTS
//   useEffect(() => {
//     const handleOnline = async () => {
//       console.log('🌐 [BROWSER EVENT] Online event fired');
//       setActualOnlineStatus(true);

//       // Verify actual internet connectivity (important for localhost)
//       const hasInternet = await checkInternetConnectivity();
//       setHasInternetConnection(hasInternet);

//       if (hasInternet && !manualOfflineMode) {
//         enqueueSnackbar('Internet connection restored', {
//           variant: 'success'
//         });
//       }
//     };

//     const handleOffline = () => {
//       console.log('📴 [BROWSER EVENT] Offline event fired');
//       setActualOnlineStatus(false);
//       setHasInternetConnection(false);

//       enqueueSnackbar('Network disconnected - Offline mode activated', {
//         variant: 'warning'
//       });
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     // Initial check on mount
//     console.log('🚀 [INIT] Setting up connectivity monitoring...');

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, [manualOfflineMode, checkInternetConnectivity]);

//   // ✅ TOGGLE FUNCTION
//   const toggleOfflineMode = () => {
//     // Can't switch to online mode if network is down or no internet
//     if (!actualOnlineStatus || !hasInternetConnection) {
//       if (manualOfflineMode) {
//         enqueueSnackbar('Cannot switch to online mode - No internet connection', {
//           variant: 'error',
//           autoHideDuration: 3000
//         });
//         return;
//       }
//     }

//     const newMode = !manualOfflineMode;
//     setManualOfflineMode(newMode);
//     localStorage.setItem('offlineMode', newMode.toString());

//     enqueueSnackbar(
//       newMode ? 'Offline mode activated' : 'Online mode activated',
//       { variant: newMode ? 'warning' : 'success' }
//     );

//     console.log(`🔄 [MODE TOGGLE] Switched to: ${newMode ? 'OFFLINE' : 'ONLINE'}`);
//   };

//   const setOfflineMode = (mode) => {
//     if (!mode && (!actualOnlineStatus || !hasInternetConnection)) {
//       enqueueSnackbar('Cannot switch to online mode - No internet connection', {
//         variant: 'error'
//       });
//       return;
//     }

//     setManualOfflineMode(mode);
//     localStorage.setItem('offlineMode', mode.toString());
//   };

//   // ✅ EFFECTIVE OFFLINE STATUS
//   // Offline if: manual mode OR no network interface OR no internet
//   const isOfflineMode = manualOfflineMode || !actualOnlineStatus || !hasInternetConnection;

//   // ✅ LOG STATE CHANGES (Enhanced for debugging)
//   useEffect(() => {
//     const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//     console.log(`${statusEmoji} [OFFLINE CONTEXT STATE]`, {
//       isOfflineMode,
//       manualOfflineMode,
//       actualOnlineStatus,
//       hasInternetConnection,
//       timestamp: new Date().toLocaleTimeString()
//     });
//   }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection]);

//   const value = {
//     isOfflineMode,              // Combined: true if manual OR no network OR no internet
//     manualOfflineMode,          // User preference
//     actualOnlineStatus,         // Network interface connected
//     hasInternetConnection,      // Actual internet connectivity (checks external sites)
//     toggleOfflineMode,          // Toggle manual mode
//     setOfflineMode,             // Set manual mode directly
//     checkConnectivity: performConnectivityCheck, // Manual connectivity check
//   };

//   return (
//     <OfflineModeContext.Provider value={value}>
//       {children}
//     </OfflineModeContext.Provider>
//   );
// };

// // contexts/OfflineModeContext.jsx - FIXED with loading state
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { enqueueSnackbar } from 'notistack';

// const OfflineModeContext = createContext();

// export const useOfflineMode = () => {
//   const context = useContext(OfflineModeContext);
//   if (!context) {
//     throw new Error('useOfflineMode must be used within OfflineModeProvider');
//   }
//   return context;
// };

// export const OfflineModeProvider = ({ children }) => {
//   const getSavedMode = () => {
//     try {
//       const saved = localStorage.getItem('offlineMode');
//       return saved === 'true';
//     } catch {
//       return false;
//     }
//   };

//   const [manualOfflineMode, setManualOfflineMode] = useState(getSavedMode());
//   const [actualOnlineStatus, setActualOnlineStatus] = useState(navigator.onLine);
//   const [hasInternetConnection, setHasInternetConnection] = useState(true);
//   const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(true); // ✅ NEW: Loading state

//   // ✅ CHECK EXTERNAL INTERNET CONNECTIVITY
//   const checkInternetConnectivity = useCallback(async () => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);

//       const endpoints = [
//         { url: 'https://www.google.com/favicon.ico', name: 'Google' },
//         { url: 'https://www.cloudflare.com/favicon.ico', name: 'Cloudflare' },
//         { url: 'https://1.1.1.1', name: 'Cloudflare DNS' }
//       ];

//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint.url, {
//             method: 'HEAD',
//             mode: 'no-cors',
//             cache: 'no-cache',
//             signal: controller.signal
//           });
          
//           clearTimeout(timeoutId);
//           console.log(`✅ [INTERNET CHECK] Successfully reached: ${endpoint.name}`);
//           return true;
//         } catch (err) {
//           console.warn(`⚠️ [INTERNET CHECK] Failed to reach: ${endpoint.name}`);
//           continue;
//         }
//       }

//       clearTimeout(timeoutId);
//       console.warn('❌ [INTERNET CHECK] All external endpoints failed - No internet');
//       return false;
//     } catch (error) {
//       console.error('❌ [INTERNET CHECK] Error:', error.message);
//       return false;
//     }
//   }, []);

//   // ✅ COMPREHENSIVE CONNECTIVITY CHECK
//   const performConnectivityCheck = useCallback(async () => {
//     console.log('🔍 [CONNECTIVITY CHECK] Starting...');
//     setIsCheckingConnectivity(true); // ✅ Set loading state

//     try {
//       const browserOnline = navigator.onLine;
//       console.log(`📡 [BROWSER STATUS] navigator.onLine = ${browserOnline}`);

//       if (!browserOnline) {
//         console.log('📴 [RESULT] Offline (network interface down)');
//         setActualOnlineStatus(false);
//         setHasInternetConnection(false);
//         return false;
//       }

//       const hasInternet = await checkInternetConnectivity();
//       console.log(`🌐 [INTERNET CHECK] Has connectivity = ${hasInternet}`);

//       setActualOnlineStatus(browserOnline);
//       setHasInternetConnection(hasInternet);

//       if (!hasInternet) {
//         console.log('⚠️ [RESULT] Network interface up but NO INTERNET (router disconnected)');
//       } else {
//         console.log('✅ [RESULT] Fully online with internet');
//       }

//       return hasInternet;
//     } finally {
//       setIsCheckingConnectivity(false); // ✅ Clear loading state
//     }
//   }, [checkInternetConnectivity]);

//   // ✅ INITIAL CHECK ON MOUNT (CRITICAL)
//   useEffect(() => {
//     console.log('🚀 [INIT] Running initial connectivity check...');
//     performConnectivityCheck();
//   }, [performConnectivityCheck]);

//   // ✅ PERIODIC HEALTH CHECKS - Run every 10 seconds
//   useEffect(() => {
//     let intervalId;

//     const startHealthChecks = () => {
//       intervalId = setInterval(() => {
//         console.log('⏰ [PERIODIC CHECK] Running scheduled connectivity check...');
//         performConnectivityCheck();
//       }, 10000);
//     };

//     // Start periodic checks AFTER initial check
//     const timer = setTimeout(() => {
//       startHealthChecks();
//     }, 1000);

//     return () => {
//       clearTimeout(timer);
//       if (intervalId) {
//         clearInterval(intervalId);
//         console.log('🛑 [CLEANUP] Stopped periodic connectivity checks');
//       }
//     };
//   }, [performConnectivityCheck]);

//   // ✅ LISTEN TO BROWSER NETWORK EVENTS
//   useEffect(() => {
//     const handleOnline = async () => {
//       console.log('🌐 [BROWSER EVENT] Online event fired');
//       setActualOnlineStatus(true);

//       const hasInternet = await checkInternetConnectivity();
//       setHasInternetConnection(hasInternet);

//       if (hasInternet && !manualOfflineMode) {
//         enqueueSnackbar('Internet connection restored', {
//           variant: 'success'
//         });
//       }
//     };

//     const handleOffline = () => {
//       console.log('📴 [BROWSER EVENT] Offline event fired');
//       setActualOnlineStatus(false);
//       setHasInternetConnection(false);

//       enqueueSnackbar('Network disconnected - Offline mode activated', {
//         variant: 'warning'
//       });
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, [manualOfflineMode, checkInternetConnectivity]);

//   // ✅ TOGGLE FUNCTION
//   const toggleOfflineMode = () => {
//     if (!actualOnlineStatus || !hasInternetConnection) {
//       if (manualOfflineMode) {
//         enqueueSnackbar('Cannot switch to online mode - No internet connection', {
//           variant: 'error',
//           autoHideDuration: 3000
//         });
//         return;
//       }
//     }

//     const newMode = !manualOfflineMode;
//     setManualOfflineMode(newMode);
//     localStorage.setItem('offlineMode', newMode.toString());

//     enqueueSnackbar(
//       newMode ? 'Offline mode activated' : 'Online mode activated',
//       { variant: newMode ? 'warning' : 'success' }
//     );

//     console.log(`🔄 [MODE TOGGLE] Switched to: ${newMode ? 'OFFLINE' : 'ONLINE'}`);
//   };

//   const setOfflineMode = (mode) => {
//     if (!mode && (!actualOnlineStatus || !hasInternetConnection)) {
//       enqueueSnackbar('Cannot switch to online mode - No internet connection', {
//         variant: 'error'
//       });
//       return;
//     }

//     setManualOfflineMode(mode);
//     localStorage.setItem('offlineMode', mode.toString());
//   };

//   // ✅ EFFECTIVE OFFLINE STATUS
//   const isOfflineMode = manualOfflineMode || !actualOnlineStatus || !hasInternetConnection;

//   // ✅ LOG STATE CHANGES
//   useEffect(() => {
//     const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//     console.log(`${statusEmoji} [OFFLINE CONTEXT STATE]`, {
//       isOfflineMode,
//       manualOfflineMode,
//       actualOnlineStatus,
//       hasInternetConnection,
//       isCheckingConnectivity, // ✅ Include loading state in logs
//       timestamp: new Date().toLocaleTimeString()
//     });
//   }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isCheckingConnectivity]);

//   const value = {
//     isOfflineMode,
//     manualOfflineMode,
//     actualOnlineStatus,
//     hasInternetConnection,
//     isCheckingConnectivity, // ✅ NEW: Expose loading state
//     toggleOfflineMode,
//     setOfflineMode,
//     checkConnectivity: performConnectivityCheck,
//   };

//   return (
//     <OfflineModeContext.Provider value={value}>
//       {children}
//     </OfflineModeContext.Provider>
//   );
// };

// // contexts/OfflineModeContext.jsx - COMPLETE FIX
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { enqueueSnackbar } from 'notistack';

// const OfflineModeContext = createContext();

// export const useOfflineMode = () => {
//   const context = useContext(OfflineModeContext);
//   if (!context) {
//     throw new Error('useOfflineMode must be used within OfflineModeProvider');
//   }
//   return context;
// };

// export const OfflineModeProvider = ({ children }) => {
//   const getSavedMode = () => {
//     try {
//       const saved = localStorage.getItem('offlineMode');
//       return saved === 'true';
//     } catch {
//       return false;
//     }
//   };

//   const [manualOfflineMode, setManualOfflineMode] = useState(getSavedMode());
//   const [actualOnlineStatus, setActualOnlineStatus] = useState(navigator.onLine);
//   const [hasInternetConnection, setHasInternetConnection] = useState(true);
//   const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(true);
//   const [lastCheckTime, setLastCheckTime] = useState(null);

//   // ✅ IMPROVED: Internet connectivity check with multiple fallbacks
//   const checkInternetConnectivity = useCallback(async () => {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 5000);

//       // Multiple reliable endpoints
//       const endpoints = [
//         { url: 'https://www.google.com/generate_204', name: 'Google' },
//         { url: 'https://www.cloudflare.com/cdn-cgi/trace', name: 'Cloudflare' },
//         { url: 'https://1.1.1.1', name: 'Cloudflare DNS' }
//       ];

//       // Try each endpoint
//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint.url, {
//             method: 'HEAD',
//             mode: 'no-cors',
//             cache: 'no-store',
//             signal: controller.signal
//           });
          
//           clearTimeout(timeoutId);
//           console.log(`✅ [INTERNET CHECK] Success: ${endpoint.name}`);
//           return true;
//         } catch (err) {
//           console.warn(`⚠️ [INTERNET CHECK] Failed: ${endpoint.name}`);
//           continue;
//         }
//       }

//       clearTimeout(timeoutId);
//       console.warn('❌ [INTERNET CHECK] All endpoints failed');
//       return false;
//     } catch (error) {
//       console.error('❌ [INTERNET CHECK] Error:', error.message);
//       return false;
//     }
//   }, []);

//   // ✅ COMPREHENSIVE CONNECTIVITY CHECK
//   const performConnectivityCheck = useCallback(async () => {
//     console.log('🔍 [CONNECTIVITY] Starting check...');
//     setIsCheckingConnectivity(true);

//     try {
//       // Step 1: Check network interface
//       const browserOnline = navigator.onLine;
//       console.log(`📡 [NETWORK INTERFACE] ${browserOnline ? 'UP' : 'DOWN'}`);

//       if (!browserOnline) {
//         console.log('📴 [RESULT] Network interface is DOWN');
//         setActualOnlineStatus(false);
//         setHasInternetConnection(false);
//         setLastCheckTime(Date.now());
//         return false;
//       }

//       // Step 2: Check actual internet connectivity
//       const hasInternet = await checkInternetConnectivity();
//       console.log(`🌐 [INTERNET] ${hasInternet ? 'AVAILABLE' : 'UNAVAILABLE'}`);

//       setActualOnlineStatus(browserOnline);
//       setHasInternetConnection(hasInternet);
//       setLastCheckTime(Date.now());

//       if (!hasInternet) {
//         console.log('⚠️ [RESULT] Network UP but NO INTERNET (router/ISP issue)');
//       } else {
//         console.log('✅ [RESULT] Fully online with internet');
//       }

//       return hasInternet;
//     } finally {
//       setIsCheckingConnectivity(false);
//     }
//   }, [checkInternetConnectivity]);

//   // ✅ INITIAL CHECK ON MOUNT
//   useEffect(() => {
//     console.log('🚀 [INIT] Running initial connectivity check...');
//     performConnectivityCheck();
//   }, [performConnectivityCheck]);

//   // ✅ PERIODIC HEALTH CHECKS - Every 10 seconds
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       console.log('⏰ [PERIODIC] Running scheduled check...');
//       performConnectivityCheck();
//     }, 10000); // 10 seconds

//     return () => {
//       clearInterval(intervalId);
//       console.log('🛑 [CLEANUP] Stopped periodic checks');
//     };
//   }, [performConnectivityCheck]);

//   // ✅ BROWSER NETWORK EVENTS
//   useEffect(() => {
//     const handleOnline = async () => {
//       console.log('🌐 [EVENT] Browser online event');
//       setActualOnlineStatus(true);

//       // Verify actual internet connectivity
//       const hasInternet = await checkInternetConnectivity();
//       setHasInternetConnection(hasInternet);

//       if (hasInternet && !manualOfflineMode) {
//         enqueueSnackbar('Internet connection restored', {
//           variant: 'success',
//           autoHideDuration: 3000
//         });
//       } else if (!hasInternet) {
//         enqueueSnackbar('Network connected but no internet access', {
//           variant: 'warning',
//           autoHideDuration: 4000
//         });
//       }
//     };

//     const handleOffline = () => {
//       console.log('📴 [EVENT] Browser offline event');
//       setActualOnlineStatus(false);
//       setHasInternetConnection(false);

//       enqueueSnackbar('Network disconnected - Working offline', {
//         variant: 'warning',
//         autoHideDuration: 3000
//       });
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, [manualOfflineMode, checkInternetConnectivity]);

//   // ✅ TOGGLE FUNCTION
//   const toggleOfflineMode = () => {
//     if (!actualOnlineStatus || !hasInternetConnection) {
//       if (manualOfflineMode) {
//         enqueueSnackbar('Cannot go online - No internet connection detected', {
//           variant: 'error',
//           autoHideDuration: 3000
//         });
//         return;
//       }
//     }

//     const newMode = !manualOfflineMode;
//     setManualOfflineMode(newMode);
//     localStorage.setItem('offlineMode', newMode.toString());

//     enqueueSnackbar(
//       newMode ? 'Switched to offline mode' : 'Switched to online mode',
//       { variant: newMode ? 'warning' : 'success' }
//     );

//     console.log(`🔄 [TOGGLE] Switched to: ${newMode ? 'OFFLINE' : 'ONLINE'}`);
//   };

//   const setOfflineMode = (mode) => {
//     if (!mode && (!actualOnlineStatus || !hasInternetConnection)) {
//       enqueueSnackbar('Cannot go online - No internet connection', {
//         variant: 'error'
//       });
//       return;
//     }

//     setManualOfflineMode(mode);
//     localStorage.setItem('offlineMode', mode.toString());
//   };

//   // ✅ EFFECTIVE OFFLINE STATUS
//   const isOfflineMode = manualOfflineMode || !actualOnlineStatus || !hasInternetConnection;

//   // ✅ STATE LOGGING
//   useEffect(() => {
//     const statusEmoji = isOfflineMode ? '🔴' : '🟢';
//     console.log(`${statusEmoji} [CONTEXT STATE]`, {
//       isOfflineMode,
//       manualOfflineMode,
//       actualOnlineStatus,
//       hasInternetConnection,
//       isCheckingConnectivity,
//       lastCheck: lastCheckTime ? new Date(lastCheckTime).toLocaleTimeString() : 'Never',
//       timestamp: new Date().toLocaleTimeString()
//     });
//   }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isCheckingConnectivity, lastCheckTime]);

//   const value = {
//     isOfflineMode,
//     manualOfflineMode,
//     actualOnlineStatus,
//     hasInternetConnection,
//     isCheckingConnectivity,
//     lastCheckTime,
//     toggleOfflineMode,
//     setOfflineMode,
//     checkConnectivity: performConnectivityCheck,
//   };

//   return (
//     <OfflineModeContext.Provider value={value}>
//       {children}
//     </OfflineModeContext.Provider>
//   );
// };



// contexts/OfflineModeContext.jsx - SYNCED WITH GLOBAL STATE
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import { setOfflineState } from '../utils/offlineState'; // 👈 NEW

const OfflineModeContext = createContext();

export const useOfflineMode = () => {
  const context = useContext(OfflineModeContext);
  if (!context) {
    throw new Error('useOfflineMode must be used within OfflineModeProvider');
  }
  return context;
};

export const OfflineModeProvider = ({ children }) => {
  const getSavedMode = () => {
    try {
      const saved = localStorage.getItem('offlineMode');
      return saved === 'true';
    } catch {
      return false;
    }
  };

  const [manualOfflineMode, setManualOfflineMode] = useState(getSavedMode());
  const [actualOnlineStatus, setActualOnlineStatus] = useState(navigator.onLine);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const [isCheckingConnectivity, setIsCheckingConnectivity] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  // Internet connectivity check
  const checkInternetConnectivity = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const endpoints = [
        { url: 'https://www.google.com/generate_204', name: 'Google' },
        { url: 'https://www.cloudflare.com/cdn-cgi/trace', name: 'Cloudflare' },
        { url: 'https://1.1.1.1', name: 'Cloudflare DNS' }
      ];

      for (const endpoint of endpoints) {
        try {
          await fetch(endpoint.url, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log(`✅ [INTERNET CHECK] Success: ${endpoint.name}`);
          return true;
        } catch (err) {
          console.warn(`⚠️ [INTERNET CHECK] Failed: ${endpoint.name}`);
          continue;
        }
      }

      clearTimeout(timeoutId);
      console.warn('❌ [INTERNET CHECK] All endpoints failed');
      return false;
    } catch (error) {
      console.error('❌ [INTERNET CHECK] Error:', error.message);
      return false;
    }
  }, []);

  const performConnectivityCheck = useCallback(async () => {
    console.log('🔍 [CONNECTIVITY] Starting check...');
    setIsCheckingConnectivity(true);

    try {
      const browserOnline = navigator.onLine;
      console.log(`📡 [NETWORK INTERFACE] ${browserOnline ? 'UP' : 'DOWN'}`);

      if (!browserOnline) {
        console.log('📴 [RESULT] Network interface is DOWN');
        setActualOnlineStatus(false);
        setHasInternetConnection(false);
        setLastCheckTime(Date.now());
        return false;
      }

      const hasInternet = await checkInternetConnectivity();
      console.log(`🌐 [INTERNET] ${hasInternet ? 'AVAILABLE' : 'UNAVAILABLE'}`);

      setActualOnlineStatus(browserOnline);
      setHasInternetConnection(hasInternet);
      setLastCheckTime(Date.now());

      if (!hasInternet) {
        console.log('⚠️ [RESULT] Network UP but NO INTERNET (router/ISP issue)');
      } else {
        console.log('✅ [RESULT] Fully online with internet');
      }

      return hasInternet;
    } finally {
      setIsCheckingConnectivity(false);
    }
  }, [checkInternetConnectivity]);

  // Initial check
  useEffect(() => {
    console.log('🚀 [INIT] Running initial connectivity check...');
    performConnectivityCheck();
  }, [performConnectivityCheck]);

  // Periodic checks every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('⏰ [PERIODIC] Running scheduled check...');
      performConnectivityCheck();
    }, 10000);

    return () => {
      clearInterval(intervalId);
      console.log('🛑 [CLEANUP] Stopped periodic checks');
    };
  }, [performConnectivityCheck]);

  // Browser network events
  useEffect(() => {
    const handleOnline = async () => {
      console.log('🌐 [EVENT] Browser online event');
      setActualOnlineStatus(true);

      const hasInternet = await checkInternetConnectivity();
      setHasInternetConnection(hasInternet);

      if (hasInternet && !manualOfflineMode) {
        enqueueSnackbar('Internet connection restored', {
          variant: 'success',
          autoHideDuration: 3000
        });
      } else if (!hasInternet) {
        enqueueSnackbar('Network connected but no internet access', {
          variant: 'warning',
          autoHideDuration: 4000
        });
      }
    };

    const handleOffline = () => {
      console.log('📴 [EVENT] Browser offline event');
      setActualOnlineStatus(false);
      setHasInternetConnection(false);

      enqueueSnackbar('Network disconnected - Working offline', {
        variant: 'warning',
        autoHideDuration: 3000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [manualOfflineMode, checkInternetConnectivity]);

  // Toggle function
  const toggleOfflineMode = () => {
    if (!actualOnlineStatus || !hasInternetConnection) {
      if (manualOfflineMode) {
        enqueueSnackbar('Cannot go online - No internet connection detected', {
          variant: 'error',
          autoHideDuration: 3000
        });
        return;
      }
    }

    const newMode = !manualOfflineMode;
    setManualOfflineMode(newMode);
    localStorage.setItem('offlineMode', newMode.toString());

    enqueueSnackbar(
      newMode ? 'Switched to offline mode' : 'Switched to online mode',
      { variant: newMode ? 'warning' : 'success' }
    );

    console.log(`🔄 [TOGGLE] Switched to: ${newMode ? 'OFFLINE' : 'ONLINE'}`);
  };

  const setOfflineModeManual = (mode) => {
    if (!mode && (!actualOnlineStatus || !hasInternetConnection)) {
      enqueueSnackbar('Cannot go online - No internet connection', {
        variant: 'error'
      });
      return;
    }

    setManualOfflineMode(mode);
    localStorage.setItem('offlineMode', mode.toString());
  };

  // 🔥 EFFECTIVE OFFLINE STATUS - SINGLE SOURCE OF TRUTH
  const isOfflineMode = manualOfflineMode || !actualOnlineStatus || !hasInternetConnection;

  // 🔥 SYNC TO GLOBAL STATE (THIS IS THE KEY)
  useEffect(() => {
    setOfflineState({
      isOffline: isOfflineMode, // 👈 THIS controls ALL APIs
    });

    const statusEmoji = isOfflineMode ? '🔴' : '🟢';
    console.log(`${statusEmoji} [CONTEXT STATE]`, {
      isOfflineMode,
      manualOfflineMode,
      actualOnlineStatus,
      hasInternetConnection,
      isCheckingConnectivity,
      lastCheck: lastCheckTime ? new Date(lastCheckTime).toLocaleTimeString() : 'Never',
      timestamp: new Date().toLocaleTimeString()
    });
  }, [isOfflineMode, manualOfflineMode, actualOnlineStatus, hasInternetConnection, isCheckingConnectivity, lastCheckTime]);

  const value = {
    isOfflineMode,
    manualOfflineMode,
    actualOnlineStatus,
    hasInternetConnection,
    isCheckingConnectivity,
    lastCheckTime,
    toggleOfflineMode,
    setOfflineMode: setOfflineModeManual,
    checkConnectivity: performConnectivityCheck,
  };

  return (
    <OfflineModeContext.Provider value={value}>
      {children}
    </OfflineModeContext.Provider>
  );
};