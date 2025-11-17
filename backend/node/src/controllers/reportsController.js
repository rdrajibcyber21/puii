import { validationResult, matchedData } from 'express-validator';
import { v4 as uuid } from 'uuid';
import {
  getDashboardMetrics,
  listReports,
  createReport,
} from '../services/reportService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics();
    return res.json(metrics);
  } catch (error) {
    return next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await listReports({ limit: req.query.limit });
    return res.json({ data: reports });
  } catch (error) {
    console.log('print the report error', error);
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
