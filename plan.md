# Hextroq Frontend — Full Redesign & Fix Plan

> Status: **PLANNING ONLY** — nothing in this document has been implemented yet.
> This is the complete, itemized to-do list covering all 15 requests, translated into
> concrete technical steps against the real files in `projects-frontend/src`.
> Review this, adjust anything that doesn't match what you meant, and then say "go"
> and implementation proceeds top to bottom.

---

## 0. Bugs found during review (not explicitly asked for, but they explain 3 of your complaints)

These are real defects I found reading the code — they map directly to items **#10** and **#12** below, so I'm flagging the root cause here once instead of repeating it.

| # | Bug | File | Root cause |
|---|---|---|---|
| B1 | **"Reset all" / "Clear All Filters" buttons don't actually clear filters** | `src/store/useFilterStore.ts` line 30 | `reset: () => set({ ...initial })` — Zustand's `set()` **shallow-merges**. `initial` only contains `{ sort, page }`, so calling reset only overwrites those two keys. `search`, `category`, `applicationArea`, `tier`, `complexity`, `minPrice`, `maxPrice` are never unset — they silently keep their old values. This is exactly your "reset button not working" report. |
| B2 | **Wishlist heart button visually detaches from the card on hover** | `src/components/project/ProjectCard.tsx` lines 105–108 | The card itself gets `hover:-translate-y-1.5 hover:scale-[1.012]` (it lifts/scales). The `WishlistButton` wrapper is a **sibling** of the `Card`, positioned `absolute` on the *outer* group `div`, which never moves. Result: on hover, the card slides/scales but the heart button stays pinned to its original spot — reads as "the button stays fixed while the card doesn't." |
| B3 | **Explore/Category page background grain doesn't blend, looks inconsistent with Home** | `src/pages/Explore.tsx` line 265, `src/pages/CategoryPage.tsx` line 42 | Both pages apply the `aurora grain` utility classes, but `.grain::before` is `position: absolute` and needs a `position: relative` ancestor to clip against. `Home.tsx` wraps its aurora layer in an explicit `relative` container (line 244); Explore/Category never set `relative` on their root div, so the grain overlay paints against whatever the nearest positioned ancestor happens to be (the `<body>`/root), instead of clipping to that page's container — this is why the container color "doesn't blend." |

These three get fixed as part of items #10 and #12 below, not as separate work.

---

## 1. Home page — branding, nav underline, light-mode contrast, hero copy, typewriter line, default theme, slower counters

**Files:** `src/components/layout/Navbar.tsx`, `src/pages/Home.tsx`, `src/styles/globals.css`, `index.html`, `src/components/motion/CountUp.tsx`, `src/components/layout/Footer.tsx`, new `src/components/motion/Typewriter.tsx`

1.1 **Company name → "Hextorq"**
   - You've spelled it "hextorq" in the request; the codebase currently says "Hextroq" everywhere (nav logo, footer, page titles, About copy, backend contact strings). Renaming the brand touches **12 files** (grep already located them: `Navbar.tsx`, `Footer.tsx`, `Home.tsx`, `About.tsx`, `Contact.tsx`, `Login.tsx`, `Dashboard.tsx`, `AuthModal.tsx`, `EnquiryModal.tsx`, `useAuthStore.ts`, `constants.ts`, `globals.css` comments, plus `index.html` `<title>`/meta description, plus `package.json` name field).
   - **Assumption to confirm:** I'll do a full literal find/replace `Hextroq → Hextorq` and `HEXTROQ → HEXTORQ` across the frontend (display text only — not folder/package names, to avoid breaking imports/scripts). Flag if you actually want the folder/package renamed too (bigger, riskier change).

