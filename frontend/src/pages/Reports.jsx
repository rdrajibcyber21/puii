import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import ReportsTable from '../components/ReportsTable.jsx';
import DetailModal from '../components/DetailModal.jsx';
import { useReports } from '../hooks/useReports.js';

const ReportsPage = () => {
  const {
    reports, loading, error, createReport, refresh,
  } = useReports();
  const [summary, setSummary] = useState('');
  const [filters, setFilters] = useState('{}');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (refresh) refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    try {
      const parsedFilters = JSON.parse(filters || '{}');
      await createReport({ summary, filters: parsedFilters });
      setSummary('');
      if (refresh) refresh();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Filters must be valid JSON'); // quick feedback for operators
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Threat Intelligence Reports
      </Typography>

      <Box component="form" onSubmit={handleGenerate} sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={5}>
            <TextField
              label="Summary *"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Filters JSON"
              value={filters}
              onChange={(e) => setFilters(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button type="submit" variant="contained" fullWidth color="primary">
              GENERATE REPORT
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Generated Reports
      </Typography>

      {loading && reports.length === 0 ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <ReportsTable reports={reports} onReportClick={handleReportClick} />
          <Button variant="text" sx={{ mt: 2 }} onClick={refresh} color="primary">
            REFRESH
          </Button>
        </>
      )}

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Report Details"
        data={selectedReport}
        type="report"
      />

      <Snackbar open={Boolean(error)} autoHideDuration={6000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsPage;
