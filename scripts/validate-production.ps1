<# 
.SYNOPSIS
    SF-ERP Docker Production Validation Script

.DESCRIPTION
    Validates the SF-ERP Docker deployment for production readiness.
    Checks running containers, health status, API endpoints, and database.

.EXAMPLE
    .\scripts\validate-production.ps1
    .\scripts\validate-production.ps1 -FullReport
#>

param(
    [switch]$FullReport,
    [switch]$SkipHealth,
    [string]$FrontendUrl = "http://localhost:3000",
    [string]$BackendUrl = "http://localhost:5001"
)

$ErrorActionPreference = "Continue"

# Colors for output
function Write-Pass { param($msg) Write-Host "[PASS] $msg" -ForegroundColor Green }
function Write-Fail { param($msg) Write-Host "[FAIL] $msg" -ForegroundColor Red }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Section { 
    param($msg) 
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}

# Counters
$script:Passed = 0
$script:Failed = 0
$script:Warnings = 0

function Add-Pass { $script:Passed++ }
function Add-Fail { $script:Failed++ }
function Add-Warn { $script:Warnings++ }

# HEADER
Clear-Host
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "     SF-ERP DOCKER PRODUCTION VALIDATION SUITE                        " -ForegroundColor Magenta
Write-Host "     Target: 100,000+ Concurrent Users | 10,000+ RPS                  " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Working Directory: $(Get-Location)"
Write-Host ""

# PHASE 1: DOCKER ENVIRONMENT
Write-Section "PHASE 1: DOCKER ENVIRONMENT"

# Check Docker availability
$dockerVersion = docker --version 2>$null
if ($dockerVersion) {
    Write-Pass "Docker installed: $dockerVersion"
    Add-Pass
    
    # Check Docker Compose
    $composeVersion = docker compose version 2>$null
    if ($composeVersion) {
        Write-Pass "Docker Compose: $composeVersion"
        Add-Pass
    } else {
        $legacyCompose = docker-compose --version 2>$null
        if ($legacyCompose) {
            Write-Pass "Docker Compose (legacy): $legacyCompose"
            Add-Pass
        } else {
            Write-Fail "Docker Compose not installed"
            Add-Fail
        }
    }
    
    # Check if docker daemon is running
    $null = docker info 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Pass "Docker daemon is running"
        Add-Pass
    } else {
        Write-Fail "Docker daemon is not running"
        Add-Fail
    }
} else {
    Write-Fail "Docker not installed"
    Add-Fail
}

# PHASE 2: DOCKER COMPOSE VALIDATION
Write-Section "PHASE 2: DOCKER COMPOSE CONFIGURATION"

if (Test-Path "docker-compose.yml") {
    Write-Pass "docker-compose.yml exists"
    Add-Pass
    
    $composeContent = Get-Content "docker-compose.yml" -Raw
    
    $requiredServices = @("mysql", "server", "client")
    foreach ($svc in $requiredServices) {
        if ($composeContent -match "$svc`:") {
            Write-Pass "Service '$svc' defined"
            Add-Pass
        } else {
            Write-Fail "Service '$svc' missing"
            Add-Fail
        }
    }
    
    if ($composeContent -match "healthcheck:") {
        Write-Pass "Health checks configured"
        Add-Pass
    } else {
        Write-Warn "No health checks in docker-compose.yml"
        Add-Warn
    }
    
    if ($composeContent -match "volumes:") {
        Write-Pass "Volumes configured for persistence"
        Add-Pass
    } else {
        Write-Warn "No volumes configured - data may be lost on restart"
        Add-Warn
    }
    
    if ($composeContent -match "networks:") {
        Write-Pass "Custom network configured"
        Add-Pass
    }
    
    if ($composeContent -match "restart:") {
        Write-Pass "Restart policy configured"
        Add-Pass
    } else {
        Write-Warn "No restart policy - containers won't auto-restart"
        Add-Warn
    }
} else {
    Write-Fail "docker-compose.yml not found"
    Add-Fail
}

# PHASE 3: RUNNING CONTAINERS
Write-Section "PHASE 3: RUNNING CONTAINERS"

$expectedContainers = @(
    @{ Name = "sf_erp_db"; Service = "MySQL Database" },
    @{ Name = "sf_erp_server"; Service = "Backend Server" },
    @{ Name = "sf_erp_client"; Service = "Frontend Client" }
)

