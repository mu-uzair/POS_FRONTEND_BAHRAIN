// import {
//   STORAGE_KEYS,
//   load,
//   save,
//   addToPendingSync
// } from './offlineStore';

// // ============================================
// // STORAGE KEY FOR TABLES
// // ============================================
// const TABLES_CACHE_KEY = 'offline:tables';

// // ============================================
// // FETCH AND CACHE TABLES
// // ============================================
// export async function fetchAndCacheTables(tablesFromAPI) {
//   try {
//     console.log('💾 Caching tables:', tablesFromAPI?.length || 0);
    
//     if (!tablesFromAPI || tablesFromAPI.length === 0) {
//       console.warn('⚠️ No tables to cache');
//       return await getCachedTables();
//     }
    
//     // Save to cache
//     await save(TABLES_CACHE_KEY, tablesFromAPI);
//     console.log('✅ Tables cached successfully');
    
//     return tablesFromAPI;
//   } catch (err) {
//     console.error('❌ Failed to cache tables:', err);
//     return await getCachedTables();
//   }
// }

// // ============================================
// // GET CACHED TABLES
// // ============================================
// export async function getCachedTables() {
//   try {
//     const tables = (await load(TABLES_CACHE_KEY)) || [];
//     console.log(`📦 Retrieved ${tables.length} tables from cache`);
//     return tables;
//   } catch (err) {
//     console.error('❌ Failed to get cached tables:', err);
//     return [];
//   }
// }

// // ============================================
// // UPDATE TABLE STATUS IN CACHE
// // ============================================
// export async function updateTableStatusInCache(tableId, newStatus, orderId = null) {
//   try {
//     console.log(`🔄 Updating table ${tableId} status to: ${newStatus}`);
    
//     const tables = (await load(TABLES_CACHE_KEY)) || [];
    
//     let found = false;
//     const updatedTables = tables.map(table => {
//       // Match by _id or tableId
//       const matches = 
//         table._id === tableId ||
//         table.tableId === tableId ||
//         String(table._id) === String(tableId) ||
//         String(table.tableId) === String(tableId);
      
//       if (matches) {
//         found = true;
//         console.log(`   ✅ Found table: ${table.tableNo}`);
        
//         return {
//           ...table,
//           status: newStatus,
//           orderId: orderId || table.orderId,
//           updatedAt: new Date().toISOString()
//         };
//       }
//       return table;
//     });
    
//     if (!found) {
//       console.warn(`⚠️ Table ${tableId} not found in cache`);
//       return false;
//     }
    
//     // Save updated tables
//     await save(TABLES_CACHE_KEY, updatedTables);
//     console.log('✅ Table status updated in cache');
    
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to update table status:', err);
//     return false;
//   }
// }

// // ============================================
// // UPDATE TABLE IN CACHE (FULL UPDATE)
// // ============================================
// export async function updateTableInCache(tableId, updatedData) {
//   try {
//     console.log(`🔄 Updating table ${tableId} in cache`);
    
//     const tables = (await load(TABLES_CACHE_KEY)) || [];
    
//     let found = false;
//     const updatedTables = tables.map(table => {
//       const matches = 
//         table._id === tableId ||
//         table.tableId === tableId ||
//         String(table._id) === String(tableId);
      
//       if (matches) {
//         found = true;
//         return {
//           ...table,
//           ...updatedData,
//           updatedAt: new Date().toISOString()
//         };
//       }
//       return table;
//     });
    
//     if (!found) {
//       console.warn(`⚠️ Table ${tableId} not found`);
//       return false;
//     }
    
//     await save(TABLES_CACHE_KEY, updatedTables);
//     console.log('✅ Table updated in cache');
    
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to update table:', err);
//     return false;
//   }
// }

// // ============================================
// // BOOK TABLE OFFLINE
// // ============================================
// export async function bookTableOffline(tableId, orderId) {
//   try {
//     console.log(`📝 Booking table ${tableId} for order ${orderId}`);
    
//     // Update in cache
//     const updated = await updateTableStatusInCache(tableId, 'Booked', orderId);
    
//     if (!updated) {
//       throw new Error('Failed to update table in cache');
//     }
    
//     // Add to pending sync
//     await addToPendingSync({
//       type: 'updateTable',
//       tableId: tableId,
//       data: {
//         status: 'Booked',
//         orderId: orderId
//       },
//       timestamp: Date.now()
//     });
    
