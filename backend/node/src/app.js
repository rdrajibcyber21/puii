import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { eventsRouter } from './routes/events.js';
import { alertsRouter } from './routes/alerts.js';
import { authRouter } from './routes/auth.js';
import { reportsRouter } from './routes/reports.js';
import { policiesRouter } from './routes/policies.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok', env: config.env });
  });

  app.use('/api/auth', authRouter);

  app.use('/api/events', authenticate, eventsRouter);
  app.use('/api/alerts', authenticate, alertsRouter);
  app.use('/api/reports', authenticate, reportsRouter);
  app.use('/api/policies', authenticate, policiesRouter);

  app.use(errorHandler);

  return app;
};
