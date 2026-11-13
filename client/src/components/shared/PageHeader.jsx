import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

export function PageHeader({
  eyebrow,
  title,
  description,
  toneClass = 'bg-fcit-cream',
  backTo = '/',
  backLabel = 'Back to Home',
}) {
  return (
    <section className={`editorial-band ${toneClass} pt-28 pb-12 sm:pt-32 sm:pb-16`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="hero-stage-item hero-stage-1">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-lg border border-fcit-navy/15 bg-fcit-ivory/80 px-3 py-1.5 caption-3 text-fcit-navyDeep mb-6 transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>{backLabel}</span>
          </Link>
        </div>

        {eyebrow && (
          <p className="hero-stage-item hero-stage-2 mono-meta uppercase text-fcit-goldInk mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="hero-stage-item hero-stage-2 heading-3 sm:heading-2 text-fcit-navyDeep max-w-[680px] mb-4">
          {title}
        </h1>
        {description && (
          <p className="hero-stage-item hero-stage-3 body-2 text-fcit-secondary max-w-[640px]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
