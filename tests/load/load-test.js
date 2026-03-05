/**
 * SF-ERP Master Load Test Script (k6)
 * =====================================
 * 
 * This script tests the system under various load conditions:
 * 1. Load Test: Gradual ramp to 100k users
 * 2. Stress Test: Find breaking point
 * 3. Spike Test: Sudden traffic surge
 * 
 * Prerequisites:
 * - Install k6: https://k6.io/docs/getting-started/installation/
 * - Set BASE_URL environment variable
 * 
 * Usage:
 *   k6 run --env BASE_URL=http://your-server load-test.js
 *   k6 run --env BASE_URL=http://your-server --env TEST_TYPE=stress load-test.js
 *   k6 run --env BASE_URL=http://your-server --env TEST_TYPE=spike load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency', true);
const dbQueryTime = new Trend('db_query_time', true);
const successfulLogins = new Counter('successful_logins');
const failedRequests = new Counter('failed_requests');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost';
const TEST_TYPE = __ENV.TEST_TYPE || 'load'; // load, stress, spike

// Test scenarios
const scenarios = {
  // Load Test: Gradual ramp to target users
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 1000 },    // Ramp to 1k
      { duration: '3m', target: 5000 },    // Ramp to 5k
      { duration: '5m', target: 10000 },   // Ramp to 10k
      { duration: '10m', target: 25000 },  // Ramp to 25k
      { duration: '10m', target: 50000 },  // Ramp to 50k
      { duration: '15m', target: 100000 }, // Ramp to 100k
      { duration: '30m', target: 100000 }, // Stay at 100k (steady state)
      { duration: '5m', target: 0 },       // Ramp down
    ],
    gracefulRampDown: '2m',
  },

  // Stress Test: Push until failure
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 10000 },
      { duration: '5m', target: 50000 },
      { duration: '5m', target: 100000 },
      { duration: '5m', target: 150000 },  // Beyond expected capacity
      { duration: '5m', target: 200000 },  // Find breaking point
      { duration: '5m', target: 250000 },  // Extreme stress
      { duration: '2m', target: 0 },
    ],
    gracefulRampDown: '1m',
  },

  // Spike Test: Sudden traffic surge
  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 5000 },    // Normal load
      { duration: '10s', target: 50000 },  // Spike!
      { duration: '3m', target: 50000 },   // Stay at spike
      { duration: '10s', target: 5000 },   // Back to normal
      { duration: '3m', target: 5000 },    // Recover
      { duration: '10s', target: 100000 }, // Another spike!
      { duration: '3m', target: 100000 },  // Stay
      { duration: '1m', target: 0 },
    ],
    gracefulRampDown: '30s',
  },
};

// Export options based on test type
export const options = {
  scenarios: {
    main: scenarios[TEST_TYPE],
  },
  thresholds: {
    // P95 latency must be under 300ms
    'http_req_duration': ['p(95)<300', 'p(99)<1000'],
    // Error rate must be under 0.1%
    'errors': ['rate<0.001'],
    // API latency threshold
    'api_latency': ['p(95)<300'],
    // At least 99.9% success rate
    'http_req_failed': ['rate<0.001'],
  },
  // Output results
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// Test data
const testUsers = [];
for (let i = 0; i < 1000; i++) {
  testUsers.push({
    username: `testuser${i}`,
    password: `password${i}`,
  });
}

// Helper: Make authenticated request
function authRequest(method, url, body, token) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Request-ID': `k6-${randomString(16)}`,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const params = { headers, timeout: '30s' };
  
  let response;
  const start = Date.now();
  
  if (method === 'GET') {
    response = http.get(url, params);
  } else if (method === 'POST') {
    response = http.post(url, JSON.stringify(body), params);
  } else if (method === 'PUT') {
    response = http.put(url, JSON.stringify(body), params);
  } else if (method === 'DELETE') {
    response = http.del(url, params);
  }
  
  const duration = Date.now() - start;
  apiLatency.add(duration);
  
  return response;
}

// Setup: Runs once before test
export function setup() {
  console.log(`Starting ${TEST_TYPE.toUpperCase()} test against ${BASE_URL}`);
  
  // Verify system is up
  const healthCheck = http.get(`${BASE_URL}/api/health`);
  check(healthCheck, {
    'System is healthy': (r) => r.status === 200,
  });
  
  if (healthCheck.status !== 200) {
    throw new Error('System is not healthy, aborting test');
  }
  
  return { startTime: Date.now() };
}

// Main test function
export default function (data) {
  const userId = __VU % testUsers.length;
  const user = testUsers[userId];
  
  // Scenario weights (realistic user behavior)
  const scenario = Math.random();
  
  if (scenario < 0.05) {
    // 5% - Login flow
    testLogin(user);
  } else if (scenario < 0.40) {
    // 35% - Read operations (most common)
    testReadOperations();
  } else if (scenario < 0.50) {
    // 10% - Dashboard load
    testDashboard();
  } else if (scenario < 0.60) {
    // 10% - Search operations
    testSearch();
  } else if (scenario < 0.70) {
    // 10% - List with pagination
    testPaginatedList();
  } else if (scenario < 0.80) {
    // 10% - Write operations
    testWriteOperations();
  } else if (scenario < 0.90) {
    // 10% - Report generation
    testReports();
  } else {
    // 10% - Static assets
    testStaticAssets();
  }
  
  // Think time between requests (simulates real user)
  sleep(randomIntBetween(1, 3));
}

// Test: Login flow
function testLogin(user) {
  group('Login Flow', function () {
    const response = authRequest('POST', `${BASE_URL}/api/login`, {
      username: user.username,
      password: user.password,
      role: 'admin',
    });
    
    const success = check(response, {
      'Login status 200 or 401': (r) => r.status === 200 || r.status === 401,
      'Login response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    if (response.status === 200) {
      successfulLogins.add(1);
    }
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Read operations
function testReadOperations() {
  group('Read Operations', function () {
    const endpoints = [
      '/api/masterData',
      '/api/branch',
      '/api/courseMaster',
      '/api/academicYearMaster',
      '/api/semesterMaster',
    ];
    
    const endpoint = endpoints[randomIntBetween(0, endpoints.length - 1)];
    const response = authRequest('GET', `${BASE_URL}${endpoint}`);
    
    const success = check(response, {
      'Read status 200': (r) => r.status === 200,
      'Read response time < 300ms': (r) => r.timings.duration < 300,
      'Read has response body': (r) => r.body && r.body.length > 0,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Dashboard load
function testDashboard() {
  group('Dashboard Load', function () {
    const response = authRequest('GET', `${BASE_URL}/api/dashboard`);
    
    const success = check(response, {
      'Dashboard status 200': (r) => r.status === 200,
      'Dashboard response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Search operations
function testSearch() {
  group('Search Operations', function () {
    const searchTerm = randomString(5);
    const response = authRequest('GET', `${BASE_URL}/api/studentMaster?search=${searchTerm}`);
    
    const success = check(response, {
      'Search status 200': (r) => r.status === 200,
      'Search response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Paginated list
function testPaginatedList() {
  group('Paginated List', function () {
    const page = randomIntBetween(1, 100);
    const response = authRequest('GET', `${BASE_URL}/api/admittedStudent?page=${page}&limit=25`);
    
    const success = check(response, {
      'List status 200': (r) => r.status === 200,
      'List response time < 300ms': (r) => r.timings.duration < 300,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Write operations
function testWriteOperations() {
  group('Write Operations', function () {
    // Simulate enquiry submission
    const response = authRequest('POST', `${BASE_URL}/api/studentEnquiry`, {
      name: `Test Student ${randomString(8)}`,
      email: `test${randomString(8)}@example.com`,
      phone: `9${randomIntBetween(100000000, 999999999)}`,
      course: 'B.Tech',
    });
    
    const success = check(response, {
      'Write status 200 or 201 or 401': (r) => [200, 201, 401, 403].includes(r.status),
      'Write response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Report generation
function testReports() {
  group('Report Generation', function () {
    const response = authRequest('GET', `${BASE_URL}/api/attendanceReport?format=json`);
    
    const success = check(response, {
      'Report status 200 or 401': (r) => r.status === 200 || r.status === 401,
      'Report response time < 2000ms': (r) => r.timings.duration < 2000,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Test: Static assets
function testStaticAssets() {
  group('Static Assets', function () {
    const response = http.get(`${BASE_URL}/`);
    
    const success = check(response, {
      'Static status 200': (r) => r.status === 200,
      'Static response time < 100ms': (r) => r.timings.duration < 100,
    });
    
    errorRate.add(!success);
    if (!success) failedRequests.add(1);
  });
}

// Teardown: Runs once after test
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000 / 60;
  console.log(`Test completed in ${duration.toFixed(2)} minutes`);
}

// Handle summary
export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    [`reports/load-test-${TEST_TYPE}-${timestamp}.json`]: JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// Text summary helper
function textSummary(data, options) {
  const { metrics } = data;
  
  let summary = `
╔══════════════════════════════════════════════════════════════╗
║           SF-ERP LOAD TEST RESULTS - ${TEST_TYPE.toUpperCase()}                 ║
╠══════════════════════════════════════════════════════════════╣
║ Total Requests: ${metrics.http_reqs?.values?.count || 0}
║ Failed Requests: ${metrics.http_req_failed?.values?.passes || 0}
║ Error Rate: ${((metrics.errors?.values?.rate || 0) * 100).toFixed(3)}%
╠══════════════════════════════════════════════════════════════╣
║ LATENCY METRICS
║   P50: ${(metrics.http_req_duration?.values?.['p(50)'] || 0).toFixed(2)}ms
║   P90: ${(metrics.http_req_duration?.values?.['p(90)'] || 0).toFixed(2)}ms
║   P95: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms
║   P99: ${(metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(2)}ms
║   Max: ${(metrics.http_req_duration?.values?.max || 0).toFixed(2)}ms
╠══════════════════════════════════════════════════════════════╣
║ THROUGHPUT
║   Avg RPS: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)}
║   Peak VUs: ${metrics.vus_max?.values?.max || 0}
╠══════════════════════════════════════════════════════════════╣
║ THRESHOLDS
║   P95 < 300ms: ${(metrics.http_req_duration?.values?.['p(95)'] || 0) < 300 ? '✅ PASS' : '❌ FAIL'}
║   Error < 0.1%: ${(metrics.errors?.values?.rate || 0) < 0.001 ? '✅ PASS' : '❌ FAIL'}
╚══════════════════════════════════════════════════════════════╝
`;
  
  return summary;
}
