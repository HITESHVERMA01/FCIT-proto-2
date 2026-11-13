import { Faculty } from '../models/Faculty.js';
import { TeamMember } from '../models/TeamMember.js';
import { TeamGroup } from '../models/TeamGroup.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { HistoryMilestone } from '../models/HistoryMilestone.js';
import { GalleryAlbum } from '../models/GalleryAlbum.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { Achievement } from '../models/Achievement.js';
import { Project } from '../models/Project.js';
import { Alumni } from '../models/Alumni.js';
import { Resource } from '../models/Resource.js';
import { Announcement } from '../models/Announcement.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [
    facultyCount,
    teamCount,
    eventCount,
    registrationCount,
    historyCount,
    albumCount,
    galleryImageCount,
    achievementCount,
    projectCount,
    alumniCount,
    resourceCount,
    announcementCount,
    unreadMessagesCount,
    recentEvents,
    recentMessages,
    recentRegistrations,
  ] = await Promise.all([
    Faculty.countDocuments(),
    TeamMember.countDocuments(),
    Event.countDocuments(),
    EventRegistration.countDocuments(),
    HistoryMilestone.countDocuments(),
    GalleryAlbum.countDocuments(),
    GalleryImage.countDocuments(),
    Achievement.countDocuments(),
    Project.countDocuments(),
    Alumni.countDocuments(),
    Resource.countDocuments(),
    Announcement.countDocuments(),
    ContactMessage.countDocuments({ status: 'new' }),
    Event.find().sort({ updatedAt: -1 }).limit(5).select('title status isPublished date updatedAt'),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).select('name subject status category createdAt'),
    EventRegistration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('eventId', 'title'),
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        faculty: facultyCount,
        team: teamCount,
        events: eventCount,
        registrations: registrationCount,
        history: historyCount,
        albums: albumCount,
        galleryImages: galleryImageCount,
        achievements: achievementCount,
        projects: projectCount,
        alumni: alumniCount,
        resources: resourceCount,
        announcements: announcementCount,
        unreadMessages: unreadMessagesCount,
      },
      recentActivity: {
        events: recentEvents,
        messages: recentMessages,
        registrations: recentRegistrations,
      },
    },
  });
});

export const listTeams = asyncHandler(async (req, res) => {
  const canSeeDrafts =
    req.user &&
    ['super_admin', 'admin', 'faculty', 'team_member'].includes(req.user.role) &&
    req.query.includeDrafts === 'true';

  const query = canSeeDrafts ? {} : { isPublished: true };
  const teams = await TeamGroup.find(query)
    .populate('members')
    .sort({ academicYear: -1 });
  res.json({ success: true, data: teams });
});

export const upsertTeamGroup = asyncHandler(async (req, res) => {
  const { academicYear, title, description, isCurrent, members, isPublished } = req.body;
  const updated = await TeamGroup.findOneAndUpdate(
    { academicYear },
    { academicYear, title, description, isCurrent, members, isPublished },
    { upsert: true, new: true, runValidators: true }
  ).populate('members');
  res.json({ success: true, data: updated });
});
