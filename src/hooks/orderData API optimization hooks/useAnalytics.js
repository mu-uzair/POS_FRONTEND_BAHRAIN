// ============================================
// FILE: hooks/orderData API optimization hooks/useAnalytics.js
// ============================================

import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardAnalytics, 
  getTodayAnalytics, 
  getPopularDishes 
} from '../../https/index';

/**
 * Hook for dashboard analytics (Dashboard page)
 * @param {number} dateRange - Number of days to fetch data for
 */
export const useDashboardAnalytics = (dateRange = 30) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analytics', 'dashboard', dateRange],
    queryFn: () => getDashboardAnalytics(dateRange),
    staleTime: 60000, // 1 minute - data stays fresh
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    analytics: data?.data || null,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * Hook for today's analytics (Home page)
 * Refetches more frequently for real-time updates
 */
export const useTodayAnalytics = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analytics', 'today'],
    queryFn: getTodayAnalytics,
    staleTime: 30000, // 30 seconds - more frequent updates
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 60000, // Auto-refetch every 60 seconds
    retry: 2,
  });

  return {
    todayData: data?.data || null,
    isLoading,
    isError,
    error,
    refetch
  };
};

/**
 * Hook for popular dishes
 * @param {number} dateRange - Number of days to analyze
 * @param {number} limit - Number of dishes to return
 */
export const usePopularDishes = (dateRange = 30, limit = 10) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analytics', 'popular-dishes', dateRange, limit],
    queryFn: () => getPopularDishes(limit, dateRange),
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    dishes: data?.data || [],
    isLoading,
    isError,
    error,
    refetch
  };
};