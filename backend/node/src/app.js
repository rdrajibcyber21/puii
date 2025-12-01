import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config.js';
import { eventsRouter } from './routes/events.js';
import { alertsRouter } from './routes/alerts.js';
import { authRouter } from './routes/auth.js';
import { reportsRouter } from './routes/reports.js';
import { policiesRouter } from './routes/policies.js';
import { metricsRouter } from './routes/metrics.js';
import { dataFetcherRouter } from './routes/dataFetcher.js';
import { resourcesMonitoringRouter } from './routes/resourcesMonitoring.js';
import { logsRouter } from './routes/logs.js';
import { ticketsRouter } from './routes/tickets.js';
import { trafficFlowRouter } from './routes/trafficFlow.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { metricsMiddleware, performanceMiddleware } from './middleware/metrics.js';
import { register } from './lib/metrics.js';
import { healthCheck } from './controllers/healthController.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Metrics middleware (must be early in the chain)
  app.use(metricsMiddleware);
  app.use(performanceMiddleware);

  // Prometheus metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      const metrics = await register.metrics();
      res.end(metrics);
    } catch (error) {
      res.status(500).end(error.message);
    }
  });

  // Enhanced health check endpoint
  app.get('/healthz', healthCheck);
  app.get('/health', healthCheck);

  app.use('/api/auth', authRouter);

  app.use('/api/events', authenticate, eventsRouter);
  app.use('/api/alerts', authenticate, alertsRouter);
  app.use('/api/reports', authenticate, reportsRouter);
  app.use('/api/policies', authenticate, policiesRouter);
  app.use('/api/metrics', authenticate, metricsRouter);
  app.use('/api/data', authenticate, dataFetcherRouter);
  
  // Upcoming modules (under development)
  app.use('/api/resources', authenticate, resourcesMonitoringRouter);
  app.use('/api/logs', authenticate, logsRouter);
  app.use('/api/tickets', authenticate, ticketsRouter);
  app.use('/api/traffic-flow', authenticate, trafficFlowRouter);

  app.use(errorHandler);

  return app;
};
