/**
 * Production-grade Structured Logger
 * Features:
 * - JSON structured logging
 * - Request ID correlation
 * - Log levels
 * - No console.log in production
 * - Performance metrics
 */

import config from '../config/index.js';

// Log Levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const currentLevel = LOG_LEVELS[config.logging.level] ?? LOG_LEVELS.info;

/**
 * Format log entry as JSON
 */
const formatLogEntry = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'sf-erp-backend',
    environment: config.server.env,
    ...meta,
  };

  // Remove undefined values
  Object.keys(entry).forEach(key => {
    if (entry[key] === undefined) {
      delete entry[key];
    }
  });

  return JSON.stringify(entry);
};

/**
 * Should log based on current level
 */
const shouldLog = (level) => {
  return LOG_LEVELS[level] <= currentLevel;
};

/**
 * Main logger object
 */
const logger = {
  error: (message, meta = {}) => {
    if (shouldLog('error')) {
      console.error(formatLogEntry('error', message, meta));
    }
  },

  warn: (message, meta = {}) => {
    if (shouldLog('warn')) {
      console.warn(formatLogEntry('warn', message, meta));
    }
  },

  info: (message, meta = {}) => {
    if (shouldLog('info')) {
      console.info(formatLogEntry('info', message, meta));
    }
  },

  http: (message, meta = {}) => {
    if (shouldLog('http')) {
      console.log(formatLogEntry('http', message, meta));
    }
  },

  debug: (message, meta = {}) => {
    if (shouldLog('debug')) {
      console.debug(formatLogEntry('debug', message, meta));
    }
  },

  /**
   * Log with request context
   */
  withRequest: (req) => ({
    error: (message, meta = {}) => {
      logger.error(message, {
        requestId: req.requestId,
        correlationId: req.correlationId,
        userId: req.user?.id,
        path: req.path,
        method: req.method,
        ...meta,
      });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, {
        requestId: req.requestId,
        correlationId: req.correlationId,
        userId: req.user?.id,
        path: req.path,
        method: req.method,
        ...meta,
      });
    },
    info: (message, meta = {}) => {
      logger.info(message, {
        requestId: req.requestId,
        correlationId: req.correlationId,
        userId: req.user?.id,
        path: req.path,
        method: req.method,
        ...meta,
      });
    },
    debug: (message, meta = {}) => {
      logger.debug(message, {
        requestId: req.requestId,
        correlationId: req.correlationId,
        userId: req.user?.id,
        path: req.path,
        method: req.method,
        ...meta,
      });
    },
  }),

  /**
   * Log database query
   */
  query: (sql, duration, meta = {}) => {
    logger.debug('Database query', {
      type: 'db_query',
      sql: sql.substring(0, 200), // Truncate long queries
      duration,
      ...meta,
    });
  },

  /**
   * Log HTTP request/response
   */
  request: (req, res, duration) => {
    const meta = {
      type: 'http_request',
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.user?.id,
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', meta);
    } else if (res.statusCode >= 400) {
      logger.warn('Request error', meta);
    } else {
      logger.http('Request completed', meta);
    }
  },

  /**
   * Log performance metric
   */
  metric: (name, value, unit, tags = {}) => {
    logger.info('Metric', {
      type: 'metric',
      metric: name,
      value,
      unit,
      tags,
    });
  },

  /**
   * Log application event
   */
  event: (eventName, data = {}) => {
    logger.info('Event', {
      type: 'event',
      event: eventName,
      data,
    });
  },

  /**
   * Log security event
   */
  security: (eventType, data = {}) => {
    logger.warn('Security event', {
      type: 'security',
      event: eventType,
      ...data,
    });
  },
};

export default logger;
