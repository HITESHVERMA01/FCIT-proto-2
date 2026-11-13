import { useMemo, useRef } from 'react';
import { computeStickyRunwayProgress } from '../../animations/scroll/scrollProgress';
import { easeDecel, lerpHexColor } from '../../animations/scroll/interpolate';
import { STATEMENT_INK_COLORS } from '../../animations/scroll/motionTokens';
import { useScrollTarget } from '../../hooks/useScrollDirector';

const STATEMENT_LINES = [
  'Learn together.',
  'Build with purpose.',
  'Create what matters.',
];

/**
 * Scene Two — Pinned Statement & Letter-by-Letter Text Reveal
 * - Centered focal statement gently pinned on desktop without scroll hijacking
 * - Word-aware token wrapping prevents mid-word breaks
 * - Smooth per-letter rise, opacity reveal & color shift (muted -> warm gold -> FCIT navy)
 * - Drives --nav-cta-progress cleanly so FloatingNavbar dot -> circle -> pill transforms in sync
 */
export function StatementReveal() {
  const sectionRef = useRef(null);
  const charRefs = useRef([]);
  const subCopyRef = useRef(null);
  const prevProgressRef = useRef(-1);

  const tokenizedLines = useMemo(() => {
    let globalCharIndex = 0;
    return STATEMENT_LINES.map((line, lineIdx) => {
      const words = line.split(' ').map((word) => {
        const chars = word.split('').map((ch) => {
          const idx = globalCharIndex;
          globalCharIndex += 1;
          return { ch, idx, lineIdx };
        });
        return { word, chars };
      });
      return { lineIdx, words };
    });
  }, []);

  const totalChars = useMemo(
    () => STATEMENT_LINES.join('').replace(/\s+/g, '').length,
    []
  );

  useScrollTarget(
    sectionRef,
    ({ rect, viewportHeight, isDesktop, reducedMotion }) => {
      const spans = charRefs.current;
      const subCopy = subCopyRef.current;

      // Sync FloatingNavbar CTA transformation continuously as visitor reaches/passes Statement
      // Holds dot (0) at top of Hero (rect.top >= 0.70vh) and completes full pill by reading lock (0.22vh)
      const startTop = viewportHeight * 0.70;
      const endTop = viewportHeight * 0.22;
      const navRange = Math.max(startTop - endTop, 1);
      const navRaw = (startTop - rect.top) / navRange;
      const navCtaT = reducedMotion ? 1 : Math.min(Math.max(navRaw, 0), 1);
      document.documentElement.style.setProperty(
        '--nav-cta-progress',
        navCtaT.toFixed(3)
      );

      if (reducedMotion) {
        if (prevProgressRef.current === 999) return;
        prevProgressRef.current = 999;
        for (let i = 0; i < totalChars; i += 1) {
          const el = spans[i];
          if (!el) continue;
          el.style.opacity = '1';
          el.style.transform = 'translate3d(0, 0, 0)';
          el.style.color = STATEMENT_INK_COLORS.navy;
        }
        if (subCopy) {
          subCopy.style.opacity = '1';
          subCopy.style.transform = 'translate3d(0, 0, 0)';
        }
        return;
      }

      const progress = computeStickyRunwayProgress(rect, viewportHeight, isDesktop);
      // Quantize check: zero DOM mutations when idle
      if (Math.abs(progress - prevProgressRef.current) < 0.0018) {
        return;
      }
      prevProgressRef.current = progress;

      const windowWidth = 0.22;
      for (let i = 0; i < totalChars; i += 1) {
        const el = spans[i];
        if (!el) continue;

        const threshold = (i / Math.max(totalChars - 1, 1)) * (1 - windowWidth);
        const local = Math.min(Math.max((progress - threshold) / windowWidth, 0), 1);
        const eased = easeDecel(local);

        // Always keep initial state legible (opacity >= 0.36) while rising sharply to 1.0
        const opacity = 0.36 + eased * 0.64;
        const shiftY = (1 - eased) * 10;

        // Subtle muted slate -> warm institutional gold glint -> crisp FCIT Navy finish
        const color =
          eased < 0.45
            ? lerpHexColor(
                STATEMENT_INK_COLORS.muted,
                STATEMENT_INK_COLORS.warmAccent,
                eased / 0.45
              )
            : lerpHexColor(
                STATEMENT_INK_COLORS.warmAccent,
                STATEMENT_INK_COLORS.navy,
                (eased - 0.45) / 0.55
              );

        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(0, ${shiftY.toFixed(1)}px, 0)`;
        el.style.color = color;
      }

      if (subCopy) {
        const subLocal = Math.min(Math.max((progress - 0.55) / 0.35, 0), 1);
        const subEased = easeDecel(subLocal);
        subCopy.style.opacity = (0.35 + subEased * 0.65).toFixed(3);
        subCopy.style.transform = `translate3d(0, ${((1 - subEased) * 12).toFixed(1)}px, 0)`;
      }
    },
    [totalChars]
  );

  return (
    <section
      id="fcit-statement"
      ref={sectionRef}
      aria-labelledby="philosophy-heading"
      className="editorial-band bg-gradient-to-b from-fcit-cream via-fcit-lemonSoft/80 to-fcit-sageSoft/55 md:min-h-[168vh] motion-reduce:md:min-h-0"
    >
      <div className="md:sticky md:top-0 md:flex md:min-h-screen md:items-center py-20 md:py-24 motion-reduce:md:static motion-reduce:md:min-h-0">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-8">
          <p className="mono-meta uppercase text-fcit-goldInk mb-6">
            02 · FCIT Philosophy
          </p>

          <h2
            id="philosophy-heading"
            className="heading-3 sm:heading-2 lg:heading-1"
            aria-label="Learn together. Build with purpose. Create what matters."
          >
            {tokenizedLines.map(({ lineIdx, words }) => (
              <span key={lineIdx} className="block mb-2.5 last:mb-0">
                {words.map((wordObj, wordIdx) => (
                  <span
                    key={`${lineIdx}-${wordIdx}`}
                    className="inline-block whitespace-nowrap mr-3 sm:mr-4 last:mr-0"
                  >
                    {wordObj.chars.map((charObj) => (
                      <span
                        key={charObj.idx}
                        ref={(node) => {
                          charRefs.current[charObj.idx] = node;
                        }}
                        className="inline-block will-change-[opacity,transform]"
                        style={{
                          opacity: 0.36,
                          color: STATEMENT_INK_COLORS.muted,
                        }}
                      >
                        {charObj.ch}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <p
            ref={subCopyRef}
            className="body-2 text-fcit-secondary mt-8 max-w-[560px] mx-auto will-change-[opacity,transform]"
            style={{ opacity: 0.35 }}
          >
            Technical mastery grows strongest when curiosity is shared across cohorts, guided by mentorship, and focused on real problems worth solving.
          </p>
        </div>
      </div>
    </section>
  );
}
