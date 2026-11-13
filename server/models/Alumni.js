import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    graduationYear: { type: String, required: true, trim: true, maxlength: 20 },
    degree: { type: String, trim: true, default: 'B.Tech CSE / IT' },
    currentRole: { type: String, required: true, trim: true, maxlength: 160 },
    organization: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, trim: true, default: '' },
    mentorshipAreas: [{ type: String, trim: true }],
    story: { type: String, trim: true, default: '', maxlength: 800 },
    photo: { type: String, trim: true, default: '' },
    photoAlt: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending_verification', 'draft'],
      default: 'verified',
    },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'alumni',
  }
);

export const Alumni = mongoose.model('Alumni', alumniSchema);
