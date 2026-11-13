# FCIT 2.0 — Authentic Content Requirements & Administrator Checklist

FCIT 2.0 strictly adheres to the **Authentic Content Policy**: no fabricated faculty names, student names, founding years, statistics, member counts, or AI generated human portraits are ever presented as verified institutional facts.

Where verified information has not yet been provided, the UI renders clearly labeled structural placeholders or composed empty states that future FCIT coordinators can populate directly through the `/admin` dashboard.

## Required Institutional Inputs from FCIT Leadership

| Section / Collection | Required Authentic Data | Current State in Build | Admin Action Path |
|---|---|---|---|
| **Official Emblem & Building Photo** | FCIT circular emblem & CSE Department photo | **Supplied & Integrated** | Verified authentic assets active |
| **Faculty & Mentors** | Full names, exact designations (HOD, Professor, Associate Professor, Assistant Professor), qualifications, areas of expertise, optional photos & HBTU profile URLs | Structural role placeholders labeled `Awaiting Verification` with monochrome architectural SVG portraits | `/admin/faculty` -> Create / Publish / Upload Photo |
| **Student Team** | Student coordinator names, designations, academic year (`2025-26` / `2026-27`), branch/department, GitHub/LinkedIn URLs, optional photos | Structural role slots labeled `Awaiting Verification` for Reelmark carousel preview | `/admin/team` -> Create / Reorder / Upload Photo |
| **Events** | Verified upcoming & past event titles, dates, venues, posters, registration links, deadlines | Composed empty state ready to accept live events | `/admin/events` -> Create & Publish |
| **History Archive** | Verified establishment year, authentic historical photographs, milestone titles, contributors, historical sources | Authentic CSE Building architecture plate + clearly marked `Draft Template` milestones (`{{Year}}`) | `/admin/history` -> Edit / Upload Photo / Mark Verified |
| **Gallery** | Event photo albums with photographer credits, year tags, categories | Authentic Campus Architecture album active; event albums await photography | `/admin/gallery` -> Create Album & Upload Photos |
| **Achievements & Projects** | Verified hackathon awards, publications, student open source repositories | Composed empty state with submission guidance | `/admin/achievements` & `/admin/projects` |
| **Alumni Network** | Verified alumni consent profiles, batch year, current role, mentorship availability | Composed future-ready empty state | `/admin/alumni` |
| **Learning Resources** | Verified DSA sheets, roadmaps, workshop slides, department notes | Curated open-source curriculum category structure + admin upload ready | `/admin/resources` |
| **Contact & Social Links** | Official FCIT email address, social handles (GitHub, LinkedIn, Instagram), room/office location | Clear `[Official Email Pending Configuration]` / placeholder notice until set in `.env` | Configure `.env` & Contact Settings |
