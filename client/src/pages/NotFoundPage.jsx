import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { FCIT_IDENTITY } from '../data/verifiedShellContent';

export function NotFoundPage() {
  useDocumentMeta({
    title: 'Page Not Found · FCIT, HBTU Kanpur',
    description: 'The requested page could not be located on the FCIT portal.',
    canonicalPath: '/404',
    noIndex: true,
  });

  return (
    <MainLayout>
      <ScrollSection tone="cream" revealContent={false} className="py-32 sm:py-40">
        <div className="mx-auto max-w-xl px-4 text-center hero-stage-item hero-stage-1">
          <img
            src={FCIT_IDENTITY.logoSrc}
            alt="FCIT Emblem"
            width="80"
            height="80"
            className="mx-auto mb-6 h-20 w-20 rounded-full object-contain"
          />
          <p className="mono-meta uppercase text-fcit-goldInk mb-2">Error 404</p>
          <h1 className="heading-3 sm:heading-2 text-fcit-navyDeep mb-4">
            This page does not exist.
          </h1>
          <p className="body-2 text-fcit-secondary mb-8">
            The route you followed may have moved or is not part of the FCIT directory.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-2 button-md text-fcit-cream hover:bg-fcit-navy transition duration-300 ease-fcit"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-4 py-2 button-md text-fcit-navyDeep hover:bg-fcit-lemonSoft"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
