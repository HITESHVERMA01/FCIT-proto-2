import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export function PrivacyPolicyPage() {
  useDocumentMeta({
    title: 'Privacy Policy · FCIT, HBTU Kanpur',
    description: 'How FCIT handles student event registrations, contact messages, and session cookies.',
    canonicalPath: '/privacy-policy',
  });

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Governance & Privacy"
        title="Privacy Policy"
        description="Transparent standards governing student submissions, authentication cookies, and archival photographs on the FCIT portal."
        toneClass="bg-fcit-cream"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 space-y-6">
          <Reveal className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">1. Information We Collect</h2>
            <p className="body-3 text-fcit-secondary">
              The public FCIT website does not embed commercial third party advertising trackers or paid analytics scripts. We collect only information voluntarily provided when registering for an event (such as name, email, roll number, branch, and academic year) or submitting an inquiry on the Contact page.
            </p>
          </Reveal>

          <Reveal delayMs={70} className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">2. Authentication Cookies</h2>
            <p className="body-3 text-fcit-secondary">
              Authorized coordinators, faculty advisors, and registered users receive an HTTP only session cookie strictly for authenticating dashboard access and preventing unauthorized access. Public visitors browsing pages do not require tracking cookies.
            </p>
          </Reveal>

          <Reveal delayMs={140} className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6 space-y-4">
            <h2 className="heading-5 text-fcit-navyDeep">3. Institutional Photographs &amp; Records</h2>
            <p className="body-3 text-fcit-secondary">
              Photographs, project credits, faculty details, and historical milestones published on FCIT are curated by verified association administrators. Individuals wishing to update or remove an archival entry or profile record may reach out via the Contact page.
            </p>
          </Reveal>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
