import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import EventTable from '../components/EventTable.jsx';
import { useEvents } from '../hooks/useEvents.js';

const EventsPage = () => {
  const [limit, setLimit] = useState(50);
  const { events, loading, refresh } = useEvents(limit);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <TextField
            label="Rows"
            type="number"
            size="small"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            inputProps={{ min: 10, max: 200 }}
          />
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={refresh}>
            Refresh
          </Button>
        </Grid>
      </Grid>
      {loading ? <CircularProgress /> : <EventTable events={events} />}
    </Box>
  );
};

export default EventsPage;
