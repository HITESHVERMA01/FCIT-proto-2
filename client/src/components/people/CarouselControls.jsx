import { CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';

/**
 * Accessible controls for the desktop curved people showcase.
 */
export function CarouselControls({
  paused = false,
  reducedMotion = false,
  label = 'profile carousel',
  onTogglePause,
  onPrev,
  onNext,
}) {
  return (
    <div className="hidden md:flex items-center justify-between gap-4 mb-5">
      <p className="caption-4 text-fcit-muted">
        {reducedMotion
          ? 'Reduced motion active: use horizontal scroll or arrow buttons to browse.'
          : 'Hover to slow, focus or drag horizontally to explore.'}
      </p>

      <div className="flex items-center gap-2">
        {!reducedMotion && (
          <button
            type="button"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={paused ? `Resume ${label} movement` : `Pause ${label} movement`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-fcit-navy/15 bg-fcit-cream/90 px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
          >
            {paused ? (
              <Play size={14} weight="fill" aria-hidden="true" />
            ) : (
              <Pause size={14} weight="fill" aria-hidden="true" />
            )}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onPrev}
          aria-label={`Previous ${label}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-cream/90 text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
        >
          <CaretLeft size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label={`Next ${label}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-cream/90 text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
        >
          <CaretRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
