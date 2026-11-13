import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { TimelineSection } from '../components/timeline/TimelineSection';
import { CardGridSkeleton, ErrorState } from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PLACEHOLDER_HISTORY_SLOTS } from '../data/verifiedShellContent';

export function HistoryPage() {
  useDocumentMeta({
    title: 'History Archive · FCIT, HBTU Kanpur',
    description:
      'Interactive memory archive preserving verified milestones, historical sources, and campus documentation of FCIT at HBTU Kanpur.',
    canonicalPath: '/history',
  });

  const { data, loading, error, refetch } = useApiResource('/history');
  const hasVerified = Boolean(data && data.length > 0);
  const milestones = hasVerified ? data : PLACEHOLDER_HISTORY_SLOTS;

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Living Memory Archive"
        title="FCIT History Archive"
        description={
          hasVerified
            ? 'Verified milestones, photographs, events, and contributors preserving FCIT memory across graduating batches.'
            : 'Historical dates and founding years are never fabricated. Below are verified campus identity anchors alongside sample visual previews awaiting authentic records.'
        }
        toneClass="bg-fcit-lemonSoft/65"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16 space-y-16">
        {loading ? (
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <CardGridSkeleton count={1} columns="grid-cols-1" />
          </div>
        ) : error ? (
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : (
          <>
            <TimelineSection
              milestones={milestones}
              showIntro
              showArchiveLink={false}
              headingId="history-archive-heading"
            />

            <div className="mx-auto max-w-6xl px-4 sm:px-8">
              <Reveal>
                <h2 className="heading-4 text-fcit-navyDeep mb-6">
                  Complete Chronological Index
                </h2>
              </Reveal>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {milestones.map((item, idx) => (
                  <Reveal
                    key={item._id || idx}
                    as="article"
                    delayMs={Math.min((idx % 2) * 75, 150)}
                    className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="mono-meta text-fcit-goldInk">{item.year}</span>
                      <span className="rounded-full border border-fcit-navy/15 bg-fcit-cream px-2.5 py-0.5 caption-5 text-fcit-secondary">
                        {item.verificationStatus === 'verified'
                          ? 'Verified Record'
                          : 'Pending Verification'}
                      </span>
                    </div>
                    <h3 className="heading-6 text-fcit-navyDeep mb-2">{item.title}</h3>
                    <p className="body-6 text-fcit-secondary mb-3">{item.description}</p>
                    <p className="caption-5 text-fcit-muted">
                      Source: {item.historicalSource || 'FCIT Documentation'}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollSection>
    </MainLayout>
  );
}