//     console.log('✅ Table booked offline, will sync when online');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to book table offline:', err);
//     return false;
//   }
// }

// // ============================================
// // FREE TABLE OFFLINE
// // ============================================
// export async function freeTableOffline(tableId) {
//   try {
//     console.log(`🆓 Freeing table ${tableId}`);
    
//     // Update in cache
//     const updated = await updateTableStatusInCache(tableId, 'Available', null);
    
//     if (!updated) {
//       throw new Error('Failed to update table in cache');
//     }
    
//     // Add to pending sync
//     await addToPendingSync({
//       type: 'updateTable',
//       tableId: tableId,
//       data: {
//         status: 'Available',
//         orderId: null
//       },
//       timestamp: Date.now()
//     });
    
//     console.log('✅ Table freed offline, will sync when online');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to free table offline:', err);
//     return false;
//   }
// }

// // ============================================
// // CLEAR TABLES CACHE
// // ============================================
// export async function clearTablesCache() {
//   try {
//     await save(TABLES_CACHE_KEY, []);
//     console.log('✅ Tables cache cleared');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to clear tables cache:', err);
//     return false;
//   }
// }

// // ============================================
// // GET TABLE BY ID FROM CACHE
// // ============================================
// export async function getTableByIdFromCache(tableId) {
//   try {
//     const tables = await getCachedTables();
    
//     const table = tables.find(t => 
//       t._id === tableId ||
//       t.tableId === tableId ||
//       String(t._id) === String(tableId) ||
//       String(t.tableId) === String(tableId)
//     );
    
//     return table || null;
//   } catch (err) {
//     console.error('❌ Failed to get table by ID:', err);
//     return null;
//   }
// }

// // ============================================
// // EXPORT ALL FUNCTIONS
// // ============================================
// export {
//   TABLES_CACHE_KEY
// };


// // utils/offlineTable.js - Merged all table logic and fixed connectivity check
// import { 
//   save, 
//   load, 
//   STORAGE_KEYS,
//   addToPendingSync // Import addToPendingSync for offline actions
// } from './offlineStore.js';
// import { getTable } from '../https/index.js';

// let offlineModeContext = null;

// // ============================================
// // INITIALIZATION AND CONNECTIVITY
// // ============================================

// // ✅ Initialize with offline context
// export function initializeTablesCache(getOfflineStatus) {
//   offlineModeContext = getOfflineStatus;
//   console.log('✅ Tables cache initialized with offline context');
// }

// /**
//  * Check if we're truly online
//  */
// function isTrulyOnline() {
//   if (offlineModeContext) {
//     const status = offlineModeContext();
//     return !status.isOfflineMode && status.hasInternetConnection;
//   }
//   // Fallback to navigator.onLine if context not initialized
//   return navigator.onLine;
// }

// // ============================================
// // FETCH, CACHE, AND GET TABLES
// // ============================================

// /**
//  * Get cached tables
//  */
// export async function getCachedTables() {
//   try {
//     // Use STORAGE_KEYS.TABLES for consistency
//     const tables = (await load(STORAGE_KEYS.TABLES)) || []; 
//     console.log(`📦 Retrieved ${tables.length} tables from cache`);
//     return tables;
//   } catch (err) {
//     console.error('❌ Failed to get cached tables:', err);
//     return [];
//   }
// }

// /**
//  * Fetch tables from server and cache them
//  * Falls back to cache if offline or API fails
//  */
// export async function fetchAndCacheTables() {
//   try {
//     // ✅ FIX: Check true online status
//     if (!isTrulyOnline()) {
//       console.log('📴 Offline or no internet - using cached tables');
//       return await getCachedTables();
//     }

//     console.log('🔄 Fetching fresh tables data...');
//     const response = await getTable();
//     const tablesFromAPI = response.data?.data || [];

//     // Save to cache
//     await save(STORAGE_KEYS.TABLES, tablesFromAPI);
//     console.log(`💾 Caching tables: ${tablesFromAPI.length}`);

//     if (tablesFromAPI.length === 0) {
//       console.log('⚠️ No tables to cache');
//     }

//     return tablesFromAPI;
//   } catch (error) {
//     console.warn('⚠️ Failed to fetch tables:', error);
//     // Fallback to cached tables
//     return await getCachedTables();
//   }
// }

