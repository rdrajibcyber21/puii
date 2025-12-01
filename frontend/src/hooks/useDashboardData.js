import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/reports/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
};
