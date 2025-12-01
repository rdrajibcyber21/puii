import { Router } from 'express';
import {
  getTrafficFlow,
  getTrafficFlowHistory,
  getServiceDependencies,
} from '../controllers/trafficFlowController.js';
import { authenticate } from '../middleware/auth.js';

export const trafficFlowRouter = Router();

trafficFlowRouter.get('/', authenticate, getTrafficFlow);
trafficFlowRouter.get('/history', authenticate, getTrafficFlowHistory);
trafficFlowRouter.get('/dependencies', authenticate, getServiceDependencies);

