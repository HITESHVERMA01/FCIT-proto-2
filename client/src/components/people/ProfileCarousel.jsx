import { useCallback, useEffect, useRef, useState } from 'react';
import { CarouselControls } from './CarouselControls';
import './people.css';

// Single configurable auto-scroll speed (px per 60Hz tick; ~24px/sec gentle drift)
export const CAROUSEL_AUTO_SCROLL_SPEED = 0.4;

/**
 * Reusable Reelmark Inspired Curved Editorial Carousel
 * Used by both Faculty & Mentors and FCIT Student Team sections.
 *
 * Desktop (>=768px):
 * - Gentle continuous horizontal auto-drift via rAF ONLY when active/visible
 * - Pauses on hover, keyboard focus inside track, pointer drag, page hidden, or offscreen
 * - Soft parabolic arch + subtle center prominence via GPU transforms (zero React re-renders per frame)
 * - Pointer drag with natural inertia decay & seamless return to drift
 *
 * Mobile (<768px) & prefers-reduced-motion:
 * - Native horizontal touch scroll + CSS scroll-snap, zero auto-drift, zero 3D curves
 */
export function ProfileCarousel({
  items = [],
  renderCard,
  ariaLabel = 'Profile showcase carousel',
}) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardNodesRef = useRef([]);

  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animRef = useRef({
    offset: 0,
    velocity: 0,
    speed: CAROUSEL_AUTO_SCROLL_SPEED,
    hovering: false,
    focusWithin: false,
    dragging: false,
    inView: false,
    pageVisible: typeof document === 'undefined' ? true : !document.hidden,
    reducedMotion: false,
    paused: false,
    lastPointerX: 0,
    cardWidth: 288,
    gap: 24,
    rafId: null,
    lastTs: 0,
  });

  const canLoopDesktop = items.length >= 3;
  const desktopItems = canLoopDesktop ? [...items, ...items, ...items] : items;

  const layoutCardsFrame = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canLoopDesktop) return;

    const st = animRef.current;
    const unit = st.cardWidth + st.gap;
    const singleSpan = unit * items.length;
    if (singleSpan > 0) {
      if (st.offset >= singleSpan * 2) st.offset -= singleSpan;
      if (st.offset < singleSpan) st.offset += singleSpan;
    }

    const viewportW = track.parentElement?.clientWidth || 1000;
    const centerX = viewportW / 2;
    const cards = cardNodesRef.current;

    for (let i = 0; i < desktopItems.length; i += 1) {
      const el = cards[i];
      if (!el) continue;

      const cardCenter = i * unit - st.offset + st.cardWidth / 2;
      const dxNorm = (cardCenter - centerX) / Math.max(viewportW * 0.5, 1);
      const clampedDx = Math.max(-1.6, Math.min(1.6, dxNorm));

      if (st.reducedMotion) {
        el.style.transform = `translate3d(${(i * unit - st.offset).toFixed(1)}px, 0px, 0)`;
      } else {
        const curveY = Math.min(clampedDx * clampedDx * 16, 28);
        const scale = Math.max(0.91, 1 - Math.abs(clampedDx) * 0.048);
        const rotateDeg = clampedDx * 1.4;
        el.style.transform = `translate3d(${(i * unit - st.offset).toFixed(1)}px, ${curveY.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotateDeg.toFixed(2)}deg)`;
      }
    }
  }, [canLoopDesktop, desktopItems.length, items.length]);

  const scheduleLoopIfNeeded = useCallback(() => {
    const st = animRef.current;
    if (st.rafId !== null || typeof window === 'undefined' || !canLoopDesktop) return;

    const isDesktop = window.innerWidth >= 768;
    const hasMomentum = Math.abs(st.velocity) > 0.06;
    const shouldAutoRun =
      isDesktop &&
      st.inView &&
      st.pageVisible &&
      !st.reducedMotion &&
      !st.paused &&
      !st.hovering &&
      !st.focusWithin &&
      !st.dragging;

    if (!shouldAutoRun && !st.dragging && !hasMomentum) return;

    st.lastTs = performance.now();

    const step = (ts) => {
      st.rafId = null;
      const dt = Math.min((ts - st.lastTs) / 16.6667, 2.5);
      st.lastTs = ts;

      const desktopActive = window.innerWidth >= 768 && st.inView && st.pageVisible;
      let keepRunning = false;

      if (desktopActive) {
        if (st.dragging) {
          keepRunning = true;
        } else if (Math.abs(st.velocity) > 0.06) {
          st.offset += st.velocity * dt;
          st.velocity *= Math.pow(0.92, dt);
          keepRunning = true;
        } else {
          st.velocity = 0;
          if (!st.paused && !st.reducedMotion && !st.hovering && !st.focusWithin) {
            st.offset += st.speed * dt;
            keepRunning = true;
          }
        }
        layoutCardsFrame();
      }

      if (keepRunning) {
        st.rafId = window.requestAnimationFrame(step);
      }
    };

    st.rafId = window.requestAnimationFrame(step);
  }, [canLoopDesktop, layoutCardsFrame]);

  useEffect(() => {
    animRef.current.paused = paused;
    if (!paused) {
      scheduleLoopIfNeeded();
    }
  }, [paused, scheduleLoopIfNeeded]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const st = animRef.current;
    if (canLoopDesktop) {
      st.offset = (st.cardWidth + st.gap) * items.length;
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyReduced = (matches) => {
      st.reducedMotion = matches;
      setReducedMotion(matches);
      layoutCardsFrame();
      if (!matches) scheduleLoopIfNeeded();
    };
    applyReduced(mq.matches);

    const onMqChange = (e) => applyReduced(e.matches);
    mq.addEventListener?.('change', onMqChange);

    const onVisibility = () => {
      st.pageVisible = !document.hidden;
      if (st.pageVisible) scheduleLoopIfNeeded();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => {
      layoutCardsFrame();
      scheduleLoopIfNeeded();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const container = sectionRef.current;
    let io = null;
    if (container) {
      io = new IntersectionObserver(
        (entries) => {
          st.inView = entries[0]?.isIntersecting ?? false;
          if (st.inView) {
            layoutCardsFrame();
            scheduleLoopIfNeeded();
          }
        },
        { threshold: 0.05 }
      );
      io.observe(container);
    }

    layoutCardsFrame();

    return () => {
      io?.disconnect();
      mq.removeEventListener?.('change', onMqChange);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      if (st.rafId !== null) {
        window.cancelAnimationFrame(st.rafId);
        st.rafId = null;
      }
    };
  }, [canLoopDesktop, items.length, layoutCardsFrame, scheduleLoopIfNeeded]);

  const nudge = (direction) => {
    const st = animRef.current;
    const unit = st.cardWidth + st.gap;
    if (st.reducedMotion) {
      st.offset += direction * unit;
      layoutCardsFrame();
      return;
    }
    st.velocity += direction * (unit * 0.14);
    scheduleLoopIfNeeded();
  };

  const onPointerDown = (e) => {
    if (window.innerWidth < 768 || !canLoopDesktop) return;
    if (e.target.closest('a, button')) return;
    const st = animRef.current;
    st.dragging = true;
    st.lastPointerX = e.clientX;
    st.velocity = 0;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    scheduleLoopIfNeeded();
  };

  const onPointerMove = (e) => {
    const st = animRef.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.lastPointerX;
    st.lastPointerX = e.clientX;
    st.offset -= dx;
    st.velocity = -dx * 0.65;
    layoutCardsFrame();
  };

  const onPointerUp = (e) => {
    const st = animRef.current;
    if (!st.dragging) return;
    st.dragging = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    scheduleLoopIfNeeded();
  };

  const handleFocusCapture = () => {
    animRef.current.focusWithin = true;
  };

  const handleBlurCapture = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      animRef.current.focusWithin = false;
      scheduleLoopIfNeeded();
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {/* Desktop Controls */}
      {canLoopDesktop && (
        <CarouselControls
          paused={paused}
          reducedMotion={reducedMotion}
          label={ariaLabel}
          onTogglePause={() => setPaused((p) => !p)}
          onPrev={() => nudge(-1)}
          onNext={() => nudge(1)}
        />
      )}

      {/* Desktop Curved Stage (switches to clean grid if < 3 records) */}
      {canLoopDesktop ? (
        <div
          className={`hidden md:block fcit-people-carousel-mask relative h-[656px] w-full overflow-hidden select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseEnter={() => {
            animRef.current.hovering = true;
          }}
          onMouseLeave={() => {
            animRef.current.hovering = false;
            scheduleLoopIfNeeded();
          }}
          onFocusCapture={handleFocusCapture}
          onBlurCapture={handleBlurCapture}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div ref={trackRef} className="relative h-full w-full pt-3">
            {desktopItems.map((item, idx) => {
              const isClone = idx < items.length || idx >= items.length * 2;
              return (
                <div
                  key={`${item._id || item.name}-${idx}`}
                  ref={(node) => {
                    cardNodesRef.current[idx] = node;
                    if (node && isClone) {
                      node
                        .querySelectorAll('a, button')
                        .forEach((ctrl) => ctrl.setAttribute('tabindex', '-1'));
                    }
                  }}
                  aria-hidden={isClone || undefined}
                  className="carousel-card-item absolute top-3 left-0 w-[288px] h-[590px] will-change-transform origin-center"
                >
                  {renderCard(item, idx % items.length)}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={item._id || idx}>{renderCard(item, idx)}</div>
          ))}
        </div>
      )}

      {/* Mobile Native Touch Scroll & Snap Strip (No auto-drift, no vertical scroll hijack) */}
      <div className="md:hidden fcit-mobile-people-rail -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4">
        {items.map((item, idx) => (
          <div
            key={item._id || idx}
            className="snap-center shrink-0 w-[272px] sm:w-[296px]"
          >
            {renderCard(item, idx)}
          </div>
        ))}
      </div>
    </div>
  );
}
