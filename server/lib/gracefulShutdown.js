/**
 * Graceful Shutdown Handler
 * Features:
 * - Handles SIGTERM, SIGINT signals
 * - Stops accepting new connections
 * - Waits for in-flight requests
 * - Closes database connections
 * - Configurable timeout
 */

import config from '../config/index.js';
import logger from '../lib/logger.js';
import db from '../lib/database.js';

let isShuttingDown = false;
let server = null;
let shutdownCallbacks = [];

/**
 * Register server instance for graceful shutdown
 */
export const registerServer = (serverInstance) => {
  server = serverInstance;
};

/**
 * Register additional shutdown callbacks
 */
export const onShutdown = (callback) => {
  shutdownCallbacks.push(callback);
};

/**
 * Perform graceful shutdown
 */
const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress, ignoring signal', { signal });
    return;
  }
  
  isShuttingDown = true;
  logger.info('Graceful shutdown initiated', { signal });
  
  // Set a hard timeout for shutdown
  const forceShutdownTimeout = setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, config.server.shutdownTimeout);
  
  try {
    // Stop accepting new connections
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error('Error closing server', { error: err.message });
            reject(err);
          } else {
            logger.info('Server stopped accepting new connections');
            resolve();
          }
        });
      });
    }
    
    // Run custom shutdown callbacks
    for (const callback of shutdownCallbacks) {
      try {
        await callback();
      } catch (error) {
        logger.error('Shutdown callback failed', { error: error.message });
      }
    }
    
    // Close database connections
    await db.shutdown();
    
    clearTimeout(forceShutdownTimeout);
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error: error.message });
    clearTimeout(forceShutdownTimeout);
    process.exit(1);
  }
};

/**
 * Setup signal handlers
 */
export const setupGracefulShutdown = () => {
  // Handle termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught errors that should trigger shutdown
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
      error: error.message,
      stack: error.stack,
    });
    gracefulShutdown('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
    });
    // Don't shutdown on unhandled rejection, just log
  });
  
  logger.info('Graceful shutdown handlers registered');
};

/**
 * Check if server is shutting down
 */
export const isServerShuttingDown = () => isShuttingDown;

/**
 * Middleware to reject new requests during shutdown
 */
export const shutdownMiddleware = (req, res, next) => {
  if (isShuttingDown) {
    res.set('Connection', 'close');
    return res.status(503).json({
      success: false,
      error: {
        code: 6003,
        message: 'Server is shutting down',
      },
    });
  }
  next();
};

export default {
  registerServer,
  onShutdown,
  setupGracefulShutdown,
  isServerShuttingDown,
  shutdownMiddleware,
};
