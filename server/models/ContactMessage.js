import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      enum: ['general', 'events', 'faculty', 'collaboration', 'alumni', 'resources'],
      default: 'general',
    },
    message: { type: String, required: true, trim: true, maxlength: 2500 },
    status: {
      type: String,
      enum: ['new', 'in_review', 'resolved'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    collection: 'contactMessages',
  }
);

export const ContactMessage = mongoose.model(
  'ContactMessage',
  contactMessageSchema
);
