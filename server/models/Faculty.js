import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    designation: { type: String, required: true, trim: true, maxlength: 160 },
    department: {
      type: String,
      trim: true,
      default: 'Department of Computer Science and Engineering',
    },
    qualifications: [{ type: String, trim: true }],
    expertise: [{ type: String, trim: true }],
    photo: { type: String, trim: true, default: '' },
    photoAlt: { type: String, trim: true, default: '' },
    photoPosition: {
      type: String,
      enum: ['object-top', 'object-center', 'object-bottom'],
      default: 'object-top',
    },
    profileUrl: { type: String, trim: true, default: '' },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending_verification', 'draft'],
      default: 'verified',
    },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'faculty',
  }
);

facultySchema.index({ isPublished: 1, displayOrder: 1 });

export const Faculty = mongoose.model('Faculty', facultySchema);
