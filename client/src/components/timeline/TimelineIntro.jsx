import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

/**
 * Editorial introduction header for the FCIT Living Legacy Timeline.
 * Uses a two-column composition: left display headline, right context + exploration cue.
 */
export function TimelineIntro({
  showArchiveLink = true,
  headingId = 'living-legacy-heading',
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-8 mb-10 sm:mb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-6">
          <p className="mono-meta uppercase text-fcit-goldInk mb-3">
            FCIT · A LIVING LEGACY
          </p>
          <h2
            id={headingId}
            className="heading-3 sm:heading-2 text-fcit-navyDeep"
          >
            Every year leaves a story.
          </h2>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <p className="body-3 text-fcit-secondary">
            From the people who built our community to the moments that shaped its journey,
            explore the history of FCIT through an evolving archive of memories and milestones.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="caption-4 text-fcit-muted">
              Hover to slow drift, drag across the central scanner to resolve or reconstruct records.
            </p>

            {showArchiveLink && (
              <Link
                to="/history"
                className="inline-flex items-center gap-1.5 rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
              >
                <span>Explore Full Archive</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
