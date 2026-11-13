import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function signSessionToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function setSessionCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account is currently deactivated.');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signSessionToken(user);
  setSessionCookie(res, token);

  res.json({
    success: true,
    data: {
      user: user.toJSON(),
    },
  });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.validatedBody;
  const existing = await User.exists({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  // Public registration can never escalate above student or visitor
  const safeRole = role === 'visitor' ? 'visitor' : 'student';

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: safeRole,
  });

  const token = signSessionToken(user);
  setSessionCookie(res, token);

  res.status(201).json({
    success: true,
    data: {
      user: user.toJSON(),
    },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProd,
    path: '/',
  });
  res.json({ success: true, message: 'Signed out cleanly.' });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user.toJSON() },
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.validatedBody;

  const target = await User.findById(id);
  if (!target) {
    throw new ApiError(404, 'User account not found.');
  }

  if (target._id.equals(req.user._id) && role !== 'super_admin') {
    throw new ApiError(400, 'You cannot downgrade your own Super Admin role.');
  }

  target.role = role;
  if (typeof isActive === 'boolean') {
    target.isActive = isActive;
  }
  await target.save();

  res.json({ success: true, data: target.toJSON() });
});
