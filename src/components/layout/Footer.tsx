import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, ArrowUp } from "lucide-react";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { HoverRoll } from "@/components/motion/HoverRoll";

export function Footer() {
  const streams = [
    "AI/ML & Data Science",
    "Web Applications & Portals",
    "IoT, Embedded & Robotics",
    "Cybersecurity & Cloud Security",
    "Blockchain & Decentralized Systems",
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-bg-soft py-12 text-muted">
      {/* Twilight Haze accent edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-twilight" aria-hidden="true" />
      <div className="twilight-orb w-[26rem] h-[26rem] -top-56 -left-20" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <Reveal delay={0}>
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
                <div className="relative flex items-center justify-center">
                  <svg className="h-5 w-5 text-violet group-hover:rotate-60 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" className="text-cyan" />
                  </svg>
                </div>
                <span className="font-display text-xl tracking-tight flex items-center">
                  <span className="font-black text-fg tracking-tighter">HEX</span>
                  <span className="font-light text-gradient tracking-tight">TORQ</span>
                </span>
              </Link>
              <p className="text-sm text-faint">
                An elite IT & engineering agency. We build and showcase fully functional final-year projects
                for academic excellence and industrial readiness.
              </p>
            </div>
          </Reveal>

          {/* Popular Streams */}
          <Reveal delay={0.05}>
            <div>
              <h3 className="font-display font-semibold text-fg mb-4">Top Streams</h3>
              <ul className="space-y-2 text-sm">
                {streams.map((stream) => (
                  <li key={stream}>
                    <Link
                      to={`/explore?category=${encodeURIComponent(stream)}`}
                      className="group inline-flex items-center hover:text-cyan transition-colors"
                    >
                      <HoverRoll duration={320}>
                        {stream.replace(" & Portals", "").replace(" & Data Science", "")}
                      </HoverRoll>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Company Links */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="font-display font-semibold text-fg mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/explore" className="group inline-flex items-center hover:text-cyan transition-colors">
                    <HoverRoll duration={320}>Project Catalog</HoverRoll>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="group inline-flex items-center hover:text-cyan transition-colors">
                    <HoverRoll duration={320}>About Hextorq</HoverRoll>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="group inline-flex items-center hover:text-cyan transition-colors">
                    <HoverRoll duration={320}>Contact Us</HoverRoll>
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Contact Details */}
          <Reveal delay={0.15}>
            <div className="space-y-3 text-sm">
              <h3 className="font-display font-semibold text-fg mb-4">Reach Us</h3>
              <div className="flex items-center gap-2.5 transition-transform duration-200 hover:translate-x-1">
                <Mail className="h-4 w-4 text-violet shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-fg transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5 transition-transform duration-200 hover:translate-x-1">
                <Phone className="h-4 w-4 text-cyan shrink-0" />
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-fg transition-colors">
                  +{WHATSAPP_NUMBER}
                </a>
              </div>
              <a
                href="https://maps.app.goo.gl/x2PFXegDg3Mv9A1h7"
                target="_blank"
                className="flex items-start gap-2.5 group"
              >
                <MapPin className="h-4 w-4 text-faint mt-0.5 shrink-0" />
                <span className="text-faint group-hover:text-fg transition-colors">
                  2, Second Floor, Vinayakar Kovil St,
                  <br />
                  Thirumalapalayam, Coimbatore - 641105
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Hextorq, I want to talk about my final year project.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 transition-all duration-200 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 border-t border-line/20 pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-faint">
          <span>&copy; {new Date().getFullYear()} Hextorq IT Solutions. All rights reserved.</span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:text-fg hover:border-violet/40 hover:-translate-y-0.5"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
