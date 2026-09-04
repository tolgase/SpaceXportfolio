"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { EncryptTool } from "@/components/sub/encrypt-tool";
import { HashTool } from "@/components/sub/hash-tool";
import { SecurityBestPractices } from "@/components/sub/security-best-practices";
import { SecurityNews } from "@/components/sub/security-news";

export const Encryption = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background video drifts slower than the foreground content for depth.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["24px", "-24px"]);

  // Heading reveal is driven directly by scroll progress (rather than
  // whileInView) so it reliably fades/slides in as it crosses the viewport,
  // instead of depending on an IntersectionObserver trigger that can miss.
  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.9", "start 0.45"],
  });
  const headingOpacity = useTransform(headingProgress, [0, 1], [0, 1]);
  const headingYAnim = useTransform(headingProgress, [0, 1], [-60, 0]);

  return (
    <div
      ref={sectionRef}
      id="encryption"
      className="relative flex flex-col h-full w-full overflow-hidden"
    >
      {/* Background video now spans the whole section — hero AND the
          security-toolkit grid below it — so every liquid-glass card here,
          not just the "Encryption" pill, is actually refracting live
          footage rather than the plain starfield. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-full object-cover"
          style={{ filter: "url(#glassRefraction)" }}
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </motion.div>
      {/* Fades the video toward the section's solid background near the
          bottom so the toolkit cards keep enough contrast to read, while
          leaving the hero area at the top untouched. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#030014]/40 to-[#030014]" />

      <div className="flex flex-row relative items-center justify-center min-h-screen w-full h-full px-4">
        <motion.div
          style={{ y: contentY }}
          className="absolute inset-0 z-10 flex flex-row items-center justify-center"
        >
          <div
            ref={headingRef}
            className="absolute w-full max-w-md sm:max-w-xl h-auto top-4 sm:top-0 z-[5] px-4"
          >
            <motion.div
              style={{ opacity: headingOpacity, y: headingYAnim }}
              className="text-2xl sm:text-3xl lg:text-[40px] font-medium text-center text-gray-200"
            >
              Performance{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
                &
              </span>{" "}
              security.
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center translate-y-[-30px] sm:translate-y-[-50px] absolute z-[20] w-auto h-auto"
          >
            <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
              <Image
                src="/lock-top.png"
                alt="Lock top"
                width={50}
                height={50}
                className="translate-y-5 transition-all duration-200 group-hover:translate-y-11 w-[38px] h-[38px] sm:w-[50px] sm:h-[50px]"
              />
              <Image
                src="/lock-main.png"
                alt="Lock main"
                width={70}
                height={70}
                className="z-10 w-[54px] h-[54px] sm:w-[70px] sm:h-[70px]"
              />
            </div>

            <div className="Welcome-box liquid-glass px-[15px] py-[4px] z-[20] border my-[14px] sm:my-[20px] border-[var(--accent-border)] opacity-90">
              <h1 className="Welcome-text text-[12px] relative z-[1]">Encryption</h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute z-[20] bottom-4 sm:bottom-[10px] px-5 w-full max-w-md sm:max-w-xl"
          >
            <div className="cursive text-lg sm:text-xl lg:text-[25px] font-medium text-center text-gray-300">
              Secure your data with end-to-end encryption.
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-[10] flex flex-col items-center gap-8 px-4 py-16 sm:py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
            Security toolkit
          </h2>
          <p className="max-w-xl text-sm text-gray-400">
            Live encryption tooling you can actually use, real-time
            cybersecurity headlines, and the best practices behind
            Haroun&apos;s work.
          </p>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <HashTool />
          <EncryptTool />
          <SecurityNews />
          <SecurityBestPractices />
        </div>
      </div>
    </div>
  );
};
