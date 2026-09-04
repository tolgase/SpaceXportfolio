import {
  EMPLOYERS,
  FLAGSHIP_PRODUCT,
  PROXIFY_ENGAGEMENTS,
  type ExperienceEntry,
} from "@/constants";

export type ExperienceDetail = {
  slug: string;
  kind: "Flagship Product" | "Employer" | "Proxify Client Engagement";
  heading: string;
  subheading: string;
  meta: string;
  stack: readonly string[];
  highlights: readonly string[];
};

// Single lookup across every source of real CV data, so each homepage
// highlight and every /experience card can deep-link to its own page.
export function getExperienceDetail(slug: string): ExperienceDetail | null {
  if (slug === FLAGSHIP_PRODUCT.slug) {
    return {
      slug,
      kind: "Flagship Product",
      heading: FLAGSHIP_PRODUCT.name,
      subheading: FLAGSHIP_PRODUCT.role,
      meta: FLAGSHIP_PRODUCT.category,
      stack: FLAGSHIP_PRODUCT.stack,
      highlights: FLAGSHIP_PRODUCT.highlights,
    };
  }

  const employer = EMPLOYERS.find((entry) => entry.slug === slug);
  if (employer) {
    return toDetail(employer, "Employer");
  }

  const engagement = PROXIFY_ENGAGEMENTS.find((entry) => entry.slug === slug);
  if (engagement) {
    return toDetail(engagement, "Proxify Client Engagement");
  }

  return null;
}

function toDetail(
  entry: ExperienceEntry,
  kind: "Employer" | "Proxify Client Engagement"
): ExperienceDetail {
  return {
    slug: entry.slug,
    kind,
    heading: entry.company,
    subheading: entry.role,
    meta: entry.location ? `${entry.period} · ${entry.location}` : entry.period,
    stack: entry.stack,
    highlights: entry.highlights,
  };
}

export function getAllExperienceSlugs(): string[] {
  return [
    FLAGSHIP_PRODUCT.slug,
    ...EMPLOYERS.map((entry) => entry.slug),
    ...PROXIFY_ENGAGEMENTS.map((entry) => entry.slug),
  ];
}
