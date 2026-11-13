import { useMemo, useState } from 'react';
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
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
import { resolveMediaUrl } from '../services/api';

export function ProjectsPage() {
  useDocumentMeta({
    title: 'Student Projects · FCIT, HBTU Kanpur',
    description:
      'Open source tools, software engineering projects, and technical research builds by CSE & IT students at HBTU Kanpur.',
    canonicalPath: '/projects',
  });

  const { data, loading, error, refetch } = useApiResource('/projects');
  const [domain, setDomain] = useState('All');

  const domains = useMemo(() => {
    const s = new Set(['All']);
    (data || []).forEach((p) => p.domain && s.add(p.domain));
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    if (domain === 'All') return data || [];
    return (data || []).filter((p) => p.domain === domain);
  }, [data, domain]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Engineering Showcase"
        title="Student Projects"
        description="Practical applications, systems tooling, and academic prototypes engineered by students across HBTU Kanpur."
        toneClass="bg-fcit-sageSoft/70"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap gap-2 mb-8">
            {domains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => setDomain(dom)}
                className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                  domain === dom
                    ? 'bg-fcit-navyDeep text-fcit-cream'
                    : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                }`}
              >
                {dom}
              </button>
            ))}
          </Reveal>

          {loading ? (
            <CardGridSkeleton count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((proj, idx) => (
                <Reveal
                  key={proj._id}
                  as="article"
                  delayMs={Math.min((idx % 3) * 70, 210)}
                  className="flex flex-col justify-between rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-5"
                >
                  <div>
                    {proj.thumbnail && (
                      <img
                        src={resolveMediaUrl(proj.thumbnail)}
                        alt={proj.thumbnailAlt || proj.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded-xl object-cover mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="mono-meta text-fcit-goldInk">{proj.domain}</span>
                      <span className="caption-4 text-fcit-muted">{proj.year}</span>
                    </div>
                    <h2 className="heading-6 text-fcit-navyDeep mb-2">{proj.title}</h2>
                    <p className="body-6 text-fcit-secondary mb-4">{proj.summary}</p>

                    {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-fcit-navy/15 bg-fcit-cream px-2 py-0.5 caption-5 text-fcit-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {Array.isArray(proj.authors) && proj.authors.length > 0 && (
                      <span className="caption-4 text-fcit-muted">
                        {proj.authors.join(', ')}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {proj.repositoryUrl && (
                        <a
                          href={proj.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                        >
                          <GithubLogo size={14} aria-hidden="true" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-fcit-navyDeep px-2.5 py-1.5 caption-3 text-fcit-cream hover:bg-fcit-navy"
                        >
                          <span>Demo</span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <EmptyState
                title="Student projects awaiting publication"
                description="Students building tools, research artifacts, or open source repositories can submit entries to FCIT coordinators for publication."
                actionLabel="Submit a Project Inquiry"
                actionHref="/contact"
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
