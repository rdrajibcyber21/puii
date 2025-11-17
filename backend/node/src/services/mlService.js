import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../lib/logger.js';

const client = axios.create({
  baseURL: config.mlService.baseUrl,
  timeout: config.mlService.timeoutMs,
  headers: config.mlService.apiKey
    ? { 'x-api-key': config.mlService.apiKey }
    : undefined,
});

export const scoreTelemetry = async (payload) => {
  try {
    const { data } = await client.post('/api/v1/score', payload);
    return data;
  } catch (error) {
    logger.error('Failed to score telemetry', { error: error.message });
    throw error;
  }
};

export const trainModel = async (trainingJob) => {
  try {
    const { data } = await client.post('/api/v1/train', trainingJob);
    return data;
  } catch (error) {
    logger.error('Failed to trigger training job', { error: error.message });
    throw error;
  }
};