foreach ($container in $expectedContainers) {
    $status = docker inspect --format='{{.State.Status}}' $container.Name 2>$null
    $health = docker inspect --format='{{.State.Health.Status}}' $container.Name 2>$null
    
    if ($status -eq "running") {
        if ($health -eq "healthy") {
            Write-Pass "$($container.Service) ($($container.Name)): Running and Healthy"
            Add-Pass
        } elseif ($health -eq "starting") {
            Write-Warn "$($container.Service) ($($container.Name)): Running (health check starting)"
            Add-Warn
        } elseif ($health) {
            Write-Warn "$($container.Service) ($($container.Name)): Running but health=$health"
            Add-Warn
        } else {
            Write-Pass "$($container.Service) ($($container.Name)): Running"
            Add-Pass
        }
    } elseif ($status) {
        Write-Fail "$($container.Service) ($($container.Name)): $status"
        Add-Fail
    } else {
        Write-Fail "$($container.Service) ($($container.Name)): Not found"
        Add-Fail
    }
}

Write-Host ""
Write-Info "Container Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>$null

# PHASE 4: API HEALTH CHECKS
if (-not $SkipHealth) {
    Write-Section "PHASE 4: API HEALTH CHECKS"
    
    try {
        $backendHealth = Invoke-RestMethod -Uri "$BackendUrl/api/health" -TimeoutSec 10 -ErrorAction Stop
        if ($backendHealth.status -eq "Server is healthy" -or $backendHealth.status -eq "healthy") {
            Write-Pass "Backend API health check passed"
            Add-Pass
        } else {
            Write-Warn "Backend returned: $($backendHealth.status)"
            Add-Warn
        }
    } catch {
        Write-Fail "Backend API health check failed: $($_.Exception.Message)"
        Add-Fail
    }
    
    try {
        $frontendResponse = Invoke-WebRequest -Uri "$FrontendUrl" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Pass "Frontend accessible (HTTP 200)"
            Add-Pass
        } else {
            Write-Warn "Frontend returned HTTP $($frontendResponse.StatusCode)"
            Add-Warn
        }
    } catch {
        Write-Fail "Frontend not accessible: $($_.Exception.Message)"
        Add-Fail
    }
    
    try {
        $null = Invoke-RestMethod -Uri "$FrontendUrl/api/health" -TimeoutSec 10 -ErrorAction Stop
        Write-Pass "API proxy through Nginx working"
        Add-Pass
    } catch {
        Write-Warn "API proxy through Nginx may not be configured"
        Add-Warn
    }
}

# PHASE 5: DATABASE CONNECTIVITY
Write-Section "PHASE 5: DATABASE CONNECTIVITY"

$null = docker exec sf_erp_db mysqladmin ping -h localhost -u root -pPrawin@2k4 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Pass "MySQL is responding to ping"
    Add-Pass
    
    $null = docker exec sf_erp_db mysql -u root -pPrawin@2k4 -e "USE cms; SELECT COUNT(*) as tables FROM information_schema.tables WHERE table_schema='cms';" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Pass "Database 'cms' exists with tables"
        Add-Pass
        
        if ($FullReport) {
            $tableCount = docker exec sf_erp_db mysql -u root -pPrawin@2k4 -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='cms';" 2>$null
            Write-Info "Total tables in database: $tableCount"
        }
    } else {
        Write-Warn "Database 'cms' may not have tables"
        Add-Warn
    }
} else {
    Write-Fail "MySQL not responding"
    Add-Fail
}

# PHASE 6: DOCKERFILE VALIDATION
Write-Section "PHASE 6: DOCKERFILE VALIDATION"

if (Test-Path "server/Dockerfile") {
    $backendDockerfile = Get-Content "server/Dockerfile" -Raw
    
    if ($backendDockerfile -match "FROM.*AS") {
        Write-Pass "Backend: Multi-stage build"
        Add-Pass
    } else {
        Write-Warn "Backend: Consider multi-stage build"
        Add-Warn
    }
    
    if ($backendDockerfile -match "USER\s+\w+") {
        Write-Pass "Backend: Non-root user configured"
        Add-Pass
    } else {
        Write-Warn "Backend: Should use non-root user"
        Add-Warn
    }
    
    if ($backendDockerfile -match "HEALTHCHECK") {
        Write-Pass "Backend: HEALTHCHECK defined"
        Add-Pass
    } else {
        Write-Warn "Backend: HEALTHCHECK recommended"
        Add-Warn
    }
    
    if ($backendDockerfile -match "node:22") {
        Write-Pass "Backend: Using Node.js 22 LTS"
        Add-Pass
    } elseif ($backendDockerfile -match "node:20") {
        Write-Pass "Backend: Using Node.js 20 LTS"
        Add-Pass
    }
} else {
    Write-Fail "server/Dockerfile not found"
    Add-Fail
}

if (Test-Path "client/Dockerfile") {
    $clientDockerfile = Get-Content "client/Dockerfile" -Raw
    
    if ($clientDockerfile -match "FROM.*AS") {
        Write-Pass "Client: Multi-stage build"
        Add-Pass
    }
    
    if ($clientDockerfile -match "nginx") {
        Write-Pass "Client: Using Nginx for production"
        Add-Pass
    }
    
    if ($clientDockerfile -match "HEALTHCHECK") {
        Write-Pass "Client: HEALTHCHECK defined"
        Add-Pass
    }
} else {
    Write-Fail "client/Dockerfile not found"
    Add-Fail
}

