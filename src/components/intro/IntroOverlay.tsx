import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/* ─── 3D Scene ─── */

function TextScene({ onReady }: { onReady: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const timer = setTimeout(onReady, 2800);
    return () => clearTimeout(timer);
  }, [onReady]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.06;
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Glow backdrop */}
      <mesh ref={glowRef} position={[0, 0, -0.3]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Wider outer glow */}
      <mesh position={[0, 0, -0.4]}>
        <circleGeometry args={[3.5, 32]} />
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.04}
        />
      </mesh>

      {/* Main 3D text */}
      <Text
        fontSize={2}
        letterSpacing={-0.02}
        position={[0, 0, 0]}
        anchorX="center"
        anchorY="middle"
      >
        Hextorq
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#7c3aed"
          emissiveIntensity={0.25}
          metalness={0.4}
          roughness={0.15}
          clearcoat={0.1}
        />
      </Text>

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#7c3aed" />
      <pointLight position={[0, 0, 2]} intensity={0.3} color="#a78bfa" />
    </group>
  );
}

function CameraControl() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.06) * 0.4;
    camera.position.y = 0.2 + Math.sin(t * 0.1) * 0.08;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function StarField() {
  const count = 300;
  const positions = useRef(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 40;
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
        size={0.04}
        color="#7c3aed"
        transparent
        opacity={0.3}
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
    setPhase("visible");
  }, []);

  const handleReady = useCallback(() => {
    setSceneReady(true);
    setTimeout(() => setPhase("exit"), 600);
    setTimeout(() => onFinish(), 1300);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0" style={{ background: "#05050a" }}>
            <Canvas
              camera={{ position: [0, 0.2, 5], fov: 40 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={["#05050a"]} />
              <TextScene onReady={handleReady} />
              <CameraControl />
              <StarField />
            </Canvas>
          </div>

          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <motion.p
              className="relative z-10 font-medium uppercase tracking-[0.5em]"
              style={{
                marginTop: "clamp(160px, 21vh, 260px)",
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                color: "rgba(255,255,255,0.2)",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: sceneReady ? 0.6 : 0, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Academic Project Marketplace
            </motion.p>
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
