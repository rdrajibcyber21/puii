import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';

export const useEvents = (limit = 100) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/events', { params: { limit } });
      setEvents(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [limit]);

  return {
    events,
    loading,
    error,
    refresh: load,
  };
};
