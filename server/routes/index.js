import express from 'express';
import { Faculty } from '../models/Faculty.js';
import { TeamMember } from '../models/TeamMember.js';
import { HistoryMilestone } from '../models/HistoryMilestone.js';
import { Achievement } from '../models/Achievement.js';
import { Project } from '../models/Project.js';
import { Alumni } from '../models/Alumni.js';
import { Resource } from '../models/Resource.js';
import { Announcement } from '../models/Announcement.js';
import { createCrudController } from '../controllers/createCrudController.js';
import {
  getAdminOverview,
  listTeams,
  upsertTeamGroup,
} from '../controllers/adminController.js';
import { createCrudRouter } from './createCrudRouter.js';
import authRoutes from './authRoutes.js';
import eventRoutes from './eventRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import contactRoutes from './contactRoutes.js';
import { requireAuth, optionalAuth, authorizeRoles } from '../middleware/auth.js';
import {
  facultySchema,
  teamMemberSchema,
  historySchema,
  achievementSchema,
  projectSchema,
  alumniSchema,
  resourceSchema,
  announcementSchema,
} from '../validators/schemas.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'fcit-api',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);

// Admin overview & teams
router.get(
  '/admin/overview',
  requireAuth,
  authorizeRoles('super_admin', 'admin', 'faculty', 'team_member'),
  getAdminOverview
);
router.get('/teams', optionalAuth, listTeams);
router.put(
  '/teams',
  requireAuth,
  authorizeRoles('super_admin', 'admin', 'team_member'),
  upsertTeamGroup
);

// Faculty
router.use(
  '/faculty',
  createCrudRouter({
    controller: createCrudController({
      Model: Faculty,
      entityName: 'Faculty',
      slugSourceField: 'name',
      imageField: 'photo',
      storageFolder: 'faculty',
      defaultSort: { displayOrder: 1, name: 1 },
      supportsReorder: true,
    }),
    schema: facultySchema,
    writeRoles: ['super_admin', 'admin', 'faculty'],
    deleteRoles: ['super_admin', 'admin'],
    supportsReorder: true,
    supportsPhoto: true,
  })
);

// Team Members
router.use(
  '/team',
  createCrudRouter({
    controller: createCrudController({
      Model: TeamMember,
      entityName: 'Team Member',
      slugSourceField: 'name',
      imageField: 'photo',
      storageFolder: 'team',
      defaultSort: { displayOrder: 1, name: 1 },
      supportsReorder: true,
      filterBuilder: (query) =>
        query.academicYear && query.academicYear !== 'all'
          ? { academicYear: query.academicYear }
          : {},
      sanitizePublicItem: (doc) => {
        if (!doc.showEmailPublicly) {
          return { ...doc, email: '' };
        }
        return doc;
      },
    }),
    schema: teamMemberSchema,
    writeRoles: ['super_admin', 'admin', 'team_member'],
    deleteRoles: ['super_admin', 'admin'],
    supportsReorder: true,
    supportsPhoto: true,
  })
);

// History Archive
router.use(
  '/history',
  createCrudRouter({
    controller: createCrudController({
      Model: HistoryMilestone,
      entityName: 'History Milestone',
      slugSourceField: 'title',
      imageField: 'primaryImage',
      storageFolder: 'history',
      defaultSort: { displayOrder: 1, createdAt: 1 },
      supportsReorder: true,
    }),
    schema: historySchema,
    writeRoles: ['super_admin', 'admin', 'faculty', 'team_member'],
    deleteRoles: ['super_admin', 'admin'],
    supportsReorder: true,
    supportsPhoto: true,
    supportsVerification: true,
    supportsAdditionalImages: true,
  })
);

// Achievements
router.use(
  '/achievements',
  createCrudRouter({
    controller: createCrudController({
      Model: Achievement,
      entityName: 'Achievement',
      slugSourceField: 'title',
      imageField: 'image',
      storageFolder: 'achievements',
      defaultSort: { year: -1, createdAt: -1 },
      filterBuilder: (query) =>
        query.category && query.category !== 'all'
          ? { category: query.category }
          : {},
    }),
    schema: achievementSchema,
    writeRoles: ['super_admin', 'admin', 'faculty', 'team_member'],
    supportsPhoto: true,
  })
);

// Projects
router.use(
  '/projects',
  createCrudRouter({
    controller: createCrudController({
      Model: Project,
      entityName: 'Project',
      slugSourceField: 'title',
      imageField: 'thumbnail',
      storageFolder: 'projects',
      defaultSort: { year: -1, createdAt: -1 },
    }),
    schema: projectSchema,
    writeRoles: ['super_admin', 'admin', 'faculty', 'team_member'],
    supportsPhoto: true,
  })
);

// Alumni
router.use(
  '/alumni',
  createCrudRouter({
    controller: createCrudController({
      Model: Alumni,
      entityName: 'Alumni',
      slugSourceField: 'name',
      imageField: 'photo',
      storageFolder: 'alumni',
      defaultSort: { graduationYear: -1, name: 1 },
    }),
    schema: alumniSchema,
    writeRoles: ['super_admin', 'admin', 'faculty'],
    supportsPhoto: true,
  })
);

// Learning Resources
router.use(
  '/resources',
  createCrudRouter({
    controller: createCrudController({
      Model: Resource,
      entityName: 'Learning Resource',
      slugSourceField: 'title',
      imageField: '',
      defaultSort: { category: 1, createdAt: -1 },
      filterBuilder: (query) =>
        query.category && query.category !== 'all'
          ? { category: query.category }
          : {},
    }),
    schema: resourceSchema,
    writeRoles: ['super_admin', 'admin', 'faculty', 'team_member'],
  })
);

// Announcements
router.use(
  '/announcements',
  createCrudRouter({
    controller: createCrudController({
      Model: Announcement,
      entityName: 'Announcement',
      slugSourceField: 'title',
      imageField: '',
      defaultSort: { priority: -1, createdAt: -1 },
    }),
    schema: announcementSchema,
    writeRoles: ['super_admin', 'admin', 'faculty', 'team_member'],
  })
);

export default router;
