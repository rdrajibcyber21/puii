import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import apiClient from '../api/client.js';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/alerts');
      setAlerts(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    const socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem('puii_token'),
      },
    });

    socket.on('alert', (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 100));
    });

    socket.on('connect_error', () => {
      setError('Realtime connection failed');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const acknowledge = async (id) => {
    await apiClient.post(`/alerts/${id}/acknowledge`);
    await fetchAlerts();
  };

  return { alerts, error, refresh: fetchAlerts, acknowledge, loading };
};
