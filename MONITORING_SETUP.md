# PUII Monitoring & Observability - Phase 2 Complete

## Overview

Phase 2 of the PUII Security Operations Center has been successfully implemented with comprehensive real-time monitoring, metrics collection, and observability capabilities using Prometheus and Grafana.

## What's Been Added

### 1. Backend Monitoring (Node.js API Gateway)

#### Metrics Collection
- **HTTP Request Metrics**: Rate, duration, status codes, in-flight requests
- **Database Metrics**: Query duration, connection pool status, query counts
- **ML Service Metrics**: Request duration, error rates, endpoint-specific metrics
- **Event Processing Metrics**: Processing duration, threat score distribution, event counts
- **Alert Metrics**: Alert generation, acknowledgment, active alerts by severity
- **WebSocket Metrics**: Connection counts, message rates
- **System Metrics**: Uptime, health status, default Node.js metrics (CPU, memory, event loop)

#### Endpoints
- `/metrics` - Prometheus metrics endpoint
- `/healthz` - Enhanced health check with component status
- `/health` - Alias for health check

#### Middleware
- **Metrics Middleware**: Automatically tracks all HTTP requests
- **Performance Middleware**: Identifies slow requests (>1s)
- **Request ID Tracking**: Unique request IDs for tracing

### 2. ML Service Monitoring (Python Flask)

#### Metrics Collection
- **HTTP Request Metrics**: Request rate, duration, status codes
- **ML Scoring Metrics**: Scoring duration, success/error rates, threat label distribution
- **ML Training Metrics**: Training duration, accuracy tracking
- **Threat Score Distribution**: Histogram of threat scores
- **System Metrics**: Uptime, health status

#### Endpoints
- `/metrics` - Prometheus metrics endpoint
- `/healthz` - Health check endpoint

### 3. Prometheus Configuration

#### Scrape Targets
- API Gateway (Node.js): `localhost:4000/metrics`
- ML Service (Python): `localhost:6000/metrics`
- Node Exporter: System metrics
- Prometheus itself: Self-monitoring

#### Alert Rules
Pre-configured alerts for:
- High error rates
- High request latency
- Service downtime
- Database connection issues
- ML service errors
- High threat scores

### 4. Grafana Dashboards

#### Pre-configured Dashboards
- **PUII Overview Dashboard**: Comprehensive system overview
  - Request rate and errors
  - Request latency (95th percentile)
  - Active requests
  - Events processed
  - Threat score distribution
  - Database connections
  - ML service performance
  - Active alerts
  - WebSocket connections
  - Application health status

### 5. Docker Compose Setup

Complete monitoring stack:
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Node Exporter**: System-level metrics

### 6. Frontend Monitoring Page

New monitoring page (`/monitoring`) with:
- Real-time health status cards
- Performance metrics visualization
- Request rate and error charts
- Latency monitoring
- System resource metrics
- Threat distribution charts
- Performance indicators

## Installation & Setup

### 1. Install Dependencies

#### Node.js Backend
```bash
cd backend/node
yarn install
```

#### Python ML Service
```bash
cd backend/python
pip install -r requirements.txt
```

### 2. Start Application Services

#### Node.js API Gateway
```bash
cd backend/node
yarn dev
# Runs on http://localhost:4000
```

#### Python ML Service
```bash
cd backend/python
python app.py
# Runs on http://localhost:6000
```

### 3. Start Monitoring Stack

```bash
cd monitoring
docker-compose up -d
```

This starts:
- Prometheus on http://localhost:9090
- Grafana on http://localhost:3001
- Node Exporter on http://localhost:9100

### 4. Access Services

- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`
- **Prometheus**: http://localhost:9090
- **Frontend Monitoring**: http://localhost:3000/monitoring

## Metrics Available

### Application-Level Metrics

#### HTTP Metrics
- `puii_http_requests_total` - Total HTTP requests
- `puii_http_request_duration_seconds` - Request duration histogram
- `puii_http_requests_in_flight` - Currently processing requests

#### Database Metrics
- `puii_db_queries_total` - Total database queries
- `puii_db_query_duration_seconds` - Query duration histogram
- `puii_db_connections_active` - Active connections
- `puii_db_connections_idle` - Idle connections

#### ML Service Metrics
- `puii_ml_service_requests_total` - ML service requests
- `puii_ml_service_request_duration_seconds` - ML request duration
- `puii_ml_service_errors_total` - ML service errors

#### Event Metrics
- `puii_events_processed_total` - Total events processed
- `puii_events_processing_duration_seconds` - Event processing duration
- `puii_threat_score_distribution` - Threat score histogram

#### Alert Metrics
- `puii_alerts_total` - Total alerts generated
- `puii_alerts_active` - Active (unacknowledged) alerts

#### WebSocket Metrics
- `puii_websocket_connections` - Active WebSocket connections
- `puii_websocket_messages_total` - Total messages sent

#### System Metrics
- `puii_application_uptime_seconds` - Application uptime
- `puii_application_health` - Component health status

### ML Service Metrics (Python)

- `puii_ml_http_requests_total` - HTTP requests
- `puii_ml_http_request_duration_seconds` - Request duration
- `puii_ml_scoring_total` - ML scoring operations
- `puii_ml_scoring_duration_seconds` - Scoring duration
- `puii_ml_training_total` - Training operations
- `puii_ml_training_duration_seconds` - Training duration
- `puii_ml_threat_score_distribution` - Threat score distribution
- `puii_ml_application_uptime_seconds` - Service uptime
- `puii_ml_application_health` - Service health

## Key Features

### 1. Real-Time Monitoring
- All metrics update in real-time (10-15 second intervals)
- Live health status for all components
- Continuous performance tracking

### 2. Request Tracking
- Every request gets a unique ID (`X-Request-ID` header)
- Request duration tracking
- Error rate monitoring
- Throughput measurement

### 3. Performance Indicators
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- ML service response times

### 4. Health Checks
- Component-level health status
- Database connectivity
- ML service availability
- Overall system health

### 5. Historical Data
- 30-day retention in Prometheus
- Historical trend analysis
- Performance baselines

## Usage Examples

### Query Metrics in Prometheus

```promql
# Request rate
rate(puii_http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(puii_http_request_duration_seconds_bucket[5m]))

# Error rate
rate(puii_http_requests_total{status_code=~"5.."}[5m])

# Active alerts by severity
puii_alerts_active

# Events processed per minute
rate(puii_events_processed_total[1m]) * 60
```

### View Dashboards

1. Open Grafana: http://localhost:3001
2. Navigate to "Dashboards" → "PUII"
3. Select "PUII Security Operations Center - Overview"

### Monitor from Frontend

1. Navigate to http://localhost:3000/monitoring
2. View real-time metrics and health status
3. Charts update automatically every 10 seconds

## Troubleshooting

### Prometheus Not Scraping

1. Check if services are running:
   ```bash
   curl http://localhost:4000/metrics
   curl http://localhost:6000/metrics
   ```

2. Verify Prometheus targets:
   - Open http://localhost:9090/targets
   - All targets should show "UP"

3. For Docker on Linux, update `prometheus.yml`:
   - Replace `host.docker.internal` with `172.17.0.1` or your host IP

### Grafana Not Showing Data

1. Verify Prometheus datasource:
   - Go to Configuration → Data Sources
   - Test the Prometheus connection

2. Check dashboard queries:
   - Open dashboard → Edit
   - Verify queries return data

### Metrics Not Appearing

1. Verify endpoints are accessible:
   ```bash
   curl http://localhost:4000/metrics | head
   curl http://localhost:6000/metrics | head
   ```

2. Check application logs for errors

3. Verify Prometheus configuration:
   ```bash
   docker-compose -f monitoring/docker-compose.yml logs prometheus
   ```

## Next Steps

### Recommended Enhancements

1. **Alertmanager Integration**
   - Configure Alertmanager for alert routing
   - Set up email/Slack notifications
   - Create alert escalation policies

2. **Additional Dashboards**
   - Create service-specific dashboards
   - Add business metrics dashboards
   - Create executive summary dashboards

3. **Log Aggregation**
   - Integrate with Loki or ELK stack
   - Correlate logs with metrics
   - Add log-based alerts

4. **Distributed Tracing**
   - Add OpenTelemetry/Jaeger
   - Track requests across services
   - Identify performance bottlenecks

5. **Advanced Analytics**
   - Anomaly detection
   - Predictive alerting
   - Capacity planning

## Production Considerations

1. **Security**
   - Change default Grafana credentials
   - Enable authentication for Prometheus
   - Use HTTPS for all services

2. **Performance**
   - Adjust scrape intervals based on load
   - Configure retention policies
   - Set up Prometheus federation for scale

3. **Reliability**
   - Set up Prometheus HA
   - Backup Grafana dashboards
   - Monitor the monitoring stack

4. **Cost Optimization**
   - Configure appropriate retention
   - Use recording rules for expensive queries
   - Consider remote storage for long-term data

## Support

For issues or questions:
1. Check the monitoring README: `monitoring/README.md`
2. Review application logs
3. Check Prometheus targets status
4. Verify Grafana datasource configuration

---

**Phase 2 Complete**: The PUII Security Operations Center now has enterprise-grade monitoring and observability capabilities!

