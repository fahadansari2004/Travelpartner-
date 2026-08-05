"use client";

import { useMemo, useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999 + 1) * 10000;
  return x - Math.floor(x);
}

export const ParticleSystem = memo(function ParticleSystem({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 3);
      const r2 = pseudoRandom(i * 3 + 1);
      const r3 = pseudoRandom(i * 3 + 2);

      const radius = 4 + r1 * 25;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color(
        i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#38bdf8" : "#8b5cf6"
      );
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});
