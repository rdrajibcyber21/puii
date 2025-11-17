import { query } from '../lib/db.js';

const INSERT_ALERT = `
  INSERT INTO alerts
  (id, event_id, severity, message, acknowledged, created_at)
  VALUES (?, ?, ?, ?, false, NOW())
`;

const LIST_ALERTS = `
  SELECT *
  FROM alerts
  ORDER BY created_at DESC
  LIMIT ?
`;

const ACK_ALERT = `
  UPDATE alerts
  SET acknowledged = true, acknowledged_at = NOW()
  WHERE id = ?
`;

export const createAlert = async ({ id, eventId, severity, message }) => {
  await query(INSERT_ALERT, [id, eventId, severity, message]);
  return id;
};

export const listAlerts = async ({ limit = 50 } = {}) => query(LIST_ALERTS, [limit]);

export const acknowledgeAlert = async (alertId) => {
  await query(ACK_ALERT, [alertId]);
};
