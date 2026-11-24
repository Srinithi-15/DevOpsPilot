# Docker & Container Orchestration

This directory holds the multi-container orchestration assets for DevOpsPilot:

- `docker-compose.yml`: Defines the local topology (Backend, MySQL, Prometheus, Grafana).
- `.env.example`: Template for container port bindings and credentials.

### Planned Services
| Service | Image / Base | Internal Port | Host Port | Purpose |
|---|---|---|---|---|
| `devopspilot-db` | `mysql:8.0` | 3306 | 3306 | Persistent relational storage |
| `devopspilot-backend` | Multi-stage OpenJDK 21 | 8080 | 8080 | Spring Boot REST API |
| `devopspilot-prometheus` | `prom/prometheus:latest` | 9090 | 9090 | Metric scraper & time-series DB |
| `devopspilot-grafana` | `grafana/grafana:latest` | 3000 | 3000 | Operational telemetry dashboard |
