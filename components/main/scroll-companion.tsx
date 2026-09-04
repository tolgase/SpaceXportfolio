"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useHeroTheme } from "@/lib/hero-theme-context";
import { cn } from "@/lib/utils";

// lottie-react touches `document`/`navigator` at import time, which breaks
// Next's server render of a "use client" component — load it client-only.
// (v3's `Lottie` is a named export, not the module default, and takes the
// animation as `src` — a URL it fetches itself — rather than a pre-fetched
// `animationData` object.)
const Lottie = dynamic(() => import("lottie-react").then((mod) => mod.Lottie), {
  ssr: false,
});

type SectionKey = "hero" | "about-me" | "skills" | "ai" | "encryption" | "projects";

// Each section gets a short pool of captions that escalate from a plain
// greeting to an actual sales pitch — which one shows is picked by how long
// the visitor lingers (see the dwell-time "engagement" formula below), so a
// skimmer sees the light intro line while someone who actually stops and
// reads gets pitched.
const SECTION_MESSAGES: Record<SectionKey, string[]> = {
  hero: [
    "Welcome aboard! 👋",
    "12+ years shipping production PHP & React.",
    "Ready to launch your next project? →",
  ],
  "about-me": [
    "This is Haroun — nice to meet you.",
    "Full-stack, PHP-first, ships fast.",
    "Curious what he'd build for you? Keep scrolling →",
  ],
  skills: [
    "Here's the toolkit I fly with.",
    "PHP, Laravel, React, AI — one dev, full stack.",
    "Need this stack on your team? Let's talk →",
  ],
  ai: [
    "Ask my AI brain anything →",
    "He builds AI features like this one — for real clients.",
    "Got an idea? Type it in below ↓",
  ],
  encryption: [
    "Security is baked in, always.",
    "Encryption, hashing, best practices — all built in.",
    "Security-minded engineering from day one.",
  ],
  projects: [
    "Take a look at what he's built.",
    "Real products, real clients, real results.",
    "Like what you see? Let's build yours →",
  ],
};

const SECTION_IDS = Object.keys(SECTION_MESSAGES) as SectionKey[];

