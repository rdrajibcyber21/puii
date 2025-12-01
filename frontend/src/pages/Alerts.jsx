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
import React, { useState, useEffect } from 'react';
import { useAlerts } from '../hooks/useAlerts.js';
import DetailModal from '../components/DetailModal.jsx';

const AlertsPage = () => {
  const {
    alerts, error, refresh, acknowledge, loading,
  } = useAlerts();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setModalOpen(true);
  };

  const handleAcknowledge = async (alertId, e) => {
    e.stopPropagation(); // Prevent modal from opening
    await acknowledge(alertId);
  };

  if (!alerts.length && error && !loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight="bold">
            Alerts
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={refresh} disabled={loading} color="primary">
            {loading ? 'Refreshing...' : 'REFRESH'}
          </Button>
        </Grid>
      </Grid>

      {loading && alerts.length === 0 ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {alerts.map((alert) => (
            <Grid item xs={12} md={6} key={alert.id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => handleAlertClick(alert)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {alert.message}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={alert.severity.toUpperCase()}
                      color={
                        alert.severity === 'critical' || alert.severity === 'high'
                          ? 'error'
                          : alert.severity === 'medium'
                            ? 'warning'
                            : 'info'
                      }
                      sx={{ mr: 1 }}
                    />
                    {alert.acknowledged && (
                      <Chip label="ACKNOWLEDGED" color="success" size="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Event ID: {alert.event_id || 'N/A'}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom sx={{ mb: 2 }}>
                    Created: {new Date(alert.created_at || Date.now()).toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    disabled={alert.acknowledged}
                    color={alert.acknowledged ? 'default' : 'success'}
                  >
                    {alert.acknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {alerts.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center" py={5}>
                No alerts yet.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Alert Details"
        data={selectedAlert}
        type="alert"
      />
    </Box>
  );
};

export default AlertsPage;