// // ============================================
// // UPDATE TABLE STATUS IN CACHE
// // ============================================
// export async function updateTableStatusInCache(tableId, newStatus, orderId = null) {
//   try {
//     console.log(`🔄 Updating table ${tableId} status to: ${newStatus}`);
    
//     const tables = (await load(STORAGE_KEYS.TABLES)) || [];
    
//     let found = false;
//     const updatedTables = tables.map(table => {
//       // Match by _id or tableId
//       const matches = 
//         table._id === tableId ||
//         table.tableId === tableId ||
//         String(table._id) === String(tableId) ||
//         String(table.tableId) === String(tableId);
      
//       if (matches) {
//         found = true;
//         console.log(`   ✅ Found table: ${table.tableNo}`);
        
//         return {
//           ...table,
//           status: newStatus,
//           orderId: orderId || table.orderId,
//           updatedAt: new Date().toISOString()
//         };
//       }
//       return table;
//     });
    
//     if (!found) {
//       console.warn(`⚠️ Table ${tableId} not found in cache`);
//       return false;
//     }
    
//     // Save updated tables
//     await save(STORAGE_KEYS.TABLES, updatedTables);
//     console.log('✅ Table status updated in cache');
    
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to update table status:', err);
//     return false;
//   }
// }

// // ============================================
// // UPDATE TABLE IN CACHE (FULL UPDATE)
// // ============================================
// export async function updateTableInCache(tableId, updatedData) {
//   try {
//     console.log(`🔄 Updating table ${tableId} in cache`);
    
//     const tables = (await load(STORAGE_KEYS.TABLES)) || [];
    
//     let found = false;
//     const updatedTables = tables.map(table => {
//       const matches = 
//         table._id === tableId ||
//         table.tableId === tableId ||
//         String(table._id) === String(tableId);
      
//       if (matches) {
//         found = true;
//         return {
//           ...table,
//           ...updatedData,
//           updatedAt: new Date().toISOString()
//         };
//       }
//       return table;
//     });
    
//     if (!found) {
//       console.warn(`⚠️ Table ${tableId} not found`);
//       return false;
//     }
    
//     await save(STORAGE_KEYS.TABLES, updatedTables);
//     console.log('✅ Table updated in cache');
    
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to update table:', err);
//     return false;
//   }
// }

// // ============================================
// // BOOK TABLE OFFLINE (with pending sync)
// // ============================================
// export async function bookTableOffline(tableId, orderId) {
//   try {
//     console.log(`📝 Booking table ${tableId} for order ${orderId}`);
    
//     // Update in cache
//     const updated = await updateTableStatusInCache(tableId, 'Booked', orderId);
    
//     if (!updated) {
//       throw new Error('Failed to update table in cache');
//     }
    
//     // Add to pending sync
//     await addToPendingSync({
//       type: 'updateTable',
//       tableId: tableId,
//       data: {
//         status: 'Booked',
//         orderId: orderId
//       },
//       timestamp: Date.now()
//     });
    
//     console.log('✅ Table booked offline, will sync when online');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to book table offline:', err);
//     return false;
//   }
// }

// // ============================================
// // FREE TABLE OFFLINE (with pending sync)
// // ============================================
// export async function freeTableOffline(tableId) {
//   try {
//     console.log(`🆓 Freeing table ${tableId}`);
    
//     // Update in cache
//     const updated = await updateTableStatusInCache(tableId, 'Available', null);
    
//     if (!updated) {
//       throw new Error('Failed to update table in cache');
//     }
    
//     // Add to pending sync
//     await addToPendingSync({
//       type: 'updateTable',
//       tableId: tableId,
//       data: {
//         status: 'Available',
//         orderId: null
//       },
//       timestamp: Date.now()
//     });
    
//     console.log('✅ Table freed offline, will sync when online');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to free table offline:', err);
//     return false;
//   }
// }

// // ============================================
// // CLEAR TABLES CACHE
// // ============================================
// export async function clearTablesCache() {
//   try {
//     await save(STORAGE_KEYS.TABLES, []);
//     console.log('✅ Tables cache cleared');
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to clear tables cache:', err);
//     return false;
//   }
// }

