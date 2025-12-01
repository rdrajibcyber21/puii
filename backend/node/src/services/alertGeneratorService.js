import { createAlert } from './alertService.js';
import { emitAlert } from '../lib/realtime.js';
import { logger } from '../lib/logger.js';
import { v4 as uuid } from 'uuid';

/**
 * Generate sample alerts for demonstration
 */
export const generateSampleAlerts = async (count = 10) => {
  const alertTemplates = [
    {
      severity: 'critical',
      messages: [
        'Malicious traffic detected from external source',
        'High-threat attack pattern identified',
        'Suspicious activity from known threat actor IP',
        'Potential data exfiltration attempt detected',
        'Critical security breach attempt blocked',
      ],
    },
    {
      severity: 'high',
      messages: [
        'Suspicious traffic detected to protected host',
        'Anomalous network behavior observed',
        'Unusual connection pattern from external IP',
        'Potential intrusion attempt detected',
        'High-risk network activity identified',
      ],
    },
    {
      severity: 'medium',
      messages: [
        'Increased byte entropy observed',
        'Unusual protocol usage detected',
        'Suspicious payload pattern identified',
        'Anomalous traffic volume detected',
        'Potential security concern identified',
      ],
    },
    {
      severity: 'low',
      messages: [
        'Network activity from new source IP',
        'Unusual connection pattern observed',
        'Minor anomaly in network traffic',
        'Informational security event',
        'Network monitoring alert',
      ],
    },
  ];

  const generatedAlerts = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < count; i++) {
    try {
      // Randomly select severity and message
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const message = template.messages[Math.floor(Math.random() * template.messages.length)];
      
      const alertId = uuid();
      const eventId = uuid(); // Generate a fake event ID for the alert
      
      const alertPayload = {
        id: alertId,
        eventId,
        severity: template.severity,
        message,
      };

      await createAlert(alertPayload);
      emitAlert(alertPayload);
      generatedAlerts.push(alertPayload);
      successCount++;
    } catch (error) {
      errorCount++;
      logger.warn('Failed to generate sample alert', { error: error.message });
    }
  }

  logger.info(`Generated ${successCount} sample alerts, ${errorCount} failed`);

  return {
    generated: successCount,
    failed: errorCount,
    alerts: generatedAlerts,
  };
};

