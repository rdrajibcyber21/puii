import { validationResult, matchedData } from 'express-validator';
import {
  listPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  listBlockedSources,
  addBlockedSource,
} from '../services/policyService.js';

export const getPolicies = async (req, res, next) => {
  try {
    const policies = await listPolicies();
    return res.json({ data: policies });
  } catch (error) {
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
    const blocked = await listBlockedSources({ limit: Number(req.query.limit ?? 50) });
    return res.json({ data: blocked });
  } catch (error) {
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
