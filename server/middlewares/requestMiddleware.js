/**
 * Request Middleware
 * Features:
 * - Request ID generation for tracing
 * - Correlation ID propagation
 * - Request logging
 * - Response time tracking
 */

import { randomUUID } from 'crypto';
import logger from '../lib/logger.js';

/**
 * Generate and attach request ID
 */
export const requestIdMiddleware = (req, res, next) => {
  // Use existing request ID from header or generate new one
  req.requestId = req.headers['x-request-id'] || randomUUID();
  req.correlationId = req.headers['x-correlation-id'] || req.requestId;
  
  // Attach to response headers for client correlation
  res.setHeader('X-Request-ID', req.requestId);
  res.setHeader('X-Correlation-ID', req.correlationId);
  
  next();
};

/**
 * Request logging middleware with timing
 */
export const requestLoggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request start
  logger.debug('Request started', {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection?.remoteAddress,
  });
  
  // Override res.end to capture response timing
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Attach duration to response for other middleware
    res.duration = duration;
    
    // Log request completion
    logger.request(req, res, duration);
    
    // Set server timing header
    res.setHeader('Server-Timing', `total;dur=${duration}`);
    
    originalEnd.apply(res, args);
  };
  
  next();
};

/**
 * Security headers middleware (additional to helmet)
 */
export const securityHeadersMiddleware = (req, res, next) => {
  // Remove server identification
  res.removeHeader('X-Powered-By');
  
  // Add additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

/**
 * Request timeout middleware
 */
export const timeoutMiddleware = (timeout = 30000) => {
  return (req, res, next) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          requestId: req.requestId,
          path: req.path,
          method: req.method,
          timeout,
        });
        
        res.status(504).json({
          success: false,
          error: {
            code: 6004,
            message: 'Request timeout',
            requestId: req.requestId,
          },
        });
      }
    }, timeout);
    
    // Clear timeout when response is sent
    res.on('finish', () => clearTimeout(timeoutId));
    res.on('close', () => clearTimeout(timeoutId));
    
    next();
  };
};

export default {
  requestIdMiddleware,
  requestLoggingMiddleware,
  securityHeadersMiddleware,
  timeoutMiddleware,
};
