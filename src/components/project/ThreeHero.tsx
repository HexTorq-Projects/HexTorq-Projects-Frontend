import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

function FloatingDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 250;
  const initialData = useRef<{ x: number; y: number; z: number; speed: number }[]>([]);
  const positions = new Float32Array(count * 3);

  useEffect(() => {
    initialData.current = Array.from({ length: count }, () => {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      return { x, y, z, speed: 0.003 + Math.random() * 0.005 };
    });
  }, []);

  useFrame((state) => {
    if (!ref.current || initialData.current.length === 0) return;
    const array = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const data = initialData.current[i];
      data.y += data.speed;
      const sway = Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.002;
      data.x += sway;

      if (data.y > 4) data.y = -4;
      if (data.x > 5) data.x = -5;
      if (data.x < -5) data.x = 5;

      array[i * 3] = data.x;
      array[i * 3 + 1] = data.y;
      array[i * 3 + 2] = data.z;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.008;

    // Dynamically interpolate colors based on theme
    const isDark = document.documentElement.classList.contains("dark");
    const targetColor = isDark ? new THREE.Color("#a7b7e7") : new THREE.Color("#8fa4df");
    const targetOpacity = isDark ? 0.55 : 0.45;
    
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.color.lerp(targetColor, 0.08);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.065}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

function HolographicCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const isDark = document.documentElement.classList.contains("dark");
    
    // Outer cyan shell rotating counter-clockwise
    if (outerRef.current) {
      outerRef.current.rotation.y = elapsed * 0.05;
      outerRef.current.rotation.x = -elapsed * 0.02;

      // Smoothly blend color and opacity between themes
      const targetColor = isDark ? new THREE.Color("#d8e2ff") : new THREE.Color("#8fa4df");
      const targetOpacity = isDark ? 0.12 : 0.07;
      
      const mat = outerRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(targetColor, 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
    }
    
    // Inner violet shell rotating clockwise
    if (innerRef.current) {
      innerRef.current.rotation.y = -elapsed * 0.08;
      innerRef.current.rotation.z = elapsed * 0.04;
      
      const scale = 1.0 + Math.sin(elapsed * 1.5) * 0.05;
      innerRef.current.scale.set(scale, scale, scale);

      // Smoothly blend color and opacity between themes
      const targetColor = isDark ? new THREE.Color("#a7b7e7") : new THREE.Color("#8fa4df");
      const targetOpacity = isDark ? 0.25 : 0.14;
      
      const mat = innerRef.current.material as THREE.MeshBasicMaterial;
      mat.color.lerp(targetColor, 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
    }
  });

  return (
    <group>
      {/* Outer Shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
      
      {/* Inner Shell */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Center glowing focal point */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const targetX = state.mouse.y * 0.22;
    const targetY = state.mouse.x * 0.22;
    
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.06);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.06);
    
    const scrollY = window.scrollY;
    ref.current.position.y = -scrollY * 0.0012;
  });

  return <group ref={ref}>{children}</group>;
}

export function ThreeHero() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-soft to-bg pointer-events-none animate-pulse opacity-30" />
    );
  }

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none opacity-45 md:opacity-60">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[1, 3, 2]} intensity={0.3} color="#d8e2ff" />
        <InteractiveGroup>
          <FloatingDust />
          <HolographicCore />
        </InteractiveGroup>
      </Canvas>
    </div>
  );
}
export default ThreeHero;
