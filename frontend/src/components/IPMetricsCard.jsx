import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const IPMetricsCard = ({ data, onClick, loading, error }) => {
  if (loading) {
    return (
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            IP Request Metrics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Loading IP metrics...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            IP Request Metrics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Error: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.ipStats || data.ipStats.length === 0) {
    return (
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            IP Request Metrics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No IP metrics data available. Process some network events first to see IP statistics.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            The system will automatically track up to 500 unique source IPs once events are processed.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const topIPs = data.ipStats.slice(0, 10);
  const totalRequests = data.ipStats.reduce((sum, ip) => sum + ip.request_count, 0);
  const totalMalicious = data.ipStats.reduce((sum, ip) => sum + ip.malicious_count, 0);
  const totalBlocked = data.ipStats.reduce((sum, ip) => sum + ip.blocked_count, 0);

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            IP Request Metrics
          </Typography>
          <Chip label={`${data.totalIPs} IPs`} color="primary" size="small" />
        </Box>

        {/* Summary Stats */}
        <Box display="flex" gap={2} mb={3}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">
              Total Requests
            </Typography>
            <Typography variant="h5" color="primary">
              {totalRequests.toLocaleString()}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">
              Malicious
            </Typography>
            <Typography variant="h5" color="error">
              {totalMalicious}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">
              Blocked
            </Typography>
            <Typography variant="h5" color="warning.main">
              {totalBlocked}
            </Typography>
          </Box>
        </Box>

        {/* Time Series Chart */}
        {data.timeSeries && data.timeSeries.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" mb={1}>
              Request Trend
            </Typography>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time_bucket" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="request_count"
                  stroke="#00bfa5"
                  strokeWidth={2}
                  name="Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Top IPs Table */}
        <Typography variant="subtitle2" mb={1}>
          Top Source IPs
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Source IP</b>
              </TableCell>
              <TableCell align="right">
                <b>Requests</b>
              </TableCell>
              <TableCell align="right">
                <b>Avg Threat</b>
              </TableCell>
              <TableCell align="right">
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topIPs.map((ip, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{ip.source_ip}</TableCell>
                <TableCell align="right">{ip.request_count}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={ip.avg_threat_score.toFixed(2)}
                    size="small"
                    color={ip.avg_threat_score > 0.7 ? 'error' : ip.avg_threat_score > 0.4 ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell align="right">
                  {ip.blocked_count > 0 ? (
                    <Chip label="Blocked" color="error" size="small" />
                  ) : (
                    <Chip label="Active" color="success" size="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IPMetricsCard;

