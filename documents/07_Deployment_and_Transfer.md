# Deployment & Project Transfer

This guide explains how to deploy the system to a production server (VPS) or move it between development laptops.

## Transferring to a New Laptop

Since the project uses Docker, moving it is very simple.

### On the SOURCE Laptop:
1.  **Stop Containers**:
    ```powershell
    docker-compose down
    ```
2.  **Backup Database**:
    ```powershell
    docker exec sf_erp_db mysqldump -uroot -pPrawin@2k4 cms > project_backup.sql
    ```
3.  **Compress Project**: Zip the entire `SF_ERP-main` folder. Ensure `.env` is included.

### On the DESTINATION Laptop:
1.  **Install Docker Desktop**.
2.  **Extract Project** zip.
3.  **Start Stack**:
    ```powershell
    docker-compose up -d --build
    ```
4.  **Restore Data**:
    ```powershell
    docker exec -i sf_erp_db mysql -uroot -pPrawin@2k4 cms < project_backup.sql
    ```

## Deploying to a Production VPS

1.  **Install Docker & Docker Compose** on the VPS (Ubuntu is recommended).
2.  **Copy Files**: Use SCP or Git to move the project to `/var/www/sf-erp`.
3.  **Production Configuration**:
    - Use `docker-compose.production.yml`.
    - Ensure your `.env` has a strong `JWT_SECRET` and secure DB passwords.
4.  **Start Production Node**:
    ```bash
    docker-compose -f docker-compose.production.yml up -d --build
    ```

## Backup & Data Safety

- **Code**: Use Git (GitHub/Bitbucket) to store code updates.
- **Database**: Schedule daily `mysqldump` cron jobs on the host machine.
- **Uploads**: Regularly backup the `server/uploads` directory.

## Managing Logs

Logs are standard output from the containers:
```bash
docker-compose logs -f --tail 100
```
To see specific logs from the database:
```bash
docker exec sf_erp_db tail -f /var/log/mysql/error.log
```
