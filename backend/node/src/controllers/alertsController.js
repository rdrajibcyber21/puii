import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { listAlerts, acknowledgeAlert, createAlert } from '../services/alertService.js';
import { emitAlert } from '../lib/realtime.js';

export const getAlerts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const alerts = await listAlerts({ limit });
    return res.json({ data: alerts });
  } catch (error) {
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
