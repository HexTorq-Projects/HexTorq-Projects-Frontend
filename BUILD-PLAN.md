# Hextroq — Project Showcase Site: Build Plan

> An IT agency that builds & sells final-year projects to students.
> Goal: a modern, clean, immersive showcase where students browse 3,500 projects by
> **stream → sub-category → application area**, see pricing, and enquire/buy.

---

## 1. What your data actually looks like (from your Excel + backend)

| Thing | Reality |
|---|---|
| Projects | **3,500** |
| Categories (streams) | **13** — AI/ML (1,398) is huge; .NET (14) tiny |
| Sub-categories | 13 (1:1 with categories right now) |
| Application areas | 9 — General, Healthcare, Transportation, Security, Finance, Education, Environment, Agriculture, E-Commerce |
| Price range | ₹3,500 – ₹7,000 (avg ₹4,937) |
| Tiers | Basic (605) · Standard (2,513) · High (375) · Premium (7) |
| Complexity | Low-Med (2,426) · Medium (664) · High (410) |
| Per project | title, brief, detailed, modules, tech stack, score, prices |

**Design implication:** AI/ML is 40% of the catalog. Don't give every category equal
visual weight — feature the big/premium ones, let long-tail be searchable. Pagination &
search are essential (you already have both in the API). 👍

---

## 2. Recommended Tech Stack (matches your wish list)

**Frontend**
- **React + Vite** (faster than CRA; better for Three.js/GSAP)
- **React Router** — routes below
- **Tailwind CSS** — fast, clean, consistent design system
- **GSAP + ScrollTrigger** — scroll-driven animations, pinning, reveals
- **Three.js + @react-three/fiber + @react-three/drei** — the 3D layer
- **Lenis** (smooth scroll) — the secret sauce behind buttery scroll sites; pairs perfectly with ScrollTrigger
- **Framer Motion** — page transitions & micro-interactions (complements GSAP)
- **TanStack Query (React Query)** — data fetching/caching from your API
- **Zustand** — tiny state store (filters, cart/enquiry list)

**Backend (already built ✅)** — Prisma + Postgres + Express. Small additions needed (see §6).

**Why this combo:** GSAP+Lenis for the "wow" scroll, R3F to keep Three.js declarative
inside React (Claude Code handles this far better than raw Three.js), Tailwind so the
UI stays clean and consistent without you hand-writing CSS.

---

## 3. Site Map / Pages

1. **Home / Landing** — the cinematic scroll experience (hero 3D, stats, featured streams, how-it-works, CTA)
2. **Explore / Catalog** — the workhorse: filter by category + sub-category + application area + price + tier + search, paginated grid
3. **Category page** — `/category/:name` — themed hero per stream + its projects
4. **Project detail** — `/project/:id` — full brief, detailed, modules, tech stack, pricing, "Enquire / Buy" CTA
5. **About Hextroq** — who you are, process, trust signals
6. **Contact / Enquire** — form (WhatsApp + email lead capture)
7. *(Later)* **Admin** — edit projects/prices (your schema already has audit fields for this)

---

## 4. The Scroll / 3D Experience (the "wow" — kept performant)

Guiding rule: **3D as accents, not everywhere.** Heavy WebGL on every page kills mobile.

### Landing page scroll storyboard
1. **Hero** — full-screen. A slow-rotating 3D object (abstract network/node cluster or a
   glowing wireframe "H") reacting subtly to mouse. Headline animates in word-by-word (GSAP SplitText).
2. **Stat counter band** — "3,500+ projects · 13 streams · 9 domains" counting up on scroll.
3. **Streams showcase** — horizontal-pinned scroll: cards for each category slide
   through as you scroll down (ScrollTrigger pin + horizontal translate). AI/ML, Web, IoT featured.
4. **"How it works"** — 3 steps revealing with parallax as you scroll.
5. **Featured premium projects** — the 7 Premium-tier ones, spotlighted.
6. **CTA / footer** — 3D closes out, contact call-to-action.

### Techniques
- **Lenis smooth scroll** globally.
- **ScrollTrigger pinning** for horizontal stream section.
- **Parallax layers** on depth-sorted elements.
- **Scroll-linked 3D**: object rotation/camera tied to scroll progress via R3F + ScrollControls (drei).
- **Reveal-on-scroll** for cards (stagger, fade+translate).
- **Magnetic buttons / hover tilt** on cards.

### Performance guardrails (important with 3,500 items)
- Lazy-load 3D (`React.Suspense`); pause WebGL when off-screen.
- Virtualize/paginate the catalog grid (20/page from API — good).
- `prefers-reduced-motion` fallback (accessibility + weak devices).
- Mobile: swap heavy 3D for lighter animated gradient/canvas.

---

## 5. Design Language (modern + clean)

- **Dark, techy base** (deep navy/near-black) with 1–2 vivid accent gradients (e.g.
  electric violet → cyan). Feels premium + "IT agency".
- Big bold display type + clean sans body (e.g. Clash Display / Space Grotesk + Inter).
- Generous whitespace, glassmorphism cards, subtle grain/noise, soft glows.
- Consistent tier badges (Basic/Standard/High/Premium) with distinct colors.
- Category color-coding for instant scanning.

---

## 6. Backend tweaks needed (small)

Your API is 90% there. Add:
1. **`/application-areas`** endpoint + allow filtering `/projects?applicationArea=&tier=&complexity=&minPrice=&maxPrice=&sort=`
2. **`/stats`** endpoint (counts for the animated landing band) — cache it.
3. **Full-text-ish search** across `brief`/`detailed`, not just title.
4. **`/enquiries`** POST — capture leads (add a small `Enquiry` model), or just forward to WhatsApp/email.
5. **CORS** lock to your domain in prod; keep pagination.
6. Deploy API (Render/Railway/Fly) + DB on Prisma Postgres (your PDF covers this ✅).

---

## 7. Suggested folder structure (for Claude Code)

```
hextroq-web/
  src/
    api/            # React Query hooks -> your Express API
    components/     # Button, Card, Badge, Nav, Footer...
    three/          # R3F scenes, shaders
    animations/     # GSAP/ScrollTrigger utils, Lenis setup
    pages/          # Home, Explore, Category, Project, About, Contact
    store/          # Zustand
    styles/         # Tailwind config, tokens
    lib/            # helpers, constants (tier colors, category meta)
  public/
```

---

## 8. Build phases (suggested order)

- **Phase 0** — Deploy backend + DB, confirm API reachable online.
- **Phase 1** — Frontend scaffold (Vite+React+Tailwind+Router), design tokens, Nav/Footer, API layer.
- **Phase 2** — Explore/Catalog + Project detail (the functional core — most valuable first).
- **Phase 3** — Landing page with GSAP + Lenis scroll magic.
- **Phase 4** — Three.js hero + scroll-linked 3D accents.
- **Phase 5** — About/Contact/Enquiry, polish, performance, mobile, SEO, deploy.

Ship the *useful* part (catalog) before the *flashy* part (3D) so it's always demoable.

---

## 9. Open questions for Sweet (decide before Claude Code starts)

1. **Selling model:** direct online payment (Razorpay), or **enquiry/WhatsApp lead** then manual? (Enquiry is simpler & typical for agencies.)
2. **Branding:** got a Hextroq logo + brand colors, or should we define them?
3. **Do students need accounts/login?** Or fully public browse + enquire?
4. **Sub-categories** are currently 1:1 with categories — keep as-is or plan deeper nesting later?
5. **Hosting target** for frontend (Vercel is ideal for Vite+React).
6. Want an **admin panel** now or later? (Schema already supports edits/audit.)
