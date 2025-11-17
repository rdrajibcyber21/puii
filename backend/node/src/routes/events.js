import { Router } from 'express';
import { body, query } from 'express-validator';
import { postEvent, getEvents } from '../controllers/eventsController.js';

export const eventsRouter = Router();

eventsRouter
  .route('/')
  .get(
    query('limit').optional().isInt({ min: 1 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    getEvents,
  )
  .post(
    body('sourceIp').isIP().withMessage('Invalid source IP'),
    body('destinationIp').isIP().withMessage('Invalid destination IP'),
    body('protocol').isIn(['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS']).withMessage('Unsupported protocol'),
    body('payloadSize').isInt({ min: 0 }).toInt(),
    body('metadata').optional().isObject(),
    postEvent,
  );
