import { logger } from '../lib/logger.js';
import { config } from '../config.js';

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error('Unhandled error', { error: err.message });
  if (res.headersSent) {
    return next(err);
  }
  const status = err.statusCode ?? err.status ?? 500;
  const response = { message: err.message ?? 'Internal server error' };

  if (config.env === 'development' && err.details) {
    response.details = err.details;
  }

  return res.status(status).json(response);
};
