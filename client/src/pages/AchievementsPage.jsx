import { useMemo, useState } from 'react';
import { ArrowUpRight, Trophy } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { resolveMediaUrl } from '../services/api';

const CATEGORIES = ['all', 'hackathon', 'competition', 'research', 'publication', 'initiative'];

export function AchievementsPage() {
  useDocumentMeta({
    title: 'Achievements · FCIT, HBTU Kanpur',
    description:
      'Verified hackathon honors, competitive programming milestones, research, and publications by HBTU Kanpur CSE & IT students.',
    canonicalPath: '/achievements',
  });

  const { data, loading, error, refetch } = useApiResource('/achievements');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    if (category === 'all') return data || [];
    return (data || []).filter((item) => item.category === category);
  }, [data, category]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Verified Honors"
        title="Achievements & Recognitions"
        description="Hackathon honors, technical competitions, academic research, publications, and student led initiatives published with verified attribution."
        toneClass="bg-fcit-periwinkle/35"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-2 button-sm capitalize transition duration-300 ease-fcit ${
                  category === cat
                    ? 'bg-fcit-navyDeep text-fcit-cream'
                    : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                }`}
              >
                {cat}
              </button>
            ))}
          </Reveal>

          {loading ? (
            <CardGridSkeleton count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, idx) => (
                <Reveal
                  key={item._id}
                  as="article"
                  delayMs={Math.min((idx % 3) * 70, 210)}
                  className="flex flex-col justify-between rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-5"
                >
                  <div>
                    {item.image && (
                      <img
                        src={resolveMediaUrl(item.image)}
                        alt={item.imageAlt || item.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded-xl object-cover mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="mono-meta uppercase text-fcit-goldInk">
                        {item.category}
                      </span>
                      <span className="caption-4 text-fcit-muted">{item.year}</span>
                    </div>
                    <h2 className="heading-6 text-fcit-navyDeep mb-2">{item.title}</h2>
                    <p className="body-6 text-fcit-secondary mb-4">{item.summary}</p>
                    {Array.isArray(item.recipients) && item.recipients.length > 0 && (
                      <p className="caption-3 text-fcit-navy mb-3">
                        Recipients: {item.recipients.join(', ')}
                      </p>
                    )}
                  </div>

                  {item.proofUrl && (
                    <a
                      href={item.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 button-sm text-fcit-navyDeep hover:underline underline-offset-4"
                    >
                      <Trophy size={15} aria-hidden="true" />
                      <span>View Reference</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="No verified achievements published in this category"
                description="FCIT never invents student honors or placement figures. Coordinators can upload verified certificates and publications through the Admin Dashboard."
                actionLabel="Contact Coordinators"
                actionHref="/contact"
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
