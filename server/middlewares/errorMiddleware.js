/**
 * Centralized Error Handling Middleware
 * Provides:
 * - Catch-all error handling
 * - Error logging
 * - Client-safe responses
 * - Async error wrapper
 */

import { AppError, isOperationalError, ErrorCodes } from '../mcp/errorMcp.js';
import logger from '../lib/logger.js';
import config from '../config/index.js';

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found (404) handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError('RESOURCE_NOT_FOUND', {
    path: req.path,
    method: req.method,
  });
  next(error);
};

/**
 * Central Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Prevent sending response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  // Generate request context for logging
  const requestContext = {
    requestId: req.requestId,
    correlationId: req.correlationId,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip || req.connection?.remoteAddress,
  };

  let statusCode = 500;
  let response;

  // Handle our custom AppError
  if (err instanceof AppError) {
    statusCode = err.httpStatus;
    response = err.toClientResponse();

    // Log operational errors at appropriate level
    if (statusCode >= 500) {
      logger.error('Server error', {
        ...requestContext,
        error: err.toLogObject(),
      });
    } else if (statusCode >= 400) {
      logger.warn('Client error', {
        ...requestContext,
        error: err.toLogObject(),
      });
    }
  }
  // Handle validation errors from express-validator
  else if (err.name === 'ValidationError' || err.array) {
    statusCode = 400;
    response = {
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_FAILED.code,
        message: 'Validation failed',
        details: err.array ? { fields: err.array() } : err.details,
        timestamp: new Date().toISOString(),
      },
    };
    logger.warn('Validation error', { ...requestContext, errors: err.array?.() || err.details });
  }
  // Handle MongoDB / Mongoose errors
  else if (err.name === 'CastError' || err.name === 'MongoServerError' || err.code === 11000) {
    const errorInfo = mapDatabaseError(err);
    statusCode = errorInfo.status;
    response = {
      success: false,
      error: {
        code: errorInfo.code,
        message: errorInfo.message,
        timestamp: new Date().toISOString(),
      },
    };
    logger.error('Database error', {
      ...requestContext,
      dbCode: err.code,
      dbMessage: err.message,
    });
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    response = {
      success: false,
      error: {
        code: err.name === 'TokenExpiredError' 
          ? ErrorCodes.AUTH_TOKEN_EXPIRED.code 
          : ErrorCodes.AUTH_TOKEN_INVALID.code,
        message: err.name === 'TokenExpiredError' 
          ? 'Token has expired' 
          : 'Invalid token',
        timestamp: new Date().toISOString(),
      },
    };
    logger.warn('JWT error', { ...requestContext, jwtError: err.name });
  }
  // Handle Multer (file upload) errors
  else if (err.name === 'MulterError') {
    statusCode = 400;
    const errorMapping = {
      'LIMIT_FILE_SIZE': { code: ErrorCodes.FILE_TOO_LARGE.code, message: 'File too large' },
      'LIMIT_UNEXPECTED_FILE': { code: ErrorCodes.FILE_UPLOAD_FAILED.code, message: 'Unexpected file field' },
    };
    const mapped = errorMapping[err.code] || { code: ErrorCodes.FILE_UPLOAD_FAILED.code, message: 'File upload error' };
    response = {
      success: false,
      error: {
        ...mapped,
        timestamp: new Date().toISOString(),
      },
    };
    logger.warn('File upload error', { ...requestContext, multerCode: err.code });
  }
  // Handle all other errors as internal server errors
  else {
    statusCode = 500;
    response = {
      success: false,
      error: {
        code: ErrorCodes.SERVER_INTERNAL_ERROR.code,
        message: config.server.isProduction 
          ? 'An unexpected error occurred' 
          : err.message,
        timestamp: new Date().toISOString(),
      },
    };

    // Always log unexpected errors with full stack trace
    logger.error('Unexpected error', {
      ...requestContext,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }

  // Add request ID to response for correlation
  if (req.requestId) {
    response.error.requestId = req.requestId;
  }

  res.status(statusCode).json(response);
};

/**
 * Map MongoDB / Mongoose errors to our error codes
 */
const mapDatabaseError = (err) => {
  if (err.code === 11000) {
    return { status: 409, code: ErrorCodes.VALIDATION_DUPLICATE.code, message: 'Duplicate entry' };
  }

  if (err.name === 'CastError') {
    return { status: 400, code: ErrorCodes.VALIDATION_INVALID_FORMAT.code, message: 'Invalid identifier format' };
  }

  if (err.name === 'MongoServerError') {
    return { status: 500, code: ErrorCodes.DB_QUERY_FAILED.code, message: 'Database operation failed' };
  }

  return {
    status: 500,
    code: ErrorCodes.DB_QUERY_FAILED.code,
    message: 'Database operation failed'
  };
};

/**
 * Unhandled rejection handler for process
 */
export const setupUnhandledRejectionHandler = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      type: 'unhandledRejection',
      reason: reason?.message || reason,
      stack: reason?.stack,
    });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      type: 'uncaughtException',
      error: error.message,
      stack: error.stack,
    });
    
    // Give time for logs to flush, then exit
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
};

export default {
  asyncHandler,
  notFoundHandler,
  errorHandler,
  setupUnhandledRejectionHandler,
};
