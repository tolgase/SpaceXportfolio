"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useHeroTheme } from "@/lib/hero-theme-context";

// lottie-react touches `document`/`navigator` at import time, which breaks
// Next's server render of a "use client" component — load it client-only.
// (v3's `Lottie` is a named export, not the module default, and takes the
// animation as `src` — a URL it fetches itself — rather than a pre-fetched
// `animationData` object.)
const Lottie = dynamic(() => import("lottie-react").then((mod) => mod.Lottie), {
  ssr: false,
});

type SectionKey = "hero" | "about-me" | "skills" | "ai" | "encryption" | "projects";

const SECTION_CAPTIONS: Record<SectionKey, string> = {
  hero: "Welcome aboard! 👋",
  "about-me": "This is Haroun — nice to meet you.",
  skills: "Here's the toolkit I fly with.",
  ai: "Ask my AI brain anything →",
  encryption: "Security is baked in, always.",
  projects: "Take a look at what he's built.",
};

const SECTION_IDS = Object.keys(SECTION_CAPTIONS) as SectionKey[];

// A small floating "virtual assistant" companion — an astronaut — that
// travels down the left edge of the page in sync with scroll progress, and
// calls out a one-line caption for whichever section is currently in view
// (tracked via IntersectionObserver, not scroll-math guessing, so it stays
// correct if section heights change). Clicking/tapping it jumps straight to
// the AI Assistant chat widget and focuses its input — a shortcut to a real
// feature, not decoration.
//
// The astronaut is a small self-authored Lottie animation
// (public/lottie/ai-buddy-{night,day}.json) rather than a third-party
// embed, so there's no CDN/license/runtime-hang risk like the liquidGL
// experiment earlier in this project. Two color variants (accent-purple
// chest light for night mode, accent-amber for day) are swapped by src —
// the same pattern hero.tsx already uses for its day/night background
// video — since a static Lottie file can't read CSS custom properties.
export const ScrollCompanion = () => {
  const { mode } = useHeroTheme();
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Position is driven by a plain rAF loop that writes `top` on the DOM
  // node directly, with hand-rolled exponential smoothing — deliberately
  // NOT framer-motion's useScroll/useSpring/useTransform chain, which in
  // testing produced a MotionValue that never actually reached the DOM
  // (the element's inline `top` stayed frozen at the very first computed
  // string forever, through several different framer-motion wiring
  // attempts). Writing the style directly sidesteps whatever that
  // mismatch was, and doubles as the "smooth" travel motion.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentTopPxRef = useRef<number | null>(null);
  // O2 gauge DOM refs — updated imperatively every frame (like `top` above)
  // rather than through React state, so a continuous 60fps value doesn't
  // trigger a re-render on every tick.
  const gaugeRingRef = useRef<HTMLDivElement>(null);
  const gaugeTextRef = useRef<HTMLSpanElement>(null);
  const cordPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      // Travel range kept clear of the fixed navbar (84px tall) at the top,
      // and nudged up slightly at the low end so the (now larger) astronaut
      // doesn't sit on top of the hero's "Fullstack Developer Portfolio" pill.
      const targetTop = reducedMotion
        ? window.innerHeight * 0.4
        : window.innerHeight * (0.12 + progress * (0.78 - 0.12));

      if (currentTopPxRef.current === null) {
        currentTopPxRef.current = targetTop;
      } else {
        currentTopPxRef.current += (targetTop - currentTopPxRef.current) * 0.07;
      }
      if (wrapperRef.current) {
        wrapperRef.current.style.top = `${currentTopPxRef.current}px`;
      }

      // Oxygen starts low at the top of the page and fills up as the
      // visitor scrolls — the astronaut's O2 tether "feeds" him as they
      // read further. Hue sweeps from a warning red/orange to a healthy
      // cyan-green as the tank fills.
      const oxygenPct = Math.round(14 + progress * 86);
      const hue = 6 + progress * 158;
      if (gaugeRingRef.current) {
        gaugeRingRef.current.style.background = `conic-gradient(hsl(${hue} 88% 58%) ${oxygenPct}%, rgba(255,255,255,0.12) ${oxygenPct}% 100%)`;
      }
      if (gaugeTextRef.current) {
        gaugeTextRef.current.textContent = `${oxygenPct}%`;
      }
      if (cordPathRef.current) {
        cordPathRef.current.style.stroke = `hsl(${hue} 80% 62%)`;
        cordPathRef.current.style.opacity = String(0.35 + progress * 0.5);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId && bestRatio > 0) {
          setActiveSection(bestId as SectionKey);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goToAssistant = () => {
    document.getElementById("ai")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("[data-ai-chat-input]")?.focus();
    }, 650);
  };

  return (
    <div
      ref={wrapperRef}
      style={{ top: "14%" }}
      className="hidden sm:flex fixed left-3 md:left-6 z-40 items-center gap-6 md:gap-7"
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
        <button
          type="button"
          onClick={goToAssistant}
          aria-label="Chat with the AI assistant"
          title="Chat with my AI assistant"
          className="w-full h-full cursor-pointer transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-solid)] rounded-full"
        >
          <Lottie
            src={mode === "day" ? "/lottie/ai-buddy-day.json" : "/lottie/ai-buddy-night.json"}
            loop={!reducedMotion}
            autoplay={!reducedMotion}
            style={{ width: "100%", height: "100%" }}
          />
        </button>

        {/* O2 tether: a cord running from the astronaut's tank out to a
            side-mounted percentage gauge — starts low and fills as the
            visitor scrolls, turning scroll progress into "helping him
            refill oxygen". Mounted beside (not below) the character so it
            doesn't add extra height on top of already-dense hero content. */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 -right-3 w-8 h-full md:-right-4 md:w-9"
        >
          <path
            ref={cordPathRef}
            d="M4,58 C20,66 6,74 32,80 C48,84 46,90 50,96"
            fill="none"
            stroke="hsl(6 80% 62%)"
            strokeWidth={5}
            strokeLinecap="round"
            style={{ transition: "stroke 0.2s linear, opacity 0.2s linear" }}
          />
        </svg>
        <div
          ref={gaugeRingRef}
          className="absolute top-1/2 -right-3 md:-right-4 w-8 h-8 md:w-9 md:h-9 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "conic-gradient(hsl(6 88% 58%) 14%, rgba(255,255,255,0.12) 14% 100%)" }}
          title="Oxygen level"
        >
          <div className="w-[23px] h-[23px] md:w-[26px] md:h-[26px] rounded-full bg-[#0a0e2a] flex items-center justify-center">
            <span ref={gaugeTextRef} className="text-[7px] md:text-[8px] font-bold text-gray-100 tabular-nums">
              14%
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.3 }}
          className="liquid-glass max-w-[200px] rounded-2xl px-4 py-2.5 text-sm md:text-[15px] font-medium leading-snug text-gray-100 shadow-lg"
        >
          {SECTION_CAPTIONS[activeSection]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
