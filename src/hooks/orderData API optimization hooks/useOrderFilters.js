// ============================================
// FILE: hooks/orderData API optimization hooks/useOrderFilters.js
// ============================================

import { useQuery } from '@tanstack/react-query';
import { getOrderStats, getPaymentTotals } from '../../https/index';

/**
 * Hook for order statistics (counts by status)
 * @param {Object} filters - Filter parameters
 * @param {boolean} enabled - Whether query should run
 */
export const useOrderStats = (filters = {}, enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders', 'stats', filters],
    queryFn: () => getOrderStats(filters),
    enabled,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    stats: data?.data || null,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * Hook for payment totals with filters
 * @param {Object} filters - Filter parameters
 * @param {boolean} enabled - Whether query should run
 */
export const usePaymentTotals = (filters = {}, enabled = true) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orders', 'payment-totals', filters],
    queryFn: () => getPaymentTotals(filters),
    enabled,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    totals: data?.data?.totals || {
      Cash: '0.000',
      Online: '0.000',
      Benefit: '0.000',
      Total: '0.000'
    },
    counts: data?.data?.counts || {
      Cash: 0,
      Online: 0,
      Benefit: 0,
      Total: 0
    },
    isLoading,
    isError,
    error,
    refetch
  };
};