// // ============================================
// // GET TABLE BY ID FROM CACHE
// // ============================================
// export async function getTableByIdFromCache(tableId) {
//   try {
//     const tables = await getCachedTables();
    
//     const table = tables.find(t => 
//       t._id === tableId ||
//       t.tableId === tableId ||
//       String(t._id) === String(tableId) ||
//       String(t.tableId) === String(tableId)
//     );
    
//     return table || null;
//   } catch (err) {
//     console.error('❌ Failed to get table by ID:', err);
//     return null;
//   }
// }

// // ============================================
// // EXPORT ALL FUNCTIONS
// // ============================================
// export {
//   // Functions for initialization and primary fetching
 
 
//   // Functions for cache manipulation


//   // Functions for offline actions
 
 
// };


// utils/offlineTable.js - COMPLETE FIXED VERSION
import { 
  save, 
  load, 
  STORAGE_KEYS,
  addToPendingSync
} from './offlineStore.js';
import { getTable } from '../https/index.js';

let offlineModeContext = null;

// ============================================
// INITIALIZATION
// ============================================
export function initializeTablesCache(getOfflineStatus) {
  offlineModeContext = getOfflineStatus;
  console.log('✅ [TABLES CACHE] Initialized with offline context');
}

function isTrulyOnline() {
  if (offlineModeContext) {
    const status = offlineModeContext();
    return !status.isOfflineMode && status.hasInternetConnection;
  }
  return navigator.onLine;
}

// ============================================
// GET CACHED TABLES
// ============================================
export async function getCachedTables() {
  try {
    console.log('📦 [TABLES CACHE] Reading from:', STORAGE_KEYS.TABLES);
    
    const tables = (await load(STORAGE_KEYS.TABLES)) || [];
    
    console.log('📦 [TABLES CACHE] Result:', {
      found: tables.length > 0,
      count: tables.length,
      isArray: Array.isArray(tables),
      sample: tables[0] || null
    });
    
    return tables;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Read failed:', err);
    return [];
  }
}

// ============================================
// SAVE TABLES TO CACHE - ✅ FIXED FUNCTION NAME
// ============================================
export async function saveTablesToCache(tables) {
  try {
    if (!Array.isArray(tables)) {
      console.error('❌ [TABLES CACHE] Invalid data type:', typeof tables);
      return false;
    }
    
    console.log(`💾 [TABLES CACHE] Saving ${tables.length} tables...`);
    
    await save(STORAGE_KEYS.TABLES, tables);
    
    console.log('✅ [TABLES CACHE] Saved successfully');
    return true;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Save failed:', err);
    return false;
  }
}

// ============================================
// FETCH AND CACHE TABLES - ✅ FIXED
// ============================================
export async function fetchAndCacheTables(tablesData = null) {
  try {
    // If tables data is provided, just cache it
    if (tablesData) {
      console.log(`💾 [TABLES] Caching provided tables: ${tablesData.length}`);
      await saveTablesToCache(tablesData);
      return tablesData;
    }
    
    // ✅ CRITICAL: Check offline status BEFORE API call
    if (!isTrulyOnline()) {
      console.log('📴 [TABLES] Offline - using cached tables');
      return await getCachedTables();
    }

    console.log('🔄 [TABLES] Fetching from API...');
    const response = await getTable();
    const tablesFromAPI = response.data?.data || [];

    console.log(`🌐 [TABLES] API returned ${tablesFromAPI.length} tables`);
    
    // Save to cache
    await saveTablesToCache(tablesFromAPI);

    // Update metadata
    await save(STORAGE_KEYS.METADATA, {
      ...await load(STORAGE_KEYS.METADATA),
      lastTablesSync: Date.now(),
      tableCount: tablesFromAPI.length
    });

    return tablesFromAPI;
  } catch (error) {
    console.error('❌ [TABLES] Fetch failed:', error.message);
    // Fallback to cached tables
    return await getCachedTables();
  }
}

