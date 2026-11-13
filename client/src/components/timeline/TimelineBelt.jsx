import { ArchiveRecord } from './ArchiveRecord';
import { MilestonePanel } from './MilestonePanel';

/**
 * Synchronized Dual Layer Conveyor Belt
 * Renders both the Visual Memory side (right of scanner) and Archival Record side
 * (left of scanner on md+) inside aligned transform slots updated directly at 60fps via refs.
 */
export function TimelineBelt({
  milestones = [],
  virtualCount = 1,
  cardWidth = 460,
  cardHeight = 360,
  padTop = 20,
  isMobile = false,
  slotRefs,
  memoryClipRefs,
  archiveClipRefs,
}) {
  const safeCount = Math.max(milestones.length, 1);
  const indices = Array.from({ length: virtualCount }, (_, i) => i);

  return (
    <div className="pointer-events-none relative z-10 h-full w-full">
      {indices.map((vIdx) => {
        const mIdx = vIdx % safeCount;
        const milestone = milestones[mIdx];
        if (!milestone) return null;
        const isDuplicate = vIdx >= safeCount;

        return (
          <div
            key={`${milestone._id || mIdx}-${vIdx}`}
            ref={(el) => {
              slotRefs.current[vIdx] = el;
            }}
            aria-hidden={isDuplicate || undefined}
            className="fcit-belt-slot"
            style={{
              top: `${padTop}px`,
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
            }}
          >
            {/* Visual Memory Layer: visible strictly RIGHT of central scanner */}
            <div
              ref={(el) => {
                memoryClipRefs.current[vIdx] = el;
              }}
              className="fcit-belt-layer"
            >
              <MilestonePanel
                milestone={milestone}
                slotIndex={mIdx}
                compact={isMobile}
              />
            </div>

            {/* Structured Archival Layer: visible strictly LEFT of central scanner on tablet/desktop */}
            {!isMobile && (
              <div
                ref={(el) => {
                  archiveClipRefs.current[vIdx] = el;
                }}
                className="fcit-belt-layer hidden md:block"
              >
                <ArchiveRecord milestone={milestone} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
