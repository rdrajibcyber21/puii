import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const DetailModal = ({ open, onClose, title, data, type, maxWidth = 'md' }) => {
  const renderContent = () => {
    if (!data) return <Typography>No data available</Typography>;

    switch (type) {
      case 'event':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Event ID
                </Typography>
                <Typography variant="body1">{data.id}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(data.created_at).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Source IP
                </Typography>
                <Typography variant="body1">{data.source_ip}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Destination IP
                </Typography>
                <Typography variant="body1">{data.destination_ip}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Protocol
                </Typography>
                <Chip label={data.protocol} color="primary" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Payload Size
                </Typography>
                <Typography variant="body1">{data.payload_size} bytes</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Threat Score
                </Typography>
                <Typography variant="h6" color={data.threat_score > 0.7 ? 'error' : 'primary'}>
                  {data.threat_score}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Threat Label
                </Typography>
                <Chip
                  label={data.threat_label}
                  color={data.threat_label === 'malicious' ? 'error' : 'success'}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Response Action
                </Typography>
                <Chip label={data.response_action} color="info" />
              </Paper>
            </Grid>
            {data.metadata && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                    Metadata
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(data.metadata, null, 2)}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      case 'alert':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Alert ID
                </Typography>
                <Typography variant="body1">{data.id}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Message
                </Typography>
                <Typography variant="body1">{data.message}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Severity
                </Typography>
                <Chip
                  label={data.severity?.toUpperCase()}
                  color={
                    data.severity === 'critical' || data.severity === 'high'
                      ? 'error'
                      : data.severity === 'medium'
                        ? 'warning'
                        : 'info'
                  }
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Event ID
                </Typography>
                <Typography variant="body1">{data.event_id}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={data.acknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                  color={data.acknowledged ? 'success' : 'warning'}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(data.created_at).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            {data.acknowledged_at && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                    Acknowledged At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(data.acknowledged_at).toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      case 'policy':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Policy ID
                </Typography>
                <Typography variant="body1">{data.id}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">{data.name}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Threshold
                </Typography>
                <Typography variant="h6">{data.threshold}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Action
                </Typography>
                <Chip label={data.action} color="primary" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={data.enabled ? 'ENABLED' : 'DISABLED'}
                  color={data.enabled ? 'success' : 'default'}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {data.created_at
                    ? new Date(data.created_at).toLocaleString()
                    : 'N/A'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );

      case 'report':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Report ID
                </Typography>
                <Typography variant="body1">{data.id}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Generated By
                </Typography>
                <Typography variant="body1">{data.generated_by}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(data.created_at).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body1">{data.summary || 'N/A'}</Typography>
              </Paper>
            </Grid>
            {data.filters && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} gutterBottom>
                    Filters
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(data.filters, null, 2)}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      case 'ipMetrics':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                <Typography variant="h6" gutterBottom>
                  IP Request Metrics & Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total IPs: {data.totalIPs || 0} | Time Window: {data.timeWindow || '24h'}
                </Typography>
              </Paper>
            </Grid>

            {/* Top Threat Sources */}
            {data.topThreatSources && data.topThreatSources.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="h6" gutterBottom>
                    Top Threat Sources
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Source IP</TableCell>
                        <TableCell align="right">Threat Count</TableCell>
                        <TableCell align="right">Avg Threat Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.topThreatSources.slice(0, 10).map((source, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{source.source_ip}</TableCell>
                          <TableCell align="right">{source.threat_count}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={source.avg_threat_score.toFixed(2)}
                              size="small"
                              color={source.avg_threat_score > 0.7 ? 'error' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            )}

            {/* Protocol Distribution */}
            {data.protocolStats && data.protocolStats.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="h6" gutterBottom>
                    Protocol Distribution
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Protocol</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Avg Threat</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.protocolStats.map((stat, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{stat.protocol}</TableCell>
                          <TableCell align="right">{stat.count}</TableCell>
                          <TableCell align="right">
                            {stat.avg_threat_score.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            )}

            {/* IP Statistics Table */}
            {data.ipStats && data.ipStats.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="h6" gutterBottom>
                    IP Statistics ({data.ipStats.length} IPs)
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table size="small" stickyHeader>
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
                            <b>Malicious</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>Suspicious</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>Benign</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>Blocked</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>Avg Payload</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.ipStats.map((ip, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{ip.source_ip}</TableCell>
                            <TableCell align="right">{ip.request_count}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={ip.avg_threat_score.toFixed(2)}
                                size="small"
                                color={
                                  ip.avg_threat_score > 0.7
                                    ? 'error'
                                    : ip.avg_threat_score > 0.4
                                      ? 'warning'
                                      : 'success'
                                }
                              />
                            </TableCell>
                            <TableCell align="right">{ip.malicious_count}</TableCell>
                            <TableCell align="right">{ip.suspicious_count}</TableCell>
                            <TableCell align="right">{ip.benign_count}</TableCell>
                            <TableCell align="right">
                              {ip.blocked_count > 0 ? (
                                <Chip label={ip.blocked_count} color="error" size="small" />
                              ) : (
                                <Typography variant="body2">0</Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {Math.round(ip.avg_payload_size)} bytes
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      case 'metric':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, backgroundColor: '#111827', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {data.value}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
                  {data.name}
                </Typography>
                {data.caption && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    {data.caption}
                  </Typography>
                )}
              </Paper>
            </Grid>
            {data.breakdown && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="h6" gutterBottom>
                    Breakdown
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.breakdown.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.severity || item.label || 'Unknown'}</TableCell>
                          <TableCell align="right">{item.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            )}
            {data.sources && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
                  <Typography variant="h6" gutterBottom>
                    Monitored Sources
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Source IP</TableCell>
                        <TableCell align="right">Event Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.sources.map((source, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{source.source_ip || source.ip}</TableCell>
                          <TableCell align="right">{source.count || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            )}
          </Grid>
        );

      default:
        return (
          <Paper sx={{ p: 2, backgroundColor: '#111827' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 2)}
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1f2937',
          color: '#fff',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', color: '#fff' }}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
      <DialogContent sx={{ mt: 2 }}>{renderContent()}</DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailModal;
