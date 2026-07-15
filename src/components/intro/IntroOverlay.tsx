import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "Hextorq".split("");

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.3 },
  },
};

const letter = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  show: { opacity: 1, y: 0, rotateX: 0 },
};

/* ─── Particles ─── */
function BgParticles() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 1.5 + 0.5,
    d: Math.random() * 4 + 2,
    l: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: "rgba(124,58,237,0.15)",
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.d,
            delay: p.l,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Intro ─── */

export function IntroOverlay({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    setPhase("visible");
  }, []);

  useEffect(() => {
    if (phase !== "visible") return;
    const t1 = setTimeout(() => setPhase("exit"), 2800);
    const t2 = setTimeout(() => onFinish(), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase, onFinish]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #0c0e1a 0%, #060810 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BgParticles />

          {/* Top accent line */}
          <motion.div
            className="absolute top-[30%] left-1/2 -translate-x-1/2"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(124,58,237,0.25), transparent)",
            }}
            initial={{ width: 0 }}
            animate={{ width: 160 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Letters */}
          <motion.div
            className="flex items-center justify-center gap-[0.04em] relative"
            variants={container}
            initial="hidden"
            animate="show"
            style={{ perspective: 600 }}
          >
            {LETTERS.map((char, i) => (
              <motion.span
                key={i}
                variants={letter}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
                style={{
                  fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                  fontWeight: 300,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  color: "#ffffff",
                  letterSpacing: "-0.04em",
                }}
              >
                {char}
              </motion.span>
            ))}

            {/* Letter glow */}
            <motion.div
              className="absolute inset-0 -z-10"
              style={{
                filter: "blur(50px)",
                background:
                  "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          </motion.div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute top-[calc(30%+clamp(3.2rem,10vw,6rem)+20px)] left-1/2 -translate-x-1/2"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)",
            }}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Tagline */}
          <motion.p
            className="absolute top-[calc(30%+clamp(3.8rem,12vw,7rem)+32px)] left-1/2 -translate-x-1/2 font-medium text-center"
            style={{
              fontSize: "clamp(0.55rem, 1.1vw, 0.7rem)",
              color: "rgba(255,255,255,0.18)",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Academic Project Marketplace
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useIntroOverlay() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("hq_intro_done");
  });

  const handleFinish = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem("hq_intro_done", "1");
  }, []);

  return { showIntro, handleFinish };
}
