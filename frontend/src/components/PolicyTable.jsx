import {
  Box,
  Button,
  Card,
  CardContent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const PolicyTable = ({ policies, onUpdate, onDelete, onCreate }) => {
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    threshold: 0.6,
    action: 'block_source',
    enabled: true,
  });

  const handleCreate = () => {
    onCreate(newPolicy);
    setNewPolicy({ name: '', threshold: 0.6, action: 'block_source', enabled: true });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Response Policies
        </Typography>
        <Table size="small" sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Threshold</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.name}</TableCell>
                <TableCell align="right">{policy.threshold}</TableCell>
                <TableCell>{policy.action}</TableCell>
                <TableCell>
                  <Switch
                    checked={Boolean(policy.enabled)}
                    onChange={(event) => onUpdate(policy.id, {
                      threshold: policy.threshold,
                      action: policy.action,
                      enabled: event.target.checked,
                    })}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => onDelete(policy.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {policies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No policies configured.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Typography variant="subtitle1" gutterBottom>
          Add Policy
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Name"
            value={newPolicy.name}
            onChange={(e) => setNewPolicy((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Threshold"
            type="number"
            inputProps={{ step: 0.05, min: 0, max: 1 }}
            value={newPolicy.threshold}
            onChange={(e) => setNewPolicy((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
          />
          <TextField
            label="Action"
            value={newPolicy.action}
            onChange={(e) => setNewPolicy((prev) => ({ ...prev, action: e.target.value }))}
          />
          <Button variant="contained" onClick={handleCreate}>
            Create Policy
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PolicyTable;
