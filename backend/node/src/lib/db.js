import mysql from 'mysql2/promise';
import { config } from '../config.js';
import { logger } from './logger.js';

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

export const getConnection = () => pool.getConnection();

export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('Database query failed', { error: error.message, code: error.code });
    throw new DatabaseError('Database unavailable. Check connection and credentials.', error);
  }
};

export const closePool = async () => {
  await pool.end();
};

export { DatabaseError };
