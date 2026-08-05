"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function CloudSystem({ speedMult = 1.0 }: { speedMult?: number }) {
  const cloudsRef = useRef<THREE.Mesh>(null!);

  const cloudsMap = useTexture(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png"
  );

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04 * speedMult;
    }
  });

  return (
    <mesh ref={cloudsRef} scale={[2.24, 2.24, 2.24]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={cloudsMap}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
