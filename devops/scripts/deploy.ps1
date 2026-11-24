<#
.SYNOPSIS
    Automated zero-downtime deployment script for DevOpsPilot with automated rollback.
.DESCRIPTION
    Builds, tags, deploys, and health-checks frontend and backend containers.
    If health verification fails, automatically triggers rollback to the previous working image.
.PARAMETER Version
    The version tag to deploy (e.g. v1.1.0, v1.2.0, or git SHA).
.PARAMETER Service
    Target service to deploy: 'all', 'backend', or 'frontend'. Default is 'all'.
.PARAMETER TimeoutSeconds
    Maximum seconds to wait for container health probes. Default is 45.
.PARAMETER SimulateFailure
    Simulates a deployment failure to test automated rollback.
#>

param (
    [string]$Version = "v" + (Get-Date -Format "yyyyMMdd.HHmmss"),
    [ValidateSet("all", "backend", "frontend")]
    [string]$Service = "all",
    [int]$TimeoutSeconds = 120,
    [switch]$SimulateFailure
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\..\.."
$ComposeFile = "$ProjectRoot\devops\docker\docker-compose.yml"
$EnvFile = "$ProjectRoot\devops\docker\.env"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "🚀 DevOpsPilot Automated Deployment - Version: $Version" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Verify Docker Daemon
try {
    docker ps | Out-Null
} catch {
    Write-Error "Docker daemon is not reachable. Please ensure Docker Desktop is running."
    exit 1
}

# 2. Backup current working images to ':previous' tag
Write-Host "[1/5] Backing up current running images to ':previous' tag..." -ForegroundColor Yellow
if (docker images -q devopspilot-backend:latest) {
    docker tag devopspilot-backend:latest devopspilot-backend:previous
    Write-Host "  ✔ devopspilot-backend:latest tagged as devopspilot-backend:previous" -ForegroundColor Green
}
if (docker images -q devopspilot-frontend:latest) {
    docker tag devopspilot-frontend:latest devopspilot-frontend:previous
    Write-Host "  ✔ devopspilot-frontend:latest tagged as devopspilot-frontend:previous" -ForegroundColor Green
}

# 3. Build & Tag New Image(s)
Write-Host "[2/5] Building application container images..." -ForegroundColor Yellow

if ($SimulateFailure) {
    Write-Host "  ⚠️ SIMULATING DEPLOYMENT FAILURE: Building image with failing entrypoint..." -ForegroundColor Red
    $fakeDockerFile = "FROM alpine`nENTRYPOINT [`"sh`", `"-c`", `"echo Fatal startup error; exit 1`"]"
    Set-Content -Path "$env:TEMP\Dockerfile.fail" -Value $fakeDockerFile
    docker build -t devopspilot-backend:$Version -t devopspilot-backend:latest -f "$env:TEMP\Dockerfile.fail" "$env:TEMP" | Out-Null
    Remove-Item "$env:TEMP\Dockerfile.fail" -Force
} else {
    if ($Service -eq "all" -or $Service -eq "backend") {
        Write-Host "  • Building backend (devopspilot-backend:$Version)..." -ForegroundColor Gray
        docker build -t devopspilot-backend:$Version -t devopspilot-backend:latest "$ProjectRoot\backend"
    }
    if ($Service -eq "all" -or $Service -eq "frontend") {
        Write-Host "  • Building frontend (devopspilot-frontend:$Version)..." -ForegroundColor Gray
        docker build -t devopspilot-frontend:$Version -t devopspilot-frontend:latest "$ProjectRoot\frontend"
    }
}

# 4. Deploy New Version via Docker Compose (Preserving MySQL & Observability volumes)
Write-Host "[3/5] Deploying target containers via Docker Compose..." -ForegroundColor Yellow
Push-Location "$ProjectRoot\devops\docker"
try {
    if ($Service -eq "backend") {
        docker compose up -d --no-deps devopspilot-backend
    } elseif ($Service -eq "frontend") {
        docker compose up -d --no-deps devopspilot-frontend
    } else {
        docker compose up -d --no-deps devopspilot-backend devopspilot-frontend
    }
} finally {
    Pop-Location
}

# 5. Execute Automated Health Checks
Write-Host "[4/5] Running automated health checks (Timeout: ${TimeoutSeconds}s)..." -ForegroundColor Yellow

$healthy = $false
$startTime = Get-Date

while (((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
    Start-Sleep -Seconds 3
    $backendOk = $false
    $frontendOk = $false

    # Check Backend Actuator
    try {
        $actuator = Invoke-RestMethod -Uri "http://127.0.0.1:8080/actuator/health" -TimeoutSec 2 -ErrorAction Stop
        if ($actuator.status -eq "UP" -and $actuator.components.db.status -eq "UP") {
            $backendOk = $true
        }
    } catch {}

    # Check Frontend
    try {
        $web = Invoke-WebRequest -Uri "http://127.0.0.1:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($web.StatusCode -eq 200) {
            $frontendOk = $true
        }
    } catch {}

    if ($Service -eq "backend" -and $backendOk) { $healthy = $true; break }
    if ($Service -eq "frontend" -and $frontendOk) { $healthy = $true; break }
    if ($Service -eq "all" -and $backendOk -and $frontendOk) { $healthy = $true; break }

    Write-Host "  ... Waiting for container readiness (Backend: $backendOk, Frontend: $frontendOk) [Elapsed: $([int]((Get-Date) - $startTime).TotalSeconds)s]" -ForegroundColor DarkGray
}

# 6. Evaluation & Automated Rollback Handling
if ($healthy) {
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "✅ DEPLOYMENT SUCCESSFUL: Version $Version is healthy and serving traffic!" -ForegroundColor Green
    Write-Host "==================================================================" -ForegroundColor Green

    # Log deployment event into real database audit log
    try {
        $services = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/services" -TimeoutSec 5
        $targetServiceId = $null
        if ($services -and $services.Count -gt 0) {
            $targetServiceId = $services[0].id
        } else {
            $newService = @{
                serviceName = "devopspilot-platform"
                description = "DevOpsPilot Automated Delivery Platform"
                repositoryUrl = "https://github.com/Srinithi-15/DevOpsPilot"
                environment = "production"
            } | ConvertTo-Json
            $regResp = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/services" -Method Post -Body $newService -ContentType "application/json"
            $targetServiceId = $regResp.id
        }

        $body = @{
            serviceId = [int64]$targetServiceId
            version = $Version
            deploymentStatus = "DEPLOYED"
            deploymentMessage = "Automated deployment succeeded with all health checks passed"
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/deployments" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  ✔ Logged deployment record (serviceId: $targetServiceId) to DevOpsPilot audit trail." -ForegroundColor Gray
    } catch {
        Write-Host "  ⚠️ Could not log deployment record: $_" -ForegroundColor DarkGray
    }

    exit 0
} else {
    Write-Host "==================================================================" -ForegroundColor Red
    Write-Host "❌ HEALTH CHECK FAILED: Service did not become healthy within ${TimeoutSeconds}s" -ForegroundColor Red
    Write-Host "🔄 Initiating AUTOMATED ROLLBACK to previous stable version..." -ForegroundColor Red
    Write-Host "==================================================================" -ForegroundColor Red

    # Trigger Rollback
    & "$ScriptDir\rollback.ps1" -TargetVersion "previous" -Service $Service
    exit 1
}
