<# 
.SYNOPSIS
    SF-ERP Docker Management Script

.DESCRIPTION
    Easy management commands for SF-ERP Docker deployment

.EXAMPLE
    .\scripts\docker-manage.ps1 start
    .\scripts\docker-manage.ps1 stop
    .\scripts\docker-manage.ps1 restart
    .\scripts\docker-manage.ps1 logs
    .\scripts\docker-manage.ps1 status
    .\scripts\docker-manage.ps1 rebuild
    .\scripts\docker-manage.ps1 clean
#>

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "logs", "status", "rebuild", "clean", "shell", "backup", "help")]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [ValidateSet("server", "client", "mysql", "all")]
    [string]$Service = "all"
)

$ErrorActionPreference = "Continue"

function Write-Header {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          SF-ERP Docker Management                            ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Write-Header
    Write-Host "Usage: .\docker-manage.ps1 <command> [service]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  start     - Start all containers" -ForegroundColor Gray
    Write-Host "  stop      - Stop all containers" -ForegroundColor Gray
    Write-Host "  restart   - Restart all containers" -ForegroundColor Gray
    Write-Host "  logs      - View container logs (Ctrl+C to exit)" -ForegroundColor Gray
    Write-Host "  status    - Show container status" -ForegroundColor Gray
    Write-Host "  rebuild   - Rebuild and restart all containers" -ForegroundColor Gray
    Write-Host "  clean     - Remove all containers, images and volumes" -ForegroundColor Gray
    Write-Host "  shell     - Open shell in a container" -ForegroundColor Gray
    Write-Host "  backup    - Backup MySQL database" -ForegroundColor Gray
    Write-Host "  help      - Show this help" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Services: server, client, mysql, all" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\docker-manage.ps1 start" -ForegroundColor Gray
    Write-Host "  .\docker-manage.ps1 logs server" -ForegroundColor Gray
    Write-Host "  .\docker-manage.ps1 shell mysql" -ForegroundColor Gray
    Write-Host ""
}

function Get-ServiceName {
    param($svc)
    switch ($svc) {
        "server" { return "sf_erp_server" }
        "client" { return "sf_erp_client" }
        "mysql" { return "sf_erp_db" }
        default { return $null }
    }
}

Write-Header

switch ($Command) {
    "start" {
        Write-Host "🚀 Starting SF-ERP containers..." -ForegroundColor Green
        if ($Service -eq "all") {
            docker compose up -d
        } else {
            docker compose up -d $Service
        }
        Write-Host ""
        docker compose ps
    }
    
    "stop" {
        Write-Host "🛑 Stopping SF-ERP containers..." -ForegroundColor Yellow
        if ($Service -eq "all") {
            docker compose down
        } else {
            docker compose stop $Service
        }
    }
    
    "restart" {
        Write-Host "🔄 Restarting SF-ERP containers..." -ForegroundColor Yellow
        if ($Service -eq "all") {
            docker compose restart
        } else {
            docker compose restart $Service
        }
        Write-Host ""
        docker compose ps
    }
    
    "logs" {
        Write-Host "📋 Viewing logs (Ctrl+C to exit)..." -ForegroundColor Cyan
        if ($Service -eq "all") {
            docker compose logs -f --tail 100
        } else {
            $containerName = Get-ServiceName $Service
            if ($containerName) {
                docker logs -f --tail 100 $containerName
            } else {
                docker compose logs -f --tail 100 $Service
            }
        }
    }
    
    "status" {
        Write-Host "📊 Container Status:" -ForegroundColor Cyan
        Write-Host ""
        docker compose ps
        Write-Host ""
        Write-Host "📈 Resource Usage:" -ForegroundColor Cyan
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
        Write-Host ""
        Write-Host "🔗 Endpoints:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
        Write-Host "  Backend:  http://localhost:5001" -ForegroundColor Green
        Write-Host "  MySQL:    localhost:3308" -ForegroundColor Green
        Write-Host ""
        
        # Health checks
        Write-Host "🏥 Health Checks:" -ForegroundColor Cyan
        try {
            $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -TimeoutSec 5
            Write-Host "  Backend API: ✅ $($health.status)" -ForegroundColor Green
        } catch {
            Write-Host "  Backend API: ❌ Not responding" -ForegroundColor Red
        }
        
        try {
            $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
            Write-Host "  Frontend:    ✅ HTTP $($frontend.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "  Frontend:    ❌ Not responding" -ForegroundColor Red
        }
    }
    
    "rebuild" {
        Write-Host "🔨 Rebuilding SF-ERP containers..." -ForegroundColor Yellow
        Write-Host "This will stop, rebuild, and restart all containers." -ForegroundColor Gray
        Write-Host ""
        
        docker compose down
        docker compose build --no-cache
        docker compose up -d
        
        Write-Host ""
        Write-Host "⏳ Waiting for containers to be healthy..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        docker compose ps
    }
    
    "clean" {
        Write-Host "🧹 This will remove ALL containers, images, and volumes!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? Type 'yes' to confirm"
        
        if ($confirm -eq "yes") {
            Write-Host "Stopping containers..." -ForegroundColor Yellow
            docker compose down -v --rmi all
            
            Write-Host "Removing orphan volumes..." -ForegroundColor Yellow
            docker volume prune -f
            
            Write-Host "✅ Cleanup complete" -ForegroundColor Green
        } else {
            Write-Host "Cancelled." -ForegroundColor Gray
        }
    }
    
    "shell" {
        $containerName = Get-ServiceName $Service
        if (-not $containerName) {
            Write-Host "Please specify a service: server, client, or mysql" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "🐚 Opening shell in $containerName..." -ForegroundColor Cyan
        
        if ($Service -eq "mysql") {
            docker exec -it $containerName mysql -u root -pPrawin@2k4 cms
        } else {
            docker exec -it $containerName sh
        }
    }
    
    "backup" {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupFile = "backup_cms_$timestamp.sql"
        
        Write-Host "💾 Creating database backup: $backupFile" -ForegroundColor Cyan
        
        docker exec sf_erp_db mysqldump -u root -pPrawin@2k4 cms > $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            $size = (Get-Item $backupFile).Length / 1KB
            Write-Host "✅ Backup created: $backupFile ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
        } else {
            Write-Host "❌ Backup failed" -ForegroundColor Red
        }
    }
    
    "help" {
        Show-Help
    }
    
    default {
        Show-Help
    }
}

Write-Host ""
