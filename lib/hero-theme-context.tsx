"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type HeroMode = "night" | "day";

const HeroThemeContext = createContext<{
  mode: HeroMode;
  toggle: () => void;
} | null>(null);

export const HeroThemeProvider = ({ children }: PropsWithChildren) => {
  // Always starts on the black-hole (night) visual by default, every load —
  // no persisted preference across sessions.
  const [mode, setMode] = useState<HeroMode>("night");

  const toggle = () => {
    setMode((prev) => (prev === "night" ? "day" : "night"));
  };

  // Mirror the mode onto <html data-theme="..."> so globals.css can re-skin
  // every section's accent colors (navbar, scroll bar, gradients, borders)
  // to a warm palette in day mode without prop-drilling into every component.
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return (
    <HeroThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </HeroThemeContext.Provider>
  );
};

export const useHeroTheme = () => {
  const ctx = useContext(HeroThemeContext);
  if (!ctx) {
    throw new Error("useHeroTheme must be used within HeroThemeProvider");
  }
  return ctx;
};
