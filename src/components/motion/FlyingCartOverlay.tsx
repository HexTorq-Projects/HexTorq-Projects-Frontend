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

  // Arc control offset
  const midX = deltaX * 0.45;
  const midY = Math.min(0, deltaY) - 130;

  const accentColor = particle.color || "#38bdf8";

  return (
    <motion.div
      initial={{
        x: 0,
        y: 0,
        scale: 0.3,
        opacity: 0,
        rotate: -15,
      }}
      animate={{
        x: [0, midX, deltaX],
        y: [0, midY, deltaY],
        scale: [0.4, 1.35, 1.1, 0.2],
        opacity: [0, 1, 1, 0],
        rotate: [0, -12, 12, 360],
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
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
      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md border border-white/30"
    >
      <div
        className="relative flex items-center justify-center rounded-full p-1 text-black shadow-lg"
        style={{ backgroundColor: accentColor }}
      >
        <ShoppingCart className="h-3.5 w-3.5 stroke-[3]" />
        <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-yellow-300 animate-spin" />
      </div>

      {particle.title && (
        <span className="max-w-[130px] truncate text-[11px] tracking-tight drop-shadow-md">
          {particle.title}
        </span>
      )}

      {/* Glowing ring trail */}
      <span
        className="absolute -inset-1 rounded-full opacity-60 blur-md pointer-events-none"
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
