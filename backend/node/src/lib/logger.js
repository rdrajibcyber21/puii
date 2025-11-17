import winston from 'winston';
import { config } from '../config.js';

const { combine, timestamp, printf, colorize } = winston.format;

const format = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${ts} ${level}: ${message} ${metaString}`.trim();
});

export const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(timestamp(), format),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), format),
    }),
  ],
});
