/**
 * Production-grade API Client
 * Features:
 * - Request/response interceptors
 * - Automatic retry with exponential backoff
 * - Circuit breaker pattern
 * - Request timeout handling
 * - Correlation ID propagation
 * - Structured error handling
 */

import axios from 'axios';
import config from '../config';

// Circuit breaker state
const circuitBreaker = {
  failures: 0,
  lastFailure: null,
  isOpen: false,
  threshold: 5,
  resetTimeout: 30000, // 30 seconds
};

/**
 * Check if circuit breaker should allow request
 */
const shouldAllowRequest = () => {
  if (!circuitBreaker.isOpen) return true;
  
  const now = Date.now();
  if (now - circuitBreaker.lastFailure > circuitBreaker.resetTimeout) {
    // Half-open state - allow one request to test
    circuitBreaker.isOpen = false;
    circuitBreaker.failures = 0;
    return true;
  }
  
  return false;
};

/**
 * Record circuit breaker failure
 */
const recordFailure = () => {
  circuitBreaker.failures++;
  circuitBreaker.lastFailure = Date.now();
  
  if (circuitBreaker.failures >= circuitBreaker.threshold) {
    circuitBreaker.isOpen = true;
    console.warn('[API] Circuit breaker opened - too many failures');
  }
};

/**
 * Record circuit breaker success
 */
const recordSuccess = () => {
  circuitBreaker.failures = 0;
  circuitBreaker.isOpen = false;
};

/**
 * Generate unique correlation ID
 */
const generateCorrelationId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate retry delay with exponential backoff
 */
const getRetryDelay = (attempt) => {
  const baseDelay = config.api.retryDelay;
  const maxDelay = 10000;
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
};

/**
 * Determine if error is retryable
 */
const isRetryableError = (error) => {
  // Network errors
  if (!error.response) return true;
  
  // Server errors (except 4xx)
  const status = error.response.status;
  return status >= 500 || status === 429;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create axios instance with production configuration
 */
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 */
api.interceptors.request.use(
  (requestConfig) => {
    // Check circuit breaker
    if (!shouldAllowRequest()) {
      return Promise.reject(new Error('Service temporarily unavailable. Please try again later.'));
    }
    
    // Add correlation ID for request tracing
    requestConfig.headers['X-Correlation-ID'] = generateCorrelationId();
    
    // Add JWT token if available
    const token = localStorage.getItem(config.session.tokenKey);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // Store start time for performance tracking
    requestConfig.metadata = { startTime: Date.now() };
    
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => {
    // Record success for circuit breaker
    recordSuccess();
    
    // Log performance in development
    if (config.app.isDevelopment && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem(config.session.tokenKey);
      localStorage.removeItem(config.session.userKey);
      
      // Redirect to login (if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
    
    // Record failure for circuit breaker
    recordFailure();
    
    // Retry logic for retryable errors
    if (isRetryableError(error) && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }
    
    if (
      isRetryableError(error) &&
      originalRequest._retryCount < config.api.retryAttempts
    ) {
      originalRequest._retryCount++;
      
      const delay = getRetryDelay(originalRequest._retryCount);
      console.warn(`[API] Retrying request (attempt ${originalRequest._retryCount}/${config.api.retryAttempts}) after ${Math.round(delay)}ms`);
      
      await sleep(delay);
      
      return api(originalRequest);
    }
    
    // Transform error for consistent handling
    const transformedError = transformApiError(error);
    return Promise.reject(transformedError);
  }
);

/**
 * Transform API error for consistent handling
 */
const transformApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to server. Please check your internet connection.',
      status: 0,
      isNetworkError: true,
    };
  }
  
  // Server returned error response
  const { status, data } = error.response;
  
  return {
    code: data?.error?.code || `HTTP_${status}`,
    message: data?.error?.message || getDefaultErrorMessage(status),
    status,
    details: data?.error?.details,
    requestId: data?.error?.requestId,
    isServerError: status >= 500,
    isClientError: status >= 400 && status < 500,
  };
};

/**
 * Get default error message for HTTP status
 */
const getDefaultErrorMessage = (status) => {
  const messages = {
    400: 'Invalid request. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may have been modified.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'An unexpected error occurred. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timed out. Please try again.',
  };
  
  return messages[status] || 'An unexpected error occurred.';
};

/**
 * API request wrapper with enhanced error handling
 */
export const apiRequest = async (method, url, data = null, options = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      ...options,
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error,
      status: error.status || 0,
    };
  }
};

/**
 * Convenience methods
 */
export const apiGet = (url, options) => apiRequest('GET', url, null, options);
export const apiPost = (url, data, options) => apiRequest('POST', url, data, options);
export const apiPut = (url, data, options) => apiRequest('PUT', url, data, options);
export const apiPatch = (url, data, options) => apiRequest('PATCH', url, data, options);
export const apiDelete = (url, options) => apiRequest('DELETE', url, null, options);

/**
 * Get circuit breaker status (for debugging/monitoring)
 */
export const getCircuitBreakerStatus = () => ({
  isOpen: circuitBreaker.isOpen,
  failures: circuitBreaker.failures,
  lastFailure: circuitBreaker.lastFailure,
});

export default api;
