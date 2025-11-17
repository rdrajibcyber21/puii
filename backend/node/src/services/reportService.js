import { query } from '../lib/db.js';

const COUNT_BY_LABEL = `
  SELECT threat_label AS label, COUNT(*) AS count
  FROM network_events
  GROUP BY threat_label
`;

const RECENT_ALERTS = `
  SELECT severity, COUNT(*) AS count
  FROM alerts
  WHERE created_at >= (NOW() - INTERVAL 7 DAY)
  GROUP BY severity
`;

const AVG_SCORE = `
  SELECT AVG(threat_score) AS value
  FROM network_events
`;

const TOP_SOURCES = `
  SELECT source_ip, COUNT(*) AS count
  FROM network_events
  GROUP BY source_ip
  ORDER BY count DESC
  LIMIT 5
`;

const LIST_REPORTS = `
  SELECT id, generated_by, summary, created_at
  FROM threat_reports
  ORDER BY created_at DESC
  LIMIT ?
`;

const INSERT_REPORT = `
  INSERT INTO threat_reports (id, generated_by, filters, summary)
  VALUES (?, ?, ?, ?)
`;

export const getDashboardMetrics = async () => {
  const [labelRows, alertRows, [avgRow], topSources] = await Promise.all([
    query(COUNT_BY_LABEL),
    query(RECENT_ALERTS),
    query(AVG_SCORE),
    query(TOP_SOURCES),
  ]);

  return {
    threatsByLabel: labelRows,
    alertsBySeverity: alertRows,
    averageThreatScore: avgRow?.value ?? 0,
    topSources,
  };
};

const normalizeLimit = (limit) => {
  const parsedLimit = Number.parseInt(limit ?? 50, 10);

  if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
    return 50;
  }

  return parsedLimit;
};

export const listReports = async ({ limit } = {}) => query(LIST_REPORTS, [normalizeLimit(limit)]);

export const createReport = async ({ id, generatedBy, filters, summary }) => {
  await query(INSERT_REPORT, [id, generatedBy, JSON.stringify(filters ?? {}), summary]);
};
