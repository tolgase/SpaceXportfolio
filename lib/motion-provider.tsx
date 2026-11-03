"use client";

import { MotionConfig } from "framer-motion";
import type { PropsWithChildren } from "react";

// framer-motion's package doesn't ship a "use client" directive on its own
// entry point, so importing MotionConfig straight into a Server Component
// (app/layout.tsx has no "use client") lets Next bundle it into the server
// chunk, where its internal createContext call blows up at build time
// ("r.createContext is not a function"). Establishing the client boundary
// here — the same pattern already used for HeroThemeProvider — fixes that.
//
// reducedMotion="user" makes every framer-motion component site-wide
// (card/section entrance animations, hover/tap scales, etc.) defer to the
// OS-level "prefers-reduced-motion: reduce" setting automatically. The
// sitewide CSS rule in globals.css only catches plain CSS
// transitions/animations, not framer-motion's own JS-driven ones, so
// without this, motion-sensitive visitors with that setting on still got
// every scale/translate animation on the site.
export const MotionProvider = ({ children }: PropsWithChildren) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
