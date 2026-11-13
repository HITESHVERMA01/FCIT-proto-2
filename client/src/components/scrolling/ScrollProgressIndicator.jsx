/**
 * Minimal hairline reading progress indicator synced strictly to --scroll-progress
 * Animates scaleX on GPU without layout recalculations.
 */
export function ScrollProgressIndicator() {
  return (
    <div className="fcit-scroll-progress-track" aria-hidden="true">
      <div className="fcit-scroll-progress-bar" />
    </div>
  );
}
