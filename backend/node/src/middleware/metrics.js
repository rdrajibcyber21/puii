import { v4 as uuid } from 'uuid';
import {
  httpRequestDuration,
  httpRequestTotal,
  httpRequestInFlight,
  generateRequestId,
} from '../lib/metrics.js';

/**
 * Middleware to track HTTP request metrics
 */
export const metricsMiddleware = (req, res, next) => {
  // Generate unique request ID
  req.requestId = req.headers['x-request-id'] || generateRequestId();
  res.setHeader('X-Request-ID', req.requestId);

  // Track request start time
  const startTime = Date.now();

  // Increment in-flight requests
  httpRequestInFlight.inc();

  // Get route path (normalize to avoid high cardinality)
  const route = req.route?.path || req.path || 'unknown';
  const method = req.method;

  // Track response finish
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const statusCode = res.statusCode;

    // Record metrics
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
    httpRequestTotal.inc({ method, route, status_code: statusCode });

    // Decrement in-flight requests
    httpRequestInFlight.dec();
  });

  next();
};

/**
 * Middleware to track request performance
 */
export const performanceMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000; // Convert to milliseconds
    const route = req.route?.path || req.path;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      req.logger?.warn('Slow request detected', {
        requestId: req.requestId,
        method: req.method,
        route,
        duration: `${duration.toFixed(2)}ms`,
      });
    }
  });

  next();
};

