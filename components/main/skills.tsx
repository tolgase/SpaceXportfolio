"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { SkillDataProvider } from "@/components/sub/skill-data-provider";
import { SkillText } from "@/components/sub/skill-text";

import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  OTHER_SKILL,
  SKILL_DATA,
} from "@/constants";

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background layer drifts slower than the foreground skill icons.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-16 sm:py-20 px-4 sm:scale-95 lg:scale-90"
    >
      <SkillText />

      <div className="flex flex-row justify-center flex-wrap mt-4 gap-4 sm:gap-5 items-center max-w-4xl">
        {SKILL_DATA.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center flex-wrap mt-4 gap-4 sm:gap-5 items-center max-w-4xl">
        {FRONTEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center flex-wrap mt-4 gap-4 sm:gap-5 items-center max-w-4xl">
        {BACKEND_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center flex-wrap mt-4 gap-4 sm:gap-5 items-center max-w-4xl">
        {FULLSTACK_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-row justify-center flex-wrap mt-4 gap-4 sm:gap-5 items-center max-w-4xl">
        {OTHER_SKILL.map((skill, i) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

      <div className="w-full h-full absolute">
        <motion.div
          style={{ y: bgY }}
          className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover"
        >
          <video
            className="w-full h-auto"
            preload="false"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </motion.div>
      </div>
    </section>
  );
};
