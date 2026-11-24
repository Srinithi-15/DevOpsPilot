#!/usr/bin/env bash
# ==============================================================================
# DevOpsPilot Automated Deployment Script (Bash / Linux / WSL2)
# ==============================================================================
set -euo pipefail

VERSION="${1:-v$(date +%Y%m%d.%H%M%S)}"
SERVICE="${2:-all}"
TIMEOUT="${3:-120}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=================================================================="
echo "🚀 DevOpsPilot Automated Deployment - Version: $VERSION"
echo "=================================================================="

# 1. Verify Docker Daemon
docker ps >/dev/null 2>&1 || { echo "Docker daemon is not running."; exit 1; }

# 2. Tag Current Image as Previous
echo "[1/4] Tagging current images as :previous..."
docker images -q devopspilot-backend:latest >/dev/null 2>&1 && docker tag devopspilot-backend:latest devopspilot-backend:previous || true
docker images -q devopspilot-frontend:latest >/dev/null 2>&1 && docker tag devopspilot-frontend:latest devopspilot-frontend:previous || true

# 3. Build New Images
echo "[2/4] Building target container images..."
if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
    docker build -t devopspilot-backend:"$VERSION" -t devopspilot-backend:latest "$PROJECT_ROOT/backend"
fi
if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
    docker build -t devopspilot-frontend:"$VERSION" -t devopspilot-frontend:latest "$PROJECT_ROOT/frontend"
fi

# 4. Deploy Containers
echo "[3/4] Deploying via Docker Compose..."
cd "$PROJECT_ROOT/devops/docker"
if [ "$SERVICE" = "backend" ]; then
    docker compose up -d --no-deps devopspilot-backend
elif [ "$SERVICE" = "frontend" ]; then
    docker compose up -d --no-deps devopspilot-frontend
else
    docker compose up -d --no-deps devopspilot-backend devopspilot-frontend
fi

# 5. Health Check
echo "[4/4] Running automated health check (Timeout: ${TIMEOUT}s)..."
START_TIME=$(date +%s)
HEALTHY=false

while [ $(($(date +%s) - START_TIME)) -lt "$TIMEOUT" ]; do
    sleep 3
    BACKEND_UP=false
    FRONTEND_UP=false

    if curl -s "http://127.0.0.1:8080/actuator/health" | grep -q '"status":"UP"'; then
        BACKEND_UP=true
    fi
    if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:5173" | grep -q '200'; then
        FRONTEND_UP=true
    fi

    if [ "$SERVICE" = "backend" ] && [ "$BACKEND_UP" = true ]; then HEALTHY=true; break; fi
    if [ "$SERVICE" = "frontend" ] && [ "$FRONTEND_UP" = true ]; then HEALTHY=true; break; fi
    if [ "$SERVICE" = "all" ] && [ "$BACKEND_UP" = true ] && [ "$FRONTEND_UP" = true ]; then HEALTHY=true; break; fi
done

if [ "$HEALTHY" = true ]; then
    echo "=================================================================="
    echo "✅ DEPLOYMENT SUCCESSFUL: Version $VERSION is healthy!"
    echo "=================================================================="
    # Register default service in registry if empty
    SERVICE_ID=$(curl -s "http://127.0.0.1:8080/api/services" | grep -o '"id":[0-9]*' | head -n1 | cut -d: -f2 || true)
    if [ -z "$SERVICE_ID" ]; then
        SERVICE_ID=$(curl -s -X POST "http://127.0.0.1:8080/api/services" \
            -H "Content-Type: application/json" \
            -d '{"serviceName":"devopspilot-platform","description":"DevOpsPilot Platform","repositoryUrl":"https://github.com/Srinithi-15/DevOpsPilot","environment":"production"}' | grep -o '"id":[0-9]*' | head -n1 | cut -d: -f2 || echo "1")
    fi
    curl -s -X POST "http://127.0.0.1:8080/api/deployments" \
        -H "Content-Type: application/json" \
        -d "{\"serviceId\": ${SERVICE_ID:-1}, \"version\": \"$VERSION\", \"deploymentStatus\": \"DEPLOYED\", \"deploymentMessage\": \"Automated Linux deployment verified\"}" >/dev/null || true
    exit 0
else
    echo "=================================================================="
    echo "❌ Health check failed. Triggering automated rollback..."
    echo "=================================================================="
    bash "$SCRIPT_DIR/rollback.sh" "previous" "$SERVICE"
    exit 1
fi
