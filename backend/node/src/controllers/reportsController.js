import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import {
  getDashboardMetrics,
  listReports,
  createReport,
} from '../services/reportService.js';
import { DatabaseError } from '../lib/db.js';
import { logger } from '../lib/logger.js';
import { SAMPLE_DASHBOARD_METRICS, SAMPLE_REPORTS } from '../lib/fallbackData.js';

const isDatabaseUnavailable = (error) => error instanceof DatabaseError || error?.statusCode === 503;

export const getDashboard = async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics();
    return res.json(metrics);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      logger.warn('Database unavailable, serving fallback dashboard metrics');
      return res.json(SAMPLE_DASHBOARD_METRICS);
    }
    return next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit } = matchedData(req, { locations: ['query'] });
    const reports = await listReports({ limit });
    return res.json({ data: reports });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      logger.warn('Database unavailable, serving fallback reports');
      const { limit } = matchedData(req, { locations: ['query'] });
      const normalizedLimit = Number.parseInt(limit ?? 50, 10);
      const sliceLimit = Number.isFinite(normalizedLimit) && normalizedLimit > 0 ? normalizedLimit : 50;
      return res.json({ data: SAMPLE_REPORTS.slice(0, sliceLimit) });
    }
    return next(error);
  }
};

export const postReport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    const id = uuid();
    const { filters, summary } = payload;
    await createReport({
      id,
      generatedBy: req.user?.sub ?? 'system',
      filters,
      summary,
    });
    return res.status(201).json({ id });
  } catch (error) {
    return next(error);
  }
};
