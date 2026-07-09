# Hextroq Frontend Page Review & Overview

This document provides a comprehensive overview and technical review of the Hextroq frontend application. It outlines the architecture, layout systems, state management, pages, and key details about how the fronted interacts with the database backend.

---

## 1. Technical Stack & Dependencies

The Hextroq frontend is a modern, single-page application (SPA) built using **React** and **TypeScript**, bundled with **Vite**.

| Layer | Technology | Purpose / Notes |
| :--- | :--- | :--- |
| **Framework** | React 18 + TypeScript | Component-driven architecture with strict type safety. |
| **Routing** | React Router DOM v6 | Client-side declarative routing and path parameters. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS, optimized via Vite's `@tailwindcss/vite` plugin. |
| **Animations** | GSAP (GreenSock) | Scroll-driven timeline animations, parallax transitions. |
| **Animations** | Framer Motion | Fluid React page transitions and layout transitions. |
| **Smooth Scrolling** | Lenis | Immersive, buttery-smooth scroll experiences. |
| **3D Rendering** | Three.js + R3F | Canvas rendering for interactive elements like the hero scene. |
| **State Management**| Zustand | Lightweight, decentralized state slices (filters, auth, UI modals). |
| **Data Fetching** | TanStack Query (v5) | Server state management, auto-caching, and query synchronization. |
| **Icons** | Lucide React | Lightweight vector icons. |

---

## 2. Directory & Architecture Structure

All frontend source files reside inside the `src/` directory:

*   **`src/api/`** — Interface layer querying the backend REST API. Contains modules for auth, catalog filtering, enquiries submission, and wishlists.
*   **`src/components/`**
    *   `layout/` — Layout definitions: [Navbar.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/layout/Navbar.tsx) and [Footer.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/layout/Footer.tsx).
    *   `modals/` — Global slide-overs / modals: [AuthModal.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/modals/AuthModal.tsx) (Login & Register switcher) and [EnquiryModal.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/modals/EnquiryModal.tsx).
    *   `motion/` — React framer elements: [CountUp.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/motion/CountUp.tsx) (animated stats counting) and [Reveal.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/motion/Reveal.tsx) (fade-in scroll triggers).
    *   `project/` — Domain-specific visual components such as [ProjectCard.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/project/ProjectCard.tsx), [PriceBlock.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/project/PriceBlock.tsx), and [ThreeHero.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/project/ThreeHero.tsx).
    *   `ui/` — Base reusable layout atoms (Buttons, Cards, Inputs, Skeletons, Spinners).
*   **`src/lib/`** — Core utility files: `cn` (clsx class merger), `format` (currency and date helpers), and `constants.ts` (defining colors, tiers, and category mapping metadata).
*   **`src/pages/`** — React page entry points.
*   **`src/providers/`** — React context providers for App settings, authentication tracking, and Lenis scroll controllers.
*   **`src/store/`** — Zustand store slices: `useUiStore` (modals toggle), `useAuthStore` (login token and profiles), and `useFilterStore` (catalog selectors).
*   **`src/styles/`** — Global CSS sheets ([globals.css](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/styles/globals.css)) mapping CSS variables and custom animations.

---

## 3. Core Pages Breakdown & Reviews

### 3.1. Home Page (`Home.tsx`)
*   **Hero Canvas**: Integrates [ThreeHero.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/project/ThreeHero.tsx) which instantiates a WebGL canvas rendering interactive particle constellations and rotating wireframes that track cursor movements.
*   **Dynamic Stats Ribbon**: Displays counting milestones (Ready Projects, Academic Streams, Domains, Spotlight Tiers) bound to ScrollTrigger and the React [CountUp.tsx](file:///d:/confidentails%20projects/hextroq/projects-frontend/src/components/motion/CountUp.tsx) widget.
*   **Interactive Terminal Sandbox**: Contains `TerminalSandbox` which simulates automated project deployments (`git clone` -> `npm install` -> `npx prisma db push` -> `npm run dev`) directly on screen, validating trust and transparency.
*   **Student Testimonials**: Verified client cards demonstrating grade success rates, college sources, ratings, and purchase topics.

### 3.2. Explore Catalog Page (`Explore.tsx`)
*   **Zustand Syncing Store**: Leverages `useFilterStore` allowing search parameters and sidebar filtering options (Budget ranges, Complexity tags, Tiers, Category Streams, Domains) to update state uniformly.
*   **TanStack Query Caching**: Hooks into the `/projects` paginated REST API, utilizing caching for immediate page results while users modify constraints.
*   **Fluid Responsive Layout**: Implements a double-column interface: collapsible filter controllers on mobile, locking sidebar navigation on desktop screens, and a paginated project grid.

### 3.3. Project Detail Page (`ProjectDetail.tsx`)
*   **Layout Breakdown**: Splits the detail space into primary project details (brief description, detailed overview text, modular checklist items, and tech stack tags) and a sticky checkout box.
*   **Lead Capture & Wishlists**: Includes a call-to-action to enquiry directly over WhatsApp (utilizing constants from `constants.ts` to pre-compile message queries) and wishlist liking hooks that require authentication.
*   **Trust Indicators**: Spotlights academic deliverables (Full commented code handoffs, remote installation support, and project flow coaching for viva reviews).

### 3.4. Student Dashboard Page (`Dashboard.tsx`)
*   **Tab System**: Houses tabs for checking the user's Wishlist projects and tracking Enquiry lists.
*   **Lead Tracking**: Allows users to review sent messages, see status tags (e.g., pending, completed), and click to resume chat queries with engineers on WhatsApp.

---

## 4. State Management Details

The app uses **Zustand** stores for transient local client states:

1.  **`useFilterStore`** (Filters state):
    *   Maintains parameters: `search`, `category`, `subCategory`, `applicationArea`, `tier`, `complexity`, `minPrice`, `maxPrice`, and `page`.
    *   Provides setter mutations and a global `reset()` dispatcher.
2.  **`useAuthStore`** (Authentication state):
    *   Tracks the authenticated `user` profile, `token`, and handles logins / logout states securely.
3.  **`useUiStore`** (UI controller):
    *   Controls overlay modals: open/close switches for `authModal` (with login/register context) and `enquiryModal` (tracking target `projectId` and `projectTitle`).

---

## 5. Styling, Theming & Aesthetics

The application follows premium modern styling principles defined inside the Tailwind v4 custom theme layer in `globals.css`:

*   **Light & Dark Theme Support**: Features CSS custom properties mapping. The dark theme is a tech-centric deep navy base (`#06070d`) with vibrant glow features, while the light theme resolves to a warm slate-slate gray base.
*   **Neon Glows & Gradients**:
    *   `.text-gradient` / `.bg-brand`: Custom color transitions mapping Violet (`#8b5cf6`) to Indigo (`#6366f1`) and Cyan (`#22d3ee`).
    *   `.glass`: Frosted visual structures blending surfaces and backdrop blurs (`backdrop-filter`).
    *   `.aurora`: Uses radial gradients rendering colored ambient background glows.
    *   `.grain`: Injects a noise SVG overlay to provide a premium texture.
