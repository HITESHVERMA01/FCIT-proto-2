import { useRef } from 'react';
import { useScrollDirector } from '../../hooks/useScrollDirector';

/**
 * Halden-inspired Atmospheric Bowl Glow adapted to FCIT Vela light palette.
 * Uses pre-rendered radial gradient layers animated exclusively with
 * GPU transform & opacity (zero per-frame gradient repaints).
 */
export function AmbientBowl() {
  const softRef = useRef(null);
  const cyanRef = useRef(null);
  const creamRef = useRef(null);

  useScrollDirector(({ bowl, earlyProgress, isDesktop, reducedMotion }) => {
    const softEl = softRef.current;
    const cyanEl = cyanRef.current;
    const creamEl = creamRef.current;
    if (!softEl) return;

    if (reducedMotion) {
      softEl.style.transform = 'translate3d(-50%, 0px, 0) scale3d(1, 1, 1)';
      softEl.style.opacity = '0.78';
      if (cyanEl) {
        cyanEl.style.transform = 'translate3d(-50%, 0px, 0) scale3d(1, 1, 1)';
        cyanEl.style.opacity = '0.56';
      }
      if (creamEl) {
        creamEl.style.transform = 'translate3d(-50%, 0px, 0) scale3d(1, 1, 1)';
        creamEl.style.opacity = '0.88';
      }
      return;
    }

    const { tip, half, soft, scaleX, scaleY, shiftY, opacity } = bowl;

    // Primary pastel periwinkle & cream horizon envelope (active desktop & light mobile)
    const softSpreadX = scaleX * (0.94 + (half - 0.55) * 0.28);
    const softSpreadY = scaleY * (0.94 + (tip - 0.5) * 0.24);
    softEl.style.transform = `translate3d(-50%, ${Math.round(shiftY * 0.85)}px, 0) scale3d(${softSpreadX.toFixed(4)}, ${softSpreadY.toFixed(4)}, 1)`;
    softEl.style.opacity = Math.min(opacity * (0.72 + soft * 0.28), 0.96).toFixed(3);

    // Secondary & inner bloom layers active on desktop only
    if (!isDesktop) return;

    if (cyanEl) {
      const cyanX = scaleX * (0.9 + (half - 0.55) * 0.36);
      const cyanY = scaleY * (0.92 + (tip - 0.5) * 0.34);
      const cyanDropY = Math.round(shiftY + (tip - 0.54) * 36);
      cyanEl.style.transform = `translate3d(-50%, ${cyanDropY}px, 0) scale3d(${cyanX.toFixed(4)}, ${cyanY.toFixed(4)}, 1)`;
      cyanEl.style.opacity = Math.max(0.24, opacity * (0.64 - earlyProgress * 0.22)).toFixed(3);
    }

    if (creamEl) {
      const creamScale = 0.96 + (1 - soft) * 0.14;
      creamEl.style.transform = `translate3d(-50%, ${Math.round(shiftY * 0.7)}px, 0) scale3d(${(scaleX * creamScale).toFixed(4)}, ${(scaleY * 0.95).toFixed(4)}, 1)`;
      creamEl.style.opacity = (0.74 + soft * 0.22).toFixed(3);
    }
  }, []);

  return (
    <div className="fcit-ambient-bowl-wrap" aria-hidden="true">
      <div ref={creamRef} className="fcit-ambient-bowl-cream" />
      <div ref={softRef} className="fcit-ambient-bowl-soft" />
      <div ref={cyanRef} className="fcit-ambient-bowl-cyan" />
    </div>
  );
}
