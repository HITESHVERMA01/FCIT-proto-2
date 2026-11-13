import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['workshop', 'hackathon', 'seminar', 'contest', 'community', 'symposium'],
      default: 'workshop',
    },
    poster: { type: String, trim: true, default: '' },
    posterAlt: { type: String, trim: true, default: '' },
    date: { type: Date, required: true, index: true },
    endDate: { type: Date, default: null },
    venue: { type: String, required: true, trim: true, maxlength: 200 },
    summary: { type: String, required: true, trim: true, maxlength: 360 },
    description: { type: String, required: true, trim: true },
    registrationLink: { type: String, trim: true, default: '' },
    registrationDeadline: { type: Date, default: null },
    capacity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'draft'],
      default: 'upcoming',
      index: true,
    },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'events',
  }
);

eventSchema.index({ isPublished: 1, status: 1, date: -1 });

export const Event = mongoose.model('Event', eventSchema);
