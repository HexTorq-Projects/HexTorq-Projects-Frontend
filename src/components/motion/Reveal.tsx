import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Fade + rise into view once using GSAP ScrollTrigger. No-op under prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;

    const el = ref.current;

    // Set initial values
    gsap.set(el, { opacity: 0, y });

    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        // Replay every time the element scrolls into view (not just once), and
        // reverse when it leaves upward so re-entering re-animates.
        toggleActions: "restart none none reverse",
        invalidateOnRefresh: true,
      },
    });

    // Failsafe: recompute trigger positions on the next frame so an element that
    // is already on-screen at mount can never stay stuck invisible.
    const raf = requestAnimationFrame(() => anim.scrollTrigger?.refresh());

    return () => {
      cancelAnimationFrame(raf);
      anim.kill();
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
    };
  }, [reduced, delay, y]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

