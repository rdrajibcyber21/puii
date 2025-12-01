# PUII Monitoring & Observability Setup

This directory contains the complete monitoring and observability infrastructure for the PUII Security Operations Center.

## Components

### Prometheus
- **Purpose**: Metrics collection and storage
- **Port**: 9090
- **Configuration**: `prometheus/prometheus.yml`
- **Alerts**: `prometheus/alerts.yml`

### Grafana
- **Purpose**: Metrics visualization and dashboards
- **Port**: 3001
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin`
- **Dashboards**: Auto-provisioned from `grafana/dashboards/`

### Node Exporter
- **Purpose**: System-level metrics (CPU, memory, disk, network)
- **Port**: 9100

## Quick Start

1. **Start the monitoring stack:**
   ```bash
   cd monitoring
   docker-compose up -d
   ```

2. **Access the services:**
   - Grafana: http://localhost:3001
   - Prometheus: http://localhost:9090
   - Node Exporter: http://localhost:9100/metrics

3. **Verify metrics collection:**
   - Check Prometheus targets: http://localhost:9090/targets
   - All targets should show as "UP"

## Configuration

### Prometheus Targets

The Prometheus configuration scrapes metrics from:
- **API Gateway** (Node.js): `http://host.docker.internal:4000/metrics`
- **ML Service** (Python): `http://host.docker.internal:6000/metrics`
- **Node Exporter**: `http://node-exporter:9100/metrics`

### Grafana Dashboards

Pre-configured dashboards:
- **PUII Overview**: Comprehensive system overview with key metrics
- Additional dashboards can be added to `grafana/dashboards/`

### Alerting Rules

Alert rules are defined in `prometheus/alerts.yml`:
- High error rate
- High request latency
- Service down
- Database connection issues
- ML service errors
- High threat scores

## Metrics Available

### Application Metrics
- HTTP request rate, duration, and errors
- Database query performance
- ML service request metrics
- Event processing metrics
- Alert metrics
- WebSocket connection metrics
- Application uptime and health

### System Metrics (via Node Exporter)
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

## Integration with Application

### Node.js Backend
- Metrics endpoint: `/metrics`
- Health check: `/healthz` or `/health`
- Request tracking via middleware
- Automatic metrics collection

### Python ML Service
- Metrics endpoint: `/metrics`
- Health check: `/healthz`
- ML-specific metrics (scoring, training)

## Troubleshooting

### Prometheus not scraping targets
1. Check if services are running on correct ports
2. Verify `host.docker.internal` resolves correctly (macOS/Windows)
3. For Linux, you may need to use `172.17.0.1` or the actual host IP

### Grafana not showing data
1. Verify Prometheus is running and accessible
2. Check Grafana datasource configuration
3. Ensure dashboards are properly formatted JSON

### Metrics not appearing
1. Verify application services are running
2. Check `/metrics` endpoints are accessible
3. Review Prometheus logs: `docker-compose logs prometheus`

## Production Considerations

1. **Security**: Change default Grafana credentials
2. **Retention**: Adjust Prometheus retention in `docker-compose.yml`
3. **Scaling**: Consider Prometheus federation for large deployments
4. **Alerting**: Configure Alertmanager for production alerting
5. **Backup**: Regular backups of Grafana dashboards and Prometheus data

## Next Steps

- Configure Alertmanager for alert routing
- Set up additional dashboards for specific use cases
- Integrate with external monitoring services
- Set up log aggregation (e.g., Loki, ELK stack)

