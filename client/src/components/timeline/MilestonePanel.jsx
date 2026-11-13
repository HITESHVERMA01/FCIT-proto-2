import { useEffect, useState } from 'react';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import { resolveMediaUrl } from '../../services/api';

/**
 * Determine varied visual composition style based on milestone layoutVariant, asset type, and position.
 * Ensures visual panels avoid repetitive identical cards while preserving editorial cohesion.
 */
export function resolvePanelVariant(milestone, slotIndex = 0) {
  if (!milestone?.primaryImage) {
    return 'archival-draft';
  }
  if (milestone.layoutVariant && milestone.layoutVariant !== 'auto') {
    return milestone.layoutVariant;
  }
  if (milestone.primaryImage.includes('fcit-logo')) {
    return 'emblem-seal';
  }
  const cycle = ['full-bleed', 'studio-split', 'collage', 'full-bleed'];
  return cycle[slotIndex % cycle.length];
}

function PanelImage({ src, fallbackSrc, alt, className }) {
  const [activeSrc, setActiveSrc] = useState(() => resolveMediaUrl(src));

  useEffect(() => {
    setActiveSrc(resolveMediaUrl(src));
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={activeSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      draggable={false}
      onError={handleError}
      className={className}
    />
  );
}

/**
 * Memory Side Panel (Right of central scanner)
 * Renders editorial visual representations seamlessly integrated into the unified cream canvas.
 */
export function MilestonePanel({ milestone, slotIndex = 0, compact = false }) {
  const variant = resolvePanelVariant(milestone, slotIndex);
  const altText = milestone.primaryImageAlt || milestone.title || 'FCIT historical archive frame';
  const primaryFallback = milestone.primaryImageFallback || '';
  const secondaryImg =
    Array.isArray(milestone.additionalImages) && milestone.additionalImages[0]
      ? milestone.additionalImages[0]
      : '';

  const isPreview = milestone.verificationStatus !== 'verified';
  const badgeLabel = isPreview
    ? `${milestone.year} · Preview`
    : milestone.year;

  if (variant === 'archival-draft') {
    return (
      <div className="fcit-archival-grid relative h-full w-full overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="mono-meta text-fcit-navy">{milestone.year}</span>
          <span className="caption-5 text-fcit-muted">Archive Plate Reserved</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center my-auto px-4">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-fcit-navy/20 bg-fcit-cream">
            <ClockCounterClockwise size={24} className="text-fcit-navy" aria-hidden="true" />
          </div>
          <p className="title-4 text-fcit-navyDeep mb-1">Awaiting Authentic Photograph</p>
          <p className="caption-4 text-fcit-muted max-w-[260px]">
            Upload verified archival photography through the FCIT Admin Dashboard.
          </p>
        </div>

        <div className="flex items-center justify-between caption-5 text-fcit-muted">
          <span>{milestone.category}</span>
          <span className="mono-meta">Slot {String(slotIndex + 1).padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  if (variant === 'emblem-seal') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-fcit-ivory p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 z-10">
          <span className="mono-meta text-fcit-goldInk">{badgeLabel}</span>
          <span className="caption-5 text-fcit-muted">{milestone.category}</span>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-2">
          <PanelImage
            src={milestone.primaryImage}
            fallbackSrc={primaryFallback}
            alt={altText}
            className="h-full max-h-[220px] w-auto object-contain select-none"
          />
        </div>

        <div className="flex items-center justify-between gap-2 z-10">
          <span className="title-4 text-fcit-navyDeep truncate">{milestone.title}</span>
        </div>
      </div>
    );
  }

  if (variant === 'studio-split' && !compact) {
    return (
      <div className="relative h-full w-full grid grid-cols-12 gap-3 bg-fcit-cream">
        <div className="col-span-8 h-full overflow-hidden rounded-2xl bg-fcit-ivory">
          <PanelImage
            src={milestone.primaryImage}
            fallbackSrc={primaryFallback}
            alt={altText}
            className="h-full w-full object-cover select-none"
          />
        </div>

        <div className="col-span-4 h-full flex flex-col justify-between py-1">
          <div className="space-y-1.5">
            <span className="mono-meta text-fcit-goldInk block">
              {String(slotIndex + 1).padStart(2, '0')}
            </span>
            <p className="caption-3 text-fcit-navyDeep">{milestone.year}</p>
            <p className="caption-5 text-fcit-muted">{milestone.category}</p>
          </div>

          {secondaryImg ? (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-fcit-ivory">
              <PanelImage
                src={secondaryImg}
                alt={`${milestone.title} secondary detail`}
                className="h-full w-full object-cover select-none"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-fcit-lemonSoft p-3">
              <p className="caption-5 text-fcit-secondary">
                {isPreview ? 'Sample visual preview awaiting archival photo' : 'Verified FCIT archive plate'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'collage' && !compact) {
    return (
      <div className="relative h-full w-full bg-fcit-cream">
        <div className="h-[86%] w-[86%] overflow-hidden rounded-2xl bg-fcit-ivory">
          <PanelImage
            src={milestone.primaryImage}
            fallbackSrc={primaryFallback}
            alt={altText}
            className="h-full w-full object-cover select-none"
          />
        </div>

        <div className="absolute right-0 bottom-0 h-[44%] w-[44%] overflow-hidden rounded-xl bg-fcit-cream p-1.5">
          {secondaryImg ? (
            <div className="h-full w-full overflow-hidden rounded-lg bg-fcit-ivory">
              <PanelImage
                src={secondaryImg}
                alt={`${milestone.title} archival insert`}
                className="h-full w-full object-cover select-none"
              />
            </div>
          ) : (
            <div className="h-full w-full rounded-lg bg-fcit-sageSoft p-3 flex flex-col justify-between">
              <span className="mono-meta text-fcit-navy">{milestone.year}</span>
              <span className="caption-4 text-fcit-navyDeep line-clamp-2">{milestone.title}</span>
            </div>
          )}
        </div>

        <div className="absolute left-3 bottom-2 rounded-full border border-fcit-navy/15 bg-fcit-cream/95 px-3 py-1 backdrop-blur-sm">
          <span className="mono-meta text-fcit-navyDeep">{badgeLabel}</span>
        </div>
      </div>
    );
  }

  // Default: full-bleed editorial photograph seamlessly anchored in global cream
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-fcit-ivory">
      <PanelImage
        src={milestone.primaryImage}
        fallbackSrc={primaryFallback}
        alt={altText}
        className="h-full w-full object-cover select-none"
      />
      <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full border border-fcit-navy/15 bg-fcit-cream/95 px-3 py-1 backdrop-blur-sm">
        <span className="mono-meta text-fcit-navyDeep">{badgeLabel}</span>
        <span className="caption-5 text-fcit-muted">· {milestone.category}</span>
      </div>
    </div>
  );
}
