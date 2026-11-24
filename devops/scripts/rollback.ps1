<#
.SYNOPSIS
    Automated Rollback Script for DevOpsPilot.
.DESCRIPTION
    Reverts backend or frontend containers to the previous working Docker image.
    Verifies service health recovery and logs the rollback to the audit trail.
.PARAMETER TargetVersion
    The image tag to revert to. Default is 'previous'.
.PARAMETER Service
    Target service to rollback: 'all', 'backend', or 'frontend'. Default is 'all'.
#>

param (
    [string]$TargetVersion = "previous",
    [ValidateSet("all", "backend", "frontend")]
    [string]$Service = "all"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\..\.."
$ComposeFile = "$ProjectRoot\devops\docker\docker-compose.yml"

Write-Host "------------------------------------------------------------------" -ForegroundColor Magenta
Write-Host "⏪ DevOpsPilot Rollback Procedure - Target Tag: $TargetVersion" -ForegroundColor Magenta
Write-Host "------------------------------------------------------------------" -ForegroundColor Magenta

# 1. Validate previous image exists
if ($Service -eq "all" -or $Service -eq "backend") {
    if (-not (docker images -q "devopspilot-backend:$TargetVersion")) {
        Write-Error "Cannot rollback: devopspilot-backend:$TargetVersion image does not exist locally."
        exit 1
    }
    docker tag "devopspilot-backend:$TargetVersion" devopspilot-backend:latest
    Write-Host "  ✔ Re-tagged devopspilot-backend:$TargetVersion -> devopspilot-backend:latest" -ForegroundColor Green
}

if ($Service -eq "all" -or $Service -eq "frontend") {
    if (-not (docker images -q "devopspilot-frontend:$TargetVersion")) {
        Write-Error "Cannot rollback: devopspilot-frontend:$TargetVersion image does not exist locally."
        exit 1
    }
    docker tag "devopspilot-frontend:$TargetVersion" devopspilot-frontend:latest
    Write-Host "  ✔ Re-tagged devopspilot-frontend:$TargetVersion -> devopspilot-frontend:latest" -ForegroundColor Green
}

# 2. Redeploy restored containers via Docker Compose
Write-Host "  • Redeploying restored container(s)..." -ForegroundColor Yellow
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

# 3. Verify Health Recovery
Write-Host "  • Validating health recovery after rollback (Timeout: 120s)..." -ForegroundColor Yellow
$recovered = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 2
    try {
        $actuator = Invoke-RestMethod -Uri "http://127.0.0.1:8080/actuator/health" -TimeoutSec 2 -ErrorAction Stop
        if ($actuator.status -eq "UP") {
            $recovered = $true
            break
        }
    } catch {}
}

if ($recovered) {
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "✔ ROLLBACK COMPLETE: System successfully restored to $TargetVersion!" -ForegroundColor Green
    Write-Host "==================================================================" -ForegroundColor Green

    # Log rollback event to audit log
    try {
        $services = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/services" -TimeoutSec 5
        $targetServiceId = 1
        if ($services -and $services.Count -gt 0) {
            $targetServiceId = $services[0].id
        }

        $body = @{
            serviceId = [int64]$targetServiceId
            version = "rollback-to-$TargetVersion"
            deploymentStatus = "ROLLED_BACK"
            deploymentMessage = "Rollback triggered; verified system health recovery to stable version"
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/deployments" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  ✔ Logged rollback event to database audit trail." -ForegroundColor Gray
    } catch {
        Write-Host "  ⚠️ Could not log rollback record: $_" -ForegroundColor DarkGray
    }
} else {
    Write-Host "⚠️ Warning: Rollback container deployed, but health check is taking longer than expected." -ForegroundColor Yellow
}
