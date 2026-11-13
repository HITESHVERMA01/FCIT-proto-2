import mongoose from 'mongoose';

const teamGroupSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    isCurrent: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' }],
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'teams',
  }
);

export const TeamGroup = mongoose.model('TeamGroup', teamGroupSchema);
