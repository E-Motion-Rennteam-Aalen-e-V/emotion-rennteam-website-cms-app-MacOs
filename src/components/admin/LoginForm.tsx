"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function HuskyMascot({ coveringEyes }: { coveringEyes: boolean }) {
  return (
    <div className="flex justify-center mb-1" aria-hidden>
      <svg
        viewBox="0 0 200 240"
        width="160"
        height="192"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Left ear */}
        <polygon points="42,100 26,40 66,70" fill="#22223a" />
        <polygon points="46,96 33,50 62,72" fill="#7a5a8c" />
        {/* Right ear */}
        <polygon points="158,100 174,40 134,70" fill="#22223a" />
        <polygon points="154,96 167,50 138,72" fill="#7a5a8c" />

        {/* Head */}
        <circle cx="100" cy="112" r="68" fill="#c8c8d8" />

        {/* Muzzle */}
        <ellipse cx="100" cy="128" rx="40" ry="32" fill="#eaeaf6" />

        {/* Eye whites */}
        <circle cx="76" cy="104" r="15" fill="white" />
        <circle cx="124" cy="104" r="15" fill="white" />

        {/* Iris */}
        <circle cx="76" cy="104" r="9" fill="#1e4fd8" />
        <circle cx="124" cy="104" r="9" fill="#1e4fd8" />

        {/* Eye shine */}
        <circle cx="79" cy="101" r="3" fill="white" />
        <circle cx="127" cy="101" r="3" fill="white" />

        {/* Nose */}
        <ellipse cx="100" cy="128" rx="9.5" ry="7" fill="#18182c" />
        <ellipse cx="97" cy="127" rx="2.8" ry="2" fill="#38385a" />

        {/* Mouth */}
        <path d="M88 140 Q100 152 112 140" stroke="#18182c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Body */}
        <ellipse cx="100" cy="194" rx="52" ry="36" fill="#c8c8d8" />

        {/* LEFT PAW - animates up to cover left eye */}
        <motion.g
          style={{ transformOrigin: "57px 190px" }}
          animate={
            coveringEyes
              ? { x: 22, y: -96, rotate: -18 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          {/* Arm */}
          <rect x="42" y="168" width="24" height="44" rx="12" fill="#c8c8d8" />
          {/* Paw top knuckles */}
          <circle cx="46" cy="168" r="9" fill="#c8c8d8" />
          <circle cx="57" cy="164" r="9" fill="#c8c8d8" />
          <circle cx="68" cy="168" r="9" fill="#c8c8d8" />
          {/* Paw base */}
          <ellipse cx="57" cy="204" rx="22" ry="15" fill="#c8c8d8" />
          {/* Paw pads */}
          <ellipse cx="57" cy="210" rx="12" ry="8" fill="#b4a0c0" />
          <circle cx="43" cy="197" r="5" fill="#b4a0c0" />
          <circle cx="57" cy="193" r="5" fill="#b4a0c0" />
          <circle cx="71" cy="197" r="5" fill="#b4a0c0" />
        </motion.g>

        {/* RIGHT PAW - animates up to cover right eye */}
        <motion.g
          style={{ transformOrigin: "149px 190px" }}
          animate={
            coveringEyes
              ? { x: -22, y: -96, rotate: 18 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          {/* Arm */}
          <rect x="134" y="168" width="24" height="44" rx="12" fill="#c8c8d8" />
          {/* Paw top knuckles */}
          <circle cx="138" cy="168" r="9" fill="#c8c8d8" />
          <circle cx="149" cy="164" r="9" fill="#c8c8d8" />
          <circle cx="160" cy="168" r="9" fill="#c8c8d8" />
          {/* Paw base */}
          <ellipse cx="149" cy="204" rx="22" ry="15" fill="#c8c8d8" />
          {/* Paw pads */}
          <ellipse cx="149" cy="210" rx="12" ry="8" fill="#b4a0c0" />
          <circle cx="135" cy="197" r="5" fill="#b4a0c0" />
          <circle cx="149" cy="193" r="5" fill="#b4a0c0" />
          <circle cx="163" cy="197" r="5" fill="#b4a0c0" />
        </motion.g>
      </svg>
    </div>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Anmeldung fehlgeschlagen.");
        setStatus("error");
        return;
      }
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Verbindung zum Server fehlgeschlagen.");
      setStatus("error");
    }
  }

  const coveringEyes = passwordFocused || password.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/60 via-accent-2/40 to-transparent opacity-60 blur-md"
      />
      <div className="relative rounded-2xl border border-border bg-surface/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <HuskyMascot coveringEyes={coveringEyes} />

        <div className="mb-8 flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-text">E-Motion Rennteam Aalen</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Redaktions-Login</h1>
          <p className="mt-1 text-sm text-muted">Melde dich an, um Inhalte der Website zu bearbeiten.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
              Benutzername
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Passwort
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "loading" ? "Anmelden…" : "Anmelden"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Zurück zur Website
          </Link>
          <span>Geschützter Bereich</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="relative w-full max-w-md h-64" />}>
      <LoginFormInner />
    </Suspense>
  );
}
