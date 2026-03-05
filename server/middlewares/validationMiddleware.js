/**
 * Input Validation Middleware
 * Features:
 * - Schema-based validation
 * - Sanitization
 * - Type coercion
 * - Custom validators
 */

import { AppError, ValidationError } from '../mcp/errorMcp.js';

/**
 * Common validation patterns
 */
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s-()]{10,15}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}(:\d{2})?$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  username: /^[a-zA-Z0-9_]{3,30}$/,
  password: /^.{8,}$/, // At least 8 characters
  positiveInt: /^\d+$/,
  decimal: /^-?\d+(\.\d+)?$/,
};

/**
 * Sanitize string input
 */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>]/g, '');
};

/**
 * Validation schema builder
 */
export class Schema {
  constructor() {
    this.rules = [];
  }

  required(message = 'This field is required') {
    this.rules.push({
      type: 'required',
      message,
      validate: (value) => value !== undefined && value !== null && value !== '',
    });
    return this;
  }

  string(message = 'Must be a string') {
    this.rules.push({
      type: 'string',
      message,
      validate: (value) => value === undefined || value === null || typeof value === 'string',
    });
    return this;
  }

  number(message = 'Must be a number') {
    this.rules.push({
      type: 'number',
      message,
      validate: (value) => value === undefined || value === null || !isNaN(Number(value)),
      transform: (value) => value !== undefined && value !== null ? Number(value) : value,
    });
    return this;
  }

  integer(message = 'Must be an integer') {
    this.rules.push({
      type: 'integer',
      message,
      validate: (value) => value === undefined || value === null || Number.isInteger(Number(value)),
      transform: (value) => value !== undefined && value !== null ? parseInt(value, 10) : value,
    });
    return this;
  }

  boolean(message = 'Must be a boolean') {
    this.rules.push({
      type: 'boolean',
      message,
      validate: (value) => value === undefined || value === null || typeof value === 'boolean' || value === 'true' || value === 'false' || value === 0 || value === 1,
      transform: (value) => value === true || value === 'true' || value === 1,
    });
    return this;
  }

  email(message = 'Invalid email format') {
    this.rules.push({
      type: 'email',
      message,
      validate: (value) => !value || patterns.email.test(value),
    });
    return this;
  }

  min(minValue, message) {
    this.rules.push({
      type: 'min',
      message: message || `Must be at least ${minValue}`,
      validate: (value) => {
        if (value === undefined || value === null) return true;
        if (typeof value === 'string') return value.length >= minValue;
        if (typeof value === 'number') return value >= minValue;
        if (Array.isArray(value)) return value.length >= minValue;
        return true;
      },
    });
    return this;
  }

  max(maxValue, message) {
    this.rules.push({
      type: 'max',
      message: message || `Must be at most ${maxValue}`,
      validate: (value) => {
        if (value === undefined || value === null) return true;
        if (typeof value === 'string') return value.length <= maxValue;
        if (typeof value === 'number') return value <= maxValue;
        if (Array.isArray(value)) return value.length <= maxValue;
        return true;
      },
    });
    return this;
  }

  pattern(regex, message = 'Invalid format') {
    this.rules.push({
      type: 'pattern',
      message,
      validate: (value) => !value || regex.test(value),
    });
    return this;
  }

  enum(allowedValues, message) {
    this.rules.push({
      type: 'enum',
      message: message || `Must be one of: ${allowedValues.join(', ')}`,
      validate: (value) => !value || allowedValues.includes(value),
    });
    return this;
  }

  date(message = 'Invalid date format') {
    this.rules.push({
      type: 'date',
      message,
      validate: (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
    });
    return this;
  }

  array(message = 'Must be an array') {
    this.rules.push({
      type: 'array',
      message,
      validate: (value) => value === undefined || value === null || Array.isArray(value),
    });
    return this;
  }

  custom(validateFn, message = 'Validation failed') {
    this.rules.push({
      type: 'custom',
      message,
      validate: validateFn,
    });
    return this;
  }

  validate(value, fieldName) {
    const errors = [];
    let transformedValue = value;

    // Sanitize string values
    if (typeof transformedValue === 'string') {
      transformedValue = sanitizeString(transformedValue);
    }

    for (const rule of this.rules) {
      // Apply transformation if exists
      if (rule.transform) {
        transformedValue = rule.transform(transformedValue);
      }

      // Run validation
      if (!rule.validate(transformedValue)) {
        errors.push({
          field: fieldName,
          message: rule.message,
          type: rule.type,
        });
      }
    }

    return { value: transformedValue, errors };
  }
}

/**
 * Create a validation schema
 */
export const schema = () => new Schema();

/**
 * Validate request middleware factory
 */
export const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];
    const validated = {
      body: {},
      query: {},
      params: {},
    };

    // Validate body
    if (schemas.body) {
      for (const [field, fieldSchema] of Object.entries(schemas.body)) {
        const { value, errors: fieldErrors } = fieldSchema.validate(req.body?.[field], field);
        if (fieldErrors.length > 0) {
          errors.push(...fieldErrors);
        } else {
          validated.body[field] = value;
        }
      }
    }

    // Validate query params
    if (schemas.query) {
      for (const [field, fieldSchema] of Object.entries(schemas.query)) {
        const { value, errors: fieldErrors } = fieldSchema.validate(req.query?.[field], field);
        if (fieldErrors.length > 0) {
          errors.push(...fieldErrors);
        } else {
          validated.query[field] = value;
        }
      }
    }

    // Validate URL params
    if (schemas.params) {
      for (const [field, fieldSchema] of Object.entries(schemas.params)) {
        const { value, errors: fieldErrors } = fieldSchema.validate(req.params?.[field], field);
        if (fieldErrors.length > 0) {
          errors.push(...fieldErrors);
        } else {
          validated.params[field] = value;
        }
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError(errors));
    }

    // Attach validated data to request
    req.validated = validated;
    next();
  };
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: schema().required().integer().min(1, 'ID must be positive'),
  uuid: schema().required().string().pattern(patterns.uuid, 'Invalid UUID format'),
  email: schema().required().string().email(),
  password: schema().required().string().min(8, 'Password must be at least 8 characters'),
  username: schema().required().string().pattern(patterns.username, 'Invalid username format'),
  page: schema().integer().min(1).max(10000),
  limit: schema().integer().min(1).max(100),
  date: schema().string().date(),
  boolean: schema().boolean(),
};

export default {
  Schema,
  schema,
  validate,
  patterns,
  commonSchemas,
};
