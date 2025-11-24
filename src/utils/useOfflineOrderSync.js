// hooks/useOfflineOrderSync.js
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addOrder } from "../https/index";
import { save, load } from "../utils/offlineStore";

const OFFLINE_PENDING_ORDERS_KEY = "offline:pendingOrders";

/**
 * Global hook to sync offline orders
 * Place this in your App.js or main layout component
 * It will automatically sync orders when the device comes back online
 */
export const useOfflineOrderSync = () => {
  const queryClient = useQueryClient();
  const isSyncing = useRef(false);
  const syncTimeout = useRef(null);

  const syncOfflineOrders = async () => {
    // Prevent multiple simultaneous syncs
    if (isSyncing.current) {
      console.log("⏳ Sync already in progress, skipping...");
      return;
    }

    try {
      isSyncing.current = true;
      console.log("🔄 CHECKING FOR OFFLINE ORDERS TO SYNC...");
      
      const pendingOrders = (await load(OFFLINE_PENDING_ORDERS_KEY)) || [];
      console.log(`📦 Found ${pendingOrders.length} pending orders to sync`);
      
      if (pendingOrders.length === 0) {
        console.log("✅ No offline orders to sync");
        return;
      }

      console.log("📋 PENDING ORDERS TO SYNC:", pendingOrders);
      enqueueSnackbar(`Syncing ${pendingOrders.length} offline orders...`, { 
        variant: "info",
        autoHideDuration: 3000
      });

      const failedOrders = [];
      let successCount = 0;
      
      for (const order of pendingOrders) {
        try {
          console.log(`🔄 Syncing order: ${order.orderId || order.orderNo}`, order);
          
          // Remove offline-specific fields before sending to server
          const { 
            isOffline, 
            syncStatus, 
            offlineCreatedAt, 
            offlineUpdatedAt,
            ...cleanOrder 
          } = order;
          
          console.log("📤 Sending to server:", cleanOrder);
          const response = await addOrder(cleanOrder);
          
          console.log(`✅ Order synced successfully!`, response.data);
          successCount++;
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`❌ Failed to sync order:`, err);
          console.error("Error details:", err.response?.data || err.message);
          
          // Keep failed order for retry
          failedOrders.push(order);
        }
      }

      // Update storage with only failed orders
      await save(OFFLINE_PENDING_ORDERS_KEY, failedOrders);

      console.log(`✅ Sync complete: ${successCount} succeeded, ${failedOrders.length} failed`);

      if (failedOrders.length === 0) {
        enqueueSnackbar(`All ${successCount} offline orders synced successfully!`, { 
          variant: "success",
          autoHideDuration: 5000
        });
        
        // Invalidate cache to refresh UI across all pages
        await queryClient.invalidateQueries(["orders"]);
        await queryClient.refetchQueries(["orders"], { active: true });
        console.log("✅ Cache invalidated - UI will refresh with synced orders");
      } else {
        enqueueSnackbar(
          `${successCount} orders synced. ${failedOrders.length} failed - will retry later.`, 
          { 
            variant: "warning",
            autoHideDuration: 5000
          }
        );
        console.log("⚠️ FAILED ORDERS:", failedOrders);
      }
    } catch (error) {
      console.error("❌ SYNC ERROR:", error);
      enqueueSnackbar("Error syncing offline orders", { 
        variant: "error",
        autoHideDuration: 3000
      });
    } finally {
      isSyncing.current = false;
    }
  };

  useEffect(() => {
    console.log("🔌 Offline sync hook initialized");

    // Check on mount if online
    if (navigator.onLine) {
      console.log("🌐 Device is ONLINE on mount - Scheduling sync...");
      // Small delay to ensure app is fully loaded
      syncTimeout.current = setTimeout(() => {
        syncOfflineOrders();
      }, 2000);
    } else {
      console.log("📴 Device is OFFLINE on mount - Sync deferred");
    }

    // Listen for online event
    const handleOnline = () => {
      console.log("🌐 DEVICE BACK ONLINE - Starting sync...");
      // Small delay to ensure connection is stable
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
      syncTimeout.current = setTimeout(() => {
        syncOfflineOrders();
      }, 1000);
    };

    // Listen for offline event
    const handleOffline = () => {
      console.log("📴 DEVICE WENT OFFLINE - Sync paused");
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (syncTimeout.current) {
        clearTimeout(syncTimeout.current);
      }
    };
  }, [queryClient]);

  // Return sync function in case manual sync is needed
  return { syncOfflineOrders };
};

export default useOfflineOrderSync;