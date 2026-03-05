@echo off
REM Docker Hub Deployment Script for GRT ERP (Windows)
REM This script builds and pushes images to Docker Hub

setlocal enabledelayedexpansion

REM Configuration
if "%DOCKER_USERNAME%"=="" set DOCKER_USERNAME=yourdockerhubusername
set CLIENT_IMAGE=%DOCKER_USERNAME%/grt-erp-client
set SERVER_IMAGE=%DOCKER_USERNAME%/grt-erp-server
set VERSION=%1
if "%VERSION%"=="" set VERSION=latest

echo ========================================
echo GRT ERP Docker Hub Deployment
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Check if logged in to Docker Hub
docker info | findstr /C:"Username" >nul
if errorlevel 1 (
    echo [INFO] Not logged in to Docker Hub. Attempting login...
    docker login
    if errorlevel 1 (
        echo [ERROR] Docker login failed.
        exit /b 1
    )
)

echo [INFO] Building images...
echo.

REM Build Server Image
echo [INFO] Building server image...
docker build -t "%SERVER_IMAGE%:%VERSION%" ./server
if errorlevel 1 (
    echo [ERROR] Failed to build server image
    exit /b 1
)
if not "%VERSION%"=="latest" (
    docker tag "%SERVER_IMAGE%:%VERSION%" "%SERVER_IMAGE%:latest"
)
echo [SUCCESS] Server image built successfully
echo.

REM Build Client Image
echo [INFO] Building client image...
docker build -t "%CLIENT_IMAGE%:%VERSION%" ./client
if errorlevel 1 (
    echo [ERROR] Failed to build client image
    exit /b 1
)
if not "%VERSION%"=="latest" (
    docker tag "%CLIENT_IMAGE%:%VERSION%" "%CLIENT_IMAGE%:latest"
)
echo [SUCCESS] Client image built successfully
echo.

REM Push images
echo [INFO] Pushing images to Docker Hub...
echo.

echo [INFO] Pushing server image...
docker push "%SERVER_IMAGE%:%VERSION%"
if errorlevel 1 (
    echo [ERROR] Failed to push server image
    exit /b 1
)
if not "%VERSION%"=="latest" (
    docker push "%SERVER_IMAGE%:latest"
)
echo [SUCCESS] Server image pushed successfully
echo.

echo [INFO] Pushing client image...
docker push "%CLIENT_IMAGE%:%VERSION%"
if errorlevel 1 (
    echo [ERROR] Failed to push client image
    exit /b 1
)
if not "%VERSION%"=="latest" (
    docker push "%CLIENT_IMAGE%:latest"
)
echo [SUCCESS] Client image pushed successfully
echo.

REM Summary
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Images pushed:
echo   * %SERVER_IMAGE%:%VERSION%
echo   * %CLIENT_IMAGE%:%VERSION%
if not "%VERSION%"=="latest" (
    echo   * %SERVER_IMAGE%:latest
    echo   * %CLIENT_IMAGE%:latest
)
echo.
echo To pull and run these images:
echo   docker pull %SERVER_IMAGE%:%VERSION%
echo   docker pull %CLIENT_IMAGE%:%VERSION%
echo.
echo Or use docker-compose.prod.yml after updating the image names.
echo.

endlocal
