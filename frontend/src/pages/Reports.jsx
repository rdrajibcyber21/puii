import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import ReportsTable from '../components/ReportsTable.jsx';
import { useReports } from '../hooks/useReports.js';

const ReportsPage = () => {
  const {
    reports, loading, error, createReport, refresh,
  } = useReports();
  const [summary, setSummary] = useState('');
  const [filters, setFilters] = useState('{}');

  const handleGenerate = async (event) => {
    event.preventDefault();
    try {
      const parsedFilters = JSON.parse(filters || '{}');
      await createReport({ summary, filters: parsedFilters });
      setSummary('');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Filters must be valid JSON'); // quick feedback for operators
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Threat Intelligence Reports
      </Typography>
      <Box component="form" onSubmit={handleGenerate} sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Filters JSON"
          value={filters}
          onChange={(e) => setFilters(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <Button type="submit" variant="contained">
          Generate Report
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <ReportsTable reports={reports} />
          <Button variant="text" sx={{ mt: 1 }} onClick={refresh}>
            Refresh
          </Button>
        </>
      )}
      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsPage;
