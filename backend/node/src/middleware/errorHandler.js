import { logger } from '../lib/logger.js';

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error('Unhandled error', { error: err.message });
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: 'Internal server error' });
};
