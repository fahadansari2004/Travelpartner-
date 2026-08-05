"use client";

import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ─── Pure Deterministic Pseudo-Random Generator ──────────────────────────────
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const SpaceEnvironment = memo(function SpaceEnvironment() {
  const particlesRef = useRef<THREE.Points>(null!);
  const nebulaRef = useRef<THREE.Mesh>(null!);

  // ─── Generate 300 Floating Cosmic Dust Particles ────────────────────────────
  const [particlePositions, particleColors] = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const amber = new THREE.Color("#f59e0b");
    const cyan = new THREE.Color("#38bdf8");
    const purple = new THREE.Color("#c084fc");

    for (let i = 0; i < count; i++) {
      const rSeed = pseudoRandom(i * 1.1);
      const thetaSeed = pseudoRandom(i * 2.3);
      const phiSeed = pseudoRandom(i * 3.7);
      const colorSeed = pseudoRandom(i * 4.9);

      const radius = 12 + rSeed * 35;
      const theta = thetaSeed * Math.PI * 2;
      const phi = Math.acos(phiSeed * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorSeed < 0.5 ? amber : colorSeed < 0.8 ? cyan : purple;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    return [positions, colors];
  }, []);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
      particlesRef.current.rotation.x += delta * 0.01;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <group>
      {/* Deep Background Stars */}
      <Stars
        radius={280}
        depth={80}
        count={3000}
        factor={6}
        saturation={0}
        fade
        speed={1.5}
      />

      {/* Floating Cosmic Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Soft Ambient Distant Nebula Plane */}
      <mesh ref={nebulaRef} position={[0, 0, -25]} scale={[50, 50, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0.12}
          color="#38bdf8"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});
