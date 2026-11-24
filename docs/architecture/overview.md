# Architecture Specification: DevOpsPilot

## 1. System Overview

DevOpsPilot is architected as an automated software delivery and infrastructure management platform that runs entirely on local or self-hosted containerized infrastructure, requiring **₹0 in cloud expenditure**.

### High-Level Data Flow

```text
[ Browser / Client ]
         │
         ▼
[ React + Vite Frontend (Port 5173 / 80) ]
         │
         │ REST API Calls
         ▼
[ Spring Boot Backend (Port 8080) ]
    ├── Persistence ──────────────► [ MySQL 8.0 (Port 3306) ]
    │
    └── Metrics Exporter (/actuator/prometheus)
             │
             ▼ (Scrapes every 15s)
    [ Prometheus (Port 9090) ]
             │
             ▼ (Query datasource)
    [ Grafana (Port 3000) ]
```

---

## 2. Core Modules

### 2.1 Backend Core (`/backend`)
- **Runtime**: Java 21 LTS with Spring Boot 3.x.
- **Responsibilities**:
  - Expose operational APIs for service registry and deployment status.
  - Track deployment history and service health states in MySQL.
  - Expose real metrics via Spring Boot Actuator (`/actuator/health`, `/actuator/prometheus`).
  - Interface with Docker host for service verification.

### 2.2 Frontend Client (`/frontend`)
- **Runtime**: React 18+ bundled with Vite.
- **Responsibilities**:
  - Provide an intuitive operational dashboard displaying active services and deployment statuses.
  - Query backend health endpoints in real time.
  - Display embedded or linked Grafana metric dashboards for system telemetry.

### 2.3 DevOps & Container Infrastructure (`/devops`)
- **Docker Compose**: Single configuration defining:
  - `devopspilot-backend`: Spring Boot application.
  - `devopspilot-db`: MySQL 8.0 instance with persistent volume.
  - `devopspilot-prometheus`: Prometheus server scraping backend metrics.
  - `devopspilot-grafana`: Pre-configured Grafana instance with provisioned dashboards.
- **Zero-Touch Provisioning**: Grafana data sources and dashboards are mounted via volume definitions so no manual UI configuration is required after startup.

### 2.4 CI/CD Workflows (`/.github/workflows`)
- **Continuous Integration**:
  - Automated compile, lint, and test execution for backend (Maven) and frontend (npm).
- **Container Build & Validation**:
  - Verification of Docker multi-stage builds on pull requests.

