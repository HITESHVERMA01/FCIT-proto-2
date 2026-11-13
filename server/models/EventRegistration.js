import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    studentName: { type: String, required: true, trim: true, maxlength: 140 },
    email: { type: String, required: true, lowercase: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, maxlength: 40 },
    branch: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: String, required: true, trim: true, maxlength: 20 },
    notes: { type: String, trim: true, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
  },
  {
    timestamps: true,
    collection: 'eventRegistrations',
  }
);

eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const EventRegistration = mongoose.model(
  'EventRegistration',
  eventRegistrationSchema
);
