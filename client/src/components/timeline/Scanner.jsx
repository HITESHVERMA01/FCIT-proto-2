/**
 * Central vertical scanning element anchored at the exact horizontal center of the stage.
 * Styling derives strictly from global CSS tokens (navy, cyan glow, restrained gold node).
 */
export function Scanner({ isPaused = false, isDragging = false }) {
  return (
    <div aria-hidden="true" className="fcit-scanner-beam-wrap">
      <span className="fcit-scanner-node" />
      <div className="fcit-scanner-halo" />
      <div
        className="fcit-scanner-core"
        style={{
          opacity: isDragging ? 0.96 : isPaused ? 0.56 : 0.84,
        }}
      />
      <span className="fcit-scanner-node fcit-scanner-node--bottom" />
    </div>
  );
}
