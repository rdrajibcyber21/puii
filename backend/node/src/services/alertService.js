import { query } from '../lib/db.js';
import { alertsTotal, alertsActive } from '../lib/metrics.js';

const INSERT_ALERT = `
  INSERT INTO alerts
  (id, event_id, severity, message, acknowledged, created_at)
  VALUES (?, ?, ?, ?, false, NOW())
`;

const ACK_ALERT = `
  UPDATE alerts
  SET acknowledged = true, acknowledged_at = NOW()
  WHERE id = ?
`;

const COUNT_ACTIVE_ALERTS = `
  SELECT severity, COUNT(*) as count
  FROM alerts
  WHERE acknowledged = false
  GROUP BY severity
`;

export const createAlert = async ({ id, eventId, severity, message }) => {
  await query(INSERT_ALERT, [id, eventId, severity, message]);
  
  // Track alert metrics
  alertsTotal.inc({ severity, acknowledged: 'false' });
  alertsActive.inc({ severity });
  
  return id;
};

export const listAlerts = async ({ limit = 50 } = {}) => {
  // Ensure limit is an integer (safe for string interpolation)
  const safeLimit = parseInt(limit, 10) || 50;
  
  // Use string interpolation for LIMIT to avoid prepared statement issues
  const LIST_ALERTS = `
    SELECT *
    FROM alerts
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
  
  return query(LIST_ALERTS);
};

export const acknowledgeAlert = async (alertId) => {
  await query(ACK_ALERT, [alertId]);
  
  // Update alert metrics (we'll refresh active counts periodically)
  alertsTotal.inc({ severity: 'unknown', acknowledged: 'true' });
};

// Update active alert counts periodically
export const updateActiveAlertMetrics = async () => {
  try {
    const counts = await query(COUNT_ACTIVE_ALERTS);
    
    // Reset all to zero first
    alertsActive.reset();
    
    // Set current counts
    counts.forEach(({ severity, count }) => {
      alertsActive.set({ severity }, parseInt(count, 10));
    });
  } catch (error) {
    // Ignore errors in metrics update
  }
};

// Update metrics every 30 seconds
setInterval(updateActiveAlertMetrics, 30000);
