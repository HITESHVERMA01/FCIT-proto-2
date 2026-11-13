import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, GraduationCap, UsersThree } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useScrollTarget } from '../hooks/useScrollDirector';
import { computeElementProgress } from '../animations/scroll/scrollProgress';
import { easeDecel } from '../animations/scroll/interpolate';
import { FCIT_IDENTITY } from '../data/verifiedShellContent';

export function AboutPage() {
  useDocumentMeta({
    title: 'About FCIT · Association of Computer Science and Information Technology, HBTU Kanpur',
    description:
      'Learn about FCIT, the student and faculty computing community at Harcourt Butler Technical University, Kanpur.',
    canonicalPath: '/about',
  });

  const mediaSectionRef = useRef(null);
  const photoRef = useRef(null);

  useScrollTarget(
    mediaSectionRef,
    ({ rect, viewportHeight, reducedMotion }) => {
      const el = photoRef.current;
      if (!el) return;
      if (reducedMotion) {
        el.style.transform = 'scale(1)';
        return;
      }
      const p = computeElementProgress(rect, viewportHeight, 0.95, 0.25);
      const scale = 1.045 - easeDecel(p) * 0.045;
      el.style.transform = `scale(${scale.toFixed(4)})`;
    },
    []
  );

  return (
    <MainLayout>
      <PageHeader
        eyebrow="About the Association"
        title="Where technical inquiry and student community meet."
        description="FCIT is the official Association of Computer Science and Information Technology within Harcourt Butler Technical University, Kanpur."
        toneClass="bg-fcit-lemonSoft/65"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-16 sm:py-20">
        <div ref={mediaSectionRef} className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center mb-16">
            <Reveal className="lg:col-span-6">
              <div className="overflow-hidden rounded-3xl bg-fcit-sageSoft/50 shadow-[0_20px_54px_-24px_rgba(11,39,71,0.20)]">
                <div ref={photoRef} className="will-change-transform origin-center">
                  <img
                    src={FCIT_IDENTITY.buildingSrc}
                    alt="Computer Science and Engineering Department building at HBTU Kanpur"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={80} className="lg:col-span-6 space-y-4">
              <h2 className="heading-4 text-fcit-navyDeep">
                Rooted in the Department of CSE and IT.
              </h2>
              <p className="body-3 text-fcit-secondary">
                Computing education flourishes beyond lecture halls when students collaborate across cohorts, examine real systems together, and share hard won knowledge openly. FCIT serves as the departmental forum uniting undergraduate learners, student coordinators, alumni, and faculty mentors at HBTU Kanpur.
              </p>
              <p className="body-3 text-fcit-muted">
                Every initiative hosted by FCIT is built around clarity, academic integrity, and practical engineering craft: from structured programming workshops and research conversations to community software projects.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
            {[
              {
                icon: Code,
                title: 'Practical Engineering',
                text: 'Focused sessions covering data structures, software design, Linux tooling, web systems, and foundational computer science.',
              },
              {
                icon: UsersThree,
                title: 'Peer Mentorship',
                text: 'Seniors, coordinators, and student mentors guide incoming batches through coursework, projects, and collaborative team workflows.',
              },
              {
                icon: GraduationCap,
                title: 'Faculty Stewardship',
                text: 'Departmental advisors ensure continuity across graduating batches and connect student ideas with academic research.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delayMs={idx * 75}>
                  <div className="h-full rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-6">
                    <Icon size={24} className="text-fcit-navy mb-4" aria-hidden="true" />
                    <h3 className="heading-6 text-fcit-navyDeep mb-2">{pillar.title}</h3>
                    <p className="body-6 text-fcit-secondary">{pillar.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-sageSoft p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={FCIT_IDENTITY.logoSrc}
                  alt="Official FCIT emblem"
                  width="64"
                  height="64"
                  className="h-16 w-16 rounded-full object-contain shrink-0"
                />
                <div>
                  <h3 className="heading-5 text-fcit-navyDeep">Get involved with upcoming sessions</h3>
                  <p className="body-6 text-fcit-secondary">
                    Browse open events, team records, or contact the association desk.
                  </p>
                </div>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream hover:bg-fcit-navy transition duration-300 ease-fcit shrink-0"
              >
                <span>Browse Events</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
