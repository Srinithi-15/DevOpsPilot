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

1. **Phase 1: Environment & Architecture Skeleton** *(Current)*
   - Verify local toolchains (Java 21, Node, Docker, Git).
   - Establish clean repository structure and git tracking.
2. **Phase 2: Database Schema & Backend Core**
   - Initialize Spring Boot 3 (Java 21) with Maven Wrapper.
   - Configure MySQL container and Flyway database migrations for audit & deployment records.
   - Implement real health check and system information endpoints.
3. **Phase 3: Observability Stack Setup**
   - Configure Spring Boot Micrometer + Prometheus Actuator endpoint.
   - Setup Docker Compose for Prometheus and Grafana with automated provisioning.
4. **Phase 4: Frontend Development**
   - Initialize Vite + React project.
   - Build service health dashboard and live status monitors connected to real backend APIs.
5. **Phase 5: Automated Delivery & CI/CD**
   - Write GitHub Actions workflows for automated verification and container builds.
   - Containerize frontend and backend with multi-stage production Dockerfiles.
