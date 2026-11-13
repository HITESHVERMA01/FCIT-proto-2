import { Link } from 'react-router-dom';
import { ArrowClockwise, FolderOpen, WarningCircle, CheckCircle } from '@phosphor-icons/react';

export function CardGridSkeleton({ count = 3, columns = 'md:grid-cols-3' }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${columns}`} aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/60 p-4 animate-pulse"
        >
          <div className="aspect-[16/10] w-full rounded-xl bg-fcit-navy/10 mb-4" />
          <div className="h-4 w-24 rounded bg-fcit-navy/10 mb-3" />
          <div className="h-6 w-3/4 rounded bg-fcit-navy/15 mb-2" />
          <div className="h-4 w-full rounded bg-fcit-navy/10 mb-1" />
          <div className="h-4 w-2/3 rounded bg-fcit-navy/10" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Loading profiles">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/60 p-4 animate-pulse"
        >
          <div className="aspect-[4/5] w-full rounded-xl bg-fcit-navy/10 mb-4" />
          <div className="h-5 w-2/3 rounded bg-fcit-navy/15 mb-2" />
          <div className="h-4 w-1/2 rounded bg-fcit-navy/10" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, actionLabel, onAction, actionHref }) {
  return (
    <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/70 p-8 text-center max-w-2xl mx-auto">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-fcit-navy/15 bg-fcit-cream text-fcit-navy">
        <FolderOpen size={24} weight="regular" aria-hidden="true" />
      </div>
      <h3 className="heading-5 text-fcit-navyDeep mb-2">{title}</h3>
      <p className="body-3 text-fcit-secondary mb-6">{description}</p>
      {actionHref && actionLabel && (
        actionHref.startsWith('/') ? (
          <Link
            to={actionHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
          >
            {actionLabel}
          </Link>
        ) : (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
          >
            {actionLabel}
          </a>
        )
      )}
      {onAction && actionLabel && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-900/25 bg-[#F6E2E0] p-6 text-left max-w-2xl mx-auto"
    >
      <div className="flex items-start gap-3">
        <WarningCircle size={24} className="shrink-0 text-[#8C1D18] mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="body-1 text-[#8C1D18] mb-1">Content could not be loaded</p>
          <p className="body-6 text-[#5E1612] mb-4">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-lg border border-[#8C1D18]/30 bg-fcit-cream px-3 py-2 button-sm text-[#8C1D18] transition duration-300 ease-fcit hover:bg-white active:scale-[0.98]"
            >
              <ArrowClockwise size={16} aria-hidden="true" />
              Retry loading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function StatusBanner({ type = 'success', message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        isError
          ? 'border-[#8C1D18]/30 bg-[#F6E2E0] text-[#8C1D18]'
          : 'border-[#1C4B2C]/25 bg-[#E9EBE0] text-[#1C4B2C]'
      }`}
    >
      {isError ? (
        <WarningCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <CheckCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <p className="body-5">{message}</p>
    </div>
  );
}
