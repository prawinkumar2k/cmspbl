@echo off
REM ============================================
REM SF-ERP Production Deployment Script (Windows)
REM ============================================

echo ============================================
echo SF-ERP Production Deployment
echo ============================================

REM Check required environment variables
if "%DB_PASSWORD%"=="" (
    echo ERROR: DB_PASSWORD is not set
    exit /b 1
)
if "%DB_ROOT_PASSWORD%"=="" (
    echo ERROR: DB_ROOT_PASSWORD is not set
    exit /b 1
)
if "%JWT_SECRET%"=="" (
    echo ERROR: JWT_SECRET is not set
    exit /b 1
)

REM Default values
if "%APP_VERSION%"=="" set APP_VERSION=1.0.0
if "%COMPOSE_PROJECT_NAME%"=="" set COMPOSE_PROJECT_NAME=sf-erp

echo Environment validated
echo   APP_VERSION: %APP_VERSION%
echo   COMPOSE_PROJECT_NAME: %COMPOSE_PROJECT_NAME%

REM Check command
if "%1"=="" goto deploy
if "%1"=="build" goto build
if "%1"=="deploy" goto deploy
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="status" goto status
goto usage

:build
echo Building Docker images...
docker build -t sf-erp-backend:%APP_VERSION% -f docker\backend\Dockerfile .\server
docker build -t sf-erp-frontend:%APP_VERSION% --build-arg VITE_API_URL=/api -f docker\frontend\Dockerfile .
echo Images built successfully
goto end

:deploy
echo Deploying with Docker Compose...
docker-compose -f docker\docker-compose.prod.yml down --remove-orphans 2>nul
docker-compose -f docker\docker-compose.prod.yml up -d --build
echo Deployment complete

echo Waiting for services to be healthy...
timeout /t 30 /nobreak

echo Checking health...
curl -sf http://localhost:80/health
if %errorlevel% neq 0 (
    echo Health check failed
    docker-compose -f docker\docker-compose.prod.yml logs
    exit /b 1
)
echo Services are healthy
goto end

:stop
docker-compose -f docker\docker-compose.prod.yml down
goto end

:logs
docker-compose -f docker\docker-compose.prod.yml logs --tail=50
goto end

:status
docker-compose -f docker\docker-compose.prod.yml ps
goto end

:usage
echo Usage: %0 {build^|deploy^|stop^|logs^|status}
exit /b 1

:end
echo ============================================
echo Operation completed successfully
echo ============================================
