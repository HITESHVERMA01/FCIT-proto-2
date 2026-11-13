import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['hackathon', 'competition', 'research', 'publication', 'initiative'],
      default: 'hackathon',
      index: true,
    },
    year: { type: String, required: true, trim: true, maxlength: 20 },
    dateLabel: { type: String, trim: true, default: '' },
    recipients: [{ type: String, trim: true }],
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    details: { type: String, trim: true, default: '' },
    proofUrl: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    imageAlt: { type: String, trim: true, default: '' },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending_verification', 'draft'],
      default: 'verified',
    },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'achievements',
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
