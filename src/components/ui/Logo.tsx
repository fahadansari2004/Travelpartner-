"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light";
}

/**
 * Official Authentic travelPartner Logo Component
 * Precision logo sizing:
 * - Desktop: 50–58px height
 * - Tablet: 44–50px height
 * - Mobile: 38–44px height
 */
export function Logo({ className = "", size = "md", variant = "dark" }: LogoProps) {
  const heightMap = {
    sm: "h-[38px] sm:h-[42px]",
    md: "h-[44px] sm:h-[50px] lg:h-[58px]", // Desktop ~58px, Tablet ~50px, Mobile ~44px
    lg: "h-[50px] sm:h-[58px] lg:h-[68px]",
    xl: "h-[60px] sm:h-[72px] lg:h-[88px]",
  };

  const imageSrc = variant === "light" ? "/images/logo_original.png" : "/images/logo.png";

  return (
    <div className={cn("inline-flex items-center shrink-0 select-none", heightMap[size], className)}>
      <img
        src={imageSrc}
        alt="travelPartner TOURS AND TRAVELS"
        className="h-full w-auto object-contain drop-shadow-md transition-all duration-300 group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
      />
    </div>
  );
}
