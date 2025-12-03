// ============================================
// FILE: hooks/orderData API optimization hooks/useInfiniteOrders.js
// ============================================

import { useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPaginatedOrders } from '../../https/index';

/**
 * Hook for infinite scroll orders with server-side filtering
 * @param {Object} filters - Filter parameters
 * @param {string} filters.status - Order status
 * @param {string} filters.dateFilter - Date filter
 * @param {string} filters.startDate - Start date (for custom)
 * @param {string} filters.endDate - End date (for custom)
 * @param {string} filters.orderType - Order type
 * @param {string} filters.paymentMethod - Payment method
 * @param {boolean} enabled - Whether query should run (for online/offline control)
 */
export const useInfiniteOrders = (filters, enabled = true) => {
  const observerRef = useRef();

  const fetchOrders = async ({ pageParam = 1 }) => {
    const params = {
      page: pageParam,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filters
    };

    return await getPaginatedOrders(params);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['orders', 'infinite', filters],
    queryFn: fetchOrders,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      return pagination?.hasMore ? pagination.currentPage + 1 : undefined;
    },
    enabled, // Control whether query runs (false for offline mode)
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });

  // Flatten all pages into single array
  const orders = data?.pages.flatMap(page => page.data || []) || [];

  // Get total count from first page
  const totalOrders = data?.pages[0]?.pagination?.totalOrders || 0;

  /**
   * Intersection Observer callback for infinite scroll
   * Attach this ref to the last item in your list
   */
  const lastOrderRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log('📜 Loading more orders...');
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return {
    orders,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    lastOrderRef,
    refetch,
    totalOrders
  };
};