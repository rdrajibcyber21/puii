import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';

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
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load policies');
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
