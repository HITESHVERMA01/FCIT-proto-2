# FCIT 2.0 — Strategy, Architecture & Design System Blueprint

## 1. Landing Page & Homepage Strategy (`SKILL.md` Part A Deliverables)

### Layout Selection
**Type B — Long form editorial story** combined with structured institutional navigation.
**Why**: Prospective first year students, current CSE/IT undergraduates, faculty mentors, and alumni arrive with different levels of context. A long form editorial story builds trust sequentially: establishing physical presence at HBTU Kanpur, presenting mission and community identity, surfacing live events, showcasing verified faculty and student leaders, reconstructing institutional memory interactively, and answering practical participation questions.

### Primary Action & Conversion Model
- **Audience**: CSE & IT students at HBTU Kanpur, faculty mentors, alumni, and event partners.
- **Primary Action**: **Explore FCIT** (guides visitors through the community overview and routes directly to active events, projects, and student participation pathways without competing above-the-fold buttons).
- **Risk Reversal**: Participation in FCIT open sessions, study circles, and community workshops is open to students of the department with no mandatory fee barriers unless specified by an external partner event.

### Homepage Section Order (16 Connected Editorial Movements)
1. **Cinematic Hero** — Headline (`WE ARE FCIT.`), Supporting headline (`Where Technology Meets Community.`), institutional identification, single primary CTA (`Explore FCIT`), authentic CSE & IT Department building photo, official emblem, soft Vela/Halden bowl glow.
2. **About FCIT** — Editorial split narrative introducing the Association of Computer Science and Information Technology at HBTU Kanpur, paired with authentic campus visual treatment and a direct `Know More` pathway.
3. **FCIT at a Glance** — Three typographic identity statements (`Learn. Connect. Grow.`, `Build. Compete. Excel.`, `Explore. Innovate. Lead.`) crafted without fabricated statistics.
4. **FCIT Philosophy (Mandatory Word by Word Tagline Reveal)** — Dedicated full-breath pastel moment (`Learn together. Build with purpose. Create what matters.`) with `ScrollDirector` reading-order reveal.
5. **How It Works** — Three sequential participation steps (`1. Discover FCIT`, `2. Participate in activities`, `3. Contribute to the community`).
6. **Events Showcase** — Live upcoming events, registration deadline, status, and past archive links fetched from MongoDB (with composed empty state when none are scheduled).
7. **Faculty and Mentors (`FacultySection` / `PeopleSection` / `ProfileCarousel`)** — Eyebrow `THE PEOPLE WHO GUIDE US`, Heading `Meet our faculty.` Powered by the unified curved desktop carousel + monochrome architectural geometric bust silhouette system (`PortraitPlaceholder`) whenever a verified photograph is not yet supplied.
8. **Meet Our FCIT Team (`TeamSection` / `PeopleSection` / `ProfileCarousel`)** — Eyebrow `THE PEOPLE BEHIND FCIT`, Heading `Built by students. United by ideas.` Reuses the exact `ProfileCarousel` and `ProfileCard` system with privacy-aware email display (`showEmailPublicly`) and native horizontal snap scrolling on mobile.
9. **Interactive FCIT History Archive (`TimelineSection` / `TimelineBelt` / `ParticleCanvas`)** — Distill-inspired continuous conveyor and central scanner seam dividing structured archival records (left) and editorial visual memory compositions (right) with live ~3px HTML5 Canvas particle dissolution and reverse reconstruction on backward drag.
10. **Achievements and Projects** — Verified hackathons, competitions, student technical builds, research, and community initiatives.
11. **Gallery** — Curated masonry photography grid with event category & year filtering and an accessible fullscreen lightbox viewer.
12. **Alumni Network** — Future-ready mentorship and alumni perspective section (authentic records or composed onboarding callout).
13. **Learning Resources** — Structured roadmaps, DSA guides, workshop materials, notes, and placement preparation.
14. **FAQ** — Plain-language answers covering participation, events, faculty mentorship, team selection, and contact channels (with JSON-LD `FAQPage` structured data).
15. **Final CTA** — `YOUR PLACE IN THE COMMUNITY STARTS HERE.` with unified primary action (`Explore FCIT`).
16. **Editorial Footer** — Official FCIT emblem, HBTU Kanpur identification, structured navigation, verified contact & social placeholders, privacy policy, terms, and copyright.

### Hero & Core Copy Drafts (Verified No-Hyphen & No-Filler Compliance)
- **Hero Headline**: `WE ARE FCIT.`
- **Hero Supporting Headline**: `Where Technology Meets Community.`
- **Hero Description**: `The Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur.`
- **Hero Primary CTA**: `Explore FCIT`
- **Proof Signal**: `Official Student & Faculty Association · Department of CSE & IT, HBTU Kanpur`

### Core Benefits (Outcome Driven)
1. **Learn together through peer sessions** — Guided workshops, algorithm study circles, and engineering talks built around the department curriculum and modern software craft.
2. **Build projects alongside mentors** — Collaborative student software teams paired with faculty guidance to ship practical tools, research prototypes, and campus utilities.
3. **Compete and represent HBTU** — Structured preparation for national hackathons, competitive programming contests, and technical symposia.

### How It Works (Three Steps)
1. **Discover FCIT** — Explore active technical tracks, upcoming department sessions, and open community initiatives across CSE and IT.
2. **Participate in activities** — Register for hands on workshops, coding contests, project sprints, and peer mentorship cohorts directly on the platform.
3. **Contribute to the community** — Share notes, build open source projects, mentor incoming batches, and help organize upcoming department events.

### SEO & AEO Strategy
- **Indexing**: **Index** all evergreen public pages (`/`, `/about`, `/faculty`, `/team`, `/events`, `/history`, `/gallery`, `/achievements`, `/projects`, `/alumni`, `/resources`, `/contact`). Apply `noindex, nofollow` strictly to `/admin/*` routes.
- **Title Template**: `FCIT · Association of Computer Science & Information Technology, HBTU Kanpur`
- **Meta Description**: `Official platform of FCIT, the Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur. Explore events, faculty mentors, student team, history archive, projects, and learning resources.`

---

## 2. Technical MERN Architecture

```
FCIT/
├── client/          React 18 + Vite + Tailwind CSS + GSAP + Framer Motion + Phosphor Icons
├── server/          Node.js + Express + Mongoose + Zod + JWT Cookie Auth + Multer Storage
└── docs/            Architecture, Schema, API Docs, Content Requirements, Progress Tracker
```

### Central Scroll Choreography (`ScrollDirector`)
- Registers **one** passive `scroll` listener on `window` and batches DOM CSS variable updates (`--scroll-progress`, `--bowl-scale`, `--bowl-y`, `--bg-hue`) inside a single `requestAnimationFrame` tick.
- Zero React `setState` on scroll frames.
- Section reveals use `IntersectionObserver` (`threshold: 0.12`, trigger once, `32px` translateY -> `0` over `700ms cubic-bezier(0.22, 1, 0.36, 1)`).
- Complex interactions (`HistoryScanner` canvas particles, `CurvedCarousel` continuous drift) register `IntersectionObserver` pause/resume gates so offscreen engines consume `0%` CPU/GPU.
- Mobile (`< 768px`) disables pinning, disables continuous auto-drift, and maintains native touch scrolling without horizontal bleed.
