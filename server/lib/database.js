/**
 * Production-grade MongoDB Connection Manager
 * Shared MongoDB connection manager
 * Maintains same export interface (initialize, healthCheck, shutdown, getPoolStats)
 */

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import logger from '../lib/logger.js';

/**
 * Health check - pings MongoDB
 */
export const healthCheck = async () => {
  try {
    const startTime = Date.now();

    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected');
    }

    await mongoose.connection.db.admin().ping();
    const duration = Date.now() - startTime;

    return {
      healthy: true,
      latency: duration,
      timestamp: new Date().toISOString(),
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    };
  } catch (error) {
    logger.error('MongoDB health check failed', { error: error.message });
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get connection statistics (replaces pool stats)
 */
export const getPoolStats = () => {
  const { readyState, host, name, port } = mongoose.connection;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return {
    readyState: states[readyState] || 'unknown',
    host,
    database: name,
    port,
    // Mongoose internal pool info
    poolSize: mongoose.connection?.client?.topology?.s?.pool?.totalConnectionCount || 0,
  };
};

/**
 * Graceful shutdown
 */
export const shutdown = async () => {
  try {
    logger.info('Closing MongoDB connections...');
    await mongoose.connection.close();
    logger.info('MongoDB connections closed successfully');
  } catch (error) {
    logger.error('Error closing MongoDB connection', { error: error.message });
    throw error;
  }
};

/**
 * Initialize - called at app startup
 */
export const initialize = async () => {
  try {
    await connectDB();

    const health = await healthCheck();

    if (health.healthy) {
      logger.info('Database connection established', {
        database: health.database,
        host: health.host,
        latency: health.latency,
      });
    } else {
      throw new Error('MongoDB health check failed after connecting');
    }

    return health;
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message });
    throw error;
  }
};

// Default export — same interface as before so app.js works unchanged
export default {
  initialize,
  healthCheck,
  shutdown,
  getPoolStats,
};
