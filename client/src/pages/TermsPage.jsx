import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function TermsPage() {
  useDocumentMeta({
    title: 'Terms and Conditions · FCIT, HBTU Kanpur',
    description: 'Guidelines for participating in FCIT activities and using association resources.',
    canonicalPath: '/terms-and-conditions',
  });

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Governance & Terms"
        title="Terms and Conditions"
        description="Community standards and institutional notices for students, mentors, and visitors using the FCIT platform."
        toneClass="bg-fcit-cream"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 space-y-6">
          <Reveal className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">1. Institutional Scope</h2>
            <p className="body-3 text-fcit-secondary">
              This platform serves the academic and technical community of the Association of Computer Science and Information Technology (FCIT) at Harcourt Butler Technical University, Kanpur. Event schedules, learning materials, and team announcements remain subject to official departmental oversight.
            </p>
          </Reveal>

          <Reveal delayMs={70} className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">2. Respectful Conduct &amp; Academic Integrity</h2>
            <p className="body-3 text-fcit-secondary">
              Participants in workshops, contests, project repositories, and public forums agree to uphold respectful academic discourse, truthful attribution of work, and safe handling of university facilities.
            </p>
          </Reveal>

          <Reveal delayMs={140} className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">3. Emblem &amp; Brand Assets</h2>
            <p className="body-3 text-fcit-secondary">
              The official FCIT shield emblem represents the Association of Computer Science and Information Technology, HBTU Kanpur, and may not be altered or used for unauthorized commercial representation.
            </p>
          </Reveal>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
