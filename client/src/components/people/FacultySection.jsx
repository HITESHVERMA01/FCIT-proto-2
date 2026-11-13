import { GraduationCap } from '@phosphor-icons/react';
import { PeopleSection } from './PeopleSection';
import { PLACEHOLDER_FACULTY_SLOTS } from '../../data/verifiedShellContent';

export function FacultySection({ resource }) {
  return (
    <PeopleSection
      headingId="faculty-heading"
      eyebrow="THE PEOPLE WHO GUIDE US"
      heading="Meet our faculty."
      description="The educators and mentors who guide learning, encourage curiosity and support the growth of the CS and IT community."
      emptyNotice="Verified faculty profiles are published through the FCIT Admin Dashboard. Until authentic faculty photographs and credentials are confirmed, geometric silhouette plates reserve departmental designations."
      emptyCtaLabel="Open Faculty Directory"
      emptyCtaHref="/faculty"
      actionLabel="All Faculty"
      actionHref="/faculty"
      ActionIcon={GraduationCap}
      toneClass="bg-fcit-sageSoft/70"
      mode="faculty"
      resource={resource}
      fallbackSlots={PLACEHOLDER_FACULTY_SLOTS}
      carouselAriaLabel="FCIT faculty mentors carousel"
    />
  );
}
