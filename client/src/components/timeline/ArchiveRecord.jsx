import { Sparkle } from '@phosphor-icons/react';

/**
 * Archive Side Record (Left of central scanner on desktop/tablet, synced below on mobile)
 * Presents structured institutional documentation synchronized 1:1 with the visual milestone.
 * Clean typographic hierarchy on seamless global surface — no heavy box clutter or synthetic HTML tags.
 */
export function ArchiveRecord({ milestone, compact = false }) {
  if (!milestone) return null;

  const isVerified = milestone.verificationStatus === 'verified';
  const highlights = Array.isArray(milestone.highlights)
    ? milestone.highlights.slice(0, compact ? 3 : 2)
    : [];
  const contributor =
    Array.isArray(milestone.contributors) && milestone.contributors.length > 0
      ? milestone.contributors.join(' · ')
      : '';
  const relatedEvents =
    Array.isArray(milestone.relatedEvents) && milestone.relatedEvents.length > 0
      ? milestone.relatedEvents.slice(0, 2).join(' · ')
      : '';

  return (
    <article
      className={`h-full w-full flex flex-col justify-between bg-fcit-cream ${
        compact ? 'px-1 py-2 space-y-4' : 'pl-5 pr-10 py-3 sm:pl-6 sm:pr-12 sm:py-4'
      }`}
    >
      <div>
        {/* Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="mono-meta text-fcit-goldInk">YEAR:</span>
            <span className="mono-meta font-semibold text-fcit-navyDeep">
              {milestone.year}
            </span>
          </div>

          <span
            className={`mono-meta rounded-full px-2.5 py-0.5 ${
              isVerified
                ? 'bg-fcit-sageSoft text-[#1C4B2C]'
                : 'bg-fcit-lemonSoft text-fcit-goldInk'
            }`}
          >
            {isVerified ? 'VERIFIED ARCHIVE' : 'PENDING ARCHIVE RECORD'}
          </span>
        </div>

        {/* Title & Category */}
        <p className="mono-meta uppercase text-fcit-muted mb-1">ARCHIVE ENTRY</p>
        <h3 className="heading-6 sm:title-1 text-fcit-navyDeep mb-1.5">
          {milestone.title}
        </h3>
        <p className="mono-meta text-fcit-navy mb-3">
          CATEGORY: {milestone.category}
        </p>

        {/* Description */}
        <p
          className={`body-6 text-fcit-secondary ${
            compact ? '' : 'line-clamp-3'
          } mb-3`}
        >
          {milestone.description}
        </p>

        {/* Highlights */}
        {highlights.length > 0 && (
          <ul className="space-y-1.5 mb-2">
            {highlights.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 caption-4 text-fcit-secondary"
              >
                <Sparkle
                  size={13}
                  className="shrink-0 mt-0.5 text-fcit-navy"
                  aria-hidden="true"
                />
                <span className={compact ? '' : 'line-clamp-1'}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Archival Source & Contributors Footer */}
      <div className="pt-2 space-y-1 caption-5 text-fcit-muted">
        {relatedEvents && (
          <p className="truncate">
            <span className="mono-meta text-fcit-navy mr-1.5">RELATED:</span>
            <span>{relatedEvents}</span>
          </p>
        )}
        {contributor && (
          <p className="truncate">
            <span className="mono-meta text-fcit-navy mr-1.5">CONTRIBUTORS:</span>
            <span>{contributor}</span>
          </p>
        )}
        <p className="truncate">
          <span className="mono-meta text-fcit-navy mr-1.5">SOURCE:</span>
          <span>{milestone.historicalSource || 'FCIT Digital Archive'}</span>
        </p>
      </div>
    </article>
  );
}
