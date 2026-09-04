"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import {
  SiAmazonaws,
  SiChatbot,
  SiDocker,
  SiFastapi,
  SiGooglecloud,
  SiJupyter,
  SiOpenai,
  SiPython,
  SiPytorch,
  SiStreamlit,
  SiTensorflow,
  SiZapier,
} from "react-icons/si";

import { AiChatWidget } from "@/components/sub/ai-chat-widget";
import { WHATSAPP_NUMBER } from "@/constants";

const AI_TOOLS = [
  { icon: SiOpenai, label: "OpenAI" },
  { icon: SiChatbot, label: "AI Chatbots" },
  { icon: SiPython, label: "Python" },
  { icon: SiTensorflow, label: "TensorFlow" },
  { icon: SiPytorch, label: "PyTorch" },
  { icon: SiFastapi, label: "FastAPI" },
  { icon: SiJupyter, label: "Jupyter" },
  { icon: SiStreamlit, label: "Streamlit" },
  { icon: SiZapier, label: "Automation" },
  { icon: SiDocker, label: "Docker" },
  { icon: SiAmazonaws, label: "AWS" },
  { icon: SiGooglecloud, label: "Google Cloud" },
];

const AI_SKILLS = [
  "AI Integration",
  "Fine-Tuning",
  "Model Training",
  "AI Architecture",
  "LLM / RAG",
];

export const AI = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background video drifts slower than the page scroll for depth.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  // Heading reveal is driven directly by scroll progress (rather than
  // whileInView) so it reliably fades/slides in as it crosses the viewport,
  // instead of depending on an IntersectionObserver trigger that can miss.
  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ["start 0.9", "start 0.45"],
  });
  const headingOpacity = useTransform(headingProgress, [0, 1], [0, 1]);
  const headingYAnim = useTransform(headingProgress, [0, 1], [-60, 0]);

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hi Haroun, I'd like to talk about automating my business with AI."
      )}`
    : undefined;

  return (
    <section
      ref={sectionRef}
      id="ai"
      className="relative flex flex-col items-center justify-center overflow-hidden py-16 sm:py-24 px-4"
    >
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-20 flex items-start justify-center opacity-25"
      >
        <video loop muted autoPlay playsInline preload="false" className="w-full h-auto">
          <source src="/videos/Ai.webm" type="video/webm" />
        </video>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#030014]/30 via-[#030014]/80 to-[#030014]" />

      <div ref={headingRef}>
        <motion.div
          style={{ opacity: headingOpacity, y: headingYAnim }}
          className="text-2xl sm:text-3xl lg:text-[40px] font-medium text-center text-gray-200"
        >
          Artificial{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
            &
          </span>{" "}
          Intelligence.
        </motion.div>
      </div>

      <div className="cursive text-base sm:text-lg lg:text-[22px] text-gray-300 text-center mt-2">
        AI and automation, built to grow your business.
      </div>

      <div className="flex flex-col items-center group cursor-pointer w-auto h-auto mt-6">
        <Image
          src="/ai.png"
          alt="ai main"
          width={100}
          height={100}
          className="w-[74px] h-[74px] sm:w-[90px] sm:h-[90px] transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="Welcome-box px-[15px] py-[4px] my-4 border border-[var(--accent-border)] opacity-90">
        <div className="container">
          <div className="line line1 text-sm sm:text-base">Founder of Sonix.tn AI SaaS...</div>
          <div className="line line2 text-sm sm:text-base">Fine-tuning & deploying LLMs...</div>
          <div className="line line3 text-sm sm:text-base">Automating workflows with AI...</div>
        </div>
      </div>

      <p className="max-w-2xl text-center text-sm sm:text-base text-gray-300 mt-3 px-2">
        Founder &amp; lead engineer of{" "}
        <span className="text-gray-100 font-medium">Sonix.tn</span>, an
        AI-powered email SaaS. I integrate, fine-tune and architect AI models
        into production products that cut busywork and unlock new revenue —
        the same approach I bring to automating client businesses.
      </p>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8">
        {AI_TOOLS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-[var(--accent-border)] bg-white/5 px-4 py-3 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1"
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-200" />
            <span className="text-[10px] sm:text-[11px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 max-w-2xl">
        {AI_SKILLS.map((skill) => (
          <span
            key={skill}
            className="Welcome-box px-4 py-2 text-xs sm:text-sm text-gray-200 border border-[var(--accent-border)]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-10 w-full max-w-md">
        <AiChatWidget />
      </div>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          className="button-primary mt-8 py-2 px-6 rounded-lg text-center text-white cursor-pointer transition"
        >
          Let&apos;s automate your business
        </a>
      )}
    </section>
  );
};
