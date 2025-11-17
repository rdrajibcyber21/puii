import { validationResult, matchedData } from 'express-validator';
import {
  listPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  listBlockedSources,
  addBlockedSource,
} from '../services/policyService.js';
import { DatabaseError } from '../lib/db.js';
import { logger } from '../lib/logger.js';
import { SAMPLE_BLOCKED_SOURCES, SAMPLE_POLICIES } from '../lib/fallbackData.js';

const isDatabaseUnavailable = (error) => error instanceof DatabaseError || error?.statusCode === 503;

export const getPolicies = async (req, res, next) => {
  try {
    const policies = await listPolicies();
    return res.json({ data: policies });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      logger.warn('Database unavailable, serving fallback policies');
      return res.json({ data: SAMPLE_POLICIES });
    }
    return next(error);
  }
};

export const postPolicy = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    await createPolicy(payload);
    return res.status(201).send();
  } catch (error) {
    return next(error);
  }
};

export const patchPolicy = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    await updatePolicy(Number(req.params.policyId), payload);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const deletePolicyHandler = async (req, res, next) => {
  try {
    await deletePolicy(Number(req.params.policyId));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const getBlockedSources = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { limit } = matchedData(req, { locations: ['query'] });
    const blocked = await listBlockedSources({ limit: limit ?? 50 });
    return res.json({ data: blocked });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      logger.warn('Database unavailable, serving fallback blocked sources');
      const { limit } = matchedData(req, { locations: ['query'] });
      const normalizedLimit = Number.parseInt(limit ?? 50, 10);
      const sliceLimit = Number.isFinite(normalizedLimit) && normalizedLimit > 0 ? normalizedLimit : 50;
      return res.json({ data: SAMPLE_BLOCKED_SOURCES.slice(0, sliceLimit) });
    }
    return next(error);
  }
};

export const postBlockedSource = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const payload = matchedData(req);
    await addBlockedSource(payload);
    return res.status(201).send();
  } catch (error) {
    return next(error);
  }
};
