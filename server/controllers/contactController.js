import { ContactMessage } from '../models/ContactMessage.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendContactNotification } from '../services/emailService.js';

export const submitContactMessage = asyncHandler(async (req, res) => {
  const created = await ContactMessage.create(req.validatedBody);
  const delivery = await sendContactNotification(created);

  res.status(201).json({
    success: true,
    message: 'Your message has been recorded for the FCIT team.',
    data: {
      id: created._id,
      deliveryChannel: delivery.channel,
    },
  });
});

export const listContactMessages = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }
  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
});

export const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (status && !['new', 'in_review', 'resolved'].includes(status)) {
    throw new ApiError(400, 'Invalid status value.');
  }

  const record = await ContactMessage.findById(id);
  if (!record) {
    throw new ApiError(404, 'Contact message not found.');
  }

  if (status) record.status = status;
  if (typeof adminNotes === 'string') record.adminNotes = adminNotes.trim();
  await record.save();

  res.json({ success: true, data: record });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Contact message not found.');
  }
  res.json({ success: true, message: 'Contact message removed.' });
});
