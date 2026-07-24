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
    <footer className="relative overflow-hidden bg-black text-white pt-14 pb-8 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Layout (Identical to Howitzer design) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12 items-start">
          {/* Brand Column */}
          <div className="space-y-5">
            <p className="text-sm font-normal text-zinc-300 leading-relaxed max-w-xs">
              HexTorq is the modern and intuitive way to model & protect your business.
            </p>
            {/* Social Icons inside rounded square boxes */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800/90 bg-zinc-950/80 text-zinc-400 transition-all duration-200 hover:text-white hover:border-zinc-700 hover:bg-zinc-900"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div className="border-t border-zinc-800/80 pt-3 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-tight">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-400 font-normal">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  Product Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="border-t border-zinc-800/80 pt-3 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-tight">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-400 font-normal">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Customer stories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Product docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="border-t border-zinc-800/80 pt-3 space-y-3">
            <h3 className="font-bold text-white text-sm tracking-tight">Company</h3>
            <ul className="space-y-2 text-sm text-zinc-400 font-normal">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/contact" className="hover:text-white transition-colors">
                  Careers
                </Link>
                <span className="rounded-full bg-zinc-800/80 border border-zinc-700/70 px-2 py-0.5 text-[9px] font-semibold text-zinc-300 uppercase tracking-wider">
                  WE'RE HIRING
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Identical Outlined SVG Watermark Logo */}
        <div className="my-8 sm:my-12 select-none pointer-events-none text-center">
          <svg viewBox="0 0 1200 160" className="w-full h-auto max-h-48 mx-auto">
            <defs>
              <linearGradient id="watermark-fade-exact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
              </linearGradient>
              <mask id="watermark-mask-exact">
                <rect x="0" y="0" width="1200" height="160" fill="url(#watermark-fade-exact)" />
              </mask>
            </defs>
            <text
              x="50%"
              y="78%"
              textAnchor="middle"
              fill="none"
              stroke="rgba(255, 255, 255, 0.32)"
              strokeWidth="1.6"
              fontFamily="'Space Grotesk', 'Inter', sans-serif"
              fontWeight="900"
              fontSize="140"
              letterSpacing="24"
              mask="url(#watermark-mask-exact)"
            >
              HEXTORQ
            </text>
          </svg>
        </div>

        {/* Bottom Copyright & Legal Links (Exact Howitzer alignment) */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-normal">
          <div>
            &copy; {new Date().getFullYear()} HexTorq / Reject all substitutes
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Terms of service
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
