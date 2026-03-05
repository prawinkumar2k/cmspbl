/**
 * SECURITY MCP (Master Control Plane)
 * Security Enforcement and Protection
 * 
 * Features:
 * - Authentication enforcement
 * - Authorization matrix
 * - Rate limiting
 * - Abuse detection
 * - Secure headers
 * - Input sanitization
 * - XSS protection
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import config from '../config/index.js';
import logger from '../lib/logger.js';
import { AppError } from './errorMcp.js';

/**
 * Role-based permission matrix
 */
export const PERMISSIONS = {
  // Admin permissions
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    students: ['create', 'read', 'update', 'delete'],
    staff: ['create', 'read', 'update', 'delete'],
    fees: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    settings: ['read', 'update'],
    audit: ['read'],
  },
  // Staff permissions
  staff: {
    students: ['read', 'update'],
    attendance: ['create', 'read', 'update'],
    marks: ['create', 'read', 'update'],
    reports: ['read'],
  },
  // Student permissions
  student: {
    profile: ['read'],
    attendance: ['read'],
    marks: ['read'],
    fees: ['read'],
  },
};

/**
 * Check if role has permission
 */
export const hasPermission = (role, resource, action) => {
  const rolePerms = PERMISSIONS[role?.toLowerCase()];
  if (!rolePerms) return false;
  
  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;
  
  return resourcePerms.includes(action);
};

/**
 * Authorization middleware factory
 */
export const authorize = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role_name;
    
    if (!hasPermission(userRole, resource, action)) {
      logger.security('unauthorized_access', {
        requestId: req.requestId,
        userId: req.user?.id,
        role: userRole,
        resource,
        action,
        path: req.path,
      });
      
      return next(new AppError('AUTHZ_INSUFFICIENT_PERMISSIONS', {
        resource,
        action,
        role: userRole,
      }));
    }
    
    next();
  };
};

/**
 * Suspicious activity detector
 */
const suspiciousActivityStore = new Map();
const SUSPICIOUS_THRESHOLD = 10;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

export const detectSuspiciousActivity = (identifier, activity) => {
  const key = `${identifier}:${activity}`;
  const now = Date.now();
  
  let record = suspiciousActivityStore.get(key) || {
    count: 0,
    firstSeen: now,
    blocked: false,
    blockedUntil: null,
  };
  
  // Reset if window expired
  if (now - record.firstSeen > 60000) {
    record = { count: 0, firstSeen: now, blocked: false, blockedUntil: null };
  }
  
  record.count++;
  
  if (record.count >= SUSPICIOUS_THRESHOLD) {
    record.blocked = true;
    record.blockedUntil = now + BLOCK_DURATION;
    
    logger.security('suspicious_activity_blocked', {
      identifier,
      activity,
      count: record.count,
    });
  }
  
  suspiciousActivityStore.set(key, record);
  
  return {
    suspicious: record.count >= SUSPICIOUS_THRESHOLD / 2,
    blocked: record.blocked && now < record.blockedUntil,
    count: record.count,
  };
};

/**
 * Abuse detection middleware
 */
export const abuseDetectionMiddleware = (req, res, next) => {
  const identifier = req.ip || req.connection?.remoteAddress;
  
  // Check for blocked IPs
  const failedLoginCheck = detectSuspiciousActivity(identifier, 'failed_login');
  const rateLimitCheck = detectSuspiciousActivity(identifier, 'rate_limit');
  
  if (failedLoginCheck.blocked || rateLimitCheck.blocked) {
    return res.status(429).json({
      success: false,
      error: {
        code: 5002,
        message: 'Your access has been temporarily blocked due to suspicious activity',
        retryAfter: Math.ceil(BLOCK_DURATION / 1000),
      },
    });
  }
  
  next();
};

/**
 * Password security utilities
 */
export const passwordUtils = {
  // Hash password
  hash: async (password) => {
    return bcrypt.hash(password, config.security.bcryptRounds);
  },
  
  // Compare password
  compare: async (password, hash) => {
    return bcrypt.compare(password, hash);
  },
  
  // Check password strength
  checkStrength: (password) => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return {
      valid: checks.minLength && score >= 3,
      score,
      checks,
      strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
    };
  },
  
  // Generate random password
  generate: (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from(randomBytes(length))
      .map(byte => chars[byte % chars.length])
      .join('');
  },
};

/**
 * Token utilities
 */
export const tokenUtils = {
  // Generate JWT
  generate: (payload, expiresIn = config.jwt.expiresIn) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn });
  },
  
  // Verify JWT
  verify: (token) => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('AUTH_TOKEN_EXPIRED');
      }
      throw new AppError('AUTH_TOKEN_INVALID');
    }
  },
  
  // Decode without verification
  decode: (token) => {
    return jwt.decode(token);
  },
  
  // Generate refresh token
  generateRefresh: (payload) => {
    return jwt.sign(payload, config.jwt.secret, { 
      expiresIn: config.jwt.refreshExpiresIn 
    });
  },
  
  // Generate random token (for password reset, etc.)
  generateRandom: (length = 32) => {
    return randomBytes(length).toString('hex');
  },
  
  // Hash token for storage
  hashToken: (token) => {
    return createHash('sha256').update(token).digest('hex');
  },
};

/**
 * Input sanitization
 */
export const sanitize = {
  // Remove HTML tags
  stripHtml: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<[^>]*>/g, '');
  },
  
  // Escape HTML entities
  escapeHtml: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  // Sanitize SQL input (for logging only, always use parameterized queries)
  escapeSql: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%': return '\\' + char;
        default: return char;
      }
    });
  },
  
  // Sanitize filename
  filename: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[^a-zA-Z0-9.-_]/g, '_');
  },
  
  // Deep sanitize object
  object: (obj, sanitizers = ['stripHtml']) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const result = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        let sanitized = value;
        for (const s of sanitizers) {
          sanitized = sanitize[s](sanitized);
        }
        result[key] = sanitized;
      } else if (typeof value === 'object') {
        result[key] = sanitize.object(value, sanitizers);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  },
};

/**
 * Security headers middleware (supplement to helmet)
 */
export const securityHeadersMiddleware = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Set strict transport security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Feature policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  
  next();
};

/**
 * CSRF token generation and validation
 */
const csrfTokens = new Map();
const CSRF_TOKEN_TTL = 3600000; // 1 hour

export const csrf = {
  generate: (sessionId) => {
    const token = randomBytes(32).toString('hex');
    csrfTokens.set(token, {
      sessionId,
      created: Date.now(),
    });
    return token;
  },
  
  validate: (token, sessionId) => {
    const stored = csrfTokens.get(token);
    if (!stored) return false;
    if (Date.now() - stored.created > CSRF_TOKEN_TTL) {
      csrfTokens.delete(token);
      return false;
    }
    if (stored.sessionId !== sessionId) return false;
    
    // Use once
    csrfTokens.delete(token);
    return true;
  },
};

// Cleanup expired CSRF tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now - data.created > CSRF_TOKEN_TTL) {
      csrfTokens.delete(token);
    }
  }
}, 300000); // Every 5 minutes

export default {
  PERMISSIONS,
  hasPermission,
  authorize,
  detectSuspiciousActivity,
  abuseDetectionMiddleware,
  passwordUtils,
  tokenUtils,
  sanitize,
  securityHeadersMiddleware,
  csrf,
};
