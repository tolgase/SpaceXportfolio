import type { Metadata } from "next";

// Canonical deployed URL — used for metadata (sitemap.xml, robots.txt, and
// any absolute links Next.js needs to generate) rather than hardcoding the
// domain in multiple files.
export const SITE_URL = "https://spaceportfolio.netlify.app";

export const siteConfig: Metadata = {
  title: "Haroun Bayoudh | Senior Full Stack Developer (PHP, React, AI)",
  description:
    "Portfolio of Haroun Bayoudh, a senior full-stack developer with 12+ years building eCommerce platforms, custom CMS solutions, and AI-integrated products with PHP, Laravel, Symfony, and React.",
  keywords: [
    "reactjs",
    "nextjs",
    "vercel",
    "react",
    "space-portfolio",
    "portfolio",
    "react-icons",
    "cn",
    "clsx",
    "3d-portfolio",
    "3d-website",
    "sonner",
    "framer-motion",
    "motion",
    "animation",
    "heroicons",
    "next-themes",
    "postcss",
    "prettier",
    "react-dom",
    "tailwindcss",
    "tailwindcss-animate",
    "ui/ux",
    "js",
    "javascript",
    "typescript",
    "eslint",
    "html",
    "css",
  ] as Array<string>,
  authors: {
    name: "Haroun Bayoudh",
    url: "https://github.com/tolgase",
  },
} as const;
