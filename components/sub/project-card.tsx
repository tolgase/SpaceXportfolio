"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  index?: number;
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
  index = 0,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.12 }}
      className="h-full"
    >
      <Link
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        className="group relative flex flex-col overflow-hidden rounded-lg shadow-lg border border-[var(--accent-border-solid)] bg-[#0300147a] h-full cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-solid)]"
      >
        <Image
          src={src}
          alt={title}
          width={1000}
          height={1000}
          className="w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="relative p-5 sm:p-8 flex flex-col flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 line-clamp-6">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
