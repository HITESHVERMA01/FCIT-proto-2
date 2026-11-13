import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    category: {
      type: String,
      enum: ['notice', 'recruitment', 'event', 'academic'],
      default: 'notice',
    },
    linkUrl: { type: String, trim: true, default: '' },
    priority: { type: Number, default: 0, index: true },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'announcements',
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