// ============================================
// UPDATE TABLE STATUS IN CACHE
// ============================================
export async function updateTableStatusInCache(tableId, newStatus, orderId = null) {
  try {
    console.log(`🔄 [TABLES CACHE] Updating table ${tableId} status to: ${newStatus}`);
    
    const tables = await getCachedTables();
    
    if (tables.length === 0) {
      console.warn('⚠️ [TABLES CACHE] No tables in cache to update');
      return false;
    }
    
    let found = false;
    const updatedTables = tables.map(table => {
      const matches = 
        table._id === tableId ||
        table.tableId === tableId ||
        String(table._id) === String(tableId) ||
        String(table.tableId) === String(tableId);
      
      if (matches) {
        found = true;
        console.log(`✅ [TABLES CACHE] Found table: ${table.tableNo}`);
        
        return {
          ...table,
          status: newStatus,
          orderId: orderId || table.orderId,
          updatedAt: new Date().toISOString()
        };
      }
      return table;
    });
    
    if (!found) {
      console.warn(`⚠️ [TABLES CACHE] Table ${tableId} not found`);
      return false;
    }
    
    await saveTablesToCache(updatedTables);
    console.log('✅ [TABLES CACHE] Status updated');
    
    return true;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Update failed:', err);
    return false;
  }
}

// ============================================
// UPDATE TABLE IN CACHE (FULL UPDATE)
// ============================================
export async function updateTableInCache(tableId, updatedData) {
  try {
    console.log(`🔄 [TABLES CACHE] Updating table ${tableId}`);
    
    const tables = await getCachedTables();
    
    let found = false;
    const updatedTables = tables.map(table => {
      const matches = 
        table._id === tableId ||
        table.tableId === tableId ||
        String(table._id) === String(tableId);
      
      if (matches) {
        found = true;
        return {
          ...table,
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
      }
      return table;
    });
    
    if (!found) {
      console.warn(`⚠️ [TABLES CACHE] Table ${tableId} not found`);
      return false;
    }
    
    await saveTablesToCache(updatedTables);
    console.log('✅ [TABLES CACHE] Table updated');
    
    return true;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Update failed:', err);
    return false;
  }
}

// ============================================
// BOOK TABLE OFFLINE
// ============================================
export async function bookTableOffline(tableId, orderId) {
  try {
    console.log(`📝 [TABLES OFFLINE] Booking table ${tableId} for order ${orderId}`);
    
    const updated = await updateTableStatusInCache(tableId, 'Booked', orderId);
    
    if (!updated) {
      throw new Error('Failed to update table in cache');
    }
    
    await addToPendingSync({
      type: 'updateTable',
      tableId: tableId,
      data: {
        status: 'Booked',
        orderId: orderId
      },
      timestamp: Date.now()
    });
    
    console.log('✅ [TABLES OFFLINE] Table booked, queued for sync');
    return true;
  } catch (err) {
    console.error('❌ [TABLES OFFLINE] Book failed:', err);
    return false;
  }
}

// ============================================
// FREE TABLE OFFLINE
// ============================================
export async function freeTableOffline(tableId) {
  try {
    console.log(`🆓 [TABLES OFFLINE] Freeing table ${tableId}`);
    
    const updated = await updateTableStatusInCache(tableId, 'Available', null);
    
    if (!updated) {
      throw new Error('Failed to update table in cache');
    }
    
    await addToPendingSync({
      type: 'updateTable',
      tableId: tableId,
      data: {
        status: 'Available',
        orderId: null
      },
      timestamp: Date.now()
    });
    
    console.log('✅ [TABLES OFFLINE] Table freed, queued for sync');
    return true;
  } catch (err) {
    console.error('❌ [TABLES OFFLINE] Free failed:', err);
    return false;
  }
}

// ============================================
// CLEAR TABLES CACHE
// ============================================
export async function clearTablesCache() {
  try {
    await save(STORAGE_KEYS.TABLES, []);
    console.log('✅ [TABLES CACHE] Cleared');
    return true;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Clear failed:', err);
    return false;
  }
}

// ============================================
// GET TABLE BY ID FROM CACHE
// ============================================
export async function getTableByIdFromCache(tableId) {
  try {
    const tables = await getCachedTables();
    
    const table = tables.find(t => 
      t._id === tableId ||
      t.tableId === tableId ||
      String(t._id) === String(tableId) ||
      String(t.tableId) === String(tableId)
    );
    
    if (table) {
      console.log(`📦 [TABLES CACHE] Found table: ${table.tableNo}`);
    } else {
      console.warn(`⚠️ [TABLES CACHE] Table ${tableId} not found`);
    }
    
    return table || null;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Get by ID failed:', err);
    return null;
  }
}