import express from 'express';
import {
  requireAuth,
  optionalAuth,
  authorizeRoles,
} from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { reorderSchema, verificationStatusSchema } from '../validators/schemas.js';

export function createCrudRouter({
  controller,
  schema,
  writeRoles = ['super_admin', 'admin'],
  deleteRoles = ['super_admin', 'admin'],
  supportsReorder = false,
  supportsPhoto = false,
  supportsVerification = false,
  supportsAdditionalImages = false,
}) {
  const router = express.Router();

  router.get('/', optionalAuth, controller.list);

  if (supportsReorder) {
    router.patch(
      '/reorder',
      requireAuth,
      authorizeRoles(...writeRoles),
      validateBody(reorderSchema),
      controller.reorder
    );
  }

  router.get('/:idOrSlug', optionalAuth, controller.getByIdOrSlug);

  router.post(
    '/',
    requireAuth,
    authorizeRoles(...writeRoles),
    validateBody(schema),
    controller.create
  );

  router.put(
    '/:id',
    requireAuth,
    authorizeRoles(...writeRoles),
    validateBody(schema),
    controller.update
  );

  router.patch(
    '/:id/publish',
    requireAuth,
    authorizeRoles(...writeRoles),
    controller.togglePublish
  );

  if (supportsVerification) {
    router.patch(
      '/:id/verification',
      requireAuth,
      authorizeRoles(...writeRoles),
      validateBody(verificationStatusSchema),
      controller.updateVerification
    );
  }

  if (supportsPhoto) {
    router.post(
      '/:id/photo',
      requireAuth,
      authorizeRoles(...writeRoles),
      uploadSingleImage,
      controller.uploadPhoto
    );

    router.delete(
      '/:id/photo',
      requireAuth,
      authorizeRoles(...writeRoles),
      controller.removePhoto
    );
  }

  if (supportsAdditionalImages) {
    router.post(
      '/:id/additional-images',
      requireAuth,
      authorizeRoles(...writeRoles),
      uploadSingleImage,
      controller.uploadAdditionalImage
    );

    router.delete(
      '/:id/additional-images',
      requireAuth,
      authorizeRoles(...writeRoles),
      controller.removeAdditionalImage
    );
  }

  router.delete(
    '/:id',
    requireAuth,
    authorizeRoles(...deleteRoles),
    controller.remove
  );

  return router;
}
