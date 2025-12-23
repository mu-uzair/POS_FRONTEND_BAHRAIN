// // src/utils/offlineState.js - Single Source of Truth
// // ============================================
// // GLOBAL OFFLINE STATE (10 lines total)
// // ============================================

// let offlineState = {
//   isOffline: false,
// };

// export const setOfflineState = (state) => {
//   offlineState = state;
//   console.log('🔄 [OFFLINE STATE] Updated:', state);
// };

// export const getOfflineState = () => offlineState;

// src/utils/offlineState.js - Single Source of Truth
// ============================================
// GLOBAL OFFLINE STATE (10 lines total)
// ============================================

let offlineState = {
  isOffline: false,
};

export const setOfflineState = (state) => {
  const changed = offlineState.isOffline !== state.isOffline;
  offlineState = state;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 [OFFLINE STATE] UPDATED');
  console.log('   isOffline:', state.isOffline);
  console.log('   Changed:', changed ? 'YES ⚠️' : 'No');
  console.log('   Time:', new Date().toLocaleTimeString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

export const getOfflineState = () => offlineState;