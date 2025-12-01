import { useState, useEffect } from 'react';
import apiClient from '../api/client.js';

export const useIPMetrics = (limit = 500, window = '24h') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/metrics/ip', {
        params: { limit, window },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load IP metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [limit, window]);

  return { data, loading, error, refresh: fetchMetrics };
};

