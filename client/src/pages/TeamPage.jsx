import { useMemo, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { ProfileCarousel } from '../components/people/ProfileCarousel';
import { ProfileCard } from '../components/people/ProfileCard';
import { ErrorState, ProfileSkeletonGrid } from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PLACEHOLDER_TEAM_SLOTS } from '../data/verifiedShellContent';

export function TeamPage() {
  useDocumentMeta({
    title: 'FCIT Student Team · HBTU Kanpur',
    description:
      'Meet the student coordinators, technical leads, and organizers steering FCIT at HBTU Kanpur.',
    canonicalPath: '/team',
  });

  const { data, loading, error, refetch } = useApiResource('/team');
  const [selectedYear, setSelectedYear] = useState('All');

  const hasVerified = Boolean(data && data.length > 0);
  const baseList = hasVerified ? data : PLACEHOLDER_TEAM_SLOTS;

  const years = useMemo(() => {
    const set = new Set(['All']);
    baseList.forEach((m) => {
      if (m.academicYear) set.add(m.academicYear);
    });
    return Array.from(set);
  }, [baseList]);

  const filtered = useMemo(() => {
    if (selectedYear === 'All') return baseList;
    return baseList.filter((m) => m.academicYear === selectedYear);
  }, [baseList, selectedYear]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Student Leadership"
        title="BUILT BY STUDENTS. UNITED BY IDEAS."
        description={
          hasVerified
            ? 'Student coordinators leading workshops, hackathons, engineering sprints, and documentation across FCIT.'
            : 'Official student team rosters are published per academic session via the Admin Dashboard. The architectural placeholders below preserve verified leadership roles awaiting roster publication.'
        }
        toneClass="bg-fcit-roseSoft/80"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {years.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                    selectedYear === yr
                      ? 'bg-fcit-navyDeep text-fcit-cream'
                      : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <ProfileSkeletonGrid count={4} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : (
            <>
              {filtered.length >= 3 && (
                <div className="mb-14">
                  <Reveal>
                    <p className="mono-meta uppercase text-fcit-goldInk mb-4">
                      Interactive Cohort Showcase
                    </p>
                  </Reveal>
                  <ProfileCarousel
                    items={filtered}
                    ariaLabel="FCIT student team showcase"
                    renderCard={(member, idx) => (
                      <ProfileCard
                        person={member}
                        variantIndex={idx}
                        mode="team"
                        portraitAspect="aspect-[4/5]"
                      />
                    )}
                  />
                </div>
              )}

              <div>
                <Reveal>
                  <p className="mono-meta uppercase text-fcit-navy mb-4">
                    Complete Directory View
                  </p>
                </Reveal>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((member, idx) => (
                    <Reveal key={member._id} delayMs={Math.min((idx % 3) * 70, 210)}>
                      <ProfileCard
                        person={member}
                        variantIndex={idx}
                        mode="team"
                        portraitAspect="aspect-[4/5]"
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
