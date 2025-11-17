# PUII Architecture Overview

## High-Level Components
- **Client (React + MUI)**: Provides dashboards for admins to monitor network traffic, threat alerts, and historical reports. Offers controls to manage automated response policies.
- **API Gateway (Node.js + Express)**: Handles authentication, request orchestration, and persistence. Routes telemetry and admin actions between the client, database, and ML service.
- **Threat Detection Service (Python + Flask)**: Runs the generative ML model that analyses network metadata. Exposes REST endpoints for real-time scoring and model training jobs.
- **MySQL Database**: Stores telemetry, threat assessments, response actions, and audit logs.
- **Network Collectors (Python)**: Optional agents that capture packet summaries and push them to the API gateway via secure channels.

## Data Flow
1. Network telemetry (e.g., packet headers, flow summaries) arrives at the API gateway.
2. The gateway persists raw events, then calls the ML service for threat scoring.
3. The ML service enriches the request with predicted threat category and confidence, returning recommended actions.
4. The gateway updates the event record, triggers automated blocking if enabled, and publishes alerts to the client via WebSocket.
5. Admins review alerts, adjust policies, and generate reports from the client UI.

## Security Considerations
- `JWT`-backed authentication and role-based authorization for admin vs. read-only users.
- HTTPS/TLS between all components; API gateway supports mTLS for collectors.
- Secrets managed via environment variables or a vault service.
- Input validation, rate limiting, and audit logging on all external endpoints.

## Deployment Outline
- Containers for each service (client, gateway, ML service) orchestrated via Docker Compose or Kubernetes.
- Separate MySQL instance with automated backups.
- CI/CD pipeline running linting, unit tests, and integration tests before deployment.

This document is derived from the PUII project report and diagrams, translating the conceptual overview into an implementable technical architecture.
