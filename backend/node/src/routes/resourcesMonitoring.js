import { Router } from 'express';
import { getSystemResources, getResourceHistory } from '../controllers/resourcesMonitoringController.js';
import { authenticate } from '../middleware/auth.js';

export const resourcesMonitoringRouter = Router();

resourcesMonitoringRouter.get('/', authenticate, getSystemResources);
resourcesMonitoringRouter.get('/history', authenticate, getResourceHistory);

