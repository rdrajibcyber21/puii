import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { CloudDownload, Warning } from '@mui/icons-material';
import { useState } from 'react';
import apiClient from '../api/client.js';

const DataFetcherButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFetchData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await apiClient.post('/data/fetch/all');
      const alertMsg = response.data.alerts 
        ? `Successfully fetched ${response.data.saved} events and created ${response.data.alerts} alerts!`
        : `Successfully fetched and processed ${response.data.saved} events!`;
      setMessage(alertMsg);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleGenerateAlerts = async () => {
    setAlertLoading(true);
    setMessage(null);
    
    try {
      const response = await apiClient.post('/data/generate-alerts?count=15');
      setMessage(`Successfully generated ${response.data.generated} alerts!`);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setAlertLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <Box>
      <Box display="flex" gap={1} mb={1}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <CloudDownload />}
          onClick={handleFetchData}
          disabled={loading || alertLoading}
        >
          {loading ? 'Fetching...' : 'Fetch Data'}
        </Button>
        <Button
          variant="contained"
          color="warning"
          startIcon={alertLoading ? <CircularProgress size={20} /> : <Warning />}
          onClick={handleGenerateAlerts}
          disabled={loading || alertLoading}
        >
          {alertLoading ? 'Generating...' : 'Generate Alerts'}
        </Button>
      </Box>
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: message.includes('Error') ? 'error.main' : 'success.main',
            mt: 1,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default DataFetcherButton;

