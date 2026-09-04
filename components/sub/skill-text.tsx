"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export const SkillText = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="Welcome-box py-[8px] px-[7px] border border-[var(--accent-border)] opacity-90"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">
          Think better with Next.js 14
        </h1>
      </motion.div>

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-xl sm:text-2xl lg:text-[30px] text-white font-medium mt-[10px] text-center mb-[15px] max-w-3xl px-4"
      >
       Embracing complexity to deliver simplicity and excellence with modern technologies.
      </motion.div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="cursive text-lg sm:text-xl lg:text-[25px] text-gray-200 mb-10 mt-[10px] text-center px-4"
      >
        Think Beyond task, Never miss goal.
      </motion.div>
    </div>
  );
};
