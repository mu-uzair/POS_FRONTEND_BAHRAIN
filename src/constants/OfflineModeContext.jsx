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
          // console.log(`✅ [INTERNET CHECK] Success: ${endpoint.name}`);
          return true;
        } catch (err) {
          // console.warn(`⚠️ [INTERNET CHECK] Failed: ${endpoint.name}`);
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
    // console.log('🔍 [CONNECTIVITY] Starting check...');
    setIsCheckingConnectivity(true);

    try {
      const browserOnline = navigator.onLine;
      // console.log(`📡 [NETWORK INTERFACE] ${browserOnline ? 'UP' : 'DOWN'}`);

      if (!browserOnline) {
        // console.log('📴 [RESULT] Network interface is DOWN');
        setActualOnlineStatus(false);
        setHasInternetConnection(false);
        setLastCheckTime(Date.now());
        return false;
      }

      const hasInternet = await checkInternetConnectivity();
      // console.log(`🌐 [INTERNET] ${hasInternet ? 'AVAILABLE' : 'UNAVAILABLE'}`);

      setActualOnlineStatus(browserOnline);
      setHasInternetConnection(hasInternet);
      setLastCheckTime(Date.now());

      // if (!hasInternet) {
      //   console.log('⚠️ [RESULT] Network UP but NO INTERNET (router/ISP issue)');
      // } else {
      //   console.log('✅ [RESULT] Fully online with internet');
      // }

      return hasInternet;
    } finally {
      setIsCheckingConnectivity(false);
    }
  }, [checkInternetConnectivity]);

  // Initial check
  useEffect(() => {
    // console.log('🚀 [INIT] Running initial connectivity check...');
    performConnectivityCheck();
  }, [performConnectivityCheck]);

  // Periodic checks every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log('⏰ [PERIODIC] Running scheduled check...');
      performConnectivityCheck();
    }, 10000);

    return () => {
      clearInterval(intervalId);
      // console.log('🛑 [CLEANUP] Stopped periodic checks');
    };
  }, [performConnectivityCheck]);

  // Browser network events
  useEffect(() => {
    const handleOnline = async () => {
      // console.log('🌐 [EVENT] Browser online event');
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
      // console.log('📴 [EVENT] Browser offline event');
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

    // console.log(`🔄 [TOGGLE] Switched to: ${newMode ? 'OFFLINE' : 'ONLINE'}`);
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