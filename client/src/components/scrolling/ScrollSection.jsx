import { createElement, useEffect, useRef, useState } from 'react';
import { SECTION_SURFACE_TONES } from '../../animations/scroll/motionTokens';
import { observeRevealOnce } from '../../animations/scroll/sectionVisibility';

/**
 * Reusable global scroll section wrapper unifying:
 * - Seamless Vela pastel background tones without heavy divider lines
 * - Consistent 32px -> 0 vertical entrance & opacity transition (cubic-bezier(0.22, 0.7, 0.2, 1))
 * - Reduced motion static clarity
 */
export function ScrollSection({
  as = 'section',
  id,
  ariaLabelledby,
  tone = 'cream',
  revealContent = true,
  className = '',
  innerClassName = '',
  children,
  ...rest
}) {
  const innerRef = useRef(null);
  const [revealed, setRevealed] = useState(!revealContent);

  useEffect(() => {
    if (!revealContent || revealed) return undefined;
    const el = innerRef.current;
    if (!el) {
      setRevealed(true);
      return undefined;
    }

    return observeRevealOnce(el, () => setRevealed(true), {
      threshold: 0.02,
      rootMargin: '40px 0px -16px 0px',
    });
  }, [revealContent, revealed]);

  const bgClass = SECTION_SURFACE_TONES[tone] || SECTION_SURFACE_TONES.cream;

  return createElement(
    as,
    {
      id,
      'aria-labelledby': ariaLabelledby,
      className: `editorial-band ${bgClass} ${className}`,
      ...rest,
    },
    revealContent ? (
      <div
        ref={innerRef}
        className={`scroll-section-reveal ${revealed ? 'is-revealed' : ''} ${innerClassName}`}
      >
        {children}
      </div>
    ) : (
      children
    )
  );
}
