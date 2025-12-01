import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../lib/logger.js';
import {
  mlServiceRequestDuration,
  mlServiceRequestTotal,
  mlServiceErrors,
} from '../lib/metrics.js';

const client = axios.create({
  baseURL: config.mlService.baseUrl,
  timeout: config.mlService.timeoutMs,
  headers: config.mlService.apiKey
    ? { 'x-api-key': config.mlService.apiKey }
    : undefined,
});

export const scoreTelemetry = async (payload) => {
  const startTime = Date.now();
  const endpoint = '/api/v1/score';

  try {
    const { data } = await client.post(endpoint, payload);
    const duration = (Date.now() - startTime) / 1000;

    mlServiceRequestDuration.observe({ endpoint, status: 'success' }, duration);
    mlServiceRequestTotal.inc({ endpoint, status: 'success' });

    return data;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    const status = error.response?.status >= 400 && error.response?.status < 500 ? 'client_error' : 'server_error';

    mlServiceRequestDuration.observe({ endpoint, status }, duration);
    mlServiceRequestTotal.inc({ endpoint, status });
    mlServiceErrors.inc({ endpoint, error_type: error.code || 'unknown' });

    logger.error('Failed to score telemetry', { error: error.message });
    throw error;
  }
};

export const trainModel = async (trainingJob) => {
  const startTime = Date.now();
  const endpoint = '/api/v1/train';

  try {
    const { data } = await client.post(endpoint, trainingJob);
    const duration = (Date.now() - startTime) / 1000;

    mlServiceRequestDuration.observe({ endpoint, status: 'success' }, duration);
    mlServiceRequestTotal.inc({ endpoint, status: 'success' });

    return data;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    const status = error.response?.status >= 400 && error.response?.status < 500 ? 'client_error' : 'server_error';

    mlServiceRequestDuration.observe({ endpoint, status }, duration);
    mlServiceRequestTotal.inc({ endpoint, status });
    mlServiceErrors.inc({ endpoint, error_type: error.code || 'unknown' });

    logger.error('Failed to trigger training job', { error: error.message });
    throw error;
  }
};
