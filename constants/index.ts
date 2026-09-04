import { FaYoutube, FaFacebook } from "react-icons/fa";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

export const SKILL_DATA = [
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    image: "redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Query",
    image: "reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js 14",
    image: "next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "WordPress",
    image: "framer.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Stripe",
    image: "stripe.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
] as const;

export const SOCIALS = [
  {
    name: "GitHub",
    icon: RxGithubLogo,
    link: "https://github.com/tolgase",
  },
  {
    name: "LinkedIn",
    icon: RxLinkedinLogo,
    link: "https://www.linkedin.com/in/haroun-bayoudh-9a1a10209/",
  },
  {
    name: "Instagram",
    icon: RxInstagramLogo,
    link: "https://www.instagram.com/starckaxel/",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    link: "https://facebook.com",
  },
  {
    name: "Twitter",
    icon: RxTwitterLogo,
    link: "https://twitter.com",
  },
] as const;

export const WHATSAPP_NUMBER = "21651873655";

export const CV_FILE_PATH = "/cv/Haroun-Bayoudh-CV.pdf";

export const FRONTEND_SKILL = [
  {
    skill_name: "HTML",
    image: "html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    image: "css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    image: "js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "Tailwind CSS",
    image: "tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "PHP",
    image: "mui.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    image: "react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    image: "redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Query",
    image: "reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TypeScript",
    image: "ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js 14",
    image: "next.png",
    width: 80,
    height: 80,
  },
] as const;

export const BACKEND_SKILL = [
  {
    skill_name: "Node.js",
    image: "node.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express.js",
    image: "express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    image: "mongodb.png",
    width: 40,
    height: 40,
  },
  {
    skill_name: "Firebase",
    image: "firebase.png",
    width: 55,
    height: 55,
  },
  {
    skill_name: "PostgreSQL",
    image: "postgresql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MySQL",
    image: "mysql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Magento",
    image: "prisma.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Graphql",
    image: "graphql.png",
    width: 80,
    height: 80,
  },
] as const;

export const FULLSTACK_SKILL = [
  {
    skill_name: "Storybook",
    image: "reactnative.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Tauri",
    image: "tauri.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Docker",
    image: "docker.png",
    width: 70,
    height: 70,
  },

  {
    skill_name: "Figma",
    image: "figma.png",
    width: 50,
    height: 50,
  },
] as const;

export const OTHER_SKILL = [
  {
    skill_name: "Go",
    image: "go.png",
    width: 60,
    height: 60,
  },
] as const;

// Homepage highlights — a curated slice of the full work history below.
// Internal links point into the /experience page's matching section;
// external links are used only where a live client URL is confirmed.
export const PROJECTS = [
  {
    title: "Sonix.tn — Founder & Lead Engineer",
    description:
      "AI-powered email SaaS I designed and built end to end: an AI interface for drafting, summarising, classifying and generating smart replies, with the underlying models integrated, fine-tuned and trained myself.",
    image: "/projects/project-2.png",
    link: "/experience/sonix",
  },
  {
    title: "Ibindo GmbH — Senior Backend Engineer",
    description:
      "Reengineered a slot management and booking system with real-time ERP synchronisation for real estate and travel partners — custom APIs for availability and bookings, built for scalability and reliability.",
    image: "/projects/project-1.png",
    link: "https://www.ibindo.at",
  },
  {
    title: "Proxify — Senior Full-Stack Developer",
    description:
      "Delivering eCommerce and full-stack solutions to European clients through Proxify's vetted developer network since 2021 — 25+ projects across Shopify, Shopware, PrestaShop, Magento and WordPress.",
    image: "/projects/project-3.png",
    link: "/experience/proxify",
  },
  {
    title: "ChicLafre GmbH — MERN, AWS & Three.js",
    description:
      "Led a customised MERN-stack web application for a Hamburg-based printing company, then migrated it to AWS and built CRM shops with bespoke printing capabilities via custom plugins and modules.",
    image: "/projects/project-1.png",
    link: "/experience/chiclafre-gmbh",
  },
  {
    title: "Outils OBD Facile — Architect / Lead E-commerce Dev",
    description:
      "Architected a PHP 8 / Symfony multi-store platform with integrated payments as part of a 2023–24 Proxify client engagement.",
    image: "/projects/project-2.png",
    link: "/experience/outils-obd-facile",
  },
] as const;

// Full work history, sourced from Haroun's CV, powering the /experience page.
export type ExperienceEntry = {
  slug: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  stack: readonly string[];
  highlights: readonly string[];
};

