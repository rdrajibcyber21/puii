import jwt from 'jsonwebtoken';
import { validationResult, matchedData } from 'express-validator';
import { config } from '../config.js';

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = matchedData(req);

  if (email !== config.auth.adminEmail || password !== config.auth.adminPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: email, role: 'admin' },
    config.jwtSecret,
    { expiresIn: config.auth.tokenTtlSeconds },
  );

  return res.json({ token });
};
