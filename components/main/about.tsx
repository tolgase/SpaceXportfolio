"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { label: "Years commercial experience", value: "12+" },
  { label: "Projects & clients", value: "25+" },
  { label: "Commerce platforms", value: "5" },
  { label: "Pro certifications", value: "6" },
] as const;

const FOCUS_AREAS = [
  "PHP, Laravel & Symfony",
  "Magento, PrestaShop & WordPress (expert)",
  "Shopify & Shopware",
  "React, Node.js & TypeScript",
  "AI Integration, Fine-Tuning & LLM/RAG",
  "Docker, Kubernetes & DevOps",
] as const;

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Each layer drifts at a slightly different speed as the section scrolls
  // through the viewport, creating a multi-layered parallax depth effect.
  const headingY = useTransform(scrollYProgress, [0, 1], ["36px", "-36px"]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], ["22px", "-22px"]);
  const statsY = useTransform(scrollYProgress, [0, 1], ["12px", "-12px"]);
  const chipsY = useTransform(scrollYProgress, [0, 1], ["6px", "-6px"]);

  return (
    <section
      ref={sectionRef}
      id="about-me"
      className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 relative z-[10]"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="Welcome-box py-[8px] px-[7px] border border-[var(--accent-border)] opacity-90"
      >
        <h2 className="Welcome-text text-[13px]">About Me</h2>
      </motion.div>

      <motion.div style={{ y: headingY }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] py-6 sm:py-8 text-center max-w-3xl"
        >
          Senior Full Stack Developer, PHP-focused
        </motion.h1>
      </motion.div>

      <motion.div style={{ y: paragraphY }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 text-center max-w-3xl mb-10 sm:mb-12"
        >
          Senior full-stack developer with 12+ years of commercial experience
          building eCommerce platforms, custom CMS solutions, and headless
          storefronts on Shopify, Shopware, PrestaShop, Magento, and WordPress
          &mdash; using PHP, Laravel, Symfony, Node.js, and React. I&rsquo;ve led
          platform migrations, integrated ERP and payment systems, and rebuilt
          storefronts to improve conversion, performance, and SEO for retail,
          automotive, food-and-beverage, and travel clients across Europe,
          largely through Proxify&rsquo;s vetted developer network. I&rsquo;m now
          extending into applied AI &mdash; integrating, fine-tuning, and
          architecting models into production products, including{" "}
          <span className="text-white font-medium">Sonix.tn</span>, an
          AI-powered email SaaS I founded and lead as engineer.
        </motion.p>
      </motion.div>

      <motion.div style={{ y: statsY }} className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full mb-10 sm:mb-12"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center border border-[var(--accent-border)] rounded-xl bg-white/5 py-5 px-3"
            >
              <span className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div style={{ y: chipsY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 max-w-3xl"
        >
          {FOCUS_AREAS.map((area) => (
            <span
              key={area}
              className="text-xs sm:text-sm text-gray-300 border border-[var(--accent-border)] rounded-full px-4 py-2 bg-white/5"
            >
              {area}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
