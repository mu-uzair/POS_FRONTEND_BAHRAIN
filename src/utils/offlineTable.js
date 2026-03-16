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
  // console.log('✅ [TABLES CACHE] Initialized with offline context');
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
    // console.log('📦 [TABLES CACHE] Reading from:', STORAGE_KEYS.TABLES);
    
    const tables = (await load(STORAGE_KEYS.TABLES)) || [];
    
    // console.log('📦 [TABLES CACHE] Result:', {
    //   found: tables.length > 0,
    //   count: tables.length,
    //   isArray: Array.isArray(tables),
    //   sample: tables[0] || null
    // });
    
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
    
    // console.log(`💾 [TABLES CACHE] Saving ${tables.length} tables...`);
    
    await save(STORAGE_KEYS.TABLES, tables);
    
    // console.log('✅ [TABLES CACHE] Saved successfully');
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
      // console.log(`💾 [TABLES] Caching provided tables: ${tablesData.length}`);
      await saveTablesToCache(tablesData);
      return tablesData;
    }
    
    // ✅ CRITICAL: Check offline status BEFORE API call
    if (!isTrulyOnline()) {
      // console.log('📴 [TABLES] Offline - using cached tables');
      return await getCachedTables();
    }

    // console.log('🔄 [TABLES] Fetching from API...');
    const response = await getTable();
    const tablesFromAPI = response.data?.data || [];

    // console.log(`🌐 [TABLES] API returned ${tablesFromAPI.length} tables`);
    
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
    // console.log(`🔄 [TABLES CACHE] Updating table ${tableId} status to: ${newStatus}`);
    
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
        // console.log(`✅ [TABLES CACHE] Found table: ${table.tableNo}`);
        
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
    // console.log('✅ [TABLES CACHE] Status updated');
    
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
    // console.log(`🔄 [TABLES CACHE] Updating table ${tableId}`);
    
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
    // console.log('✅ [TABLES CACHE] Table updated');
    
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
    // console.log(`📝 [TABLES OFFLINE] Booking table ${tableId} for order ${orderId}`);
    
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
    
    // console.log('✅ [TABLES OFFLINE] Table booked, queued for sync');
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
    // console.log(`🆓 [TABLES OFFLINE] Freeing table ${tableId}`);
    
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
    
    // console.log('✅ [TABLES OFFLINE] Table freed, queued for sync');
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
    // console.log('✅ [TABLES CACHE] Cleared');
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
      // console.log(`📦 [TABLES CACHE] Found table: ${table.tableNo}`);
    } else {
      console.warn(`⚠️ [TABLES CACHE] Table ${tableId} not found`);
    }
    
    return table || null;
  } catch (err) {
    console.error('❌ [TABLES CACHE] Get by ID failed:', err);
    return null;
  }
}