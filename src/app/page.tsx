"use client";

import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/ui/Preloader";
import { CinematicStorytelling } from "@/components/travel/CinematicStorytelling";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      <Preloader />
      <Header />
      <CinematicStorytelling />
    </main>
  );
}