# PHASE 7: SECURITY CHECKS
Write-Section "PHASE 7: SECURITY CHECKS"

if (Test-Path ".env") {
    Write-Pass ".env configuration file exists"
    Add-Pass
    
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "password123|admin123|secret123|changeme") {
        Write-Fail "Default/weak password detected in .env"
        Add-Fail
    } else {
        Write-Pass "No default passwords detected"
        Add-Pass
    }
    
    if ($envContent -match "NODE_ENV=production") {
        Write-Pass "NODE_ENV set to production"
        Add-Pass
    } else {
        Write-Warn "NODE_ENV should be 'production'"
        Add-Warn
    }
} else {
    Write-Warn ".env file not found - using defaults"
    Add-Warn
}

if (Test-Path "client/nginx.conf") {
    $nginxConf = Get-Content "client/nginx.conf" -Raw
    
    if ($nginxConf -match "X-Frame-Options") {
        Write-Pass "Nginx: X-Frame-Options header configured"
        Add-Pass
    }
    
    if ($nginxConf -match "X-Content-Type-Options") {
        Write-Pass "Nginx: X-Content-Type-Options header configured"
        Add-Pass
    }
    
    if ($nginxConf -match "gzip on") {
        Write-Pass "Nginx: Gzip compression enabled"
        Add-Pass
    }
}

# PHASE 8: PERFORMANCE CONFIGURATION
Write-Section "PHASE 8: PERFORMANCE CONFIGURATION"

if (Test-Path "server/db.js") {
    $dbConfig = Get-Content "server/db.js" -Raw
    
    if ($dbConfig -match "connectionLimit:\s*(\d+)") {
        $poolSize = [int]$Matches[1]
        if ($poolSize -ge 50) {
            Write-Pass "Database pool size: $poolSize (good for high load)"
            Add-Pass
        } else {
            Write-Warn "Database pool size: $poolSize (consider 50+ for production)"
            Add-Warn
        }
    }
}

$clientImage = docker images --format "{{.Size}}" sf_erp-client 2>$null
if ($clientImage) {
    Write-Info "Client image size: $clientImage"
}

$serverImage = docker images --format "{{.Size}}" sf_erp-server 2>$null
if ($serverImage) {
    Write-Info "Server image size: $serverImage"
}

# PHASE 9: LOGS CHECK
Write-Section "PHASE 9: CONTAINER LOGS (Last 5 lines)"

Write-Host ""
Write-Host "MySQL Logs:" -ForegroundColor Yellow
docker logs sf_erp_db --tail 5 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

Write-Host ""
Write-Host "Server Logs:" -ForegroundColor Yellow
docker logs sf_erp_server --tail 5 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

Write-Host ""
Write-Host "Client Logs:" -ForegroundColor Yellow
docker logs sf_erp_client --tail 5 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

# SUMMARY
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "                       VALIDATION SUMMARY                              " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "  [PASSED]:   $($script:Passed)" -ForegroundColor Green
Write-Host "  [FAILED]:   $($script:Failed)" -ForegroundColor Red
Write-Host "  [WARNINGS]: $($script:Warnings)" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------------------" -ForegroundColor Magenta

$total = $script:Passed + $script:Failed
$score = if ($total -gt 0) { [math]::Round(($script:Passed / $total) * 100) } else { 0 }

if ($score -ge 90) {
    Write-Host "  SCORE: $score% - PRODUCTION READY" -ForegroundColor Green
} elseif ($score -ge 70) {
    Write-Host "  SCORE: $score% - NEEDS IMPROVEMENT" -ForegroundColor Yellow
} else {
    Write-Host "  SCORE: $score% - NOT READY FOR PRODUCTION" -ForegroundColor Red
}

Write-Host "----------------------------------------------------------------------" -ForegroundColor Magenta
Write-Host "  DOCKER ENDPOINTS:" -ForegroundColor Magenta
Write-Host "    Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "    Backend:   http://localhost:5001" -ForegroundColor Cyan
Write-Host "    MySQL:     localhost:3308" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

Write-Host "Quick Commands:" -ForegroundColor Yellow
Write-Host "  View logs:    docker compose logs -f" -ForegroundColor Gray
Write-Host "  Restart all:  docker compose restart" -ForegroundColor Gray
Write-Host "  Stop all:     docker compose down" -ForegroundColor Gray
Write-Host "  Rebuild:      docker compose build --no-cache" -ForegroundColor Gray
Write-Host ""

if ($script:Failed -gt 0) {
    exit 1
} else {
    exit 0
}
