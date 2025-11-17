import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import { SAMPLE_REPORTS } from '../lib/fallbackData.js';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/reports');
      setReports(data.data);
      setError(null);
    } catch (err) {
      console.warn('API unavailable, using fallback reports data', err);
      setReports(SAMPLE_REPORTS);
      setError('API unavailable. Showing sample reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createReport = async ({ filters, summary }) => {
    await apiClient.post('/reports', { filters, summary });
    await load();
  };

  return {
    reports,
    loading,
    error,
    createReport,
    refresh: load,
  };
};
