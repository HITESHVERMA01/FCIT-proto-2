import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { ProfileCarousel } from '../components/people/ProfileCarousel';
import { ProfileCard } from '../components/people/ProfileCard';
import { ErrorState, ProfileSkeletonGrid } from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PLACEHOLDER_FACULTY_SLOTS } from '../data/verifiedShellContent';

export function FacultyPage() {
  useDocumentMeta({
    title: 'Faculty and Mentors · FCIT, HBTU Kanpur',
    description:
      'Verified faculty mentors and academic advisors supporting FCIT in the Department of CSE and IT at HBTU Kanpur.',
    canonicalPath: '/faculty',
  });

  const { data, loading, error, refetch } = useApiResource('/faculty');
  const [filterRole, setFilterRole] = useState('All');

  const hasVerified = Boolean(data && data.length > 0);
  const baseList = hasVerified ? data : PLACEHOLDER_FACULTY_SLOTS;

  const designations = useMemo(() => {
    const unique = new Set(['All']);
    baseList.forEach((p) => {
      if (p.designation?.includes('Head')) unique.add('Head of Department');
      else if (p.designation?.includes('Associate')) unique.add('Associate Professor');
      else if (p.designation?.includes('Assistant')) unique.add('Assistant Professor');
      else if (p.designation?.includes('Professor')) unique.add('Professor');
      else unique.add('Advisor');
    });
    return Array.from(unique);
  }, [baseList]);

  const filtered = useMemo(() => {
    if (filterRole === 'All') return baseList;
    return baseList.filter((p) =>
      p.designation?.toLowerCase().includes(filterRole.toLowerCase())
    );
  }, [baseList, filterRole]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Academic Mentorship"
        title="Faculty and Mentors"
        description={
          hasVerified
            ? 'Faculty advisors and educators supporting FCIT initiatives across Computer Science and Information Technology.'
            : 'Official faculty profiles are verified and published by the FCIT administration. Until individual photographs and credentials are supplied, architectural portrait plates display reserved departmental designations.'
        }
        toneClass="bg-fcit-sageSoft/80"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap items-center gap-2 mb-8">
            {designations.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilterRole(label)}
                className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                  filterRole === label
                    ? 'bg-fcit-navyDeep text-fcit-cream'
                    : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                }`}
              >
                {label}
              </button>
            ))}
          </Reveal>

          {loading ? (
            <ProfileSkeletonGrid count={6} />
          ) : error && filtered.length === 0 ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : (
            <>
              {error && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-800/20 bg-amber-50/80 px-4 py-3 text-amber-900">
                  <div className="flex items-center gap-2">
                    <Info size={18} className="shrink-0 text-amber-800" aria-hidden="true" />
                    <p className="body-6 text-amber-900">
                      Connecting to live directory... Displaying reserved departmental structure slots.
                    </p>
                  </div>
                  {refetch && (
                    <button
                      type="button"
                      onClick={refetch}
                      className="button-sm rounded-lg border border-amber-800/30 bg-white px-3 py-1 text-xs text-amber-900 transition hover:bg-amber-100"
                    >
                      Retry sync
                    </button>
                  )}
                </div>
              )}
              {filtered.length >= 3 && (
                <div className="mb-14">
                  <Reveal>
                    <p className="mono-meta uppercase text-fcit-goldInk mb-4">
                      Interactive Faculty Showcase
                    </p>
                  </Reveal>
                  <ProfileCarousel
                    items={filtered}
                    ariaLabel="FCIT faculty mentors directory carousel"
                    renderCard={(person, idx) => (
                      <ProfileCard
                        person={person}
                        variantIndex={idx}
                        mode="faculty"
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
                  {filtered.map((person, idx) => (
                    <Reveal key={person._id} delayMs={Math.min((idx % 3) * 70, 210)}>
                      <ProfileCard
                        person={person}
                        variantIndex={idx}
                        mode="faculty"
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
