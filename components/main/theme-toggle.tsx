"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

import { useHeroTheme } from "@/lib/hero-theme-context";

export const ThemeToggle = () => {
  const { mode, toggle } = useHeroTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "night" ? "Switch to day mode" : "Switch to night mode"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--accent-border)] text-white hover:bg-white/10 transition cursor-pointer shrink-0"
    >
      {mode === "night" ? (
        <SunIcon className="h-5 w-5 text-amber-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-indigo-200" />
      )}
    </button>
  );
};
