import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { listAlerts, acknowledgeAlert, createAlert } from '../services/alertService.js';
import { emitAlert } from '../lib/realtime.js';
import { DatabaseError } from '../lib/db.js';
import { SAMPLE_ALERTS } from '../lib/fallbackData.js';
import { logger } from '../lib/logger.js';

export const getAlerts = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { limit } = matchedData(req, { locations: ['query'] });

  try {
    const alerts = await listAlerts({ limit: limit ?? 50 });
    return res.json({ data: alerts });
  } catch (error) {
    if (error instanceof DatabaseError) {
      logger.warn('Database unavailable, serving fallback alerts');
      return res.status(200).json({
        data: SAMPLE_ALERTS.slice(0, limit ?? SAMPLE_ALERTS.length),
        warning: 'Using fallback data because the database is unavailable.',
      });
    }
    logger.error('Failed to load alerts', { error: error.message });
    return next(error);
  }
};

export const postAlert = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    const alertId = uuid();
    const alert = {
      id: alertId,
      eventId: payload.eventId,
      severity: payload.severity,
      message: payload.message,
    };
    await createAlert(alert);
    emitAlert(alert);
    return res.status(201).json({ id: alertId });
  } catch (error) {
    return next(error);
  }
};

export const postAcknowledgeAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    await acknowledgeAlert(alertId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
