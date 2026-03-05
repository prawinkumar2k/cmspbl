# Installation & Setup

This guide will walk you through setting up the SF ERP system on your local machine using Docker.

## Prerequisites

1.  **Docker Desktop**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows/Mac/Linux.
2.  **Git**: (Optional) For version control.

## Initial Setup

1.  **Clone/Extract**: Ensure the project folder `SF_ERP-main` is on your machine.
2.  **Environment Variables**: Update the `.env` file in the root if necessary. The default values are tuned for the Docker environment.

### Default `.env` Settings:
```env
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=Prawin@2k4
DB_NAME=cms
DB_PORT=3306
JWT_SECRET=sf-erp-super-secret-jwt-key-2026
```

## Running with Docker

The easiest way to run the project is using Docker Compose.

1.  **Open Terminal**: Open a terminal (PowerShell, CMD, or Bash) in the root project folder.
2.  **Build and Start**:
    ```powershell
    docker-compose up -d --build
    ```
3.  **Monitor Logs**:
    ```powershell
    docker-compose logs -f server
    ```

## Post-Installation Steps

### 1. Database Initialization
The `docker-compose.yml` is configured to automatically load the `cms.sql` schema when the database container is first created. If you need to manually import a schema:

```powershell
docker exec -i sf_erp_db mysql -uroot -pPrawin@2k4 cms < cms.sql
```

### 2. Accessing the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Admin Login**:
    - **Username**: `Admin` (or your specific staff ID e.g. `10000001`)
    - **Password**: `Prawin@2k4` (or configured password)

## Updating the System

If you make changes to the code:
1.  Restart the specific service:
    ```powershell
    docker-compose up -d --build server
    ```
2.  Or restart everything:
    ```powershell
    docker-compose down
    docker-compose up -d --build
    ```
