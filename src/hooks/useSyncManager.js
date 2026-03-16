
import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useOfflineMode } from "../constants/OfflineModeContext";
import { addOrder, updateOrderStatus, updateOrder } from "../https/index";
import {
  getPendingSync,
  removeFromPendingSync,
  incrementSyncRetry,
  removeOrderFromCache,
  STORAGE_KEYS
} from "../utils/offlineStore";

const MAX_RETRIES = 3;

/**
 * Central sync manager - use this ONCE in App.js
 * Handles all syncing logic when going online
 */
export const useSyncManager = () => {
  const queryClient = useQueryClient();
  const { isOfflineMode, actualOnlineStatus, hasInternetConnection } = useOfflineMode();
  const isSyncing = useRef(false);
  const syncTimeoutRef = useRef(null);

  /**
   * Main sync function - syncs all pending items
   */
  const syncPendingItems = useCallback(async () => {
    // Prevent concurrent syncs
    if (isSyncing.current) {
      // console.log("⏳ Sync already in progress, skipping...");
      return { success: false, reason: 'already_syncing' };
    }

    // Only sync when truly online
    if (!actualOnlineStatus || !hasInternetConnection) {
      console.log("📴 Cannot sync - device offline");
      return { success: false, reason: 'offline' };
    }

    // Don't sync in manual offline mode
    if (isOfflineMode) {
      console.log("🔴 Manual offline mode active - sync deferred");
      return { success: false, reason: 'manual_offline' };
    }

    try {
      isSyncing.current = true;
      // console.log("🔄 [SYNC MANAGER] Starting sync...");

      const pendingItems = await getPendingSync();
      
      if (pendingItems.length === 0) {
        // console.log("✅ [SYNC MANAGER] No items to sync");
        return { success: true, synced: 0, failed: 0 };
      }

      // console.log(`📦 [SYNC MANAGER] Found ${pendingItems.length} items to sync`);
      
      enqueueSnackbar(`Syncing ${pendingItems.length} offline changes...`, {
        variant: "info",
        autoHideDuration: 3000
      });

      let successCount = 0;
      let failedCount = 0;

      for (const item of pendingItems) {
        try {
          const orderId = item.orderId || item.data?.orderId || item.data?._id;
          // console.log(`🔄 [SYNC] Processing: ${item.type} - Order: ${orderId}`);

          // Check retry limit
          if ((item.retryCount || 0) >= MAX_RETRIES) {
            // console.warn(`⚠️ [SYNC] Max retries reached for order ${orderId}`);
            failedCount++;
            continue;
          }

          
          // HANDLE DIFFERENT SYNC TYPES
         
          
          if (item.type === "addOrder" || item.type === "createOrder") {
            // ✅ CREATE NEW ORDER
            const { 
              isOffline, 
              syncStatus, 
              offlineCreatedAt,
              offlineUpdatedAt,
              retryCount,
              timestamp,
              tempId,
              ...cleanOrder 
            } = item.data || item;

            // console.log("📤 [SYNC] Creating order:", cleanOrder.orderNo);
            const response = await addOrder(cleanOrder);
            // console.log(`✅ [SYNC] Order created:`, response.data);

            // Remove from cache and pending sync
            await removeOrderFromCache(orderId);
            await removeFromPendingSync(orderId, item.type);
            
            successCount++;

          } else if (item.type === "updateStatus") {
            // ✅ UPDATE ORDER STATUS
            const { orderId, data } = item;
            // console.log(`📤 [SYNC] Updating status: ${orderId} -> ${data.orderStatus}`);
            
            await updateOrderStatus({ 
              orderId, 
              orderStatus: data.orderStatus 
            });
            
            await removeFromPendingSync(orderId, item.type);
            // console.log(`✅ [SYNC] Status updated successfully`);
            
            successCount++;

          } else if (item.type === "updateOrder") {
            // ✅ UPDATE ENTIRE ORDER
            const { orderId, data } = item;
            console.log(`📤 [SYNC] Updating order: ${orderId}`);
            
            // Remove offline-specific fields
            const { 
              isOffline, 
              syncStatus, 
              offlineCreatedAt,
              offlineUpdatedAt,
              retryCount,
              timestamp,
              tempId,
              ...cleanData 
            } = data;
            
            await updateOrder(orderId, cleanData);
            
            await removeFromPendingSync(orderId, item.type);
            // console.log(`✅ [SYNC] Order updated successfully`);
            
            successCount++;

          } else {
            console.warn(`⚠️ [SYNC] Unknown sync type: ${item.type}`);
            failedCount++;
          }

          // Small delay to avoid overwhelming server
          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (err) {
          // console.error(`❌ [SYNC] Failed to sync item:`, err);
          // console.error("Error details:", err.response?.data || err.message);
          
          // Increment retry count
          const orderId = item.orderId || item.data?.orderId;
          if (orderId) {
            await incrementSyncRetry(orderId);
          }
          
          failedCount++;
        }
      }

      console.log(`✅ [SYNC MANAGER] Complete: ${successCount} synced, ${failedCount} failed`);

      // Show user feedback
      if (successCount > 0 && failedCount === 0) {
        enqueueSnackbar(`All ${successCount} offline changes synced successfully!`, {
          variant: "success",
          autoHideDuration: 5000
        });
      } else if (successCount > 0 && failedCount > 0) {
        enqueueSnackbar(
          `${successCount} changes synced. ${failedCount} failed - will retry later.`,
          { variant: "warning", autoHideDuration: 5000 }
        );
      } else if (failedCount > 0) {
        enqueueSnackbar(`Failed to sync ${failedCount} changes. Will retry later.`, {
          variant: "error",
          autoHideDuration: 5000
        });
      }

      // Refresh orders in UI
      if (successCount > 0) {
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        // console.log("✅ [SYNC MANAGER] UI cache invalidated");
      }

      return { 
        success: failedCount === 0, 
        synced: successCount, 
        failed: failedCount 
      };

    } catch (error) {
      // console.error("❌ [SYNC MANAGER] Critical error:", error);
      enqueueSnackbar("Error syncing offline changes", {
        variant: "error",
        autoHideDuration: 3000
      });
      return { success: false, synced: 0, failed: -1 };
    } finally {
      isSyncing.current = false;
    }
  }, [queryClient, isOfflineMode, actualOnlineStatus, hasInternetConnection]);

  /**
   * Schedule sync with delay (prevents rapid firing)
   */
  const scheduleSyncWithDelay = useCallback((delayMs = 1000) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      syncPendingItems();
    }, delayMs);
  }, [syncPendingItems]);

  /**
   * Effect: Sync when coming online or exiting offline mode
   */
  useEffect(() => {
    // console.log("🔍 [SYNC MANAGER] State changed:", {
    //   isOfflineMode,
    //   actualOnlineStatus,
    //   hasInternetConnection
    // });

    // Trigger sync when transitioning to online state
    if (actualOnlineStatus && hasInternetConnection && !isOfflineMode) {
      // console.log("🟢 [SYNC MANAGER] Online state detected - scheduling sync...");
      scheduleSyncWithDelay(2000); // 2 second delay for stability
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOfflineMode, actualOnlineStatus, hasInternetConnection, scheduleSyncWithDelay]);

  /**
   * Effect: Listen to browser online event
   */
  useEffect(() => {
    const handleOnline = () => {
      // console.log("🌐 [BROWSER EVENT] Online event fired");
      
      // Only sync if not in manual offline mode
      if (!isOfflineMode) {
        scheduleSyncWithDelay(1500);
      }
    };

    const handleOffline = () => {
      // console.log("📴 [BROWSER EVENT] Offline event fired");
      // Clear any pending syncs
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOfflineMode, scheduleSyncWithDelay]);

  return {
    syncPendingItems,
    isSyncing: isSyncing.current
  };
};