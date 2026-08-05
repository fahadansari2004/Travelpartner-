"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { AirportSequence } from "@/components/3d/airport/AirportSequence";
import { Loader2 } from "lucide-react";

export default function TestAirportPage() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950">
      <div className="absolute top-8 left-8 z-50 p-4 rounded-xl glass border border-white/10 text-slate-200 shadow-2xl">
        <h1 className="text-xl font-bold font-[family-name:var(--font-playfair)]">Airport Sequence Test</h1>
        <p className="text-sm text-slate-400 mt-2">Standalone Cinematic Component</p>
      </div>
      
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
