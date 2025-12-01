import { Router } from 'express';
import { fetchAllData, fetchFromSpecificSource } from '../controllers/dataFetcherController.js';
import { generateAlerts } from '../controllers/alertGeneratorController.js';
import { authenticate } from '../middleware/auth.js';

export const dataFetcherRouter = Router();

// Fetch from all sources
dataFetcherRouter.post('/fetch/all', authenticate, fetchAllData);

// Fetch from specific source
dataFetcherRouter.post('/fetch/:source', authenticate, fetchFromSpecificSource);

// Generate sample alerts
dataFetcherRouter.post('/generate-alerts', authenticate, generateAlerts);

