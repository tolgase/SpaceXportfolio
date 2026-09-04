"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

import { WHATSAPP_NUMBER } from "@/constants";

export const WhatsAppButton = () => {
  if (!WHATSAPP_NUMBER) {
    return null;
  }

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Haroun, I found your portfolio and would like to get in touch."
  )}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/40"
    >
      <FaWhatsapp className="h-7 w-7 text-white" />
    </motion.a>
  );
};
