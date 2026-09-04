const PRACTICES = [
  {
    title: "Force HTTPS + HSTS",
    detail: "Redirect all traffic to TLS and send Strict-Transport-Security so browsers never fall back to plain HTTP.",
  },
  {
    title: "Hash passwords properly",
    detail: "Never store raw SHA-256 for passwords — use a slow, salted algorithm like bcrypt or Argon2 instead.",
  },
  {
    title: "Validate & sanitize input",
    detail: "Treat every request body, query param and upload as hostile; validate server-side, not just in the UI.",
  },
  {
    title: "Set strict security headers",
    detail: "Content-Security-Policy, X-Frame-Options and X-Content-Type-Options close off whole classes of attacks.",
  },
  {
    title: "Rate-limit & add 2FA",
    detail: "Throttle login/API endpoints and offer two-factor auth to blunt credential-stuffing and brute force.",
  },
  {
    title: "Patch dependencies often",
    detail: "Most breaches exploit a known, unpatched library — automate updates and watch CVE advisories.",
  },
  {
    title: "Back up, and test the restore",
    detail: "An untested backup is a hope, not a plan — schedule regular, encrypted backups and rehearse recovery.",
  },
] as const;

// Honest, evergreen security guidance — the kind of hardening Haroun applies
// to the production systems he builds — sitting next to the live news feed.
export const SecurityBestPractices = () => {
  return (
    <div className="liquid-glass w-full flex flex-col gap-3 rounded-2xl p-5 sm:p-6">
      <h3 className="relative z-[5] text-sm font-semibold text-gray-200">
        Best practices to protect your website
      </h3>
      <ul className="relative z-[5] flex flex-col gap-2.5">
        {PRACTICES.map((practice) => (
          <li key={practice.title} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-solid)]" />
            <p className="text-xs text-gray-400 leading-snug">
              <span className="text-gray-200 font-medium">{practice.title}</span>
              {" — "}
              {practice.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
