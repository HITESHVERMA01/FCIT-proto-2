import slugify from 'slugify';
import crypto from 'node:crypto';

export async function createUniqueSlug(Model, sourceText, existingId = null) {
  const base =
    slugify(String(sourceText || 'item'), {
      lower: true,
      strict: true,
      trim: true,
    }) || 'item';

  let candidate = base;
  let attempt = 0;

  while (attempt < 6) {
    const query = existingId
      ? { slug: candidate, _id: { $ne: existingId } }
      : { slug: candidate };
    const found = await Model.exists(query);
    if (!found) return candidate;
    attempt += 1;
    candidate = `${base}-${crypto.randomBytes(2).toString('hex')}`;
  }

  return `${base}-${Date.now()}`;
}
