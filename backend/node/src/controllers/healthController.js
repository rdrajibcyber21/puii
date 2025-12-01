import { query } from '../lib/db.js';
import { config } from '../config.js';
import { applicationHealth, startTime } from '../lib/metrics.js';
import axios from 'axios';

const checkDatabase = async () => {
  try {
    await query('SELECT 1');
    return { status: 'healthy', latency: 0 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

const checkMLService = async () => {
  try {
    const start = Date.now();
    const response = await axios.get(`${config.mlService.baseUrl}/healthz`, {
      timeout: 2000,
    });
    const latency = Date.now() - start;
    return {
      status: response.status === 200 ? 'healthy' : 'unhealthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      latency: null,
    };
  }
};

export const healthCheck = async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: '1.0.0',
    environment: config.env,
    components: {},
    overall: 'healthy',
  };

  // Check database
  const dbCheck = await checkDatabase();
  checks.components.database = dbCheck;
  applicationHealth.set({ component: 'database' }, dbCheck.status === 'healthy' ? 1 : 0);

  // Check ML service
  const mlCheck = await checkMLService();
  checks.components.mlService = mlCheck;
  applicationHealth.set({ component: 'ml_service' }, mlCheck.status === 'healthy' ? 1 : 0);

  // Determine overall health
  const allHealthy = Object.values(checks.components).every(
    (component) => component.status === 'healthy',
  );
  checks.overall = allHealthy ? 'healthy' : 'degraded';

  applicationHealth.set({ component: 'application' }, allHealthy ? 1 : 0);

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json(checks);
};

