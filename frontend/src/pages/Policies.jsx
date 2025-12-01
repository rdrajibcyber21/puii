import {
  Box,
  Button,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import PolicyTable from '../components/PolicyTable.jsx';
import BlockedSourcesCard from '../components/BlockedSourcesCard.jsx';
import DetailModal from '../components/DetailModal.jsx';
import { usePolicies } from '../hooks/usePolicies.js';

const PoliciesPage = () => {
  const {
    policies,
    blockedSources,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    addBlocked,
    refresh,
  } = usePolicies();

  const [blockedForm, setBlockedForm] = useState({ sourceIp: '', reason: '' });
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (refresh) refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleBlockSubmit = async (event) => {
    event.preventDefault();
    await addBlocked(blockedForm);
    setBlockedForm({ sourceIp: '', reason: '' });
  };

  const handlePolicyView = (policyId, policy, action) => {
    if (action === 'view') {
      setSelectedPolicy(policy);
      setModalOpen(true);
    } else {
      updatePolicy(policyId, policy);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Automated Response Policies
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PolicyTable
            policies={policies}
            onCreate={createPolicy}
            onUpdate={handlePolicyView}
            onDelete={deletePolicy}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <BlockedSourcesCard blocked={blockedSources} />
          <Box component="form" sx={{ mt: 3 }} onSubmit={handleBlockSubmit}>
            <Typography variant="subtitle1" gutterBottom>
              Add Blocked Source
            </Typography>
            <TextField
              label="Source IP *"
              value={blockedForm.sourceIp}
              onChange={(e) => setBlockedForm((prev) => ({ ...prev, sourceIp: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Reason *"
              value={blockedForm.reason}
              onChange={(e) => setBlockedForm((prev) => ({ ...prev, reason: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              BLOCK SOURCE
            </Button>
          </Box>
        </Grid>
      </Grid>

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Policy Details"
        data={selectedPolicy}
        type="policy"
      />

      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PoliciesPage;
