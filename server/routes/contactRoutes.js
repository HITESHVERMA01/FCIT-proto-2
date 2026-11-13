import express from 'express';
import {
  submitContactMessage,
  listContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import { contactSchema } from '../validators/schemas.js';

const router = express.Router();

router.post(
  '/',
  publicWriteLimiter,
  validateBody(contactSchema),
  submitContactMessage
);

router.get(
  '/',
  requireAuth,
  authorizeRoles('super_admin', 'admin', 'faculty', 'team_member'),
  listContactMessages
);

router.patch(
  '/:id',
  requireAuth,
  authorizeRoles('super_admin', 'admin', 'team_member'),
  updateContactMessageStatus
);

router.delete(
  '/:id',
  requireAuth,
  authorizeRoles('super_admin', 'admin'),
  deleteContactMessage
);

export default router;
