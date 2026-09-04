"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import { CV_FILE_PATH } from "@/constants";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 lg:px-20 pt-32 sm:pt-36 lg:pt-40 pb-16 w-full z-[20] gap-10 lg:gap-4"
    >
      <div className="w-full flex flex-col gap-5 justify-center items-center lg:items-start text-center lg:text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[var(--accent-border)] opacity-90"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5 shrink-0" />
          <h1 className="Welcome-text text-[13px]">
            Fullstack Developer Portfolio
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-4xl sm:text-5xl lg:text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Turning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
              Visions
            </span>{" "}
            into magnificent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
              realities.
            </span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base sm:text-lg text-gray-200 sm:text-gray-300 my-5 max-w-[600px] [text-shadow:0_2px_14px_rgba(0,0,0,0.9)]"
        >
          I&rsquo;m{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
            Haroun Bayoudh
          </span>
          , a seasoned Full Stack Software Engineer with expertise in
          developing dynamic websites, integrating CMS platforms, building
          SaaS solutions, and streamlining ERP systems. My projects reflect a
          commitment to innovation, precision, and delivering top-tier
          solutions. Explore my portfolio to see the skills that set me
          apart.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <a
            href="#projects"
            className="py-2 button-primary text-center text-white cursor-pointer rounded-lg w-full sm:w-auto sm:min-w-[200px] sm:max-w-[200px] px-6"
          >
            Learn more
          </a>
          <a
            href={CV_FILE_PATH}
            download
            className="py-2 text-center text-white cursor-pointer rounded-lg w-full sm:w-auto sm:min-w-[200px] sm:max-w-[200px] px-6 border border-[var(--accent-border)] hover:bg-white/5 transition"
          >
            Download CV
          </a>
        </motion.div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full flex justify-center items-center"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={650}
          width={650}
          draggable={false}
          className="select-none w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px]"
        />
      </motion.div>
    </motion.div>
  );
};
