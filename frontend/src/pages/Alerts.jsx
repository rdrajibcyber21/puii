import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { useAlerts } from '../hooks/useAlerts.js';

const AlertsPage = () => {
  const {
    alerts, error, refresh, acknowledge, loading,
  } = useAlerts();

  if (!alerts.length && error && !loading) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h5">Alerts</Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={refresh}>
            Refresh
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {alerts.map((alert) => (
            <Grid item xs={12} md={6} key={alert.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {alert.message}
                  </Typography>
                  <Chip label={alert.severity} color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                    Event ID: {alert.event_id || 'N/A'}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Created: {new Date(alert.created_at || Date.now()).toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => acknowledge(alert.id)}
                    disabled={alert.acknowledged}
                  >
                    {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AlertsPage;
