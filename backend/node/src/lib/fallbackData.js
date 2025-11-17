export const SAMPLE_EVENTS = [
  {
    id: 'evt-fallback-1',
    source_ip: '10.0.0.5',
    destination_ip: '172.16.0.2',
    protocol: 'HTTP',
    payload_size: 800,
    metadata: { byte_entropy: 5.2, failed_auth: 0 },
    threat_score: 0.21,
    threat_label: 'benign',
    response_action: 'allow',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-fallback-2',
    source_ip: '203.0.113.44',
    destination_ip: '172.16.0.10',
    protocol: 'TCP',
    payload_size: 1500,
    metadata: { byte_entropy: 7.4, failed_auth: 15 },
    threat_score: 0.74,
    threat_label: 'malicious',
    response_action: 'block_source',
    created_at: new Date().toISOString(),
  },
];

export const SAMPLE_ALERTS = [
  {
    id: 'alt-fallback-1',
    event_id: 'evt-fallback-2',
    severity: 'high',
    message: 'Suspicious traffic detected to protected host',
    acknowledged: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'alt-fallback-2',
    event_id: 'evt-fallback-1',
    severity: 'medium',
    message: 'Increased byte entropy observed',
    acknowledged: true,
    acknowledged_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const SAMPLE_POLICIES = [
  {
    id: 'pol-fallback-1',
    name: 'Default block on high threat',
    threshold: 0.7,
    action: 'block_source',
    enabled: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'pol-fallback-2',
    name: 'Alert on medium threat',
    threshold: 0.4,
    action: 'alert',
    enabled: true,
    created_at: new Date().toISOString(),
  },
];

export const SAMPLE_BLOCKED_SOURCES = [
  {
    id: 'blk-fallback-1',
    source_ip: '203.0.113.50',
    reason: 'Multiple failed authentications',
    expires_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blk-fallback-2',
    source_ip: '198.51.100.27',
    reason: 'Malware download attempt',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const SAMPLE_DASHBOARD_METRICS = {
  threatsByLabel: [
    { label: 'malicious', count: 4 },
    { label: 'benign', count: 12 },
  ],
  alertsBySeverity: [
    { severity: 'high', count: 1 },
    { severity: 'medium', count: 1 },
  ],
  averageThreatScore: 0.42,
  topSources: [
    { source_ip: '203.0.113.44', count: 3 },
    { source_ip: '10.0.0.5', count: 2 },
  ],
};

export const SAMPLE_REPORTS = [
  {
    id: 'rep-fallback-1',
    generated_by: 'system',
    summary: 'No database connection detected. Showing cached sample report.',
    created_at: new Date().toISOString(),
  },
];
