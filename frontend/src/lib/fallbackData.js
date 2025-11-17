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

export const SAMPLE_REPORTS = [
  {
    id: 'rep-fallback-1',
    generated_by: 'system',
    summary: 'No backend connection detected. Showing cached sample report.',
    created_at: new Date().toISOString(),
  },
];
