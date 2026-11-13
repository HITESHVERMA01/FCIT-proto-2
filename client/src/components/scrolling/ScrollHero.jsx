import { useRef } from 'react';
import { CaretDown, Compass, ShieldCheck } from '@phosphor-icons/react';
import { FCIT_IDENTITY } from '../../data/verifiedShellContent';
import { useScrollDirector } from '../../hooks/useScrollDirector';

/**
 * Scene One — Opening Hero Experience
 * - Sequential staged initial entrance using FCIT ease curve
 * - Responsive scroll linkage for headline & CS/IT building layer
 * - Seamlessly floats over the top-hanging sky cyan AmbientBowl
 */
export function ScrollHero() {
  const editorialRef = useRef(null);
  const imageFrameRef = useRef(null);

  useScrollDirector(({ scrollY, viewportHeight, isDesktop, reducedMotion }) => {
    const editorial = editorialRef.current;
    const imageFrame = imageFrameRef.current;
    if (!editorial || !imageFrame) return;

    if (reducedMotion || !isDesktop) {
      editorial.style.transform = 'translate3d(0, 0, 0)';
      editorial.style.opacity = '1';
      imageFrame.style.transform = 'translate3d(0, 0, 0) scale(1)';
      return;
    }

    const ratio = Math.min(Math.max(scrollY / Math.max(viewportHeight, 1), 0), 1.15);
    editorial.style.transform = `translate3d(0, ${Math.round(ratio * -18)}px, 0)`;
    editorial.style.opacity = Math.max(1 - ratio * 0.28, 0.72).toFixed(3);

    const imgScale = 1 + ratio * 0.025;
    imageFrame.style.transform = `translate3d(0, ${Math.round(ratio * -28)}px, 0) scale(${imgScale.toFixed(4)})`;
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[84vh] items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* Subtle Shield Inspired Institutional Linework */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 600"
        className="pointer-events-none absolute right-0 top-12 -z-10 hidden h-[520px] w-[520px] opacity-20 lg:block"
      >
        <path
          d="M420 60 L660 110 C660 320 570 460 420 540 C270 460 180 320 180 110 Z"
          fill="none"
          stroke="#0B2747"
          strokeWidth="1"
          strokeOpacity="0.28"
        />
        <path
          d="M420 96 L624 140 C624 316 546 436 420 504"
          fill="none"
          stroke="#D5AD43"
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />
      </svg>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Staged Editorial Sequence */}
          <div ref={editorialRef} className="lg:col-span-6 max-w-[680px] will-change-[transform,opacity]">
            <div className="hero-stage-item hero-stage-1 mb-6 inline-flex items-center gap-3 rounded-full border border-fcit-navy/15 bg-fcit-ivory/90 px-3 py-1.5 backdrop-blur-sm">
              <img
                src={FCIT_IDENTITY.logoSrc}
                onError={(e) => {
                  e.currentTarget.src = FCIT_IDENTITY.logoFallbackSrc;
                }}
                alt="Official FCIT Shield Logo"
                width="24"
                height="24"
                className="h-6 w-6 rounded-full object-contain"
              />
              <span className="mono-meta text-fcit-navyDeep uppercase">
                HBTU Kanpur · CSE &amp; IT
              </span>
            </div>

            <div className="hero-stage-item hero-stage-2">
              <h1
                id="hero-heading"
                className="heading-3 sm:heading-2 lg:heading-1 hero-heading-ink mb-4"
              >
                WE ARE FCIT.
              </h1>

              <p className="heading-5 sm:heading-4 text-fcit-navyDeep mb-4">
                Where Technology Meets
                <br className="hidden sm:inline" /> Community.
              </p>
            </div>

            <p className="hero-stage-item hero-stage-3 body-2 text-fcit-secondary max-w-[540px] mb-8">
              The Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur.
            </p>

            <div className="hero-stage-item hero-stage-4 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#about-fcit"
                  className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3.5 py-2.5 button-md text-fcit-cream shadow-sm transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
                >
                  <Compass size={18} weight="regular" aria-hidden="true" />
                  <span>Explore FCIT</span>
                </a>
              </div>

              <div className="flex items-center gap-2 caption-2 text-fcit-muted">
                <ShieldCheck size={16} className="text-fcit-goldInk shrink-0" aria-hidden="true" />
                <span>
                  Official student and faculty computing forum of the Department of CSE &amp; IT
                </span>
              </div>
            </div>
          </div>

          {/* Right Borderless Department Architectural Layer */}
          <div className="lg:col-span-6">
            <div
              ref={imageFrameRef}
              className="hero-stage-item hero-stage-5 will-change-transform"
            >
              <div className="relative overflow-hidden rounded-3xl bg-fcit-lemonSoft shadow-[0_24px_60px_-26px_rgba(11,39,71,0.22)]">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={FCIT_IDENTITY.buildingSrcSet}
                    sizes="(max-width: 1023px) 100vw, 560px"
                  />
                  <img
                    src={FCIT_IDENTITY.buildingFallbackSrc}
                    alt="Department of Computer Science and Engineering building at Harcourt Butler Technical University, Kanpur"
                    width="980"
                    height="552"
                    fetchpriority="high"
                    decoding="async"
                    className="aspect-[16/10] w-full object-cover brightness-[1.02] contrast-[1.03] saturate-[0.96]"
                  />
                </picture>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#011E3E]/25 via-transparent to-[#FBF6EF]/10"
                />
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-fcit-cream/85 px-3.5 py-2 backdrop-blur-md">
                  <span className="caption-3 text-fcit-navyDeep">
                    Computer Science &amp; Engineering Department
                  </span>
                  <span className="mono-meta text-fcit-muted">
                    HBTU KANPUR CAMPUS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Exploration Cue */}
        <div className="mt-12 hidden sm:flex items-center justify-center">
          <a
            href="#fcit-statement"
            aria-label="Scroll to FCIT philosophy statement"
            className="inline-flex items-center gap-2 rounded-full border border-fcit-navy/15 bg-fcit-ivory/80 px-3.5 py-1.5 caption-4 text-fcit-muted backdrop-blur-sm transition duration-300 ease-fcit hover:text-fcit-navyDeep"
          >
            <span>Scroll to explore</span>
            <CaretDown size={14} className="hero-scroll-cue-icon" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
