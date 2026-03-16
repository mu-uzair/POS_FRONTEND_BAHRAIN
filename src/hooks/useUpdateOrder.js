import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useOfflineMode } from '../constants/OfflineModeContext';
import { updateOrderStatus as updateOrderStatusAPI } from '../https/index';
import { 
  updateOrderStatusInCache, 
  addToPendingSync,
  updateOrdersCache 
} from '../utils/offlineStore';
import { fetchAndCacheRecentOrders } from '../utils/getOrdersOffline';

export const useUpdateOrderStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { isOfflineMode } = useOfflineMode();

  const updateStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      enqueueSnackbar('Invalid order ID or status', { variant: 'error' });
      return { success: false, error: 'Invalid parameters' };
    }

    setIsUpdating(true);

    try {
      if (isOfflineMode) {
      
        // OFFLINE MODE - Queue for sync
        
        console.log(`🔴 [OFFLINE UPDATE] Updating order ${orderId} -> ${newStatus}`);

        // Update in cache
        await updateOrderStatusInCache(orderId, newStatus);

        // Add to pending sync queue
        await addToPendingSync({
          type: 'updateStatus',
          orderId: orderId,
          data: { orderStatus: newStatus },
          timestamp: Date.now()
        });

        // Update React Query cache immediately for UI
        queryClient.setQueryData(['orders'], (old) => {
          if (old?.pages) {
            const newPages = old.pages.map(page => ({
              ...page,
              data: page.data?.map(order => {
                const id = order._id || order.orderId;
                if (id === orderId) {
                  return { ...order, orderStatus: newStatus, updatedAt: new Date().toISOString() };
                }
                return order;
              }) || []
            }));
            return { ...old, pages: newPages };
          } else if (Array.isArray(old)) {
            return old.map(order => {
              const id = order._id || order.orderId;
              if (id === orderId) {
                return { ...order, orderStatus: newStatus, updatedAt: new Date().toISOString() };
              }
              return order;
            });
          }
          return old;
        });

        enqueueSnackbar('Order status updated offline - will sync when online', {
          variant: 'warning',
          autoHideDuration: 3000
        });

        console.log(`✅ [OFFLINE UPDATE] Queued for sync: ${orderId}`);
        return { success: true, isOffline: true };

      } else {
     
        // ONLINE MODE - Update immediately + CACHE
       
        console.log(`🟢 [ONLINE UPDATE] Updating order ${orderId} -> ${newStatus}`);

        // Step 1: Call API
        await updateOrderStatusAPI({ orderId, orderStatus: newStatus });

        // Step 2: Get fresh data from React Query cache
        const ordersData = queryClient.getQueryData(['orders']);
        let updatedOrders = [];

        if (ordersData?.pages) {
          // Infinite query format
          updatedOrders = ordersData.pages.flatMap(page => 
            page.data?.map(order => {
              const id = order._id || order.orderId;
              if (id === orderId) {
                return { ...order, orderStatus: newStatus, updatedAt: new Date().toISOString() };
              }
              return order;
            }) || []
          );
        } else if (Array.isArray(ordersData)) {
          updatedOrders = ordersData.map(order => {
            const id = order._id || order.orderId;
            if (id === orderId) {
              return { ...order, orderStatus: newStatus, updatedAt: new Date().toISOString() };
            }
            return order;
          });
        }

        // Step 3: ✅ UPDATE OFFLINE CACHE with the changed order
        if (updatedOrders.length > 0) {
          await updateOrdersCache(updatedOrders);
          console.log('✅ [CACHE] Updated offline cache with new status');
        }

        // Step 4: Invalidate React Query caches
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['orders'] }),
          queryClient.invalidateQueries({ queryKey: ['tables'] })
        ]);

        // Step 5: ✅ FORCE REFRESH CACHE from server
        setTimeout(async () => {
          try {
            await fetchAndCacheRecentOrders();
            console.log('✅ [CACHE] Refreshed from server');
          } catch (err) {
            console.warn('⚠️ Failed to refresh cache:', err);
          }
        }, 500);

        enqueueSnackbar('Order status updated successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

        console.log(`✅ [ONLINE UPDATE] Updated: ${orderId}`);
        return { success: true, isOffline: false };
      }

    } catch (error) {
      console.error('❌ [ORDER UPDATE] Error:', error);
      
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update order status',
        { variant: 'error' }
      );

      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };

    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus,
    isUpdating
  };
};