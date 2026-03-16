// // ============================================
// // FILE: hooks/orderData API optimization hooks/useAnalytics.js
// // ============================================

// import { useQuery } from '@tanstack/react-query';
// import { 
//   getDashboardAnalytics, 
//   getTodayAnalytics, 
//   getPopularDishes 
// } from '../../https/index';

// /**
//  * Hook for dashboard analytics (Dashboard page)
//  * @param {number} dateRange - Number of days to fetch data for
//  */
// export const useDashboardAnalytics = (dateRange = 30) => {
//   const { data, isLoading, isError, error, refetch } = useQuery({
//     queryKey: ['analytics', 'dashboard', dateRange],
//     queryFn: () => getDashboardAnalytics(dateRange),
//     staleTime: 60000, // 1 minute - data stays fresh
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   return {
//     analytics: data?.data || null,
//     isLoading,
//     isError,
//     error,
//     refetch
//   };
// };

// /**
//  * Hook for today's analytics (Home page)
//  * Refetches more frequently for real-time updates
//  */
// export const useTodayAnalytics = () => {
//   const { data, isLoading, isError, error, refetch } = useQuery({
//     queryKey: ['analytics', 'today'],
//     queryFn: getTodayAnalytics,
//     staleTime: 30000, // 30 seconds - more frequent updates
//     refetchOnWindowFocus: true, // Refetch when user returns to tab
//     refetchInterval: 60000, // Auto-refetch every 60 seconds
//     retry: 2,
//   });

//   return {
//     todayData: data?.data || null,
//     isLoading,
//     isError,
//     error,
//     refetch
//   };
// };

// /**
//  * Hook for popular dishes
//  * @param {number} dateRange - Number of days to analyze
//  * @param {number} limit - Number of dishes to return
//  */
// export const usePopularDishes = (dateRange = 30, limit = 10) => {
//   const { data, isLoading, isError, error, refetch } = useQuery({
//     queryKey: ['analytics', 'popular-dishes', dateRange, limit],
//     queryFn: () => getPopularDishes(limit, dateRange),
//     staleTime: 60000, // 1 minute
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   return {
//     dishes: data?.data || [],
//     isLoading,
//     isError,
//     error,
//     refetch
//   };
// };


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
 * @param {Object} filters - Filter parameters
 * @param {number} filters.dateRange - Number of days to fetch data for
 * @param {string} filters.orderType - Order type filter (Dine-in, Take Away, Delivery)
 * @param {string} filters.startDate - Custom start date (YYYY-MM-DD)
 * @param {string} filters.endDate - Custom end date (YYYY-MM-DD)
 */
export const useDashboardAnalytics = (filters = {}) => {
  const { dateRange = 30, orderType, startDate, endDate } = filters;

  // console.log('🔍 useDashboardAnalytics called with filters:', filters);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analytics', 'dashboard', dateRange, orderType, startDate, endDate],
    queryFn: () => {
      // console.log('📡 Fetching analytics with filters:', filters);
      return getDashboardAnalytics(filters);
    },
    staleTime: 60000, // 1 minute - data stays fresh
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // console.log('📊 Analytics data received:', data?.data);

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