# DevOpsPilot 🚀
### End-to-End Automated Software Delivery & Infrastructure Management Platform

DevOpsPilot is a fully functional, self-hosted software delivery and infrastructure management platform built using modern engineering practices. Designed to run on a **₹0 budget**, it delivers real-world DevOps capabilities (CI/CD orchestration, automated health validation, container deployment, and system telemetry) using production-grade open-source tools.

---

## 🛠️ Technology Stack

| Layer | Technology | Role in DevOpsPilot |
|---|---|---|
| **Frontend** | React.js (Vite) | Responsive Web UI for pipeline status, deployment actions, and service health |
| **Backend** | Java 21 + Spring Boot 3 | Core REST API, deployment orchestrator, Docker engine integration, and health monitor |
| **Database** | MySQL 8 | Relational storage for service registry, deployment audit trails, and execution logs |
| **Containers** | Docker & Docker Compose | Multi-container orchestration (App, Database, Prometheus, Grafana) |
| **CI/CD** | GitHub Actions | Automated build, test, lint, and container packaging pipelines |
| **Observability** | Prometheus + Grafana | Real-time metric scraping (Micrometer/Actuator) and operational dashboards |
| **Environment** | Windows 11 + WSL2 (Ubuntu) | Local development, container virtualization, and shell script execution |

---

## 📁 Repository Structure

```text
DevOpsPilot/
├── .github/
│   └── workflows/                # GitHub Actions CI/CD definitions
├── backend/                      # Spring Boot 3 + Java 21 REST API
│   ├── src/main/java/            # Controllers, Services, Repositories, Domain models
│   ├── src/main/resources/       # application.yml, database migration scripts
│   ├── src/test/                 # Unit and integration test suites
│   ├── pom.xml                   # Maven dependencies and build plugins
│   └── Dockerfile                # Multi-stage container build for backend
├── frontend/                     # React + Vite Single Page Application
│   ├── src/                      # UI components, API clients, views
│   ├── package.json              # NPM dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   └── Dockerfile                # Multi-stage Nginx-based production image
├── devops/                       # Infrastructure as Code & Orchestration
│   ├── docker/
│   │   ├── docker-compose.yml    # Full stack orchestration (App, DB, Observability)
│   │   └── .env.example          # Environment variables template
│   ├── monitoring/
│   │   ├── prometheus/           # Prometheus scrape configs & rules
│   │   └── grafana/              # Dashboards and datasource provisioning
│   └── scripts/                  # Shell scripts for setup, healthchecks, and validation
├── docs/                         # Architecture documentation & interview notes
│   └── architecture/             # Architectural designs and data flow specifications
├── .gitignore                    # Comprehensive ignores for Java, Node, Docker, & IDEs
└── README.md                     # Project overview and documentation
```

---

## 💰 ₹0 Budget Architecture Philosophy
- **No Paid Cloud Infrastructure**: Eliminates expensive AWS/GCP bills by utilizing lightweight local containers via Docker Compose and WSL2.
- **Production-Identical Patterns**: Uses the exact same Dockerfile concepts, Prometheus metric scraping, and GitHub Actions workflows used in enterprise environments.
- **Zero Mocking / Real Metrics**: Telemetry is produced directly by Spring Boot Actuator and Prometheus Micrometer registry, visualized inside Grafana.

---

## 🚦 Implementation Roadmap

1. **Phase 1: Environment & Architecture Skeleton** *(Completed)*
   - Verified local toolchains (Java 21, Node.js 22, Docker, Git).
   - Established clean repository structure and git tracking.
2. **Phase 2: Database Schema & Backend Core** *(Completed)*
   - Initialized Spring Boot 3 (Java 21) with Maven Wrapper.
   - Configured MySQL 8.0 container on port 3307 and Flyway database migrations for `service_registry` and `deployment_records`.
   - Implemented real health check (`/actuator/health`) and CRUD REST API endpoints.
3. **Phase 3: Observability Stack Setup** *(Completed)*
   - Configured Spring Boot Micrometer + Prometheus Actuator endpoint (`/actuator/prometheus`).
   - Setup Docker Compose for Prometheus (9090) and Grafana (3000) with automated provisioning and telemetry dashboards.
4. **Phase 4: Frontend Development** *(Completed)*
   - Built modern React JSX Single Page Application with Vite and Tailwind CSS.
   - Integrated live health banner, real-time service registry, deployment audit log, and Grafana telemetry links.
