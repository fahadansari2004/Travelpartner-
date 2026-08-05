"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

export function CinematicCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const targetPosRef = useRef(new THREE.Vector3(0, 1.2, 6.5));
  const lookTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const isMobileRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        const zMod = isMobileRef.current ? 1.4 : 0;

        // Waypoint camera positions following the airplane journey
        if (p < 0.15) {
          // Takeoff Phase: Camera follows right behind airplane on runway
          targetPosRef.current.set(0, 1.8, 5.8 + zMod);
          lookTargetRef.current.set(0, 1.4, 2.4);
        } else if (p < 0.45) {
          // European & Asian Continent Intercepts: Orbiting Camera
          const t = (p - 0.15) / 0.3;
          targetPosRef.current.set(
            THREE.MathUtils.lerp(0, 2.5, t),
            THREE.MathUtils.lerp(1.8, 0.6, t),
            THREE.MathUtils.lerp(5.8 + zMod, 4.2 + zMod, t)
          );
          lookTargetRef.current.set(0, 0, 0);
        } else if (p < 0.75) {
          // Americas & Pacific High-Altitude Overlook
          const t = (p - 0.45) / 0.3;
          targetPosRef.current.set(
            THREE.MathUtils.lerp(2.5, -2.2, t),
            THREE.MathUtils.lerp(0.6, 1.4, t),
            THREE.MathUtils.lerp(4.2 + zMod, 5.5 + zMod, t)
          );
          lookTargetRef.current.set(0, 0, 0);
        } else {
          // Final Landing Approach & Terminal Taxiing
          const t = (p - 0.75) / 0.25;
          targetPosRef.current.set(
            THREE.MathUtils.lerp(-2.2, 0, t),
            THREE.MathUtils.lerp(1.4, 1.8, t),
            THREE.MathUtils.lerp(5.5 + zMod, 6.5 + zMod, t)
          );
          lookTargetRef.current.set(0, 1.2, 2.2);
        }
      },
    });

    return () => {
      window.removeEventListener("resize", checkMobile);
      trigger.kill();
    };
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.lerp(targetPosRef.current, 0.05);
      cameraRef.current.lookAt(lookTargetRef.current);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1.2, 6.5]}
      fov={45}
    />
  );
}

export const CameraController = CinematicCamera;
