"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Copies text to the clipboard and tracks a short-lived "copied" flag that
 * resets automatically after `resetDelayMs`. Shared by the security tools
 * (hash + encryption demos) so both copy buttons behave identically instead
 * of each re-implementing the same copied-state/timeout dance.
 */
export function useCopyToClipboard(resetDelayMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelayMs);
      } catch {
        // Clipboard API unavailable — silently ignore, the text is still
        // visible to select/copy manually.
      }
    },
    [resetDelayMs]
  );

  const reset = useCallback(() => setCopied(false), []);

  return { copied, copy, reset };
}
