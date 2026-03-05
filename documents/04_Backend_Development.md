# Backend Development Guide

The backend is built with Node.js and Express, following a Route-Controller pattern.

## Server Entry Point
- **File**: `server/server.js`
- **Role**: Initializes Express, configures middleware (CORS, JSON, Helmet), and mounts all API routes.

## Core Directories
- `/server/routes`: Route definitions and endpoint mappings.
- `/server/controller`: Business logic and database interaction functions.
- `/server/db.js`: Database connection pool configuration.
- `/server/utils`: Utility functions (Logging, Date Helpers).

## Adding a New Route

1.  **Create a Controller**: Add a new file in `server/controller/` (e.g., `attendanceController.js`).
    ```javascript
    export const getAttendance = async (req, res) => {
      try {
        const [rows] = await db.query('SELECT * FROM attendance');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
    ```
2.  **Create a Router**: Add a new file in `server/routes/` (e.g., `attendanceRoutes.js`).
    ```javascript
    import express from 'express';
    import { getAttendance } from '../controller/attendanceController.js';
    const router = express.Router();
    router.get('/list', getAttendance);
    export default router;
    ```
3.  **Mount in `server.js`**:
    ```javascript
    import attendanceRoutes from './routes/attendanceRoutes.js';
    app.use('/api/attendance', attendanceRoutes);
    ```

## Authentication Middleware

Protect routes by using the `verifyToken` and `authorizeRoles` middlewares found in `server/middlewares/authMiddleware.js`.

```javascript
router.get('/admin-only', verifyToken, authorizeRoles('Admin'), someController);
```

## Database Queries

The system uses `mysql2/promise` for asynchronous queries. Always use parametrized queries to prevent SQL injection:

```javascript
const [rows] = await db.query('SELECT * FROM staff_master WHERE Staff_ID = ?', [id]);
```

## Error Handling

Controllers are wrapped in `try-catch` blocks. Error logs are printed to the console (accessible via `docker-compose logs`).
