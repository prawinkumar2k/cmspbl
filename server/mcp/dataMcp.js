/**
 * DATA MCP (Master Control Plane)
 * Data Integrity, Validation, and Consistency
 * 
 * Features:
 * - Data validation before persistence
 * - Consistency guarantees
 * - Transaction management
 * - Rollback strategies
 * - Audit logging
 */

import db from '../lib/database.js';
import logger from '../lib/logger.js';
import { AppError, ValidationError } from './errorMcp.js';

/**
 * Transaction wrapper with automatic rollback
 */
export const withTransaction = async (callback, options = {}) => {
  const connection = await db.pool.getConnection();
  const { isolation = 'READ COMMITTED' } = options;

  try {
    // Set isolation level
    await connection.execute(`SET TRANSACTION ISOLATION LEVEL ${isolation}`);
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction rolled back', {
      error: error.message,
      isolation,
    });
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Retry wrapper for transient failures
 */
export const withRetry = async (operation, options = {}) => {
  const { maxRetries = 3, retryDelay = 1000, retryableErrors = ['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'] } = options;

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!retryableErrors.includes(error.code) || attempt === maxRetries) {
        throw error;
      }

      logger.warn('Retrying operation', {
        attempt,
        maxRetries,
        error: error.code,
        delay: retryDelay * attempt,
      });

      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }

  throw lastError;
};

/**
 * Idempotency key storage (in-memory, use Redis in production)
 */
const idempotencyStore = new Map();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of idempotencyStore.entries()) {
    if (now - data.timestamp > IDEMPOTENCY_TTL) {
      idempotencyStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Every hour

/**
 * Check idempotency key
 */
export const checkIdempotencyKey = (key) => {
  if (!key) return null;
  
  const stored = idempotencyStore.get(key);
  if (stored && Date.now() - stored.timestamp < IDEMPOTENCY_TTL) {
    return stored.response;
  }
  return null;
};

/**
 * Store idempotency key
 */
export const storeIdempotencyKey = (key, response) => {
  if (!key) return;
  
  idempotencyStore.set(key, {
    response,
    timestamp: Date.now(),
  });
};

/**
 * Idempotency middleware
 */
export const idempotencyMiddleware = (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  if (!idempotencyKey) {
    return next();
  }

  // Check for existing response
  const existingResponse = checkIdempotencyKey(idempotencyKey);
  if (existingResponse) {
    logger.info('Returning cached idempotent response', {
      requestId: req.requestId,
      idempotencyKey,
    });
    return res.status(existingResponse.status).json(existingResponse.body);
  }

  // Store response when it's sent
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    storeIdempotencyKey(idempotencyKey, {
      status: res.statusCode,
      body,
    });
    return originalJson(body);
  };

  next();
};

/**
 * Data validation rules
 */
export const validationRules = {
  // Common validators
  isNonEmpty: (value) => value !== undefined && value !== null && value !== '',
  isString: (value) => typeof value === 'string',
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  isInteger: (value) => Number.isInteger(value),
  isPositive: (value) => typeof value === 'number' && value > 0,
  isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isDate: (value) => !isNaN(new Date(value).getTime()),
  isInRange: (min, max) => (value) => value >= min && value <= max,
  isOneOf: (values) => (value) => values.includes(value),
  maxLength: (max) => (value) => !value || value.length <= max,
  minLength: (min) => (value) => !value || value.length >= min,
  matches: (regex) => (value) => !value || regex.test(value),
};

/**
 * Validate data against schema
 */
export const validateData = (data, schema) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const fieldRules = Array.isArray(rules) ? rules : [rules];

    for (const rule of fieldRules) {
      if (typeof rule === 'object') {
        if (rule.required && !validationRules.isNonEmpty(value)) {
          errors.push({ field, message: rule.message || `${field} is required` });
          break;
        }
        if (rule.validator && value !== undefined && value !== null) {
          if (!rule.validator(value)) {
            errors.push({ field, message: rule.message || `${field} is invalid` });
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return true;
};

/**
 * Audit log entry
 */
export const createAuditLog = async (action, data, userId, options = {}) => {
  const { tableName = 'audit_logs', connection = null } = options;
  
  const auditEntry = {
    action,
    entity_type: data.entityType,
    entity_id: data.entityId,
    user_id: userId,
    changes: JSON.stringify(data.changes || {}),
    metadata: JSON.stringify(data.metadata || {}),
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
    created_at: new Date(),
  };

  try {
    const sql = `INSERT INTO ${tableName} SET ?`;
    const executor = connection || db;
    await executor.query(sql, [auditEntry]);
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    logger.error('Failed to create audit log', {
      action,
      entityType: data.entityType,
      error: error.message,
    });
  }
};

/**
 * Soft delete helper
 */
export const softDelete = async (tableName, id, userId, options = {}) => {
  const { connection = null, idColumn = 'id' } = options;
  
  const sql = `
    UPDATE ${tableName} 
    SET deleted_at = NOW(), deleted_by = ? 
    WHERE ${idColumn} = ? AND deleted_at IS NULL
  `;
  
  const executor = connection || db;
  const [result] = await executor.query(sql, [userId, id]);
  
  if (result.affectedRows === 0) {
    throw new AppError('RESOURCE_NOT_FOUND', { id, table: tableName });
  }
  
  return result;
};

/**
 * Optimistic locking helper
 */
export const updateWithLock = async (tableName, id, data, version, options = {}) => {
  const { connection = null, idColumn = 'id', versionColumn = 'version' } = options;
  
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(data), version + 1, id, version];
  
  const sql = `
    UPDATE ${tableName} 
    SET ${fields}, ${versionColumn} = ? 
    WHERE ${idColumn} = ? AND ${versionColumn} = ?
  `;
  
  const executor = connection || db;
  const [result] = await executor.query(sql, values);
  
  if (result.affectedRows === 0) {
    throw new AppError('RESOURCE_CONFLICT', {
      message: 'Resource was modified by another process',
      id,
      table: tableName,
    });
  }
  
  return result;
};

/**
 * Batch insert with chunking
 */
export const batchInsert = async (tableName, records, options = {}) => {
  const { chunkSize = 100, connection = null } = options;
  
  if (!records || records.length === 0) return { inserted: 0 };
  
  const columns = Object.keys(records[0]);
  const placeholders = `(${columns.map(() => '?').join(', ')})`;
  
  let totalInserted = 0;
  
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    const values = chunk.flatMap(record => columns.map(col => record[col]));
    const valuePlaceholders = chunk.map(() => placeholders).join(', ');
    
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${valuePlaceholders}`;
    
    const executor = connection || db;
    const [result] = await executor.query(sql, values);
    totalInserted += result.affectedRows;
  }
  
  return { inserted: totalInserted };
};

export default {
  withTransaction,
  withRetry,
  idempotencyMiddleware,
  checkIdempotencyKey,
  storeIdempotencyKey,
  validationRules,
  validateData,
  createAuditLog,
  softDelete,
  updateWithLock,
  batchInsert,
};
