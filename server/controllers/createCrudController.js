import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../utils/slugHelper.js';
import { storageService } from '../services/storageService.js';

const EDITOR_ROLES = new Set(['super_admin', 'admin', 'faculty', 'team_member']);

export function createCrudController({
  Model,
  entityName,
  slugSourceField = 'title',
  imageField = 'photo',
  storageFolder = 'general',
  defaultSort = { displayOrder: 1, createdAt: -1 },
  supportsReorder = false,
  filterBuilder = null,
  sanitizePublicItem = null,
}) {
  const list = asyncHandler(async (req, res) => {
    const canSeeDrafts =
      req.user &&
      EDITOR_ROLES.has(req.user.role) &&
      req.query.includeDrafts === 'true';

    const query = canSeeDrafts ? {} : { isPublished: true };
    if (filterBuilder) {
      Object.assign(query, filterBuilder(req.query));
    }

    const items = await Model.find(query).sort(defaultSort);
    const data =
      !canSeeDrafts && sanitizePublicItem
        ? items.map((doc) => sanitizePublicItem(doc.toObject()))
        : items;
    res.json({ success: true, data });
  });

  const getByIdOrSlug = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const item = await Model.findOne(query);
    if (!item) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    const canSeeDrafts = req.user && EDITOR_ROLES.has(req.user.role);
    if (!item.isPublished && !canSeeDrafts) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    const data =
      !canSeeDrafts && sanitizePublicItem ? sanitizePublicItem(item.toObject()) : item;
    res.json({ success: true, data });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = { ...req.validatedBody };
    if (Model.schema.path('slug')) {
      payload.slug = await createUniqueSlug(Model, payload[slugSourceField]);
    }
    const created = await Model.create(payload);
    res.status(201).json({ success: true, data: created });
  });

  const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    const payload = { ...req.validatedBody };
    if (
      Model.schema.path('slug') &&
      payload[slugSourceField] &&
      payload[slugSourceField] !== existing[slugSourceField]
    ) {
      payload.slug = await createUniqueSlug(
        Model,
        payload[slugSourceField],
        existing._id
      );
    }

    Object.assign(existing, payload);
    await existing.save();
    res.json({ success: true, data: existing });
  });

  const togglePublish = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    existing.isPublished =
      typeof req.body?.isPublished === 'boolean'
        ? req.body.isPublished
        : !existing.isPublished;
    await existing.save();
    res.json({ success: true, data: existing });
  });

  const reorder = asyncHandler(async (req, res) => {
    if (!supportsReorder) {
      throw new ApiError(400, `Reordering is not enabled for ${entityName}.`);
    }
    const { items } = req.validatedBody;
    const ops = items.map((entry) => ({
      updateOne: {
        filter: { _id: entry.id },
        update: { $set: { displayOrder: entry.displayOrder } },
      },
    }));
    await Model.bulkWrite(ops);
    res.json({ success: true, message: `${entityName} order updated.` });
  });

  const uploadPhoto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }
    if (!req.file) {
      throw new ApiError(400, 'Please attach a JPEG, PNG, or WebP image file.');
    }

    const oldUrl = existing[imageField];
    const saved = await storageService.saveImage(req.file.buffer, storageFolder);
    existing[imageField] = saved.url;
    await existing.save();

    if (oldUrl && oldUrl !== saved.url) {
      await storageService.deleteImage(oldUrl);
    }

    res.json({ success: true, data: existing });
  });

  const removePhoto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    const oldUrl = existing[imageField];
    existing[imageField] = '';
    await existing.save();

    if (oldUrl) {
      await storageService.deleteImage(oldUrl);
    }

    res.json({ success: true, data: existing });
  });

  const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }

    const oldUrl = imageField ? existing[imageField] : '';
    const extraImages = Array.isArray(existing.additionalImages)
      ? existing.additionalImages
      : [];
    await existing.deleteOne();
    if (oldUrl) {
      await storageService.deleteImage(oldUrl);
    }
    for (const url of extraImages) {
      await storageService.deleteImage(url);
    }

    res.json({ success: true, message: `${entityName} record deleted.` });
  });

  const updateVerification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }
    if (!Model.schema.path('verificationStatus')) {
      throw new ApiError(400, `Verification status is not enabled for ${entityName}.`);
    }
    existing.verificationStatus = req.validatedBody.verificationStatus;
    await existing.save();
    res.json({ success: true, data: existing });
  });

  const uploadAdditionalImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }
    if (!Array.isArray(existing.additionalImages)) {
      throw new ApiError(400, `Additional images are not enabled for ${entityName}.`);
    }
    if (!req.file) {
      throw new ApiError(400, 'Please attach a JPEG, PNG, or WebP image file.');
    }
    const saved = await storageService.saveImage(req.file.buffer, storageFolder);
    existing.additionalImages.push(saved.url);
    await existing.save();
    res.status(201).json({ success: true, data: existing });
  });

  const removeAdditionalImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const targetUrl = String(req.body?.url || req.query?.url || '').trim();
    const existing = await Model.findById(id);
    if (!existing) {
      throw new ApiError(404, `${entityName} record not found.`);
    }
    if (!targetUrl || !Array.isArray(existing.additionalImages)) {
      throw new ApiError(400, 'Image URL is required.');
    }
    existing.additionalImages = existing.additionalImages.filter((u) => u !== targetUrl);
    await existing.save();
    await storageService.deleteImage(targetUrl);
    res.json({ success: true, data: existing });
  });

  return {
    list,
    getByIdOrSlug,
    create,
    update,
    togglePublish,
    updateVerification,
    reorder,
    uploadPhoto,
    removePhoto,
    uploadAdditionalImage,
    removeAdditionalImage,
    remove,
  };
}
