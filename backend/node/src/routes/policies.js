import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPolicies,
  postPolicy,
  patchPolicy,
  deletePolicyHandler,
  getBlockedSources,
  postBlockedSource,
} from '../controllers/policyController.js';

export const policiesRouter = Router();

policiesRouter
  .route('/')
  .get(getPolicies)
  .post(
    body('name').isString().isLength({ min: 3 }),
    body('threshold').isFloat({ min: 0, max: 1 }).toFloat(),
    body('action').isIn(['allow', 'challenge', 'block_source']),
    body('enabled').isBoolean().toBoolean(),
    postPolicy,
  );

policiesRouter
  .route('/:policyId')
  .patch(
    body('threshold').optional().isFloat({ min: 0, max: 1 }).toFloat(),
    body('action').optional().isIn(['allow', 'challenge', 'block_source']),
    body('enabled').optional().isBoolean().toBoolean(),
    patchPolicy,
  )
  .delete(deletePolicyHandler);

policiesRouter
  .route('/blocked')
  .get(getBlockedSources)
  .post(
    body('sourceIp').isIP(),
    body('reason').isString().isLength({ min: 3 }),
    body('expiresAt').optional().isISO8601(),
    postBlockedSource,
  );
