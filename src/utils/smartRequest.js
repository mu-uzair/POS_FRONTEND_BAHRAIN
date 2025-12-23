// // utils/smartRequest.js - Production-ready API wrapper with offline detection
// // Version: 1.0.0

// import { enqueueSnackbar } from 'notistack';

// // ============================================
// // CONFIGURATION
// // ============================================

// const CONFIG = {
//   REQUEST_TIMEOUT: 30000, // 30 seconds
//   RETRY_ATTEMPTS: 3,
//   RETRY_DELAY: 1000, // 1 second
//   LOG_LEVEL: import.meta.env.MODE === 'production' ? 'error' : 'debug',
//   SHOW_NOTIFICATIONS: true,
// };

// // ============================================
// // STATE MANAGEMENT
// // ============================================

// let offlineContextGetter = null;
// let isInitialized = false;
// let requestQueue = [];

// // ============================================
// // LOGGING UTILITY
// // ============================================

// const logger = {
//   debug: (...args) => {
//     if (CONFIG.LOG_LEVEL === 'debug') {
//       console.log('🔍 [SMART REQUEST]', ...args);
//     }
//   },
//   info: (...args) => {
//     console.log('ℹ️ [SMART REQUEST]', ...args);
//   },
//   warn: (...args) => {
//     console.warn('⚠️ [SMART REQUEST]', ...args);
//   },
//   error: (...args) => {
//     console.error('❌ [SMART REQUEST]', ...args);
//   },
// };

// // ============================================
// // CUSTOM ERRORS
// // ============================================

// export class OfflineError extends Error {
//   constructor(message = 'No internet connection available') {
//     super(message);
//     this.name = 'OfflineError';
//     this.isOffline = true;
//     this.timestamp = new Date().toISOString();
//   }
// }

// export class TimeoutError extends Error {
//   constructor(message = 'Request timeout') {
//     super(message);
//     this.name = 'TimeoutError';
//     this.isTimeout = true;
//     this.timestamp = new Date().toISOString();
//   }
// }

// export class NetworkError extends Error {
//   constructor(message = 'Network error occurred', originalError = null) {
//     super(message);
//     this.name = 'NetworkError';
//     this.isNetworkError = true;
//     this.originalError = originalError;
//     this.timestamp = new Date().toISOString();
//   }
// }

// // ============================================
// // INITIALIZATION
// // ============================================

// export const initializeSmartRequest = (getOfflineContext) => {
//   if (isInitialized) {
//     logger.warn('Already initialized. Skipping re-initialization.');
//     return;
//   }

//   if (typeof getOfflineContext !== 'function') {
//     throw new Error('getOfflineContext must be a function');
//   }

//   try {
//     const context = getOfflineContext();
//     if (
//       typeof context.isOfflineMode === 'undefined' ||
//       typeof context.actualOnlineStatus === 'undefined' ||
//       typeof context.hasInternetConnection === 'undefined'
//     ) {
//       throw new Error('Invalid offline context structure');
//     }
//   } catch (error) {
//     logger.error('Failed to validate offline context:', error);
//     throw new Error('Invalid offline context provider');
//   }

//   offlineContextGetter = getOfflineContext;
//   isInitialized = true;
//   logger.info('✅ Initialized successfully');
// };

// export const isSmartRequestInitialized = () => isInitialized;

// export const resetSmartRequest = () => {
//   offlineContextGetter = null;
//   isInitialized = false;
//   requestQueue = [];
//   logger.debug('Reset completed');
// };

// // ============================================
// // OFFLINE DETECTION
// // ============================================

// const getOfflineContext = () => {
//   if (!isInitialized || !offlineContextGetter) {
//     logger.warn('Not initialized, using fallback detection');
//     return {
//       isOfflineMode: !navigator.onLine,
//       actualOnlineStatus: navigator.onLine,
//       hasInternetConnection: navigator.onLine,
//       manualOfflineMode: false,
//     };
//   }

//   try {
//     return offlineContextGetter();
//   } catch (error) {
//     logger.error('Failed to get offline context:', error);
//     return {
//       isOfflineMode: !navigator.onLine,
//       actualOnlineStatus: navigator.onLine,
//       hasInternetConnection: navigator.onLine,
//       manualOfflineMode: false,
//     };
//   }
// };

// const isSystemOffline = () => {
//   const context = getOfflineContext();
//   const isOffline = context.isOfflineMode;

//   if (isOffline) {
//     logger.debug('System OFFLINE:', {
//       manualOfflineMode: context.manualOfflineMode,
//       actualOnlineStatus: context.actualOnlineStatus,
//       hasInternetConnection: context.hasInternetConnection,
//     });
//   }

//   return isOffline;
// };

