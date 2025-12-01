import { Router } from 'express';
import { getLogs, searchLogs, exportLogs } from '../controllers/logsController.js';
import { authenticate } from '../middleware/auth.js';

export const logsRouter = Router();

logsRouter.get('/', authenticate, getLogs);
logsRouter.get('/search', authenticate, searchLogs);
logsRouter.post('/export', authenticate, exportLogs);

