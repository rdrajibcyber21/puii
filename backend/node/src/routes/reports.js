import { Router } from 'express';
import { body } from 'express-validator';
import { getDashboard, getReports, postReport } from '../controllers/reportsController.js';

export const reportsRouter = Router();

reportsRouter.get('/dashboard', getDashboard);
reportsRouter.get('/', getReports);
reportsRouter.post(
  '/',
  body('filters').optional().isObject(),
  body('summary').isString().isLength({ min: 10 }),
  postReport,
);
