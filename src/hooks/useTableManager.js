// hooks/useTableManager.js - Complete Table Management Hook
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useOfflineMode } from '../constants/OfflineModeContext';
import { updateTableStatus } from '../https/index'; // Your API call
import {
  updateTableStatusInCache,
  bookTableOffline,
  freeTableOffline,
  addToPendingSync
} from '../utils/offlineTables';

export const useTableManager = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { isOfflineMode } = useOfflineMode();

  /**
   * Book a table for an order
   */
  const bookTable = async (tableId, orderId) => {
    if (!tableId || !orderId) {
      enqueueSnackbar('Invalid table ID or order ID', { variant: 'error' });
      return { success: false, error: 'Invalid parameters' };
    }

    setIsUpdating(true);

    try {
      if (isOfflineMode) {
        // ============================================
        // OFFLINE MODE - Queue for sync
        // ============================================
        console.log(`🔴 [OFFLINE] Booking table ${tableId} for order ${orderId}`);

        // Update in cache
        const updated = await bookTableOffline(tableId, orderId);

        if (!updated) {
          throw new Error('Failed to book table in cache');
        }

        // Update React Query cache immediately for UI
        queryClient.setQueryData(['tables'], (old) => {
          if (Array.isArray(old)) {
            return old.map(table => {
              const matches = 
                table._id === tableId ||
                table.tableId === tableId ||
                String(table._id) === String(tableId);

              if (matches) {
                return {
                  ...table,
                  status: 'Booked',
                  orderId: orderId,
                  updatedAt: new Date().toISOString()
                };
              }
              return table;
            });
          }
          return old;
        });

        enqueueSnackbar('Table booked offline - will sync when online', {
          variant: 'warning',
          autoHideDuration: 3000
        });

        console.log(`✅ [OFFLINE] Table booked: ${tableId}`);
        return { success: true, isOffline: true };

      } else {
        // ============================================
        // ONLINE MODE - Update immediately
        // ============================================
        console.log(`🟢 [ONLINE] Booking table ${tableId} for order ${orderId}`);

        await updateTableStatus({
          tableId,
          status: 'Booked',
          orderId
        });

        // Invalidate React Query cache
        await queryClient.invalidateQueries({ queryKey: ['tables'] });

        enqueueSnackbar('Table booked successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

        console.log(`✅ [ONLINE] Table booked: ${tableId}`);
        return { success: true, isOffline: false };
      }

    } catch (error) {
      console.error('❌ [TABLE BOOKING] Error:', error);

      enqueueSnackbar(
        error.response?.data?.message || 'Failed to book table',
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

  /**
   * Free a table (make it available)
   */
  const freeTable = async (tableId) => {
    if (!tableId) {
      enqueueSnackbar('Invalid table ID', { variant: 'error' });
      return { success: false, error: 'Invalid parameters' };
    }

    setIsUpdating(true);

    try {
      if (isOfflineMode) {
        // ============================================
        // OFFLINE MODE - Queue for sync
        // ============================================
        console.log(`🔴 [OFFLINE] Freeing table ${tableId}`);

        const updated = await freeTableOffline(tableId);

        if (!updated) {
          throw new Error('Failed to free table in cache');
        }

        // Update React Query cache
        queryClient.setQueryData(['tables'], (old) => {
          if (Array.isArray(old)) {
            return old.map(table => {
              const matches = 
                table._id === tableId ||
                table.tableId === tableId ||
                String(table._id) === String(tableId);

              if (matches) {
                return {
                  ...table,
                  status: 'Available',
                  orderId: null,
                  updatedAt: new Date().toISOString()
                };
              }
              return table;
            });
          }
          return old;
        });

        enqueueSnackbar('Table freed offline - will sync when online', {
          variant: 'warning',
          autoHideDuration: 3000
        });

        console.log(`✅ [OFFLINE] Table freed: ${tableId}`);
        return { success: true, isOffline: true };

      } else {
        // ============================================
        // ONLINE MODE - Update immediately
        // ============================================
        console.log(`🟢 [ONLINE] Freeing table ${tableId}`);

        await updateTableStatus({
          tableId,
          status: 'Available',
          orderId: null
        });

        await queryClient.invalidateQueries({ queryKey: ['tables'] });

        enqueueSnackbar('Table freed successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

        console.log(`✅ [ONLINE] Table freed: ${tableId}`);
        return { success: true, isOffline: false };
      }

    } catch (error) {
      console.error('❌ [TABLE FREE] Error:', error);

      enqueueSnackbar(
        error.response?.data?.message || 'Failed to free table',
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

  /**
   * Update table status (generic)
   */
  const updateStatus = async (tableId, newStatus, orderId = null) => {
    if (!tableId || !newStatus) {
      enqueueSnackbar('Invalid table ID or status', { variant: 'error' });
      return { success: false, error: 'Invalid parameters' };
    }

    setIsUpdating(true);

    try {
      if (isOfflineMode) {
        // ============================================
        // OFFLINE MODE
        // ============================================
        console.log(`🔴 [OFFLINE] Updating table ${tableId} -> ${newStatus}`);

        await updateTableStatusInCache(tableId, newStatus, orderId);

        await addToPendingSync({
          type: 'updateTable',
          tableId: tableId,
          data: {
            status: newStatus,
            orderId: orderId
          }
        });

        // Update React Query cache
        queryClient.setQueryData(['tables'], (old) => {
          if (Array.isArray(old)) {
            return old.map(table => {
              const matches = 
                table._id === tableId ||
                table.tableId === tableId;

              if (matches) {
                return {
                  ...table,
                  status: newStatus,
                  orderId: orderId || table.orderId,
                  updatedAt: new Date().toISOString()
                };
              }
              return table;
            });
          }
          return old;
        });

        enqueueSnackbar('Table updated offline - will sync when online', {
          variant: 'warning',
          autoHideDuration: 3000
        });

        return { success: true, isOffline: true };

      } else {
        // ============================================
        // ONLINE MODE
        // ============================================
        console.log(`🟢 [ONLINE] Updating table ${tableId} -> ${newStatus}`);

        await updateTableStatus({
          tableId,
          status: newStatus,
          orderId
        });

        await queryClient.invalidateQueries({ queryKey: ['tables'] });

        enqueueSnackbar('Table updated successfully', {
          variant: 'success',
          autoHideDuration: 3000
        });

        return { success: true, isOffline: false };
      }

    } catch (error) {
      console.error('❌ [TABLE UPDATE] Error:', error);

      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update table',
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
    bookTable,
    freeTable,
    updateStatus,
    isUpdating
  };
};