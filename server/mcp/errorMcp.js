/**
 * ERROR MCP (Master Control Plane)
 * Centralized Error Taxonomy and Handling
 * 
 * This module provides:
 * - Standardized error codes
 * - Error classification
 * - Client-safe error responses
 * - Internal vs external error separation
 */

// Error Codes Taxonomy
export const ErrorCodes = {
  // Authentication Errors (1000-1099)
  AUTH_TOKEN_MISSING: { code: 1001, message: 'Authentication token is required', httpStatus: 401 },
  AUTH_TOKEN_INVALID: { code: 1002, message: 'Invalid authentication token', httpStatus: 401 },
  AUTH_TOKEN_EXPIRED: { code: 1003, message: 'Authentication token has expired', httpStatus: 401 },
  AUTH_INVALID_CREDENTIALS: { code: 1004, message: 'Invalid credentials', httpStatus: 401 },
  AUTH_ACCOUNT_LOCKED: { code: 1005, message: 'Account is locked', httpStatus: 403 },
  AUTH_SESSION_EXPIRED: { code: 1006, message: 'Session has expired', httpStatus: 401 },

  // Authorization Errors (1100-1199)
  AUTHZ_FORBIDDEN: { code: 1101, message: 'Access denied', httpStatus: 403 },
  AUTHZ_INSUFFICIENT_PERMISSIONS: { code: 1102, message: 'Insufficient permissions', httpStatus: 403 },
  AUTHZ_ROLE_MISMATCH: { code: 1103, message: 'Role authorization failed', httpStatus: 403 },

  // Validation Errors (2000-2099)
  VALIDATION_FAILED: { code: 2001, message: 'Validation failed', httpStatus: 400 },
  VALIDATION_REQUIRED_FIELD: { code: 2002, message: 'Required field missing', httpStatus: 400 },
  VALIDATION_INVALID_FORMAT: { code: 2003, message: 'Invalid data format', httpStatus: 400 },
  VALIDATION_OUT_OF_RANGE: { code: 2004, message: 'Value out of allowed range', httpStatus: 400 },
  VALIDATION_DUPLICATE: { code: 2005, message: 'Duplicate entry', httpStatus: 409 },

  // Resource Errors (3000-3099)
  RESOURCE_NOT_FOUND: { code: 3001, message: 'Resource not found', httpStatus: 404 },
  RESOURCE_ALREADY_EXISTS: { code: 3002, message: 'Resource already exists', httpStatus: 409 },
  RESOURCE_CONFLICT: { code: 3003, message: 'Resource conflict', httpStatus: 409 },
  RESOURCE_GONE: { code: 3004, message: 'Resource no longer available', httpStatus: 410 },

  // Database Errors (4000-4099)
  DB_CONNECTION_FAILED: { code: 4001, message: 'Service temporarily unavailable', httpStatus: 503 },
  DB_QUERY_FAILED: { code: 4002, message: 'Operation failed', httpStatus: 500 },
  DB_TRANSACTION_FAILED: { code: 4003, message: 'Transaction failed', httpStatus: 500 },
  DB_TIMEOUT: { code: 4004, message: 'Operation timed out', httpStatus: 504 },
  DB_CONSTRAINT_VIOLATION: { code: 4005, message: 'Data constraint violation', httpStatus: 409 },

  // Rate Limiting Errors (5000-5099)
  RATE_LIMIT_EXCEEDED: { code: 5001, message: 'Too many requests', httpStatus: 429 },
  RATE_LIMIT_BLOCKED: { code: 5002, message: 'Request blocked due to abuse', httpStatus: 429 },

  // Server Errors (6000-6099)
  SERVER_INTERNAL_ERROR: { code: 6001, message: 'Internal server error', httpStatus: 500 },
  SERVER_SERVICE_UNAVAILABLE: { code: 6002, message: 'Service unavailable', httpStatus: 503 },
  SERVER_MAINTENANCE: { code: 6003, message: 'Server under maintenance', httpStatus: 503 },
  SERVER_OVERLOADED: { code: 6004, message: 'Server overloaded', httpStatus: 503 },

  // External Service Errors (7000-7099)
  EXTERNAL_SERVICE_FAILED: { code: 7001, message: 'External service failed', httpStatus: 502 },
  EXTERNAL_SERVICE_TIMEOUT: { code: 7002, message: 'External service timeout', httpStatus: 504 },

  // File/Upload Errors (8000-8099)
  FILE_TOO_LARGE: { code: 8001, message: 'File size exceeds limit', httpStatus: 413 },
  FILE_TYPE_NOT_ALLOWED: { code: 8002, message: 'File type not allowed', httpStatus: 415 },
  FILE_UPLOAD_FAILED: { code: 8003, message: 'File upload failed', httpStatus: 500 },
  FILE_NOT_FOUND: { code: 8004, message: 'File not found', httpStatus: 404 },
};

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  constructor(errorCode, details = null, internalMessage = null) {
    const errorInfo = ErrorCodes[errorCode] || ErrorCodes.SERVER_INTERNAL_ERROR;
    
    super(errorInfo.message);
    
    this.name = 'AppError';
    this.code = errorInfo.code;
    this.errorCode = errorCode;
    this.httpStatus = errorInfo.httpStatus;
    this.details = details;
    this.internalMessage = internalMessage; // For logging only, never sent to client
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get client-safe error response
   */
  toClientResponse() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
      },
    };
  }

  /**
   * Get full error for logging
   */
  toLogObject() {
    return {
      name: this.name,
      code: this.code,
      errorCode: this.errorCode,
      message: this.message,
      internalMessage: this.internalMessage,
      details: this.details,
      httpStatus: this.httpStatus,
      stack: this.stack,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Validation Error with field-level details
 */
export class ValidationError extends AppError {
  constructor(fieldErrors) {
    super('VALIDATION_FAILED', { fields: fieldErrors });
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Database Error wrapper
 */
export class DatabaseError extends AppError {
  constructor(errorCode, originalError) {
    super(errorCode, null, originalError?.message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
    
    // Map MySQL error codes to our error codes
    if (originalError?.code === 'ER_DUP_ENTRY') {
      this.code = ErrorCodes.VALIDATION_DUPLICATE.code;
      this.httpStatus = ErrorCodes.VALIDATION_DUPLICATE.httpStatus;
      this.message = ErrorCodes.VALIDATION_DUPLICATE.message;
    } else if (originalError?.code === 'ETIMEDOUT' || originalError?.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
      this.code = ErrorCodes.DB_TIMEOUT.code;
      this.httpStatus = ErrorCodes.DB_TIMEOUT.httpStatus;
      this.message = ErrorCodes.DB_TIMEOUT.message;
    }
  }
}

/**
 * Error factory for creating errors from error codes
 */
export const createError = (errorCode, details = null, internalMessage = null) => {
  return new AppError(errorCode, details, internalMessage);
};

/**
 * Check if error is operational (expected) vs programming error
 */
export const isOperationalError = (error) => {
  return error instanceof AppError && error.isOperational;
};

export default {
  ErrorCodes,
  AppError,
  ValidationError,
  DatabaseError,
  createError,
  isOperationalError,
};
