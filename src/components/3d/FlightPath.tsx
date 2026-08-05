"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { Airplane } from "./Airplane";

// Destination Waypoints mapped across story chapters
const WAYPOINT_VECTORS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.4, 2.4),       // Hero Runway / Europe
  new THREE.Vector3(2.0, 1.1, 1.6),     // Dubai Hub
  new THREE.Vector3(2.4, -0.7, -1.0),   // Bali / SE Asia
  new THREE.Vector3(1.4, 1.8, -2.1),    // Tokyo / East Asia
  new THREE.Vector3(-1.8, 1.5, -1.9),   // Hawaii / Pacific
  new THREE.Vector3(-2.4, 1.0, 1.0),    // South America / Andes
  new THREE.Vector3(-1.4, -1.5, 2.1),   // Africa / Serengeti
  new THREE.Vector3(0, 1.4, 2.22),      // Arrival Terminal Runway (Touchdown)
];

const DESTINATION_ARCS = [
  { from: WAYPOINT_VECTORS[0], to: WAYPOINT_VECTORS[1] },
  { from: WAYPOINT_VECTORS[1], to: WAYPOINT_VECTORS[2] },
  { from: WAYPOINT_VECTORS[2], to: WAYPOINT_VECTORS[3] },
  { from: WAYPOINT_VECTORS[3], to: WAYPOINT_VECTORS[4] },
  { from: WAYPOINT_VECTORS[4], to: WAYPOINT_VECTORS[5] },
  { from: WAYPOINT_VECTORS[5], to: WAYPOINT_VECTORS[6] },
];

export function FlightPath() {
  const airplaneRef = useRef<THREE.Group>(null!);
  const scrollProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [gearExtended, setGearExtended] = useState(true);

  // 3D Catmull-Rom Spline Trajectory
  const { curve, tubeGeometry } = useMemo(() => {
    const splineCurve = new THREE.CatmullRomCurve3(
      WAYPOINT_VECTORS,
      true,
      "catmullrom",
      0.45
    );

    const tubeGeo = new THREE.TubeGeometry(splineCurve, 160, 0.012, 8, true);
    return { curve: splineCurve, tubeGeometry: tubeGeo };
  }, []);

  // Parabolic Destination Arcs
  const destinationArcLines = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: "#38bdf8",
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    return DESTINATION_ARCS.map(({ from, to }) => {
      const mid = new THREE.Vector3()
        .addVectors(from, to)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.8);

      const arcCurve = new THREE.QuadraticBezierCurve3(from, mid, to);
      const points = arcCurve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geo, material);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  // Flight Kinematics & Takeoff / Gear / Landing State Loop
  useFrame(() => {
    const p = scrollProgressRef.current;

    // Check gear state: Extended on runway takeoff (p < 0.1) & final touchdown landing (p > 0.85)
    const shouldExtendGear = p < 0.1 || p > 0.85;
    if (gearExtended !== shouldExtendGear) {
      setGearExtended(shouldExtendGear);
    }

    // Smooth lerp progress along spline curve
    currentProgressRef.current = THREE.MathUtils.lerp(
      currentProgressRef.current,
      p,
      0.06
    );

    const point = curve.getPointAt(currentProgressRef.current % 1);
    const tangent = curve.getTangentAt(currentProgressRef.current % 1);

    if (airplaneRef.current) {
      airplaneRef.current.position.copy(point);

      const target = point.clone().add(tangent);
      airplaneRef.current.lookAt(target);

      // Aerodynamic roll banking into turns
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const nextTangent = curve.getTangentAt((currentProgressRef.current + 0.01) % 1);
      const turnRate = right.dot(nextTangent);

      // Level wings during takeoff (p < 0.08) and touchdown landing (p > 0.9)
      const isOnRunway = p < 0.08 || p > 0.9;
      const maxRoll = isOnRunway ? 0.08 : 0.65;
      const bankRoll = THREE.MathUtils.clamp(turnRate * 12, -maxRoll, maxRoll);

      airplaneRef.current.rotateZ(bankRoll);

      // Takeoff pitch rotation (climb at p: 0.04-0.15)
      if (p >= 0.03 && p <= 0.15) {
        airplaneRef.current.rotateX(0.2);
      }
    }
  });

  return (
    <group>
      {/* Flight Trajectory Tube */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Destination Arcs */}
      {destinationArcLines.map((lineObj, idx) => (
        <primitive key={idx} object={lineObj} />
      ))}

      {/* Animated Airplane */}
      <group ref={airplaneRef}>
        <Airplane scale={0.12} gearExtended={gearExtended} />
      </group>
    </group>
  );
}

export const FlightController = FlightPath;
