import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    domain: { type: String, required: true, trim: true, maxlength: 100 },
    techStack: [{ type: String, trim: true }],
    authors: [{ type: String, trim: true }],
    year: { type: String, required: true, trim: true, maxlength: 20 },
    summary: { type: String, required: true, trim: true, maxlength: 420 },
    repositoryUrl: { type: String, trim: true, default: '' },
    demoUrl: { type: String, trim: true, default: '' },
    thumbnail: { type: String, trim: true, default: '' },
    thumbnailAlt: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['active', 'completed', 'research'],
      default: 'active',
    },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

export const Project = mongoose.model('Project', projectSchema);
