#!/usr/bin/env bash
# ==============================================================================
# DevOpsPilot Automated Rollback Script (Bash / Linux / WSL2)
# ==============================================================================
set -euo pipefail

TARGET_VERSION="${1:-previous}"
SERVICE="${2:-all}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "------------------------------------------------------------------"
echo "⏪ Initiating Rollback to image tag: $TARGET_VERSION"
echo "------------------------------------------------------------------"

if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
    docker tag devopspilot-backend:"$TARGET_VERSION" devopspilot-backend:latest
fi
if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
    docker tag devopspilot-frontend:"$TARGET_VERSION" devopspilot-frontend:latest
fi

cd "$PROJECT_ROOT/devops/docker"
if [ "$SERVICE" = "backend" ]; then
    docker compose up -d --no-deps devopspilot-backend
elif [ "$SERVICE" = "frontend" ]; then
    docker compose up -d --no-deps devopspilot-frontend
else
    docker compose up -d --no-deps devopspilot-backend devopspilot-frontend
fi

echo "Verifying health recovery (up to 120s)..."
for i in $(seq 1 60); do
    sleep 2
    if curl -s "http://127.0.0.1:8080/actuator/health" | grep -q '"status":"UP"'; then
        echo "✔ Rollback complete. Health verified."
        SERVICE_ID=$(curl -s "http://127.0.0.1:8080/api/services" | grep -o '"id":[0-9]*' | head -n1 | cut -d: -f2 || echo "1")
        curl -s -X POST "http://127.0.0.1:8080/api/deployments" \
            -H "Content-Type: application/json" \
            -d "{\"serviceId\": ${SERVICE_ID:-1}, \"version\": \"rollback-$TARGET_VERSION\", \"deploymentStatus\": \"ROLLED_BACK\", \"deploymentMessage\": \"Rollback executed and verified\"}" >/dev/null || true
        exit 0
    fi
done
