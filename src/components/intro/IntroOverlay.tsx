import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KineticText } from "kinetic-text-3d";

export function IntroOverlay({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => onFinish(), 3900);
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
          className="fixed inset-0 z-[9999]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 3D Canvas fills the entire screen */}
          <div className="absolute inset-0">
            <KineticText
              text="Hextorq"
              color="#ffffff"
              glowColor="#7c3aed"
              backgroundColor="#05050a"
              glowIntensity={0.8}
              fontSize={2.2}
              width="100%"
              height="100%"
            />
          </div>

          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Subtitle */}
            <motion.p
              className="relative z-10 font-medium tracking-[0.3em] uppercase"
              style={{
                marginTop: "clamp(200px, 25vh, 320px)",
                fontSize: "clamp(0.65rem, 1.4vw, 0.8rem)",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                letterSpacing: "0.4em",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Academic Project Marketplace
            </motion.p>

            {/* Loading dots */}
            <motion.div
              className="flex gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: "rgba(124,58,237,0.5)",
                  }}
                  animate={{
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>
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
