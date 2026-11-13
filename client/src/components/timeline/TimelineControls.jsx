import { CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';

/**
 * Accessible controls allowing pause/resume, previous reconstruction step,
 * next scan advance, and direct milestone selection without crowding the visual field.
 */
export function TimelineControls({
  milestones = [],
  activeIndex = 0,
  paused = false,
  reducedMotion = false,
  onTogglePause,
  onPrev,
  onNext,
  onSelect,
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Step backwards and reconstruct previous milestone"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/20 bg-fcit-ivory text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
        >
          <CaretLeft size={16} aria-hidden="true" />
        </button>

        {!reducedMotion && (
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={paused ? 'Resume timeline stream' : 'Pause timeline stream'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
          >
            {paused ? (
              <>
                <Play size={14} weight="fill" aria-hidden="true" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={14} weight="fill" aria-hidden="true" />
                <span>Pause</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          aria-label="Advance to next milestone across scanner"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/20 bg-fcit-ivory text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
        >
          <CaretRight size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Dynamic Milestone Sequence Jumpers */}
      <nav aria-label="Archive milestone sequence" className="flex flex-wrap items-center gap-1.5">
        {milestones.map((item, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={item._id || idx}
              type="button"
              onClick={() => onSelect(idx)}
              aria-current={active ? 'step' : undefined}
              className={`rounded-lg px-2.5 py-1.5 caption-4 transition duration-300 ease-fcit ${
                active
                  ? 'bg-fcit-navyDeep text-fcit-cream'
                  : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
              }`}
            >
              <span className="mono-meta mr-1.5">{String(idx + 1).padStart(2, '0')}</span>
              <span>{item.shortTitle || item.year}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