// // ============================================
// // RETRY LOGIC
// // ============================================

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const isRetryableError = (error) => {
//   if (error.isOffline || error.isTimeout) return false;
//   if (error.response?.status >= 400 && error.response?.status < 500) return false;
//   return true;
// };

// const executeWithRetry = async (apiCall, options = {}) => {
//   const {
//     maxRetries = CONFIG.RETRY_ATTEMPTS,
//     retryDelay = CONFIG.RETRY_DELAY,
//     timeout = CONFIG.REQUEST_TIMEOUT,
//   } = options;

//   let lastError;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new TimeoutError()), timeout)
//       );

//       const result = await Promise.race([apiCall(), timeoutPromise]);

//       if (attempt > 1) {
//         logger.info(`Request succeeded on attempt ${attempt}`);
//       }

//       return result;
//     } catch (error) {
//       lastError = error;

//       if (!isRetryableError(error)) {
//         logger.debug(`Non-retryable error: ${error.name}`);
//         throw error;
//       }

//       if (attempt === maxRetries) {
//         logger.error(`All ${maxRetries} retry attempts failed`);
//         throw error;
//       }

//       logger.warn(
//         `Request failed (attempt ${attempt}/${maxRetries}). Retrying in ${retryDelay}ms...`
//       );

//       await sleep(retryDelay * attempt);
//     }
//   }

//   throw lastError;
// };

// // ============================================
// // NOTIFICATION MANAGEMENT
// // ============================================

// let lastNotificationTime = 0;
// const NOTIFICATION_THROTTLE = 3000;

// const showNotification = (message, variant = 'warning') => {
//   if (!CONFIG.SHOW_NOTIFICATIONS) return;

//   const now = Date.now();
//   if (now - lastNotificationTime < NOTIFICATION_THROTTLE) {
//     logger.debug('Notification throttled');
//     return;
//   }

//   lastNotificationTime = now;

//   try {
//     enqueueSnackbar(message, {
//       variant,
//       autoHideDuration: 3000,
//       preventDuplicate: true,
//     });
//   } catch (error) {
//     logger.error('Failed to show notification:', error);
//   }
// };

// // ============================================
// // CORE SMART REQUEST
// // ============================================

// export const smartRequest = async (apiCall, options = {}) => {
//   const {
//     skipOfflineCheck = false,
//     showOfflineMessage = true,
//     onOffline = null,
//     silent = false,
//     enableRetry = true,
//     maxRetries = CONFIG.RETRY_ATTEMPTS,
//     retryDelay = CONFIG.RETRY_DELAY,
//     timeout = CONFIG.REQUEST_TIMEOUT,
//     operationName = null,
//   } = options;

//   const opName = operationName || apiCall.name || 'API Request';

//   if (skipOfflineCheck) {
//     logger.debug(`Skipping offline check for: ${opName}`);
//     return apiCall();
//   }

//   if (isSystemOffline()) {
//     const error = new OfflineError();

//     if (showOfflineMessage && !silent) {
//       logger.warn(`Blocked (offline): ${opName}`);
//       showNotification('No internet connection. Please check your network.');
//     }

//     if (onOffline && typeof onOffline === 'function') {
//       try {
//         onOffline(error);
//       } catch (err) {
//         logger.error('Error in offline handler:', err);
//       }
//     }

//     throw error;
//   }

//   try {
//     logger.debug(`Executing: ${opName}`);

//     const result = enableRetry
//       ? await executeWithRetry(apiCall, { maxRetries, retryDelay, timeout })
//       : await apiCall();

//     logger.debug(`Success: ${opName}`);
//     return result;
//   } catch (error) {
//     if (error instanceof OfflineError || error instanceof TimeoutError) {
//       throw error;
//     }

//     if (!error.response && (error.message === 'Network Error' || error.code === 'ERR_NETWORK')) {
//       const networkError = new NetworkError(
//         'Network error occurred. Please check your connection.',
//         error
//       );

//       if (!silent) {
//         logger.error(`Network error: ${opName}`, error.message);
//         showNotification('Network error. Please check your connection.', 'error');
//       }

//       throw networkError;
//     }

//     logger.error(`Failed: ${opName}`, error);
//     throw error;
//   }
// };

// // ============================================
// // BATCH REQUESTS
// // ============================================

// export const smartBatchRequest = async (apiCalls, options = {}) => {
//   if (!Array.isArray(apiCalls) || apiCalls.length === 0) {
//     throw new Error('apiCalls must be a non-empty array');
//   }

//   if (isSystemOffline()) {
//     throw new OfflineError('Cannot execute batch requests while offline');
//   }

//   logger.debug(`Executing batch request with ${apiCalls.length} calls`);

//   const results = await Promise.allSettled(
//     apiCalls.map((call, index) =>
//       smartRequest(call, {
//         ...options,
//         operationName: `Batch Request ${index + 1}`,
//       })
//     )
//   );

//   const successCount = results.filter((r) => r.status === 'fulfilled').length;
//   logger.debug(`Batch request completed: ${successCount}/${apiCalls.length} successful`);

//   return results;
// };

// // ============================================
// // HIGHER-ORDER FUNCTION
// // ============================================

// export const withSmartRequest = (apiFunc, defaultOptions = {}) => {
//   if (typeof apiFunc !== 'function') {
//     throw new Error('apiFunc must be a function');
//   }

//   return (...args) => {
//     const funcName = apiFunc.name || 'anonymous';
//     const wrappedCall = () => apiFunc(...args);
    
//     // Don't try to assign name - it's read-only in strict mode
//     // Instead, pass the name through options

//     return smartRequest(wrappedCall, {
//       ...defaultOptions,
//       operationName: funcName,
//     });
//   };
// };

// // ============================================
// // REQUEST QUEUE
// // ============================================

// export const queueRequest = (apiCall, metadata = {}) => {
//   const queuedRequest = {
//     id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//     apiCall,
//     metadata,
//     timestamp: new Date().toISOString(),
//   };

//   requestQueue.push(queuedRequest);
//   logger.info(`Request queued: ${queuedRequest.id}`);

//   return queuedRequest.id;
// };

// export const processQueuedRequests = async () => {
//   if (isSystemOffline()) {
//     logger.warn('Cannot process queue while offline');
//     return { processed: 0, succeeded: 0, failed: 0 };
//   }

//   if (requestQueue.length === 0) {
//     logger.debug('No queued requests to process');
//     return { processed: 0, succeeded: 0, failed: 0 };
//   }

//   logger.info(`Processing ${requestQueue.length} queued requests`);

//   const results = {
//     processed: requestQueue.length,
//     succeeded: 0,
//     failed: 0,
//     errors: [],
//   };

//   const queueCopy = [...requestQueue];
//   requestQueue = [];

//   for (const queuedReq of queueCopy) {
//     try {
//       await smartRequest(queuedReq.apiCall, { silent: true });
//       results.succeeded++;
//       logger.debug(`Queued request succeeded: ${queuedReq.id}`);
//     } catch (error) {
//       results.failed++;
//       results.errors.push({
//         id: queuedReq.id,
//         error: error.message,
//       });
//       logger.error(`Queued request failed: ${queuedReq.id}`, error);

//       if (error.isNetworkError) {
//         requestQueue.push(queuedReq);
//       }
//     }
//   }

//   logger.info('Queue processing complete:', results);
//   return results;
// };

// export const getQueueSize = () => requestQueue.length;

// export const clearQueue = () => {
//   const size = requestQueue.length;
//   requestQueue = [];
//   logger.info(`Queue cleared: ${size} requests removed`);
// };

// export default smartRequest;


// // utils/smartRequest.js - COMPLETE FIX with interceptor support
// import localforage from 'localforage';
// import { enqueueSnackbar } from 'notistack';

// // ============================================
// // CUSTOM ERROR TYPES
// // ============================================
// export class OfflineError extends Error {
//   constructor(message = 'System is in offline mode') {
//     super(message);
//     this.name = 'OfflineError';
//     this.isOfflineError = true;
//   }
// }

// export class NetworkError extends Error {
//   constructor(message = 'Network connection failed') {
//     super(message);
//     this.name = 'NetworkError';
//     this.isNetworkError = true;
//   }
// }

// export class TimeoutError extends Error {
//   constructor(message = 'Request timeout') {
//     super(message);
//     this.name = 'TimeoutError';
//     this.isTimeoutError = true;
//   }
// }

// // ============================================
// // STATE MANAGEMENT
// // ============================================
// let isInitialized = false;
// let getOfflineContext = null;

// const requestQueue = [];
// const MAX_QUEUE_SIZE = 100;
// const QUEUE_STORAGE_KEY = 'smart_request_queue';

// // ============================================
// // INITIALIZATION
// // ============================================
// export function initializeSmartRequest(offlineContextGetter) {
//   if (!offlineContextGetter || typeof offlineContextGetter !== 'function') {
//     throw new Error('offlineContextGetter must be a function');
//   }
  
//   getOfflineContext = offlineContextGetter;
//   isInitialized = true;
  
//   console.log('✅ [SMART REQUEST] Initialized');
  
//   // Load persisted queue
//   loadQueueFromStorage();
// }

// export function isSmartRequestInitialized() {
//   return isInitialized;
// }

// // ✅ NEW: Export this for Axios interceptor
// export function isSystemOffline() {
//   if (!isInitialized || !getOfflineContext) {
//     console.warn('⚠️ [SMART REQUEST] Not initialized, falling back to navigator.onLine');
//     return !navigator.onLine;
//   }

//   try {
//     const context = getOfflineContext();
//     const isOffline = context.isOfflineMode || 
//                      !context.hasInternetConnection || 
//                      !context.actualOnlineStatus;
    
//     // 🕵️ DEBUG LOG
//     console.log('🕵️ [OFFLINE CHECK]', { 
//       isOffline, 
//       contextSource: 'Context',
//       context: {
//         isOfflineMode: context.isOfflineMode,
//         hasInternetConnection: context.hasInternetConnection,
//         actualOnlineStatus: context.actualOnlineStatus
//       }
//     });
    
//     return isOffline;
//   } catch (error) {
//     console.error('❌ [SMART REQUEST] Error checking offline status:', error);
//     return !navigator.onLine;
//   }
// }

// // ============================================
// // QUEUE MANAGEMENT
// // ============================================
// async function loadQueueFromStorage() {
//   try {
//     const stored = await localforage.getItem(QUEUE_STORAGE_KEY);
//     if (stored && Array.isArray(stored)) {
//       requestQueue.push(...stored);
//       console.log(`📦 [QUEUE] Loaded ${stored.length} items from storage`);
//     }
//   } catch (error) {
//     console.error('❌ [QUEUE] Failed to load from storage:', error);
//   }
// }

// async function saveQueueToStorage() {
//   try {
//     await localforage.setItem(QUEUE_STORAGE_KEY, requestQueue);
//   } catch (error) {
//     console.error('❌ [QUEUE] Failed to save to storage:', error);
//   }
// }

// function addToQueue(requestInfo) {
//   if (requestQueue.length >= MAX_QUEUE_SIZE) {
//     console.warn('⚠️ [QUEUE] Queue full, removing oldest item');
//     requestQueue.shift();
//   }
  
//   requestQueue.push({
//     ...requestInfo,
//     timestamp: Date.now(),
//     retries: 0
//   });
  
//   saveQueueToStorage();
//   console.log(`📥 [QUEUE] Added: ${requestInfo.operationName} (${requestQueue.length} items)`);
// }

// export function getQueueSize() {
//   return requestQueue.length;
// }

// export async function processQueuedRequests() {
//   if (requestQueue.length === 0) {
//     return { succeeded: 0, failed: 0 };
//   }

//   console.log(`🔄 [QUEUE] Processing ${requestQueue.length} queued requests...`);
  
//   let succeeded = 0;
//   let failed = 0;
  
//   const itemsToProcess = [...requestQueue];
//   requestQueue.length = 0;
  
//   for (const item of itemsToProcess) {
//     try {
//       console.log(`📤 [QUEUE] Processing: ${item.operationName}`);
//       await item.fn(...item.args);
//       succeeded++;
//     } catch (error) {
//       console.error(`❌ [QUEUE] Failed: ${item.operationName}`, error);
      
//       if (item.retries < 3) {
//         item.retries++;
//         requestQueue.push(item);
//       } else {
//         failed++;
//       }
//     }
//   }
  
//   await saveQueueToStorage();
//   console.log(`✅ [QUEUE] Processed: ${succeeded} succeeded, ${failed} failed`);
  
//   return { succeeded, failed };
// }

// export async function clearQueue() {
//   requestQueue.length = 0;
//   await localforage.removeItem(QUEUE_STORAGE_KEY);
//   console.log('🗑️ [QUEUE] Cleared');
// }

// // ============================================
// // SMART REQUEST WRAPPER
// // ============================================
// export function withSmartRequest(fn, options = {}) {
//   const {
//     operationName = 'Unknown Operation',
//     enableQueue = false,
//     enableRetry = true,
//     maxRetries = 2,
//     retryDelay = 1000,
//     silent = false,
//     timeout = 30000
//   } = options;

//   return async function smartRequestWrapper(...args) {
//     // 🛑 CRITICAL: Check offline status FIRST
//     if (isSystemOffline()) {
//       const error = new OfflineError(`${operationName} unavailable in offline mode`);
      
//       if (!silent) {
//         console.warn(`🔴 [${operationName}] Blocked - System is offline`);
//       }
      
//       // Queue if enabled
//       if (enableQueue) {
//         addToQueue({ fn, args, operationName });
//         if (!silent) {
//           enqueueSnackbar(`${operationName} queued for when online`, {
//             variant: 'info',
//             autoHideDuration: 3000
//           });
//         }
//       }
      
//       throw error;
//     }

//     // Execute with retry logic
//     let lastError = null;
//     const attempts = enableRetry ? maxRetries + 1 : 1;

//     for (let attempt = 1; attempt <= attempts; attempt++) {
//       try {
//         console.log(`🌐 [${operationName}] Attempt ${attempt}/${attempts}`);
        
//         // Create timeout promise
//         const timeoutPromise = new Promise((_, reject) => {
//           setTimeout(() => reject(new TimeoutError()), timeout);
//         });

//         // Race between request and timeout
//         const result = await Promise.race([
//           fn(...args),
//           timeoutPromise
//         ]);

//         if (attempt > 1 && !silent) {
//           enqueueSnackbar(`${operationName} succeeded after retry`, {
//             variant: 'success'
//           });
//         }

//         return result;

//       } catch (error) {
//         lastError = error;
        
//         // Don't retry on these errors
//         if (
//           error instanceof OfflineError ||
//           error?.response?.status === 401 ||
//           error?.response?.status === 403 ||
//           error?.response?.status === 404 ||
//           !enableRetry ||
//           attempt === attempts
//         ) {
//           break;
//         }

//         // Wait before retry
//         console.warn(`⚠️ [${operationName}] Attempt ${attempt} failed, retrying...`);
//         await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
//       }
//     }

//     // All attempts failed
//     if (!silent) {
//       console.error(`❌ [${operationName}] Failed after ${attempts} attempts`, lastError);
      
//       if (lastError instanceof OfflineError) {
//         // Already handled
//       } else if (lastError?.code === 'ECONNABORTED' || lastError instanceof TimeoutError) {
//         enqueueSnackbar(`${operationName} timeout - please try again`, {
//           variant: 'error'
//         });
//       } else if (lastError?.message === 'Network Error' || lastError instanceof NetworkError) {
//         enqueueSnackbar(`Network error - check your connection`, {
//           variant: 'error'
//         });
//       } else if (!lastError?.response) {
//         enqueueSnackbar(`${operationName} failed - connection issue`, {
//           variant: 'error'
//         });
//       }
//     }

//     throw lastError;
//   };
// }

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================
// export function getOfflineStatus() {
//   return isSystemOffline();
// }

// export function resetSmartRequest() {
//   isInitialized = false;
//   getOfflineContext = null;
//   requestQueue.length = 0;
//   console.log('🔄 [SMART REQUEST] Reset');
// }


// // utils/smartRequest.js - COMPLETE FIX with robust offline detection
// import localforage from 'localforage';
// import { enqueueSnackbar } from 'notistack';

// // ============================================
// // CUSTOM ERROR TYPES
// // ============================================
// export class OfflineError extends Error {
//   constructor(message = 'System is in offline mode') {
//     super(message);
//     this.name = 'OfflineError';
//     this.isOfflineError = true;
//     this.isOffline = true;
//   }
// }

// export class NetworkError extends Error {
//   constructor(message = 'Network connection failed') {
//     super(message);
//     this.name = 'NetworkError';
//     this.isNetworkError = true;
//   }
// }

// export class TimeoutError extends Error {
//   constructor(message = 'Request timeout') {
//     super(message);
//     this.name = 'TimeoutError';
//     this.isTimeoutError = true;
//   }
// }

// // ============================================
// // STATE MANAGEMENT
// // ============================================
// let isInitialized = false;
// let getOfflineContext = null;

// const requestQueue = [];
// const MAX_QUEUE_SIZE = 100;
// const QUEUE_STORAGE_KEY = 'smart_request_queue';

// // ============================================
// // INITIALIZATION
// // ============================================
// export function initializeSmartRequest(offlineContextGetter) {
//   if (!offlineContextGetter || typeof offlineContextGetter !== 'function') {
//     throw new Error('offlineContextGetter must be a function');
//   }
  
//   getOfflineContext = offlineContextGetter;
//   isInitialized = true;
  
//   console.log('✅ [SMART REQUEST] Initialized with offline context');
  
//   // Load persisted queue
//   loadQueueFromStorage();
// }

// export function isSmartRequestInitialized() {
//   return isInitialized;
// }

// // ✅ CRITICAL: Export for Axios interceptor
// export function isSystemOffline() {
//   if (!isInitialized || !getOfflineContext) {
//     console.warn('⚠️ [SMART REQUEST] Not initialized, using navigator.onLine');
//     return !navigator.onLine;
//   }

//   try {
//     const context = getOfflineContext();
    
//     // ✅ System is offline if ANY of these are true:
//     // 1. Manual offline mode enabled
//     // 2. Network interface is down
//     // 3. No internet connectivity
//     const isOffline = context.isOfflineMode || 
//                      !context.hasInternetConnection || 
//                      !context.actualOnlineStatus;
    
//     if (import.meta.env.MODE === 'development') {
//       console.log('🔍 [OFFLINE CHECK]', { 
//         isOffline,
//         manual: context.manualOfflineMode,
//         interface: context.actualOnlineStatus,
//         internet: context.hasInternetConnection
//       });
//     }
    
//     return isOffline;
//   } catch (error) {
//     console.error('❌ [SMART REQUEST] Error checking status:', error);
//     return !navigator.onLine;
//   }
// }

// // ============================================
// // QUEUE MANAGEMENT
// // ============================================
// async function loadQueueFromStorage() {
//   try {
//     const stored = await localforage.getItem(QUEUE_STORAGE_KEY);
//     if (stored && Array.isArray(stored)) {
//       requestQueue.push(...stored);
//       console.log(`📦 [QUEUE] Loaded ${stored.length} items`);
//     }
//   } catch (error) {
//     console.error('❌ [QUEUE] Load failed:', error);
//   }
// }

// async function saveQueueToStorage() {
//   try {
//     await localforage.setItem(QUEUE_STORAGE_KEY, requestQueue);
//   } catch (error) {
//     console.error('❌ [QUEUE] Save failed:', error);
//   }
// }

// function addToQueue(requestInfo) {
//   if (requestQueue.length >= MAX_QUEUE_SIZE) {
//     console.warn('⚠️ [QUEUE] Full, removing oldest');
//     requestQueue.shift();
//   }
  
//   requestQueue.push({
//     ...requestInfo,
//     timestamp: Date.now(),
//     retries: 0
//   });
  
//   saveQueueToStorage();
//   console.log(`📥 [QUEUE] Added: ${requestInfo.operationName} (Total: ${requestQueue.length})`);
// }

// export function getQueueSize() {
//   return requestQueue.length;
// }

// export async function processQueuedRequests() {
//   if (requestQueue.length === 0) {
//     return { succeeded: 0, failed: 0 };
//   }

//   console.log(`🔄 [QUEUE] Processing ${requestQueue.length} requests...`);
  
//   let succeeded = 0;
//   let failed = 0;
  
//   const itemsToProcess = [...requestQueue];
//   requestQueue.length = 0;
  
//   for (const item of itemsToProcess) {
//     try {
//       console.log(`📤 [QUEUE] Processing: ${item.operationName}`);
//       await item.fn(...item.args);
//       succeeded++;
//     } catch (error) {
//       console.error(`❌ [QUEUE] Failed: ${item.operationName}`, error);
      
//       if (item.retries < 3) {
//         item.retries++;
//         requestQueue.push(item);
//       } else {
//         failed++;
//       }
//     }
//   }
  
//   await saveQueueToStorage();
//   console.log(`✅ [QUEUE] Complete: ${succeeded} OK, ${failed} failed`);
  
//   return { succeeded, failed };
// }

// export async function clearQueue() {
//   requestQueue.length = 0;
//   await localforage.removeItem(QUEUE_STORAGE_KEY);
//   console.log('🗑️ [QUEUE] Cleared');
// }

// // ============================================
// // SMART REQUEST WRAPPER
// // ============================================
// export function withSmartRequest(fn, options = {}) {
//   const {
//     operationName = 'Unknown Operation',
//     enableQueue = false,
//     enableRetry = true,
//     maxRetries = 2,
//     retryDelay = 1000,
//     silent = false,
//     timeout = 30000
//   } = options;

//   return async function smartRequestWrapper(...args) {
//     // 🛑 STEP 1: Check offline status FIRST
//     const systemOffline = isSystemOffline();
    
//     if (systemOffline) {
//       const error = new OfflineError(`${operationName} blocked - system offline`);
      
//       if (!silent) {
//         console.warn(`🔴 [${operationName}] BLOCKED - System is offline`);
//       }
      
//       // Queue if enabled
//       if (enableQueue) {
//         addToQueue({ fn, args, operationName });
//         if (!silent) {
//           enqueueSnackbar(`${operationName} queued for sync`, {
//             variant: 'info',
//             autoHideDuration: 3000
//           });
//         }
//       }
      
//       throw error;
//     }

//     // 🌐 STEP 2: Execute with retry logic
//     let lastError = null;
//     const attempts = enableRetry ? maxRetries + 1 : 1;

//     for (let attempt = 1; attempt <= attempts; attempt++) {
//       try {
//         if (!silent) {
//           console.log(`🌐 [${operationName}] Attempt ${attempt}/${attempts}`);
//         }
        
//         // Create timeout promise
//         const timeoutPromise = new Promise((_, reject) => {
//           setTimeout(() => reject(new TimeoutError()), timeout);
//         });

//         // Race between request and timeout
//         const result = await Promise.race([
//           fn(...args),
//           timeoutPromise
//         ]);

//         if (attempt > 1 && !silent) {
//           enqueueSnackbar(`${operationName} succeeded after retry`, {
//             variant: 'success'
//           });
//         }

//         return result;

//       } catch (error) {
//         lastError = error;
        
//         // Don't retry on these errors
//         if (
//           error instanceof OfflineError ||
//           error?.isOfflineError ||
//           error?.response?.status === 401 ||
//           error?.response?.status === 403 ||
//           error?.response?.status === 404 ||
//           !enableRetry ||
//           attempt === attempts
//         ) {
//           break;
//         }

//         // Wait before retry
//         console.warn(`⚠️ [${operationName}] Attempt ${attempt} failed, retrying...`);
//         await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
//       }
//     }

//     // 🚫 STEP 3: All attempts failed
//     if (!silent) {
//       console.error(`❌ [${operationName}] Failed after ${attempts} attempts`, lastError);
      
//       if (lastError instanceof OfflineError || lastError?.isOfflineError) {
//         // Already handled
//       } else if (lastError?.code === 'ECONNABORTED' || lastError instanceof TimeoutError) {
//         enqueueSnackbar(`${operationName} timeout`, {
//           variant: 'error'
//         });
//       } else if (lastError?.message === 'Network Error' || lastError instanceof NetworkError) {
//         enqueueSnackbar(`Network error - check connection`, {
//           variant: 'error'
//         });
//       } else if (!lastError?.response) {
//         enqueueSnackbar(`${operationName} failed - connection issue`, {
//           variant: 'error'
//         });
//       }
//     }

//     throw lastError;
//   };
// }

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================
// export function getOfflineStatus() {
//   return isSystemOffline();
// }

// export function resetSmartRequest() {
//   isInitialized = false;
//   getOfflineContext = null;
//   requestQueue.length = 0;
//   console.log('🔄 [SMART REQUEST] Reset');
// }






// // utils/smartRequest.js - HARD BLOCK WHEN OFFLINE
// import localforage from 'localforage';
// import { enqueueSnackbar } from 'notistack';
// import { getOfflineState } from './offlineState'; // 👈 NEW - SINGLE SOURCE OF TRUTH

// // ============================================
// // CUSTOM ERROR TYPES
// // ============================================
// export class OfflineError extends Error {
//   constructor(message = 'App is offline') {
//     super(message);
//     this.name = 'OfflineError';
//     this.isOfflineError = true;
//     this.isOffline = true;
//   }
// }

// export class NetworkError extends Error {
//   constructor(message = 'Network connection failed') {
//     super(message);
//     this.name = 'NetworkError';
//     this.isNetworkError = true;
//   }
// }

// export class TimeoutError extends Error {
//   constructor(message = 'Request timeout') {
//     super(message);
//     this.name = 'TimeoutError';
//     this.isTimeoutError = true;
//   }
// }

// // ============================================
// // QUEUE MANAGEMENT
// // ============================================
// const requestQueue = [];
// const MAX_QUEUE_SIZE = 100;
// const QUEUE_STORAGE_KEY = 'smart_request_queue';

// async function loadQueueFromStorage() {
//   try {
//     const stored = await localforage.getItem(QUEUE_STORAGE_KEY);
//     if (stored && Array.isArray(stored)) {
//       requestQueue.push(...stored);
//       console.log(`📦 [QUEUE] Loaded ${stored.length} items`);
//     }
//   } catch (error) {
//     console.error('❌ [QUEUE] Load failed:', error);
//   }
// }

// async function saveQueueToStorage() {
//   try {
//     await localforage.setItem(QUEUE_STORAGE_KEY, requestQueue);
//   } catch (error) {
//     console.error('❌ [QUEUE] Save failed:', error);
//   }
// }

// function addToQueue(requestInfo) {
//   if (requestQueue.length >= MAX_QUEUE_SIZE) {
//     console.warn('⚠️ [QUEUE] Full, removing oldest');
//     requestQueue.shift();
//   }
  
//   requestQueue.push({
//     ...requestInfo,
//     timestamp: Date.now(),
//     retries: 0
//   });
  
//   saveQueueToStorage();
//   console.log(`📥 [QUEUE] Added: ${requestInfo.operationName} (Total: ${requestQueue.length})`);
// }

// export function getQueueSize() {
//   return requestQueue.length;
// }

// export async function processQueuedRequests() {
//   if (requestQueue.length === 0) {
//     return { succeeded: 0, failed: 0 };
//   }

//   console.log(`🔄 [QUEUE] Processing ${requestQueue.length} requests...`);
  
//   let succeeded = 0;
//   let failed = 0;
  
//   const itemsToProcess = [...requestQueue];
//   requestQueue.length = 0;
  
//   for (const item of itemsToProcess) {
//     try {
//       console.log(`📤 [QUEUE] Processing: ${item.operationName}`);
//       await item.fn(...item.args);
//       succeeded++;
//     } catch (error) {
//       console.error(`❌ [QUEUE] Failed: ${item.operationName}`, error);
      
//       if (item.retries < 3) {
//         item.retries++;
//         requestQueue.push(item);
//       } else {
//         failed++;
//       }
//     }
//   }
  
//   await saveQueueToStorage();
//   console.log(`✅ [QUEUE] Complete: ${succeeded} OK, ${failed} failed`);
  
//   return { succeeded, failed };
// }

// export async function clearQueue() {
//   requestQueue.length = 0;
//   await localforage.removeItem(QUEUE_STORAGE_KEY);
//   console.log('🗑️ [QUEUE] Cleared');
// }

// // Load queue on module load
// loadQueueFromStorage();

// // ============================================
// // 🔥 SMART REQUEST WRAPPER - HARD BLOCK WHEN OFFLINE
// // ============================================
// export function withSmartRequest(fn, options = {}) {
//   const {
//     operationName = 'Unknown Operation',
//     enableQueue = false,
//     enableRetry = true,
//     maxRetries = 2,
//     retryDelay = 1000,
//     silent = false,
//     timeout = 30000
//   } = options;

//   return async function smartRequestWrapper(...args) {
//     // 🛑 STEP 1: CHECK OFFLINE STATUS FIRST (MOST IMPORTANT)
//     const { isOffline } = getOfflineState();
    
//     if (isOffline) {
//       const error = new OfflineError(`${operationName} blocked - app is offline`);
      
//       if (!silent) {
//         console.warn(`🚫 [${operationName}] BLOCKED - App is offline`);
//       }
      
//       // Queue if enabled
//       if (enableQueue) {
//         addToQueue({ fn, args, operationName });
//         if (!silent) {
//           enqueueSnackbar(`${operationName} queued for sync`, {
//             variant: 'info',
//             autoHideDuration: 3000
//           });
//         }
//       } else if (!silent) {
//         enqueueSnackbar(`${operationName} failed - app is offline`, {
//           variant: 'error',
//           autoHideDuration: 3000
//         });
//       }
      
//       throw error;
//     }

//     // 🌐 STEP 2: EXECUTE WITH RETRY LOGIC (only if online)
//     let lastError = null;
//     const attempts = enableRetry ? maxRetries + 1 : 1;

//     for (let attempt = 1; attempt <= attempts; attempt++) {
//       try {
//         if (!silent) {
//           console.log(`🌐 [${operationName}] Attempt ${attempt}/${attempts}`);
//         }
        
//         // Create timeout promise
//         const timeoutPromise = new Promise((_, reject) => {
//           setTimeout(() => reject(new TimeoutError()), timeout);
//         });

//         // Race between request and timeout
//         const result = await Promise.race([
//           fn(...args),
//           timeoutPromise
//         ]);

//         if (attempt > 1 && !silent) {
//           enqueueSnackbar(`${operationName} succeeded after retry`, {
//             variant: 'success'
//           });
//         }

//         return result;

//       } catch (error) {
//         lastError = error;
        
//         // Don't retry on these errors
//         if (
//           error instanceof OfflineError ||
//           error?.isOfflineError ||
//           error?.response?.status === 401 ||
//           error?.response?.status === 403 ||
//           error?.response?.status === 404 ||
//           !enableRetry ||
//           attempt === attempts
//         ) {
//           break;
//         }

//         // Wait before retry
//         console.warn(`⚠️ [${operationName}] Attempt ${attempt} failed, retrying...`);
//         await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
//       }
//     }

//     // 🚫 STEP 3: ALL ATTEMPTS FAILED
//     if (!silent) {
//       console.error(`❌ [${operationName}] Failed after ${attempts} attempts`, lastError);
      
//       if (lastError instanceof OfflineError || lastError?.isOfflineError) {
//         // Already handled
//       } else if (lastError?.code === 'ECONNABORTED' || lastError instanceof TimeoutError) {
//         enqueueSnackbar(`${operationName} timeout`, {
//           variant: 'error'
//         });
//       } else if (lastError?.message === 'Network Error' || lastError instanceof NetworkError) {
//         enqueueSnackbar(`Network error - check connection`, {
//           variant: 'error'
//         });
//       } else if (!lastError?.response) {
//         enqueueSnackbar(`${operationName} failed - connection issue`, {
//           variant: 'error'
//         });
//       }
//     }

//     throw lastError;
//   };
// }

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================
// export function getOfflineStatus() {
//   return getOfflineState().isOffline;
// }


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
      console.log(`📦 [QUEUE] Loaded ${stored.length} items`);
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
    console.log(`🔍 [${operationName}] ========== API CALL ATTEMPT ==========`);
    console.log(`🔍 [${operationName}] Offline State:`, offlineStateData);
    console.log(`🔍 [${operationName}] Navigator Online:`, navigator.onLine);
    console.log(`🔍 [${operationName}] Time:`, new Date().toLocaleTimeString());
    
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
    console.log(`✅ [${operationName}] NOT BLOCKED - Proceeding with API call`);
    console.log(`🔍 [${operationName}] ==========================================`);
    
    let lastError = null;
    const attempts = enableRetry ? maxRetries + 1 : 1;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        if (!silent) {
          console.log(`🌐 [${operationName}] Attempt ${attempt}/${attempts}`);
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