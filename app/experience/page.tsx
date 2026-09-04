import type { Metadata } from "next";
import Link from "next/link";

import { ExperienceCard } from "@/components/sub/experience-card";
import {
  CREDENTIALS,
  CV_FILE_PATH,
  EMPLOYERS,
  FLAGSHIP_PRODUCT,
  PROXIFY_ENGAGEMENTS,
} from "@/constants";

export const metadata: Metadata = {
  title: "Experience | Haroun Bayoudh",
  description:
    "Full work history: employers, the Sonix.tn AI SaaS, and 25+ Proxify client engagements across eCommerce, PHP and AI.",
};

export default function ExperiencePage() {
  return (
    <main className="w-full pt-[110px] sm:pt-[130px] pb-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-16 sm:gap-20">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="Welcome-box px-[15px] py-[4px] border border-[var(--accent-border)] opacity-90">
            <span className="text-xs sm:text-sm text-gray-200">
              Full Work History
            </span>
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium text-gray-200">
            12+ years, one{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
              flagship product
            </span>
            , and 25+ client engagements.
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-gray-400">
            Every employer, and a selection of the Proxify client engagements
            behind the highlights on the homepage — straight from my CV.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/"
              className="py-2 px-5 rounded-lg text-center text-sm text-gray-200 border border-[var(--accent-border)] cursor-pointer transition hover:-translate-y-0.5"
            >
              ← Back to home
            </Link>
            <a
              href={CV_FILE_PATH}
              target="_blank"
              rel="noreferrer noopener"
              className="button-primary py-2 px-5 rounded-lg text-center text-sm text-white cursor-pointer transition"
            >
              Download CV
            </a>
          </div>
        </div>

        {/* Flagship product */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
            Flagship product
          </h2>
          <div
            id={FLAGSHIP_PRODUCT.slug}
            className="scroll-mt-28 flex flex-col gap-3 rounded-xl border border-[var(--accent-border)] bg-white/5 backdrop-blur-sm p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">
                {FLAGSHIP_PRODUCT.name} — {FLAGSHIP_PRODUCT.role}
              </h3>
              <span className="text-xs sm:text-sm text-[var(--accent-solid)] font-medium whitespace-nowrap">
                {FLAGSHIP_PRODUCT.category}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {FLAGSHIP_PRODUCT.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="text-sm text-gray-300 leading-snug before:content-['—_'] before:text-[var(--accent-solid)]"
                >
                  {highlight}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              {FLAGSHIP_PRODUCT.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] sm:text-[11px] rounded-full border border-[var(--accent-border)] px-2.5 py-1 text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Employers */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
            Employers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {EMPLOYERS.map((entry, index) => (
              <ExperienceCard key={entry.slug} entry={entry} index={index} />
            ))}
          </div>
        </section>

        {/* Proxify client engagements */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
              Proxify client engagements
            </h2>
            <p className="text-sm text-gray-400">
              Selected from 25+ engagements, 2022 – 2024.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {PROXIFY_ENGAGEMENTS.map((entry, index) => (
              <ExperienceCard key={entry.slug} entry={entry} index={index} />
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
            Credentials &amp; languages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-border)] bg-white/5 backdrop-blur-sm p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-200">Degree</h3>
              <p className="text-sm text-gray-400">{CREDENTIALS.degree}</p>
              <h3 className="text-sm font-semibold text-gray-200 mt-2">
                Certifications
              </h3>
              <ul className="flex flex-col gap-1.5">
                {CREDENTIALS.certifications.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-gray-400 leading-snug before:content-['—_'] before:text-[var(--accent-solid)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent-border)] bg-white/5 backdrop-blur-sm p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-200">
                Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {CREDENTIALS.strengths.map((item) => (
                  <span
                    key={item}
                    className="Welcome-box px-3 py-1.5 text-xs text-gray-200 border border-[var(--accent-border)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <h3 className="text-sm font-semibold text-gray-200 mt-2">
                Languages
              </h3>
              <ul className="flex flex-col gap-1.5">
                {CREDENTIALS.languages.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-gray-400 leading-snug before:content-['—_'] before:text-[var(--accent-solid)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
