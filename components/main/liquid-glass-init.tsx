"use client";

// NOT USED — kept only for reference; not imported anywhere.
//
// This was a first attempt at real glass refraction using the
// naughtyduk/liquidGL + html2canvas combo. Verified live in the browser: it
// loads fine on this page (both scripts resolve, no thrown errors, no
// console warnings) but its `on.init` callback never fires — traced into
// the library's own source, `_TriggerInit()` only runs after `_reveal()`,
// which only runs once `this.texture` is set from an html2canvas snapshot,
// and on this page that step simply never completes or errors — it hangs
// indefinitely (tested with a single, uniquely-id'd target and a direct
// `document.body` snapshot reference, not just the multi-match
// `.liquid-glass` selector, so it isn't a "multiple targets" issue).
//
// Rather than keep debugging an unpinned `@main`-branch third-party script
// (133KB, no version lock, silent-hang failure mode) against this specific
// page's video + WebGL starfield canvas, the real refraction now used
// sitewide is a native CSS one: `backdrop-filter: url(#glassCardRefraction)
// blur(...)` in app/globals.css, using the SVG filter defined in
// components/main/glass-refraction-filters.tsx. Same underlying math
// (feTurbulence + feDisplacementMap) as liquidGL's own video-warp trick,
// but GPU-composited natively with zero JS and no failure mode.
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    liquidGL?: (options: Record<string, unknown>) => unknown;
  }
}

// Loads the liquidGL + html2canvas libraries — the same real-time WebGL
// glass-refraction technique used by the naughtyduk/liquidGL demos — and
// attaches them to every `.liquid-glass` surface on the page. Without this,
// `.liquid-glass` is just a blurred, tinted box; liquidGL is what actually
// samples whatever sits behind each card (starfield, gradients, the
// encryption section's background video) and bends it through the glass.
export const LiquidGlassInit = () => {
  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false);
  const [liquidGLLoaded, setLiquidGLLoaded] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!html2canvasLoaded || !liquidGLLoaded) return;
    if (initialized.current) return;
    if (typeof window === "undefined" || !window.liquidGL) return;

    initialized.current = true;
    let ready = false;
    const cards = document.querySelectorAll<HTMLElement>(".liquid-glass");

    try {
      window.liquidGL({
        target: ".liquid-glass",
        snapshot: "body",
        resolution: 2.0,
        refraction: 0.05,
        bevelDepth: 0.18,
        bevelWidth: 0.12,
        frost: 0,
        shadow: true,
        specular: true,
        tilt: false,
        magnify: 1,
        reveal: "fade",
        on: {
          init() {
            ready = true;
            cards.forEach((card) => card.classList.add("liquid-glass-ready"));
          },
        },
      });
    } catch (error) {
      console.warn("liquidGL failed to initialize", error);
    }

    const timeout = setTimeout(() => {
      if (!ready) {
        cards.forEach((card) => card.classList.add("liquid-glass-fallback"));
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [html2canvasLoaded, liquidGLLoaded]);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="afterInteractive"
        onLoad={() => setHtml2canvasLoaded(true)}
      />
      <Script
        src="https://cdn.jsdelivr.net/gh/naughtyduk/liquidGL@main/scripts/liquidGL.js"
        strategy="afterInteractive"
        onLoad={() => setLiquidGLLoaded(true)}
      />
    </>
  );
};
