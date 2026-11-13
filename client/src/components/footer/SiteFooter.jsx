import { Link } from 'react-router-dom';
import {
  MapPin,
  EnvelopeSimple,
  ArrowUpRight,
  GraduationCap,
} from '@phosphor-icons/react';
import { FCIT_IDENTITY } from '../../data/verifiedShellContent';
import { Reveal } from '../shared/Reveal';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 editorial-band bg-fcit-cream text-fcit-ink">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <Reveal className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Institutional Mark & Identity */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={FCIT_IDENTITY.logoSrc}
                onError={(e) => {
                  e.currentTarget.src = FCIT_IDENTITY.logoFallbackSrc;
                }}
                alt="Official FCIT Emblem"
                width="64"
                height="64"
                loading="lazy"
                className="h-16 w-16 rounded-full object-contain shrink-0"
              />
              <div>
                <p className="heading-5 text-fcit-navyDeep">FCIT</p>
                <p className="caption-2 text-fcit-secondary">
                  Association of Computer Science and Information Technology
                </p>
              </div>
            </div>

            <p className="body-6 text-fcit-secondary max-w-md mb-6">
              Official student and faculty technology association within the Department of Computer Science and Engineering &amp; Information Technology at Harcourt Butler Technical University, Kanpur.
            </p>

            <div className="flex flex-col gap-2 caption-2 text-fcit-muted">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5 text-fcit-navy" aria-hidden="true" />
                <span>Harcourt Butler Technical University, Nawabganj, Kanpur, Uttar Pradesh</span>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap size={16} className="shrink-0 mt-0.5 text-fcit-navy" aria-hidden="true" />
                <span>Department of CSE &amp; IT</span>
              </div>
              <div className="flex items-start gap-2">
                <EnvelopeSimple size={16} className="shrink-0 mt-0.5 text-fcit-navy" aria-hidden="true" />
                <Link to="/contact" className="hover:text-fcit-navyDeep underline underline-offset-4">
                  Contact Association Desk
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <p className="title-4 text-fcit-navyDeep mb-3">Community</p>
              <ul className="flex flex-col gap-2 body-6 text-fcit-secondary">
                <li><Link to="/about" className="hover:text-fcit-navyDeep">About FCIT</Link></li>
                <li><Link to="/faculty" className="hover:text-fcit-navyDeep">Faculty &amp; Mentors</Link></li>
                <li><Link to="/team" className="hover:text-fcit-navyDeep">Student Team</Link></li>
                <li><Link to="/alumni" className="hover:text-fcit-navyDeep">Alumni Network</Link></li>
                <li><Link to="/history" className="hover:text-fcit-navyDeep">History Archive</Link></li>
              </ul>
            </div>

            <div>
              <p className="title-4 text-fcit-navyDeep mb-3">Programs</p>
              <ul className="flex flex-col gap-2 body-6 text-fcit-secondary">
                <li><Link to="/events" className="hover:text-fcit-navyDeep">Events</Link></li>
                <li><Link to="/achievements" className="hover:text-fcit-navyDeep">Achievements</Link></li>
                <li><Link to="/projects" className="hover:text-fcit-navyDeep">Student Projects</Link></li>
                <li><Link to="/gallery" className="hover:text-fcit-navyDeep">Gallery</Link></li>
                <li><Link to="/resources" className="hover:text-fcit-navyDeep">Learning Resources</Link></li>
              </ul>
            </div>
          </div>

          {/* Governance & Direct Portal */}
          <div className="md:col-span-3 flex flex-col justify-between gap-6">
            <div>
              <p className="title-4 text-fcit-navyDeep mb-3">Governance &amp; Portal</p>
              <ul className="flex flex-col gap-2 body-6 text-fcit-secondary">
                <li>
                  <Link to="/contact" className="inline-flex items-center gap-1 hover:text-fcit-navyDeep">
                    Submit Inquiry
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="inline-flex items-center gap-1 hover:text-fcit-navyDeep">
                    Admin &amp; Coordinator Portal
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-fcit-navyDeep">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="hover:text-fcit-navyDeep">
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-fcit-navy/15 bg-fcit-ivory/75 p-4">
              <p className="caption-3 text-fcit-navyDeep mb-1">Official Records</p>
              <p className="caption-5 text-fcit-muted">
                All published records are stewarded by authorized FCIT council members and department faculty advisors.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 border-t border-fcit-navy/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 caption-4 text-fcit-muted">
          <p>
            &copy; {year} FCIT, Harcourt Butler Technical University, Kanpur.
          </p>
          <p>
            Built with open source architecture under zero budget stewardship.
          </p>
        </div>
      </div>
    </footer>
  );
}
