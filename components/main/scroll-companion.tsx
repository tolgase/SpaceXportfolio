"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useHeroTheme } from "@/lib/hero-theme-context";
import { cn } from "@/lib/utils";

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

// Horizontal breathing room kept between the astronaut's right edge and
// whatever dock target (chat widget, skills grid, project cards, ...) he's
// settled beside — measured against the character's own current on-screen
// width, so the gap stays proportional as he scales across viewport sizes.
const DOCK_GAP_PX = 24;

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
// 2. An O2 gauge — built into the suit's backpack corner (no dangling
//    cord), showing an oxygen percentage that starts low and fills as the
//    visitor scrolls toward the bottom of the page. Every time a new
//    section is entered, a fresh tank icon docks in as a little reward
//    beat.
// 3. Section docking — every section can offer a "dock point" (its main
//    card/widget) via a `data-companion-dock="<section>"` attribute on that
//    element. When one is present, on screen, and there's genuine room for
//    him (character + caption) to fit beside it without spilling into it,
//    the astronaut detaches from the left-edge column, settles in with a
//    real measured gap (never touching it), and a single glowing connector
//    beam runs from him to the target — the same "linked in" read every
//    docked section gets now, not just the AI one. A section with no dock
//    point (or one that's off-screen, or too tight to fit him) falls back
//    to the classic left-edge travel with no beam. The AI section additionally
//    swaps his usual caption bubble for a compact "linked" badge, since the
//    chat widget already presents its own message content and having both
//    on screen at once would be redundant. Scroll past a dock point and he
//    undocks and resumes normal travel.
// 4. Topic reactions — a plasma shield fades in near his hand while the
//    security/encryption section is active, and a brief signal-pulse glow
//    flashes near the top of his helmet whenever he arrives/docks at a new
//    section ("thinking" beat) — both on top of the per-section hue shift
//    every section gets.
//
// The astronaut is a static illustration (public/astronaut-buddy.png, a
// cropped/resized export of the free LottieFiles "Astronaut" animation at
// https://lottiefiles.com/free-animation/astronaut-km42ScPs6r — its free
// Lottie JSON export turned out to be a single flattened raster frame with
// no internal keyframes on the character, so there's nothing gained by
// paying the lottie-react runtime + JSON payload cost to play it "live").
// All of his motion — travel position, dock/undock spring, hover/click
// scale, and the per-section mood — is driven externally the same way it
// already was: a CSS hue-rotate filter reacts to both the active section
// (SECTION_MOOD_HUE) and day/night mode, so one PNG still reads as
// "reacting" to context without needing separate day/night art files.
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
  // doesn't trigger a re-render on every tick. The gauge is mounted flush
  // against the suit's backpack corner — no free-floating cord — so it
  // reads as a real instrument built into the suit rather than a prop
  // dangling off it.
  const gaugeRingRef = useRef<HTMLDivElement>(null);
  const gaugeTextRef = useRef<HTMLSpanElement>(null);

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
      const baseLeft = window.innerWidth >= 768 ? 24 : 12;

      // Every section can offer a dock point (its main card/widget) via a
      // `data-companion-dock="<section>"` attribute, wherever that element
      // actually sits on the page — computed once up front so both the
      // position logic below and the connector beam (drawn for whichever
      // section is actually docked, not just the AI one) can share it.
      const dockEl = reducedMotion
        ? null
        : document.querySelector<HTMLElement>(`[data-companion-dock="${activeSectionRef.current}"]`);
      const dockRect = dockEl?.getBoundingClientRect();

      let targetTop: number;
      let targetLeft: number;
      let docked = false;

      if (reducedMotion) {
        targetTop = window.innerHeight * 0.4;
        targetLeft = baseLeft;
      } else {
        // Measured against the whole group's current rendered width
        // (character + gap + caption bubble) so the caption itself never
        // creeps back in under the dock target — a gap sized only for the
        // character would leave the caption, which sits further right in
        // the same flex row, overlapping the dock content.
        const wrapperWidth = wrapperRef.current?.offsetWidth || 110;
        // Only actually dock if there's real room for the whole group
        // between the left edge and the target — on a narrow viewport, or a
        // dock target (like the projects grid) that starts close to the
        // page margin, forcing a dock here would just clamp back to
        // baseLeft while still measuring the gap as if it fit, letting the
        // caption bubble spill into the target underneath it. Better to
        // fall through to the classic left-edge travel than fake a dock
        // that can't actually keep clear.
        const hasRoomToDock = !!dockRect && dockRect.left - baseLeft >= wrapperWidth + DOCK_GAP_PX;
        if (dockRect && hasRoomToDock) {
          docked = true;
          targetTop = dockRect.top + dockRect.height * 0.1;
          targetLeft = dockRect.left - DOCK_GAP_PX - wrapperWidth;
        } else {
          // Travel range kept clear of the fixed navbar (84px tall) at the
          // top, and nudged up slightly at the low end so the astronaut
          // doesn't sit on top of the hero's "Fullstack Developer Portfolio"
          // pill.
          targetTop = window.innerHeight * (0.12 + progress * (0.78 - 0.12));
          targetLeft = baseLeft;
        }
      }

      // Never let the companion drift off-screen — guards against a dock
      // target briefly being far above/below the viewport during a sudden
      // scroll jump (e.g. a nav-link click) before the section observer has
      // caught up.
      targetTop = Math.min(Math.max(targetTop, window.innerHeight * 0.05), window.innerHeight * 0.92);

      // Dock/undock a little snappier than the ordinary travel smoothing.
      const smoothing = docked ? 0.12 : 0.07;
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

      // The connector beam whenever he's actually docked beside a section's
      // card/widget — a glowing line from the astronaut out to it, like a
      // wire from his "brain" straight into whatever he's linked to. Runs
      // for every section now, not just the AI one — the same "linked in"
      // read the AI chat card originally got.
      if (beamRef.current) {
        const cardRect = docked ? dockRect : null;
        const wrapperRect = wrapperRef.current?.getBoundingClientRect();
        // Guard against a stray beam stretching across the whole page during
        // a big, sudden scroll jump (e.g. clicking a nav link) — only draw
        // it once the dock target is actually near the viewport.
        const cardIsNearby =
          !!cardRect && cardRect.top > -window.innerHeight * 1.5 && cardRect.top < window.innerHeight * 2.5;
        if (docked && cardRect && wrapperRect && cardIsNearby) {
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
  const showShield = activeSection === "encryption" && !reducedMotion;

  // Fluid sizing (clamp between a mobile-safe floor and a desktop ceiling)
  // so the companion scales continuously with viewport width instead of
  // jumping between two fixed breakpoints — the same character reads right
  // from a small tablet up through an ultra-wide monitor.
  const charSize = "clamp(5.5rem, 8vw, 9rem)";
  const gaugeSize = "clamp(1.7rem, 2.1vw, 2.25rem)";

  return (
    <>
      {/* Connector beam, shown only while docked/fused with the AI chat
          card — positioned in fixed viewport coordinates independently of
          the companion's own wrapper transform. companion-beam animates a
          traveling highlight so it reads as signal flowing to the card. */}
      <div
        ref={beamRef}
        aria-hidden
        className="companion-beam hidden sm:block fixed z-30 h-[2px] origin-left rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          opacity: 0,
          backgroundImage:
            "linear-gradient(90deg, transparent, var(--accent-solid) 35%, var(--accent-solid) 65%, transparent)",
          boxShadow: "0 0 10px 1px var(--accent-glow-strong)",
        }}
      />

      <div
        ref={wrapperRef}
        style={{ top: "14%", left: "12px" }}
        className="hidden sm:flex fixed z-40 items-center gap-6 md:gap-7"
      >
        <div className="relative shrink-0" style={{ width: charSize, height: charSize }}>
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
              style={{
                filter: `hue-rotate(${SECTION_MOOD_HUE[activeSection] + (mode === "day" ? 25 : 0)}deg) ${
                  mode === "day" ? "saturate(1.15) brightness(1.05)" : ""
                }`,
                transition: "filter 0.6s ease",
              }}
              className={cn(
                "w-full h-full cursor-pointer transition-transform duration-500 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-solid)] rounded-full",
                fused && "scale-90"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed
                  small decorative icon at a controlled resolution; next/image
                  adds no benefit here and its `fill` mode fights the
                  motion.div/button wrappers' own sizing. */}
              <img
                src="/astronaut-buddy.png"
                alt="AI assistant astronaut"
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
              />
            </button>
          </motion.div>

          {/* "Thinking" beat: a brief signal-pulse glow near the top of his
              helmet whenever he arrives/docks at a new section — reads as a
              quick radio ping rather than a static state, and fades out on
              its own well before the next section change. */}
          <AnimatePresence>
            {justEntered && !reducedMotion && (
              <motion.div
                key="signal-pulse"
                aria-hidden
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.25, 1.6] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-[2%] -translate-x-1/2 w-[34%] h-[34%] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 72%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Topic reaction: a plasma shield he "raises" while the
              security/encryption section is active — a themed reaction
              distinct from the mood hue-shift every section gets. */}
          <AnimatePresence>
            {showShield && (
              <motion.svg
                key="plasma-shield"
                viewBox="0 0 60 72"
                initial={{ opacity: 0, scale: 0.6, x: -6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="pointer-events-none absolute -left-[18%] top-[30%] w-[42%] h-[52%] drop-shadow-[0_0_10px_var(--accent-glow-strong)]"
              >
                <motion.path
                  d="M30 2 L56 12 V34 C56 52 44 64 30 70 C16 64 4 52 4 34 V12 Z"
                  fill="url(#plasmaShieldFill)"
                  stroke="var(--accent-solid)"
                  strokeWidth={2.5}
                  animate={{ opacity: [0.55, 0.9, 0.55] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <defs>
                  <radialGradient id="plasmaShieldFill" cx="50%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="var(--accent-solid)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--accent-solid)" stopOpacity={0.08} />
                  </radialGradient>
                </defs>
              </motion.svg>
            )}
          </AnimatePresence>

          {/* O2 gauge — mounted flush against the suit's backpack corner,
              no free-floating cord, so it reads as a built-in instrument
              rather than a prop dangling off the character. Level starts
              low and fills as the visitor scrolls; the ring's fill color
              sweeps red-to-green with it, while the label itself stays a
              crisp, always-legible green. */}
          <div
            ref={gaugeRingRef}
            className={cn(
              "absolute bottom-[6%] right-[2%] flex items-center justify-center rounded-full shadow-lg ring-2 ring-[#0a0e2a] transition-transform duration-300",
              justEntered && "scale-[1.18]"
            )}
            style={{
              width: gaugeSize,
              height: gaugeSize,
              background: "conic-gradient(hsl(6 88% 58%) 14%, rgba(255,255,255,0.12) 14% 100%)",
            }}
            title="Oxygen level"
          >
            <div className="w-[78%] h-[78%] rounded-full bg-[#0a0e2a] flex flex-col items-center justify-center leading-none">
              <span className="text-[6px] md:text-[7px] font-bold text-emerald-400">O2</span>
              <span
                ref={gaugeTextRef}
                className="text-[7px] md:text-[8px] font-bold text-emerald-300 tabular-nums"
              >
                14%
              </span>
            </div>
          </div>

          {/* Reward beat: a fresh tank briefly docks in whenever a new
              section is entered. */}
          <AnimatePresence>
            {justEntered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.35 }}
                className="absolute bottom-[24%] right-[-6%] flex items-center justify-center w-4 h-6 md:w-5 md:h-7 rounded-sm bg-white/10 border border-white/25 shadow-md"
                title="New O2 tank"
              >
                <span className="block w-[6px] h-3 md:w-2 md:h-4 rounded-[1px] bg-emerald-400/90" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Exactly one message card on screen at a time: the usual
            per-section caption, except while fused with the AI widget —
            which already presents its own card — where it steps aside for
            a compact "linked" pill instead. */}
        <AnimatePresence mode="wait">
          {fused ? (
            <motion.div
              key="linked-badge"
              initial={{ opacity: 0, scale: 0.75, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.75, x: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs md:text-sm font-medium text-emerald-300 shadow-lg"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              Linked to AI Assistant
            </motion.div>
          ) : (
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
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
