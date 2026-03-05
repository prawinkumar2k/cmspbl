#!/bin/bash

# Docker Hub Deployment Script for GRT ERP
# This script builds and pushes images to Docker Hub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-yourdockerhubusername}"
CLIENT_IMAGE="$DOCKER_USERNAME/grt-erp-client"
SERVER_IMAGE="$DOCKER_USERNAME/grt-erp-server"
VERSION="${1:-latest}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}GRT ERP Docker Hub Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Not logged in to Docker Hub. Attempting login...${NC}"
    docker login
fi

echo -e "${GREEN}Building images...${NC}"
echo ""

# Build Server Image
echo -e "${YELLOW}Building server image...${NC}"
docker build -t "$SERVER_IMAGE:$VERSION" ./server
if [ "$VERSION" != "latest" ]; then
    docker tag "$SERVER_IMAGE:$VERSION" "$SERVER_IMAGE:latest"
fi
echo -e "${GREEN}✓ Server image built successfully${NC}"
echo ""

# Build Client Image
echo -e "${YELLOW}Building client image...${NC}"
docker build -t "$CLIENT_IMAGE:$VERSION" ./client
if [ "$VERSION" != "latest" ]; then
    docker tag "$CLIENT_IMAGE:$VERSION" "$CLIENT_IMAGE:latest"
fi
echo -e "${GREEN}✓ Client image built successfully${NC}"
echo ""

# Push images
echo -e "${GREEN}Pushing images to Docker Hub...${NC}"
echo ""

echo -e "${YELLOW}Pushing server image...${NC}"
docker push "$SERVER_IMAGE:$VERSION"
if [ "$VERSION" != "latest" ]; then
    docker push "$SERVER_IMAGE:latest"
fi
echo -e "${GREEN}✓ Server image pushed successfully${NC}"
echo ""

echo -e "${YELLOW}Pushing client image...${NC}"
docker push "$CLIENT_IMAGE:$VERSION"
if [ "$VERSION" != "latest" ]; then
    docker push "$CLIENT_IMAGE:latest"
fi
echo -e "${GREEN}✓ Client image pushed successfully${NC}"
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Images pushed:"
echo "  • $SERVER_IMAGE:$VERSION"
echo "  • $CLIENT_IMAGE:$VERSION"
if [ "$VERSION" != "latest" ]; then
    echo "  • $SERVER_IMAGE:latest"
    echo "  • $CLIENT_IMAGE:latest"
fi
echo ""
echo "To pull and run these images:"
echo "  docker pull $SERVER_IMAGE:$VERSION"
echo "  docker pull $CLIENT_IMAGE:$VERSION"
echo ""
echo "Or use docker-compose.prod.yml after updating the image names."
echo ""
