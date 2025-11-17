import { CircularProgress, Grid, Snackbar, Alert } from '@mui/material';
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
    return <CircularProgress />;
  }

  const averageThreatScore = Number.parseFloat(data?.averageThreatScore);
  const averageScore = Number.isFinite(averageThreatScore)
    ? averageThreatScore.toFixed(2)
    : '0.00';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <MetricCard title="Average Threat Score" value={averageScore} caption="Last 24 hours" />
      </Grid>
      <Grid item xs={12} sm={4}>
        <MetricCard
          title="Alerts (7d)"
          value={data?.alertsBySeverity?.reduce((acc, row) => acc + Number(row.count), 0) || 0}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <MetricCard title="Monitored Sources" value={data?.topSources.length || 0} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ThreatBreakdownChart data={data?.threatsByLabel || []} />
      </Grid>
      <Grid item xs={12} md={6}>
        <AlertsList alerts={alerts.slice(0, 5)} />
      </Grid>
      <Grid item xs={12}>
        {eventLoading ? <CircularProgress /> : <EventTable events={events.slice(0, 10)} />}
      </Grid>
      <Snackbar open={Boolean(error || alertError)} autoHideDuration={6000}>
        <Alert severity="error">{error || alertError}</Alert>
      </Snackbar>
    </Grid>
  );
};

export default DashboardPage;