1.2 **Better logo text styling** (`Navbar.tsx` line 76-80)
   - Current: plain `text-gradient` on a text string, no icon, no letter treatment.
   - New: add a small mark (icon or geometric monogram, e.g. a stylized hex/torque glyph built from an SVG or a Lucide icon like `Hexagon`) to the left of the wordmark, tighten tracking, add a subtle weight contrast (e.g. bold "HEX" + medium "TORQ" or a small accent dot), keep the gradient but make it richer (add a 3rd stop). Apply the same wordmark to the Footer logo for consistency.

1.3 **Nav underline on current page** (`Navbar.tsx` lines 84-101)
   - Current active-page indicator is a pill background (`layoutId="nav-active-pill"`), not an underline.
   - Add a `motion.span` animated underline (`layoutId="nav-underline"`) positioned `absolute -bottom-1 left-3.5 right-3.5 h-[2px] bg-cyan rounded-full`, driven by the same `active(link.path)` check, animated via shared layout so it slides between links on route change instead of just fading.

1.4 **Light mode text visibility** (`globals.css` lines 6-20)
   - Root cause: `--muted: #4a5170` and `--faint: #7f87a8` on `--bg: #f2f4fc` pass contrast for body copy but several places (hero subtitle, card descriptions, stat labels) use `text-muted`/`text-faint` **on white/`--surface` cards**, and some rely on the twilight-pastel accent colors (`--color-violet: #a7b7e7`, `--color-cyan: #d8e2ff`) directly as *text* color in light mode — those pastels have low contrast against light backgrounds (they were tuned for dark-mode glow, not as light-mode text).
   - Fix: darken the light-mode tokens — `--muted` → a stronger slate (e.g. `#3a4160`), `--faint` → `#5b6386`, and add **light-mode-specific overrides** for `--color-violet`/`--color-cyan`/`--color-indigo` so text-colored usages (category dots' labels, "Browse Stream" links, stat numbers) resolve to darker, AA-contrast variants in light mode while keeping the airy pastel look for backgrounds/borders/glows. Audit every `text-violet`, `text-cyan` usage used as body/label text (not just accents) and swap to the darker token where needed.

1.5 **Hero headline/subtext → more professional copy** (`Home.tsx` lines 265-271)
   - Current: "Deploy Final-Year Projects / With Full Confidence." + a run-on sentence about "3,800+ academic-ready software source-code deliverables."
   - Rewrite to something tighter and more agency-grade, e.g.:
     - H1: "Engineering Excellence, Delivered." / gradient line: "Final-Year Projects, Done Right."
     - Subtext: "3,800+ production-ready source codes across 6 engineering streams. Work directly with Hextorq engineers to customize, deploy, and defend your project with confidence."
   - (Final wording will be polished at implementation time — this is the direction, not locked copy.)

1.6 **Typewriter second line ("Twriting" style)**
   - Interpretation: you want the gradient second line of the H1 (currently static "With Full Confidence.") to **cycle through a list of phrases**, one word/phrase revealed at a time, typewriter-style — matching the "type, delete, type next" effect popularized by libraries like Typewriter.js/react-simple-typewriter.
   - New component `src/components/motion/Typewriter.tsx`: custom hook-driven typewriter (no new dependency needed — implement with `useState`/`useEffect` char-index stepping, respecting `prefers-reduced-motion` by freezing on the first phrase).
   - Phrase list (placeholder, tune later): `["With Full Confidence.", "Built For Your Viva.", "Ready In Minutes.", "Backed By Real Engineers."]`
   - Cursor blink via CSS (`animate-pulse` bar), typing speed ~55ms/char, hold 1.6s, delete ~30ms/char.

1.7 **Default theme = dark (currently defaults to light)**
   - `Navbar.tsx` lines 18-22: `useState(() => { const stored = localStorage.getItem("hextroq-theme"); if (stored) return stored === "dark"; return false; })` — the `return false` fallback is the light default.
   - Change fallback to `true` (dark) when no stored preference exists. Also rename the localStorage key `hextroq-theme` → `hextorq-theme` per the rebrand (with a one-time migration read of the old key so existing visitors don't get their preference reset).

1.8 **Slow down the project-count animation** (`CountUp.tsx`)
   - Current default `duration = 1.4` seconds with a cubic-ease-out. Increase default duration (e.g. `2.6`–`3s`) and/or ease it more gradually so the "3,800+" ribbon counts up more deliberately on the home page stat ribbon (`Home.tsx` lines 291-323 pass no explicit `duration`, so they inherit the default — bumping the default is the single change needed, no call-site edits required unless we want Home-specific pacing different from other `CountUp` usages elsewhere).

---

## 2. New section after the hero: "What We Assure" (teaching / learning / mentorship framing)

**Files:** `src/pages/Home.tsx` (new section inserted between the Hero and the Stats ribbon, or directly after Stats — see placement note)

- Add a new `<section>` right after the hero text block, before/around the stats ribbon (stats ribbon currently overlaps the hero visually with `-mt-10/-mt-12`, so the new section slots in **after** the stats ribbon to avoid breaking that overlap effect — flag if you specifically want it wedged between hero text and the stats ribbon instead).
- Content pillars (3–4 cards, reusing the existing `Reveal` + `Card` pattern already used for "Academic Delivery Package"):
  1. **"You Learn the System"** — not just handed code; walked through architecture, so the project is genuinely understood.
  2. **"Real Engineering Mentorship"** — direct access to the engineers who built it, not a support ticket queue.
  3. **"Viva-Ready, Not Just Demo-Ready"** — coaching framed around defending the work in front of a review panel.
  4. *(optional 4th)* **"Grow Beyond the Submission"** — positioning this as a stepping stone into real-world engineering practice, not a one-off purchase.
- Visually: use the same glass-card grid style as the "Academic Delivery Package" section for consistency, with a distinct icon set (e.g. `GraduationCap`, `Users`, `Shield`, `TrendingUp` from `lucide-react`) so it doesn't feel duplicated.
- Heading: "What We Assure" (or "Our Commitment" — will finalize wording at build time).

---

## 3. Browser tab `<title>` should change/cycle after some time

**Files:** `index.html`, new hook `src/lib/useRotatingTitle.ts`, wired in `src/App.tsx`

- Interpretation: the browser tab text (`<title>`) should rotate through a small set of messages periodically while the user has the site open — a common attention-grabbing pattern (also frequently used to nudge users back when they've tabbed away, via the `visibilitychange` event).
- Plan: a small hook that cycles `document.title` every ~4–5s through phrases like `"Hextorq — Final-Year Projects"`, `"3,800+ Projects Ready"`, `"Talk to an Engineer Today"`, mounted once in `App.tsx`. Optionally special-case: when the tab loses focus (`document.hidden`), switch immediately to something like `"Come back! 👋"` and restore the normal rotation when focus returns.
- Cleans up its interval/listener on unmount.

---

## 4. Reveal animations via GSAP + scroll-triggered choreography site-wide

**Files:** `src/components/motion/Reveal.tsx` (rework), new `src/lib/gsapReveal.ts`, touches every page that currently uses `<Reveal>` (`Home.tsx`, `Footer.tsx`) plus adds it to pages that currently have **no** scroll-reveal at all (`About.tsx`, `ProjectDetail.tsx`, `CategoryPage.tsx`, `Explore.tsx` cards already animate via Framer's `whileInView` in `ProjectCard.tsx`).

- Right now `gsap` + `ScrollTrigger` are installed and registered (`LenisProvider.tsx`) purely to drive Lenis's scroll-linked `ScrollTrigger.update`, but **no component actually uses `ScrollTrigger` for reveals** — all current reveals (`Reveal.tsx`, `ProjectCard.tsx`) are Framer Motion `whileInView`, which is fine but isn't "GSAP" as requested.
- Plan: introduce a GSAP-based reveal utility (`gsapReveal.ts`) using `gsap.fromTo` + `ScrollTrigger` (`trigger`, `start: "top 85%"`, stagger for grouped elements), and repoint `Reveal.tsx` to use it instead of (or alongside) Framer, so it's genuinely GSAP-driven and can do things Framer's `whileInView` can't cleanly do — staggered batches, scrub-linked reveals, pinning.
- Apply reveals to sections currently static: About page's trust cards, FAQ grid, ProjectDetail's description/module blocks, CategoryPage's hero + grid.
- Keep the existing `prefers-reduced-motion` guard (skip animation entirely, matching current `Reveal.tsx` behavior).

*(Note: "scroll iagination" — read as "scroll pagination." Item #13 below already redesigns Explore's pagination controls with an explicit row/column layout switch; I'm keeping Prev/Next-style pagination there rather than infinite-scroll, since #13 explicitly asks for a page-size/row-count control which implies discrete pages. If you actually want infinite-scroll-on-scroll instead of Prev/Next buttons, tell me and I'll fold that into #13 instead.)*

---

## 5. "Select Your Stream" cards — more creative design, cards that shift/reorder periodically

**Files:** `src/pages/Home.tsx` lines 325-370

- Current: a static 3-column grid of plain glass cards (color dot, count, title, description, "Browse Stream" link).
- Redesign direction:
  - Vary card visual treatment instead of identical boxes — e.g. size variance (a featured "hero" card for the top stream, AI/ML, spanning 2 columns given it's 40%+ of the catalog per `BUILD-PLAN.md`), category-tinted background washes using each stream's `categoryMeta(...).color` instead of just a small dot, and a hover-tilt/parallax micro-interaction.
  - **"Cards shift upon a rapid time"**: interpreted as the cards periodically re-sequencing/re-shuffling their order (or subtly swapping positions) on an interval — implement via a `setInterval` that rotates the `mainStreams` array (e.g. `array.push(array.shift())`) every ~4–6s, animated with a Framer Motion `layout` transition (or GSAP FLIP) so the reordering itself animates smoothly rather than popping. Pauses on hover so users can actually click a card mid-shuffle, and respects `prefers-reduced-motion` (freezes order).

---

## 6. Add a scroll carousel — "heat hoseule" (interpreted as a **hot/featured projects carousel**)

**Files:** new `src/components/project/FeaturedCarousel.tsx`, wired into `src/pages/Home.tsx`

- Interpretation: "heat hoseule" most likely garbles "hot schedule"/"hot showcase" — i.e. a horizontally-scrolling carousel of "hot"/trending projects, distinct from the existing static "Premium Spotlights" grid.
- Plan: build a horizontal drag/scroll-snap carousel (CSS `scroll-snap-type: x mandatory` + Framer Motion `drag="x"` with `dragConstraints`, or GSAP horizontal ScrollTrigger pin) showcasing a rotating set of "hot" projects (e.g. highest `importanceScore`, or a manually curated `isHot`-style subset — will use top-N by `importanceScore` from `useProjects({ sort: "importance" })` since there's no existing "hot" flag in the schema). Includes left/right nav arrows + swipe support, auto-advances every few seconds and pauses on hover/interaction.
- Placed either directly after the "Select Your Stream" grid or folded into where the "Premium Spotlights" section currently sits — will keep both but differentiate them clearly (one = premium/high-value tier, one = trending/rotating).

---

## 7. Home page: surface "5%+ discount per project" messaging

**Files:** `src/pages/Home.tsx`, possibly `src/components/project/PriceBlock.tsx` (already renders a "% off" pill when `discountedPrice < originalPrice` — see lines 29-33)

- Add an explicit, prominent line somewhere in the hero or stats-ribbon area: e.g. a small badge/ribbon "Every project — 5%+ off, always." near the hero CTA buttons, or as a 5th stat-ribbon tile. Exact placement: a slim badge under the hero subtext (next to the existing "Elite Engineering Final-Year Projects" pill) reading something like "💸 5%+ Off Every Project" so it's visible above the fold without cluttering the headline.
- This is purely additive copy/UI — no pricing logic changes (the backend/`PriceBlock` already computes and displays real per-project discount percentages via `discountPercent()` in `src/lib/format.ts`).

---

## 8. Spotlight ("Premium Spotlights") section — rotate projects over time; "View All" → "Explore All Premium" without the count

**Files:** `src/pages/Home.tsx` lines 372-406

8.1 **Rotate spotlighted projects on a timer**
   - Currently: `const premiumProjects = premiumData?.items.slice(0, 3)` — a static first-3 slice, never changes.
   - Change: fetch a larger pool (e.g. all Premium items, or a higher `perPage`), then cycle which 3 are displayed every N seconds (e.g. 6–8s) with a crossfade/slide transition (Framer `AnimatePresence` swapping the 3 `ProjectCard`s), pausing on hover.

8.2 **CTA button copy**
   - Current: `View All Premium ({stats?.premiumCount || 21})` (`Home.tsx` line 393).
   - Change to: `Explore All Premium` — remove the count entirely per your instruction ("keep as explore all premium, don't show count").

---

## 9. "Interactive Showcase" section — rework away from generic terminal demo toward site-specific design

**Files:** `src/pages/Home.tsx` lines 408-462 (the `TerminalSandbox` function + its containing section)

- Current: a fake terminal simulating `git clone` → `npm install` → `prisma db push` → `npm run dev`. Functional and kind of neat, but generic/dev-tool-flavored rather than reflecting *Hextorq's* actual product experience.
- Interpretation ("not goods, but make it fit our website thing"): replace the generic "deploy any project" terminal illusion with something that visually demonstrates **Hextorq's actual flow** — e.g. an animated mini-mockup of the real product: a simulated "browse → filter → enquire on WhatsApp → get code" sequence shown as a small interactive device-frame animation (phone/browser mockup cycling through: catalog grid → project card → WhatsApp chat bubble → checkmark "delivered"), rather than a raw shell.
- Keep the "3 step milestones" copy (Select → Enquire & Customize → Local Handoff) as-is since that content is accurate; only the right-column visual widget changes design language, from "generic dev terminal" to "Hextorq product walkthrough," with sharper card framing (device bezel, subtle shadow/glass edge) to look more custom-built rather than templated.

---

## 10. Explore Projects — fix filters & fix Reset buttons

**Files:** `src/store/useFilterStore.ts`, `src/pages/Explore.tsx`

- This is **Bug B1** from §0: `reset()` only overwrites `sort`/`page`, leaving every other filter field untouched.
- Fix: explicitly null out every filter key on reset:
  ```ts
  reset: () => set({
    search: undefined,
    category: undefined,
    applicationArea: undefined,
    tier: undefined,
    complexity: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sort: "importance",
    page: 1,
  }),
  ```
- Verify both call sites work after the fix: the sidebar's "Reset all" (`Explore.tsx` line 70) and the empty-state's "Clear All Filters" (line 349) both call `store.reset()`, so one store fix resolves both.
- Double-check the individual filter setters (`setCategory`, `setTier`, etc.) aren't affected — they already look correct (each explicitly sets its own key), so this is isolated to `reset()`.

---

## 11. Filters section → collapsible

**Files:** `src/pages/Explore.tsx` (desktop `<aside>` block, lines 268-273, and the extracted `SidebarContent`)

- Wrap the desktop sidebar filter panel in a collapse/expand control: a header bar with a chevron/toggle button that collapses `SidebarContent` (height/opacity animate via Framer `AnimatePresence`, matching the pattern already used for the mobile drawer). Persist the collapsed/expanded state in `useUiStore` (new field, e.g. `filterPanelCollapsed`) so it's remembered across navigation within the session.
- When collapsed, the sidebar shrinks to a slim rail (icon + "Filters" label + active-count badge + expand chevron) so the results grid can reclaim that width — grid column count adjusts responsively (ties into #13's row-count logic).

---

## 12. Explore container color blending + project card structure/wishlist-button fixes

**Files:** `src/pages/Explore.tsx`, `src/pages/CategoryPage.tsx`, `src/components/project/ProjectCard.tsx`

12.1 **Container color/grain blending** — this is **Bug B3** from §0.
   - Fix: add `relative` to the root wrapper `div` in both `Explore.tsx` (line 265) and `CategoryPage.tsx` (line 42) so the `.grain::before` absolutely-positioned overlay clips correctly to that page's container instead of the nearest unrelated positioned ancestor — matching how `Home.tsx` already does it correctly (line 244).

12.2 **Project card visual structure** — restructure `ProjectCard.tsx` for clearer hierarchy:
   - Current layout stacks badges → title → brief → tech tags → divider → complexity/price fairly densely with several `relative z-10` patches (a sign the layering was being fought against, not designed for).
   - Redesign: clearer visual rhythm — slightly larger title area with defined height so titles of different lengths don't shift the footer position as much (currently handled by `line-clamp-2`, will keep but pair with a fixed-height header zone), better spacing rhythm between tech tags and the price footer, a more deliberate premium treatment (currently an amber shine sweep — keep but tie the card border/glow more tightly to the tier color system already defined in `constants.ts`), and category-color accents used a bit more (e.g. a soft left-edge color bar in addition to the existing top bar) so cards are scannable by stream color at a glance.

12.3 **Wishlist button detachment** — this is **Bug B2** from §0.
   - Fix: move the `WishlistButton` **inside** the same transform-affected wrapper as the `Card`, instead of being a sibling positioned against the outer (non-transforming) group `div`. Concretely: nest it inside the `<Link>`/`Card` composition (or apply the hover lift/scale transform to the outer wrapper `div` itself instead of the inner `Card`, so both the card *and* the floating button move together). Either approach makes the heart button visually "stick" to the card during the hover lift instead of staying pinned in place.

---

## 13. Explore — row/column layout control (grid density toggle), default 3 columns, responsive

**Files:** `src/pages/Explore.tsx`, `src/store/useUiStore.ts` (new `gridColumns` state, persisted)

- Add a layout control next to the existing Sort dropdown (`Explore.tsx` lines 304-317): a small segmented control / icon button group (e.g. `LayoutGrid` icons for 2 / 3 / 4 columns, using `lucide-react` icons already in use elsewhere) that lets the user choose grid density.
- Default: **3 columns** (matches the current `xl:grid-cols-3` behavior) — store this as the default in a new Zustand field (`useUiStore.gridColumns`, default `3`), persisted to `localStorage` (via Zustand's `persist` middleware, same pattern already used in `useAuthStore.ts`) so the preference survives reloads.
- The grid's Tailwind classes become dynamic based on `gridColumns` (2/3/4), while still collapsing down to 1 column on narrow mobile viewports regardless of the chosen desktop density (i.e. the user's column choice only applies at `sm:`/`lg:`/`xl:` breakpoints, never forces >1 column below a width where cards would become unreadably narrow) — this satisfies "adjust to the screen."
- Apply the same control/store value to `CategoryPage.tsx`'s grid for consistency (currently hardcoded `sm:grid-cols-2 lg:grid-cols-3`).

---

## 14. Sign In / Login button color

**Files:** `src/components/ui/Button.tsx` (the shared `variants.primary` definition), `src/pages/Login.tsx`, `src/pages/Register.tsx`

- The "Sign In" nav button (`Navbar.tsx` line 146) and the Login/Register form submit buttons all use `variant="primary"`, which currently resolves to `bg-brand` (the violet→indigo→cyan gradient) — same treatment as every other primary CTA on the site (e.g. "Browse Projects Catalog").
- Since you want *specifically* the sign-in/login buttons to stand out with a different color (distinct from generic CTAs), plan: introduce a new button variant, e.g. `variant="auth"`, with its own distinct color treatment (a solid accent color — candidate: a warm amber/gold or a deep indigo solid, to be confirmed against the final rebrand palette from #1) applied only to the Navbar's "Sign In" button and the Login/Register submit buttons, leaving all other primary CTAs (Browse Catalog, Enquire, etc.) on the existing gradient so this doesn't visually flatten the whole site's button language.

---

## 15. Loading animations

**Files:** new `src/components/ui/PageLoader.tsx`, `src/App.tsx`, spot-checks in `Explore.tsx`/`ProjectDetail.tsx`/`Home.tsx` (skeletons already exist in several places — see below)

- Current state: the app already has `Skeleton.tsx` (pulse-block placeholders) used in `Explore.tsx` (catalog grid loading), `CategoryPage.tsx`, and `ProjectDetail.tsx` — these are fine and stay as-is.
- What's missing: a **route-level / initial-load** animation — right now navigating or first-loading the app has no branded loading state at all (blank flash before content paints).
- Plan: add a lightweight branded `PageLoader` (logo mark from #1.2 pulsing/rotating, or a slim top-of-page progress bar in the style of NProgress) shown during: (a) the very first app boot (`main.tsx`/`App.tsx`, briefly, so fonts/first paint don't flash unstyled), and (b) route transitions if a route's data isn't ready yet (tie into TanStack Query's `isLoading` at the route level, or a simple top progress bar keyed to `useLocation()` changes in `App.tsx`'s existing `AnimatedRoutes`).
- Also add a small spinner/pulse state to the `TerminalSandbox`-replacement widget from #9 if it fetches/simulates anything asynchronously, and confirm the existing `Spinner.tsx` component (already used in `Login.tsx` for the submit button) is reused consistently rather than one-off spinners being hand-rolled elsewhere.

---

## Suggested implementation order

Given dependencies between items (e.g. the rebrand touches many files that later items also touch; the theme/contrast fix affects every subsequent visual change), the sanest build order is:

1. **#0 bugs (B1 reset, B3 grain)** — quick, isolated, unblocks correct testing of everything else.
2. **#1** rebrand + theme/contrast + default-dark + nav underline + hero copy/typewriter (foundational — every other page inherits these tokens/components).
3. **#14** button variant (small, isolated, but easiest to slot in right after the brand palette is finalized in #1).
4. **#2** new "What We Assure" section.
5. **#7** discount messaging (tiny, fast win).
6. **#5, #6, #8, #9** — the four Home-page section reworks (stream cards, carousel, spotlight rotation, showcase redesign) — grouped since they're all Home.tsx and benefit from being reviewed together.
7. **#4** GSAP reveal system — apply once the sections it needs to animate (from steps above) are in their final shape.
8. **#10, #11, #12, #13** — Explore page pass (filters fix → collapsible sidebar → card/blend fixes → grid density control), in that order since each builds on the prior fix.
9. **#3** rotating tab title (independent, can slot in anywhere).
10. **#15** loading animations (last, since it should wrap the now-final page/route structure).

---

## Things I need you to confirm before I start (flagged inline above too)

1. **Brand spelling**: "Hextorq" (your latest messages) vs. "Hextroq" (existing codebase/domain-sounding name) — confirming I should replace *all* visible instances of "Hextroq"/"HEXTROQ" with "Hextorq"/"HEXTORQ", but leave folder names (`projects-frontend`, `projects-backend`), the `package.json` `name` field, and git remotes untouched unless you tell me otherwise.
2. **New section placement (#2)**: after the stats ribbon (my default assumption) vs. wedged directly under the hero text before the stats ribbon.
3. **Item #4 "scroll pagination"**: keeping Prev/Next-style pagination (redesigned per #13) rather than converting to infinite-scroll — say so if you actually want infinite scroll instead.
4. **Item #6 "heat hoseule"**: confirming this reads as a "hot/trending projects carousel" — let me know if you meant something else entirely (the phrase is genuinely ambiguous).
5. **Item #14 button color**: no specific color was given — I'll propose one against the finalized brand palette from #1 rather than guessing now; will show it to you before finalizing.
