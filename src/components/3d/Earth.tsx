"use client";

import { useRef, useEffect, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { SceneManager } from "./SceneManager";
import { CinematicCamera } from "./CinematicCamera";
import { SpaceEnvironment } from "./SpaceEnvironment";
import { FlightPath } from "./FlightPath";
import { CloudSystem } from "./CloudSystem";
import { ParticleSystem } from "./ParticleSystem";

// ─── Custom Outer Atmosphere Fresnel Shader ────────────────────────────────
const AtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color("#38bdf8") },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform vec3 color;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(color, intensity * 0.7);
    }
  `,
};

export const EarthGlobe = memo(function EarthGlobe() {
  const earthRef = useRef<THREE.Mesh>(null!);
  const scrollRotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  // Official High-Availability Three.js Planet Textures
  const [colorMap, normalMap, specularMap] = useTexture([
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
  ]);

  // ─── Connect GSAP ScrollTrigger to Globe Rotation ─────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        targetRotationRef.current = self.progress * Math.PI * 8;
      },
    });

    return () => trigger.kill();
  }, []);

  // ─── Frame Loop: Smooth Lerp & Ambient Slow-Down ───────────────────────────
  useFrame((_, delta) => {
    const isFooter = scrollRotationRef.current >= 0.9;
    const speedMult = isFooter ? 0.25 : 1.0;

    if (earthRef.current) {
      const currentY = earthRef.current.rotation.y;
      const targetY = targetRotationRef.current;
      earthRef.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.05);
      earthRef.current.rotation.y += delta * 0.03 * speedMult;
    }
  });

  return (
    <group scale={[2.2, 2.2, 2.2]}>
      {/* Base Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.05, 0.05)}
          specularMap={specularMap}
          specular={new THREE.Color("#38bdf8")}
          shininess={15}
        />
      </mesh>

      {/* Cloud System Layer */}
      <CloudSystem />

      {/* Outer Atmosphere Glow Sphere */}
      <mesh scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          args={[AtmosphereShader]}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </group>
  );
});

useTexture.preload([
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
]);

export function EarthScene() {
  return (
    <SceneManager>
      <CinematicCamera />
      <SpaceEnvironment />
      <ParticleSystem count={600} />
      <EarthGlobe />
      <FlightPath />
    </SceneManager>
  );
}
