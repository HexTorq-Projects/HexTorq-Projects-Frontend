import { Link } from "react-router-dom";

export function Footer() {
  const socialLinks = [
    {
      name: "X",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "https://x.com",
    },
    {
      name: "Instagram",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      href: "https://instagram.com",
    },
    {
      name: "YouTube",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
      href: "https://youtube.com",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: "https://linkedin.com",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-bg-soft text-muted pt-14 pb-8 transition-colors duration-300">
      {/* Twilight Haze top edge hairline & ambient background glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-twilight" aria-hidden="true" />
      <div className="twilight-orb w-[36rem] h-[36rem] -top-72 -left-32 opacity-40" aria-hidden="true" />
      <div className="twilight-orb w-[28rem] h-[28rem] -bottom-36 -right-24 opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Layout matching website design system */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12 items-start">
          {/* Brand Column */}
          <div className="space-y-5">
            <p className="text-sm font-medium text-fg/90 leading-relaxed max-w-xs">
              HexTorq is the modern and intuitive way to build & showcase final-year engineering projects.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface/80 text-muted transition-all duration-200 hover:text-fg hover:border-violet/50 hover:bg-surface-hi hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div className="border-t border-line/50 pt-3 space-y-3">
            <h3 className="font-bold text-fg text-sm tracking-tight font-display">Product</h3>
            <ul className="space-y-2 text-sm text-muted font-normal">
              <li>
                <Link to="/explore" className="hover:text-cyan transition-colors">
                  Product Updates
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-cyan transition-colors">
                  Project Catalog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan transition-colors">
                  Custom Build Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="border-t border-line/50 pt-3 space-y-3">
            <h3 className="font-bold text-fg text-sm tracking-tight font-display">Resources</h3>
            <ul className="space-y-2 text-sm text-muted font-normal">
              <li>
                <Link to="/about" className="hover:text-cyan transition-colors">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan transition-colors">
                  Product Docs & Pedagogy
                </Link>
              </li>
              <li>
                <Link to="/refer-and-earn" className="hover:text-cyan transition-colors">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="border-t border-line/50 pt-3 space-y-3">
            <h3 className="font-bold text-fg text-sm tracking-tight font-display">Company</h3>
            <ul className="space-y-2 text-sm text-muted font-normal">
              <li>
                <Link to="/about" className="hover:text-cyan transition-colors">
                  About Us
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/contact" className="hover:text-cyan transition-colors">
                  Careers
                </Link>
                <span className="rounded-full bg-violet/10 border border-violet/20 px-2 py-0.5 text-[9px] font-bold text-violet tracking-wider uppercase">
                  WE'RE HIRING
                </span>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Watermark SVG Logo with Cyan/Violet Glow */}
        <div className="my-8 sm:my-12 select-none pointer-events-none text-center relative">
          <svg viewBox="0 0 1200 160" className="w-full h-auto max-h-48 mx-auto">
            <defs>
              {/* Cyan to Violet Gradient for stroke */}
              <linearGradient id="hextorq-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-cyan, #38bdf8)" />
                <stop offset="50%" stopColor="var(--color-violet, #a7b7e7)" />
                <stop offset="100%" stopColor="var(--color-indigo, #4f46e5)" />
              </linearGradient>

              {/* Soft top-to-bottom opacity fade */}
              <linearGradient id="watermark-fade-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
              </linearGradient>
              <mask id="watermark-mask-glow">
                <rect x="0" y="0" width="1200" height="160" fill="url(#watermark-fade-glow)" />
              </mask>

              {/* Subtle Neon Glow Filter */}
              <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Backdrop Outline */}
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fill="none"
              stroke="url(#hextorq-stroke-grad)"
              strokeWidth="3.5"
              fontFamily="'Space Grotesk', 'Orbitron', sans-serif"
              fontWeight="900"
              fontSize="140"
              letterSpacing="24"
              opacity="0.35"
              filter="url(#soft-glow)"
              mask="url(#watermark-mask-glow)"
            >
              HEXTORQ
            </text>

            {/* Sharp Foreground Outline */}
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fill="none"
              stroke="url(#hextorq-stroke-grad)"
              strokeWidth="1.8"
              fontFamily="'Space Grotesk', 'Orbitron', sans-serif"
              fontWeight="900"
              fontSize="140"
              letterSpacing="24"
              opacity="0.75"
              mask="url(#watermark-mask-glow)"
            >
              HEXTORQ
            </text>
          </svg>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="border-t border-line/40 pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <div>
            &copy; {new Date().getFullYear()} HexTorq IT Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-fg transition-colors">
              Security
            </Link>
            <Link to="/contact" className="hover:text-fg transition-colors">
              Terms of service
            </Link>
            <Link to="/contact" className="hover:text-fg transition-colors">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
