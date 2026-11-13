import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, MagnifyingGlass } from '@phosphor-icons/react';
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

const RESOURCE_CATEGORIES = [
  { key: 'all', label: 'All Tracks' },
  { key: 'dsa', label: 'DSA & Algorithms' },
  { key: 'roadmap', label: 'Roadmaps' },
  { key: 'workshop', label: 'Workshop Decks' },
  { key: 'notes', label: 'Department Notes' },
  { key: 'placement', label: 'Placement Prep' },
  { key: 'reference', label: 'References' },
];

export function ResourcesPage() {
  useDocumentMeta({
    title: 'Learning Resources · FCIT, HBTU Kanpur',
    description:
      'DSA guides, programming roadmaps, workshop materials, study notes, and placement preparation references curated by FCIT.',
    canonicalPath: '/resources',
  });

  const { data, loading, error, refetch } = useApiResource('/resources');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data || []).filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (
        q &&
        !`${r.title} ${r.description} ${(r.tags || []).join(' ')}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [data, category, search]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Open Study Material"
        title="Learning Resources"
        description="Structured DSA practice tracks, software roadmaps, workshop slides, notes, and placement guides published by FCIT mentors."
        toneClass="bg-fcit-lemonSoft/75"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {RESOURCE_CATEGORIES.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategory(tab.key)}
                  className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                    category === tab.key
                      ? 'bg-fcit-navyDeep text-fcit-cream'
                      : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fcit-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics or tags"
                aria-label="Search learning resources"
                className="w-full sm:w-64 rounded-lg border border-fcit-navy/20 bg-fcit-ivory py-2 pl-9 pr-3 body-6 text-fcit-ink"
              />
            </div>
          </Reveal>

          {loading ? (
            <CardGridSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((res, idx) => (
                <Reveal
                  key={res._id}
                  as="article"
                  delayMs={Math.min((idx % 3) * 70, 210)}
                  className="flex flex-col justify-between rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="mono-meta uppercase text-fcit-goldInk">
                        {res.category}
                      </span>
                      <span className="rounded-full border border-fcit-navy/15 bg-fcit-cream px-2.5 py-0.5 caption-5 capitalize text-fcit-secondary">
                        {res.level}
                      </span>
                    </div>
                    <h2 className="heading-6 text-fcit-navyDeep mb-2">{res.title}</h2>
                    <p className="body-6 text-fcit-secondary mb-4">{res.description}</p>

                    {Array.isArray(res.tags) && res.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {res.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-fcit-navy/15 bg-fcit-cream px-2 py-0.5 caption-5 text-fcit-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="caption-5 text-fcit-muted">
                      {res.contributor ? `By ${res.contributor}` : 'FCIT Curriculum'}
                    </span>
                    {(res.resourceUrl || res.fileUrl) && (
                      <a
                        href={res.resourceUrl || res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-fcit-navyDeep px-3 py-1.5 button-sm text-fcit-cream hover:bg-fcit-navy"
                      >
                        <BookOpen size={14} aria-hidden="true" />
                        <span>Open</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="No learning resources published in this track yet"
                description="FCIT coordinators and faculty mentors publish verified DSA sheets, workshop slides, and department notes directly through the Admin Dashboard."
                actionLabel="Request a Resource Topic"
                actionHref="/contact"
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