5. **Phase 5: Automated Delivery & CI/CD** *(Completed)*
   - Created GitHub Actions workflow (`.github/workflows/ci-cd.yml`) for automated Maven test, Node build, Trivy security scan, and Docker image builds.
   - Built multi-stage Dockerfiles for backend (Temurin JDK 21 Alpine) and frontend (Node 22 + Nginx unprivileged Alpine).
6. **Phase 6: Automated Deployment & Rollback** *(Completed)*
   - Implemented zero-downtime automated deployment scripts (`deploy.ps1` / `deploy.sh`) and rollback scripts (`rollback.ps1` / `rollback.sh`).
   - Automated health checks for Spring Boot Actuator and React frontend before finalizing deployments.
   - Automated failure detection and instant rollback to `:previous` Docker image if health verification fails.
   - Integrated real-time deployment logging directly into the MySQL audit trail (`POST /api/deployments`).

---

## 🚀 Automated Deployment & Rollback (Phase 6)

DevOpsPilot provides automated zero-cloud deployment orchestration using local Docker Compose.

### Stack Port Mapping

| Service | Port | Description |
|---|---|---|
| **Frontend UI** | `http://127.0.0.1:5173` | React Single Page Application (Nginx reverse proxy to API) |
| **Backend REST API** | `http://127.0.0.1:8080` | Spring Boot 3 + Java 21 REST API & Actuator |
| **Prometheus** | `http://127.0.0.1:9090` | Time-series metrics scraper |
| **Grafana** | `http://127.0.0.1:3000` | Operational dashboards (`admin` / `admin`) |
| **MySQL Database** | `127.0.0.1:3307` | Relational storage (`devopspilot_mysql_data` volume) |

### 1. Execute Automated Deployment

Deploy all services or target services (`backend`, `frontend`, or `all`):

**PowerShell (Windows):**
```powershell
# Deploy all containers with version tag v1.0.0
powershell -ExecutionPolicy Bypass -File .\devops\scripts\deploy.ps1 -Version "v1.0.0" -Service "all"

# Deploy backend only
powershell -ExecutionPolicy Bypass -File .\devops\scripts\deploy.ps1 -Version "v1.0.1" -Service "backend"
```

**Bash (Linux / WSL2):**
```bash
./devops/scripts/deploy.sh "v1.0.0" "all"
```

### 2. Automated Rollback on Health Failure

The deployment script executes a 5-step automated workflow:
1. **Image Tag Backup**: Tags the currently running Docker images as `:previous`.
2. **Build & Tag**: Builds the target application Docker image with the new version tag and `:latest`.
3. **Container Update**: Redeploys the containers via `docker compose up -d --no-deps` without recreating the database or monitoring containers.
4. **Health Verification**: Continuously polls `http://127.0.0.1:8080/actuator/health` and `http://127.0.0.1:5173` for readiness.
5. **Success or Automatic Rollback**:
   - If healthy within timeout: logs `DEPLOYED` to `deployment_records` audit trail in MySQL.
   - If health check fails or times out: automatically re-tags `:previous` -> `:latest`, restarts containers, verifies health recovery, and logs `ROLLED_BACK` to MySQL.

### 3. Testing Controlled Failure Scenario

To test automated detection and rollback in a controlled failure scenario:

**PowerShell (Windows):**
```powershell
powershell -ExecutionPolicy Bypass -File .\devops\scripts\deploy.ps1 -Version "v1.1.0-broken" -SimulateFailure -TimeoutSeconds 20
```

**Expected Outcome:**
1. Script builds a broken image and deploys it.
2. Health check detects startup failure and times out at 20s.
3. Automated rollback immediately re-tags `previous` -> `latest` and recreates the container.
4. System health recovers to `UP`.
5. Rollback event is recorded into the MySQL `deployment_records` database table.
6. The persistent MySQL volume `devopspilot_mysql_data` and all existing data are completely preserved.

### 4. Manual Rollback Procedure

To manually roll back to the previous stable release:

**PowerShell (Windows):**
```powershell
powershell -ExecutionPolicy Bypass -File .\devops\scripts\rollback.ps1 -TargetVersion "previous" -Service "all"
```

**Bash (Linux / WSL2):**
```bash
./devops/scripts/rollback.sh "previous" "all"
```


