import express from 'express';
import {
  albumCrud,
  imageCrud,
  uploadGalleryImageDirect,
} from '../controllers/galleryController.js';
import {
  requireAuth,
  optionalAuth,
  authorizeRoles,
} from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { uploadSingleImage } from '../middleware/upload.js';
import {
  galleryAlbumSchema,
  galleryImageSchema,
  reorderSchema,
} from '../validators/schemas.js';

const router = express.Router();
const WRITE_ROLES = ['super_admin', 'admin', 'team_member'];

// Albums
router.get('/albums', optionalAuth, albumCrud.list);
router.patch(
  '/albums/reorder',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(reorderSchema),
  albumCrud.reorder
);
router.post(
  '/albums',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(galleryAlbumSchema),
  albumCrud.create
);
router.put(
  '/albums/:id',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(galleryAlbumSchema),
  albumCrud.update
);
router.patch(
  '/albums/:id/publish',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  albumCrud.togglePublish
);
router.post(
  '/albums/:id/photo',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  uploadSingleImage,
  albumCrud.uploadPhoto
);
router.delete(
  '/albums/:id',
  requireAuth,
  authorizeRoles('super_admin', 'admin'),
  albumCrud.remove
);

// Images
router.get('/images', optionalAuth, imageCrud.list);
router.post(
  '/images/upload',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  uploadSingleImage,
  uploadGalleryImageDirect
);
router.post(
  '/images',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  validateBody(galleryImageSchema),
  imageCrud.create
);
router.patch(
  '/images/:id/publish',
  requireAuth,
  authorizeRoles(...WRITE_ROLES),
  imageCrud.togglePublish
);
router.delete(
  '/images/:id',
  requireAuth,
  authorizeRoles('super_admin', 'admin', 'team_member'),
  imageCrud.remove
);

export default router;
