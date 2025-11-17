import { Router } from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController.js';

export const authRouter = Router();

authRouter.post(
  '/login',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  login,
);
