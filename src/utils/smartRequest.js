// utils/smartRequest.js - HARD BLOCK WHEN OFFLINE
import localforage from 'localforage';
import { enqueueSnackbar } from 'notistack';
import { getOfflineState } from './offlineState'; // 👈 NEW - SINGLE SOURCE OF TRUTH

// ============================================
// CUSTOM ERROR TYPES
// ============================================
export class OfflineError extends Error {
  constructor(message = 'App is offline') {
    super(message);
    this.name = 'OfflineError';
    this.isOfflineError = true;
    this.isOffline = true;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
    this.isNetworkError = true;
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
    this.isTimeoutError = true;
  }
}

// ============================================
// QUEUE MANAGEMENT
// ============================================
const requestQueue = [];
const MAX_QUEUE_SIZE = 100;
const QUEUE_STORAGE_KEY = 'smart_request_queue';

async function loadQueueFromStorage() {
  try {
    const stored = await localforage.getItem(QUEUE_STORAGE_KEY);
    if (stored && Array.isArray(stored)) {
      requestQueue.push(...stored);
      // console.log(`📦 [QUEUE] Loaded ${stored.length} items`);
    }
  } catch (error) {
    console.error('❌ [QUEUE] Load failed:', error);
  }
}

async function saveQueueToStorage() {
  try {
    await localforage.setItem(QUEUE_STORAGE_KEY, requestQueue);
  } catch (error) {
    console.error('❌ [QUEUE] Save failed:', error);
  }
}

function addToQueue(requestInfo) {
  if (requestQueue.length >= MAX_QUEUE_SIZE) {
    console.warn('⚠️ [QUEUE] Full, removing oldest');
    requestQueue.shift();
  }
  
  requestQueue.push({
    ...requestInfo,
    timestamp: Date.now(),
    retries: 0
  });
  
  saveQueueToStorage();
  console.log(`📥 [QUEUE] Added: ${requestInfo.operationName} (Total: ${requestQueue.length})`);
}

export function getQueueSize() {
  return requestQueue.length;
}

export async function processQueuedRequests() {
  if (requestQueue.length === 0) {
    return { succeeded: 0, failed: 0 };
  }

  console.log(`🔄 [QUEUE] Processing ${requestQueue.length} requests...`);
  
  let succeeded = 0;
  let failed = 0;
  
  const itemsToProcess = [...requestQueue];
  requestQueue.length = 0;
  
  for (const item of itemsToProcess) {
    try {
      console.log(`📤 [QUEUE] Processing: ${item.operationName}`);
      await item.fn(...item.args);
      succeeded++;
    } catch (error) {
      console.error(`❌ [QUEUE] Failed: ${item.operationName}`, error);
      
      if (item.retries < 3) {
        item.retries++;
        requestQueue.push(item);
      } else {
        failed++;
      }
    }
  }
  
  await saveQueueToStorage();
  console.log(`✅ [QUEUE] Complete: ${succeeded} OK, ${failed} failed`);
  
  return { succeeded, failed };
}

export async function clearQueue() {
  requestQueue.length = 0;
  await localforage.removeItem(QUEUE_STORAGE_KEY);
  console.log('🗑️ [QUEUE] Cleared');
}

// Load queue on module load
loadQueueFromStorage();

// ============================================
// 🔥 SMART REQUEST WRAPPER - HARD BLOCK WHEN OFFLINE
// ============================================
export function withSmartRequest(fn, options = {}) {
  const {
    operationName = 'Unknown Operation',
    enableQueue = false,
    enableRetry = true,
    maxRetries = 2,
    retryDelay = 1000,
    silent = false,
    timeout = 30000
  } = options;

  return async function smartRequestWrapper(...args) {
    // 🛑 STEP 1: CHECK OFFLINE STATUS FIRST (MOST IMPORTANT)
    const offlineStateData = getOfflineState();
    const { isOffline } = offlineStateData;
    
    // 🔍 DETAILED LOGGING - See exactly what's happening
    // console.log(`🔍 [${operationName}] ========== API CALL ATTEMPT ==========`);
    // console.log(`🔍 [${operationName}] Offline State:`, offlineStateData);
    // console.log(`🔍 [${operationName}] Navigator Online:`, navigator.onLine);
    // console.log(`🔍 [${operationName}] Time:`, new Date().toLocaleTimeString());
    
    if (isOffline) {
      const error = new OfflineError(`${operationName} blocked - app is offline`);
      
      console.warn(`🚫 [${operationName}] ❌❌❌ BLOCKED ❌❌❌`);
      console.warn(`🚫 [${operationName}] Reason: isOffline = ${isOffline}`);
      console.warn(`🚫 [${operationName}] Throwing OfflineError`);
      console.log(`🔍 [${operationName}] ==========================================`);
      
      if (!silent) {
        console.warn(`🚫 [${operationName}] BLOCKED - App is offline`);
      }
      
      // Queue if enabled
      if (enableQueue) {
        addToQueue({ fn, args, operationName });
        if (!silent) {
          enqueueSnackbar(`${operationName} queued for sync`, {
            variant: 'info',
            autoHideDuration: 3000
          });
        }
      } else if (!silent) {
        enqueueSnackbar(`${operationName} failed - app is offline`, {
          variant: 'error',
          autoHideDuration: 3000
        });
      }
      
      throw error;
    }

    // 🌐 STEP 2: EXECUTE WITH RETRY LOGIC (only if online)
    // console.log(`✅ [${operationName}] NOT BLOCKED - Proceeding with API call`);
    // console.log(`🔍 [${operationName}] ==========================================`);
    
    let lastError = null;
    const attempts = enableRetry ? maxRetries + 1 : 1;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        if (!silent) {
          // console.log(`🌐 [${operationName}] Attempt ${attempt}/${attempts}`);
        }
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new TimeoutError()), timeout);
        });

        // Race between request and timeout
        const result = await Promise.race([
          fn(...args),
          timeoutPromise
        ]);

        if (attempt > 1 && !silent) {
          enqueueSnackbar(`${operationName} succeeded after retry`, {
            variant: 'success'
          });
        }

        return result;

      } catch (error) {
        lastError = error;
        
        // Don't retry on these errors
        if (
          error instanceof OfflineError ||
          error?.isOfflineError ||
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 404 ||
          !enableRetry ||
          attempt === attempts
        ) {
          break;
        }

        // Wait before retry
        console.warn(`⚠️ [${operationName}] Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }

    // 🚫 STEP 3: ALL ATTEMPTS FAILED
    if (!silent) {
      console.error(`❌ [${operationName}] Failed after ${attempts} attempts`, lastError);
      
      if (lastError instanceof OfflineError || lastError?.isOfflineError) {
        // Already handled
      } else if (lastError?.code === 'ECONNABORTED' || lastError instanceof TimeoutError) {
        enqueueSnackbar(`${operationName} timeout`, {
          variant: 'error'
        });
      } else if (lastError?.message === 'Network Error' || lastError instanceof NetworkError) {
        enqueueSnackbar(`Network error - check connection`, {
          variant: 'error'
        });
      } else if (!lastError?.response) {
        enqueueSnackbar(`${operationName} failed - connection issue`, {
          variant: 'error'
        });
      }
    }

    throw lastError;
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function getOfflineStatus() {
  return getOfflineState().isOffline;
}