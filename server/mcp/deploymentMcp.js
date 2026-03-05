/**
 * DEPLOYMENT MCP (Master Control Plane)
 * Deployment Configuration and Environment Management
 * 
 * Features:
 * - Environment separation
 * - Config immutability
 * - Feature flags
 * - Rollback support
 * - Version tracking
 */

import config from '../config/index.js';
import logger from '../lib/logger.js';

/**
 * Environment definitions
 */
export const ENVIRONMENTS = {
  development: {
    name: 'development',
    logLevel: 'debug',
    features: {
      debugMode: true,
      mockData: false,
      strictValidation: false,
      performanceMonitoring: false,
    },
  },
  staging: {
    name: 'staging',
    logLevel: 'info',
    features: {
      debugMode: true,
      mockData: false,
      strictValidation: true,
      performanceMonitoring: true,
    },
  },
  production: {
    name: 'production',
    logLevel: 'warn',
    features: {
      debugMode: false,
      mockData: false,
      strictValidation: true,
      performanceMonitoring: true,
    },
  },
};

/**
 * Get current environment config
 */
export const getCurrentEnvironment = () => {
  const envName = config.server.env;
  return ENVIRONMENTS[envName] || ENVIRONMENTS.development;
};

/**
 * Feature flag management
 */
const featureFlags = new Map();

export const featureFlags$ = {
  // Initialize feature flags
  init: (flags = {}) => {
    const env = getCurrentEnvironment();
    const defaultFlags = env.features || {};
    
    for (const [key, value] of Object.entries({ ...defaultFlags, ...flags })) {
      featureFlags.set(key, value);
    }
    
    logger.info('Feature flags initialized', {
      environment: env.name,
      flags: Object.fromEntries(featureFlags),
    });
  },
  
  // Check if feature is enabled
  isEnabled: (flag) => {
    return featureFlags.get(flag) === true;
  },
  
  // Get all flags
  getAll: () => {
    return Object.fromEntries(featureFlags);
  },
  
  // Update flag (runtime only, doesn't persist)
  update: (flag, value) => {
    if (config.server.isProduction) {
      logger.warn('Attempted to update feature flag in production', { flag });
      return false;
    }
    featureFlags.set(flag, value);
    return true;
  },
};

/**
 * Version information
 */
export const versionInfo = {
  app: process.env.APP_VERSION || '1.0.0',
  api: process.env.API_VERSION || 'v1',
  build: process.env.BUILD_NUMBER || 'local',
  commit: process.env.GIT_COMMIT || 'unknown',
  buildDate: process.env.BUILD_DATE || new Date().toISOString(),
};

/**
 * Deployment status tracking
 */
const deploymentStatus = {
  status: 'running',
  startTime: new Date().toISOString(),
  lastHealthCheck: null,
  errors: [],
  warnings: [],
};

export const deployment = {
  getStatus: () => ({ ...deploymentStatus, ...versionInfo }),
  
  setStatus: (status) => {
    deploymentStatus.status = status;
  },
  
  addError: (error) => {
    deploymentStatus.errors.push({
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 errors
    if (deploymentStatus.errors.length > 100) {
      deploymentStatus.errors.shift();
    }
  },
  
  addWarning: (warning) => {
    deploymentStatus.warnings.push({
      message: warning,
      timestamp: new Date().toISOString(),
    });
    if (deploymentStatus.warnings.length > 100) {
      deploymentStatus.warnings.shift();
    }
  },
  
  updateHealthCheck: () => {
    deploymentStatus.lastHealthCheck = new Date().toISOString();
  },
};

/**
 * Configuration validation
 */
export const validateDeploymentConfig = () => {
  const errors = [];
  const warnings = [];
  
  // Required environment variables in production
  if (config.server.isProduction) {
    const requiredVars = [
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME',
      'JWT_SECRET',
    ];
    
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }
    
    // Check for insecure defaults
    if (process.env.JWT_SECRET?.includes('change-this')) {
      errors.push('JWT_SECRET contains default value - must be changed in production');
    }
    
    if (process.env.DB_PASSWORD?.length < 12) {
      warnings.push('DB_PASSWORD is less than 12 characters');
    }
  }
  
  // Validate database pool size
  const poolSize = parseInt(process.env.DB_POOL_SIZE, 10);
  if (poolSize && poolSize > 200) {
    warnings.push(`DB_POOL_SIZE (${poolSize}) is very high, may cause memory issues`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Pre-deployment checklist
 */
export const preDeploymentChecklist = () => {
  const checks = [
    {
      name: 'Environment variables',
      check: () => validateDeploymentConfig().valid,
    },
    {
      name: 'Node.js version',
      check: () => {
        const [major] = process.version.slice(1).split('.').map(Number);
        return major >= 18;
      },
    },
    {
      name: 'Production mode',
      check: () => config.server.isProduction === true,
    },
    {
      name: 'Debug mode disabled',
      check: () => !featureFlags$.isEnabled('debugMode'),
    },
    {
      name: 'Mock data disabled',
      check: () => !featureFlags$.isEnabled('mockData'),
    },
  ];
  
  const results = checks.map(({ name, check }) => ({
    name,
    passed: check(),
  }));
  
  const allPassed = results.every(r => r.passed);
  
  if (!allPassed) {
    logger.warn('Pre-deployment checklist failed', { results });
  }
  
  return {
    passed: allPassed,
    results,
  };
};

/**
 * Maintenance mode
 */
let maintenanceMode = false;
let maintenanceMessage = 'System is under maintenance. Please try again later.';

export const maintenance = {
  enable: (message) => {
    maintenanceMode = true;
    maintenanceMessage = message || maintenanceMessage;
    logger.info('Maintenance mode enabled');
  },
  
  disable: () => {
    maintenanceMode = false;
    logger.info('Maintenance mode disabled');
  },
  
  isEnabled: () => maintenanceMode,
  
  getMessage: () => maintenanceMessage,
};

/**
 * Maintenance mode middleware
 */
export const maintenanceMiddleware = (req, res, next) => {
  if (maintenanceMode) {
    // Allow health checks during maintenance
    if (req.path === '/health' || req.path === '/live') {
      return next();
    }
    
    return res.status(503).json({
      success: false,
      error: {
        code: 6003,
        message: maintenanceMessage,
      },
    });
  }
  next();
};

/**
 * Version endpoint data
 */
export const getVersionInfo = () => ({
  version: versionInfo.app,
  apiVersion: versionInfo.api,
  build: versionInfo.build,
  environment: config.server.env,
  uptime: process.uptime(),
  nodeVersion: process.version,
});

// Initialize feature flags on load
featureFlags$.init();

export default {
  ENVIRONMENTS,
  getCurrentEnvironment,
  featureFlags$,
  versionInfo,
  deployment,
  validateDeploymentConfig,
  preDeploymentChecklist,
  maintenance,
  maintenanceMiddleware,
  getVersionInfo,
};
