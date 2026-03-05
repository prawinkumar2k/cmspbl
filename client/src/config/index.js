/**
 * Environment Configuration for Frontend
 * Production-grade configuration management
 */

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
  },

  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SF-ERP',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    enableMockData: false, // NEVER enable mock data in production
  },

  // Logging
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || (import.meta.env.PROD ? 'error' : 'debug'),
    enableConsole: !import.meta.env.PROD || import.meta.env.VITE_DEBUG_MODE === 'true',
  },

  // Session Configuration
  session: {
    tokenKey: 'token',
    userKey: 'user',
    expiryWarningMinutes: 5,
  },

  // UI Configuration
  ui: {
    toastDuration: 5000,
    loadingTimeout: 10000,
    debounceDelay: 300,
    paginationLimit: 25,
  },
};

// Freeze configuration to prevent runtime modifications
Object.freeze(config);
Object.freeze(config.api);
Object.freeze(config.app);
Object.freeze(config.features);
Object.freeze(config.logging);
Object.freeze(config.session);
Object.freeze(config.ui);

export default config;
