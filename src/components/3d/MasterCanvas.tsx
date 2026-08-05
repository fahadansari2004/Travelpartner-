"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { AirportSequence } from "./airport/AirportSequence";

export function MasterCanvas({ className }: { className?: string }) {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none w-screen h-screen ${className ? className : ""}`}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "mediump",
        }}
        dpr={dpr}
      >
        <PerformanceMonitor onChange={({ factor }) => setDpr([1, Math.max(1, factor * 2)])} />
        <Suspense fallback={null}>
          <AirportSequence />
        </Suspense>
      </Canvas>
    </div>
  );
}
