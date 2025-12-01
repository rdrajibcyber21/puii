import client from 'prom-client';
import { logger } from './logger.js';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'puii_',
});

// Application start time for uptime calculation
const startTime = Date.now();

// HTTP Request Metrics
const httpRequestDuration = new client.Histogram({
  name: 'puii_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

const httpRequestTotal = new client.Counter({
  name: 'puii_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestInFlight = new client.Gauge({
  name: 'puii_http_requests_in_flight',
  help: 'Number of HTTP requests currently being processed',
  registers: [register],
});

// Database Metrics
const dbQueryDuration = new client.Histogram({
  name: 'puii_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const dbQueryTotal = new client.Counter({
  name: 'puii_db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'status'],
  registers: [register],
});

const dbConnectionsActive = new client.Gauge({
  name: 'puii_db_connections_active',
  help: 'Number of active database connections',
  registers: [register],
});

const dbConnectionsIdle = new client.Gauge({
  name: 'puii_db_connections_idle',
  help: 'Number of idle database connections',
  registers: [register],
});

// ML Service Metrics
const mlServiceRequestDuration = new client.Histogram({
  name: 'puii_ml_service_request_duration_seconds',
  help: 'Duration of ML service requests in seconds',
  labelNames: ['endpoint', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const mlServiceRequestTotal = new client.Counter({
  name: 'puii_ml_service_requests_total',
  help: 'Total number of ML service requests',
  labelNames: ['endpoint', 'status'],
  registers: [register],
});

const mlServiceErrors = new client.Counter({
  name: 'puii_ml_service_errors_total',
  help: 'Total number of ML service errors',
  labelNames: ['endpoint', 'error_type'],
  registers: [register],
});

// Event Processing Metrics
const eventsProcessedTotal = new client.Counter({
  name: 'puii_events_processed_total',
  help: 'Total number of network events processed',
  labelNames: ['threat_label', 'response_action'],
  registers: [register],
});

const eventsProcessingDuration = new client.Histogram({
  name: 'puii_events_processing_duration_seconds',
  help: 'Duration of event processing in seconds',
  labelNames: ['stage'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const threatScoreDistribution = new client.Histogram({
  name: 'puii_threat_score_distribution',
  help: 'Distribution of threat scores',
  buckets: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  registers: [register],
});

// Alert Metrics
const alertsTotal = new client.Counter({
  name: 'puii_alerts_total',
  help: 'Total number of alerts generated',
  labelNames: ['severity', 'acknowledged'],
  registers: [register],
});

const alertsActive = new client.Gauge({
  name: 'puii_alerts_active',
  help: 'Number of active (unacknowledged) alerts',
  labelNames: ['severity'],
  registers: [register],
});

// WebSocket Metrics
const websocketConnections = new client.Gauge({
  name: 'puii_websocket_connections',
  help: 'Number of active WebSocket connections',
  registers: [register],
});

const websocketMessagesTotal = new client.Counter({
  name: 'puii_websocket_messages_total',
  help: 'Total number of WebSocket messages sent',
  labelNames: ['type'],
  registers: [register],
});

// System Health Metrics
const applicationUptime = new client.Gauge({
  name: 'puii_application_uptime_seconds',
  help: 'Application uptime in seconds',
  registers: [register],
});

const applicationHealth = new client.Gauge({
  name: 'puii_application_health',
  help: 'Application health status (1 = healthy, 0 = unhealthy)',
  labelNames: ['component'],
  registers: [register],
});

// Update uptime periodically
setInterval(() => {
  applicationUptime.set((Date.now() - startTime) / 1000);
}, 5000);

// Request ID tracking
let requestIdCounter = 0;
export const generateRequestId = () => {
  requestIdCounter += 1;
  return `req-${Date.now()}-${requestIdCounter}`;
};

// Export metrics
export {
  register,
  httpRequestDuration,
  httpRequestTotal,
  httpRequestInFlight,
  dbQueryDuration,
  dbQueryTotal,
  dbConnectionsActive,
  dbConnectionsIdle,
  mlServiceRequestDuration,
  mlServiceRequestTotal,
  mlServiceErrors,
  eventsProcessedTotal,
  eventsProcessingDuration,
  threatScoreDistribution,
  alertsTotal,
  alertsActive,
  websocketConnections,
  websocketMessagesTotal,
  applicationUptime,
  applicationHealth,
  startTime,
};

