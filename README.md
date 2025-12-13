# PUII – Proactive Unified Intrusion Intelligence

An end-to-end prototype of the PUII cybersecurity platform described in the accompanying project report. The system combines a React + Material UI frontline console, a Node.js API gateway coordinating persistence and automation, and a Flask-based machine learning service that scores network telemetry for threats.

## Repository Layout
- `frontend/` – React dashboard with live telemetry, alerting, policy management, and reporting UIs.
- `backend/node/` – Express API handling authentication, telemetry ingestion, alerting workflows, reporting, and MySQL persistence.
- `backend/python/` – Flask ML microservice exposing real-time scoring and training endpoints.
- `database/` – MySQL schema definition for network events, alerts, policies, reports, and block lists.
- `docs/` – Architecture notes distilled from the original report.

## Architecture Snapshot
1. Collectors (future agents) push packet summaries to the Node gateway (`POST /api/events`).
2. The gateway stores telemetry, calls the Python ML service for scoring, persists the enriched record, and emits alerts (REST + WebSocket).
3. Admins operate through the React console which talks to the gateway for monitoring, policy management, and reporting.
4. MySQL holds canonical operational data; the ML service can be trained using curated datasets through `/api/v1/train`.

See `docs/architecture.md` for a detailed component breakdown.

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- MySQL 8 (or compatible)
- Optional: `pipx`, `direnv`, `docker` if you plan to containerise

## 1. Database Setup
```sql
CREATE DATABASE puii CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'puii_app'@'%' IDENTIFIED BY 'raj123456';
GRANT ALL PRIVILEGES ON puii.* TO 'puii_app'@'%';
FLUSH PRIVILEGES;
```

Apply the schema:
```bash
mysql -u puii_app -p puii < database/schema.sql
```

## 2. Backend Services
### Node.js API Gateway
```bash
cd backend/node
cp .env.example .env          # adjust credentials & secrets
yarn install
yarn run dev                   # starts on http://localhost:4000
```

Key endpoints:
- `POST /api/auth/login` – obtain JWT (default credentials in `.env.example`)
- `POST /api/events` – ingest telemetry (protected)
- `GET /api/reports/dashboard` – aggregated metrics
- `GET|POST /api/reports` – list and generate reports
- `GET|POST /api/policies` – manage automated response thresholds
- WebSocket broadcast on `/` namespace for real-time alerts

### Python ML Service
```bash
cd backend/python
cp .env.example .env          # set ML_SERVICE_API_KEY to match node config
python3 -m venv .venv && source .venv/bin/activate
watchmedo auto-restart  --pattern="*.py" --recursive -- python app.py
pip install -r requirements.txt
python app.py                 # starts on http://localhost:5000
```

Endpoints:
- `POST /api/v1/score` – classify a network event (expects same payload Node sends)
- `POST /api/v1/train` – retrain the RandomForest model with labelled samples

### Connecting the Services
Ensure `backend/node/.env` has `ML_SERVICE_URL=http://localhost:5000` and matching API key if you enabled one. The Node process will forward telemetry to the ML service automatically.

## 3. Frontend Console
```bash
cd frontend
cp .env.example .env          # point to API gateway base URL
yarn install
yarn run dev                   # starts on http://localhost:3000
```

The console provides:
- Live dashboard with metrics, charts, and rolling events table
- Alert triage view with acknowledgement workflow and WebSocket updates
- Policy management for automated responses and block lists
- Report generation UI writing to `threat_reports`

## 4. Sample Data
With the Node API running and the database provisioned:
```bash
cd backend/node
npm run seed
```

That inserts seeded events you can visualise on the dashboard.

## 5. Development Notes
- All configuration relies on environment variables; never commit secrets.
- The ML model stores persisted state under `backend/python/puii_ml/model_store.joblib`.
- Re-training is synchronous for now; long-running jobs should be offloaded (future work).
- The WebSocket feed is optional; disable with `ENABLE_WS=false` in the Node `.env`.
- Extend collectors by writing lightweight agents that POST to `/api/events` with the documented payload shape.

## Future Enhancements
- Add proper authentication & user management (replace static admin credentials).
- Integrate packet capture agents and Kafka for scalable ingestion.
- Harden ML service with feature stores and drift detection.
- Expand automated responses to orchestrate firewall rules via the collector agents.
- Package everything with Docker Compose / Kubernetes charts for deployment parity.

This repository turns the provided PUII report and diagrams into an executable reference implementation ready for experimentation and further development.
# puii
