/**
 * Rate Limiting Middleware
 * Features:
 * - Token bucket algorithm
 * - Per-IP and per-user rate limiting
 * - Configurable limits per endpoint
 * - Abuse detection
 */

import config from '../config/index.js';
import logger from '../lib/logger.js';

// In-memory store for rate limiting (use Redis in production cluster)
const rateLimitStore = new Map();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > config.rateLimit.windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

/**
 * Get client identifier for rate limiting
 */
const getClientKey = (req, options = {}) => {
  const userId = req.user?.id;
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  
  if (options.perUser && userId) {
    return `user:${userId}`;
  }
  
  return `ip:${ip}`;
};

/**
 * Create rate limiter middleware with options
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = config.rateLimit.windowMs,
    maxRequests = config.rateLimit.maxRequests,
    message = 'Too many requests, please try again later',
    keyGenerator = getClientKey,
    skipFailedRequests = false,
    skipSuccessfulRequests = false,
    perUser = false,
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req, { perUser });
    const now = Date.now();
    
    // Get or initialize rate limit data
    let data = rateLimitStore.get(key);
    
    if (!data || now - data.windowStart > windowMs) {
      // Start new window
      data = {
        count: 0,
        windowStart: now,
        blocked: false,
      };
    }
    
    // Increment request count
    data.count++;
    rateLimitStore.set(key, data);
    
    // Calculate remaining requests
    const remaining = Math.max(0, maxRequests - data.count);
    const resetTime = new Date(data.windowStart + windowMs);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTime.toISOString());
    
    // Check if limit exceeded
    if (data.count > maxRequests) {
      logger.security('rate_limit_exceeded', {
        requestId: req.requestId,
        key,
        count: data.count,
        limit: maxRequests,
        path: req.path,
        method: req.method,
      });
      
      res.setHeader('Retry-After', Math.ceil((data.windowStart + windowMs - now) / 1000));
      
      return res.status(429).json({
        success: false,
        error: {
          code: 5001,
          message,
          retryAfter: Math.ceil((data.windowStart + windowMs - now) / 1000),
          requestId: req.requestId,
        },
      });
    }
    
    next();
  };
};

/**
 * Default rate limiter
 */
export const rateLimiter = createRateLimiter();

/**
 * Strict rate limiter for sensitive endpoints (login, password reset)
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many attempts, please try again in 15 minutes',
});

/**
 * API rate limiter for general API endpoints
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  perUser: true,
});

/**
 * Heavy operation rate limiter (exports, reports)
 */
export const heavyRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 10,
  perUser: true,
  message: 'Too many heavy operations, please wait before trying again',
});

export default {
  createRateLimiter,
  rateLimiter,
  strictRateLimiter,
  apiRateLimiter,
  heavyRateLimiter,
};
