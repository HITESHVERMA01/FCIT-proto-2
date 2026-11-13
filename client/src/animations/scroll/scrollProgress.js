/**
 * Pure Normalized Scroll Progress Calculators
 * Operates exclusively on pre-measured coordinates during ScrollDirector read phase.
 */

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value) {
  return clamp(value, 0, 1);
}

/**
 * Normalized progress [0..1] over the entire scrollable document height
 */
export function computeGlobalProgress(scrollY, scrollHeight, viewportHeight) {
  const maxScroll = Math.max(scrollHeight - viewportHeight, 1);
  return clamp01(scrollY / maxScroll);
}

/**
 * Normalized progress [0..1] over a pixel scroll distance (e.g. hero / early bowl zone)
 */
export function computeDistanceProgress(scrollY, distancePx) {
  return clamp01(scrollY / Math.max(distancePx, 1));
}

/**
 * Normalized element scroll progress [0..1] using pre-read bounding rect
 * @param {DOMRect} rect
 * @param {number} viewportHeight
 * @param {number} startOffsetFactor Factor of viewportHeight when progress=0 (default 0.9 = near bottom)
 * @param {number} endOffsetFactor Factor of viewportHeight when progress=1 (default 0.15 = near top)
 */
export function computeElementProgress(
  rect,
  viewportHeight,
  startOffsetFactor = 0.9,
  endOffsetFactor = 0.15
) {
  if (!rect || viewportHeight <= 0) return 0;
  const startY = viewportHeight * startOffsetFactor;
  const endY = viewportHeight * endOffsetFactor;
  const travel = Math.max(startY - endY, 1);
  return clamp01((startY - rect.top) / travel);
}

/**
 * Normalized sticky runway progress [0..1] for pinned desktop statement sections
 */
export function computeStickyRunwayProgress(
  rect,
  viewportHeight,
  isDesktop = true
) {
  if (!rect || viewportHeight <= 0) return 0;
  if (!isDesktop) {
    const startY = viewportHeight * 0.84;
    const endY = viewportHeight * 0.24;
    return clamp01((startY - rect.top) / Math.max(startY - endY, 1));
  }

  const startTop = viewportHeight * 0.56;
  const scrollableSpan = Math.max(rect.height - viewportHeight, viewportHeight * 0.35);
  const endTop = -scrollableSpan * 0.78;
  return clamp01((startTop - rect.top) / Math.max(startTop - endTop, 1));
}
