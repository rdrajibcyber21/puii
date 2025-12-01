import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import EventTable from '../components/EventTable.jsx';
import DetailModal from '../components/DetailModal.jsx';
import { useEvents } from '../hooks/useEvents.js';
import { useWebSocket } from '../hooks/useRealtimeData.js';

const EventsPage = () => {
  const [limit, setLimit] = useState(500); // Large dataset by default
  const { events, loading, refresh } = useEvents(limit);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Real-time event updates via WebSocket
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
  const { connected } = useWebSocket(socketUrl, {
    onMessage: (message) => {
      if (message.type === 'event') {
        // Refresh events when new event arrives
        refresh();
      }
    },
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Latest Network Events
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <TextField
            label="Rows"
            type="number"
            size="small"
            value={limit}
            onChange={(e) => setLimit(Math.min(Math.max(Number(e.target.value), 10), 1000))}
            inputProps={{ min: 10, max: 1000 }}
            sx={{ backgroundColor: '#1f2937', borderRadius: 1 }}
          />
        </Grid>
        <Grid item>
          <Chip
            label={connected ? 'Real-time Connected' : 'Real-time Disconnected'}
            color={connected ? 'success' : 'default'}
            size="small"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={refresh} disabled={loading} color="primary">
            {loading ? 'Refreshing...' : 'REFRESH'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {events?.length || 0} of {limit} events
          </Typography>
        </Grid>
      </Grid>

      {loading && events.length === 0 ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <EventTable events={events} onEventClick={handleEventClick} />
      )}

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Event Details"
        data={selectedEvent}
        type="event"
      />
    </Box>
  );
};

export default EventsPage;
