"""Flask application exposing the PUII threat detection model."""

from __future__ import annotations

import logging
import os
import time
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from pydantic import ValidationError

from puii_ml.model import model
from puii_ml.schemas import ScoreRequest, TrainRequest
from puii_ml.metrics import (
    http_request_duration,
    http_request_total,
    ml_scoring_duration,
    ml_scoring_total,
    ml_training_duration,
    ml_training_total,
    threat_score_distribution,
    application_health,
    get_metrics,
)

load_dotenv()

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger("puii_ml")

API_KEY = os.environ.get("ML_SERVICE_API_KEY")


def require_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if API_KEY:
            presented = request.headers.get("x-api-key")
            if presented != API_KEY:
                return jsonify({"message": "Unauthorized"}), 401
        return func(*args, **kwargs)

    return wrapper


def track_request_metrics(func):
    """Decorator to track HTTP request metrics."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        method = request.method
        endpoint = request.endpoint or 'unknown'
        
        try:
            response = func(*args, **kwargs)
            status_code = response[1] if isinstance(response, tuple) else 200
            duration = time.time() - start_time
            
            http_request_duration.labels(method=method, endpoint=endpoint, status_code=status_code).observe(duration)
            http_request_total.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
            
            return response
        except Exception as e:
            duration = time.time() - start_time
            status_code = 500
            
            http_request_duration.labels(method=method, endpoint=endpoint, status_code=status_code).observe(duration)
            http_request_total.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
            
            raise
    
    return wrapper


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    @app.get("/healthz")
    @track_request_metrics
    def healthcheck():
        application_health.labels(component='ml_service').set(1)
        return jsonify({"status": "ok"})

    @app.get("/metrics")
    def metrics():
        """Prometheus metrics endpoint."""
        return Response(get_metrics(), mimetype='text/plain')

    @app.post("/api/v1/score")
    @require_api_key
    @track_request_metrics
    def score():
        start_time = time.time()
        
        try:
            payload = ScoreRequest.model_validate(request.json or {})
        except ValidationError as exc:
            ml_scoring_total.labels(status='error', threat_label='unknown').inc()
            return jsonify({"errors": exc.errors()}), 400

        try:
            assessment = model.score(payload.model_dump())
            duration = time.time() - start_time
            
            # Record metrics
            ml_scoring_duration.labels(status='success').observe(duration)
            ml_scoring_total.labels(status='success', threat_label=assessment.threat_label).inc()
            threat_score_distribution.observe(assessment.threat_score)
            
            logger.info(
                "Telemetry scored",
                extra={
                    "event_id": payload.event_id,
                    "threat_score": assessment.threat_score,
                    "label": assessment.threat_label,
                },
            )

            return jsonify(
                {
                    "event_id": payload.event_id,
                    "threat_score": assessment.threat_score,
                    "threat_label": assessment.threat_label,
                    "recommended_action": assessment.recommended_action,
                    "severity": assessment.severity,
                    "message": assessment.message,
                }
            )
        except Exception as e:
            duration = time.time() - start_time
            ml_scoring_duration.labels(status='error').observe(duration)
            ml_scoring_total.labels(status='error', threat_label='unknown').inc()
            raise

    @app.post("/api/v1/train")
    @require_api_key
    @track_request_metrics
    def train():
        start_time = time.time()
        
        try:
            payload = TrainRequest.model_validate(request.json or {})
        except ValidationError as exc:
            ml_training_total.labels(status='error').inc()
            return jsonify({"errors": exc.errors()}), 400

        try:
            samples_trained, accuracy = model.train([
                sample.model_dump() for sample in payload.samples
            ])
            duration = time.time() - start_time
            
            # Record metrics
            ml_training_duration.observe(duration)
            ml_training_total.labels(status='success').inc()
            
            return jsonify(
                {
                    "samples_trained": samples_trained,
                    "training_accuracy": round(accuracy, 3),
                }
            )
        except ValueError as exc:
            duration = time.time() - start_time
            ml_training_duration.observe(duration)
            ml_training_total.labels(status='error').inc()
            return jsonify({"message": str(exc)}), 400

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 6000)))
