"""Flask application exposing the PUII threat detection model."""

from __future__ import annotations

import logging
import os
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from puii_ml.model import model
from puii_ml.schemas import ScoreRequest, TrainRequest

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


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    @app.get("/healthz")
    def healthcheck():
        return jsonify({"status": "ok"})

    @app.post("/api/v1/score")
    @require_api_key
    def score():
        try:
            payload = ScoreRequest.model_validate(request.json or {})
        except ValidationError as exc:
            return jsonify({"errors": exc.errors()}), 400

        assessment = model.score(payload.model_dump())
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

    @app.post("/api/v1/train")
    @require_api_key
    def train():
        try:
            payload = TrainRequest.model_validate(request.json or {})
        except ValidationError as exc:
            return jsonify({"errors": exc.errors()}), 400

        try:
            samples_trained, accuracy = model.train([
                sample.model_dump() for sample in payload.samples
            ])
        except ValueError as exc:
            return jsonify({"message": str(exc)}), 400

        return jsonify(
            {
                "samples_trained": samples_trained,
                "training_accuracy": round(accuracy, 3),
            }
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 6000)))
