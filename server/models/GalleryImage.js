import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GalleryAlbum',
      default: null,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    caption: { type: String, trim: true, default: '', maxlength: 400 },
    imageUrl: { type: String, required: true, trim: true },
    altText: { type: String, required: true, trim: true, maxlength: 240 },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    year: { type: String, required: true, trim: true, maxlength: 20, index: true },
    photographer: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'galleryImages',
  }
);

export const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
