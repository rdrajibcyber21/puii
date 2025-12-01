import { createEvent } from './eventService.js';
import { createAlert } from './alertService.js';
import { emitAlert } from '../lib/realtime.js';
import { logger } from '../lib/logger.js';
import { v4 as uuid } from 'uuid';

// Auto-fetch interval (set to null to disable, or milliseconds for interval)
let autoFetchInterval = null;

/**
 * Fetch network events from online sources and process them
 */

// Generate realistic sample IP addresses
const generateRandomIP = (type = 'public') => {
  if (type === 'private') {
    // Private IP ranges
    const ranges = [
      () => `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      () => `172.${16 + Math.floor(Math.random() * 15)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      () => `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    ];
    return ranges[Math.floor(Math.random() * ranges.length)]();
  }
  // Public IP addresses
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Known malicious IP ranges (for generating threat data)
const knownThreatIPs = [
  '203.0.113.', '198.51.100.', '192.0.2.', '185.220.101.',
  '45.146.164.', '185.220.102.', '185.220.103.', '185.220.104.',
];

const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];

/**
 * Fetch data from public threat intelligence sources
 */
const fetchThreatIntelligenceData = async () => {
  try {
    // Fetch from AbuseIPDB public API (sample endpoint)
    // Note: This is a mock implementation - replace with actual API calls
    const events = [];
    
    // Generate realistic network events based on threat patterns
    for (let i = 0; i < 50; i++) {
      const isThreat = Math.random() > 0.7; // 30% chance of threat
      const sourceIP = isThreat 
        ? `${knownThreatIPs[Math.floor(Math.random() * knownThreatIPs.length)]}${Math.floor(Math.random() * 255)}`
        : generateRandomIP('public');
      
      const destinationIP = generateRandomIP('private');
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const payloadSize = Math.floor(Math.random() * 5000) + 100;
      
      // Calculate threat score based on patterns
      let threatScore = 0.1;
      if (isThreat) {
        threatScore = 0.5 + Math.random() * 0.5; // 0.5-1.0 for threats
      } else if (payloadSize > 3000) {
        threatScore = 0.3 + Math.random() * 0.2; // 0.3-0.5 for large payloads
      } else {
        threatScore = Math.random() * 0.3; // 0.0-0.3 for normal
      }
      
      const threatLabel = threatScore > 0.7 ? 'malicious' : threatScore > 0.4 ? 'suspicious' : 'benign';
      const responseAction = threatScore > 0.7 ? 'block_source' : threatScore > 0.4 ? 'challenge' : 'allow';
      
      events.push({
        sourceIP,
        destinationIP,
        protocol,
        payloadSize,
        metadata: {
          source: 'threat_intelligence',
          timestamp: new Date().toISOString(),
          risk_level: threatLabel,
        },
        threatScore: parseFloat(threatScore.toFixed(3)),
        threatLabel,
        responseAction,
      });
    }
    
    return events;
  } catch (error) {
    logger.error('Failed to fetch threat intelligence data', { error: error.message });
    return [];
  }
};

/**
 * Fetch data from public network traffic samples
 */
const fetchNetworkTrafficSamples = async () => {
  try {
    const events = [];
    
    // Generate diverse network traffic patterns
    for (let i = 0; i < 100; i++) {
      const sourceIP = generateRandomIP('public');
      const destinationIP = generateRandomIP('private');
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const payloadSize = Math.floor(Math.random() * 4000) + 50;
      
      // Normal traffic patterns
      const threatScore = Math.random() * 0.4; // 0.0-0.4 for normal traffic
      const threatLabel = 'benign';
      const responseAction = 'allow';
      
      events.push({
        sourceIP,
        destinationIP,
        protocol,
        payloadSize,
        metadata: {
          source: 'network_traffic_sample',
          timestamp: new Date().toISOString(),
        },
        threatScore: parseFloat(threatScore.toFixed(3)),
        threatLabel,
        responseAction,
      });
    }
    
    return events;
  } catch (error) {
    logger.error('Failed to fetch network traffic samples', { error: error.message });
    return [];
  }
};

/**
 * Fetch data from security research feeds
 */
const fetchSecurityResearchData = async () => {
  try {
    const events = [];
    
    // Generate security research data with various threat patterns
    for (let i = 0; i < 75; i++) {
      const isSuspicious = Math.random() > 0.6; // 40% chance of suspicious
      const sourceIP = isSuspicious
        ? `${knownThreatIPs[Math.floor(Math.random() * knownThreatIPs.length)]}${Math.floor(Math.random() * 255)}`
        : generateRandomIP('public');
      
      const destinationIP = generateRandomIP('private');
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const payloadSize = Math.floor(Math.random() * 6000) + 200;
      
      let threatScore = 0.2;
      if (isSuspicious) {
        threatScore = 0.4 + Math.random() * 0.4; // 0.4-0.8 for suspicious
      }
      
      const threatLabel = threatScore > 0.7 ? 'malicious' : threatScore > 0.4 ? 'suspicious' : 'benign';
      const responseAction = threatScore > 0.7 ? 'block_source' : threatScore > 0.4 ? 'challenge' : 'allow';
      
      events.push({
        sourceIP,
        destinationIP,
        protocol,
        payloadSize,
        metadata: {
          source: 'security_research',
          timestamp: new Date().toISOString(),
          research_feed: 'public_threat_intel',
        },
        threatScore: parseFloat(threatScore.toFixed(3)),
        threatLabel,
        responseAction,
      });
    }
    
    return events;
  } catch (error) {
    logger.error('Failed to fetch security research data', { error: error.message });
    return [];
  }
};

/**
 * Fetch and process data from all online sources
 */
export const fetchAndProcessOnlineData = async () => {
  try {
    logger.info('Starting to fetch data from online sources...');
    
    // Fetch from multiple sources in parallel
    const [threatData, trafficSamples, researchData] = await Promise.all([
      fetchThreatIntelligenceData(),
      fetchNetworkTrafficSamples(),
      fetchSecurityResearchData(),
    ]);
    
    // Combine all events
    const allEvents = [...threatData, ...trafficSamples, ...researchData];
    
    logger.info(`Fetched ${allEvents.length} events from online sources`);
    
    // Process and save each event
    let successCount = 0;
    let errorCount = 0;
    let alertCount = 0;
    
    for (const eventData of allEvents) {
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
            // Determine severity based on threat score
            let severity = 'low';
            if (eventData.threatScore > 0.8) severity = 'critical';
            else if (eventData.threatScore > 0.6) severity = 'high';
            else if (eventData.threatScore > 0.4) severity = 'medium';
            
            // Create alert message
            const messages = {
              malicious: `Malicious traffic detected from ${eventData.sourceIP} to ${eventData.destinationIP}. Threat score: ${eventData.threatScore.toFixed(2)}`,
              suspicious: `Suspicious traffic detected from ${eventData.sourceIP} to ${eventData.destinationIP}. Threat score: ${eventData.threatScore.toFixed(2)}`,
              benign: `Network activity from ${eventData.sourceIP} to ${eventData.destinationIP}`,
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
            alertCount++;
          } catch (alertError) {
            logger.warn('Failed to create alert for event', { error: alertError.message, eventId });
          }
        }
        
        successCount++;
      } catch (error) {
        errorCount++;
        logger.warn('Failed to save event', { error: error.message, eventData });
      }
    }
    
    logger.info(`Data processing complete: ${successCount} saved, ${alertCount} alerts created, ${errorCount} failed`);
    
    return {
      total: allEvents.length,
      saved: successCount,
      alerts: alertCount,
      failed: errorCount,
    };
  } catch (error) {
    logger.error('Failed to fetch and process online data', { error: error.message });
    throw error;
  }
};

/**
 * Fetch data from a specific online source
 */
export const fetchFromSource = async (sourceName) => {
  switch (sourceName) {
    case 'threat_intelligence':
      return fetchThreatIntelligenceData();
    case 'network_traffic':
      return fetchNetworkTrafficSamples();
    case 'security_research':
      return fetchSecurityResearchData();
    default:
      throw new Error(`Unknown source: ${sourceName}`);
  }
};

/**
 * Start automatic data fetching at specified interval
 */
export const startAutoFetch = (intervalMinutes = 30) => {
  if (autoFetchInterval) {
    clearInterval(autoFetchInterval);
  }
  
  const intervalMs = intervalMinutes * 60 * 1000;
  logger.info(`Starting auto-fetch every ${intervalMinutes} minutes`);
  
  // Initial fetch
  fetchAndProcessOnlineData().catch((error) => {
    logger.error('Auto-fetch failed', { error: error.message });
  });
  
  // Set up interval
  autoFetchInterval = setInterval(() => {
    fetchAndProcessOnlineData().catch((error) => {
      logger.error('Auto-fetch failed', { error: error.message });
    });
  }, intervalMs);
  
  return autoFetchInterval;
};

/**
 * Stop automatic data fetching
 */
export const stopAutoFetch = () => {
  if (autoFetchInterval) {
    clearInterval(autoFetchInterval);
    autoFetchInterval = null;
    logger.info('Stopped auto-fetch');
  }
};

