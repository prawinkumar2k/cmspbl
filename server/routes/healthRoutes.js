/**
 * Health Check Routes
 * Provides:
 * - /health - Basic health check
 * - /ready - Readiness probe (checks dependencies)
 * - /live - Liveness probe
 * - /metrics - Basic metrics endpoint
 */

import express from 'express';
import db from '../lib/database.js';
import config from '../config/index.js';
import logger from '../lib/logger.js';

const router = express.Router();

// Server start time for uptime calculation
const serverStartTime = Date.now();

// Basic metrics store
const metrics = {
  requestsTotal: 0,
  requestsSuccess: 0,
  requestsFailed: 0,
  avgResponseTime: 0,
  responseTimes: [],
};

// Middleware to track metrics
export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    metrics.requestsTotal++;
    if (res.statusCode < 400) {
      metrics.requestsSuccess++;
    } else {
      metrics.requestsFailed++;
    }

    // Keep last 1000 response times for avg calculation
    metrics.responseTimes.push(duration);
    if (metrics.responseTimes.length > 1000) {
      metrics.responseTimes.shift();
    }
    metrics.avgResponseTime = Math.round(
      metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
    );
  });

  next();
};

/**
 * GET /health
 * Basic health check - returns 200 if server is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - serverStartTime) / 1000),
    version: process.env.npm_package_version || '1.0.0',
  });
});

/**
 * GET /ready
 * Readiness probe - checks if server can handle requests
 * Checks database connection and other dependencies
 */
router.get('/ready', async (req, res) => {
  const checks = {
    database: { status: 'unknown', latency: null },
    server: { status: 'healthy' },
  };

  let isReady = true;

  // Check database
  try {
    const dbHealth = await db.healthCheck();
    checks.database = {
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      latency: dbHealth.latency,
    };
    if (!dbHealth.healthy) {
      isReady = false;
    }
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error.message,
    };
    isReady = false;
  }

  const statusCode = isReady ? 200 : 503;

  res.status(statusCode).json({
    status: isReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks,
  });
});

/**
 * GET /live
 * Liveness probe - returns 200 if server process is alive
 * Should always return 200 unless process is dead
 */
router.get('/live', (req, res) => {
  // Check for critical conditions that indicate process should be restarted
  const memoryUsage = process.memoryUsage();
  const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

  // If heap usage is over 95%, consider unhealthy
  if (heapUsedPercent > 95) {
    logger.warn('High memory usage detected', { heapUsedPercent });
    return res.status(503).json({
      status: 'unhealthy',
      reason: 'high_memory_usage',
      heapUsedPercent: Math.round(heapUsedPercent),
    });
  }

  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    pid: process.pid,
  });
});

/**
 * GET /metrics
 * Basic metrics for monitoring
 */
router.get('/metrics', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const dbStats = db.getPoolStats();

  res.status(200).json({
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - serverStartTime) / 1000),

    // Request metrics
    requests: {
      total: metrics.requestsTotal,
      success: metrics.requestsSuccess,
      failed: metrics.requestsFailed,
      successRate: metrics.requestsTotal > 0
        ? Math.round((metrics.requestsSuccess / metrics.requestsTotal) * 100 * 100) / 100
        : 100,
      avgResponseTimeMs: metrics.avgResponseTime,
    },

    // Memory metrics
    memory: {
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      externalMB: Math.round(memoryUsage.external / 1024 / 1024),
    },

    // Database metrics
    database: {
      queriesExecuted: dbStats.queriesExecuted,
      queriesFailed: dbStats.queriesFailed,
      connectionErrors: dbStats.connectionErrors,
      poolSize: dbStats.poolSize,
      freeConnections: dbStats.freeConnections,
      pendingRequests: dbStats.pendingRequests,
      isHealthy: dbStats.isHealthy,
    },

    // Environment
    environment: config.server.env,
    nodeVersion: process.version,
  });
});

/**
 * GET /info
 * Server information (non-sensitive)
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    name: 'SF-ERP API Server',
    version: process.env.npm_package_version || '1.0.0',
    environment: config.server.env,
    nodeVersion: process.version,
    uptime: Math.floor((Date.now() - serverStartTime) / 1000),
  });
});

export default router;
