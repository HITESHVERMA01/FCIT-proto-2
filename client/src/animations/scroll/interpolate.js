/**
 * Smooth Interpolation, Easing & Color Blending Utilities
 * Weighted deceleration matches cubic-bezier(0.22, 0.7, 0.2, 1)
 */

import { clamp01 } from './scrollProgress';

export function lerp(start, end, t) {
  return start + (end - start) * clamp01(t);
}

/**
 * Smooth weighted deceleration curve approximating cubic-bezier(0.22, 0.7, 0.2, 1)
 * Avoids heavy Newton-Raphson solving per letter while keeping identical motion feel.
 */
export function easeDecel(t) {
  const x = clamp01(t);
  const inv = 1 - x;
  return 1 - inv * inv * inv;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / Math.max(edge1 - edge0, 1e-6));
  return t * t * (3 - 2 * t);
}

/**
 * Sample a multi-stop keyframe array with smooth deceleration interpolation
 * between numeric keys.
 * @param {number} progress Normalized [0..1]
 * @param {Array<Record<string, number>>} track Sorted by `p`
 */
export function sampleKeyframeTrack(progress, track) {
  const p = clamp01(progress);
  if (!track || track.length === 0) return {};
  if (p <= track[0].p) return { ...track[0] };
  const last = track[track.length - 1];
  if (p >= last.p) return { ...last };

  let low = track[0];
  let high = last;
  for (let i = 0; i < track.length - 1; i += 1) {
    if (p >= track[i].p && p <= track[i + 1].p) {
      low = track[i];
      high = track[i + 1];
      break;
    }
  }

  const localT = (p - low.p) / Math.max(high.p - low.p, 1e-6);
  const eased = smoothstep(0, 1, localT);
  const result = { p };

  const keys = Object.keys(low);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key === 'p') continue;
    result[key] = lerp(low[key], high[key], eased);
  }
  return result;
}

const HEX_CACHE = new Map();

function parseHexRgb(hex) {
  if (HEX_CACHE.has(hex)) return HEX_CACHE.get(hex);
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const parsed = [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ];
  HEX_CACHE.set(hex, parsed);
  return parsed;
}

export function lerpHexColor(hexA, hexB, t) {
  const a = parseHexRgb(hexA);
  const b = parseHexRgb(hexB);
  const k = clamp01(t);
  const r = Math.round(a[0] + (b[0] - a[0]) * k);
  const g = Math.round(a[1] + (b[1] - a[1]) * k);
  const bl = Math.round(a[2] + (b[2] - a[2]) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}
