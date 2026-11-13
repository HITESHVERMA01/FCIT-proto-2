import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCrudController } from './createCrudController.js';

export const eventCrud = createCrudController({
  Model: Event,
  entityName: 'Event',
  slugSourceField: 'title',
  imageField: 'poster',
  storageFolder: 'events',
  defaultSort: { date: -1 },
  filterBuilder: (query) => {
    const filters = {};
    if (query.status && query.status !== 'all') {
      filters.status = query.status;
    }
    if (query.category && query.category !== 'all') {
      filters.category = query.category;
    }
    return filters;
  },
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOne({ _id: id, isPublished: true });
  if (!event) {
    throw new ApiError(404, 'Event not found or not open for registration.');
  }

  if (event.status === 'completed' || event.status === 'draft') {
    throw new ApiError(400, 'Registration for this event is no longer open.');
  }

  if (
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline)
  ) {
    throw new ApiError(400, 'The registration deadline for this event has passed.');
  }

  if (event.capacity > 0) {
    const currentCount = await EventRegistration.countDocuments({
      eventId: event._id,
      status: { $ne: 'cancelled' },
    });
    if (currentCount >= event.capacity) {
      throw new ApiError(400, 'This event has reached full capacity.');
    }
  }

  const registration = await EventRegistration.create({
    eventId: event._id,
    ...req.validatedBody,
  });

  res.status(201).json({
    success: true,
    message: `Registration confirmed for ${event.title}.`,
    data: registration,
  });
});

export const listEventRegistrations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const registrations = await EventRegistration.find({ eventId: id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, data: registrations });
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { regId } = req.params;
  const { status } = req.body;
  if (!['registered', 'attended', 'cancelled'].includes(status)) {
    throw new ApiError(400, 'Invalid registration status.');
  }

  const record = await EventRegistration.findByIdAndUpdate(
    regId,
    { status },
    { new: true }
  );
  if (!record) {
    throw new ApiError(404, 'Registration record not found.');
  }

  res.json({ success: true, data: record });
});
