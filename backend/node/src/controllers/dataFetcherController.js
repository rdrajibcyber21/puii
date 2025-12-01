import { fetchAndProcessOnlineData, fetchFromSource } from '../services/dataFetcherService.js';
import { createEvent } from '../services/eventService.js';
import { createAlert } from '../services/alertService.js';
import { emitAlert } from '../lib/realtime.js';
import { logger } from '../lib/logger.js';
import { v4 as uuid } from 'uuid';

/**
 * Fetch and process data from all online sources
 */
export const fetchAllData = async (req, res, next) => {
  try {
    const result = await fetchAndProcessOnlineData();
    return res.json({
      message: 'Data fetched and processed successfully',
      ...result,
    });
  } catch (error) {
    logger.error('Failed to fetch all data', { error: error.message });
    return next(error);
  }
};

/**
 * Fetch data from a specific source
 */
export const fetchFromSpecificSource = async (req, res, next) => {
  try {
    const { source } = req.params;
    const events = await fetchFromSource(source);
    
    // Process and save events
    let saved = 0;
    let failed = 0;
    let alertsCreated = 0;
    
    for (const eventData of events) {
      try {
        const eventId = uuid();
        await createEvent({
          id: eventId,
          sourceIp: eventData.sourceIP,
          destinationIp: eventData.destinationIP,
          protocol: eventData.protocol,
          payloadSize: eventData.payloadSize,
          metadata: eventData.metadata,
          threatScore: eventData.threatScore,
          threatLabel: eventData.threatLabel,
          responseAction: eventData.responseAction,
        });
        
        // Create alerts for high-threat events
        if (eventData.threatScore > 0.4 || eventData.threatLabel !== 'benign') {
          try {
            let severity = 'low';
            if (eventData.threatScore > 0.8) severity = 'critical';
            else if (eventData.threatScore > 0.6) severity = 'high';
            else if (eventData.threatScore > 0.4) severity = 'medium';
            
            const messages = {
              malicious: `Malicious traffic detected from ${eventData.sourceIP} to ${eventData.destinationIP}`,
              suspicious: `Suspicious traffic detected from ${eventData.sourceIP} to ${eventData.destinationIP}`,
              benign: `Network activity from ${eventData.sourceIP}`,
            };
            
            const alertId = uuid();
            const alertPayload = {
              id: alertId,
              eventId,
              severity,
              message: messages[eventData.threatLabel] || messages.benign,
            };
            
            await createAlert(alertPayload);
            emitAlert(alertPayload);
            alertsCreated++;
          } catch (alertError) {
            logger.warn('Failed to create alert', { error: alertError.message });
          }
        }
        
        saved++;
      } catch (error) {
        failed++;
        logger.warn('Failed to save event from source', { error: error.message });
      }
    }
    
    return res.json({
      message: `Data fetched from ${source} and processed`,
      fetched: events.length,
      saved,
      alerts: alertsCreated,
      failed,
    });
  } catch (error) {
    logger.error('Failed to fetch from source', { error: error.message, source: req.params.source });
    return next(error);
  }
};

