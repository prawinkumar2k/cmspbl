# Docker Setup Guide for GRT ERP

This guide provides comprehensive instructions for deploying the GRT ERP system using Docker and Docker Hub.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Docker Hub account (for pushing images)
- Git (for version control)

## 🏗️ Project Structure

```
GRT_ERP/
├── client/                 # React frontend
│   ├── Dockerfile         # Client Docker configuration
│   ├── nginx.conf         # Nginx configuration for production
│   └── .dockerignore      # Client Docker ignore rules
├── server/                # Node.js backend
│   ├── Dockerfile         # Server Docker configuration
│   └── .dockerignore      # Server Docker ignore rules
├── docker-compose.yml     # Multi-container orchestration
└── .env.example          # Environment variables template
```

## 🚀 Quick Start

### 1. Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd GRT_ERP

# Create environment file
cp .env.example .env

# Edit .env with your actual values
# Important: Change DB_PASSWORD, DB_ROOT_PASSWORD, and JWT_SECRET!
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:5000
- **Database**: localhost:3306

## 🐳 Docker Hub Deployment

### Building and Pushing Images

#### 1. Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

#### 2. Build Images with Tags

```bash
# Build client image
docker build -t <your-dockerhub-username>/grt-erp-client:latest ./client
docker build -t <your-dockerhub-username>/grt-erp-client:v1.0.0 ./client

# Build server image
docker build -t <your-dockerhub-username>/grt-erp-server:latest ./server
docker build -t <your-dockerhub-username>/grt-erp-server:v1.0.0 ./server
```

#### 3. Push Images to Docker Hub

```bash
# Push client images
docker push <your-dockerhub-username>/grt-erp-client:latest
docker push <your-dockerhub-username>/grt-erp-client:v1.0.0

# Push server images
docker push <your-dockerhub-username>/grt-erp-server:latest
docker push <your-dockerhub-username>/grt-erp-server:v1.0.0
```

#### 4. Pull and Run from Docker Hub

```bash
# Pull images
docker pull <your-dockerhub-username>/grt-erp-client:latest
docker pull <your-dockerhub-username>/grt-erp-server:latest

# Run with docker-compose (after updating image names in docker-compose.yml)
docker-compose up -d
```

### Using Docker Hub Images in docker-compose.yml

Update your `docker-compose.yml` to use Docker Hub images instead of building locally:

```yaml
services:
  server:
    image: <your-dockerhub-username>/grt-erp-server:latest
    # Comment out the build section
    # build:
    #   context: ./server
    
  client:
    image: <your-dockerhub-username>/grt-erp-client:latest
    # Comment out the build section
    # build:
    #   context: ./client
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Database
DB_HOST=mysql              # Use 'mysql' for Docker, 'localhost' for local dev
DB_USER=erp_user
DB_PASSWORD=your_secure_password
DB_NAME=grt_erp
DB_ROOT_PASSWORD=your_root_password

# Server
PORT=5000
JWT_SECRET=your-super-secret-key

# Client
CLIENT_PORT=80
```

### Database Initialization

The MySQL container automatically runs `server/database_updates.sql` on first startup. Ensure this file contains your schema and initial data.

## 📊 Docker Commands Reference

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart server

# View logs
docker-compose logs -f [service-name]

# Execute command in container
docker-compose exec server sh
docker-compose exec mysql mysql -u root -p
```

### Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune -a

# Build without cache
docker-compose build --no-cache
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect grt_erp_mysql_data

# Remove volumes (WARNING: Deletes data!)
docker-compose down -v
```

## 🔍 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check if ports are available
netstat -ano | findstr :5000
netstat -ano | findstr :3306
```

### Database Connection Issues

```bash
# Check if MySQL is healthy
docker-compose ps

# Access MySQL directly
docker-compose exec mysql mysql -u root -p

# Test connection from server container
docker-compose exec server sh
# Inside container: ping mysql
```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q grt-erp-*)

# Start fresh
docker-compose up -d --build
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Keep sensitive data out of version control
2. **Use strong passwords** - Generate secure passwords for production
3. **Update base images regularly** - Keep Docker images up to date
4. **Limit exposed ports** - Only expose necessary ports
5. **Use secrets for sensitive data** - Consider Docker secrets for production
6. **Run as non-root user** - Containers run as non-root users by default

## 📦 Production Deployment

### Docker Swarm (Optional)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml grt_erp

# Scale services
docker service scale grt_erp_server=3
```

### Kubernetes (Advanced)

For Kubernetes deployment, convert docker-compose.yml using Kompose:

```bash
kompose convert
kubectl apply -f .
```

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./server
          push: true
          tags: |
            username/grt-erp-server:latest
            username/grt-erp-server:${{ github.sha }}
```

## 📝 Maintenance

### Backup Database

```bash
# Backup
docker-compose exec mysql mysqldump -u root -p grt_erp > backup.sql

# Restore
docker-compose exec -T mysql mysql -u root -p grt_erp < backup.sql
```

### Update Images

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

## 🆘 Support

For issues and questions:
- Check logs: `docker-compose logs -f`
- Verify environment variables in `.env`
- Ensure all ports are available
- Check Docker and Docker Compose versions

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
