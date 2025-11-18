// import { CircularProgress, Grid, Snackbar, Alert } from '@mui/material';
// import React from 'react';
// import MetricCard from '../components/MetricCard.jsx';
// import ThreatBreakdownChart from '../components/ThreatBreakdownChart.jsx';
// import AlertsList from '../components/AlertsList.jsx';
// import EventTable from '../components/EventTable.jsx';
// import { useDashboardData } from '../hooks/useDashboardData.js';
// import { useAlerts } from '../hooks/useAlerts.js';
// import { useEvents } from '../hooks/useEvents.js';

// const DashboardPage = () => {
//   const { data, loading, error } = useDashboardData();
//   const { alerts, error: alertError } = useAlerts();
//   const { events, loading: eventLoading } = useEvents(10);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   const averageThreatScore = Number.parseFloat(data?.averageThreatScore);
//   const averageScore = Number.isFinite(averageThreatScore)
//     ? averageThreatScore.toFixed(2)
//     : '0.00';
//   const totalAlerts =
//     data?.alertsBySeverity?.reduce((acc, row) => acc + Number(row.count), 0) ?? 0;
//   const monitoredSources = data?.topSources?.length ?? 0;
//   const latestAlerts = alerts?.slice(0, 5) ?? [];
//   const recentEvents = events?.slice(0, 10) ?? [];

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12} sm={4}>
//         <MetricCard title="Average Threat Score" value={averageScore} caption="Last 24 hours" />
//       </Grid>
//       <Grid item xs={12} sm={4}>
//         <MetricCard title="Alerts (7d)" value={totalAlerts} />
//       </Grid>
//       <Grid item xs={12} sm={4}>
//         <MetricCard title="Monitored Sources" value={monitoredSources} />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <ThreatBreakdownChart data={data?.threatsByLabel || []} />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <AlertsList alerts={latestAlerts} />
//       </Grid>
//       <Grid item xs={12}>
//         {eventLoading ? <CircularProgress /> : <EventTable events={recentEvents} />}
//       </Grid>
//       <Snackbar open={Boolean(error || alertError)} autoHideDuration={6000}>
//         <Alert severity="error">{error || alertError}</Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default DashboardPage;


import {
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import React from 'react';
import MetricCard from '../components/MetricCard.jsx';
import ThreatBreakdownChart from '../components/ThreatBreakdownChart.jsx';
import AlertsList from '../components/AlertsList.jsx';
import EventTable from '../components/EventTable.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useAlerts } from '../hooks/useAlerts.js';
import { useEvents } from '../hooks/useEvents.js';

const DashboardPage = () => {
  const { data, loading, error } = useDashboardData();
  const { alerts, error: alertError } = useAlerts();
  const { events, loading: eventLoading } = useEvents(10);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  const averageThreatScore = Number.parseFloat(data?.averageThreatScore);
  const averageScore =
    Number.isFinite(averageThreatScore) ? averageThreatScore.toFixed(2) : '0.00';
  const totalAlerts =
    data?.alertsBySeverity?.reduce((acc, row) => acc + Number(row.count), 0) ?? 0;
  const monitoredSources = data?.topSources?.length ?? 0;
  const latestAlerts = alerts?.slice(0, 5) ?? [];
  const recentEvents = events?.slice(0, 10) ?? [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Security Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Average Threat Score"
            value={averageScore}
            caption="Last 24 hours"
            color="#00bfa5"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard title="Alerts (7 days)" value={totalAlerts} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard title="Monitored Sources" value={monitoredSources} color="#42a5f5" />
        </Grid>

        {/* Threat Chart & Alerts */}
        <Grid item xs={12} md={6}>
          <ThreatBreakdownChart data={data?.threatsByLabel || []} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertsList alerts={latestAlerts} />
        </Grid>

        {/* Events Table */}
        <Grid item xs={12}>
          {eventLoading ? (
            <Box textAlign="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <EventTable events={recentEvents} />
          )}
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error || alertError)} autoHideDuration={6000}>
        <Alert severity="error">{error || alertError}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;