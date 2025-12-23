import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const useSalesReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isEnabled, setIsEnabled] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['salesReport', dateRange],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/optimized-orders/sales-report`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      return response.data.data; // Returns { orders: [], summary: {} }
    },
    enabled: false, // Manual trigger only
  });

  const generateReport = (start, end) => {
    setDateRange({ startDate: start, endDate: end });
    setIsEnabled(true);
    return refetch();
  };

  return {
    reportData: data,
    isLoading,
    isError,
    generateReport
  };
};