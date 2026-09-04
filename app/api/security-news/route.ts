import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Re-fetch the feed at most every 30 minutes.
export const revalidate = 1800;

const MAX_ITEMS = 5;

// A couple of well-known cybersecurity RSS feeds — try in order and use the
// first one that responds, so a single feed outage doesn't take the widget
// down.
const FEED_URLS = [
  "https://feeds.feedburner.com/TheHackersNews",
  "https://www.bleepingcomputer.com/feed/",
];

type NewsItem = { title: string; link: string; pubDate: string };

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim();
}

function parseRss(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];

  for (const block of itemBlocks) {
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];

    if (title && link) {
      items.push({
        title: decodeEntities(title),
        link: decodeEntities(link),
        pubDate: pubDate ? decodeEntities(pubDate) : "",
      });
    }

    if (items.length >= MAX_ITEMS) break;
  }

  return items;
}

export async function GET() {
  for (const feedUrl of FEED_URLS) {
    try {
      const response = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
        next: { revalidate },
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const items = parseRss(xml);

      if (items.length > 0) {
        return NextResponse.json({ items });
      }
    } catch (error) {
      console.error("Security news fetch failed for", feedUrl, error);
    }
  }

  return NextResponse.json({ error: "No security feed available" }, { status: 502 });
}
