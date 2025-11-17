import { Router } from 'express';
import { body, query } from 'express-validator';
import { getDashboard, getReports, postReport } from '../controllers/reportsController.js';

export const reportsRouter = Router();

reportsRouter.get('/dashboard', getDashboard);
reportsRouter.get('/', query('limit').optional().isInt({ min: 1 }).toInt(), getReports);
reportsRouter.post(
  '/',
  body('filters').optional().isObject(),
  body('summary').isString().isLength({ min: 10 }),
  postReport,
);
