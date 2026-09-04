"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useInView } from "react-intersection-observer";

import { WHATSAPP_NUMBER } from "@/constants";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm a small AI assistant trained on Haroun's background. Ask me how AI/automation could help your business — you get 3 free messages.",
};

const FREE_MESSAGE_LIMIT = 3;
const USAGE_STORAGE_KEY = "ai_chat_uses_used";
const MAX_INPUT_LENGTH = 500;

const SUGGESTED_QUESTIONS = [
  "What's Haroun's experience with Shopify & PrestaShop?",
  "Tell me about Sonix.tn",
  "Can he help automate my business with AI?",
  "What's his experience with PHP and Laravel?",
] as const;

const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hi Haroun, I chatted with your AI assistant and would like to talk about my project."
    )}`
  : undefined;

// A real, backend-connected chat widget (calls /api/chat, which holds the
// Mistral API key server-side). Limited to a handful of free messages per
// browser session (tracked in sessionStorage — a soft cap for a portfolio
// demo, not a hard security boundary), after which it points visitors to
// contact Haroun directly instead of continuing the conversation.
export const AiChatWidget = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [usesUsed, setUsesUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = Number(window.sessionStorage.getItem(USAGE_STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      setUsesUsed(Math.min(stored, FREE_MESSAGE_LIMIT));
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isLoading]);

  const limitReached = usesUsed >= FREE_MESSAGE_LIMIT;

  const handleSend = async (override?: string) => {
    const trimmed = (override ?? input).trim();
    if (!trimmed || isLoading || limitReached) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok || !data.reply) {
        setError(data.error || "The AI assistant is temporarily unavailable.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        const updatedUses = usesUsed + 1;
        setUsesUsed(updatedUses);
        window.sessionStorage.setItem(USAGE_STORAGE_KEY, String(updatedUses));
      }
    } catch {
      setError("Couldn't reach the AI assistant — check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      data-ai-chat-card
      className="liquid-glass chat-widget-glow w-full flex flex-col items-stretch overflow-hidden rounded-2xl"
    >
      <div className="relative z-[5] flex items-center gap-2 px-4 py-3 border-b border-[var(--accent-border)]">
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-[var(--accent-solid)]"
        >
          <BsRobot className="w-4 h-4" />
        </motion.span>
        <span className="text-sm font-medium text-gray-200">AI Assistant</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          online
        </span>
      </div>

      <div
        ref={scrollRef}
        className="relative z-[5] flex flex-col gap-3 px-4 py-4 max-h-80 overflow-y-auto scrollbar-hidden"
      >
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={inView || index > 0 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index === 0 ? 0.25 : 0, duration: 0.35 }}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug whitespace-pre-wrap ${
              message.role === "assistant"
                ? "self-start bg-white/10 text-gray-200"
                : "self-end bg-white/15 text-gray-100"
            }`}
          >
            {message.content}
          </motion.div>
        ))}

        {isLoading && (
          <div className="self-start rounded-2xl px-3 py-2 text-sm bg-white/10 text-gray-400">
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
            </span>
          </div>
        )}

        {error && (
          <div className="self-start rounded-2xl px-3 py-2 text-sm bg-red-500/10 text-red-300">
            {error}
          </div>
        )}
      </div>

      {!limitReached && messages.length === 1 && !isLoading && (
        <div className="relative z-[5] flex flex-wrap gap-2 px-4 pb-3">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleSend(question)}
              className="rounded-full border border-[var(--accent-border)] bg-white/5 px-3 py-1.5 text-[11px] text-gray-300 transition hover:text-gray-100 hover:border-[var(--accent-solid)]"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      <div className="relative z-[5] px-4 pb-4">
        {limitReached ? (
          <div className="flex flex-col gap-2 text-center">
            <p className="text-xs text-gray-400">
              You&apos;ve used your {FREE_MESSAGE_LIMIT} free messages for this demo.
            </p>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="button-primary py-2 px-4 rounded-lg text-center text-sm text-white cursor-pointer transition"
              >
                Continue on WhatsApp
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              data-ai-chat-input
              value={input}
              maxLength={MAX_INPUT_LENGTH}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Ask about AI for your business..."
              disabled={isLoading}
              className="flex-1 min-w-0 rounded-full border border-[var(--accent-border)] bg-white/5 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-[var(--accent-solid)] transition disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-solid)] text-white shrink-0 disabled:opacity-40 transition hover:opacity-90"
            >
              <IoSend className="w-4 h-4" />
            </button>
          </div>
        )}
        {!limitReached && (
          <p className="mt-2 text-[10px] text-gray-500 text-center">
            {FREE_MESSAGE_LIMIT - usesUsed} free message
            {FREE_MESSAGE_LIMIT - usesUsed === 1 ? "" : "s"} left in this demo · or{" "}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[var(--accent-solid)] hover:underline"
              >
                message Haroun directly
              </a>
            ) : (
              "contact Haroun directly"
            )}
            .
          </p>
        )}
      </div>
    </div>
  );
};
