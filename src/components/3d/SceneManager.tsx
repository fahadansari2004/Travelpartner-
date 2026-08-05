"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { PerformanceMonitor, PerspectiveCamera } from "@react-three/drei";
import type * as THREE from "three";

interface SceneManagerProps {
  children: ReactNode;
  onPerformanceChange?: (dpr: number) => void;
  autoRotateLight?: boolean;
}

export function SceneManager({
  children,
  onPerformanceChange,
  autoRotateLight = false,
}: SceneManagerProps) {
  const [fov, setFov] = useState(45);
  const sunLightRef = useRef<THREE.DirectionalLight>(null!);

  // ─── Declarative Responsive Camera FOV State ─────────────────────────────────
  useEffect(() => {
    const updateFov = () => {
      const aspect = window.innerWidth / window.innerHeight;
      setFov(aspect < 1 ? 55 : 45);
    };

    updateFov();
    window.addEventListener("resize", updateFov, { passive: true });
    return () => window.removeEventListener("resize", updateFov);
  }, []);

  // ─── Dynamic Sunlight Animation ──────────────────────────────────────────────
  useFrame(() => {
    if (autoRotateLight && sunLightRef.current) {
      const time = Date.now() * 0.0005;
      sunLightRef.current.position.x = Math.cos(time) * 8;
      sunLightRef.current.position.z = Math.sin(time) * 8;
    }
  });

  return (
    <>
      {/* Declarative Camera with dynamic FOV state */}
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={fov} />

      {/* Dynamic DPR Performance Scaling */}
      <PerformanceMonitor
        onChange={({ factor }) => {
          const dpr = Math.max(1, Math.min(2, factor * 2));
          onPerformanceChange?.(dpr);
        }}
      />

      {/* Sun Directional Light */}
      <directionalLight
        ref={sunLightRef}
        position={[5, 3, 5]}
        intensity={2.8}
        color="#fffbeb"
        castShadow={false}
      />

      {/* Ambient, Hemisphere & Rim Fill Lighting */}
      <ambientLight intensity={0.35} color="#cbd5e1" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#38bdf8" />
      <hemisphereLight args={["#38bdf8", "#020617", 0.4]} />

      {children}
    </>
  );
}
