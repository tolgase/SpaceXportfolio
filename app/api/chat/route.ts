import { NextResponse } from "next/server";

// Runs server-side only — the Mistral API key never reaches the browser.
export const runtime = "nodejs";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "mistral-small-latest";

// Hard caps so a single request can't run up an unbounded bill or send an
// oversized payload — independent of the client-side "3 free messages" cap,
// which a user could bypass by clearing storage.
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 800;
const MAX_REPLY_TOKENS = 220;

const SYSTEM_PROMPT = `You are the AI assistant embedded in Haroun Bayoudh's portfolio website. Your job
is to answer any visitor question about Haroun accurately using the facts below, and to make every
visitor feel welcome to reach out to Haroun directly, on any topic.

FACTS ABOUT HAROUN (from his CV — use these, don't invent anything beyond them):
- Senior full-stack software engineer, 12+ years of commercial experience, based in Tunisia, available
  immediately, open to remote and hybrid work, comfortable with EU working hours.
- Core stack: PHP (11y), Laravel, Symfony, Node.js, Express.js, JavaScript (9y), TypeScript, React.js,
  REST APIs, MySQL, MongoDB, Docker, Kubernetes, Three.js.
- eCommerce & CMS: Magento (expert), PrestaShop (expert), Shopify, Shopware, WordPress (expert),
  WooCommerce.
- AI & Machine Learning: AI integration, fine-tuning, model training, AI architecture, LLM/RAG.
- Flagship product: Sonix.tn — Haroun is the founder & lead engineer of this AI-powered email SaaS,
  which he designed, architected, and built end to end, including fine-tuning and training the AI
  models behind its drafting, summarisation, classification and smart-reply features.
- Current role: Senior Full-Stack Developer at Proxify (a vetted developer network for European
  clients), 2021–present, 25+ client projects delivered across Shopify, Shopware, PrestaShop, Magento
  and WordPress. Selected recent Proxify engagements (2022–2024) include Ibindo GmbH (ERP integration
  & slot-based booking, Senior Backend Engineer), Outils OBD Facile (PHP 8/Symfony multi-store
  architecture), NIU Nature GmbH (Shopify theme development), Creative Cables BV, Second Group BV,
  L'Art Sucré GmbH, Mynthuset A/S, Babytuch H&V GmbH, PrintSmarter GmbH, Los Volcanes Kaffe,
  KrisTranslation, Mundo Digitalis, and ARMS.
- Previous roles: Web Developer/Designer at ChicLafre GmbH / Digital Concept, Hamburg (Jan 2020–Dec
  2021, MERN stack, AWS, Magento, PrestaShop, Three.js); Web Developer, Full-Stack at Elite Info (Jul
  2018–Dec 2019, PHP/Laravel/Symfony, React, MongoDB, TypeScript); Web Developer/Designer at AL Mokhtar
  Production (Feb 2015–May 2018, PHP/Laravel/Symfony, WordPress, WooCommerce, PrestaShop).
- Education: BSc in Computer Science (Technologies de l'Informatique), 2011–2015.
- Certifications: Google IT Automation with Python (2024), AWS Modern App Development/Node.js (2022),
  AWS DevOps on AWS (2022), Google IT Support (2021), Google Project Management (2020).
- Languages: Arabic (native), French (fluent), English (professional), German (B1).
- Strengths: client communication, team leadership, remote & async collaboration, ownership,
  adaptability. Track record of meeting tight deadlines and earning excellent client feedback across
  long-running engagements. The full history is on the site's /experience page.

HOW TO ANSWER:
- Answer any question about Haroun's background, skills, experience, education, certifications,
  Sonix.tn, or how he could help a visitor's business (automation, AI integration, eCommerce, custom
  web apps, etc.) using only the facts above. It's fine to reason across them (e.g. "which platforms
  has he worked with" or "does he know Symfony").
- If asked something with no connection to Haroun at all (e.g. general trivia, unrelated coding
  help, current events), politely say that's outside what you can help with here, and steer the
  conversation back to Haroun or his work.
- Don't invent details not listed above — rates, exact availability dates, or personal specifics. If
  asked, say that's best discussed directly with Haroun.
- Keep replies short (2-4 sentences), friendly, and concrete.
- You're a lightweight demo assistant, not a general-purpose chatbot. Whatever the visitor's topic,
  warmly encourage them to contact Haroun directly (via the WhatsApp button on this page) if they want
  to go deeper, discuss a project, or just talk shop — he responds personally.`;

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    (record.role === "user" || record.role === "assistant") &&
    typeof record.content === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI assistant isn't configured yet." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawMessages =
    typeof body === "object" && body !== null && Array.isArray((body as Record<string, unknown>).messages)
      ? ((body as Record<string, unknown>).messages as unknown[])
      : [];

  const sanitized: ChatMessage[] = rawMessages
    .filter(isChatMessage)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== "user") {
    return NextResponse.json({ error: "No user message provided." }, { status: 400 });
  }

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
        max_tokens: MAX_REPLY_TOKENS,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Mistral API error", response.status, errText);
      return NextResponse.json(
        { error: "The AI assistant is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "The AI assistant is temporarily unavailable." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Mistral API request failed", error);
    return NextResponse.json(
      { error: "The AI assistant is temporarily unavailable." },
      { status: 502 }
    );
  }
}
