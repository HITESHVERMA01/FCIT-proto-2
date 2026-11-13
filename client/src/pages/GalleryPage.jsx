import { useMemo, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { GalleryGridWithLightbox } from '../components/gallery/GalleryLightbox';
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PLACEHOLDER_GALLERY_PHOTOS } from '../data/verifiedShellContent';
import { resolveMediaUrl } from '../services/api';

export function GalleryPage() {
  useDocumentMeta({
    title: 'Gallery · FCIT, HBTU Kanpur',
    description:
      'Authentic campus and event photography curated by FCIT at Harcourt Butler Technical University, Kanpur.',
    canonicalPath: '/gallery',
  });

  const albumsRes = useApiResource('/gallery/albums');
  const imagesRes = useApiResource('/gallery/images');

  const [category, setCategory] = useState('All');
  const [year, setYear] = useState('All');
  const [albumId, setAlbumId] = useState('All');

  const photos =
    imagesRes.data && imagesRes.data.length > 0
      ? imagesRes.data
      : PLACEHOLDER_GALLERY_PHOTOS;

  const categories = useMemo(() => {
    const s = new Set(['All']);
    photos.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [photos]);

  const years = useMemo(() => {
    const s = new Set(['All']);
    photos.forEach((p) => p.year && s.add(p.year));
    return Array.from(s);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (year !== 'All' && p.year !== year) return false;
      if (albumId !== 'All' && p.albumId !== albumId) return false;
      return true;
    });
  }, [photos, category, year, albumId]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Visual Archive"
        title="Campus & Event Gallery"
        description="Curated albums and responsive photography preserving departmental spaces, workshops, and community gatherings."
        toneClass="bg-fcit-cream"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 space-y-12">
          {/* Curated Albums */}
          {albumsRes.data?.length > 0 && (
            <Reveal>
              <h2 className="heading-5 text-fcit-navyDeep mb-4">Curated Albums</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albumsRes.data.map((album) => (
                  <button
                    key={album._id}
                    type="button"
                    onClick={() =>
                      setAlbumId((prev) => (prev === album._id ? 'All' : album._id))
                    }
                    className={`rounded-2xl border p-3 text-left transition duration-300 ease-fcit ${
                      albumId === album._id
                        ? 'border-fcit-navy bg-fcit-lemonSoft'
                        : 'border-fcit-navy/15 bg-fcit-ivory/80 hover:border-fcit-navy/35'
                    }`}
                  >
                    {album.coverImage && (
                      <img
                        src={resolveMediaUrl(album.coverImage)}
                        alt={album.coverImageAlt || album.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded-xl object-cover mb-3"
                      />
                    )}
                    <span className="mono-meta text-fcit-goldInk">
                      {album.category} · {album.year}
                    </span>
                    <p className="title-2 text-fcit-navyDeep mt-1">{album.title}</p>
                    {album.description && (
                      <p className="body-6 text-fcit-secondary mt-1">{album.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Filters */}
          <Reveal className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                    category === cat
                      ? 'bg-fcit-navyDeep text-fcit-cream'
                      : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="gallery-year-select" className="caption-3 text-fcit-muted">
                Year
              </label>
              <select
                id="gallery-year-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 body-6 text-fcit-ink"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </Reveal>

          {imagesRes.loading ? (
            <CardGridSkeleton count={6} />
          ) : imagesRes.error ? (
            <ErrorState message={imagesRes.error} onRetry={imagesRes.refetch} />
          ) : filteredPhotos.length > 0 ? (
            <GalleryGridWithLightbox photos={filteredPhotos} />
          ) : (
            <Reveal>
              <EmptyState
                title="No photographs match this selection"
                description="Reset the active category or year filter to inspect available campus imagery."
                actionLabel="Show All Photos"
                onAction={() => {
                  setCategory('All');
                  setYear('All');
                  setAlbumId('All');
                }}
              />
            </Reveal>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
