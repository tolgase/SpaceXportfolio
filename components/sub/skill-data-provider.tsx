"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { IconType } from "react-icons";
import { useInView } from "react-intersection-observer";

type SkillDataProviderProps = {
  // Either a static logo under /public/skills, or (for brands with no
  // matching PNG) a react-icons/si component — see constants/index.ts.
  src?: string;
  icon?: IconType;
  name: string;
  width: number;
  height: number;
  index: number;
};

export const SkillDataProvider = ({
  src,
  icon: Icon,
  name,
  width,
  height,
  index,
}: SkillDataProviderProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const animationDelay = 0.1;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      variants={imageVariants}
      animate={inView ? "visible" : "hidden"}
      custom={index}
      transition={{ delay: index * animationDelay }}
    >
      {Icon ? (
        <Icon
          role="img"
          aria-label={name}
          className="text-white"
          style={{ width, height }}
        />
      ) : src ? (
        <Image src={`/skills/${src}`} width={width} height={height} alt={name} />
      ) : null}
    </motion.div>
  );
};
