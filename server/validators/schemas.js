import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (val) => val === '' || /^https?:\/\/.+/i.test(val) || val.startsWith('/'),
    'Must be a valid http/https URL or relative path.'
  )
  .optional()
  .default('');

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(120),
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128),
  role: z.enum(['student', 'visitor']).optional().default('student'),
});

export const userRoleUpdateSchema = z.object({
  role: z.enum([
    'super_admin',
    'admin',
    'faculty',
    'team_member',
    'student',
    'visitor',
  ]),
  isActive: z.boolean().optional(),
});

export const facultySchema = z.object({
  name: z.string().trim().min(2).max(160),
  designation: z.string().trim().min(2).max(160),
  department: z.string().trim().max(180).optional().default('Department of Computer Science and Engineering'),
  qualifications: z
    .union([z.array(z.string().trim()), z.string()])
    .optional()
    .default([])
    .transform((v) =>
      Array.isArray(v)
        ? v.map((s) => s.trim()).filter(Boolean)
        : String(v || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
    ),
  expertise: z.array(z.string().trim()).optional().default([]),
  photo: optionalUrl,
  photoAlt: z.string().trim().max(240).optional().default(''),
  photoPosition: z
    .enum(['object-top', 'object-center', 'object-bottom'])
    .optional()
    .default('object-top'),
  profileUrl: optionalUrl,
  verificationStatus: z
    .enum(['verified', 'pending_verification', 'draft'])
    .optional()
    .default('verified'),
  displayOrder: z.coerce.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(160),
  designation: z.string().trim().min(2).max(160),
  academicYear: z.string().trim().min(4).max(40),
  department: z.string().trim().max(160).optional().default('Computer Science and Engineering'),
  introduction: z.string().trim().max(500).optional().default(''),
  photo: optionalUrl,
  photoAlt: z.string().trim().max(240).optional().default(''),
  photoPosition: z
    .enum(['object-top', 'object-center', 'object-bottom'])
    .optional()
    .default('object-top'),
  linkedin: optionalUrl,
  github: optionalUrl,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email.')
    .optional()
    .default(''),
  showEmailPublicly: z.boolean().optional().default(false),
  verificationStatus: z
    .enum(['verified', 'pending_verification', 'draft'])
    .optional()
    .default('verified'),
  displayOrder: z.coerce.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z
    .enum(['workshop', 'hackathon', 'seminar', 'contest', 'community', 'symposium'])
    .default('workshop'),
  poster: optionalUrl,
  posterAlt: z.string().trim().max(240).optional().default(''),
  date: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  venue: z.string().trim().min(2).max(200),
  summary: z.string().trim().min(10).max(360),
  description: z.string().trim().min(15),
  registrationLink: optionalUrl,
  registrationDeadline: z.coerce.date().nullable().optional(),
  capacity: z.coerce.number().int().min(0).optional().default(0),
  status: z
    .enum(['upcoming', 'ongoing', 'completed', 'draft'])
    .optional()
    .default('upcoming'),
  isPublished: z.boolean().optional().default(false),
});

export const eventRegistrationSchema = z.object({
  studentName: z.string().trim().min(2, 'Enter your full name.').max(140),
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  rollNumber: z.string().trim().min(3, 'Enter your university roll number.').max(40),
  branch: z.string().trim().min(2, 'Select or enter your branch.').max(80),
  year: z.string().trim().min(1, 'Select your academic year.').max(20),
  notes: z.string().trim().max(500).optional().default(''),
});

export const historySchema = z.object({
  year: z
    .union([z.string(), z.number()])
    .transform((v) => String(v).trim())
    .refine((v) => v.length >= 2 && v.length <= 40, 'Enter a valid year or era label.'),
  title: z.string().trim().min(3).max(200),
  shortTitle: z.string().trim().max(80).optional().default(''),
  category: z.string().trim().min(2).max(100),
  layoutVariant: z
    .enum(['auto', 'full-bleed', 'studio-split', 'collage', 'emblem-seal', 'archival-draft'])
    .optional()
    .default('auto'),
  description: z.string().trim().min(10),
  primaryImage: optionalUrl,
  primaryImageAlt: z.string().trim().max(240).optional().default(''),
  additionalImages: z.array(z.string().trim()).optional().default([]),
  highlights: z.array(z.string().trim()).optional().default([]),
  relatedEvents: z.array(z.string().trim()).optional().default([]),
  relatedEventIds: z
    .array(z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ObjectId'))
    .optional()
    .default([]),
  contributors: z.array(z.string().trim()).optional().default([]),
  historicalSource: z.string().trim().max(240).optional().default(''),
  verificationStatus: z
    .enum(['verified', 'pending_verification', 'draft'])
    .optional()
    .default('pending_verification'),
  displayOrder: z.coerce.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const verificationStatusSchema = z.object({
  verificationStatus: z.enum(['verified', 'pending_verification', 'draft']),
});

export const galleryAlbumSchema = z.object({
  title: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(80),
  year: z.string().trim().min(2).max(20),
  description: z.string().trim().max(600).optional().default(''),
  coverImage: optionalUrl,
  coverImageAlt: z.string().trim().max(240).optional().default(''),
  displayOrder: z.coerce.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const galleryImageSchema = z.object({
  albumId: z.string().trim().nullable().optional(),
  title: z.string().trim().min(2).max(180),
  caption: z.string().trim().max(400).optional().default(''),
  imageUrl: z.string().trim().min(1, 'Image path is required.'),
  altText: z.string().trim().min(3).max(240),
  category: z.string().trim().min(2).max(80),
  year: z.string().trim().min(2).max(20),
  photographer: z.string().trim().max(120).optional().default(''),
  displayOrder: z.coerce.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z
    .enum(['hackathon', 'competition', 'research', 'publication', 'initiative'])
    .default('hackathon'),
  year: z.string().trim().min(2).max(20),
  dateLabel: z.string().trim().max(80).optional().default(''),
  recipients: z.array(z.string().trim()).optional().default([]),
  summary: z.string().trim().min(10).max(400),
  details: z.string().trim().optional().default(''),
  proofUrl: optionalUrl,
  image: optionalUrl,
  imageAlt: z.string().trim().max(240).optional().default(''),
  verificationStatus: z
    .enum(['verified', 'pending_verification', 'draft'])
    .optional()
    .default('verified'),
  isPublished: z.boolean().optional().default(false),
});

export const projectSchema = z.object({
  title: z.string().trim().min(3).max(200),
  domain: z.string().trim().min(2).max(100),
  techStack: z.array(z.string().trim()).optional().default([]),
  authors: z.array(z.string().trim()).optional().default([]),
  year: z.string().trim().min(2).max(20),
  summary: z.string().trim().min(10).max(420),
  repositoryUrl: optionalUrl,
  demoUrl: optionalUrl,
  thumbnail: optionalUrl,
  thumbnailAlt: z.string().trim().max(240).optional().default(''),
  status: z.enum(['active', 'completed', 'research']).default('active'),
  isPublished: z.boolean().optional().default(false),
});

export const alumniSchema = z.object({
  name: z.string().trim().min(2).max(160),
  graduationYear: z.string().trim().min(2).max(20),
  degree: z.string().trim().max(120).optional().default('B.Tech CSE / IT'),
  currentRole: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(160),
  location: z.string().trim().max(120).optional().default(''),
  mentorshipAreas: z.array(z.string().trim()).optional().default([]),
  story: z.string().trim().max(800).optional().default(''),
  photo: optionalUrl,
  photoAlt: z.string().trim().max(240).optional().default(''),
  linkedin: optionalUrl,
  verificationStatus: z
    .enum(['verified', 'pending_verification', 'draft'])
    .optional()
    .default('verified'),
  isPublished: z.boolean().optional().default(false),
});

export const resourceSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z
    .enum(['dsa', 'roadmap', 'workshop', 'notes', 'placement', 'reference'])
    .default('dsa'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
  description: z.string().trim().min(10).max(500),
  resourceUrl: optionalUrl,
  fileUrl: optionalUrl,
  contributor: z.string().trim().max(140).optional().default(''),
  tags: z.array(z.string().trim()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(5).max(400),
  category: z.enum(['notice', 'recruitment', 'event', 'academic']).default('notice'),
  linkUrl: optionalUrl,
  priority: z.coerce.number().int().optional().default(0),
  expiresAt: z.coerce.date().nullable().optional(),
  isPublished: z.boolean().optional().default(false),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please provide your name.').max(140),
  email: z.string().trim().email('Please provide a valid email address.').toLowerCase(),
  subject: z.string().trim().min(3, 'Please enter a concise subject.').max(200),
  category: z
    .enum(['general', 'events', 'faculty', 'collaboration', 'alumni', 'resources'])
    .optional()
    .default('general'),
  message: z
    .string()
    .trim()
    .min(10, 'Message should contain at least 10 characters.')
    .max(2500),
});

export const reorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        displayOrder: z.coerce.number().int(),
      })
    )
    .min(1),
});
