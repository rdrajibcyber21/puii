import { query } from '../lib/db.js';

const INSERT_EVENT = `
  INSERT INTO network_events
  (id, source_ip, destination_ip, protocol, payload_size, metadata, threat_score, threat_label, response_action)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const createEvent = async ({
  id,
  sourceIp,
  destinationIp,
  protocol,
  payloadSize,
  metadata,
  threatScore,
  threatLabel,
  responseAction,
}) => {
  await query(INSERT_EVENT, [
    id,
    sourceIp,
    destinationIp,
    protocol,
    payloadSize,
    JSON.stringify(metadata ?? {}),
    threatScore,
    threatLabel,
    responseAction,
  ]);
  return id;
};

export const listEvents = async ({ limit = 100, offset = 0 } = {}) => {
  // Ensure limit and offset are integers (safe for string interpolation)
  const safeLimit = parseInt(limit, 10) || 100;
  const safeOffset = parseInt(offset, 10) || 0;
  
  // Use string interpolation for LIMIT/OFFSET to avoid prepared statement issues
  const LIST_EVENTS = `
    SELECT *
    FROM network_events
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;
  
  return query(LIST_EVENTS);
};
