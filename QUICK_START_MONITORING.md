# Quick Start Guide - PUII Monitoring Phase 2

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Node.js backend
cd backend/node
yarn install

# Python ML service
cd backend/python
pip install -r requirements.txt
```

### Step 2: Start Application Services

**Terminal 1 - Node.js API Gateway:**
```bash
cd backend/node
yarn dev
# Should start on http://localhost:4000
```

**Terminal 2 - Python ML Service:**
```bash
cd backend/python
python app.py
# Should start on http://localhost:6000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
yarn dev
# Should start on http://localhost:3000
```

### Step 3: Start Monitoring Stack

**Terminal 4 - Monitoring:**
```bash
cd monitoring
docker-compose up -d
```

Wait 30 seconds for services to start, then verify:
```bash
docker-compose ps
# All services should show "Up"
```

### Step 4: Access Services

1. **Grafana Dashboard**: http://localhost:3001
   - Username: `admin`
   - Password: `admin`
   - Navigate to: Dashboards → PUII → PUII Security Operations Center - Overview

2. **Prometheus**: http://localhost:9090
   - Check targets: http://localhost:9090/targets
   - All should show "UP"

3. **Frontend Monitoring Page**: http://localhost:3000/monitoring
   - Real-time metrics and health status

## ✅ Verification Checklist

- [ ] Node.js API Gateway running on port 4000
- [ ] Python ML Service running on port 6000
- [ ] Frontend running on port 3000
- [ ] Prometheus running on port 9090
- [ ] Grafana running on port 3001
- [ ] All Prometheus targets showing "UP"
- [ ] Grafana dashboard displaying metrics
- [ ] Frontend monitoring page accessible

## 📊 What You'll See

### Grafana Dashboard
- Request rate and error charts
- Latency metrics (95th percentile)
- Database connection status
- ML service performance
- Event processing metrics
- Active alerts
- System health indicators

### Frontend Monitoring Page
- Health status cards for all components
- Real-time performance charts
- Request rate visualization
- Error rate monitoring
- System resource metrics

### Prometheus Metrics
- All application metrics available at `/metrics` endpoints
- Query interface at http://localhost:9090
- Pre-configured alert rules

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check if ports are in use
lsof -i :4000
lsof -i :6000
lsof -i :3000
lsof -i :9090
lsof -i :3001
```

### Prometheus Not Scraping
1. Verify services are accessible:
   ```bash
   curl http://localhost:4000/metrics
   curl http://localhost:6000/metrics
   ```

2. Check Prometheus targets: http://localhost:9090/targets

3. For Linux, update `monitoring/prometheus/prometheus.yml`:
   - Replace `host.docker.internal` with `172.17.0.1`

### No Data in Grafana
1. Verify Prometheus datasource:
   - Configuration → Data Sources → Prometheus → Test

2. Check dashboard queries return data:
   - Edit dashboard → Check panel queries

## 📈 Next Steps

1. **Explore Metrics**: Try different PromQL queries in Prometheus
2. **Customize Dashboards**: Create your own Grafana dashboards
3. **Set Up Alerts**: Configure Alertmanager for notifications
4. **Review Documentation**: See `MONITORING_SETUP.md` for details

## 🎯 Key Metrics to Monitor

- **Request Rate**: `rate(puii_http_requests_total[5m])`
- **Error Rate**: `rate(puii_http_requests_total{status_code=~"5.."}[5m])`
- **Latency (p95)**: `histogram_quantile(0.95, rate(puii_http_request_duration_seconds_bucket[5m]))`
- **Active Alerts**: `puii_alerts_active`
- **Events Processed**: `rate(puii_events_processed_total[5m])`

---

**🎉 Congratulations!** Your monitoring infrastructure is now running!

