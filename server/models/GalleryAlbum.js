import mongoose from 'mongoose';

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: String, required: true, trim: true, maxlength: 20 },
    description: { type: String, trim: true, default: '' },
    coverImage: { type: String, trim: true, default: '' },
    coverImageAlt: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    isPublished: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    collection: 'galleryAlbums',
  }
);

export const GalleryAlbum = mongoose.model('GalleryAlbum', galleryAlbumSchema);
