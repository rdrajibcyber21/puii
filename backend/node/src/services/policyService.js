import { query } from '../lib/db.js';

const LIST_POLICIES = `
  SELECT * FROM response_policies
  ORDER BY created_at DESC
`;

const INSERT_POLICY = `
  INSERT INTO response_policies (name, threshold, action, enabled)
  VALUES (?, ?, ?, ?)
`;

const UPDATE_POLICY = `
  UPDATE response_policies
  SET threshold = ?, action = ?, enabled = ?
  WHERE id = ?
`;

const DELETE_POLICY = `
  DELETE FROM response_policies
  WHERE id = ?
`;

const LIST_BLOCKED = `
  SELECT * FROM blocked_sources
  ORDER BY created_at DESC
  LIMIT ?
`;

const INSERT_BLOCKED = `
  INSERT INTO blocked_sources (source_ip, reason, expires_at)
  VALUES (?, ?, ?)
`;

export const listPolicies = async () => query(LIST_POLICIES);

export const createPolicy = async ({ name, threshold, action, enabled }) => {
  await query(INSERT_POLICY, [name, threshold, action, enabled]);
};

export const updatePolicy = async (id, { threshold, action, enabled }) => {
  await query(UPDATE_POLICY, [threshold, action, enabled, id]);
};

export const deletePolicy = async (id) => {
  await query(DELETE_POLICY, [id]);
};

export const listBlockedSources = async ({ limit = 50 } = {}) => query(LIST_BLOCKED, [limit]);

export const addBlockedSource = async ({ sourceIp, reason, expiresAt }) => {
  await query(INSERT_BLOCKED, [sourceIp, reason, expiresAt]);
};
