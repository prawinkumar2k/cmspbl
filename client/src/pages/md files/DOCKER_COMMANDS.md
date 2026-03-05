# Docker Quick Reference - GRT ERP

## 🚀 Common Commands

### Starting the Application

```bash
# Development (builds from local source)
docker-compose up -d

# Production (uses Docker Hub images)
docker-compose -f docker-compose.prod.yml up -d

# Build and start
docker-compose up -d --build

# Start specific service
docker-compose up -d server
```

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop server
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server

# Last 100 lines
docker-compose logs --tail=100 server
```

### Service Management

```bash
# Check status
docker-compose ps

# Restart service
docker-compose restart server

# Rebuild specific service
docker-compose up -d --build server

# Execute command in container
docker-compose exec server sh
docker-compose exec mysql mysql -u root -p
```

## 🐳 Docker Hub Workflow

### Building Images

```bash
# Build server
docker build -t yourusername/grt-erp-server:v1.0.0 ./server

# Build client
docker build -t yourusername/grt-erp-client:v1.0.0 ./client
```

### Tagging Images

```bash
# Tag as latest
docker tag yourusername/grt-erp-server:v1.0.0 yourusername/grt-erp-server:latest

# Tag with multiple versions
docker tag yourusername/grt-erp-server:v1.0.0 yourusername/grt-erp-server:v1.0
docker tag yourusername/grt-erp-server:v1.0.0 yourusername/grt-erp-server:v1
```

### Pushing to Docker Hub

```bash
# Login
docker login

# Push specific version
docker push yourusername/grt-erp-server:v1.0.0

# Push latest
docker push yourusername/grt-erp-server:latest

# Push all tags
docker push --all-tags yourusername/grt-erp-server
```

### Pulling from Docker Hub

```bash
# Pull specific version
docker pull yourusername/grt-erp-server:v1.0.0

# Pull latest
docker pull yourusername/grt-erp-server:latest
```

## 🔧 Maintenance Commands

### Database Backup

```bash
# Backup database
docker-compose exec mysql mysqldump -u root -p grt_erp > backup-$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T mysql mysql -u root -p grt_erp < backup-20260105.sql
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune

# Remove everything unused
docker system prune -a --volumes
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect grt_erp_mysql_data

# Remove specific volume
docker volume rm grt_erp_mysql_data
```

## 📊 Monitoring

### Resource Usage

```bash
# Real-time stats
docker stats

# Specific container
docker stats grt_erp_server

# Disk usage
docker system df
```

### Health Checks

```bash
# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Inspect health
docker inspect --format='{{json .State.Health}}' grt_erp_server
```

## 🐛 Debugging

### Container Inspection

```bash
# View container details
docker inspect grt_erp_server

# Check environment variables
docker exec grt_erp_server env

# View running processes
docker top grt_erp_server
```

### Network Troubleshooting

```bash
# List networks
docker network ls

# Inspect network
docker network inspect grt_erp_default

# Test connectivity
docker-compose exec server ping mysql
docker-compose exec server curl http://localhost:5000/api/health
```

### File System Access

```bash
# Copy file from container
docker cp grt_erp_server:/app/logs/error.log ./local-error.log

# Copy file to container
docker cp ./config.json grt_erp_server:/app/config/

# Browse container filesystem
docker-compose exec server ls -la /app
```

## 📝 Environment Variables

### Setting for Deployment

```bash
# Inline for single run
PORT=5001 docker-compose up -d

# Using .env file (recommended)
cp .env.example .env
# Edit .env
docker-compose up -d
```

### Override in docker-compose

```bash
# Using environment option
docker-compose run -e DEBUG=true server npm start

# Using env file
docker-compose --env-file .env.production up -d
```

## 🔄 Updates and Rollbacks

### Update to Latest

```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d

# Or in one command
docker-compose pull && docker-compose up -d
```

### Rollback

```bash
# Use specific version
docker-compose down
# Edit docker-compose.prod.yml to use previous version tag
docker-compose up -d

# Or pull specific version
docker pull yourusername/grt-erp-server:v1.0.0
```

## 🎯 One-Liners

```bash
# Complete restart
docker-compose down && docker-compose up -d

# Rebuild everything
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# View all logs since yesterday
docker-compose logs --since 24h

# Follow logs from last restart
docker-compose logs -f --tail=0

# Remove all GRT ERP containers and images
docker-compose down -v && docker rmi $(docker images | grep grt-erp | awk '{print $3}')

# Database quick backup
docker-compose exec mysql mysqldump -u root -p${DB_ROOT_PASSWORD} grt_erp > backup.sql

# Check disk space used by Docker
docker system df -v

# Prune everything except volumes
docker system prune -a
```

## 🔐 Security Best Practices

```bash
# Run security scan
docker scan yourusername/grt-erp-server:latest

# Check for vulnerabilities
docker scout cves yourusername/grt-erp-server:latest

# Update base images regularly
docker-compose pull
docker-compose up -d --build
```

## 📦 Automated Deployment Script

### Linux/Mac (deploy-docker.sh)
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh v1.0.0
```

### Windows (deploy-docker.bat)
```cmd
deploy-docker.bat v1.0.0
```

## 🆘 Emergency Commands

```bash
# Force stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Reset Docker completely (⚠️ NUCLEAR OPTION)
docker system prune -a --volumes -f

# Fix permission issues (Linux/Mac)
sudo chown -R $USER:$USER ./server/uploads
```

---

**Tip**: Add these aliases to your shell profile for faster access:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'
alias dcrestart='docker-compose restart'
```
