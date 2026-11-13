# FCIT 2.0 — Official Website of the Association of Computer Science & Information Technology, HBTU Kanpur

FCIT 2.0 is a full stack MERN platform built for the **Association of Computer Science and Information Technology** at **Harcourt Butler Technical University, Kanpur**.

It combines an editorial light visual system (warm cream surface, institutional navy and gold derived from the official FCIT emblem, pastel atmospheric transitions), native scroll choreography (`ScrollDirector`), a Reelmark inspired curved team showcase, a Distill inspired interactive canvas particle history archive, accessible public routes, and a role protected Admin Dashboard.

---

## Project Structure

```
FCIT/
├── client/                  React 18 + Vite + Tailwind CSS + GSAP + Framer Motion + Phosphor Icons
│   ├── public/assets/       Official circular emblem, enhanced CSE & IT department photo, OG branding
│   └── src/
│       ├── animations/      ScrollDirector (single passive rAF scroll engine)
│       ├── components/      Navigation, Hero, People & CurvedCarousel, HistoryScanner, Events, Gallery, Footer
│       ├── context/         Cookie session AuthContext
│       ├── data/            Verified institutional identity & clearly labeled placeholder templates
│       ├── hooks/           Document metadata, IntersectionObserver reveals, API fetching
│       ├── layouts/         MainLayout with Halden atmospheric bowl glow
│       ├── pages/           16 public routes + Login + Role protected Admin Dashboard
│       └── styles/          tokens.css, typography.css (named SKILL.md scale), motion.css
├── server/                  Node.js + Express + Mongoose + Zod + JWT Cookie Auth + Multer Upload
│   ├── config/              Environment validation & MongoDB connection (with persistent dev fallback)
│   ├── controllers/         REST API & shared CRUD handlers
│   ├── middleware/          JWT auth, 6 role RBAC, Zod body validation, magic-byte file verification, rate limiters
│   ├── models/              15 Mongoose schemas (Users, Faculty, Team, Events, History, Gallery, Resources, etc.)
│   ├── routes/              Modular REST endpoints
│   ├── scripts/             seedAdmin.js (Super Admin provisioning) & verifyApi.mjs
│   ├── services/            Provider independent LocalDiskStorageProvider & optional Nodemailer SMTP
│   └── validators/          Shared Zod schemas
├── docs/                    Architecture, Database Schema, API Docs, Content Requirements, Progress Tracker
├── FREE_STACK.md            Zero budget architecture & free tier constraints record
└── .env.example             Complete environment variable template
```

---

## Local Development Setup

### Prerequisites
- **Node.js** `>= 20.x` (tested on `v22.16.0`)
- **npm** `>= 10.x`
- **MongoDB**: Local MongoDB Community Server OR MongoDB Atlas M0 URI in `server/.env`. (In `development`, if no local `mongod` service is listening at `127.0.0.1:27017`, `server/config/db.js` automatically starts a persistent local MongoDB instance backed by `server/.data/mongodb`.)

### 1. Install Dependencies
```bash
npm --prefix client install
npm --prefix server install
```

### 2. Configure Environment Variables
Copy `.env.example` into `server/.env` and `client/.env`:
```bash
# server/.env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/fcit_db
JWT_SECRET=replace_with_64_char_cryptographically_random_secret
```

Generate a secure `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Provision Initial Super Admin Account
Never hardcode credentials. Supply `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `server/.env` or interactively:
```bash
npm run seed:admin
```

### 4. Run Backend & Frontend
In two terminals:
```bash
npm run dev:server   # Express API on http://localhost:5000
npm run dev:client   # Vite dev server on http://localhost:5173 (proxies /api and /uploads)
```

---

## Verification & Testing

- **Production Frontend Build**:
  ```bash
  npm run build
  ```
- **Backend Security & CRUD Integration Check**:
  ```bash
  node server/scripts/verifyApi.mjs
  ```

---

## Zero Budget Deployment Notes

Review `FREE_STACK.md` before deploying to production:
1. Set `NODE_ENV=production`, a strong random `JWT_SECRET`, `CLIENT_ORIGIN` matching your HTTPS domain, and a production `MONGODB_URI` (e.g., MongoDB Atlas M0 free tier or campus server).
2. Ensure HTTPS is active in production so `httpOnly` `secure` session cookies transmit cleanly.
3. Because ephemeral free PaaS containers discard local filesystem writes on restart, mount a persistent disk for `server/uploads/` or implement an object storage adapter inside `server/services/storageService.js` before going live.
4. Keep `SEED_ADMIN_PASSWORD` out of version control and rotate secrets after initial provisioning.
