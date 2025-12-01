import { Router } from 'express';
import {
  getTickets,
  createTicket,
  updateTicket,
  getTicketStats,
} from '../controllers/ticketsController.js';
import { authenticate } from '../middleware/auth.js';

export const ticketsRouter = Router();

ticketsRouter.get('/', authenticate, getTickets);
ticketsRouter.get('/stats', authenticate, getTicketStats);
ticketsRouter.post('/', authenticate, createTicket);
ticketsRouter.put('/:id', authenticate, updateTicket);

