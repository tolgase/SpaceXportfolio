"use client";

import { useEffect, useState } from "react";

type NewsItem = { title: string; link: string; pubDate: string };

function formatDate(pubDate: string) {
  if (!pubDate) return "";
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Live cybersecurity headlines, fetched server-side (to avoid CORS/feed
// quirks) via /api/security-news and rendered as a short, linked list.
export const SecurityNews = () => {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/security-news")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="liquid-glass w-full flex flex-col gap-3 rounded-2xl p-5 sm:p-6">
      <h3 className="relative z-[5] text-sm font-semibold text-gray-200">
        Latest security news
      </h3>

      <div className="relative z-[5] flex flex-col gap-3">
        {!items && !failed && (
          <p className="text-xs text-gray-500">Loading live headlines…</p>
        )}
        {failed && (
          <p className="text-xs text-gray-500">
            Couldn&apos;t load live headlines right now — check back shortly.
          </p>
        )}
        {items?.map((item) => (
          <a
            key={item.link}
            href={item.link}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-start justify-between gap-3"
          >
            <span className="text-sm text-gray-300 leading-snug line-clamp-2 group-hover:text-[var(--accent-solid)] transition">
              {item.title}
            </span>
            {formatDate(item.pubDate) && (
              <span className="shrink-0 text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">
                {formatDate(item.pubDate)}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};
