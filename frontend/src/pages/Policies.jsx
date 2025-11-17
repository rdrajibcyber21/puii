import {
  Box,
  Button,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import PolicyTable from '../components/PolicyTable.jsx';
import BlockedSourcesCard from '../components/BlockedSourcesCard.jsx';
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
  } = usePolicies();

  const [blockedForm, setBlockedForm] = useState({ sourceIp: '', reason: '' });

  const handleBlockSubmit = async (event) => {
    event.preventDefault();
    await addBlocked(blockedForm);
    setBlockedForm({ sourceIp: '', reason: '' });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Automated Response Policies
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PolicyTable
            policies={policies}
            onCreate={createPolicy}
            onUpdate={updatePolicy}
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
              label="Source IP"
              value={blockedForm.sourceIp}
              onChange={(e) => setBlockedForm((prev) => ({ ...prev, sourceIp: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Reason"
              value={blockedForm.reason}
              onChange={(e) => setBlockedForm((prev) => ({ ...prev, reason: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              Block Source
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PoliciesPage;
