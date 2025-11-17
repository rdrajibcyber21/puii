import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { createEvent, listEvents } from '../services/eventService.js';
import { createAlert } from '../services/alertService.js';
import { scoreTelemetry } from '../services/mlService.js';
import { logger } from '../lib/logger.js';
import { emitAlert } from '../lib/realtime.js';
import { DatabaseError } from '../lib/db.js';
import { SAMPLE_EVENTS } from '../lib/fallbackData.js';

export const postEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    const eventId = uuid();

    const mlResponse = await scoreTelemetry({
      event_id: eventId,
      source_ip: payload.sourceIp,
      destination_ip: payload.destinationIp,
      protocol: payload.protocol,
      payload_size: payload.payloadSize,
      metadata: payload.metadata,
    });

    const {
      threat_score: threatScore,
      threat_label: threatLabel,
      recommended_action: responseAction,
      severity = 'medium',
      message = 'Automated threat assessment completed',
    } = mlResponse;

    await createEvent({
      id: eventId,
      sourceIp: payload.sourceIp,
      destinationIp: payload.destinationIp,
      protocol: payload.protocol,
      payloadSize: payload.payloadSize,
      metadata: payload.metadata,
      threatScore,
      threatLabel,
      responseAction,
    });

    const alertPayload = {
      id: uuid(),
      eventId,
      severity,
      message,
    };

    await createAlert(alertPayload);
    emitAlert(alertPayload);

    return res.status(201).json({
      id: eventId,
      threatScore,
      threatLabel,
      responseAction,
    });
  } catch (error) {
    logger.error('Failed to process event', { error: error.message });
    return next(error);
  }
};

export const getEvents = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { limit, offset } = matchedData(req, { locations: ['query'] });

  try {
    const events = await listEvents({ limit: limit ?? 100, offset: offset ?? 0 });
    return res.json({ data: events });
  } catch (error) {
    if (error instanceof DatabaseError) {
      logger.warn('Database unavailable, serving fallback events');
      return res.status(200).json({
        data: SAMPLE_EVENTS.slice(0, limit ?? SAMPLE_EVENTS.length),
        warning: 'Using fallback data because the database is unavailable.',
      });
    }
    logger.error('Failed to load events', { error: error.message });
    return next(error);
  }
};
