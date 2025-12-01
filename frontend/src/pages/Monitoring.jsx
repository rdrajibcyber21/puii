import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#00bfa5', '#ff9800', '#f44336', '#2196f3', '#9c27b0'];

const MonitoringPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds

  const fetchMetrics = async () => {
    try {
      // Fetch health check
      const healthRes = await fetch('http://localhost:4000/healthz');
      const healthData = await healthRes.json();
      setHealth(healthData);

      // Fetch Prometheus metrics (if available)
      // In production, this would query Prometheus API or Grafana
      // For now, we'll use the health endpoint and simulate metrics
      setMetrics({
        requestRate: Math.random() * 100 + 50,
        errorRate: Math.random() * 5,
        avgLatency: Math.random() * 500 + 100,
        activeRequests: Math.floor(Math.random() * 20),
        eventsProcessed: Math.floor(Math.random() * 1000) + 500,
        dbConnections: Math.floor(Math.random() * 5) + 2,
        websocketConnections: Math.floor(Math.random() * 10),
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading && !metrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  // Generate time series data for charts
  const generateTimeSeriesData = (count = 20) => {
    const data = [];
    const now = Date.now();
    for (let i = count; i >= 0; i--) {
      data.push({
        time: new Date(now - i * 60000).toLocaleTimeString(),
        value: Math.random() * 100 + 50,
        errors: Math.random() * 5,
        latency: Math.random() * 500 + 100,
      });
    }
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  const threatDistribution = [
    { name: 'Benign', value: 65 },
    { name: 'Suspicious', value: 25 },
    { name: 'Malicious', value: 10 },
  ];

  const componentHealth = health?.components || {};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        System Monitoring & Metrics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Health Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'text.secondary' }} gutterBottom>
                Overall Health
              </Typography>
              <Chip
                label={health?.overall || 'unknown'}
                color={health?.overall === 'healthy' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Uptime: {health?.uptime ? `${Math.floor(health.uptime / 3600)}h` : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'text.secondary' }} gutterBottom>
                Database
              </Typography>
              <Chip
                label={componentHealth.database?.status || 'unknown'}
                color={componentHealth.database?.status === 'healthy' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
              {componentHealth.database?.latency && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Latency: {componentHealth.database.latency}ms
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'text.secondary' }} gutterBottom>
                ML Service
              </Typography>
              <Chip
                label={componentHealth.mlService?.status || 'unknown'}
                color={componentHealth.mlService?.status === 'healthy' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
              {componentHealth.mlService?.latency && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Latency: {componentHealth.mlService.latency}ms
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'text.secondary' }} gutterBottom>
                Active Requests
              </Typography>
              <Typography variant="h4" color="primary">
                {metrics?.activeRequests || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Request Rate & Errors
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00bfa5"
                  fill="#00bfa5"
                  fillOpacity={0.6}
                  name="Requests/sec"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#f44336"
                  fill="#f44336"
                  fillOpacity={0.6}
                  name="Errors/sec"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Request Latency (ms)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#2196f3"
                  strokeWidth={2}
                  name="Latency (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Events Processed
            </Typography>
            <Typography variant="h3" color="primary">
              {metrics?.eventsProcessed || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Per minute
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Database Connections
            </Typography>
            <Typography variant="h3" color="primary">
              {metrics?.dbConnections || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active connections
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              WebSocket Connections
            </Typography>
            <Typography variant="h3" color="primary">
              {metrics?.websocketConnections || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active clients
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Threat Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Threat Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Indicators
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Request Rate
                </Typography>
                <Typography variant="h6">{metrics?.requestRate?.toFixed(2) || 0} req/s</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Error Rate
                </Typography>
                <Typography variant="h6" color={metrics?.errorRate > 1 ? 'error' : 'textPrimary'}>
                  {metrics?.errorRate?.toFixed(2) || 0} errors/s
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Average Latency
                </Typography>
                <Typography variant="h6">
                  {metrics?.avgLatency?.toFixed(0) || 0} ms
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringPage;

