from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Tuple

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

MODEL_PATH = Path(__file__).resolve().parent / "model_store.joblib"


@dataclass
class ThreatAssessment:
    threat_score: float
    threat_label: str
    recommended_action: str
    severity: str
    message: str


class ThreatModel:
    def __init__(self) -> None:
        self.classifier = None
        if MODEL_PATH.exists():
            self.classifier = joblib.load(MODEL_PATH)

    @staticmethod
    def _protocol_to_index(protocol: str) -> int:
        mapping = {"TCP": 0, "UDP": 1, "ICMP": 2, "HTTP": 3, "HTTPS": 4}
        return mapping.get(protocol.upper(), -1)

    def _extract_features(self, event: Dict) -> np.ndarray:
        payload_size = float(event.get("payload_size", 0))
        protocol_index = self._protocol_to_index(event.get("protocol", ""))
        metadata = event.get("metadata") or {}

        anomaly_flag = 1.0 if metadata.get("is_anomaly") else 0.0
        byte_entropy = float(metadata.get("byte_entropy", 4.0))
        failed_auth = float(metadata.get("failed_auth", 0))
        geo_distance = float(metadata.get("geo_distance", 0))

        features = np.array([
            payload_size / 1500.0,
            protocol_index / 5.0 if protocol_index >= 0 else 0.0,
            anomaly_flag,
            byte_entropy / 8.0,
            min(failed_auth, 25) / 25.0,
            min(geo_distance, 10000) / 10000.0,
        ])
        return features

    def _heuristic_score(self, features: np.ndarray) -> float:
        weights = np.array([0.25, 0.05, 0.3, 0.15, 0.15, 0.1])
        raw_score = float(np.clip(np.dot(features, weights), 0, 1))
        return raw_score

    def score(self, event: Dict) -> ThreatAssessment:
        features = self._extract_features(event)

        if self.classifier:
            proba = float(self.classifier.predict_proba([features])[0][1])
        else:
            proba = self._heuristic_score(features)

        if proba >= 0.7:
            label = "malicious"
            action = "block_source"
            severity = "critical"
            message = "High confidence malicious traffic detected"
        elif proba >= 0.4:
            label = "suspicious"
            action = "challenge"
            severity = "high"
            message = "Suspicious activity - manual review recommended"
        else:
            label = "benign"
            action = "allow"
            severity = "low"
            message = "Traffic within acceptable thresholds"

        return ThreatAssessment(
            threat_score=round(proba, 3),
            threat_label=label,
            recommended_action=action,
            severity=severity,
            message=message,
        )

    def train(self, samples: Iterable[Dict]) -> Tuple[int, float]:
        feature_vectors = []
        labels = []
        for sample in samples:
            label = sample.get("label")
            if label not in {"benign", "malicious"}:
                continue
            feature_vectors.append(self._extract_features(sample))
            labels.append(1 if label == "malicious" else 0)

        if not feature_vectors:
            raise ValueError("No valid samples provided for training")

        x = np.vstack(feature_vectors)
        y = np.array(labels)

        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(x, y)
        self.classifier = clf
        joblib.dump(clf, MODEL_PATH)

        accuracy = float(clf.score(x, y))
        return len(labels), accuracy


model = ThreatModel()
