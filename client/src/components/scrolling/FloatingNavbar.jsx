import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Compass, ShieldCheck } from '@phosphor-icons/react';
import { FCIT_IDENTITY, NAV_LINKS } from '../../data/verifiedShellContent';
import { useAuth } from '../../context/AuthContext';
import { ScrollDirector } from '../../animations/ScrollDirector';
import { useScrollDirector } from '../../hooks/useScrollDirector';

export function FloatingNavbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isStaff } = useAuth();

  const closeButtonRef = useRef(null);
  const ctaLinkRef = useRef(null);
  const ctaPillRef = useRef(null);
  const ctaLabelRef = useRef(null);
  const ctaDotRef = useRef(null);

  const isHomePage = pathname === '/';

  // Close drawer cleanly on route navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape key & scroll lock when full height drawer opens
  useEffect(() => {
    if (!open) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Drive dot -> circle -> pill CTA transformation smoothly without layout shift
  useScrollDirector(
    ({ reducedMotion }) => {
      const linkEl = ctaLinkRef.current;
      const pillEl = ctaPillRef.current;
      const labelEl = ctaLabelRef.current;
      const dotEl = ctaDotRef.current;
      if (!linkEl || !pillEl || !labelEl || !dotEl) return;

      const rawCss = document.documentElement.style.getPropertyValue('--nav-cta-progress');
      const statementT = Number.parseFloat(rawCss);
      const t =
        reducedMotion || !isHomePage
          ? 1
          : Number.isFinite(statementT)
          ? Math.min(Math.max(statementT, 0), 1)
          : 0;

      // Expand pill cleanly via compositor clip-path (never mutating width -> zero navbar layout shift)
      const expand = Math.min(Math.max((t - 0.16) / 0.84, 0), 1);
      const leftInsetPct = Math.round((1 - expand) * 73);
      pillEl.style.clipPath = `inset(0 0 0 ${leftInsetPct}% round 9999px)`;
      pillEl.style.opacity = (0.14 + expand * 0.86).toFixed(3);

      const labelVisible = Math.min(Math.max((t - 0.44) / 0.56, 0), 1);
      labelEl.style.opacity = labelVisible.toFixed(3);
      labelEl.style.transform = `translate3d(${Math.round((1 - labelVisible) * 8)}px, 0, 0)`;

      // Initial indicator dot settles gently out once the full navy pill opens
      const dotFade = 1 - Math.min(Math.max((t - 0.2) / 0.45, 0), 1);
      const ringScale = 0.88 + Math.min(t * 2.2, 0.24);
      dotEl.style.opacity = dotFade.toFixed(3);
      dotEl.style.transform = `scale(${ringScale.toFixed(3)})`;

      linkEl.dataset.ctaStage = expand > 0.5 ? 'pill' : 'dot';
    },
    [isHomePage]
  );

  // Ensure route transitions set initial navbar CTA progress cleanly before next paint
  useEffect(() => {
    if (!isHomePage) {
      document.documentElement.style.setProperty('--nav-cta-progress', '1');
    } else if ((window.scrollY || 0) < 30) {
      document.documentElement.style.setProperty('--nav-cta-progress', '0');
    }
    ScrollDirector.refresh();
  }, [isHomePage]);

  return (
    <>
      <a href="#main-content" className="skip-to-content button-sm">
        Skip to main content
      </a>

      {/* Compact Floating Navigation Bar */}
      <header className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
        <nav
          aria-label="Primary site navigation"
          className="pointer-events-auto mx-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-fcit-navy/15 bg-fcit-cream/85 px-3 py-2 shadow-sm backdrop-blur-md transition duration-300 ease-fcit"
        >
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-1 py-1 transition duration-300 ease-fcit hover:opacity-85 shrink-0"
            aria-label="FCIT Home"
          >
            <img
              src={FCIT_IDENTITY.logoSrc}
              onError={(e) => {
                e.currentTarget.src = FCIT_IDENTITY.logoFallbackSrc;
              }}
              alt="Official FCIT Emblem"
              width="36"
              height="36"
              className="h-9 w-9 rounded-full object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="title-4 text-fcit-navyDeep leading-none">
                FCIT
              </span>
              <span className="caption-5 text-fcit-muted hidden sm:block mt-0.5">
                HBTU Kanpur
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/events"
              className="hidden md:inline-flex items-center gap-1 rounded-lg border border-fcit-navy/15 bg-fcit-ivory/80 px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
            >
              Events
            </Link>

            {/* Fixed-width morph slot prevents any horizontal layout shift on navbar siblings */}
            <div className="relative h-9 w-[124px] sm:w-[138px] shrink-0 flex items-center justify-end">
              <Link
                ref={ctaLinkRef}
                to="/events"
                aria-label="Explore FCIT"
                data-cta-stage="dot"
                className="group relative flex h-9 w-full items-center justify-end rounded-full focus-visible:outline-none"
              >
                {/* Resting right-aligned dot -> circular ring indicator */}
                <span
                  ref={ctaDotRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-fcit-navy/20 bg-fcit-ivory/90 shadow-sm transition-colors group-hover:border-fcit-navy/40"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-fcit-gold shadow-[0_0_0_2px_rgba(11,39,71,0.18)]" />
                </span>

                {/* Expanding pill layer (clipped cleanly via compositor inset, full focus reveal preserved) */}
                <span
                  ref={ctaPillRef}
                  className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-fcit-navyDeep px-3 button-xsm sm:button-sm text-fcit-cream shadow-sm transition-colors duration-300 ease-fcit group-hover:bg-fcit-navy group-focus-visible:!opacity-100 group-focus-visible:![clip-path:inset(0_0_0_0_round_9999px)]"
                >
                  <Compass size={15} weight="regular" aria-hidden="true" className="shrink-0 text-fcit-gold" />
                  <span
                    ref={ctaLabelRef}
                    className="whitespace-nowrap group-focus-visible:!opacity-100 group-focus-visible:!transform-none"
                  >
                    Explore FCIT
                  </span>
                </span>
              </Link>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="fcit-full-nav-panel"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fcit-navy/15 bg-fcit-ivory/90 text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
            >
              <span className="relative flex h-4 w-5 flex-col items-center justify-center">
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-fcit-navyDeep transition-transform duration-500 ease-fcit ${
                    open ? 'translate-y-0 rotate-45' : '-translate-y-[5px] rotate-0'
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-fcit-navyDeep transition-opacity duration-300 ease-fcit ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-5 rounded-full bg-fcit-navyDeep transition-transform duration-500 ease-fcit ${
                    open ? 'translate-y-0 -rotate-45' : 'translate-y-[5px] rotate-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full Height Navigation Overlay */}
      <div
        id="fcit-full-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Full navigation directory"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-fcit-cream/95 backdrop-blur-xl transition-all duration-500 ease-fcit ${
          open
            ? 'pointer-events-auto visible opacity-100'
            : 'pointer-events-none invisible opacity-0'
        }`}
      >
        <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-between px-4 pt-24 pb-10 sm:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Primary Directory Links */}
            <div className="md:col-span-8">
              <p className="mono-meta uppercase text-fcit-muted mb-4">
                Navigation Directory
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {NAV_LINKS.map((item, idx) => {
                  const delayMs = Math.min(idx * 32, 360);
                  return (
                    <li
                      key={item.to}
                      className="transition duration-500 ease-fcit motion-reduce-static"
                      style={{
                        transitionDelay: open ? `${delayMs}ms` : '0ms',
                        transform: open ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-xl px-3 py-3 transition duration-300 ease-fcit ${
                            isActive
                              ? 'bg-fcit-navyDeep text-fcit-cream'
                              : 'text-fcit-navyDeep hover:bg-fcit-lemonSoft'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="heading-6 sm:heading-5">{item.label}</span>
                            <ArrowUpRight
                              size={18}
                              className={`transition-transform duration-300 ease-fcit group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                isActive ? 'text-fcit-gold' : 'text-fcit-muted'
                              }`}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Institutional Summary & Actions */}
            <div
              className="md:col-span-4 flex flex-col justify-between gap-6 rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/80 p-6 transition duration-500 ease-fcit motion-reduce-static"
              style={{
                transitionDelay: open ? '240ms' : '0ms',
                transform: open ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
                opacity: open ? 1 : 0,
              }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={FCIT_IDENTITY.logoSrc}
                    alt="FCIT Emblem"
                    width="48"
                    height="48"
                    className="h-12 w-12 rounded-full object-contain"
                  />
                  <div>
                    <p className="title-3 text-fcit-navyDeep">FCIT · HBTU</p>
                    <p className="caption-4 text-fcit-muted">Kanpur, Uttar Pradesh</p>
                  </div>
                </div>
                <p className="body-6 text-fcit-secondary mb-6">
                  Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur.
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
                  >
                    Explore FCIT Activities
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>

                  <Link
                    to={isStaff ? '/admin' : user ? '/admin' : '/login'}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 button-sm text-fcit-navyDeep transition duration-300 ease-fcit hover:bg-fcit-lemonSoft active:scale-[0.98]"
                  >
                    <ShieldCheck size={16} aria-hidden="true" />
                    {isStaff ? 'Admin Dashboard' : user ? 'Account Portal' : 'Coordinator Sign In'}
                  </Link>
                </div>
              </div>

              <div className="border-t border-fcit-navy/15 pt-4 flex flex-wrap gap-4 caption-4 text-fcit-muted">
                <Link to="/privacy-policy" className="hover:text-fcit-navyDeep">
                  Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="hover:text-fcit-navyDeep">
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-fcit-navy/10 pt-4 flex flex-wrap items-center justify-between gap-4 caption-4 text-fcit-muted">
            <span>{FCIT_IDENTITY.fullName}</span>
            <span>{FCIT_IDENTITY.university}</span>
          </div>
        </div>
      </div>
    </>
  );
}