// A lightweight per-topic "mood" — a hue-rotate on the whole character so he
// visually reacts to what's behind him (a cooler shift near the AI/encryption
// sections, a warmer one near the sun-toned skills section) without needing
// a bespoke Lottie file per section.
const SECTION_MOOD_HUE: Record<SectionKey, number> = {
  hero: 0,
  "about-me": 0,
  skills: -35,
  ai: 25,
  encryption: -12,
  projects: 0,
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// A small floating "virtual assistant" companion — an astronaut — that
// travels down the left edge of the page in sync with scroll progress, and
// calls out a caption for whichever section is currently in view (tracked
// via IntersectionObserver, not scroll-math guessing, so it stays correct if
// section heights change).
//
// Three things drive its behaviour beyond simple position-following:
//
// 1. Dwell-time messaging — a per-section message tier (0/1/2) escalates the
//    longer the visitor stays on a section (see the `messageTier` effect),
//    so the caption reads like a light intro at first glance and a real
//    pitch if they actually linger. A repeat visit to a section skips the
//    plain intro since they've already seen it.
// 2. An O2 tether — a small gauge shows an oxygen percentage that starts low
//    and fills as the visitor scrolls toward the bottom of the page. Every
//    time a new section is entered, the cord "docks" to a fresh tank (a
//    small icon pulses in) as a little reward beat.
// 3. AI fusion — when the AI Assistant section is active, the astronaut
//    detaches from the left-edge column and docks into the chat widget
//    itself, with a glowing connector running from him to the card. Scroll
//    past it and he undocks and resumes his normal downward travel.
//
// The astronaut is a small self-authored Lottie animation
// (public/lottie/ai-buddy-{night,day}.json) rather than a third-party embed,
// so there's no CDN/license/runtime-hang risk. Two color variants (accent
// purple for night mode, accent amber for day) are swapped by src — the same
// pattern hero.tsx already uses for its day/night background video — since a
// static Lottie file can't read CSS custom properties.
export const ScrollCompanion = () => {
  const { mode } = useHeroTheme();
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [messageTier, setMessageTier] = useState(0);
  const [justEntered, setJustEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const fused = activeSection === "ai" && !reducedMotion;

  // Position is driven by a plain rAF loop that writes `top`/`left` on the
  // DOM node directly, with hand-rolled exponential smoothing — deliberately
  // NOT framer-motion's useScroll/useSpring/useTransform chain, which in
  // testing produced a MotionValue that never actually reached the DOM (the
  // element's inline styles stayed frozen at the very first computed value
  // forever, through several different framer-motion wiring attempts).
  // Writing the style directly sidesteps whatever that mismatch was, and
  // doubles as the "smooth" travel/dock motion.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentTopPxRef = useRef<number | null>(null);
  const currentLeftPxRef = useRef<number | null>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  // O2 gauge DOM refs — updated imperatively every frame (like position
  // above) rather than through React state, so a continuous 60fps value
  // doesn't trigger a re-render on every tick.
  const gaugeRingRef = useRef<HTMLDivElement>(null);
  const gaugeTextRef = useRef<HTMLSpanElement>(null);
  const cordPathRef = useRef<SVGPathElement>(null);

  // Dwell-time bookkeeping for the messaging formula.
  const activeSectionRef = useRef<SectionKey>("hero");
  const lastSectionRef = useRef<SectionKey | null>(null);
  const sectionEnterAtRef = useRef<number>(Date.now());
  const visitCountsRef = useRef<Partial<Record<SectionKey, number>>>({});

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp01(window.scrollY / max) : 0;
      const isFused = activeSectionRef.current === "ai" && !reducedMotion;
      const baseLeft = window.innerWidth >= 768 ? 24 : 12;

      let targetTop: number;
      let targetLeft: number;

      if (isFused) {
        // Dock beside the AI chat widget itself, wherever it actually sits
        // on the page, rather than assuming a fixed layout.
        const card = document.querySelector<HTMLElement>("[data-ai-chat-card]");
        const rect = card?.getBoundingClientRect();
        if (rect) {
          targetTop = rect.top + rect.height * 0.1;
          targetLeft = Math.max(baseLeft, rect.left - 104);
        } else {
          targetTop = window.innerHeight * 0.4;
          targetLeft = baseLeft;
        }
      } else if (reducedMotion) {
        targetTop = window.innerHeight * 0.4;
        targetLeft = baseLeft;
      } else {
        // Travel range kept clear of the fixed navbar (84px tall) at the
        // top, and nudged up slightly at the low end so the astronaut
        // doesn't sit on top of the hero's "Fullstack Developer Portfolio"
        // pill.
        targetTop = window.innerHeight * (0.12 + progress * (0.78 - 0.12));
        targetLeft = baseLeft;
      }

      // Never let the companion drift off-screen — guards against the
      // AI-docking target briefly being far above/below the viewport during
      // a sudden scroll jump (e.g. a nav-link click) before the section
      // observer has caught up.
      targetTop = Math.min(Math.max(targetTop, window.innerHeight * 0.05), window.innerHeight * 0.92);

      // Dock/undock a little snappier than the ordinary travel smoothing.
      const smoothing = isFused ? 0.12 : 0.07;
      if (currentTopPxRef.current === null) {
        currentTopPxRef.current = targetTop;
      } else {
        currentTopPxRef.current += (targetTop - currentTopPxRef.current) * smoothing;
      }
      if (currentLeftPxRef.current === null) {
        currentLeftPxRef.current = targetLeft;
      } else {
        currentLeftPxRef.current += (targetLeft - currentLeftPxRef.current) * smoothing;
      }
      if (wrapperRef.current) {
        wrapperRef.current.style.top = `${currentTopPxRef.current}px`;
        wrapperRef.current.style.left = `${currentLeftPxRef.current}px`;
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

      // The connector beam while fused with the AI chat card — a glowing
      // line from the astronaut out to the card, like a wire from his
      // "brain" straight into the widget.
      if (beamRef.current) {
        const card = isFused
          ? document.querySelector<HTMLElement>("[data-ai-chat-card]")
          : null;
        const cardRect = card?.getBoundingClientRect();
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        // Guard against a stray beam stretching across the whole page during
        // a big, sudden scroll jump (e.g. clicking a nav link) — only draw
        // it once the chat card is actually near the viewport.
        const cardIsNearby =
          !!cardRect && cardRect.top > -window.innerHeight * 1.5 && cardRect.top < window.innerHeight * 2.5;
        if (isFused && cardRect && wrapperRect && cardIsNearby) {
          const x1 = wrapperRect.left + wrapperRect.width * 0.32;
          const y1 = wrapperRect.top + wrapperRect.height * 0.22;
          const x2 = cardRect.left + 14;
          const y2 = cardRect.top + 22;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          beamRef.current.style.opacity = "1";
          beamRef.current.style.width = `${len}px`;
          beamRef.current.style.left = `${x1}px`;
          beamRef.current.style.top = `${y1}px`;
          beamRef.current.style.transform = `rotate(${angle}deg)`;
        } else {
          beamRef.current.style.opacity = "0";
        }
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
          const section = bestId as SectionKey;
          if (section !== lastSectionRef.current) {
            lastSectionRef.current = section;
            sectionEnterAtRef.current = Date.now();
            visitCountsRef.current[section] = (visitCountsRef.current[section] ?? 0) + 1;
            setMessageTier(0);
            // Reward beat: a fresh O2 tank "docks in" for the new section.
            setJustEntered(true);
            window.setTimeout(() => setJustEntered(false), 1000);
          }
          setActiveSection(section);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // The messaging "algorithm": an engagement score built from how long the
  // visitor has stayed on the current section (dwell time), nudged up a
  // level immediately on a repeat visit since they've already seen the
  // intro line for that section. Re-evaluated once a second rather than
  // inside the 60fps rAF loop, since it only needs to change a few times
  // per visit.
  useEffect(() => {
    const id = window.setInterval(() => {
      const dwellSeconds = (Date.now() - sectionEnterAtRef.current) / 1000;
      const visits = visitCountsRef.current[activeSectionRef.current] ?? 1;
      let tier = dwellSeconds < 5 ? 0 : dwellSeconds < 12 ? 1 : 2;
      if (visits > 1 && tier === 0) tier = 1;
      setMessageTier((prev) => (prev === tier ? prev : tier));
    }, 1000);
    return () => window.clearInterval(id);
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

  const captionPool = SECTION_MESSAGES[activeSection];
  const captionText = captionPool[Math.min(messageTier, captionPool.length - 1)];

  return (
    <>
      {/* Connector beam, shown only while docked/fused with the AI chat
          card — positioned in fixed viewport coordinates independently of
          the companion's own wrapper transform. */}
      <div
        ref={beamRef}
        aria-hidden
        className="hidden sm:block fixed z-30 h-[2px] origin-left rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 0,
          background: "linear-gradient(90deg, var(--accent-solid), transparent)",
          boxShadow: "0 0 10px 1px var(--accent-glow-strong)",
        }}
      />

      <div
        ref={wrapperRef}
        style={{ top: "14%", left: "12px" }}
        className="hidden sm:flex fixed z-40 items-center gap-6 md:gap-7"
      >
        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
          <motion.div
            key={activeSection}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="w-full h-full"
          >
            <button
              type="button"
              onClick={goToAssistant}
              aria-label="Chat with the AI assistant"
              title="Chat with my AI assistant"
              style={{ filter: `hue-rotate(${SECTION_MOOD_HUE[activeSection]}deg)`, transition: "filter 0.6s ease" }}
              className={cn(
                "w-full h-full cursor-pointer transition-transform duration-500 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-solid)] rounded-full",
                fused && "scale-90"
              )}
            >
              <Lottie
                src={mode === "day" ? "/lottie/ai-buddy-day.json" : "/lottie/ai-buddy-night.json"}
                loop={!reducedMotion}
                autoplay={!reducedMotion}
                style={{ width: "100%", height: "100%" }}
              />
            </button>
          </motion.div>

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
            className={cn(
              "absolute top-1/2 -right-3 md:-right-4 w-8 h-8 md:w-9 md:h-9 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300",
              justEntered && "scale-[1.18]"
            )}
            style={{ background: "conic-gradient(hsl(6 88% 58%) 14%, rgba(255,255,255,0.12) 14% 100%)" }}
            title="Oxygen level"
          >
            <div className="w-[23px] h-[23px] md:w-[26px] md:h-[26px] rounded-full bg-[#0a0e2a] flex flex-col items-center justify-center leading-none">
              <span className="text-[5px] md:text-[6px] font-semibold text-gray-400">O2</span>
              <span ref={gaugeTextRef} className="text-[7px] md:text-[8px] font-bold text-gray-100 tabular-nums">
                14%
              </span>
            </div>
          </div>

          {/* Reward beat: a fresh tank briefly docks in whenever a new
              section is entered, tied to the same cord. */}
          <AnimatePresence>
            {justEntered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.35 }}
                className="absolute -top-2 -right-7 md:-right-8 flex items-center justify-center w-4 h-6 md:w-5 md:h-7 rounded-sm bg-white/10 border border-white/25 shadow-md"
                title="New O2 tank"
              >
                <span className="block w-[6px] h-3 md:w-2 md:h-4 rounded-[1px] bg-emerald-400/90" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${messageTier}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="liquid-glass max-w-[200px] rounded-2xl px-4 py-2.5 text-sm md:text-[15px] font-medium leading-snug text-gray-100 shadow-lg"
          >
            {captionText}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
