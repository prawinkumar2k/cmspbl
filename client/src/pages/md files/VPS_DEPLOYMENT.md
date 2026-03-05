# VPS Deployment Guide for GRT ERP

This guide covers deploying the GRT ERP system on a VPS server using Docker containers for the application while using the VPS's native MySQL and file storage.

## 🏗️ Architecture

- **MySQL**: Running directly on VPS (not containerized)
- **File Storage**: Direct VPS filesystem (not Docker volumes)
- **Server**: Dockerized Node.js backend
- **Client**: Dockerized React frontend with Nginx

## 📋 Prerequisites

### On Your VPS

1. **Docker & Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **MySQL Server**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   sudo mysql_secure_installation
   
   # Start MySQL
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

3. **Git**
   ```bash
   sudo apt install git
   ```

## 🚀 Step-by-Step Deployment

### 1. Setup MySQL Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE grt_erp;
CREATE USER 'erp_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON grt_erp.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database schema
mysql -u erp_user -p grt_erp < /path/to/database_updates.sql
```

### 2. Create Directory Structure

```bash
# Create application directory
sudo mkdir -p /var/www/grt_erp
cd /var/www/grt_erp

# Clone repository
git clone <your-repo-url> .

# Create uploads directory with proper permissions
sudo mkdir -p uploads
sudo chown -R $USER:$USER uploads
sudo chmod -R 755 uploads
```

### 3. Configure Environment Variables

```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

Update the following values in `.env`:

```env
# Database Configuration (VPS MySQL)
DB_HOST=localhost
DB_USER=erp_user
DB_PASSWORD=your_secure_password
DB_NAME=grt_erp
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (generate a strong random key)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Client Configuration
CLIENT_PORT=80

# VPS Uploads Path
UPLOADS_PATH=/var/www/grt_erp/uploads

# Docker Hub Images
DOCKER_IMAGE=searchfirst/cms
```

### 4. Pull Docker Images

```bash
# Login to Docker Hub
docker login

# Pull images
docker pull searchfirst/cms:server
docker pull searchfirst/cms:client
```

### 5. Deploy Application

```bash
# Start services using production compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 6. Configure Firewall

```bash
# Allow required ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw enable

# Check status
sudo ufw status
```

## 🔒 SSL Configuration with Let's Encrypt

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### Option 1: Nginx on Host (Recommended)

Install Nginx on the VPS to handle SSL and proxy to Docker containers:

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/grt-erp
```

Add this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        alias /var/www/grt_erp/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/grt-erp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Direct Docker with SSL

Update [docker-compose.prod.yml](docker-compose.prod.yml) to include SSL volumes and modify the client service.

## 🔄 Update and Maintenance

### Update Application

```bash
# Pull latest images
docker pull searchfirst/cms:server
docker pull searchfirst/cms:client

# Restart services
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Database Backup

```bash
# Create backup
mysqldump -u erp_user -p grt_erp > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore backup
mysql -u erp_user -p grt_erp < backup-20260105-120000.sql
```

### Application Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f server

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 server
```

### Backup Uploads

```bash
# Create backup
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/grt_erp/uploads

# Restore backup
tar -xzf uploads-backup-20260105.tar.gz -C /var/www/grt_erp/
```

## 📊 Monitoring

### Check Service Status

```bash
# Docker containers
docker-compose -f docker-compose.prod.yml ps

# MySQL
sudo systemctl status mysql

# Nginx (if using)
sudo systemctl status nginx

# Resource usage
docker stats
```

### Health Checks

```bash
# Server health
curl http://localhost:5000/api/health

# Client
curl http://localhost:80
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs server

# Check if port is available
sudo netstat -tulpn | grep :5000

# Restart service
docker-compose -f docker-compose.prod.yml restart server
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u erp_user -p -h localhost grt_erp

# Check if MySQL is running
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Verify credentials in .env file
cat .env | grep DB_
```

### Permission Issues with Uploads

```bash
# Fix permissions
sudo chown -R $USER:$USER /var/www/grt_erp/uploads
sudo chmod -R 755 /var/www/grt_erp/uploads

# Check disk space
df -h
```

### Network Issues

```bash
# Check if containers can access host MySQL
docker-compose -f docker-compose.prod.yml exec server ping host.docker.internal

# Test database connection from container
docker-compose -f docker-compose.prod.yml exec server sh
# Inside container:
nc -zv host.docker.internal 3306
```

## 🔐 Security Best Practices

1. **Strong Passwords**
   - Use strong, unique passwords for MySQL and JWT_SECRET
   - Consider using a password manager

2. **Firewall Configuration**
   - Only expose necessary ports (80, 443)
   - Block direct access to MySQL port from external

3. **Regular Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade
   
   # Update Docker images
   docker pull searchfirst/cms:server
   docker pull searchfirst/cms:client
   ```

4. **Backup Strategy**
   - Regular database backups (daily)
   - Regular upload directory backups
   - Test restore procedures

5. **SSL Certificate**
   - Always use HTTPS in production
   - Auto-renew Let's Encrypt certificates

6. **File Permissions**
   ```bash
   # Secure application directory
   sudo chown -R $USER:www-data /var/www/grt_erp
   sudo chmod -R 750 /var/www/grt_erp
   
   # Uploads should be writable
   sudo chmod -R 755 /var/www/grt_erp/uploads
   ```

## 🔄 Automated Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash

# VPS Deployment Script
set -e

echo "🚀 Starting deployment..."

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker pull searchfirst/cms:server
docker pull searchfirst/cms:client

# Stop current containers
echo "⏸️  Stopping current containers..."
docker-compose -f docker-compose.prod.yml down

# Start new containers
echo "▶️  Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check status
echo "✅ Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo "🎉 Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📝 Quick Reference

### Common Commands

```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# Restart
docker-compose -f docker-compose.prod.yml restart

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Status
docker-compose -f docker-compose.prod.yml ps

# Shell access
docker-compose -f docker-compose.prod.yml exec server sh
```

### File Locations

- Application: `/var/www/grt_erp`
- Uploads: `/var/www/grt_erp/uploads`
- Environment: `/var/www/grt_erp/.env`
- Nginx config: `/etc/nginx/sites-available/grt-erp`
- SSL certs: `/etc/letsencrypt/live/yourdomain.com/`

---

For more details, see:
- [DOCKER_SETUP.md](DOCKER_SETUP.md) - General Docker documentation
- [DOCKER_COMMANDS.md](DOCKER_COMMANDS.md) - Docker command reference
