import { Link } from 'react-router-dom';
import { Info } from '@phosphor-icons/react';
import { Reveal } from '../shared/Reveal';
import {
  EmptyState,
  ErrorState,
  ProfileSkeletonGrid,
} from '../shared/StateViews';
import { ProfileCarousel } from './ProfileCarousel';
import { ProfileCard } from './ProfileCard';

/**
 * Shared Section Container for Faculty & Student Team showcases.
 * Inherits surrounding editorial continuity, Reveal motion, loading/error states,
 * graceful empty state disclosure, and the unified curved carousel.
 */
export function PeopleSection({
  headingId,
  eyebrow,
  heading,
  description,
  emptyNotice,
  emptyCtaLabel,
  emptyCtaHref,
  actionLabel,
  actionHref,
  ActionIcon,
  toneClass = 'bg-fcit-sageSoft/70',
  mode = 'faculty',
  resource,
  fallbackSlots = [],
  carouselAriaLabel,
}) {
  const { data, loading, error, refetch } = resource || {};
  const hasRealRecords = Boolean(Array.isArray(data) && data.length > 0);
  const displayItems = hasRealRecords ? data : fallbackSlots;

  return (
    <section
      aria-labelledby={headingId}
      className={`editorial-band ${toneClass} py-20 sm:py-24 overflow-hidden`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="max-w-[680px]">
            <p className="mono-meta uppercase text-fcit-navy mb-3">{eyebrow}</p>
            <h2
              id={headingId}
              className="heading-4 sm:heading-3 text-fcit-navyDeep mb-3"
            >
              {heading}
            </h2>
            <p className="body-3 text-fcit-secondary">{description}</p>
          </div>

          {actionLabel && actionHref && (
            <Link
              to={actionHref}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-ivory"
            >
              {ActionIcon && <ActionIcon size={16} aria-hidden="true" />}
              <span>{actionLabel}</span>
            </Link>
          )}
        </Reveal>

        {!loading && !error && !hasRealRecords && emptyNotice && (
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-fcit-navy/15 bg-fcit-cream/85 px-4 py-3">
            <Info size={18} className="shrink-0 text-fcit-navy" aria-hidden="true" />
            <p className="body-6 text-fcit-secondary">{emptyNotice}</p>
          </div>
        )}

        {loading ? (
          <ProfileSkeletonGrid count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : displayItems.length === 0 ? (
          <EmptyState
            title={`No ${mode === 'faculty' ? 'faculty' : 'student team'} profiles published yet`}
            description={emptyNotice}
            actionLabel={emptyCtaLabel}
            actionHref={emptyCtaHref}
          />
        ) : (
          <ProfileCarousel
            items={displayItems}
            ariaLabel={carouselAriaLabel}
            renderCard={(person, idx) => (
              <ProfileCard
                person={person}
                variantIndex={idx}
                mode={mode}
                portraitAspect="aspect-[4/5]"
              />
            )}
          />
        )}
      </div>
    </section>
  );
}
