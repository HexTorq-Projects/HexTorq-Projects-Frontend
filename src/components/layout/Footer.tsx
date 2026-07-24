import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socialLinks = [
    {
      name: "X",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "https://x.com",
    },
    {
      name: "Instagram",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
      href: "https://youtube.com",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: "https://linkedin.com",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-bg-soft pt-14 pb-8 text-muted">
      {/* Twilight Haze accent edge & ambient orb */}
      <div className="absolute inset-x-0 top-0 h-px bg-twilight" aria-hidden="true" />
      <div className="twilight-orb w-[32rem] h-[32rem] -top-64 -left-28 opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Layout matching Howitzer style */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <Reveal delay={0}>
            <div className="space-y-6">
              <p className="text-sm text-fg/90 font-medium leading-relaxed max-w-xs">
                HexTorq is the modern and intuitive way to build & showcase final-year engineering projects.
              </p>
              {/* Social Icon Row */}
              <div className="flex items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface/50 text-muted transition-all duration-200 hover:text-fg hover:border-violet/50 hover:bg-surface hover:-translate-y-0.5"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Product Column */}
          <Reveal delay={0.05}>
            <div className="border-t border-line/50 pt-4 space-y-3">
              <h3 className="font-display text-sm font-bold text-fg tracking-tight">Product</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>
                  <Link to="/explore" className="hover:text-fg transition-colors">
                    Project Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/explore?sort=newest" className="hover:text-fg transition-colors">
                    Product Updates
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-fg transition-colors">
                    Custom Build Request
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Resources Column */}
          <Reveal delay={0.1}>
            <div className="border-t border-line/50 pt-4 space-y-3">
              <h3 className="font-display text-sm font-bold text-fg tracking-tight">Resources</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>
                  <Link to="/about" className="hover:text-fg transition-colors">
                    Customer Stories
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-fg transition-colors">
                    Pedagogy & Docs
                  </Link>
                </li>
                <li>
                  <Link to="/refer-and-earn" className="hover:text-fg transition-colors">
                    Referral Program
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Company Column */}
          <Reveal delay={0.15}>
            <div className="border-t border-line/50 pt-4 space-y-3">
              <h3 className="font-display text-sm font-bold text-fg tracking-tight">Company</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                <li>
                  <Link to="/about" className="hover:text-fg transition-colors">
                    About
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link to="/contact" className="hover:text-fg transition-colors">
                    Careers
                  </Link>
                  <span className="rounded-full bg-violet/10 border border-violet/20 px-2 py-0.5 text-[9px] font-bold text-violet tracking-wider uppercase">
                    WE'RE HIRING
                  </span>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-fg transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Giant Outlined Watermark Text Logo */}
        <div className="relative mt-12 mb-6 sm:mt-16 sm:mb-8 overflow-hidden select-none pointer-events-none text-center flex justify-center">
          <span className="font-tech text-[13vw] sm:text-[14vw] md:text-[15vw] leading-none font-black tracking-[0.16em] uppercase text-transparent [-webkit-text-stroke:1.5px_rgba(148,163,184,0.18)] dark:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)] [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]">
            HEXTORQ
          </span>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="border-t border-line/40 pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <div>
            &copy; {new Date().getFullYear()} HexTorq / Reject all substitutes
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
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition-all duration-200 hover:text-fg hover:border-violet/40"
            >
              Top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
