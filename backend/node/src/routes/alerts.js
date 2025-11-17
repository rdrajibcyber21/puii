import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getAlerts,
  postAlert,
  postAcknowledgeAlert,
} from '../controllers/alertsController.js';

export const alertsRouter = Router();

alertsRouter
  .route('/')
  .get(query('limit').optional().isInt({ min: 1 }).toInt(), getAlerts)
  .post(
    body('eventId').isUUID(),
    body('severity').isIn(['low', 'medium', 'high', 'critical']),
    body('message').isString().isLength({ min: 3 }),
    postAlert,
  );

alertsRouter
  .route('/:alertId/acknowledge')
  .post(postAcknowledgeAlert);
