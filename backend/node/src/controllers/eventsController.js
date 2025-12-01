import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import { createEvent, listEvents } from '../services/eventService.js';
import { createAlert } from '../services/alertService.js';
import { scoreTelemetry } from '../services/mlService.js';
import { logger } from '../lib/logger.js';
import { emitAlert } from '../lib/realtime.js';
import { DatabaseError } from '../lib/db.js';
import { SAMPLE_EVENTS } from '../lib/fallbackData.js';
import {
  eventsProcessedTotal,
  eventsProcessingDuration,
  threatScoreDistribution,
} from '../lib/metrics.js';

export const postEvent = async (req, res, next) => {
  const processingStartTime = Date.now();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    const eventId = uuid();

    // Track ML scoring stage
    const mlStartTime = Date.now();
    const mlResponse = await scoreTelemetry({
      event_id: eventId,
      source_ip: payload.sourceIp,
      destination_ip: payload.destinationIp,
      protocol: payload.protocol,
      payload_size: payload.payloadSize,
      metadata: payload.metadata,
    });
    eventsProcessingDuration.observe({ stage: 'ml_scoring' }, (Date.now() - mlStartTime) / 1000);

    const {
      threat_score: threatScore,
      threat_label: threatLabel,
      recommended_action: responseAction,
      severity = 'medium',
      message = 'Automated threat assessment completed',
    } = mlResponse;

    // Track database storage stage
    const dbStartTime = Date.now();
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
    eventsProcessingDuration.observe({ stage: 'database_storage' }, (Date.now() - dbStartTime) / 1000);

    const alertPayload = {
      id: uuid(),
      eventId,
      severity,
      message,
    };

    await createAlert(alertPayload);
    emitAlert(alertPayload);

    // Record event metrics
    const totalDuration = (Date.now() - processingStartTime) / 1000;
    eventsProcessingDuration.observe({ stage: 'total' }, totalDuration);
    eventsProcessedTotal.inc({ threat_label: threatLabel, response_action: responseAction });
    threatScoreDistribution.observe(threatScore);

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
