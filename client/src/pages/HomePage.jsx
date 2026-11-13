import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  CalendarBlank,
  Compass,
  RocketLaunch,
  Trophy,
} from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { ScrollHero } from '../components/scrolling/ScrollHero';
import { StatementReveal } from '../components/scrolling/StatementReveal';
import { SplitStorySection } from '../components/scrolling/SplitStorySection';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { FacultySection } from '../components/people/FacultySection';
import { TeamSection } from '../components/people/TeamSection';
import { TimelineSection } from '../components/timeline/TimelineSection';
import { EventCard } from '../components/events/EventCard';
import { GalleryGridWithLightbox } from '../components/gallery/GalleryLightbox';
import { FaqAccordion } from '../components/shared/FaqAccordion';
import { Reveal } from '../components/shared/Reveal';
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  FAQ_ITEMS,
  GLANCE_STATEMENTS,
  HOW_IT_WORKS_STEPS,
  PLACEHOLDER_GALLERY_PHOTOS,
  PLACEHOLDER_HISTORY_SLOTS,
} from '../data/verifiedShellContent';

export function HomePage() {
  useDocumentMeta({
    title: 'FCIT · Association of Computer Science and Information Technology, HBTU Kanpur',
    description:
      'Official website of FCIT, the Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur. Explore events, faculty mentors, student team, history archive, projects, and learning resources.',
    canonicalPath: '/',
  });

  // Inject FAQPage structured data for AEO/SEO
  useEffect(() => {
    const scriptId = 'fcit-faq-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, []);

  const eventsRes = useApiResource('/events');
  const facultyRes = useApiResource('/faculty');
  const teamRes = useApiResource('/team');
  const historyRes = useApiResource('/history');
  const achievementsRes = useApiResource('/achievements');
  const projectsRes = useApiResource('/projects');
  const galleryRes = useApiResource('/gallery/images');
  const alumniRes = useApiResource('/alumni');
  const resourcesRes = useApiResource('/resources');

  const upcomingEvents = useMemo(
    () =>
      (eventsRes.data || [])
        .filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
        .slice(0, 3),
    [eventsRes.data]
  );

  const displayEvents = useMemo(() => {
    if (upcomingEvents.length > 0) return upcomingEvents;
    return (eventsRes.data || []).slice(0, 3);
  }, [upcomingEvents, eventsRes.data]);

  const historyList =
    historyRes.data && historyRes.data.length > 0
      ? historyRes.data
      : PLACEHOLDER_HISTORY_SLOTS;

  const galleryList =
    galleryRes.data && galleryRes.data.length > 0
      ? galleryRes.data.slice(0, 6)
      : PLACEHOLDER_GALLERY_PHOTOS;

  return (
    <MainLayout showBowlGlow>
      {/* SCENE ONE: OPENING HERO + SKY CYAN AMBIENT BOWL */}
      <ScrollHero />

      {/* SCENE TWO: CENTERED PINNED STATEMENT + LETTER REVEAL */}
      <StatementReveal />

      {/* SCENE THREE: CAMPUS & COMMUNITY SPLIT STORY + IMAGE SETTLE */}
      <SplitStorySection />

      {/* SECTION 04: FCIT AT A GLANCE */}
      <ScrollSection
        ariaLabelledby="glance-heading"
        tone="cream"
        revealContent={false}
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="mb-12 max-w-[680px]">
            <p className="mono-meta uppercase text-fcit-goldInk mb-3">
              04 · FCIT at a Glance
            </p>
            <h2 id="glance-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
              Built around learning, craft, and shared curiosity.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {GLANCE_STATEMENTS.map((item, idx) => (
              <Reveal key={item.index} delayMs={idx * 85}>
                <div className="h-full rounded-2xl border border-fcit-navy/10 bg-fcit-ivory/70 p-6">
                  <span className="mono-meta text-fcit-goldInk block mb-4">
                    {item.index}
                  </span>
                  <h3 className="heading-5 text-fcit-navyDeep mb-2">{item.title}</h3>
                  <p className="title-3 text-fcit-navy mb-3">{item.subtitle}</p>
                  <p className="body-6 text-fcit-secondary">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* SECTION 05: HOW IT WORKS */}
      <ScrollSection
        ariaLabelledby="how-heading"
        tone="peach"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="mb-12 max-w-[680px]">
            <p className="mono-meta uppercase text-fcit-navy mb-3">
              05 · How It Works
            </p>
            <h2 id="how-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
              Three steps from curiosity to contribution.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((item, idx) => (
              <Reveal key={item.step} delayMs={idx * 85}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-fcit-navy/15 bg-fcit-cream/90 p-6">
                  <div>
                    <span className="mono-meta inline-block rounded-md border border-fcit-navy/15 bg-fcit-ivory px-2.5 py-1 text-fcit-navyDeep mb-4">
                      STEP {item.step}
                    </span>
                    <h3 className="heading-5 text-fcit-navyDeep mb-3">{item.title}</h3>
                    <p className="body-3 text-fcit-secondary">{item.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* SECTION 06: EVENTS */}
      <ScrollSection
        ariaLabelledby="events-heading"
        tone="cream"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="mono-meta uppercase text-fcit-goldInk mb-3">
                06 · Upcoming Events &amp; Gatherings
              </p>
              <h2 id="events-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
                Workshops, coding contests, and symposia.
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
            >
              <CalendarBlank size={16} aria-hidden="true" />
              <span>View All Events</span>
            </Link>
          </Reveal>

          {eventsRes.loading ? (
            <CardGridSkeleton count={3} />
          ) : eventsRes.error ? (
            <ErrorState message={eventsRes.error} onRetry={eventsRes.refetch} />
          ) : displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {displayEvents.map((event, idx) => (
                <Reveal key={event._id} delayMs={idx * 75}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="No upcoming events are published yet"
                description="FCIT coordinators publish verified workshops, coding contests, and department sessions here as schedules are finalized with faculty advisors."
                actionLabel="Explore Events Archive"
                actionHref="/events"
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>

      {/* SECTION 07: FACULTY AND MENTORS (CURVED CAROUSEL) */}
      <FacultySection resource={facultyRes} />

      {/* SECTION 08: MEET OUR FCIT TEAM (CURVED CAROUSEL) */}
      <TeamSection resource={teamRes} />

      {/* SECTION 09: INTERACTIVE FCIT HISTORY ARCHIVE (CONVEYOR + OFFSCREEN-PAUSED PARTICLES) */}
      <ScrollSection
        ariaLabelledby="living-legacy-heading"
        tone="cream"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        {historyRes.loading ? (
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <CardGridSkeleton count={1} columns="md:grid-cols-1" />
          </div>
        ) : (
          <TimelineSection
            milestones={historyList}
            showIntro
            showArchiveLink
            headingId="living-legacy-heading"
          />
        )}
      </ScrollSection>

      {/* SECTION 10: ACHIEVEMENTS AND PROJECTS */}
      <ScrollSection
        ariaLabelledby="work-heading"
        tone="periwinkle"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="mb-10 max-w-[680px]">
            <p className="mono-meta uppercase text-fcit-navy mb-3">
              10 · Achievements &amp; Student Projects
            </p>
            <h2 id="work-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
              Verified outcomes and open engineering builds.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Verified Achievements Column */}
            <Reveal className="rounded-2xl border border-fcit-navy/15 bg-fcit-cream/90 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-fcit-goldInk" aria-hidden="true" />
                  <h3 className="heading-5 text-fcit-navyDeep">Achievements</h3>
                </div>
                <Link
                  to="/achievements"
                  className="button-sm text-fcit-navyDeep hover:underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {achievementsRes.loading ? (
                <CardGridSkeleton count={2} columns="grid-cols-1" />
              ) : achievementsRes.data?.length > 0 ? (
                <div className="space-y-4">
                  {achievementsRes.data.slice(0, 3).map((item) => (
                    <article
                      key={item._id}
                      className="rounded-xl border border-fcit-navy/15 bg-fcit-ivory p-4"
                    >
                      <span className="mono-meta text-fcit-goldInk">
                        {item.year} · {item.category}
                      </span>
                      <h4 className="title-2 text-fcit-navyDeep mt-1 mb-1">{item.title}</h4>
                      <p className="body-6 text-fcit-secondary">{item.summary}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Verified achievements awaiting upload"
                  description="Hackathon honors, competitive programming placements, research publications, and student recognitions appear here once verified by coordinators."
                  actionLabel="Open Achievements"
                  actionHref="/achievements"
                />
              )}
            </Reveal>

            {/* Student Projects Column */}
            <Reveal delayMs={90} className="rounded-2xl border border-fcit-navy/15 bg-fcit-cream/90 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <RocketLaunch size={20} className="text-fcit-navy" aria-hidden="true" />
                  <h3 className="heading-5 text-fcit-navyDeep">Student Projects</h3>
                </div>
                <Link
                  to="/projects"
                  className="button-sm text-fcit-navyDeep hover:underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              {projectsRes.loading ? (
                <CardGridSkeleton count={2} columns="grid-cols-1" />
              ) : projectsRes.data?.length > 0 ? (
                <div className="space-y-4">
                  {projectsRes.data.slice(0, 3).map((proj) => (
                    <article
                      key={proj._id}
                      className="rounded-xl border border-fcit-navy/15 bg-fcit-ivory p-4"
                    >
                      <span className="mono-meta text-fcit-navy">
                        {proj.domain} · {proj.year}
                      </span>
                      <h4 className="title-2 text-fcit-navyDeep mt-1 mb-1">{proj.title}</h4>
                      <p className="body-6 text-fcit-secondary">{proj.summary}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Student engineering projects awaiting publication"
                  description="Open source repositories, campus tools, and academic builds led by HBTU CSE and IT teams can be published through the Admin Dashboard."
                  actionLabel="Browse Projects"
                  actionHref="/projects"
                />
              )}
            </Reveal>
          </div>
        </div>
      </ScrollSection>

      {/* SECTION 11: GALLERY */}
      <ScrollSection
        ariaLabelledby="gallery-heading"
        tone="cream"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div className="max-w-[680px]">
              <p className="mono-meta uppercase text-fcit-goldInk mb-3">
                11 · Campus &amp; Event Gallery
              </p>
              <h2 id="gallery-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
                Authentic photographs from the department.
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft"
            >
              <span>Open Full Gallery</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>

          <GalleryGridWithLightbox photos={galleryList} />
        </div>
      </ScrollSection>

      {/* SECTION 12: ALUMNI & SECTION 13: LEARNING RESOURCES */}
      <ScrollSection
        ariaLabelledby="alumni-resources-heading"
        tone="sage"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 id="alumni-resources-heading" className="sr-only">
            Alumni Network and Learning Resources
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Alumni Network */}
            <Reveal className="lg:col-span-6 rounded-2xl border border-fcit-navy/15 bg-fcit-cream/90 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="mono-meta uppercase text-fcit-goldInk mb-3">
                  12 · Alumni Network
                </p>
                <h3 className="heading-4 text-fcit-navyDeep mb-3">
                  Bridging batches across decades of computing.
                </h3>
                <p className="body-3 text-fcit-secondary mb-6">
                  {alumniRes.data?.length > 0
                    ? `${alumniRes.data.length} verified alumni profiles published for mentorship and career guidance.`
                    : 'This space connects HBTU CSE and IT graduates with current students for mentorship, architectural code reviews, and industry conversations. Verified alumni records appear here as graduates join.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/alumni"
                  className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy"
                >
                  <span>Explore Alumni Network</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                >
                  Connect as Alumnus
                </Link>
              </div>
            </Reveal>

            {/* Learning Resources */}
            <Reveal delayMs={90} className="lg:col-span-6 rounded-2xl border border-fcit-navy/15 bg-fcit-lemonSoft/90 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="mono-meta uppercase text-fcit-navy mb-3">
                  13 · Learning Resources
                </p>
                <h3 className="heading-4 text-fcit-navyDeep mb-3">
                  Structured paths, notes, and preparation tracks.
                </h3>
                <p className="body-3 text-fcit-secondary mb-4">
                  Curated study material organized by FCIT mentors for undergraduate cohorts across HBTU Kanpur.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    'Data Structures & Algorithms',
                    'Development Roadmaps',
                    'Workshop Decks & Code',
                    'Placement Preparation',
                  ].map((track) => (
                    <div
                      key={track}
                      className="rounded-xl border border-fcit-navy/15 bg-fcit-cream/90 p-3 flex items-center gap-2"
                    >
                      <BookOpen size={16} className="text-fcit-navy shrink-0" aria-hidden="true" />
                      <span className="caption-3 text-fcit-navyDeep">{track}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="caption-4 text-fcit-muted">
                  {resourcesRes.data?.length > 0
                    ? `${resourcesRes.data.length} published resources ready`
                    : 'Managed via FCIT Admin Portal'}
                </span>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy"
                >
                  <span>Open Resources</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </ScrollSection>

      {/* SECTION 14: FAQ */}
      <ScrollSection
        ariaLabelledby="faq-heading"
        tone="cream"
        revealContent={false}
        className="py-20 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <Reveal className="mb-10">
            <p className="mono-meta uppercase text-fcit-goldInk mb-3">
              14 · Frequently Asked Questions
            </p>
            <h2 id="faq-heading" className="heading-4 sm:heading-3 text-fcit-navyDeep">
              Clear answers about joining and collaborating with FCIT.
            </h2>
          </Reveal>

          <Reveal>
            <FaqAccordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </ScrollSection>

      {/* SECTION 15: FINAL CTA */}
      <ScrollSection
        ariaLabelledby="final-cta-heading"
        tone="periwinkleStrong"
        revealContent={false}
        className="py-20 sm:py-28"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-8 text-center">
          <Reveal>
            <p className="mono-meta uppercase text-fcit-navy mb-4">
              15 · Join the Community
            </p>
            <h2
              id="final-cta-heading"
              className="heading-3 sm:heading-2 text-fcit-navyDeep mb-6"
            >
              YOUR PLACE IN THE COMMUNITY STARTS HERE.
            </h2>
            <p className="body-2 text-fcit-secondary max-w-[540px] mx-auto mb-8">
              Attend an open workshop, connect with peers across CSE and IT, and build meaningful work together at HBTU Kanpur.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-3 button-md text-fcit-cream shadow-sm transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
            >
              <Compass size={18} aria-hidden="true" />
              <span>Explore FCIT</span>
            </Link>
          </Reveal>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
