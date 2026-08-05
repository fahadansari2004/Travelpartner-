"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clouds, Cloud, Environment, MeshReflectorMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { Airplane } from "../Airplane";
import { EarthGlobe } from "../Earth";
import { SpaceEnvironment } from "../SpaceEnvironment";

gsap.registerPlugin(ScrollTrigger);

export function AirportSequence() {
  const animatedPlaneRef = useRef<THREE.Group>(null!);
  const fogRef = useRef<THREE.Fog>(null!);
  const engineSpeedRef = useRef(0);
  const [gearExtended, setGearExtended] = useState(true);
  const { camera } = useThree();

  useEffect(() => {
    if (!animatedPlaneRef.current || !camera || !fogRef.current) return;

    const track = document.getElementById("hero-container");
    if (!track) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrub
        },
      });

      // Initial state at the gate
      tl.call(() => {
        setGearExtended(true);
      }, undefined, 0);

      // Plane starting pos
      gsap.set(animatedPlaneRef.current.position, { x: 28, y: 0, z: 5 });
      gsap.set(animatedPlaneRef.current.rotation, { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 });

      // Camera starting pos
      gsap.set(camera.position, { x: 30, y: 15, z: 40 });
      gsap.set(camera.rotation, { x: -Math.PI / 8, y: Math.PI / 4, z: 0 });
      
      // Fog starting pos
      gsap.set(fogRef.current, { near: 20, far: 200 });

      // 1. Push back from gate
      tl.to(animatedPlaneRef.current.position, { x: 14, duration: 6, ease: "power1.inOut" }, 1);
      
      // Camera smoothly tracks pushback
      tl.to(camera.position, { x: 25, z: 35, duration: 6, ease: "power1.inOut" }, 1);
      tl.to(camera.rotation, { y: Math.PI / 6, duration: 6, ease: "power1.inOut" }, 1);

      // Start engines during pushback
      const speedObj = { val: 0 };
      tl.to(
        speedObj,
        {
          val: 15,
          duration: 4,
          onUpdate: () => {
            engineSpeedRef.current = speedObj.val;
          },
        },
        2
      );

      // 2. Turn 180 degrees to face the runway (-X direction)
      tl.to(animatedPlaneRef.current.rotation, { z: Math.PI / 2, duration: 4, ease: "power1.inOut" }, 7);

      // 3. Taxi to the runway center
      tl.to(animatedPlaneRef.current.position, { x: 0, duration: 6, ease: "linear" }, 11);

      // Camera swoops to look down the runway
      tl.to(camera.position, { x: -5, y: 8, z: 20, duration: 6, ease: "power1.inOut" }, 11);
      tl.to(camera.rotation, { y: -Math.PI / 4, duration: 6, ease: "power1.inOut" }, 11);

      // 4. Turn to face start of runway (-Z direction)
      tl.to(animatedPlaneRef.current.rotation, { z: 0, duration: 4, ease: "power1.inOut" }, 17);

      // 5. Taxi to start of runway
      tl.to(animatedPlaneRef.current.position, { z: -40, duration: 6, ease: "linear" }, 21);
      
      // Camera turns to watch the plane taxi away
      tl.to(camera.rotation, { y: -Math.PI / 1.5, duration: 6, ease: "linear" }, 21);

      // 6. Turn 180 to face takeoff direction (+Z direction)
      tl.to(animatedPlaneRef.current.rotation, { z: Math.PI, duration: 4, ease: "power1.inOut" }, 27);

      // 6.5. Swoop the camera right behind the plane!
      tl.to(camera.position, { x: 0, y: 3, z: -55, duration: 4, ease: "power2.inOut" }, 27);
      tl.to(camera.rotation, { x: -0.1, y: 0, z: 0, duration: 4, ease: "power2.inOut" }, 27);

      // 7. Takeoff Roll
      tl.to(animatedPlaneRef.current.position, { z: 10, duration: 5, ease: "power2.in" }, 32);
      // Camera chases
      tl.to(camera.position, { z: -5, duration: 5, ease: "power2.in" }, 32);

      // 8. Pitch up
      tl.to(animatedPlaneRef.current.rotation, { x: -Math.PI / 2 + 0.25, duration: 1.5, ease: "power1.inOut" }, 35.5);

      // 9. Lift off & Retract Gear
      tl.to(animatedPlaneRef.current.position, { y: 20, z: 80, duration: 3, ease: "power1.in" }, 37);
      tl.to(camera.position, { y: 20, z: 65, duration: 3, ease: "power1.in" }, 37);
      tl.call(() => setGearExtended(false), undefined, 38);

      // 10. Climb out and fly into the volumetric clouds
      tl.to(animatedPlaneRef.current.position, { y: 150, z: 600, duration: 8, ease: "linear" }, 40);
      tl.to(animatedPlaneRef.current.rotation, { x: -Math.PI / 2 + 0.1, duration: 2, ease: "power1.inOut" }, 40);
      
      tl.to(camera.position, { y: 150, z: 580, duration: 8, ease: "linear" }, 40);
      tl.to(camera.rotation, { x: 0.1, duration: 2, ease: "power1.inOut" }, 40);

      // 11. Break through the clouds into space!
      // CRITICAL FIX: Push the fog back so space is visible!
      tl.to(fogRef.current, { near: 1000, far: 3000, duration: 5, ease: "power1.inOut" }, 46);

      tl.to(animatedPlaneRef.current.position, { y: 250, z: 1000, duration: 10, ease: "power1.out" }, 48);
      // Level off slightly when reaching space
      tl.to(animatedPlaneRef.current.rotation, { x: -Math.PI / 2 + 0.02, duration: 4, ease: "power1.inOut" }, 52);
      
      // Camera breaks into space and stops moving forward, letting the plane fly away!
      tl.to(camera.position, { y: 250, z: 800, duration: 10, ease: "power1.out" }, 48);
      tl.to(camera.rotation, { x: 0, duration: 4, ease: "power1.out" }, 52);

      // 12. Complete transition
      tl.to(
        speedObj,
        {
          val: 0,
          duration: 3,
          onUpdate: () => {
            engineSpeedRef.current = speedObj.val;
          },
        },
        65
      );
    });

    return () => {
      ctx.revert();
    };
  }, [camera]);

  const concreteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#64748b",
        roughness: 0.6,
        metalness: 0.3,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#38bdf8",
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.9,
        transparent: true,
      }),
    []
  );

  const whiteLineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f8fafc",
      }),
    []
  );

  const yellowLineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#facc15",
      }),
    []
  );

  const roofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f172a",
        roughness: 0.7,
        metalness: 0.3,
      }),
    []
  );

  return (
    <group>
      {/* HDRI Environment for ultra-realistic metallic reflections */}
      <Environment preset="sunset" />

      {/* Premium Cinematic Fog */}
      <fog ref={fogRef} attach="fog" args={["#020617", 20, 200]} />

      {/* Cinematic High-Contrast Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[40, 50, -40]} 
        intensity={2.5} 
        color="#fbbf24" // Golden hour / dramatic yellow
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      
      {/* Cool blue fill light */}
      <pointLight position={[-40, 20, 40]} intensity={1.5} color="#38bdf8" distance={150} />

      {/* Ground - Ultra Realistic Wet Grass/Dirt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={5}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#020617"
          metalness={0.1}
          mirror={0}
        />
      </mesh>

      {/* Runway - Ultra Realistic Wet Asphalt Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 200]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          roughness={0.6}
          depthScale={1}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.2}
          color="#151515"
          metalness={0.8}
          mirror={0}
        />
      </mesh>

      {/* Runway markings - Centerline */}
      {Array.from({ length: 35 }).map((_, i) => (
        <mesh
          key={`centerline-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, -85 + i * 5]}
        >
          <planeGeometry args={[0.3, 2.5]} />
          <primitive object={whiteLineMaterial} attach="material" />
        </mesh>
      ))}

      {/* Runway markings - Edge lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, 0.01, 0]}>
        <planeGeometry args={[0.3, 200]} />
        <primitive object={whiteLineMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11, 0.01, 0]}>
        <planeGeometry args={[0.3, 200]} />
        <primitive object={whiteLineMaterial} attach="material" />
      </mesh>

      {/* Touchdown Zone Markings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`touchdown-left-${i}`} position={[-6, 0.01, -40 + i * 8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[1, 3]} />
             <primitive object={whiteLineMaterial} attach="material" />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`touchdown-right-${i}`} position={[6, 0.01, -40 + i * 8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[1, 3]} />
             <primitive object={whiteLineMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Tarmac/Apron - Realistic Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, 0, 15]} receiveShadow>
        <planeGeometry args={[50, 80]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={10}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1e293b"
          metalness={0.6}
          mirror={0}
        />
      </mesh>

      {/* Apron Markings (Taxiway line leading to runway) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[12, 0.01, 15]}>
        <planeGeometry args={[0.3, 20]} />
        <primitive object={yellowLineMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, 0.01, 22.1]} >
        <planeGeometry args={[0.3, 30]} />
        <primitive object={yellowLineMaterial} attach="material" />
      </mesh>

      {/* Minimalist Premium Terminal Building */}
      <group position={[45, 0, 15]}>
        {/* Main structure */}
        <mesh position={[0, 4, 0]} receiveShadow castShadow>
          <boxGeometry args={[18, 8, 40]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        
        {/* Glass Facade facing apron */}
        <mesh position={[-9.1, 4, 0]} receiveShadow>
          <boxGeometry args={[0.2, 6, 38]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
        
        {/* Roof structure */}
        <mesh position={[0, 8.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[22, 1, 42]} />
          <primitive object={roofMaterial} attach="material" />
        </mesh>

        {/* Airport control tower */}
        <group position={[5, 8, -12]}>
          <mesh receiveShadow castShadow position={[0, 6, 0]}>
            <cylinderGeometry args={[2, 2.5, 12, 32]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
          <mesh receiveShadow position={[0, 13.5, 0]}>
            <cylinderGeometry args={[3, 2, 3, 32]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
          <mesh receiveShadow castShadow position={[0, 15.5, 0]}>
            <cylinderGeometry args={[3.5, 3.5, 1, 32]} />
            <primitive object={roofMaterial} attach="material" />
          </mesh>
          {/* Beacon light */}
          <pointLight position={[0, 17, 0]} intensity={3} color="#ef4444" distance={150} />
          <mesh position={[0, 16.5, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* Animated Aircraft on Apron 1 */}
      <group ref={animatedPlaneRef}>
        <Airplane scale={3.5} turbofanSpeedRef={engineSpeedRef} gearExtended={gearExtended} />
      </group>
      
      {/* Runway Edge Lights */}
      {Array.from({ length: 40 }).map((_, i) => (
        <group key={`light-left-${i}`} position={[-11.5, 0, -95 + i * 5]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
            <meshBasicMaterial color="#1e1e1e" />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={1.5} color="#fbbf24" distance={25} />
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 40 }).map((_, i) => (
        <group key={`light-right-${i}`} position={[11.5, 0, -95 + i * 5]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
            <meshBasicMaterial color="#1e1e1e" />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={1.5} color="#fbbf24" distance={25} />
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}
      
      {/* Approach Lights */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={`approach-light-${i}`} position={[0, 0, -100 - i * 3]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
            <meshBasicMaterial color="#1e1e1e" />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={3} color="#ffffff" distance={40} />
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Volumetric Cloud Bank for Transition */}
      <group position={[0, 120, 450]}>
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud segments={80} bounds={[100, 60, 200]} volume={80} color="#ffffff" opacity={0.4} />
          <Cloud position={[0, 30, 100]} segments={80} bounds={[150, 80, 200]} volume={120} color="#ffffff" opacity={0.6} />
          <Cloud position={[30, -20, 50]} segments={60} bounds={[100, 50, 150]} volume={80} color="#94a3b8" opacity={0.5} />
        </Clouds>
      </group>

      {/* Space & Earth Reveal */}
      <group position={[0, 260, 1200]}>
        <SpaceEnvironment />
        <group scale={[25, 25, 25]} position={[0, -20, 0]}>
          <EarthGlobe />
        </group>
        <directionalLight position={[100, 50, -100]} intensity={4} color="#fdf4ff" />
      </group>
    </group>
  );
}
