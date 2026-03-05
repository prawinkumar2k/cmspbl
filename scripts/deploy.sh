#!/bin/bash
# ============================================
# SF-ERP Production Deployment Script
# ============================================
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}SF-ERP Production Deployment${NC}"
echo -e "${GREEN}============================================${NC}"

# Check required environment variables
check_env() {
    local var_name=$1
    if [ -z "${!var_name}" ]; then
        echo -e "${RED}ERROR: $var_name is not set${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}Checking environment variables...${NC}"
check_env "DB_PASSWORD"
check_env "DB_ROOT_PASSWORD"
check_env "JWT_SECRET"

# Default values
export APP_VERSION=${APP_VERSION:-"1.0.0"}
export DOCKER_REGISTRY=${DOCKER_REGISTRY:-""}
export COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME:-"sf-erp"}

echo -e "${GREEN}Environment validated${NC}"
echo "  APP_VERSION: $APP_VERSION"
echo "  COMPOSE_PROJECT_NAME: $COMPOSE_PROJECT_NAME"

# Function to build images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    
    # Build backend
    docker build -t ${DOCKER_REGISTRY}sf-erp-backend:${APP_VERSION} \
        -f docker/backend/Dockerfile \
        ./server
    
    # Build frontend
    docker build -t ${DOCKER_REGISTRY}sf-erp-frontend:${APP_VERSION} \
        --build-arg VITE_API_URL=/api \
        --build-arg VITE_APP_VERSION=${APP_VERSION} \
        -f docker/frontend/Dockerfile \
        .
    
    echo -e "${GREEN}Images built successfully${NC}"
}

# Function to push images
push_images() {
    if [ -n "$DOCKER_REGISTRY" ]; then
        echo -e "${YELLOW}Pushing images to registry...${NC}"
        docker push ${DOCKER_REGISTRY}sf-erp-backend:${APP_VERSION}
        docker push ${DOCKER_REGISTRY}sf-erp-frontend:${APP_VERSION}
        echo -e "${GREEN}Images pushed successfully${NC}"
    else
        echo -e "${YELLOW}No registry configured, skipping push${NC}"
    fi
}

# Function to deploy with Docker Compose
deploy_compose() {
    echo -e "${YELLOW}Deploying with Docker Compose...${NC}"
    
    docker-compose -f docker/docker-compose.prod.yml down --remove-orphans || true
    docker-compose -f docker/docker-compose.prod.yml up -d
    
    echo -e "${GREEN}Deployment complete${NC}"
}

# Function to check deployment health
health_check() {
    echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf http://localhost:80/health > /dev/null 2>&1; then
            echo -e "${GREEN}Frontend is healthy${NC}"
            break
        fi
        echo "  Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}Health check failed${NC}"
        docker-compose -f docker/docker-compose.prod.yml logs
        exit 1
    fi
    
    # Check backend health
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker exec sf-erp-backend curl -sf http://localhost:5000/health > /dev/null 2>&1; then
            echo -e "${GREEN}Backend is healthy${NC}"
            break
        fi
        echo "  Attempt $attempt/$max_attempts - waiting for backend..."
        sleep 5
        ((attempt++))
    done
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}Recent logs:${NC}"
    docker-compose -f docker/docker-compose.prod.yml logs --tail=50
}

# Main deployment flow
case "${1:-deploy}" in
    build)
        build_images
        ;;
    push)
        push_images
        ;;
    deploy)
        build_images
        deploy_compose
        health_check
        ;;
    restart)
        docker-compose -f docker/docker-compose.prod.yml restart
        health_check
        ;;
    stop)
        docker-compose -f docker/docker-compose.prod.yml down
        ;;
    logs)
        show_logs
        ;;
    status)
        docker-compose -f docker/docker-compose.prod.yml ps
        ;;
    *)
        echo "Usage: $0 {build|push|deploy|restart|stop|logs|status}"
        exit 1
        ;;
esac

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Operation completed successfully${NC}"
echo -e "${GREEN}============================================${NC}"
