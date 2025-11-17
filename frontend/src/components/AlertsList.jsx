import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { PriorityHigh } from '@mui/icons-material';
import React from 'react';

const severityColors = {
  low: 'success.main',
  medium: 'info.main',
  high: 'warning.main',
  critical: 'error.main',
};

const AlertsList = ({ alerts }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Recent Alerts
      </Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id} disableGutters>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: severityColors[alert.severity] || 'primary.main' }}>
                <PriorityHigh />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={alert.message}
              secondary={`Severity: ${alert.severity} • ${new Date(alert.created_at || Date.now()).toLocaleString()}`}
            />
          </ListItem>
        ))}
        {alerts.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No alerts yet.
          </Typography>
        )}
      </List>
    </CardContent>
  </Card>
);

export default AlertsList;
