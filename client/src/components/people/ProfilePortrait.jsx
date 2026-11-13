import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../../services/api';
import { PortraitPlaceholder } from './PortraitPlaceholder';

/**
 * Reusable Portrait Frame
 * - Displays uploaded image with configurable object-position & aspect ratio
 * - Automatically displays a monochrome geometric silhouette placeholder when no photo exists
 *   or when an image fails to load (never displays a broken image icon or empty container)
 */
export function ProfilePortrait({
  src,
  alt,
  variant = 0,
  objectPosition = 'object-top',
  widthClass = 'w-full',
  aspectClass = 'aspect-[4/5]',
  sizes = '(max-width: 767px) 280px, 296px',
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  const showImage = Boolean(resolved && !failed);

  return (
    <div
      className={`relative overflow-hidden bg-fcit-ivory ${widthClass} ${aspectClass} ${className}`}
    >
      {showImage ? (
        <img
          src={resolved}
          alt={alt || 'FCIT profile portrait'}
          loading="lazy"
          decoding="async"
          sizes={sizes}
          draggable={false}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${objectPosition}`}
        />
      ) : (
        <PortraitPlaceholder
          variant={variant}
          label={alt || 'Geometric silhouette awaiting verified portrait'}
        />
      )}
    </div>
  );
}
