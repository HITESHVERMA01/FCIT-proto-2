import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['dsa', 'roadmap', 'workshop', 'notes', 'placement', 'reference'],
      default: 'dsa',
      index: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    resourceUrl: { type: String, trim: true, default: '' },
    fileUrl: { type: String, trim: true, default: '' },
    contributor: { type: String, trim: true, default: '' },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'resources',
  }
);

export const Resource = mongoose.model('Resource', resourceSchema);
