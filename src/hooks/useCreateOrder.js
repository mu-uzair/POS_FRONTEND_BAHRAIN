// hooks/useCreateOrder.js - CORRECTED: Use existing orderId
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useOfflineMode } from '../constants/OfflineModeContext';
import { addOrder } from '../https/index';
import { 
  addToPendingSync, 
  updateOrdersCache,
  STORAGE_KEYS,
  load,
  save
} from '../utils/offlineStore';

export const useCreateOrder = () => {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const { isOfflineMode } = useOfflineMode();

  const createOrder = async (orderData) => {
    setIsCreating(true);

    try {
      if (isOfflineMode) {
        // ============================================
        // OFFLINE MODE - Queue for sync
        // ============================================
        console.log('🔴 [OFFLINE ORDER] Creating order offline');
        console.log('📦 Order data received:', {
          orderId: orderData.orderId,
          orderNo: orderData.orderNo,
          status: orderData.orderStatus
        });
        
        // ✅ Use the orderId that's already in orderData (from BillInfo)
        // Don't create a new one!
        const offlineOrder = {
          ...orderData,
          // DO NOT add _id - marks it as offline
          // orderId and orderNo already exist in orderData
          createdAt: orderData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isOffline: true,
          syncStatus: 'pending',
          tempId: `temp_${orderData.orderId}_${orderData.orderNo}` // For React keys
        };

        console.log('💾 Offline order structure:', {
          orderId: offlineOrder.orderId,      // From orderData (timestamp)
          orderNo: offlineOrder.orderNo,      // From orderData (e.g., "ORD-5")
          tempId: offlineOrder.tempId,        // For React
          hasId: !!offlineOrder._id,          // Should be false
          status: offlineOrder.orderStatus
        });

        // ✅ STEP 1: Add to orders cache
        const existingOrders = (await load(STORAGE_KEYS.ORDERS_CACHE)) || [];
        const updatedOrders = [offlineOrder, ...existingOrders];
        await save(STORAGE_KEYS.ORDERS_CACHE, updatedOrders);
        console.log(`✅ Saved to ${STORAGE_KEYS.ORDERS_CACHE} - Total: ${updatedOrders.length}`);

        // ✅ STEP 2: Add to sync queue using the orderId from orderData
        await addToPendingSync({
          type: 'addOrder',
          orderId: offlineOrder.orderId, // Use the orderId from orderData
          data: offlineOrder
        });
        console.log(`✅ Added to pending sync queue with orderId: ${offlineOrder.orderId}`);

        // ✅ STEP 3: Update React Query cache immediately for UI
        queryClient.setQueryData(['orders'], (old) => {
          if (old?.pages) {
            // Infinite query format
            const newPages = [...old.pages];
            if (newPages[0]?.data) {
              newPages[0] = {
                ...newPages[0],
                data: [offlineOrder, ...newPages[0].data]
              };
            }
            return { ...old, pages: newPages };
          } else if (Array.isArray(old)) {
            // Array format
            return [offlineOrder, ...old];
          }
          return old;
        });
        console.log('✅ Updated React Query cache');

        enqueueSnackbar('Order created offline - will sync when online', {
          variant: 'warning',
          autoHideDuration: 4000
        });

        console.log('✅ [OFFLINE ORDER] Complete - Order saved and queued');
        return { 
          success: true, 
          data: offlineOrder, 
          isOffline: true 
        };

      } else {
        
        // ONLINE MODE - Create immediately via API
        
        console.log('🟢 [ONLINE ORDER] Creating order online');
        console.log('📤 Sending to API:', orderData);

        // ✅ Send orderData directly (backend expects this format)
        const response = await addOrder(orderData);
        
        // console.log('📥 API Response:', response);
        
        const createdOrder = response.data?.data || response.data;
        console.log('✅ Created order from backend:', createdOrder);

        // ✅ Add to cache (with _id from backend)
        await updateOrdersCache([createdOrder]);
        console.log('✅ Added to orders cache');

        // ✅ Invalidate React Query cache to refresh UI
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
        console.log('✅ Invalidated React Query cache');

        enqueueSnackbar('Order created successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

        console.log('✅ [ONLINE ORDER] Complete');
        return { 
          success: true, 
          data: createdOrder, 
          isOffline: false 
        };
      }

    } catch (error) {
      console.error('❌ [ORDER CREATION] Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error config:', error.config);
      
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create order',
        { variant: 'error' }
      );

      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };

    } finally {
      setIsCreating(false);
    }
  };

  return {
    createOrder,
    isCreating
  };
};