import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useFlyingCartStore, FlyingParticle } from "@/store/useFlyingCartStore";
import { useEffect, useState } from "react";

function FlyingBadge({ particle }: { particle: FlyingParticle }) {
  const removeParticle = useFlyingCartStore((s) => s.removeParticle);
  const bumpCart = useFlyingCartStore((s) => s.bumpCart);
  const [targetPos, setTargetPos] = useState({ x: window.innerWidth - 60, y: 28 });

  useEffect(() => {
    // Locate the navbar cart button element
    const navbarTarget =
      document.getElementById("navbar-cart-icon") ||
      document.getElementById("navbar-cart-icon-mobile");

    if (navbarTarget) {
      const rect = navbarTarget.getBoundingClientRect();
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  const deltaX = targetPos.x - particle.startX;
  const deltaY = targetPos.y - particle.startY;

  // Arc control offset (higher apex arc for a graceful flight curve)
  const midY = Math.min(-140, deltaY - 100);

  const accentColor = particle.color || "#38bdf8";

  return (
    <motion.div
      initial={{
        x: 0,
        y: 0,
        scale: 0.1,
        opacity: 0,
        rotate: -20,
      }}
      animate={{
        x: [0, deltaX * 0.2, deltaX * 0.55, deltaX * 0.88, deltaX],
        y: [0, midY, midY * 0.85, deltaY * 0.5, deltaY],
        scale: [0.2, 1.45, 1.2, 0.9, 0.15],
        opacity: [0, 1, 1, 0.95, 0],
        rotate: [0, -18, 12, -6, 360],
      }}
      transition={{
        duration: 1.3, // Slower, smooth 1.3-second flight duration
        ease: [0.16, 1, 0.3, 1], // Smooth decelerating cubic-bezier curve
        times: [0, 0.22, 0.55, 0.88, 1],
      }}
      onAnimationComplete={() => {
        bumpCart();
        removeParticle(particle.id);
      }}
      style={{
        position: "fixed",
        left: particle.startX,
        top: particle.startY,
        pointerEvents: "none",
        zIndex: 9999,
        transformOrigin: "center center",
      }}
      className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md border border-white/40 ring-2 ring-white/20"
    >
      <div
        className="relative flex items-center justify-center rounded-full p-1.5 text-black shadow-lg transition-transform"
        style={{ backgroundColor: accentColor }}
      >
        <ShoppingCart className="h-4 w-4 stroke-[3]" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-spin" />
      </div>

      {particle.title && (
        <span className="max-w-[140px] truncate text-xs font-bold tracking-tight drop-shadow-md">
          {particle.title}
        </span>
      )}

      {/* Glowing ring trail */}
      <span
        className="absolute -inset-1.5 rounded-full opacity-70 blur-md pointer-events-none animate-pulse"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
}

export function FlyingCartOverlay() {
  const particles = useFlyingCartStore((s) => s.particles);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <FlyingBadge key={p.id} particle={p} />
        ))}
      </AnimatePresence>
    </div>
  );
}
