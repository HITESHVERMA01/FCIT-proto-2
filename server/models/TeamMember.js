import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    designation: { type: String, required: true, trim: true, maxlength: 160 },
    academicYear: { type: String, required: true, trim: true, index: true },
    department: {
      type: String,
      trim: true,
      default: 'Computer Science and Engineering',
    },
    introduction: { type: String, trim: true, default: '', maxlength: 500 },
    photo: { type: String, trim: true, default: '' },
    photoAlt: { type: String, trim: true, default: '' },
    photoPosition: {
      type: String,
      enum: ['object-top', 'object-center', 'object-bottom'],
      default: 'object-top',
    },
    linkedin: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    showEmailPublicly: { type: Boolean, default: false },
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
    collection: 'teamMembers',
  }
);

teamMemberSchema.index({ isPublished: 1, academicYear: 1, displayOrder: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
