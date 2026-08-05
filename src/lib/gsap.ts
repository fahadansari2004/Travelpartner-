/**
 * GSAP Central Registry
 *
 * Import GSAP and all plugins from this file.
 * Plugins are registered once here — never call registerPlugin elsewhere.
 *
 * Usage:
 *   import { gsap, ScrollTrigger } from "@/lib/gsap";
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register plugins and configure defaults only in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export { gsap, ScrollTrigger, TextPlugin };
