"use client";

import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AirplaneProps {
  scale?: number;
  gearExtended?: boolean;
  turbofanSpeedRef?: React.MutableRefObject<number>;
  turbofanSpeed?: number;
}

export const Airplane = memo(function Airplane({
  scale = 0.12,
  gearExtended = true,
  turbofanSpeedRef,
  turbofanSpeed = 15,
}: AirplaneProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const turbofanLeftRef = useRef<THREE.Group>(null!);
  const turbofanRightRef = useRef<THREE.Group>(null!);
  const wheelsRef = useRef<THREE.Group>(null!);
  const gearGroupRef = useRef<THREE.Group>(null!);
  const landingLightsRef = useRef<THREE.Mesh>(null!);

  // Ultra-Realistic PBR Materials
  const fuselageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 0.95, // Highly metallic aluminum
        roughness: 0.1,  // Very smooth, high reflections
        envMapIntensity: 2.5, // Reflect the sunset HDRI strongly
      }),
    []
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f59e0b", // Amber brand accent
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 2,
      }),
    []
  );

  const engineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b", // Dark titanium
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.5,
      }),
    []
  );

  const engineGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#06b6d4",
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#000000",
        metalness: 0.9,
        roughness: 0,
        envMapIntensity: 3, // High gloss reflections on cockpit
        clearcoat: 1,
        clearcoatRoughness: 0,
      }),
    []
  );

  const wheelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );

  // Turbofan & Wheels animation frame loop
  useFrame((_, delta) => {
    const speed = turbofanSpeedRef ? turbofanSpeedRef.current : turbofanSpeed;
    if (turbofanLeftRef.current && turbofanRightRef.current) {
      turbofanLeftRef.current.rotation.z += delta * speed;
      turbofanRightRef.current.rotation.z += delta * speed;
    }
    if (wheelsRef.current) {
      wheelsRef.current.rotation.x += delta * speed * 0.5;
    }
    if (landingLightsRef.current) {
      landingLightsRef.current.visible = speed > 5;
    }
    if (gearGroupRef.current) {
      // Smoothly extend/retract gear
      const targetY = gearExtended ? 0 : 0.2;
      gearGroupRef.current.position.y = THREE.MathUtils.lerp(
        gearGroupRef.current.position.y,
        targetY,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Fuselage - Increased segments to 64 for perfect curves */}
      <mesh material={fuselageMaterial} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.25, 3.2, 64]} />
      </mesh>
      {/* Nose Cone */}
      <mesh material={fuselageMaterial} position={[0, 1.7, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.8, 64]} />
      </mesh>
      {/* Tail Cone */}
      <mesh material={fuselageMaterial} position={[0, -1.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.25, 0.6, 64]} />
      </mesh>

      {/* Brand Stripe */}
      <mesh material={accentMaterial} position={[0, 0.4, 0.01]}>
        <cylinderGeometry args={[0.305, 0.305, 0.5, 64]} />
      </mesh>

      {/* Cockpit Windshield - Smoother curvature */}
      <group position={[0, 1.4, 0.15]} rotation={[0.4, 0, 0]}>
        <mesh material={glassMaterial} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.22, 0.4, 32, 1, false, 0, Math.PI]} />
        </mesh>
      </group>

      {/* Main Wings - Swept aerodynamic profile */}
      <group position={[0, 0.2, 0]}>
        {/* Left Wing */}
        <mesh material={fuselageMaterial} position={[-1.2, 0, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[2.4, 0.04, 0.8]} />
        </mesh>
        {/* Right Wing */}
        <mesh material={fuselageMaterial} position={[1.2, 0, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[2.4, 0.04, 0.8]} />
        </mesh>
      </group>
      
      {/* Winglets */}
      <mesh material={accentMaterial} position={[-2.3, 0.6, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.04, 0.5, 0.4]} />
      </mesh>
      <mesh material={accentMaterial} position={[2.3, 0.6, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.04, 0.5, 0.4]} />
      </mesh>

      {/* Navigation & Landing Headlights */}
      <mesh position={[-2.32, 0.85, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[2.32, 0.85, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      
      <mesh ref={landingLightsRef} position={[0, 1.75, -0.1]} visible={!turbofanSpeedRef ? turbofanSpeed > 5 : false}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Jet Engines & Turbofans - Realistic proportions */}
      <group position={[-1.0, 0, -0.1]}>
        <mesh material={engineMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.8, 32]} />
        </mesh>
        <mesh material={engineGlowMaterial} position={[0, 0.41, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
        </mesh>
        <group ref={turbofanLeftRef} position={[0, 0.4, 0]}>
          {Array.from({ length: 12 }).map((_, i) => (
             <mesh key={i} material={engineMaterial} rotation={[0, (Math.PI * 2 / 12) * i, 0]}>
               <boxGeometry args={[0.38, 0.02, 0.02]} />
             </mesh>
          ))}
        </group>
      </group>

      <group position={[1.0, 0, -0.1]}>
        <mesh material={engineMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.8, 32]} />
        </mesh>
        <mesh material={engineGlowMaterial} position={[0, 0.41, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
        </mesh>
        <group ref={turbofanRightRef} position={[0, 0.4, 0]}>
          {Array.from({ length: 12 }).map((_, i) => (
             <mesh key={i} material={engineMaterial} rotation={[0, (Math.PI * 2 / 12) * i, 0]}>
               <boxGeometry args={[0.38, 0.02, 0.02]} />
             </mesh>
          ))}
        </group>
      </group>

      {/* Retractable Landing Gear & Spin Wheels */}
      <group ref={gearGroupRef} position={[0, -0.25, 0]}>
        {/* Nose gear strut */}
        <mesh material={engineMaterial} position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
        </mesh>
        {/* Main gear struts */}
        <mesh material={engineMaterial} position={[-0.5, 0, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        </mesh>
        <mesh material={engineMaterial} position={[0.5, 0, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        </mesh>

        <group ref={wheelsRef}>
          {/* Nose wheels */}
          <mesh material={wheelMaterial} position={[-0.05, -0.15, 0.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 24]} />
          </mesh>
          <mesh material={wheelMaterial} position={[0.05, -0.15, 0.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 24]} />
          </mesh>
          {/* Left main wheels */}
          <mesh material={wheelMaterial} position={[-0.55, -0.15, -0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 24]} />
          </mesh>
          <mesh material={wheelMaterial} position={[-0.45, -0.15, -0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 24]} />
          </mesh>
          {/* Right main wheels */}
          <mesh material={wheelMaterial} position={[0.55, -0.15, -0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 24]} />
          </mesh>
          <mesh material={wheelMaterial} position={[0.45, -0.15, -0.3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 24]} />
          </mesh>
        </group>
      </group>

      {/* Tail Fin */}
      <mesh material={accentMaterial} position={[0, -1.6, 0.5]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 1.2, 0.6]} />
      </mesh>
      {/* Horizontal Stabilizers */}
      <mesh material={fuselageMaterial} position={[0, -1.7, 0.1]} castShadow>
        <boxGeometry args={[1.8, 0.04, 0.4]} />
      </mesh>
    </group>
  );
});
