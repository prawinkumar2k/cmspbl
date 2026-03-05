/**
 * LOAD MCP (Master Control Plane)
 * Load Management and Backpressure Handling
 * 
 * Features:
 * - Load monitoring
 * - Backpressure detection
 * - Request throttling
 * - Queue-based processing
 * - Graceful degradation
 */

import logger from '../lib/logger.js';
import config from '../config/index.js';

// Load thresholds
const LOAD_THRESHOLDS = {
  cpu: {
    warning: 70,
    critical: 85,
  },
  memory: {
    warning: 75,
    critical: 90,
  },
  requestQueue: {
    warning: 100,
    critical: 500,
  },
  responseTime: {
    warning: 1000,  // 1 second
    critical: 5000,  // 5 seconds
  },
};

// Current load state
const loadState = {
  cpuUsage: 0,
  memoryUsage: 0,
  requestQueueSize: 0,
  avgResponseTime: 0,
  status: 'healthy',
  lastUpdate: null,
  isBackpressureActive: false,
};

// Request queue for backpressure handling
class RequestQueue {
  constructor(maxSize = 1000) {
    this.queue = [];
    this.maxSize = maxSize;
    this.processing = 0;
    this.maxConcurrent = 100;
  }

  get size() {
    return this.queue.length;
  }

  get isFull() {
    return this.queue.length >= this.maxSize;
  }

  get isOverloaded() {
    return this.processing >= this.maxConcurrent;
  }

  enqueue(request) {
    if (this.isFull) {
      return false;
    }
    this.queue.push({
      request,
      timestamp: Date.now(),
    });
    return true;
  }

  dequeue() {
    return this.queue.shift();
  }

  startProcessing() {
    this.processing++;
  }

  endProcessing() {
    this.processing = Math.max(0, this.processing - 1);
  }
}

const requestQueue = new RequestQueue();

/**
 * Update load metrics
 */
export const updateLoadMetrics = () => {
  const memoryUsage = process.memoryUsage();
  const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

  loadState.memoryUsage = Math.round(heapUsedPercent);
  loadState.requestQueueSize = requestQueue.size;
  loadState.lastUpdate = new Date().toISOString();

  // Determine overall status
  if (
    loadState.memoryUsage >= LOAD_THRESHOLDS.memory.critical ||
    loadState.requestQueueSize >= LOAD_THRESHOLDS.requestQueue.critical
  ) {
    loadState.status = 'critical';
    loadState.isBackpressureActive = true;
  } else if (
    loadState.memoryUsage >= LOAD_THRESHOLDS.memory.warning ||
    loadState.requestQueueSize >= LOAD_THRESHOLDS.requestQueue.warning
  ) {
    loadState.status = 'warning';
    loadState.isBackpressureActive = true;
  } else {
    loadState.status = 'healthy';
    loadState.isBackpressureActive = false;
  }

  return loadState;
};

/**
 * Get current load state
 */
export const getLoadState = () => {
  updateLoadMetrics();
  return { ...loadState };
};

/**
 * Check if system can accept new requests
 */
export const canAcceptRequest = () => {
  updateLoadMetrics();
  return loadState.status !== 'critical' && !requestQueue.isFull;
};

/**
 * Backpressure middleware
 */
export const backpressureMiddleware = (req, res, next) => {
  updateLoadMetrics();

  // If system is in critical state, reject new requests
  if (loadState.status === 'critical') {
    logger.warn('Request rejected due to system overload', {
      requestId: req.requestId,
      loadState: loadState.status,
      memoryUsage: loadState.memoryUsage,
      queueSize: loadState.requestQueueSize,
    });

    return res.status(503).json({
      success: false,
      error: {
        code: 6004,
        message: 'Server is currently overloaded. Please try again in a few moments.',
        retryAfter: 30,
      },
    });
  }

  // Track request processing
  requestQueue.startProcessing();
  res.on('finish', () => requestQueue.endProcessing());

  // Add warning header if under pressure
  if (loadState.status === 'warning') {
    res.setHeader('X-Server-Load', 'high');
  }

  next();
};

/**
 * Shedding policy - drop low priority requests under load
 */
export const loadSheddingMiddleware = (options = {}) => {
  const { priority = 'normal' } = options;

  return (req, res, next) => {
    // Only apply shedding for low priority requests under load
    if (loadState.status === 'warning' && priority === 'low') {
      // Randomly shed 50% of low-priority requests
      if (Math.random() < 0.5) {
        logger.info('Request shed due to load', {
          requestId: req.requestId,
          priority,
          path: req.path,
        });

        return res.status(503).json({
          success: false,
          error: {
            code: 6004,
            message: 'Server is busy. Please try again shortly.',
            retryAfter: 10,
          },
        });
      }
    }

    next();
  };
};

/**
 * Response time tracker
 */
const responseTimes = [];
const MAX_RESPONSE_TIME_SAMPLES = 100;

export const trackResponseTime = (duration) => {
  responseTimes.push(duration);
  if (responseTimes.length > MAX_RESPONSE_TIME_SAMPLES) {
    responseTimes.shift();
  }
  
  loadState.avgResponseTime = Math.round(
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  );
};

/**
 * Circuit breaker for external services
 */
class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.threshold = options.threshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.halfOpenRequests = options.halfOpenRequests || 3;
    
    this.state = 'closed';
    this.failures = 0;
    this.lastFailure = null;
    this.halfOpenSuccess = 0;
  }

  isOpen() {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure >= this.resetTimeout) {
        this.state = 'half-open';
        this.halfOpenSuccess = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    if (this.state === 'half-open') {
      this.halfOpenSuccess++;
      if (this.halfOpenSuccess >= this.halfOpenRequests) {
        this.state = 'closed';
        this.failures = 0;
      }
    } else {
      this.failures = 0;
    }
  }

  recordFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
      logger.warn('Circuit breaker opened', {
        name: this.name,
        failures: this.failures,
      });
    }
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure,
    };
  }
}

// Circuit breaker registry
const circuitBreakers = new Map();

export const getCircuitBreaker = (name, options) => {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(name, options));
  }
  return circuitBreakers.get(name);
};

// Start periodic load monitoring
setInterval(() => {
  updateLoadMetrics();
  
  if (loadState.status !== 'healthy') {
    logger.warn('System under load', {
      status: loadState.status,
      memoryUsage: loadState.memoryUsage,
      queueSize: loadState.requestQueueSize,
      avgResponseTime: loadState.avgResponseTime,
    });
  }
}, 10000); // Every 10 seconds

export default {
  LOAD_THRESHOLDS,
  getLoadState,
  canAcceptRequest,
  backpressureMiddleware,
  loadSheddingMiddleware,
  trackResponseTime,
  getCircuitBreaker,
};
