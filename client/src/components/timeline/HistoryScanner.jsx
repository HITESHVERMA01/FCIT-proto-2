import { TimelineSection } from './TimelineSection';

export function HistoryScanner({
  milestones = [],
  showIntro = false,
  showArchiveLink = false,
  headingId = 'living-legacy-heading',
}) {
  return (
    <TimelineSection
      milestones={milestones}
      showIntro={showIntro}
      showArchiveLink={showArchiveLink}
      headingId={headingId}
    />
  );
}
