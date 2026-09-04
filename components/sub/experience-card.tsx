"use client";

import { motion } from "framer-motion";

import type { ExperienceEntry } from "@/constants";

type ExperienceCardProps = {
  entry: ExperienceEntry;
  index?: number;
};

export const ExperienceCard = ({ entry, index = 0 }: ExperienceCardProps) => {
  return (
    <motion.div
      id={entry.slug}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08 }}
      className="scroll-mt-28 flex flex-col gap-3 rounded-xl border border-[var(--accent-border)] bg-white/5 backdrop-blur-sm p-5 sm:p-6 h-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-100">
          {entry.role}
        </h3>
        <span className="text-xs sm:text-sm text-[var(--accent-solid)] font-medium whitespace-nowrap">
          {entry.period}
        </span>
      </div>

      <p className="text-sm text-gray-300">
        {entry.company}
        {entry.location ? ` — ${entry.location}` : ""}
      </p>

      <ul className="flex flex-col gap-1.5">
        {entry.highlights.map((highlight) => (
          <li
            key={highlight}
            className="text-sm text-gray-400 leading-snug before:content-['—_'] before:text-[var(--accent-solid)]"
          >
            {highlight}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {entry.stack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] sm:text-[11px] rounded-full border border-[var(--accent-border)] px-2.5 py-1 text-gray-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
