import express from 'express';
import {
  eventCrud,
  registerForEvent,
  listEventRegistrations,
  updateRegistrationStatus,
} from '../controllers/eventController.js';
import {
  requireAuth,
  optionalAuth,
  authorizeRoles,
} from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import { eventSchema, eventRegistrationSchema } from '../validators/schemas.js';

const router = express.Router();
const WRITE_ROLES = ['super_admin', 'admin', 'faculty', 'team_member'];

router.get('/', optionalAuth, eventCrud.list);
router.get('/:idOrSlug', optionalAuth, eventCrud.getByIdOrSlug);

router.post(
  '/:id/register',
  publicWriteLimiter,
  validateBody(eventRegistrationSchema),
  registerForEvent
);

router.get(
  '/:id/registrations',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  listEventRegistrations
);

router.patch(
  '/registrations/:regId/status',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  updateRegistrationStatus
);

router.post(
  '/',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(eventSchema),
  eventCrud.create
);

router.put(
  '/:id',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(eventSchema),
  eventCrud.update
);

router.patch(
  '/:id/publish',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  eventCrud.togglePublish
);

router.post(
  '/:id/photo',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  uploadSingleImage,
  eventCrud.uploadPhoto
);

router.delete(
  '/:id/photo',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  eventCrud.removePhoto
);

router.delete(
  '/:id',
  requireAuth,
  authorizeRoles('super_admin', 'admin'),
  eventCrud.remove
);

export default router;
