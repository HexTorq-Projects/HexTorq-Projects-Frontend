import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─── 3D Scene ─── */

function Text3DScene({ onReady }: { onReady: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const timer = setTimeout(onReady, 2800);
    return () => clearTimeout(timer);
  }, [onReady]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <Text
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjtSkOMqrGjq0sH6mNLQ.woff"
        fontSize={1.8}
        letterSpacing={-0.03}
        position={[0, 0, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Hextorq
        <meshStandardMaterial
          color="#ffffff"
          emissive="#7c3aed"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.2}
        />
      </Text>

      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <directionalLight position={[-3, 1, -2]} intensity={0.3} color="#7c3aed" />
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const dist = 5.5;
    camera.position.x = Math.sin(t * 0.08) * dist * 0.15;
    camera.position.y = 0.3 + Math.sin(t * 0.12) * 0.1;
    camera.position.z = dist;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Particles() {
  const count = 200;
  const positions = useRef(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 30;
    return pos;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#7c3aed"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Overlay ─── */

export function IntroOverlay({ onFinish }: { onFinish: () => void }) {
  const [sceneReady, setSceneReady] = useState(false);
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 100);
    return () => clearTimeout(t1);
  }, []);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    const t2 = setTimeout(() => setPhase("exit"), 800);
    const t3 = setTimeout(() => onFinish(), 1500);
    return () => {
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
          {/* 3D Canvas */}
          <div className="absolute inset-0" style={{ background: "#05050a" }}>
            <Canvas
              camera={{ position: [0, 0.3, 5.5], fov: 45 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={["#05050a"]} />
              <Text3DScene onReady={handleSceneReady} />
              <CameraController />
              <Particles />
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.1}
                  luminanceSmoothing={0.9}
                  intensity={0.3}
                />
              </EffectComposer>
            </Canvas>
          </div>

          {/* Overlay UI */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Subtitle */}
            <motion.p
              className="relative z-10 font-medium tracking-[0.3em] uppercase"
              style={{
                marginTop: "clamp(170px, 22vh, 280px)",
                fontSize: "clamp(0.6rem, 1.3vw, 0.75rem)",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                letterSpacing: "0.5em",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: sceneReady ? 0.8 : 0, y: sceneReady ? 0 : 12 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Academic Project Marketplace
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="flex gap-1.5 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: sceneReady ? 0 : 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: "rgba(124,58,237,0.4)",
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
