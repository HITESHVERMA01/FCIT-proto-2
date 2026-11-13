import { useEffect, useState } from 'react';
import { CaretLeft, CaretRight, MagnifyingGlassPlus, X } from '@phosphor-icons/react';
import { resolveMediaUrl } from '../../services/api';
import { Reveal } from '../shared/Reveal';

export function GalleryGridWithLightbox({ photos = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((i) => (i + 1) % photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((i) => (i - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex, photos.length]);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, idx) => {
          const url = resolveMediaUrl(photo.imageUrl);
          return (
            <Reveal
              key={photo._id || idx}
              as="figure"
              delayMs={Math.min((idx % 3) * 75, 225)}
              className="break-inside-avoid rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-3 transition duration-300 ease-fcit hover:border-fcit-navy/35"
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className="group relative block w-full overflow-hidden rounded-xl text-left"
                aria-label={`Inspect ${photo.title} in full screen viewer`}
              >
                <img
                  src={url}
                  alt={photo.altText || photo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl object-cover transition-transform duration-500 ease-fcit group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-fcit-cream/90 text-fcit-navyDeep shadow-sm backdrop-blur-sm">
                  <MagnifyingGlassPlus size={18} aria-hidden="true" />
                </span>
              </button>

              <figcaption className="mt-3 px-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="mono-meta text-fcit-goldInk">{photo.category}</span>
                  <span className="caption-5 text-fcit-muted">{photo.year}</span>
                </div>
                <p className="title-3 text-fcit-navyDeep">{photo.title}</p>
                {photo.caption && (
                  <p className="body-6 text-fcit-secondary mt-1">{photo.caption}</p>
                )}
              </figcaption>
            </Reveal>
          );
        })}
      </div>

      {/* Fullscreen Accessible Lightbox */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-fcit-navyDeep/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-fcit-cream/20 bg-fcit-cream p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="mono-meta text-fcit-goldInk">
                  {activePhoto.category} · {activePhoto.year}
                </p>
                <h3 className="heading-6 text-fcit-navyDeep">{activePhoto.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close fullscreen viewer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl bg-fcit-ivory flex items-center justify-center max-h-[70vh]">
              <img
                src={resolveMediaUrl(activePhoto.imageUrl)}
                alt={activePhoto.altText || activePhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="body-6 text-fcit-secondary max-w-xl">
                {activePhoto.caption || activePhoto.altText}
              </p>
              {photos.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
                    }
                    aria-label="Previous photograph"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                  >
                    <CaretLeft size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
                    aria-label="Next photograph"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-ivory text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                  >
                    <CaretRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
