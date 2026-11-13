import { UsersThree } from '@phosphor-icons/react';
import { PeopleSection } from './PeopleSection';
import { PLACEHOLDER_TEAM_SLOTS } from '../../data/verifiedShellContent';

export function TeamSection({ resource }) {
  return (
    <PeopleSection
      headingId="team-heading"
      eyebrow="THE PEOPLE BEHIND FCIT"
      heading="Built by students. United by ideas."
      description="Meet the students who contribute their time, skills and ideas to build the FCIT community."
      emptyNotice="Current cohort student appointments await official verification in the Admin Dashboard. Geometric silhouette plates illustrate supported leadership roles until rosters are published."
      emptyCtaLabel="View Team Directory"
      emptyCtaHref="/team"
      actionLabel="View Full Team"
      actionHref="/team"
      ActionIcon={UsersThree}
      toneClass="bg-fcit-roseSoft"
      mode="team"
      resource={resource}
      fallbackSlots={PLACEHOLDER_TEAM_SLOTS}
      carouselAriaLabel="FCIT student leadership carousel"
    />
  );
}
