import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { resolveMediaUrl } from '../../services/api';
import { resolvePanelVariant } from './MilestonePanel';

const SPARK_POOL_SIZE = 44;

function readThemeParticlePalette() {
  if (typeof window === 'undefined') {
    return ['#0B2747', '#D3AF37', '#8FD5F1', '#2A2E35', '#D2DAFF'];
  }
  const styles = window.getComputedStyle(document.documentElement);
  const pick = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  return [
    pick('--fcit-navy', '#0B2747'),
    pick('--fcit-gold-emblem', '#D3AF37'),
    pick('--fcit-cyan', '#8FD5F1'),
    pick('--fcit-secondary', '#2A2E35'),
    pick('--fcit-periwinkle', '#D2DAFF'),
  ];
}

function drawCoverImage(ctx, img, w, h) {
  const iw = img.naturalWidth || img.width || w;
  const ih = img.naturalHeight || img.height || h;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (iw - sw) * 0.5;
  const sy = (ih - sh) * 0.5;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

function drawContainImage(ctx, img, w, h, pad = 4) {
  const iw = img.naturalWidth || img.width || w;
  const ih = img.naturalHeight || img.height || h;
  const availW = Math.max(w - pad * 2, 1);
  const availH = Math.max(h - pad * 2, 1);
  const scale = Math.min(availW / iw, availH / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (w - dw) * 0.5;
  const dy = (h - dh) * 0.5;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function buildColumnIndexedBuffer(cols, rows, rgbaData, themePalette) {
  const colStart = new Int32Array(cols);
  const colEnd = new Int32Array(cols);
  const tempX = [];
  const tempY = [];
  const tempColor = [];
  const tempThemeColor = [];
  const tempSeed = [];
  const tempVy = [];

  let cursor = 0;
  for (let c = 0; c < cols; c += 1) {
    colStart[c] = cursor;
    for (let r = 0; r < rows; r += 1) {
      const idx = (r * cols + c) * 4;
      const alpha = rgbaData[idx + 3];
      if (alpha < 35) continue;

      const rr = rgbaData[idx];
      const gg = rgbaData[idx + 1];
      const bb = rgbaData[idx + 2];

      // Subtle deterministic hash based on grid coordinates
      const hash = (((c * 73 + r * 37 + c * r * 11) % 997) + 997) % 997 / 997;
      tempX.push(cols > 1 ? c / (cols - 1) : 0);
      tempY.push(rows > 1 ? r / (rows - 1) : 0);
      tempColor.push(`rgb(${rr},${gg},${bb})`);
      tempThemeColor.push(themePalette[(c * 3 + r * 7) % themePalette.length]);
      tempSeed.push(hash);
      tempVy.push((((c * 13 + r * 19) % 13) - 6) * 0.14);
      cursor += 1;
    }
    colEnd[c] = cursor;
  }

  return {
    cols,
    rows,
    colStart,
    colEnd,
    nx: Float32Array.from(tempX),
    ny: Float32Array.from(tempY),
    cssColors: tempColor,
    themeColors: tempThemeColor,
    seed: Float32Array.from(tempSeed),
    vy: Float32Array.from(tempVy),
  };
}

function buildProceduralArchivalPixels(cols, rows, themePalette) {
  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const octx = off.getContext('2d', { willReadFrequently: true });

  octx.clearRect(0, 0, cols, rows);
  octx.strokeStyle = themePalette[0];
  octx.lineWidth = 1.5;
  octx.strokeRect(Math.round(cols * 0.08), Math.round(rows * 0.1), Math.round(cols * 0.84), Math.round(rows * 0.8));

  octx.strokeStyle = themePalette[1];
  octx.beginPath();
  octx.arc(cols * 0.5, rows * 0.48, Math.min(cols, rows) * 0.22, 0, Math.PI * 2);
  octx.stroke();

  octx.fillStyle = themePalette[2];
  for (let r = 0; r < rows; r += 4) {
    for (let c = 0; c < cols; c += 5) {
      if ((c + r) % 2 === 0) {
        octx.fillRect(c, r, 1.5, 1.5);
      }
    }
  }

  const imgData = octx.getImageData(0, 0, cols, rows).data;
  return buildColumnIndexedBuffer(cols, rows, imgData, themePalette);
}

/**
 * High-performance synchronous 2D Canvas Pixel Particle Dissolve & Reconstruction Engine
 * Drawn inside the single requestAnimationFrame loop coordinated by timelineEngine.js.
 */
export const ParticleCanvas = forwardRef(function ParticleCanvas(
  { milestones = [], cardWidth = 460, cardHeight = 360, particleStep = 3, padTop = 20 },
  ref
) {
  const canvasRef = useRef(null);
  const paletteRef = useRef(['#0B2747', '#D3AF37', '#8FD5F1', '#2A2E35', '#D2DAFF']);
  const buffersRef = useRef([]);
  const sparkPoolRef = useRef(
    Array.from({ length: SPARK_POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 2,
      colorIdx: 0,
    }))
  );
  const lastSparkSpawnRef = useRef(0);

  // Sample all milestone plates on milestone/grid dimension changes
  useEffect(() => {
    const palette = readThemeParticlePalette();
    paletteRef.current = palette;

    const step = Math.max(particleStep || 3, 2);
    const cols = Math.max(Math.round(cardWidth / step), 36);
    const rows = Math.max(Math.round(cardHeight / step), 28);

    const nextBuffers = new Array(milestones.length);
    let cancelled = false;

    const loadImageSafe = (url) =>
      new Promise((resolve) => {
        const resolved = resolveMediaUrl(url);
        if (!resolved) {
          resolve(null);
          return;
        }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = resolved;
      });

    milestones.forEach(async (item, idx) => {
      const variant = resolvePanelVariant(item, idx);
      nextBuffers[idx] = buildProceduralArchivalPixels(cols, rows, palette);
      buffersRef.current = nextBuffers;

      if (!item.primaryImage) return;
      const primaryImg = await loadImageSafe(item.primaryImage);
      if (cancelled || !primaryImg) return;

      const secondaryUrl =
        Array.isArray(item.additionalImages) && item.additionalImages[0]
          ? item.additionalImages[0]
          : '';
      const secondaryImg = secondaryUrl ? await loadImageSafe(secondaryUrl) : null;
      if (cancelled) return;

      try {
        const off = document.createElement('canvas');
        off.width = cols;
        off.height = rows;
        const octx = off.getContext('2d', { willReadFrequently: true });
        octx.fillStyle = '#FEF7E5';
        octx.fillRect(0, 0, cols, rows);

        if (variant === 'emblem-seal') {
          drawContainImage(octx, primaryImg, cols, rows, Math.round(rows * 0.12));
        } else if (variant === 'studio-split') {
          octx.save();
          octx.beginPath();
          octx.rect(0, 0, Math.round(cols * 0.66), rows);
          octx.clip();
          drawCoverImage(octx, primaryImg, Math.round(cols * 0.66), rows);
          octx.restore();
          if (secondaryImg) {
            octx.drawImage(
              secondaryImg,
              Math.round(cols * 0.69),
              Math.round(rows * 0.56),
              Math.round(cols * 0.3),
              Math.round(rows * 0.4)
            );
          }
        } else if (variant === 'collage') {
          drawCoverImage(octx, primaryImg, Math.round(cols * 0.86), Math.round(rows * 0.86));
          if (secondaryImg) {
            octx.fillStyle = '#FBF6EF';
            octx.fillRect(
              Math.round(cols * 0.54),
              Math.round(rows * 0.54),
              Math.round(cols * 0.46),
              Math.round(rows * 0.46)
            );
            octx.drawImage(
              secondaryImg,
              Math.round(cols * 0.57),
              Math.round(rows * 0.57),
              Math.round(cols * 0.42),
              Math.round(rows * 0.42)
            );
          }
        } else {
          drawCoverImage(octx, primaryImg, cols, rows);
        }

        const rgbaData = octx.getImageData(0, 0, cols, rows).data;
        nextBuffers[idx] = buildColumnIndexedBuffer(cols, rows, rgbaData, palette);
      } catch {
        // Keep clean procedural archival particles if CORS blocks pixel extraction
      }
    });

    return () => {
      cancelled = true;
    };
  }, [milestones, cardWidth, cardHeight, particleStep]);

  // Synchronous per-frame renderer invoked directly from timelineEngine rAF tick
  useImperativeHandle(
    ref,
    () => ({
      drawFrame({ now, metrics, slots, velocity, paused, reducedMotion }) {
        const canvas = canvasRef.current;
        if (!canvas || !metrics) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        if (cssW <= 0 || cssH <= 0) return;

        const targetW = Math.round(cssW * dpr);
        const targetH = Math.round(cssH * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cssW, cssH);

        const { scanX, cardWidth: cw, cardHeight: ch, scatterHorizon } = metrics;
        const buffers = buffersRef.current;
        const palette = paletteRef.current;
        const tSec = now * 0.0014;
        const isReversing = velocity < -12;
        let hasStraddlingTile = false;

        for (let s = 0; s < slots.length; s += 1) {
          const slot = slots[s];
          if (!slot.inDissolveWindow) continue;

          if (slot.tileLeft <= scanX && slot.tileRight > scanX) {
            hasStraddlingTile = true;
          }

          const buf = buffers[slot.milestoneIndex];
          if (!buf || buf.cols < 2) continue;

          const minColFloat = ((scanX - scatterHorizon - slot.tileLeft) / cw) * (buf.cols - 1);
          const maxColFloat = ((scanX + 4 - slot.tileLeft) / cw) * (buf.cols - 1);
          const cStart = Math.max(0, Math.floor(minColFloat));
          const cEnd = Math.min(buf.cols - 1, Math.ceil(maxColFloat));

          if (cEnd < cStart) continue;

          const basePxSize = metrics.mode === 'desktop' ? 2.4 : metrics.mode === 'tablet' ? 2.8 : 3.2;

          for (let c = cStart; c <= cEnd; c += 1) {
            const px = slot.tileLeft + (c / (buf.cols - 1)) * cw;
            const scanDist = scanX - px;
            if (scanDist < -2 || scanDist > scatterHorizon) continue;

            const pFrom = buf.colStart[c];
            const pTo = buf.colEnd[c];

            if (reducedMotion) {
              if (scanDist > 42 || scanDist < 0) continue;
              const staticAlpha = (1 - scanDist / 42) * 0.55;
              ctx.globalAlpha = staticAlpha;
              for (let i = pFrom; i < pTo; i += 2) {
                const py = padTop + buf.ny[i] * ch;
                ctx.fillStyle = buf.cssColors[i];
                ctx.fillRect(px, py, basePxSize, basePxSize);
              }
              continue;
            }

            const normCross = Math.min(Math.max(scanDist / scatterHorizon, 0), 1);
            const fadeCurve = Math.pow(1 - normCross, 1.42);
            const spreadMultiplier = isReversing ? 0.72 : 1.0;

            for (let i = pFrom; i < pTo; i += 1) {
              const seed = buf.seed[i];
              const py = padTop + buf.ny[i] * ch;

              // Concentrate luminous particles near the scanner core and smoothly disperse outward
              const dispersionReach = (22 + seed * 96) * spreadMultiplier;
              const jitterX = (seed - 0.5) * 8 * normCross;
              const waveY = Math.sin(tSec * 2.1 + seed * 6.283) * (2.5 + normCross * 10);

              const drawX = px - normCross * dispersionReach + jitterX;
              const drawY = py + buf.vy[i] * normCross * 48 + waveY;

              const twinkle = 0.78 + 0.22 * Math.sin(tSec * 4.5 + seed * 19.3);
              const concentratedBoost = normCross < 0.14 ? 0.96 : fadeCurve * 0.88;
              const alpha = concentratedBoost * twinkle;
              if (alpha <= 0.03) continue;

              const size = Math.max(1.15, (basePxSize + (seed - 0.5) * 0.9) * (1 - normCross * 0.45));

              ctx.globalAlpha = alpha;
              if (normCross < 0.09 && seed > 0.72) {
                // Illuminated theme spark right at scan boundary
                ctx.fillStyle = palette[2];
              } else if (normCross > 0.36) {
                ctx.fillStyle = buf.themeColors[i];
              } else {
                ctx.fillStyle = buf.cssColors[i];
              }

              ctx.fillRect(drawX, drawY, size, size);
            }
          }
        }

        // Pooled free-moving sparks emitting gently from the active scan line (zero allocations)
        const pool = sparkPoolRef.current;
        if (!reducedMotion) {
          if (hasStraddlingTile && !paused && now - lastSparkSpawnRef.current > 75) {
            lastSparkSpawnRef.current = now;
            let spawned = 0;
            for (let i = 0; i < SPARK_POOL_SIZE && spawned < 2; i += 1) {
              const sp = pool[i];
              if (!sp.active) {
                sp.active = true;
                sp.x = scanX + (((now + i * 31) % 7) - 3) * 0.6;
                sp.y = padTop + (0.08 + (((now * 7 + i * 53) % 84) / 100)) * ch;
                const dirSign = isReversing ? 1 : -1;
                sp.vx = dirSign * (24 + ((i * 19 + now) % 36));
                sp.vy = ((((i * 23 + now) % 21) - 10) / 10) * 14;
                sp.life = 0;
                sp.maxLife = 0.65 + ((i * 13) % 7) * 0.11;
                sp.size = 1.6 + ((i * 11) % 4) * 0.35;
                sp.colorIdx = i % 3;
                spawned += 1;
              }
            }
          }

          for (let i = 0; i < SPARK_POOL_SIZE; i += 1) {
            const sp = pool[i];
            if (!sp.active) continue;
            sp.life += 0.016;
            if (sp.life >= sp.maxLife) {
              sp.active = false;
              continue;
            }
            sp.x += sp.vx * 0.016;
            sp.y += sp.vy * 0.016;
            const sparkAlpha = Math.sin((sp.life / sp.maxLife) * Math.PI) * 0.82;
            ctx.globalAlpha = sparkAlpha;
            ctx.fillStyle = palette[sp.colorIdx];
            ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
          }
        }

        ctx.globalAlpha = 1;
      },
    }),
    [padTop]
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
});
