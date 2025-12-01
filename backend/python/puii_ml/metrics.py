"""Prometheus metrics for PUII ML service."""

from prometheus_client import Counter, Histogram, Gauge, generate_latest, REGISTRY
import time

# Application start time for uptime calculation
_start_time = time.time()

# HTTP Request Metrics
http_request_duration = Histogram(
    'puii_ml_http_request_duration_seconds',
    'Duration of HTTP requests in seconds',
    ['method', 'endpoint', 'status_code'],
    buckets=[0.1, 0.3, 0.5, 1, 2, 5, 10]
)

http_request_total = Counter(
    'puii_ml_http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status_code']
)

# ML Service Specific Metrics
ml_scoring_duration = Histogram(
    'puii_ml_scoring_duration_seconds',
    'Duration of ML scoring operations in seconds',
    ['status'],
    buckets=[0.01, 0.05, 0.1, 0.5, 1, 2]
)

ml_scoring_total = Counter(
    'puii_ml_scoring_total',
    'Total number of ML scoring operations',
    ['status', 'threat_label']
)

ml_training_duration = Histogram(
    'puii_ml_training_duration_seconds',
    'Duration of ML training operations in seconds',
    buckets=[1, 5, 10, 30, 60, 120, 300]
)

ml_training_total = Counter(
    'puii_ml_training_total',
    'Total number of ML training operations',
    ['status']
)

threat_score_distribution = Histogram(
    'puii_ml_threat_score_distribution',
    'Distribution of threat scores from ML model',
    buckets=[0, 0.2, 0.4, 0.6, 0.8, 1.0]
)

# System Metrics
application_uptime = Gauge(
    'puii_ml_application_uptime_seconds',
    'ML service uptime in seconds'
)

application_health = Gauge(
    'puii_ml_application_health',
    'ML service health status (1 = healthy, 0 = unhealthy)',
    ['component']
)

# Update uptime periodically
def update_uptime():
    """Update application uptime metric."""
    application_uptime.set(time.time() - _start_time)

# Export metrics endpoint content
def get_metrics():
    """Get Prometheus metrics in text format."""
    update_uptime()
    return generate_latest(REGISTRY)

