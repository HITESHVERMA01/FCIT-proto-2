import {
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from '@phosphor-icons/react';
import { ProfilePortrait } from './ProfilePortrait';

function formatQualifications(q) {
  if (!q) return '';
  if (Array.isArray(q)) return q.filter(Boolean).join(' · ');
  return String(q);
}

/**
 * Editorial Profile Card supporting Faculty Mentors and Student Team Members.
 * - Consistent 4:5 portrait ratio with automatic monochrome geometric silhouette placeholder
 * - Clean surface inheriting global theme with restrained hairline accent
 */
export function ProfileCard({
  person,
  variantIndex = 0,
  mode = 'team',
  portraitAspect = 'aspect-[4/5]',
}) {
  const isFaculty = mode === 'faculty';
  const isPending =
    person.verificationStatus === 'pending_verification' || person.isPlaceholder;
  const qualificationsText = formatQualifications(person.qualifications);
  const showPublicEmail = Boolean(
    !isFaculty && !isPending && person.email && person.showEmailPublicly
  );

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-fcit-navy/12 bg-fcit-cream/75 p-3 transition duration-300 ease-fcit hover:border-fcit-navy/30 hover:bg-fcit-cream">
      <ProfilePortrait
        src={person.photo}
        alt={person.photoAlt || `${person.name}, ${person.designation}`}
        variant={variantIndex}
        objectPosition={person.photoPosition || 'object-top'}
        aspectClass={portraitAspect}
        className="rounded-xl mb-3 border border-fcit-navy/10"
      />

      <div className="flex flex-1 flex-col justify-between px-1 pb-1">
        <div>
          {isPending && (
            <span className="inline-block rounded-full border border-fcit-navy/15 bg-fcit-lemonSoft px-2 py-0.5 caption-5 text-fcit-secondary mb-1.5">
              Pending Verification
            </span>
          )}
          <h3 className="title-2 text-fcit-navyDeep mb-1">{person.name}</h3>
          <p className="body-4 text-fcit-goldInk mb-1">{person.designation}</p>
          {person.department && (
            <p className="caption-4 text-fcit-muted mb-2">{person.department}</p>
          )}

          {isFaculty ? (
            <>
              {qualificationsText && (
                <p className="body-6 text-fcit-secondary mb-2.5 line-clamp-2">
                  {qualificationsText}
                </p>
              )}
              {Array.isArray(person.expertise) && person.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {person.expertise.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-fcit-navy/12 bg-fcit-ivory px-2 py-0.5 caption-5 text-fcit-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {person.introduction && (
                <p className="body-6 text-fcit-secondary mb-3 line-clamp-2">
                  {person.introduction}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="mono-meta text-fcit-muted">
            {isFaculty ? 'HBTU FACULTY' : person.academicYear || 'FCIT COHORT'}
          </span>

          <div className="flex items-center gap-1.5">
            {showPublicEmail && (
              <a
                href={`mailto:${person.email}`}
                aria-label={`Email ${person.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft transition duration-300 ease-fcit"
              >
                <EnvelopeSimple size={15} aria-hidden="true" />
              </a>
            )}
            {person.github && (
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} GitHub profile`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft transition duration-300 ease-fcit"
              >
                <GithubLogo size={15} aria-hidden="true" />
              </a>
            )}
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} LinkedIn profile`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft transition duration-300 ease-fcit"
              >
                <LinkedinLogo size={15} aria-hidden="true" />
              </a>
            )}
            {isFaculty && person.profileUrl && (
              <a
                href={person.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} institutional profile`}
                className="inline-flex items-center gap-1 rounded-lg border border-fcit-navy/15 bg-fcit-ivory px-2 py-1 caption-4 text-fcit-navyDeep hover:bg-fcit-lemonSoft transition duration-300 ease-fcit"
              >
                <span>Profile</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
