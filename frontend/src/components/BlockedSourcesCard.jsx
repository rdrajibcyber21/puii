import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';

const BlockedSourcesCard = ({ blocked }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Blocked Sources
      </Typography>
      <List>
        {blocked.map((entry) => (
          <ListItem key={entry.id} disableGutters>
            <ListItemText
              primary={entry.source_ip}
              secondary={`Reason: ${entry.reason}`}
            />
          </ListItem>
        ))}
        {blocked.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No blocked sources recorded.
          </Typography>
        )}
      </List>
    </CardContent>
  </Card>
);

export default BlockedSourcesCard;
