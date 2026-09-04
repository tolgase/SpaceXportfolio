import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import { Footer } from "@/components/main/footer";
import { GlassRefractionFilters } from "@/components/main/glass-refraction-filters";
import { Navbar } from "@/components/main/navbar";
import { ScrollCompanion } from "@/components/main/scroll-companion";
import { ScrollProgress } from "@/components/main/scroll-progress";
import { StarsCanvas } from "@/components/main/star-background";
import { WhatsAppButton } from "@/components/main/whatsapp-button";
import { siteConfig } from "@/config";
import { HeroThemeProvider } from "@/lib/hero-theme-context";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-[#030014] overflow-y-scroll overflow-x-hidden",
          inter.className
        )}
      >
        <HeroThemeProvider>
          <GlassRefractionFilters />
          <StarsCanvas />
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <ScrollCompanion />
        </HeroThemeProvider>
      </body>
    </html>
  );
}
