import mysql from 'mysql2/promise';
import { config } from '../config.js';
import { logger } from './logger.js';
import {
  dbQueryDuration,
  dbQueryTotal,
  dbConnectionsActive,
  dbConnectionsIdle,
} from './metrics.js';

class DatabaseError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 503;
    this.cause = cause;
    this.details = cause?.message;
  }
}

const pool = mysql.createPool(config.mysql);

pool.on('connection', () => {
  logger.debug('MySQL connection established');
});

// Update connection metrics periodically
setInterval(async () => {
  try {
    const poolState = pool.pool;
    if (poolState) {
      dbConnectionsActive.set(poolState._allConnections?.length || 0);
      dbConnectionsIdle.set(poolState._freeConnections?.length || 0);
    }
  } catch (error) {
    // Ignore errors in metrics collection
  }
}, 5000);

export const getConnection = () => pool.getConnection();

const extractTableName = (sql) => {
  const match = sql.match(/FROM\s+(\w+)|INTO\s+(\w+)|UPDATE\s+(\w+)/i);
  return match ? (match[1] || match[2] || match[3]) : 'unknown';
};

const extractOperation = (sql) => {
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) return 'select';
  if (trimmed.startsWith('INSERT')) return 'insert';
  if (trimmed.startsWith('UPDATE')) return 'update';
  if (trimmed.startsWith('DELETE')) return 'delete';
  return 'other';
};

export const query = async (sql, params = []) => {
  const startTime = Date.now();
  const operation = extractOperation(sql);
  const table = extractTableName(sql);

  try {
    // Use pool.query() if no params (for queries with string interpolation)
    // Use pool.execute() if params exist (for prepared statements)
    let rows;
    if (params.length === 0) {
      const [result] = await pool.query(sql);
      rows = result;
    } else {
      // Ensure all parameters are properly formatted for MySQL
      const formattedParams = params.map((param) => {
        // Convert undefined/null to null
        if (param === undefined || param === null) return null;
        // Keep numbers, strings, and other types as-is
        return param;
      });
      [rows] = await pool.execute(sql, formattedParams);
    }
    
    const duration = (Date.now() - startTime) / 1000;

    // Record successful query metrics
    dbQueryDuration.observe({ operation, table }, duration);
    dbQueryTotal.inc({ operation, status: 'success' });

    return rows;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;

    // Record failed query metrics
    dbQueryDuration.observe({ operation, table }, duration);
    dbQueryTotal.inc({ operation, status: 'error' });

    // Enhanced error logging to identify the problematic query
    logger.error('Database query failed', {
      error: error.message,
      code: error.code,
      sql: sql.substring(0, 200), // First 200 chars of SQL
      params: params,
      paramsCount: params.length,
      paramsTypes: params.map(p => typeof p),
      stack: error.stack,
    });
    throw new DatabaseError('Database unavailable. Check connection and credentials.', error);
  }
};

export const closePool = async () => {
  await pool.end();
};

export { DatabaseError };
