import { useCallback, useEffect, useRef, useState } from 'react';
import {
  computeStageMetrics,
  createTimelineController,
} from './timelineEngine';
import { TimelineIntro } from './TimelineIntro';
import { ArchiveIndicator } from './ArchiveIndicator';
import { TimelineBelt } from './TimelineBelt';
import { Scanner } from './Scanner';
import { ParticleCanvas } from './ParticleCanvas';
import { ArchiveRecord } from './ArchiveRecord';
import { TimelineControls } from './TimelineControls';
import './timeline.css';

const STAGE_PAD_TOP = 18;
const STAGE_PAD_BOTTOM = 18;

/**
 * FCIT Living Legacy Interactive Archive
 * Coordinates seamless conveyor belt, center scanner beam, real-time 2D particle dissolve,
 * inverse reconstruction on backward drag, accessible controls, and mobile adaptation.
 */
export function TimelineSection({
  milestones = [],
  showIntro = true,
  showArchiveLink = true,
  headingId = 'living-legacy-heading',
}) {
  const safeMilestones = milestones.length > 0 ? milestones : [];
  const stageRef = useRef(null);
  const canvasHandleRef = useRef(null);
  const controllerRef = useRef(null);

  const slotRefs = useRef([]);
  const memoryClipRefs = useRef([]);
  const archiveClipRefs = useRef([]);

  const [metrics, setMetrics] = useState(() =>
    computeStageMetrics(1200, safeMilestones.length)
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeMilestone = safeMilestones[activeIndex] || safeMilestones[0];

  // Initialize continuous timeline animation controller once
  useEffect(() => {
    const controller = createTimelineController({
      onActiveChange: (nextIdx) => {
        setActiveIndex(nextIdx);
      },
      onDraggingChange: (draggingState) => {
        setIsDragging(draggingState);
      },
      onFrame: (frame) => {
        const { slots, metrics: m } = frame;
        const hiddenClip = `inset(0px 0px 0px ${m.cardWidth}px)`;
        const fullHideRight = `inset(0px ${m.cardWidth}px 0px 0px)`;

        for (let i = 0; i < slots.length; i += 1) {
          const s = slots[i];
          const slotEl = slotRefs.current[i];
          if (slotEl) {
            slotEl.style.transform = `translate3d(${s.tileLeft.toFixed(1)}px, 0px, 0px)`;
          }

          const memEl = memoryClipRefs.current[i];
          if (memEl) {
            if (s.crossedPx >= m.cardWidth) {
              memEl.style.clipPath = hiddenClip;
            } else if (s.crossedPx <= 0) {
              memEl.style.clipPath = 'inset(0px 0px 0px 0px)';
            } else {
              memEl.style.clipPath = `inset(0px 0px 0px ${s.crossedPx.toFixed(1)}px)`;
            }
          }

          const archEl = archiveClipRefs.current[i];
          if (archEl) {
            if (s.remainingRightPx >= m.cardWidth) {
              archEl.style.clipPath = fullHideRight;
            } else if (s.remainingRightPx <= 0) {
              archEl.style.clipPath = 'inset(0px 0px 0px 0px)';
            } else {
              archEl.style.clipPath = `inset(0px ${s.remainingRightPx.toFixed(1)}px 0px 0px)`;
            }
          }
        }

        // Render live particle dissolve synchronously in the exact same animation tick
        canvasHandleRef.current?.drawFrame(frame);
      },
    });

    controllerRef.current = controller;
    controller.start();

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  // Keep engine synced with prefers-reduced-motion & stage viewport measurements
  useEffect(() => {
    const stageEl = stageRef.current;
    const controller = controllerRef.current;
    if (!stageEl || !controller) return undefined;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyReduced = (matches) => {
      setReducedMotion(matches);
      controller.setReducedMotion(matches);
    };
    applyReduced(mq.matches);
    const onMqChange = (e) => applyReduced(e.matches);
    mq.addEventListener?.('change', onMqChange);

    const updateSize = () => {
      const width = stageEl.clientWidth;
      if (width <= 0) return;
      const computed = computeStageMetrics(width, safeMilestones.length);
      setMetrics(computed);
      controller.setMetrics(width, safeMilestones.length);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(stageEl);

    const io = new IntersectionObserver(
      (entries) => {
        controller.setInView(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.04 }
    );
    io.observe(stageEl);

    return () => {
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener?.('change', onMqChange);
    };
  }, [safeMilestones.length]);

  // Attach intentional horizontal wheel handler without interrupting vertical scroll
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return undefined;

    const onWheel = (e) => {
      const controller = controllerRef.current;
      if (!controller) return;
      const horizontalIntent =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.15 && Math.abs(e.deltaX) > 2;
      const shiftHorizontal = e.shiftKey && Math.abs(e.deltaY) > 2;

      if (horizontalIntent || shiftHorizontal) {
        e.preventDefault();
        const delta = horizontalIntent ? e.deltaX : e.deltaY;
        controller.applyWheel(delta * 0.85);
      }
    };

    stageEl.addEventListener('wheel', onWheel, { passive: false });
    return () => stageEl.removeEventListener('wheel', onWheel);
  }, []);

  const handleTogglePause = useCallback(() => {
    setPaused((prev) => {
      const next = !prev;
      controllerRef.current?.setPaused(next);
      return next;
    });
  }, []);

  const handleStep = useCallback((delta) => {
    controllerRef.current?.stepMilestone(delta);
  }, []);

  const handleJump = useCallback((idx) => {
    controllerRef.current?.jumpToMilestone(idx);
  }, []);

  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    if (e.target.closest('button, a, input, select')) return;
    controllerRef.current?.startDrag(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    controllerRef.current?.moveDrag(e.clientX);
  };

  const handlePointerUp = (e) => {
    controllerRef.current?.endDrag();
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleStep(-1);
    } else if (e.key === ' ') {
      e.preventDefault();
      handleTogglePause();
    }
  };

  if (safeMilestones.length === 0) return null;

  const isMobile = metrics.mode === 'mobile';
  const stageHeight = metrics.cardHeight + STAGE_PAD_TOP + STAGE_PAD_BOTTOM;

  return (
    <div className="w-full" data-testid="living-archive-timeline">
      {showIntro && (
        <TimelineIntro
          showArchiveLink={showArchiveLink}
          headingId={headingId}
        />
      )}

      {/* Floating Archive Index & Year Telemetry */}
      <ArchiveIndicator
        activeIndex={activeIndex}
        totalCount={safeMilestones.length}
        year={activeMilestone?.year || ''}
      />

      {/* Full Width Interactive Conveyor + Scanner + Particle Field */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-roledescription="interactive historical memory scanner"
        aria-label="FCIT Living Legacy Archive stage. Use left and right arrow keys to navigate milestones or Space to pause."
        onKeyDown={handleKeyDown}
        onMouseEnter={() => controllerRef.current?.setHovering(true)}
        onMouseLeave={() => controllerRef.current?.setHovering(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`fcit-timeline-stage focus-visible:outline-2 focus-visible:outline-fcit-navy ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ height: `${stageHeight}px` }}
      >
        {/* Edge-masked moving belt (Visual right / Archive left on tablet+) */}
        <div className="fcit-timeline-mask relative h-full w-full">
          <TimelineBelt
            milestones={safeMilestones}
            virtualCount={metrics.virtualCount}
            cardWidth={metrics.cardWidth}
            cardHeight={metrics.cardHeight}
            padTop={STAGE_PAD_TOP}
            isMobile={isMobile}
            slotRefs={slotRefs}
            memoryClipRefs={memoryClipRefs}
            archiveClipRefs={archiveClipRefs}
          />
        </div>

        {/* Real-time Canvas Particle Dissolve & Reverse Reconstruction */}
        <ParticleCanvas
          ref={canvasHandleRef}
          milestones={safeMilestones}
          cardWidth={metrics.cardWidth}
          cardHeight={metrics.cardHeight}
          particleStep={metrics.particleStep}
          padTop={STAGE_PAD_TOP}
        />

        {/* Center Illuminated Institutional Scanner Beam */}
        <Scanner isPaused={paused} isDragging={isDragging} />
      </div>

      {/* Mobile Synced Structured Record Panel (Preserves readability while visual memory dissolves above) */}
      {isMobile && activeMilestone && (
        <div className="md:hidden mx-auto max-w-lg px-4 pt-5 pb-2">
          <ArchiveRecord milestone={activeMilestone} compact />
        </div>
      )}

      {/* Accessible Pause/Resume, Prev/Next, and Milestone Sequence Controls */}
      <TimelineControls
        milestones={safeMilestones}
        activeIndex={activeIndex}
        paused={paused}
        reducedMotion={reducedMotion}
        onTogglePause={handleTogglePause}
        onPrev={() => handleStep(-1)}
        onNext={() => handleStep(1)}
        onSelect={handleJump}
      />

      {/* Screen-reader accessible semantic archive fallback */}
      <div className="sr-only">
        <h3>Accessible Historical Records Index</h3>
        <ol>
          {safeMilestones.map((item, idx) => (
            <li key={item._id || idx}>
              <strong>
                {item.year}: {item.title}
              </strong>{' '}
              ({item.category}) — {item.description} Source:{' '}
              {item.historicalSource || 'FCIT Digital Archive'}.
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
