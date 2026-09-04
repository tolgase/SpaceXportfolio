"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/main/theme-toggle";
import { LINKS, NAV_LINKS, SOCIALS } from "@/constants";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[84px] fixed top-0 shadow-lg shadow-[var(--accent-shadow)] bg-[var(--navbar-bg)] backdrop-blur-md z-50 px-4 sm:px-6 lg:px-10">
      <div className="w-full h-full flex flex-row items-center justify-between max-w-7xl m-auto">
        <Link
          href="/"
          className="h-auto w-auto flex flex-row items-center shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            draggable={false}
            className="cursor-pointer hover:animate-slowspin w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] lg:w-[64px] lg:h-[64px]"
          />
          <div className="font-bold ml-[10px] hidden md:block text-gray-300">
            Haroun Bayoudh
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex flex-row items-center justify-between flex-1 max-w-[560px] h-full mx-6">
          <div className="flex items-center justify-between w-full h-auto border-[var(--accent-pill-border)] bg-[var(--accent-pill-bg)] px-[20px] py-[10px] rounded-full text-gray-200">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[var(--accent-solid)] transition whitespace-nowrap"
              >
                {link.title}
              </Link>
            ))}

            {/* source code */}
            <Link
              href={LINKS.sourceCode}
              target="_blank"
              rel="noreferrer noopener"
              className="cursor-pointer hover:text-[var(--accent-solid)] transition whitespace-nowrap"
            >
              Source Code
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-row items-center gap-5">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
              aria-label={name}
              className="cursor-pointer"
            >
              <Icon className="h-6 w-6 text-white" />
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center rounded-full p-2 text-gray-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-solid)]"
          >
            {isOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[84px] left-0 w-full bg-[#030014] border-t border-[var(--accent-border-solid)] shadow-lg shadow-[var(--accent-shadow)] px-6 py-6"
          >
            <div className="flex flex-col gap-5 text-gray-200 text-base">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.title}
                  href={link.link}
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer hover:text-[var(--accent-solid)] transition"
                >
                  {link.title}
                </Link>
              ))}
              <Link
                href={LINKS.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer hover:text-[var(--accent-solid)] transition"
              >
                Source Code
              </Link>
            </div>

            <div className="flex flex-row gap-6 mt-6">
              {SOCIALS.map(({ link, name, icon: Icon }) => (
                <Link
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  key={name}
                  aria-label={name}
                  className="cursor-pointer"
                >
                  <Icon className="h-6 w-6 text-white" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
