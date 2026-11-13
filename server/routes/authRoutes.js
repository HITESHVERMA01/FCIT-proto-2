import express from 'express';
import {
  login,
  register,
  logout,
  getCurrentUser,
  listUsers,
  updateUserRole,
} from '../controllers/authController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  loginSchema,
  registerSchema,
  userRoleUpdateSchema,
} from '../validators/schemas.js';

const router = express.Router();

router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/logout', logout);
router.get('/me', requireAuth, getCurrentUser);

router.get('/users', requireAuth, authorizeRoles('super_admin'), listUsers);
router.patch(
  '/users/:id/role',
  requireAuth,
  authorizeRoles('super_admin'),
  validateBody(userRoleUpdateSchema),
  updateUserRole
);

export default router;
