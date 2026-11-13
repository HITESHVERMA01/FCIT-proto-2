/**
 * Floating FCIT Archive Indicator anchored near the top of the central scanner beam.
 * Displays real-time milestone index / dataset total alongside verified/anchor year.
 */
export function ArchiveIndicator({ activeIndex = 0, totalCount = 0, year = '' }) {
  const safeTotal = Math.max(totalCount, 1);
  const currentNum = Math.min(Math.max(activeIndex + 1, 1), safeTotal);
  const formattedIndex = `${String(currentNum).padStart(2, '0')} / ${String(
    safeTotal
  ).padStart(2, '0')}`;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none relative z-30 flex justify-center mb-3 sm:mb-4 px-4"
    >
      <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-fcit-navy/20 bg-fcit-cream/95 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="mono-meta uppercase text-fcit-navy">FCIT ARCHIVE</span>
        <span className="sr-only"> · </span>
        <span className="h-3 w-[1px] bg-fcit-navy/20" aria-hidden="true" />
        <span className="mono-meta font-semibold text-fcit-navyDeep">{formattedIndex}</span>
        {year && (
          <>
            <span className="sr-only"> · </span>
            <span className="h-3 w-[1px] bg-fcit-navy/20" aria-hidden="true" />
            <span className="mono-meta text-fcit-goldInk">{year}</span>
          </>
        )}
      </div>
    </div>
  );
}
