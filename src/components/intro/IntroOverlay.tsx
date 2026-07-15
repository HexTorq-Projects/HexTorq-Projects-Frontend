import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "Hextorq".split("");

const letterVariants = {
  hidden: (_i: number) => ({
    opacity: 0,
    rotateX: -90,
    rotateY: 30,
    y: 60,
    filter: "blur(10px)",
  }),
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.6 + i * 0.08,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GlowRing() {
  return (
    <motion.div
      className="absolute"
      style={{
        width: 400,
        height: 400,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(109,91,208,0.12) 0%, rgba(14,122,160,0.06) 40%, transparent 70%)",
        filter: "blur(40px)",
      }}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 360],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function IntroOverlay({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => onFinish(), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, #0f142a 0%, #070b17 60%, #040812 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlowRing />

          <Particles />

          {/* Accent lines */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(109,91,208,0.3), rgba(14,122,160,0.3), transparent)",
              width: 0,
            }}
            animate={{ width: [0, 300, 0] }}
            transition={{
              duration: 2,
              delay: 0.3,
              ease: "easeInOut",
            }}
          />

          {/* Brand text */}
          <div
            className="relative z-10"
            style={{ perspective: "800px" }}
          >
            <div
              className="flex items-center justify-center gap-[0.15em]"
              style={{ perspective: "800px" }}
            >
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                  style={{
                    fontSize: "clamp(3rem, 10vw, 6rem)",
                    fontWeight: 800,
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    background:
                      "linear-gradient(135deg, #a78bfa 0%, #6d5bd0 30%, #4f46e5 60%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transformStyle: "preserve-3d",
                    textShadow: "none",
                    filter: "drop-shadow(0 0 30px rgba(109,91,208,0.3))",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            {/* Glow beneath text */}
            <motion.div
              className="absolute inset-0 -z-10"
              style={{
                filter: "blur(60px)",
                background:
                  "radial-gradient(ellipse, rgba(109,91,208,0.2) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="relative z-10 mt-4 font-medium tracking-[0.3em] uppercase"
            style={{
              fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              letterSpacing: "0.4em",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            Academic Project Marketplace
          </motion.p>

          {/* Bottom accent bar */}
          <motion.div
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 2,
              borderRadius: 1,
              background:
                "linear-gradient(90deg, rgba(109,91,208,0.4), rgba(14,122,160,0.4))",
            }}
            animate={{ width: [0, 120, 0] }}
            transition={{
              duration: 2.5,
              delay: 0.8,
              ease: "easeInOut",
            }}
          />

          {/* Loading indicator */}
          <motion.div
            className="absolute bottom-[15%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: "rgba(109,91,208,0.5)",
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useIntroOverlay() {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show intro on first visit per session
    return !sessionStorage.getItem("hq_intro_done");
  });

  const handleFinish = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem("hq_intro_done", "1");
  }, []);

  return { showIntro, handleFinish };
}