export const FLAGSHIP_PRODUCT = {
  slug: "sonix",
  name: "Sonix.tn",
  role: "Founder & Lead Engineer",
  category: "SaaS · AI Email",
  stack: ["AI / LLM", "Fine-Tuning", "PHP / Laravel", "React", "REST API"],
  highlights: [
    "Designed and built a SaaS mail application centred on an advanced AI interface — AI-assisted drafting, summarisation, classification and smart replies.",
    "Architected the platform end to end and integrated, fine-tuned and trained AI models to power the email workflows.",
  ],
} as const;

// Employers, most recent first.
export const EMPLOYERS: ExperienceEntry[] = [
  {
    slug: "proxify",
    role: "Senior Full-Stack Developer",
    company: "Proxify — vetted developer network",
    period: "2021 — Present",
    location: "Remote · European clients",
    stack: ["PHP / Laravel", "React", "eCommerce", "AI / LLM"],
    highlights: [
      "Delivering eCommerce and full-stack solutions to European clients through Proxify's vetted network — 25+ client projects to date across Shopify, Shopware, PrestaShop, Magento and WordPress.",
    ],
  },
  {
    slug: "chiclafre-gmbh",
    role: "Web Developer / Designer",
    company: "ChicLafre GmbH / Digital Concept",
    period: "Jan 2020 — Dec 2021",
    location: "Hamburg",
    stack: ["React.js", "Node.js", "AWS", "Magento", "PrestaShop", "Three.js"],
    highlights: [
      "Led, architected and organised delivery of a customised web application on the MERN stack for a Hamburg-based printing company.",
      "After migrating to AWS, developed CRM shops with bespoke printing capabilities via custom plugins, add-ons, modules and apps.",
    ],
  },
  {
    slug: "elite-info",
    role: "Web Developer, Full-Stack",
    company: "Elite Info",
    period: "Jul 2018 — Dec 2019",
    stack: ["PHP", "Laravel", "Symfony", "React.js", "MongoDB", "TypeScript"],
    highlights: [
      "Built custom e-commerce web applications and fulfilment services across multiple client verticals under tight timelines.",
      "Developed advanced back-office dashboards on the MERN stack and PHP (Laravel, Symfony), with AdminLTE / Bootstrap operations UIs.",
    ],
  },
  {
    slug: "al-mokhtar-production",
    role: "Web Developer / Designer",
    company: "AL Mokhtar Production",
    period: "Feb 2015 — May 2018",
    stack: ["PHP", "Laravel", "Symfony", "WordPress", "WooCommerce", "PrestaShop"],
    highlights: [
      "Customised e-commerce CMS, CRM, plugins and themes across PHP platforms; built APIs across Laravel, Symfony and React.js, and delivered tailored WooCommerce / PrestaShop storefronts for client brands.",
    ],
  },
];

