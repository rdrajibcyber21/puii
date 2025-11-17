import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import { SAMPLE_BLOCKED_SOURCES, SAMPLE_POLICIES } from '../lib/fallbackData.js';

export const usePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [blockedSources, setBlockedSources] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [policyRes, blockedRes] = await Promise.all([
        apiClient.get('/policies'),
        apiClient.get('/policies/blocked'),
      ]);
      setPolicies(policyRes.data.data);
      setBlockedSources(blockedRes.data.data);
      setError(null);
    } catch (err) {
      console.warn('API unavailable, using fallback policies data', err);
      setPolicies(SAMPLE_POLICIES);
      setBlockedSources(SAMPLE_BLOCKED_SOURCES);
      setError('API unavailable. Showing sample policies and blocked sources.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPolicy = async (payload) => {
    await apiClient.post('/policies', payload);
    await load();
  };

  const updatePolicy = async (id, payload) => {
    await apiClient.patch(`/policies/${id}`, payload);
    await load();
  };

  const deletePolicy = async (id) => {
    await apiClient.delete(`/policies/${id}`);
    await load();
  };

  const addBlocked = async (payload) => {
    await apiClient.post('/policies/blocked', payload);
    await load();
  };

  return {
    policies,
    blockedSources,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    addBlocked,
    refresh: load,
  };
};
