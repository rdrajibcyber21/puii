import { Router } from 'express';
import { getIPMetrics } from '../controllers/metricsController.js';
import { authenticate } from '../middleware/auth.js';

export const metricsRouter = Router();

metricsRouter.get('/ip', authenticate, getIPMetrics);

