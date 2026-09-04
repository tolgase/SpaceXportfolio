"use client";

import { useState } from "react";

const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

async function hashText(text: string, algorithm: Algorithm) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// A real, client-side hashing utility (Web Crypto API) — nothing typed here
// is sent anywhere. It's a small, honest demonstration of the security
// tooling Haroun builds into production systems, sitting alongside the
// portfolio's encryption/security section.
export const HashTool = () => {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleHash = async () => {
    if (!input.trim()) {
      setHash("");
      return;
    }
    setBusy(true);
    try {
      const result = await hashText(input, algorithm);
      setHash(result);
      setCopied(false);
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore, the hash is still
      // visible to select/copy manually.
    }
  };

  return (
    <div className="liquid-glass w-full flex flex-col gap-3 rounded-2xl p-5 sm:p-6">
      <h3 className="relative z-[5] text-sm font-semibold text-gray-200">
        Live hashing tool
      </h3>
      <p className="relative z-[5] text-xs text-gray-500">
        Runs entirely in your browser via the Web Crypto API — nothing you
        type here ever leaves your device.
      </p>

      <div className="relative z-[5] flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleHash();
          }}
          placeholder="Type or paste text to hash..."
          className="flex-1 min-w-0 rounded-full border border-[var(--accent-border)] bg-white/5 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-[var(--accent-solid)] transition"
        />
        <select
          value={algorithm}
          onChange={(event) => setAlgorithm(event.target.value as Algorithm)}
          aria-label="Hash algorithm"
          className="rounded-full border border-[var(--accent-border)] bg-[#0300147a] px-3 py-2 text-xs text-gray-200 outline-none cursor-pointer"
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleHash}
          disabled={busy || !input.trim()}
          className="button-primary rounded-full px-5 py-2 text-sm text-white transition disabled:opacity-40"
        >
          Hash
        </button>
      </div>

      {hash && (
        <button
          type="button"
          onClick={handleCopy}
          className="relative z-[5] text-left text-xs text-gray-400 break-all rounded-lg border border-[var(--accent-border)] bg-white/5 px-3 py-2 hover:text-gray-200 transition"
        >
          {hash}
          <span className="block mt-1 text-[10px] text-[var(--accent-solid)]">
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </button>
      )}
    </div>
  );
};
