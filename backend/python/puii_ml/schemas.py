"""Request/response validation using Pydantic."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class TelemetryMetadata(BaseModel):
    is_anomaly: Optional[bool] = False
    byte_entropy: Optional[float] = Field(default=4.0, ge=0, le=8)
    failed_auth: Optional[int] = Field(default=0, ge=0)
    geo_distance: Optional[float] = Field(default=0, ge=0)


class ScoreRequest(BaseModel):
    event_id: str
    source_ip: str
    destination_ip: str
    protocol: str
    payload_size: int
    metadata: Optional[Dict[str, Any]] = None


class TrainSample(BaseModel):
    protocol: str
    payload_size: int
    metadata: Optional[Dict[str, Any]] = None
    label: str


class TrainRequest(BaseModel):
    samples: List[TrainSample]
