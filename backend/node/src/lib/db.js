import mysql from 'mysql2/promise';
import { config } from '../config.js';
import { logger } from './logger.js';

const pool = mysql.createPool(config.mysql);

pool.on('connection', () => {
  logger.debug('MySQL connection established');
});

export const getConnection = () => pool.getConnection();

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const closePool = async () => {
  await pool.end();
};
