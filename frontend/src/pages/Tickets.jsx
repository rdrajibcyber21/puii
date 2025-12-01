import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Assignment, Construction } from '@mui/icons-material';
import React from 'react';

const TicketsPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Assignment sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            On Time Tickets
          </Typography>
          <Chip
            label="Under Development"
            color="warning"
            icon={<Construction />}
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>

      <Card elevation={4} sx={{ borderRadius: 3, backgroundColor: '#1f2937' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Construction sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Module Under Development
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            The On Time Tickets module is currently under development.
          </Typography>

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#111827', p: 2 }}>
                <Typography variant="h6" mb={1}>
                  Planned Features
                </Typography>
                <Box component="ul" sx={{ textAlign: 'left', pl: 2 }}>
                  <li>Ticket Creation & Management</li>
                  <li>SLA Tracking & Compliance</li>
                  <li>Ticket Assignment & Routing</li>
                  <li>Priority & Status Management</li>
                  <li>On-Time Performance Metrics</li>
                  <li>Ticket Analytics & Reporting</li>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: '#111827', p: 2 }}>
                <Typography variant="h6" mb={1}>
                  Status
                </Typography>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Development Progress
                  </Typography>
                  <LinearProgress variant="determinate" value={0} sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Coming Soon...
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TicketsPage;

