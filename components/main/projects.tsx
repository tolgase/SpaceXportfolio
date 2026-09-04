"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { ProjectCard } from "@/components/sub/project-card";
import { PROJECTS } from "@/constants";

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Heading drifts a little faster than the card grid beneath it.
  const headingY = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["14px", "-14px"]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4"
    >
      <motion.div style={{ y: headingY }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] py-8 sm:py-12 lg:py-20 text-center"
        >
          My latest Roles
        </motion.h1>
      </motion.div>

      <motion.div
        style={{ y: gridY }}
        className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8"
      >
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.title}
            src={project.image}
            title={project.title}
            description={project.description}
            link={project.link}
            index={i}
          />
        ))}
      </motion.div>

      <Link
        href="/experience"
        className="button-primary mt-10 sm:mt-14 py-2 px-6 rounded-lg text-center text-white cursor-pointer transition"
      >
        View all experience →
      </Link>
    </section>
  );
};
