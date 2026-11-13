import { LinkedinLogo } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { ArchitecturalPortrait } from '../components/shared/ArchitecturalPortrait';
import {
  EmptyState,
  ErrorState,
  ProfileSkeletonGrid,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function AlumniPage() {
  useDocumentMeta({
    title: 'Alumni Network · FCIT, HBTU Kanpur',
    description:
      'Connect with HBTU Kanpur Computer Science and Information Technology alumni supporting student mentorship and career conversations.',
    canonicalPath: '/alumni',
  });

  const { data, loading, error, refetch } = useApiResource('/alumni');

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Graduate Community"
        title="FCIT Alumni Network"
        description="Verified graduates from HBTU Kanpur sharing engineering experience, research paths, and mentorship with current students."
        toneClass="bg-fcit-sageSoft/75"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          {loading ? (
            <ProfileSkeletonGrid count={4} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((alum, idx) => (
                <Reveal
                  key={alum._id}
                  as="article"
                  delayMs={Math.min((idx % 3) * 70, 210)}
                  className="flex flex-col justify-between rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-4"
                >
                  <div>
                    <ArchitecturalPortrait
                      src={alum.photo}
                      alt={alum.photoAlt || `${alum.name}, ${alum.currentRole}`}
                      variant={idx}
                      className="rounded-xl mb-4"
                    />
                    <span className="mono-meta text-fcit-goldInk">
                      Batch {alum.graduationYear} · {alum.degree}
                    </span>
                    <h2 className="heading-6 text-fcit-navyDeep mt-1">{alum.name}</h2>
                    <p className="body-4 text-fcit-navy mb-2">
                      {alum.currentRole} · {alum.organization}
                    </p>
                    {alum.story && (
                      <p className="body-6 text-fcit-secondary mb-4">{alum.story}</p>
                    )}
                    {Array.isArray(alum.mentorshipAreas) && alum.mentorshipAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {alum.mentorshipAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-md border border-fcit-navy/15 bg-fcit-cream px-2 py-0.5 caption-5 text-fcit-secondary"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {alum.linkedin && (
                    <a
                      href={alum.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 button-sm text-fcit-navyDeep hover:underline underline-offset-4 mt-2"
                    >
                      <LinkedinLogo size={16} aria-hidden="true" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="Alumni directory open for verified entries"
                description="FCIT does not fabricate alumni identities or testimonials. HBTU CSE and IT graduates interested in mentoring students or speaking at campus sessions can share their verified details with the association."
                actionLabel="Connect as an Alumnus"
                actionHref="/contact"
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
