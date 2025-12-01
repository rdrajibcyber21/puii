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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import MetricCard from '../components/MetricCard.jsx';
import ThreatBreakdownChart from '../components/ThreatBreakdownChart.jsx';
import AlertsList from '../components/AlertsList.jsx';
import EventTable from '../components/EventTable.jsx';
import DetailModal from '../components/DetailModal.jsx';
import IPMetricsCard from '../components/IPMetricsCard.jsx';
import DataFetcherButton from '../components/DataFetcherButton.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useAlerts } from '../hooks/useAlerts.js';
import { useEvents } from '../hooks/useEvents.js';
import { useIPMetrics } from '../hooks/useIPMetrics.js';
import { usePollingData } from '../hooks/useRealtimeData.js';

const DashboardPage = () => {
  const { data, loading, error, refresh: refreshDashboard } = useDashboardData();
  const { alerts, error: alertError } = useAlerts();
  const { events, loading: eventLoading, refresh: refreshEvents } = useEvents(500); // Show 500 events
  const { data: ipMetrics, loading: ipMetricsLoading, error: ipMetricsError, refresh: refreshIPMetrics } = useIPMetrics(500, '24h');

  // Stable active requests value (use ref to prevent flickering)
  const stableActiveRequests = useRef(0);
  const requestHistory = useRef([]);
  const requestRateHistory = useRef([]);
  const lastRequestTotal = useRef(0);

  // Memoize the fetch function to prevent infinite loops
  const fetchMonitoringData = useCallback(async () => {
      try {
        const [healthRes, metricsRes] = await Promise.all([
          fetch('http://localhost:4000/healthz').then((r) => r.json()),
          fetch('http://localhost:4000/metrics')
            .then((r) => r.text())
            .catch(() => null),
        ]);

        // Parse Prometheus metrics
        let parsedMetrics = {};
        if (metricsRes) {
          const lines = metricsRes.split('\n');
          lines.forEach((line) => {
            if (line.startsWith('puii_') && !line.startsWith('#')) {
              const match = line.match(/^([a-z_]+)\s+([0-9.]+)/);
              if (match) {
                parsedMetrics[match[1]] = parseFloat(match[2]);
              }
            }
          });
        }

        // Calculate stable active requests (average of last 10 readings for stability)
        const currentActive = parsedMetrics.puii_http_requests_in_flight || 0;
        requestHistory.current.push(currentActive);
        if (requestHistory.current.length > 10) {
          requestHistory.current.shift();
        }
        // Only update if we have enough readings to smooth out fluctuations
        if (requestHistory.current.length >= 3) {
          const avgActive = Math.round(
            requestHistory.current.reduce((a, b) => a + b, 0) / requestHistory.current.length,
          );
          // Only update if change is significant (more than 1) to prevent micro-fluctuations
          if (Math.abs(avgActive - stableActiveRequests.current) > 1 || stableActiveRequests.current === 0) {
            stableActiveRequests.current = avgActive;
          }
        } else {
          stableActiveRequests.current = currentActive;
        }

        // Calculate stable request rate (average of last 3 readings)
        const currentRequestTotal = parsedMetrics.puii_http_requests_total || 0;
        let requestRate = 0;
        
        if (lastRequestTotal.current > 0) {
          // Calculate rate based on difference (polling every 10 seconds)
          const diff = currentRequestTotal - lastRequestTotal.current;
          const rate = diff / 10; // requests per second
          requestRateHistory.current.push(rate);
          if (requestRateHistory.current.length > 3) {
            requestRateHistory.current.shift();
          }
          const avgRate = requestRateHistory.current.reduce((a, b) => a + b, 0) / requestRateHistory.current.length;
          requestRate = Math.max(0, avgRate); // Ensure non-negative
        }
        lastRequestTotal.current = currentRequestTotal;

        return {
          health: healthRes,
          metrics: parsedMetrics,
          requestRate,
          activeRequests: stableActiveRequests.current,
          eventsProcessed: parsedMetrics.puii_events_processed_total || 0,
          dbConnections: parsedMetrics.puii_db_connections_active || 0,
          websocketConnections: parsedMetrics.puii_websocket_connections || 0,
        };
      } catch (err) {
        return {
          health: { overall: 'unknown' },
          metrics: {},
          requestRate: 0,
          activeRequests: stableActiveRequests.current,
          eventsProcessed: 0,
          dbConnections: 0,
          websocketConnections: 0,
        };
      }
  }, []); // Empty deps - function doesn't depend on any props/state

  // Real-time monitoring metrics
  const { data: monitoringData } = usePollingData(fetchMonitoringData, 10000);

  // Auto-refresh dashboard data - hooks handle their own refresh via WebSocket/polling

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleItemClick = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setModalOpen(true);
  };

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
  const recentEvents = events?.slice(0, 500) ?? []; // Show up to 500 events

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Security Overview
        </Typography>
        <DataFetcherButton
          onSuccess={() => {
            refreshDashboard();
            refreshEvents();
            refreshIPMetrics();
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Metric Cards - Clickable */}
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Average Threat Score"
            value={averageScore}
            caption="Last 24 hours"
            color="#00bfa5"
            onClick={() =>
              handleItemClick(
                {
                  name: 'Average Threat Score',
                  value: averageScore,
                  caption: 'Last 24 hours',
                  trend: data?.threatScoreTrend || 0,
                },
                'metric',
              )
            }
            data={{ name: 'Average Threat Score', value: averageScore }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Alerts (7 days)"
            value={totalAlerts}
            color="#ff9800"
            onClick={() =>
              handleItemClick(
                {
                  name: 'Alerts (7 days)',
                  value: totalAlerts,
                  caption: 'Total alerts in the last 7 days',
                  breakdown: data?.alertsBySeverity || [],
                },
                'metric',
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Monitored Sources"
            value={monitoredSources >= 500 ? '500+' : monitoredSources}
            color="#42a5f5"
            onClick={() =>
              handleItemClick(
                {
                  name: 'Monitored Sources',
                  value: monitoredSources,
                  caption: `Active monitored sources (showing ${Math.min(monitoredSources, 500)} of ${monitoredSources})`,
                  sources: data?.topSources || [],
                  totalSources: monitoredSources,
                },
                'metric',
              )
            }
          />
        </Grid>

        {/* Real-time Monitoring Cards */}
        {monitoringData && (
          <>
            <Grid item xs={12} sm={4}>
              <MetricCard
                title="Request Rate"
                value={`${(monitoringData.requestRate || 0).toFixed(1)}/s`}
                caption="Real-time"
                color="#00bfa5"
                onClick={() =>
                  handleItemClick(
                    {
                      name: 'Request Rate',
                      value: `${(monitoringData.requestRate || 0).toFixed(1)}/s`,
                      caption: 'Requests per second',
                      breakdown: [
                        { label: 'Total Requests', count: lastRequestTotal.current },
                        { label: 'Rate History', count: requestRateHistory.current.length },
                      ],
                    },
                    'metric',
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard
                title="Active Requests"
                value={monitoringData.activeRequests || 0}
                caption="In-flight (stable)"
                color="#ff9800"
                onClick={() =>
                  handleItemClick(
                    {
                      name: 'Active Requests',
                      value: monitoringData.activeRequests || 0,
                      caption: 'Currently processing requests (averaged over last 10 readings)',
                      breakdown: [
                        { label: 'Current Reading', count: requestHistory.current[requestHistory.current.length - 1] || 0 },
                        { label: 'Average', count: monitoringData.activeRequests || 0 },
                      ],
                    },
                    'metric',
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <MetricCard
                title="Events Processed"
                value={monitoringData.eventsProcessed || 0}
                caption="Total"
                color="#42a5f5"
                onClick={() =>
                  handleItemClick(
                    {
                      name: 'Events Processed',
                      value: monitoringData.eventsProcessed || 0,
                      caption: 'Total events processed',
                    },
                    'metric',
                  )
                }
              />
            </Grid>
          </>
        )}

        {/* IP Metrics Card - Large dataset */}
        <Grid item xs={12}>
          <IPMetricsCard
            data={ipMetrics}
            loading={ipMetricsLoading}
            error={ipMetricsError}
            onClick={() =>
              handleItemClick(
                {
                  name: 'IP Request Metrics & Analysis',
                  ...ipMetrics,
                  totalIPs: ipMetrics?.totalIPs || 0,
                  timeWindow: ipMetrics?.timeWindow || '24h',
                },
                'ipMetrics',
              )
            }
          />
        </Grid>

        {/* Threat Chart & Alerts */}
        <Grid item xs={12} md={6}>
          <ThreatBreakdownChart
            data={data?.threatsByLabel || []}
            onClick={() =>
              handleItemClick(
                {
                  name: 'Threat Breakdown',
                  breakdown: data?.threatsByLabel || [],
                  caption: 'Distribution of threat labels',
                },
                'metric',
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertsList
            alerts={latestAlerts}
            onAlertClick={(alert) => handleItemClick(alert, 'alert')}
          />
        </Grid>

        {/* Events Table */}
        <Grid item xs={12}>
          {eventLoading ? (
            <Box textAlign="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <EventTable
              events={recentEvents}
              onEventClick={(event) => handleItemClick(event, 'event')}
            />
          )}
        </Grid>
      </Grid>

      {/* Detail Modal */}
      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === 'event'
            ? 'Event Details'
            : modalType === 'alert'
              ? 'Alert Details'
              : modalType === 'ipMetrics'
                ? 'IP Request Metrics & Analysis'
                : modalType === 'metric'
                  ? 'Metric Details'
                  : 'Details'
        }
        data={selectedItem}
        type={modalType}
      />

      {/* Error Snackbar */}
      <Snackbar open={Boolean(error || alertError)} autoHideDuration={6000}>
        <Alert severity="error">{error || alertError}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;