// Selected Proxify client engagements, 2022–2024 (from 25+ total).
export const PROXIFY_ENGAGEMENTS: ExperienceEntry[] = [
  {
    slug: "ibindo-gmbh",
    role: "Senior Backend Engineer",
    company: "Ibindo GmbH",
    period: "2024",
    stack: ["PHP", "REST API", "Enterprise Arch"],
    highlights: ["ERP integration & slot-based booking system."],
  },
  {
    slug: "outils-obd-facile",
    role: "Architect / Lead E-commerce Dev",
    company: "Outils OBD Facile",
    period: "2023–24",
    stack: ["PHP 8", "Symfony"],
    highlights: ["PHP 8, payments & multi-store architecture."],
  },
  {
    slug: "niu-nature-gmbh",
    role: "Shopify Theme Developer",
    company: "NIU Nature GmbH",
    period: "2023",
    stack: ["Shopify", "Shopware"],
    highlights: ["Custom theme, brand & performance work."],
  },
  {
    slug: "creative-cables-bv",
    role: "E-commerce Solutions Developer",
    company: "Creative Cables BV",
    period: "2023",
    stack: ["PHP", "Symfony", "PrestaShop"],
    highlights: ["PrestaShop modules & ERP integration."],
  },
  {
    slug: "second-group-bv",
    role: "WordPress Community Developer",
    company: "Second Group BV",
    period: "2023",
    stack: ["PHP", "WordPress", "WooCommerce"],
    highlights: ["Membership community platforms."],
  },
  {
    slug: "lart-sucre-gmbh",
    role: "Shopify App Developer",
    company: "L'Art Sucré GmbH",
    period: "2023",
    stack: ["JavaScript", "Node", "Shopify"],
    highlights: ["Custom app & checkout flows."],
  },
  {
    slug: "mynthuset-as",
    role: "E-commerce Development Manager",
    company: "Mynthuset A/S",
    period: "2022–23",
    stack: ["PHP", "Symfony", "PrestaShop"],
    highlights: ["PrestaShop 8 migration & performance."],
  },
  {
    slug: "babytuch-hv-gmbh",
    role: "Software Engineer",
    company: "Babytuch H&V GmbH",
    period: "2022–23",
    stack: ["TypeScript", "Shopware"],
    highlights: ["Shopware backend, stock & payments."],
  },
  {
    slug: "printsmarter-gmbh",
    role: "E-commerce Solutions Developer",
    company: "PrintSmarter GmbH",
    period: "2022",
    stack: ["PHP", "WordPress", "Shopify"],
    highlights: ["Print-on-demand app & integrations."],
  },
  {
    slug: "los-volcanes-kaffe",
    role: "Lead PrestaShop Developer",
    company: "Los Volcanes Kaffe",
    period: "2022",
    stack: ["PHP", "MySQL", "Docker"],
    highlights: ["ERP sync, Docker & CI/CD."],
  },
  {
    slug: "kristranslation",
    role: "Web Developer / Designer",
    company: "KrisTranslation",
    period: "2022",
    stack: ["PHP", "JS", "WooCommerce"],
    highlights: ["WordPress → WooCommerce platform migration."],
  },
  {
    slug: "mundo-digitalis",
    role: "Shopify Expert",
    company: "Mundo Digitalis",
    period: "2022",
    stack: ["JavaScript", "Shopify"],
    highlights: ["Theme refactors across client stores."],
  },
  {
    slug: "arms",
    role: "PrestaShop Developer",
    company: "ARMS",
    period: "2022",
    stack: ["PHP", "Symfony", "PrestaShop"],
    highlights: ["Debugging, module optimisation & features."],
  },
];

export const CREDENTIALS = {
  degree:
    "BSc — Licence en Technologies de l'Informatique, Computer Science (2011–2015)",
  certifications: [
    "Google IT Automation with Python (2024)",
    "AWS Modern App Development, Node.js (2022)",
    "AWS DevOps on AWS (2022)",
    "Google IT Support (2021)",
    "Google Project Management (2020)",
  ],
  strengths: [
    "Client communication",
    "Team leadership",
    "Remote & async collaboration",
    "Ownership",
    "Adaptability",
  ],
  languages: [
    "Arabic — Native",
    "French — Fluent",
    "English — Professional",
    "German — B1",
  ],
} as const;

export const FOOTER_DATA = [
  {
    title: "Community",
    data: [
      {
        name: "YouTube",
        icon: FaYoutube,
        link: "https://youtube.com",
      },
      {
        name: "GitHub",
        icon: RxGithubLogo,
        link: "https://github.com/tolgase",
      },
      {
        name: "Discord",
        icon: RxDiscordLogo,
        link: "https://discord.com",
      },
    ],
  },
  {
    title: "Social Media",
    data: [
      {
        name: "Instagram",
        icon: RxInstagramLogo,
        link: "https://www.instagram.com/starckaxel/",
      },
      {
        name: "Twitter",
        icon: RxTwitterLogo,
        link: "https://x.com/Aaronbayou1140",
      },
      {
        name: "Linkedin",
        icon: RxLinkedinLogo,
        link: "https://www.linkedin.com/in/haroun-bayoudh-9a1a10209/",
      },
    ],
  },
  {
    title: "About",
    data: [
      {
        name: "Hire Me",
        icon: null,
        link: `https://wa.me/${WHATSAPP_NUMBER}`,
      },
      {
        name: "Learning about me",
        icon: null,
        link: "/#about-me",
      },
      {
        name: "Contact Me",
        icon: null,
        link: "mailto:Harounsouper@live.fr",
      },
    ],
  },
] as const;

// Bare "/#anchor" hrefs (rather than "#anchor") so these links work from
// every page, not just the homepage — clicking them from /experience, for
// example, navigates home and then scrolls to the section.
export const NAV_LINKS = [
  {
    title: "About me",
    link: "/#about-me",
  },
  {
    title: "Skills",
    link: "/#skills",
  },
  {
    title: "Projects",
    link: "/#projects",
  },
  {
    title: "Experience",
    link: "/experience",
  },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/tolgase",
};
