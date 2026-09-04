"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { HeroContent } from "@/components/sub/hero-content";
import { useHeroTheme } from "@/lib/hero-theme-context";

export const Hero = () => {
  const { mode } = useHeroTheme();
  const isDay = mode === "day";
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background moves slower than the page scroll (classic parallax depth layer).
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  // Foreground content drifts a little and fades as it leaves the viewport.
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col h-full w-full overflow-hidden"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 h-full w-full">
        {isDay ? (
          <video
            key="sun"
            autoPlay
            muted
            loop
            playsInline
            className="-scale-x-100 absolute top-[-40px] sm:top-[-60px] lg:top-[-80px] left-0 w-full h-full object-cover -z-20"
          >
            <source src="/videos/sun.webm" type="video/webm" />
          </video>
        ) : (
          <video
            key="blackhole"
            autoPlay
            muted
            loop
            playsInline
            className="rotate-180 absolute top-[-180px] sm:top-[-260px] lg:top-[-340px] left-0 w-full h-full object-cover -z-20"
          >
            <source src="/videos/blackhole.webm" type="video/webm" />
          </video>
        )}

        {/* Subtle scrim so body text keeps enough contrast over the brightest part of the visual */}
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-b ${
            isDay
              ? "from-[#1a0f00]/10 via-[#1a0f00]/40 to-[#030014]"
              : "from-[#030014]/10 via-[#030014]/50 to-[#030014]"
          }`}
        />

        {/* Extra left-side darkening in day mode so the bright sun disc never fights with the hero copy */}
        {isDay && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0c0400]/95 via-[#0c0400]/55 to-transparent" />
        )}
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <HeroContent />
      </motion.div>
    </div>
  );
};
