import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WHATSAPP_NUMBER } from "@/constants";
import { getAllExperienceSlugs, getExperienceDetail } from "@/lib/experience";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllExperienceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const detail = getExperienceDetail(params.slug);
  if (!detail) {
    return { title: "Experience | Haroun Bayoudh" };
  }
  return {
    title: `${detail.heading} | Haroun Bayoudh`,
    description: `${detail.subheading} — ${detail.heading}. ${detail.highlights[0] ?? ""}`,
  };
}

export default function ExperienceDetailPage({ params }: PageProps) {
  const detail = getExperienceDetail(params.slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className="w-full pt-[130px] sm:pt-[150px] pb-24 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="py-2 px-4 rounded-lg text-center text-sm text-gray-200 border border-[var(--accent-border)] cursor-pointer transition hover:-translate-y-0.5"
          >
            ← Back to home
          </Link>
          <Link
            href="/experience"
            className="py-2 px-4 rounded-lg text-center text-sm text-gray-200 border border-[var(--accent-border)] cursor-pointer transition hover:-translate-y-0.5"
          >
            View full experience
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="Welcome-box px-[15px] py-[4px] border border-[var(--accent-border)] opacity-90 w-fit">
            <span className="text-xs sm:text-sm text-gray-200">
              {detail.kind}
            </span>
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium text-gray-200">
            {detail.heading}
          </h1>
          <p className="text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] font-medium">
            {detail.subheading}
          </p>
          <p className="text-sm text-gray-400">{detail.meta}</p>
        </div>

        <ul className="flex flex-col gap-3">
          {detail.highlights.map((highlight) => (
            <li
              key={highlight}
              className="text-sm sm:text-base text-gray-300 leading-relaxed before:content-['—_'] before:text-[var(--accent-solid)]"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {detail.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs rounded-full border border-[var(--accent-border)] px-3 py-1.5 text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hi Haroun, I saw your ${detail.heading} experience and would like to discuss a similar project.`
            )}`}
            target="_blank"
            rel="noreferrer noopener"
            className="button-primary mt-4 py-2 px-6 rounded-lg text-center text-white cursor-pointer transition w-fit"
          >
            Discuss a similar project
          </a>
        )}
      </div>
    </main>
  );
}
