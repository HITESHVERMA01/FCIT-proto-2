import mongoose from 'mongoose';

const historyMilestoneSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true, maxlength: 40 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    shortTitle: { type: String, trim: true, maxlength: 80, default: '' },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    layoutVariant: {
      type: String,
      enum: ['auto', 'full-bleed', 'studio-split', 'collage', 'emblem-seal', 'archival-draft'],
      default: 'auto',
    },
    description: { type: String, required: true, trim: true },
    primaryImage: { type: String, trim: true, default: '' },
    primaryImageAlt: { type: String, trim: true, default: '' },
    additionalImages: [{ type: String, trim: true }],
    highlights: [{ type: String, trim: true }],
    relatedEvents: [{ type: String, trim: true }],
    relatedEventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    contributors: [{ type: String, trim: true }],
    historicalSource: { type: String, trim: true, default: '' },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending_verification', 'draft'],
      default: 'pending_verification',
      index: true,
    },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'history',
  }
);

historyMilestoneSchema.index({ isPublished: 1, verificationStatus: 1, displayOrder: 1 });

export const HistoryMilestone = mongoose.model(
  'HistoryMilestone',
  historyMilestoneSchema
);
