"use client";

import { motion } from "framer-motion";

export const SunVisual = () => {
  return (
    <div className="relative w-[240px] h-[240px] sm:w-[360px] sm:h-[360px]">
      {/* wide soft corona bloom */}
      <motion.div
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-60%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,183,94,0.55) 0%, rgba(255,138,66,0.28) 32%, rgba(255,100,48,0.12) 52%, transparent 72%)",
          filter: "blur(22px)",
        }}
      />

      {/* slow-drifting glow, no hard rays — avoids the flat "sun icon" look */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-35%] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,205,130,0.22), rgba(255,205,130,0.05) 20%, rgba(255,205,130,0.2) 40%, rgba(255,205,130,0.05) 60%, rgba(255,205,130,0.22) 80%, rgba(255,205,130,0.05) 100%)",
          filter: "blur(30px)",
        }}
      />

      {/* core disc with limb-darkened gradient for a photographic falloff */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ filter: "blur(0.6px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 42% 38%, #fffdf5 0%, #fff2c9 8%, #ffe49e 16%, #ffd177 26%, #ffb85e 38%, #fc9c4c 50%, #f17f3f 62%, #e0642f 74%, #c34d24 86%, #9c3a1c 100%)",
          }}
        />
        {/* subtle mottled surface texture (granulation), pure CSS, no exotic filters */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(circle at 25% 65%, rgba(120,30,10,0.5) 0%, transparent 22%), radial-gradient(circle at 70% 25%, rgba(255,255,255,0.35) 0%, transparent 18%), radial-gradient(circle at 60% 75%, rgba(120,30,10,0.4) 0%, transparent 20%), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 16%)",
          }}
        />
        {/* hot-spot shimmer */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 42% 38%, rgba(255,255,255,0.55) 0%, transparent 26%)",
          }}
        />
        {/* rim darkening for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "inset 0 0 46px 20px rgba(110,35,10,0.4)",
          }}
        />
      </div>
    </div>
  );
};
