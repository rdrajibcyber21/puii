import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';

const EventTable = ({ events }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Latest Network Events
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Source IP</TableCell>
            <TableCell>Destination IP</TableCell>
            <TableCell>Protocol</TableCell>
            <TableCell align="right">Payload (bytes)</TableCell>
            <TableCell align="right">Threat Score</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} hover>
              <TableCell>{event.source_ip}</TableCell>
              <TableCell>{event.destination_ip}</TableCell>
              <TableCell>{event.protocol}</TableCell>
              <TableCell align="right">{event.payload_size}</TableCell>
              <TableCell align="right">{event.threat_score}</TableCell>
              <TableCell>{event.threat_label}</TableCell>
              <TableCell>{event.response_action}</TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary">
                  No events yet.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default EventTable;
