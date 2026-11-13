# Free Stack & Zero Budget Architecture Record

FCIT 2.0 is built under a strict **zero development and runtime budget policy**. Every library, asset pipeline, database layer, and optional deployment target listed here operates without mandatory subscriptions, paid APIs, or payment card requirements during development.

## 1. Selected Core Stack (100% Free & Open Source)

| Layer | Technology | License / Cost | Selection Rationale | Usage Constraints & Alternatives |
|---|---|---|---|---|
| Frontend UI | React 18 + Vite + React Router | MIT / Free | Fast bundling, lazy route splitting, zero licensing cost | Requires static/SPA host with rewrite fallback (`/* -> /index.html`). Alt: Astro / Next.js. |
| Styling System | Tailwind CSS + Custom CSS Tokens | MIT / Free | Zero runtime overhead, strict design token alignment | Avoid arbitrary font/spacing utilities outside `tokens.css` & `typography.css`. |
| Fonts | `@fontsource/geist` & `@fontsource/geist-mono` | SIL OFL / MIT / Free | Self hosted local `.woff2` bundles; zero third party font CDN requests or tracking | Increases bundle by ~150KB total subsetted woff2; Alt: local static `/public/fonts`. |
| Icons | `@phosphor-icons/react` | MIT / Free | Clean geometric stroke weights, zero attribution fee | Single unified icon set across UI. |
| Motion & Scroll | GSAP + ScrollTrigger (`gsap`) + Framer Motion | Free (Standard GSAP Free tier / MIT) | Smooth GPU transform/opacity reveals, pinned desktop statement, accessible reduced motion fallback | Note: Use only core GSAP + ScrollTrigger (free standard license; never Club GSAP paid plugins!). |
| Forms & Validation | React Hook Form + Zod | MIT / Free | Shared validation philosophy with backend, accessible inline error messaging | Client + server both validate with Zod. |
| Backend API | Node.js + Express.js | MIT / Free | Lightweight REST API, strong middleware ecosystem | Single Node process; scale horizontally only if traffic warrants. |
| Database | MongoDB + Mongoose | SSPL / MIT | Native document schema for events, faculty, team, history, gallery, resources | Development uses local `mongod` or persistent local binary (`mongodb-memory-server` dev fallback). Production: MongoDB Atlas M0 Free Tier (or self hosted campus VPS). |
| Security Middleware | `helmet`, `cors`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `multer` | MIT / ISC / Free | Industry standard protection with zero paid auth vendor lock in | Store `JWT_SECRET` exclusively in environment variables. |
| Image Optimization | Local Python Pillow / Node build scripts | Open Source / Free | Local WebP + JPEG responsive exports with zero Cloudinary / Imgix transformation fees | Local disk storage in dev (`server/uploads/`). |

## 2. Optional Hosting, Database & Email Services (Verify Before Provisioning)

Because free cloud tiers change limits and policies over time, **verify exact current quotas on each provider's official pricing page immediately before production deployment**:

1. **Database — MongoDB Atlas M0 Shared Cluster (or Campus Self Hosted MongoDB)**
   - **Typical Free Limits**: ~512 MB data storage, shared RAM/vCPU, no credit card normally required for M0 sandbox, automatic pause after prolonged inactivity on free clusters if unvisited.
   - **Constraints**: Do not store large raw binary images inside MongoDB documents (store only relative URLs/metadata; keep `server/uploads/` or external object storage separate).
   - **Alternative**: Self hosted MongoDB Community Server on an institutional HBTU Kanpur server/VM.

2. **Image Storage — Provider Independent Layer (`server/services/storageService.js`)**
   - **Selected Default**: `LocalDiskStorageProvider` writing validated files to `server/uploads/` (gitignored).
   - **Why**: Zero third party API keys, zero credit card requirement, no monthly egress surprise during development.
   - **Optional Cloud Adapter**: Includes a zero dependency signed REST `CloudinaryStorageProvider` activated ONLY if `STORAGE_PROVIDER=cloudinary` and valid Cloudinary credentials are configured in `.env`; defaults to local disk storage otherwise.
   - **Constraints**: Ephemeral container hosts (like some PaaS free web tiers) wipe local disk on redeploy! When deploying to an ephemeral free host, configure a free tier object store (`STORAGE_PROVIDER=cloudinary` or an S3 compatible adapter such as Cloudflare R2 / Backblaze B2 — verify current quotas/card requirements first) without changing any controller code. **Never make paid plans a mandatory dependency.**

3. **Contact Email — Database Storage + `mailto:` Fallback + Optional Free SMTP**
   - **Selected Default**: All contact form submissions are validated and persisted securely to MongoDB (`contactMessages` collection) so future FCIT admins view and manage inquiries directly inside `/admin`. Additionally, a clean `mailto:` link is exposed as a zero dependency client fallback.
   - **Optional Enhancement**: If an official FCIT email account (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) becomes available, configure environment variables to enable optional notification emails via `nodemailer` without code edits.
   - **Alternatives**: Gmail App Password SMTP (low daily quota), Brevo free SMTP tier (verify daily send cap).

4. **Frontend & Backend Hosting (Evaluation Checklist Only — No Paid Upgrades)**
   - **Static Frontend Candidates**: Cloudflare Pages, Vercel Hobby (check non commercial/university organization rules!), GitHub Pages, or Netlify Free.
   - **Node Backend Candidates**: Render Free Web Service (note: sleeps after ~15 min inactivity, cold start delay, ephemeral disk!), Koyeb Free Tier, or HBTU institutional Linux server (`systemd` + `nginx` + `certbot` Let's Encrypt SSL — 100% free with zero sleep!).

## 3. Services That Must NEVER Be Upgraded Without Explicit Approval

- **MongoDB Atlas M0 -> Paid M10+ clusters**
- **Cloudflare R2 / Cloudinary / AWS S3 paid storage or bandwidth overages**
- **Paid Email Providers (SendGrid Pro, Mailgun, Postmark paid tiers)**
- **Club GSAP / Paid UI Component Kits / Stock Photography Subscriptions**
- **Paid Analytics (GA360, Mixpanel paid, Hotjar paid) or Paid Auth SaaS (Auth0/Clerk paid seats)**
- **Paid Cloud Hosting / Compute Autoscaling**
