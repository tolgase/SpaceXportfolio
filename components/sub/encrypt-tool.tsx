"use client";

import { useState } from "react";

const PBKDF2_ITERATIONS = 100_000;

function toBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(plainText: string, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plainText)
  );
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return toBase64(combined);
}

async function decryptText(payload: string, passphrase: string) {
  const combined = fromBase64(payload);
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const ciphertext = combined.slice(28);
  const key = await deriveKey(passphrase, salt);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  );
  return new TextDecoder().decode(plainBuffer);
}

// A real, reversible AES-256-GCM encryption demo (PBKDF2-derived key, random
// salt + IV per run) — everything runs client-side via the Web Crypto API,
// so a passphrase and plaintext never leave the browser.
export const EncryptTool = () => {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [passphrase, setPassphrase] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!input.trim() || !passphrase) return;
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const result =
        mode === "encrypt"
          ? await encryptText(input, passphrase)
          : await decryptText(input.trim(), passphrase);
      setOutput(result);
    } catch {
      setOutput("");
      setError(
        mode === "encrypt"
          ? "Couldn't encrypt that input."
          : "Wrong passphrase, or that text wasn't encrypted here."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore — output is still selectable/visible.
    }
  };

  return (
    <div className="liquid-glass w-full flex flex-col gap-3 rounded-2xl p-5 sm:p-6">
      <div className="relative z-[5] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">
          Live AES-256 encryption
        </h3>
        <div className="flex rounded-full border border-[var(--accent-border)] p-0.5 text-[11px]">
          {(["encrypt", "decrypt"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option);
                setOutput("");
                setError("");
              }}
              className={`px-3 py-1 rounded-full capitalize transition ${
                mode === option
                  ? "bg-[var(--accent-solid)] text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p className="relative z-[5] text-xs text-gray-500">
        AES-256-GCM with a PBKDF2-derived key, entirely in your browser —
        nothing here is sent to a server.
      </p>

      <div className="relative z-[5] flex flex-col gap-2">
        <input
          type="password"
          value={passphrase}
          onChange={(event) => setPassphrase(event.target.value)}
          placeholder="Passphrase"
          className="rounded-full border border-[var(--accent-border)] bg-white/5 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-[var(--accent-solid)] transition"
        />
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            mode === "encrypt"
              ? "Type text to encrypt..."
              : "Paste encrypted text to decrypt..."
          }
          rows={2}
          className="resize-none rounded-2xl border border-[var(--accent-border)] bg-white/5 px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-[var(--accent-solid)] transition"
        />
        <button
          type="button"
          onClick={handleRun}
          disabled={busy || !input.trim() || !passphrase}
          className="button-primary self-start rounded-full px-5 py-2 text-sm text-white transition disabled:opacity-40 capitalize"
        >
          {mode}
        </button>
      </div>

      {error && (
        <p className="relative z-[5] text-xs text-red-300">{error}</p>
      )}

      {output && (
        <button
          type="button"
          onClick={handleCopy}
          className="relative z-[5] text-left text-xs text-gray-400 break-all rounded-lg border border-[var(--accent-border)] bg-white/5 px-3 py-2 hover:text-gray-200 transition"
        >
          {output}
          <span className="block mt-1 text-[10px] text-[var(--accent-solid)]">
            {copied ? "Copied!" : "Click to copy"}
          </span>
        </button>
      )}
    </div>
  );
};
