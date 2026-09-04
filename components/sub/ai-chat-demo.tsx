"use client";

import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";
import { useInView } from "react-intersection-observer";

type ChatMessage = {
  from: "user" | "ai";
  text: string;
};

const MESSAGES: ChatMessage[] = [
  { from: "user", text: "Can AI actually help grow my business?" },
  {
    from: "ai",
    text: "Yes — I build AI agents that automate support, drafting and data workflows, so your team spends less time on busywork and more on revenue.",
  },
  { from: "user", text: "How fast can we launch something like that?" },
  {
    from: "ai",
    text: "Typically 2–4 weeks from scope to a production integration with the tools you already use.",
  },
];

// A decorative, pre-scripted chat mockup (not a live/backend-connected
// chatbot) that demonstrates, visually, what an AI assistant integration
// could look like for a client's business.
export const AiChatDemo = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  return (
    <div
      ref={ref}
      className="w-full flex flex-col items-stretch overflow-hidden rounded-2xl border border-[var(--accent-border)] bg-[#0300147a] backdrop-blur-md shadow-lg shadow-[var(--accent-shadow)]"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--accent-border)]">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-[var(--accent-solid)]">
          <BsRobot className="w-4 h-4" />
        </span>
        <span className="text-sm font-medium text-gray-200">AI Assistant</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          online
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">
        {MESSAGES.map((message, index) => (
          <motion.div
            key={`${message.from}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 + index * 0.35, duration: 0.4 }}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug ${
              message.from === "ai"
                ? "self-start bg-white/10 text-gray-200"
                : "self-end bg-white/15 text-gray-100"
            }`}
          >
            {message.text}
          </motion.div>
        ))}
      </div>

      <div className="px-4 pb-4 text-[11px] text-gray-500 italic">
        Demo conversation — illustrating how an AI assistant like this could
        work for your business.
      </div>
    </div>
  );
};
