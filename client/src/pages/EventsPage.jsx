import { useMemo, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { EventCard } from '../components/events/EventCard';
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const STATUS_TABS = [
  { key: 'all', label: 'All Events' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Past Archive' },
];

const CATEGORIES = ['all', 'workshop', 'hackathon', 'seminar', 'contest', 'community', 'symposium'];

export function EventsPage() {
  useDocumentMeta({
    title: 'Events · FCIT, HBTU Kanpur',
    description:
      'Upcoming workshops, coding contests, technical talks, and past event archive hosted by FCIT at HBTU Kanpur.',
    canonicalPath: '/events',
  });

  const { data, loading, error, refetch } = useApiResource('/events');
  const [statusTab, setStatusTab] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data || []).filter((item) => {
      if (statusTab !== 'all' && item.status !== statusTab) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (
        q &&
        !`${item.title} ${item.summary} ${item.venue}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [data, statusTab, category, search]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Programs & Gatherings"
        title="Events & Technical Sessions"
        description="Explore upcoming workshops, hackathons, department seminars, and past event records organized by FCIT."
        toneClass="bg-fcit-peachSoft/60"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusTab(tab.key)}
                  className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                    statusTab === tab.key
                      ? 'bg-fcit-navyDeep text-fcit-cream'
                      : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
                  placeholder="Search events or venues"
                  aria-label="Search events"
                  className="w-full sm:w-56 rounded-lg border border-fcit-navy/20 bg-fcit-ivory py-2 pl-9 pr-3 body-6 text-fcit-ink placeholder:text-fcit-muted"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by event category"
                className="rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 body-6 text-fcit-ink capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          {loading ? (
            <CardGridSkeleton count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, idx) => (
                <Reveal key={event._id} delayMs={Math.min((idx % 3) * 70, 210)}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="No matching events found"
                description="No published events match the active filter. Upcoming schedules and past records are published by FCIT coordinators via the Admin Dashboard."
                actionLabel="Reset Filters"
                onAction={() => {
                  setStatusTab('all');
                  setCategory('all');
                  setSearch('');
                }}
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
