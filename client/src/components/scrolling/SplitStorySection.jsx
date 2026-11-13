import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, UsersThree } from '@phosphor-icons/react';
import { FCIT_IDENTITY } from '../../data/verifiedShellContent';
import { useScrollTarget } from '../../hooks/useScrollDirector';
import { computeElementProgress } from '../../animations/scroll/scrollProgress';
import { easeDecel } from '../../animations/scroll/interpolate';
import { Reveal } from '../shared/Reveal';

/**
 * Scene Three — Campus & Community Split Story Section
 * - Left: Heading ("A community built beyond the classroom."), charter highlights, navigation action
 * - Right: Borderless integrated CS & IT building photograph settling smoothly scale(1.05) -> scale(1.00)
 * - Background blends Sage Pastel into Cream without harsh horizontal seams
 */
export function SplitStorySection() {
  const sectionRef = useRef(null);
  const photoScaleRef = useRef(null);

  useScrollTarget(
    sectionRef,
    ({ rect, viewportHeight, reducedMotion }) => {
      const imgEl = photoScaleRef.current;
      if (!imgEl) return;

      if (reducedMotion) {
        imgEl.style.transform = 'scale(1) translate3d(0, 0, 0)';
        return;
      }

      const progress = computeElementProgress(rect, viewportHeight, 0.95, 0.25);
      const eased = easeDecel(progress);
      const scale = 1.05 - eased * 0.05;
      const settleY = (1 - eased) * 14;
      imgEl.style.transform = `translate3d(0, ${settleY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
    },
    []
  );

  return (
    <section
      id="about-fcit"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="scroll-mt-16 editorial-band bg-gradient-to-b from-fcit-sageSoft/55 via-fcit-sageSoft/85 to-fcit-cream py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Reading Column */}
          <Reveal className="lg:col-span-6 space-y-6">
            <div>
              <p className="mono-meta uppercase text-fcit-goldInk mb-4">
                03 · Campus &amp; Community
              </p>
              <h2
                id="about-heading"
                className="heading-3 sm:heading-2 text-fcit-navyDeep mb-5"
              >
                A community built beyond the classroom.
              </h2>
              <p className="body-2 text-fcit-secondary max-w-[580px] mb-4">
                FCIT brings together undergraduate students, researchers, and faculty mentors in the Department of Computer Science and Engineering and Information Technology at Harcourt Butler Technical University, Kanpur.
              </p>
              <p className="body-3 text-fcit-muted max-w-[580px]">
                Through open technical workshops, algorithmic practice circles, collaborative software builds, and peer mentorship, classroom concepts evolve into practical engineering craft.
              </p>
            </div>

            {/* Integrated Institutional Charter Highlights (Light, non-boxy styling) */}
            <div className="rounded-2xl bg-fcit-cream/75 p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={FCIT_IDENTITY.logoSrc}
                  onError={(e) => {
                    e.currentTarget.src = FCIT_IDENTITY.logoFallbackSrc;
                  }}
                  alt="Official circular FCIT emblem"
                  width="52"
                  height="52"
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-contain shrink-0"
                />
                <div>
                  <p className="title-3 text-fcit-navyDeep">Institutional Charter</p>
                  <p className="caption-3 text-fcit-muted">
                    Department of CSE &amp; IT, HBTU Kanpur
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <Code size={18} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="body-6 text-fcit-secondary">
                    Hands on workshops across systems, web architecture, algorithms, and emerging tracks.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <UsersThree size={18} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="body-6 text-fcit-secondary">
                    Cross batch peer mentorship uniting first year learners, coordinators, and faculty advisors.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-2.5 button-md text-fcit-cream shadow-sm transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
              >
                <span>About the Association</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {/* Right Borderless Department Architectural Settle Frame */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl bg-fcit-periwinkle/30 shadow-[0_28px_64px_-28px_rgba(11,39,71,0.22)]">
              <div
                ref={photoScaleRef}
                className="will-change-transform origin-center"
                style={{ transform: 'scale(1.05)' }}
              >
                <picture>
                  <source
                    type="image/webp"
                    srcSet={FCIT_IDENTITY.buildingSrcSet}
                    sizes="(max-width: 1023px) 100vw, 560px"
                  />
                  <img
                    src={FCIT_IDENTITY.buildingFallbackSrc}
                    alt="Department of Computer Science and Engineering and Information Technology building at HBTU Kanpur"
                    width="980"
                    height="552"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/11] w-full object-cover brightness-[1.02] contrast-[1.03] saturate-[0.96]"
                  />
                </picture>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2747]/30 via-transparent to-[#FBF6EF]/10"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-fcit-cream/90 px-4 py-2.5 backdrop-blur-md">
                <span className="caption-2 text-fcit-navyDeep">
                  Department of CSE &amp; IT Block
                </span>
                <span className="mono-meta text-fcit-goldInk">
                  HBTU KANPUR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
