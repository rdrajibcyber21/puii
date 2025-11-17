import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const MetricCard = ({ title, value, caption }) => (
  <Card>
    <CardContent>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3">{value}</Typography>
      {caption && (
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default MetricCard;
