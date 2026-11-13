import { GalleryAlbum } from '../models/GalleryAlbum.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { storageService } from '../services/storageService.js';
import { createCrudController } from './createCrudController.js';

export const albumCrud = createCrudController({
  Model: GalleryAlbum,
  entityName: 'Gallery Album',
  slugSourceField: 'title',
  imageField: 'coverImage',
  storageFolder: 'gallery',
  defaultSort: { displayOrder: 1, year: -1 },
  supportsReorder: true,
  filterBuilder: (query) => {
    const filters = {};
    if (query.category && query.category !== 'all') filters.category = query.category;
    if (query.year && query.year !== 'all') filters.year = query.year;
    return filters;
  },
});

export const imageCrud = createCrudController({
  Model: GalleryImage,
  entityName: 'Gallery Image',
  slugSourceField: 'title',
  imageField: 'imageUrl',
  storageFolder: 'gallery',
  defaultSort: { displayOrder: 1, createdAt: -1 },
  supportsReorder: true,
  filterBuilder: (query) => {
    const filters = {};
    if (query.albumId) filters.albumId = query.albumId;
    if (query.category && query.category !== 'all') filters.category = query.category;
    if (query.year && query.year !== 'all') filters.year = query.year;
    return filters;
  },
});

export const uploadGalleryImageDirect = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please attach a JPEG, PNG, or WebP photograph.');
  }

  const saved = await storageService.saveImage(req.file.buffer, 'gallery');
  const payload = {
    albumId: req.body.albumId || null,
    title: req.body.title || 'FCIT Gallery Photo',
    caption: req.body.caption || '',
    imageUrl: saved.url,
    altText: req.body.altText || req.body.title || 'FCIT department event photograph',
    category: req.body.category || 'Campus',
    year: req.body.year || String(new Date().getFullYear()),
    photographer: req.body.photographer || '',
    displayOrder: Number(req.body.displayOrder || 0),
    isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
  };

  const created = await GalleryImage.create(payload);
  res.status(201).json({ success: true, data: created });
});
