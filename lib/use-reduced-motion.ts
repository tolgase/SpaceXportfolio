"use client";

import { useEffect, useState } from "react";

// Tracks the OS-level "prefers-reduced-motion: reduce" setting live.
//
// The sitewide CSS rule in globals.css and the MotionConfig provider in
// motion-provider.tsx cover plain CSS transitions/animations and
// framer-motion's own JS-driven ones respectively, but neither reaches an
// animation loop a component drives itself — a raw requestAnimationFrame
// tick, or a three.js/react-three-fiber useFrame callback. Those need to
// read the preference directly, which is what this hook is for. (Originally
// written inline in ScrollCompanion; extracted here so StarBackground's own
// continuous rotation loop can honor the same setting instead of spinning
// at full speed regardless of it.)
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}
